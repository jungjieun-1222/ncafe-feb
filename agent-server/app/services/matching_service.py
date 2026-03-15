from sqlalchemy.orm import Session
from app.models.matching import InyeonCard, Match
from typing import List, Optional
import random
import datetime

# 기분 궁합 매트릭스 (Blueprint 기반)
# 설렘, 여유로운 오후, 심심타파, 영감 찾는 중, 위로 필요
MOOD_SCORES = {
    "설렘": {"설렘": 90, "여유": 70, "심심": 80, "영감": 60, "위로": 40},
    "여유": {"설렘": 70, "여유": 85, "심심": 75, "영감": 80, "위로": 70},
    "심심": {"설렘": 80, "여유": 75, "심심": 70, "영감": 50, "위로": 60},
    "영감": {"설렘": 60, "여유": 80, "심심": 50, "영감": 95, "위로": 65},
    "위로": {"설렘": 40, "여유": 70, "심심": 60, "영감": 65, "위로": 50},
}

def create_or_update_inyeon_card(db: Session, user_id: str, interests: List[str], mood: str, greeting: str):
    card = db.query(InyeonCard).filter(InyeonCard.user_id == user_id).first()
    if not card:
        card = InyeonCard(user_id=user_id)
        db.add(card)
    
    card.interests = interests
    card.mood = mood
    card.greeting = greeting
    card.is_active = True
    card.updated_at = datetime.datetime.utcnow()
    
    db.commit()
    db.refresh(card)
    return card

def find_top_matches(db: Session, user_id: str, limit: int = 1):
    user_card = db.query(InyeonCard).filter(InyeonCard.user_id == user_id).first()
    if not user_card:
        return []
    
    # 다른 활성화된 카드 조회
    others = db.query(InyeonCard).filter(
        InyeonCard.user_id != user_id,
        InyeonCard.is_active == True
    ).all()
    
    scored_matches = []
    for other in others:
        # 1. 관심사 유사도 (40%)
        common_interests = set(user_card.interests) & set(other.interests)
        interest_score = (len(common_interests) / max(len(user_card.interests), len(other.interests))) * 100 if user_card.interests and other.interests else 0
        
        # 2. 기분 궁합 (30%)
        # 매트릭스 키 정규화 (blueprint 키와 일치시키기)
        u_mood = "여유" if "여유" in user_card.mood else user_card.mood[:2]
        o_mood = "여유" if "여유" in other.mood else other.mood[:2]
        mood_score = MOOD_SCORES.get(u_mood, {}).get(o_mood, 50)
        
        # 3. 랜덤 보너스 (10%)
        random_score = random.randint(0, 100)
        
        # 총점 계산
        total_score = (interest_score * 0.4) + (mood_score * 0.3) + (random_score * 0.1)
        
        scored_matches.append({
            "card": other,
            "score": int(total_score)
        })
    
    # 점수 높은 순으로 정렬
    scored_matches.sort(key=lambda x: x["score"], reverse=True)
    return scored_matches[:limit]

def create_match_attempt(db: Session, requester_id: str, receiver_id: str, score: int, ai_message: str):
    match = Match(
        requester_id=requester_id,
        receiver_id=receiver_id,
        match_score=score,
        ai_message=ai_message,
        status="PENDING"
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return match
