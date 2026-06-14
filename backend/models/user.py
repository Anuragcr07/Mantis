from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    user_id: str
    email: str
    name: str
    company_id: Optional[str] = None
    role: str = "customer"  # "customer" or "company"