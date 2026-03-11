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

def build_rag_prompt(query: str, context: str, menu_data: list = None) -> str:
    """
    지식 검색 결과와 메뉴 정보를 결합하여 프롬프트를 생성합니다.
    """
    no_knowledge_msg = "죄송합니다. 그 부분은 제가 아직 학습하지 못한 내용이라 정확한 안내가 어렵습니다. 매장으로 직접 문의 부탁드립니다."
    
    # 메뉴 정보를 텍스트로 변환
    menu_list_text = ""
    if menu_data:
        menu_list_text = "\n[카페 메뉴 목록]\n" + "\n".join([
            f"- {m.get('korName')} ({m.get('price')}원): {m.get('description')}" 
            for m in menu_data
        ])

    # 지식과 메뉴를 합침
    combined_knowledge = context if context else ""
    if menu_list_text:
        combined_knowledge += "\n" + menu_list_text

    if not combined_knowledge.strip():
        return f"사용자의 질문: {query}\n\n시스템 지침: 지식이 없으므로 다음 문구로만 답하세요: {no_knowledge_msg}"
        
    prompt = f"""당신은 '엔카페(ncafe)'의 지혜로운 선비이자 중매쟁이 '월하선생'입니다. 
아래의 **[제공된 지식]**을 바탕으로 사용자의 질문에 답변해 주세요.
사용자의 질문에 대해 반드시 [제공된 지식]을 바탕으로 상세하고 완성된 문장으로 답변해주세요.

**[제공된 지식]**
{combined_knowledge}

**[답변 규칙]**
1. 반드시 제공된 지식에 근거해서만 답변하세요. 억측이나 거짓말은 절대 금지입니다.
2. 메뉴 추천 시에는 '메뉴 목록'에 있는 메뉴를 1~2가지 추천하세요.
3. 만약 질문에 관련된 지식이 [제공된 지식]에 없다면, 반드시 다음 문구로만 대답하세요:
   "{no_knowledge_msg}"
4. 말투는 엔카페의 고즈넉한 분위기에 맞게 따뜻하고 친절하며 다정한 '월하선생'의 말투를 사용하세요. (~하구려, ~이지요 등)
5. 답변은 1~2문장으로 친절하게 하되 필요한 정보를 정확히 포함하세요.

[사용자 질문]
{query}

답변:"""
    return prompt
