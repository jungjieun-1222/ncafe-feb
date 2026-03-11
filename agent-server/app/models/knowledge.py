from sqlalchemy import Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Knowledge(Base):
    __tablename__ = "knowledge"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    # Dimension matches multilingual-e5-small: 384
    embedding = Column(Vector(384))
