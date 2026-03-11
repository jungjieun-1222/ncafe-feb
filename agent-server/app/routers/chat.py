from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import ChatRequest, Message
from app.services.gemini import chat as gemini_chat, chat_stream
from app.services.menu_service import get_menu_by_name
from app.services.db_service import get_db
from app.services.rag_service import get_relevant_context, build_rag_prompt
from typing import List
import json
import re
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def to_gemini_messages(messages: List[Message]):
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

def extract_menu_cards(text: str):
    """Extract <<MENU:메뉴이름>> markers and return menu card data."""
    pattern = r'<<MENU:(.*?)>>'
    menu_names = re.findall(pattern, text)
    
    cards = []
    for name in menu_names:
        menu = get_menu_by_name(name.strip())
        if menu:
            cards.append({
                "name": menu.get("korName", name),
                "price": menu.get("price", 0),
                "imageSrc": menu.get("imageSrc", ""),
                "description": menu.get("description", ""),
                "categoryName": menu.get("categoryName", ""),
            })
    
    clean_text = re.sub(pattern, lambda m: m.group(1), text)
    return clean_text, cards

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    사용자의 질문을 받아 RAG 기반으로 답변을 생성하는 엔드포인트입니다.
    1. 지식 베이스 검색 (RAG 1단계)
    2. 프롬프트 구성 (RAG 2단계)
    3. Gemini API 호출
    """
    try:
        if not request.messages:
            raise HTTPException(status_code=400, detail="Messages cannot be empty")

        # 마지막 사용자 질문 추출
        last_user_message = next((m.content for m in reversed(request.messages) if m.role == "user"), None)
        
        if not last_user_message:
            raise HTTPException(status_code=400, detail="No user message found to process")

        # 1. RAG 지식 검색 (코사인 유사도 상위 3개, threshold 0.3)
        try:
            context = await get_relevant_context(last_user_message, db)
        except Exception as db_err:
            logger.error(f"Database/RAG search error: {db_err}")
            context = "" # DB 오류 시 지식 없이 진행 (폴백)

        # 2. 시스템 프롬프트 및 지식 기반 프롬프트 생성 (RAG 데이터 포함)
        from app.services.gemini import MENU_DATA
        rag_prompt = build_rag_prompt(last_user_message, context, menu_data=MENU_DATA)
        
        # 마지막 메시지를 RAG 프롬프트로 교체
        gemini_messages = to_gemini_messages(request.messages)
        for i in range(len(gemini_messages) - 1, -1, -1):
            if gemini_messages[i]["role"] == "user":
                gemini_messages[i]["parts"][0]["text"] = rag_prompt
                break

        if not request.stream:
            try:
                response_text = await gemini_chat(gemini_messages) # 기본 system_instruction 사용
                clean_text, cards = extract_menu_cards(response_text)
                return {"content": clean_text, "menu_cards": cards}
            except Exception as api_err:
                logger.error(f"Gemini API error: {api_err}")
                raise HTTPException(status_code=502, detail="AI 서비스 응답 실패")

        # 스트리밍 모드
        async def event_generator():
            accumulated = ""
            try:
                async for token in chat_stream(gemini_messages):
                    accumulated += token
                    # UI에는 원래 텍스트를 보내되 마커 부분만 클라이언트가 처리하도록 함 (성능/안정성 위함)
                    # 서버에서 섣부르게 replace하면 멀티바이트 문자나 토큰이 깨질 수 있음
                    yield {"data": json.dumps({"content": token}, ensure_ascii=False)}
                
                # 답변 완료 후 메뉴 카드 정보 추출 및 전송
                _, cards = extract_menu_cards(accumulated)
                if cards:
                    yield {"data": json.dumps({"menu_cards": cards}, ensure_ascii=False)}
                
                yield {"data": "[DONE]"}
            except Exception as e:
                logger.error(f"Streaming error: {e}")
                yield {"data": json.dumps({"error": "답변 생성 중 오류가 발생했습니다."}, ensure_ascii=False)}
                yield {"data": "[DONE]"}
            
        return EventSourceResponse(event_generator())

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in chat_endpoint: {e}")
        raise HTTPException(status_code=500, detail="서버 내부 오류가 발생했습니다.")
