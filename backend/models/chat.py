from pydantic import BaseModel
from typing import Optional, List

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    image_url: Optional[str] = None

class ChatRequest(BaseModel):
    product_id: str
    user_id: str
    query: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    sources: List[dict]