from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    image_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Conversation(BaseModel):
    conversation_id: str
    product_id: str
    user_id: str
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)