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
                "slug": menu.get("slug", ""),
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
        user_role = request.user_role or "GUEST"
        rag_prompt = build_rag_prompt(last_user_message, context, user_role=user_role, menu_data=MENU_DATA)
        
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
                    internal_tool_call = None
                    external_tool_calls = []
                    
                    for part in candidate.content.parts:
                        if part.function_call:
                            fn = part.function_call
                            if fn.name in ["search_menu_by_slug", "find_match", "create_inyeon_card", "respond_match"]:
                                internal_tool_call = fn
                                break # Only handle one internal tool at a time for simplicity
                            else:
                                external_tool_calls.append({
                                    "name": fn.name,
                                    "args": fn.args
                                })
                    
                    if internal_tool_call:
                        # Execute internal tool
                        fn = internal_tool_call
                        tool_response = None
                        
                        if fn.name == "search_menu_by_slug":
                            from app.services.gemini import search_menus
                            tool_response = {"results": search_menus(fn.args.get("keyword", ""))}
                        elif fn.name == "create_inyeon_card" and request.user_id:
                            from app.services.matching_service import create_or_update_inyeon_card
                            create_or_update_inyeon_card(db, request.user_id, fn.args.get("interests", []), fn.args.get("mood", ""), fn.args.get("greeting", ""))
                            tool_response = {"status": "success", "message": "인연 카드가 등록되었소."}
                        elif fn.name == "find_match" and request.user_id:
                            from app.services.matching_service import find_top_matches, create_match_attempt
                            matches = find_top_matches(db, request.user_id)
                            if matches:
                                m = matches[0] # Top 1
                                other = m["card"]
                                # Create a pending match record
                                create_match_attempt(db, request.user_id, other.user_id, m["score"], "")
                                tool_response = {
                                    "found": True,
                                    "match_id": other.user_id, # Using user_id as identifier for now
                                    "nickname": f"손님_{other.user_id[:4]}",
                                    "interests": other.interests,
                                    "mood": other.mood,
                                    "greeting": other.greeting,
                                    "match_score": m["score"]
                                }
                            else:
                                tool_response = {"found": False, "message": "아직 어울리는 인연을 찾지 못했소."}
                        elif fn.name == "respond_match" and request.user_id:
                            # Placeholder logic: in real app we update the Match record
                            tool_response = {"status": "success", "action": fn.args.get("action")}

                        if tool_response:
                            # Add tool call and response to history
                            gemini_messages.append(candidate.content)
                            gemini_messages.append(types.Content(
                                role="user",
                                parts=[types.Part(
                                    function_response=types.FunctionResponse(
                                        name=fn.name,
                                        response=tool_response
                                    )
                                )]
                            ))
                            continue # Re-invoke Gemini
                    
                    if external_tool_calls:
                        # Return UI tools to frontend (add_to_cart, Maps_to)
                        text_parts = [p.text for p in candidate.content.parts if p.text]
                        content = " ".join(text_parts) if text_parts else "도구를 사용합니다."
                        clean_text, _ = extract_menu_cards(content)
                        return {
                            "content": clean_text,
                            "tool_calls": external_tool_calls
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
                            fn = token["function_call"]
                            
                            # Internal tools list
                            internal_tools = ["search_menu_by_slug", "find_match", "create_inyeon_card", "respond_match"]
                            
                            if fn["name"] in internal_tools:
                                has_tool_call = True
                                is_internal = True
                                
                                # Execute internal tool
                                tool_response = None
                                if fn["name"] == "search_menu_by_slug":
                                    from app.services.gemini import search_menus
                                    tool_response = {"results": search_menus(fn["args"].get("keyword", ""))}
                                elif fn["name"] == "create_inyeon_card" and request.user_id:
                                    from app.services.matching_service import create_or_update_inyeon_card
                                    create_or_update_inyeon_card(db, request.user_id, fn["args"].get("interests", []), fn["args"].get("mood", ""), fn["args"].get("greeting", ""))
                                    tool_response = {"status": "success", "message": "인연 카드가 등록되었소."}
                                elif fn["name"] == "find_match" and request.user_id:
                                    from app.services.matching_service import find_top_matches, create_match_attempt
                                    matches = find_top_matches(db, request.user_id)
                                    if matches:
                                        m = matches[0]
                                        other = m["card"]
                                        create_match_attempt(db, request.user_id, other.user_id, m["score"], "")
                                        tool_response = {
                                            "found": True,
                                            "match_id": other.user_id,
                                            "nickname": f"손님_{other.user_id[:4]}",
                                            "interests": other.interests,
                                            "mood": other.mood,
                                            "greeting": other.greeting,
                                            "match_score": m["score"]
                                        }
                                    else:
                                        tool_response = {"found": False, "message": "아직 어울리는 인연을 찾지 못했소."}
                                elif fn["name"] == "respond_match" and request.user_id:
                                    tool_response = {"status": "success", "action": fn["args"].get("action")}

                                if tool_response:
                                    # Add to history and re-invoke
                                    from google.genai import types
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
                                                response=tool_response
                                            )
                                        )]
                                    ))
                                    break # Exit stream to restart with tool response
                            else:
                                # UI tool call - send to frontend (add_to_cart, Maps_to)
                                yield {"data": json.dumps({"function_call": fn}, ensure_ascii=False)}
                        else:
                            # Text token
                            accumulated += token
                            yield {"data": json.dumps({"content": token}, ensure_ascii=False)}
                    
                    if not has_tool_call or not locals().get('is_internal', False):
                        # If no internal tool was called, we are finished
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
