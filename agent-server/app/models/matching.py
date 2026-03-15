from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ARRAY, ForeignKey
from app.models.base import Base
import datetime

class InyeonCard(Base):
    __tablename__ = "inyeon_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, unique=True)
    interests = Column(ARRAY(String), nullable=False)
    mood = Column(String, nullable=False)
    greeting = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(String, nullable=False)
    receiver_id = Column(String, nullable=False)
    match_score = Column(Integer)
    status = Column(String, default="PENDING") # PENDING, ACCEPTED, DECLINED
    ai_message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    responded_at = Column(DateTime)
