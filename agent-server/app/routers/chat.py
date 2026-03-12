from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse
from google.genai import types
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
    return [{"role": "model" if m.role == "assistant" else m.role, "parts": [{"text": m.content}]} for m in messages]

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
                # Loop to handle multiple turns of tool execution if needed (e.g. search -> then action)
                for _ in range(3): # Max 3 turns to avoid loops
                    response = await gemini_chat(gemini_messages)
                    
                    if not hasattr(response, 'candidates'):
                        # String response
                        clean_text, cards = extract_menu_cards(response)
                        return {"content": clean_text, "menu_cards": cards}
                    
                    candidate = response.candidates[0]
                    tool_calls = []
                    search_call = None
                    
                    for part in candidate.content.parts:
                        if part.function_call:
                            if part.function_call.name == "search_menu_by_slug":
                                search_call = part.function_call
                            else:
                                tool_calls.append({
                                    "name": part.function_call.name,
                                    "args": part.function_call.args
                                })
                    
                    if search_call:
                        # Execute search and return to LLM
                        from app.services.gemini import search_menus
                        search_results = search_menus(search_call.args.get("keyword", ""))
                        
                        # Add tool call and response to history
                        gemini_messages.append(candidate.content)
                        gemini_messages.append(types.Content(
                            role="user",
                            parts=[types.Part(
                                function_response=types.FunctionResponse(
                                    name=search_call.name,
                                    response={"results": search_results}
                                )
                            )]
                        ))
                        continue # Re-invoke Gemini with search results
                    
                    if tool_calls:
                        # Return UI tools to frontend
                        # Collect text if present
                        text_parts = [p.text for p in candidate.content.parts if p.text]
                        content = " ".join(text_parts) if text_parts else "도구를 사용합니다."
                        clean_text, _ = extract_menu_cards(content) # Still clean markers if any
                        
                        return {
                            "content": clean_text,
                            "tool_calls": tool_calls # Return as list
                        }
                    
                    # No tools, just text
                    response_text = candidate.content.parts[0].text if candidate.content.parts else ""
                    clean_text, cards = extract_menu_cards(response_text)
                    return {"content": clean_text, "menu_cards": cards}

            except Exception as api_err:
                logger.error(f"Gemini API error: {api_err}", exc_info=True)
                raise HTTPException(status_code=502, detail="AI 서비스 응답 실패")

        # 스트리밍 모드
        async def event_generator():
            accumulated = ""
            current_messages = list(gemini_messages)
            
            try:
                for _ in range(3): # Max 3 turns
                    has_tool_call = False
                    is_search = False
                    
                    # We start streaming
                    async for token in chat_stream(current_messages):
                        if isinstance(token, dict) and "function_call" in token:
                            has_tool_call = True
                            fn = token["function_call"]
                            
                            if fn["name"] == "search_menu_by_slug":
                                is_search = True
                                # Execute search
                                from app.services.gemini import search_menus, types
                                search_results = search_menus(fn["args"].get("keyword", ""))
                                
                                # Add to history
                                # Note: chat_stream currently doesn't give us the full Assistant content part to put back in history easily
                                # We might need to adjust chat_stream to return the full part if we want to support multi-turn in stream
                                # For now, let's assume we can reconstruct it or just handle it.
                                
                                # Reconstruct Content part for history
                                assistant_content = types.Content(
                                    role="model",
                                    parts=[types.Part(
                                        function_call=types.FunctionCall(
                                            name=fn["name"],
                                            args=fn["args"]
                                        )
                                    )]
                                )
                                current_messages.append(assistant_content)
                                current_messages.append(types.Content(
                                    role="user",
                                    parts=[types.Part(
                                        function_response=types.FunctionResponse(
                                            name=fn["name"],
                                            response={"results": search_results}
                                        )
                                    )]
                                ))
                                break # Exit the current token stream to re-invoke
                            else:
                                # UI tool call - send to frontend
                                yield {"data": json.dumps({"function_call": fn}, ensure_ascii=False)}
                        else:
                            # Text token
                            accumulated += token
                            yield {"data": json.dumps({"content": token}, ensure_ascii=False)}
                    
                    if not is_search:
                        # If it wasn't a search turn that needs re-invocation, we are done
                        break
                
                # 답변 완료 후 메뉴 카드 정보 추출 및 전송
                if accumulated:
                    _, cards = extract_menu_cards(accumulated)
                    if cards:
                        yield {"data": json.dumps({"menu_cards": cards}, ensure_ascii=False)}
                
                yield {"data": "[DONE]"}
            except Exception as e:
                logger.error(f"Streaming error: {e}", exc_info=True)
                yield {"data": json.dumps({"error": "답변 생성 중 오류가 발생했습니다."}, ensure_ascii=False)}
                yield {"data": "[DONE]"}
            
        return EventSourceResponse(event_generator())

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in chat_endpoint: {e}")
        raise HTTPException(status_code=500, detail="서버 내부 오류가 발생했습니다.")
