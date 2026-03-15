from app.models.base import Base
from sqlalchemy import Column, Integer, Text
from pgvector.sqlalchemy import Vector


class Knowledge(Base):
    __tablename__ = "knowledge"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    # Dimension matches multilingual-e5-small: 384
    embedding = Column(Vector(384))
