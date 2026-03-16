from pydantic import BaseModel
from typing import List

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    user_id: str | None = None
    user_role: str | None = "GUEST"
    messages: List[Message]
    stream: bool = True
