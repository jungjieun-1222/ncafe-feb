from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.knowledge import Knowledge
from app.services.embedding_service import embedding_service
import logging

logger = logging.getLogger(__name__)

async def get_relevant_context(query: str, db: Session, top_k: int = 3, threshold: float = 0.3) -> str:
    """
    사용자의 질문과 관련된 지식을 추출하여 컨텍스트 문자열로 반환합니다.
    
    1. 질문 임베딩 생성 (query: 접두사 포함)
    2. pgvector를 사용한 코사인 유사도 검색 (상위 N개)
    3. 임계값(threshold) 이하의 거리(높은 유사도)만 필터링
    4. 결과를 하나의 텍스트로 합침
    """
    try:
        # 1. 생성된 벡터 추출 (embedding_service에서 "query: " 접두사 자동 처리)
        query_embedding = embedding_service.get_embedding(query, is_query=True)
        
        # 2. pgvector 코사인 거리(<=>) 기반 검색
        # distance = 1 - cosine_similarity
        results = db.query(
            Knowledge.content,
            Knowledge.embedding.cosine_distance(query_embedding).label("distance")
        ).order_by("distance").limit(top_k).all()
        
        # 3. 임계값(0.3) 이하인 유효 지식만 추출
        relevant_contents = [
            row.content for row in results if row.distance <= threshold
        ]
        
        if not relevant_contents:
            logger.info(f"No relevant knowledge found for query: {query} (threshold: {threshold})")
            return ""
            
        # 4. 검색된 지식들을 하나의 컨텍스트로 묶음
        context = "\n".join([f"- {content}" for content in relevant_contents])
        return context
        
    except Exception as e:
        logger.error(f"Error while retrieving context: {e}")
        return ""

def build_rag_prompt(query: str, context: str, user_role: str = "GUEST", menu_data: list = None) -> str:
    """
    지식 검색 결과와 메뉴 정보를 결합하여 프롬프트를 생성합니다.
    """
    no_knowledge_msg = "그 부분은 제가 아직 학습하지 못한 내용이라 정확한 안내가 어렵구려. 매장으로 직접 문의해주시면 성심껏 답해드리겠소."
    
    # 메뉴 정보를 텍스트로 변환 (슬러그 포함)
    menu_list_text = ""
    if menu_data:
        menu_list_text = "\n[카페 메뉴 목록]\n" + "\n".join([
            f"- {m.get('korName')} (슬러그: {m.get('slug')}, 가격: {m.get('price')}원): {m.get('description')}" 
            for m in menu_data
        ])

    # 지식과 메뉴를 합침
    combined_knowledge = context if context else ""
    if menu_list_text:
        combined_knowledge += "\n" + menu_list_text

    # 사용자 역할에 따른 지침
    role_instruction = ""
    if user_role == "GUEST":
        role_instruction = "현재 사용자는 '비회원'이오. 대화 중간에 로그인을 하면 장바구니가 더 오래 유지된다는 점을 월하선생의 다정함으로 넌지시 알려주시오."
    elif user_role == "ADMIN" or "ADMIN" in user_role:
        role_instruction = "현재 사용자는 '관리자'이오. 예우를 갖추어 대하되, 운영에 필요한 사항을 물으면 아는 대로 답하시오."
    else:
        role_instruction = "현재 사용자는 로그인한 '회원'이오. 소중한 단골 손님으로 대접하시오."

    prompt = f"""아래의 **[제공된 지식]**을 바탕으로 사용자의 질문에 답변해 주시오.
제공된 지식에 없는 내용은 억측하지 말고, 모르는 내용이라면 자연스럽게 "{no_knowledge_msg}"라고 답하시오.

**[사용자 정보]**
- 역할: {user_role}
- 안내 사항: {role_instruction}

**[제공된 지식]**
{combined_knowledge if combined_knowledge.strip() else "제공된 정보가 없소."}

**[추가 지침]**
1. 사용자가 메뉴를 찾으면 메뉴 목록에 있는 정확한 '슬러그'를 사용하여 상세 페이지(/menus/슬러그)로 안내하시오.
2. "이거"라고 지칭할 때는 이전 맥락에서 언급된 메뉴의 슬러그를 추정하시오.
3. 답변은 중매쟁이 월하선생의 말투로 정겹게 하시오.

[사용자 질문]
{query}

답변:"""
    return prompt
