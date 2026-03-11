from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.services.db_service import get_db
from app.models.knowledge import Knowledge
from app.services.embedding_service import embedding_service

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

class KnowledgeCreate(BaseModel):
    content: str

class KnowledgeResponse(BaseModel):
    id: int
    content: str
    embedding: List[float]

    class Config:
        from_attributes = True

class KnowledgeSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class KnowledgeSearchResponse(BaseModel):
    id: int
    content: str
    distance: float

@router.post("/", response_model=KnowledgeResponse)
async def create_knowledge(knowledge_in: KnowledgeCreate, db: Session = Depends(get_db)):
    """ 임베딩을 생성하고 지식을 저장합니다. 원본 텍스트(content)를 함께 저장하고 반환합니다. """
    # Create embedding (uses "passage: " prefix internally)
    embedding = embedding_service.get_embedding(knowledge_in.content, is_query=False)
    
    # Save to database
    db_knowledge = Knowledge(
        content=knowledge_in.content,
        embedding=embedding
    )
    db.add(db_knowledge)
    db.commit()
    db.refresh(db_knowledge)
    
    return db_knowledge

@router.post("/upload", response_model=List[KnowledgeResponse])
async def upload_knowledge_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """ .txt 파일을 업로드하여 내용을 지식으로 등록합니다. """
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Only .txt files are supported")
    
    try:
        contents = await file.read()
        text = contents.decode('utf-8')
        
        # Simple chunking by double newline for now (optional enhancement later)
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        if not paragraphs:
            # If no double newlines, try single newlines or just the whole text
            paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
        
        if not paragraphs:
            paragraphs = [text.strip()] if text.strip() else []

        results = []
        for p in paragraphs:
            embedding = embedding_service.get_embedding(p, is_query=False)
            db_knowledge = Knowledge(content=p, embedding=embedding)
            db.add(db_knowledge)
            results.append(db_knowledge)
        
        db.commit()
        for r in results:
            db.refresh(r)
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@router.get("/", response_model=List[KnowledgeResponse])
async def list_knowledge(db: Session = Depends(get_db)):
    """ 저장된 모든 지식 목록(ID, 원본 텍스트, 벡터)을 가져옵니다. """
    return db.query(Knowledge).all()

@router.post("/search", response_model=List[KnowledgeSearchResponse])
async def search_knowledge(search_in: KnowledgeSearchRequest, db: Session = Depends(get_db)):
    """ 
    사용자 질문과 가장 유사한 지식을 검색합니다. 
    질문에는 "query: " 접두사를 붙여 임베딩합니다.
    """
    # Create query embedding (uses "query: " prefix internally)
    query_embedding = embedding_service.get_embedding(search_in.query, is_query=True)
    
    # Perform similarity search using cosine distance (<=> operator in pgvector)
    # distance is (1 - cosine similarity)
    results = db.query(
        Knowledge.id,
        Knowledge.content,
        Knowledge.embedding.cosine_distance(query_embedding).label("distance")
    ).order_by("distance").limit(search_in.top_k).all()
    
    return results

@router.delete("/{knowledge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge(knowledge_id: int, db: Session = Depends(get_db)):
    """ 특정 지식을 ID 기반으로 삭제합니다. """
    db_knowledge = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not db_knowledge:
        raise HTTPException(status_code=404, detail="Knowledge not found")
    
    db.delete(db_knowledge)
    db.commit()
    return None
