from pydantic import BaseModel
from typing import List

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    user_id: str | None = None
    messages: List[Message]
    stream: bool = True
