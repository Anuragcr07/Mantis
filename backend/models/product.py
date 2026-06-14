from pydantic import BaseModel
from typing import Optional, List

class Product(BaseModel):
    product_id: str
    name: str
    category: str  # "ac", "washing_machine", "monitor"
    brand: str
    description: Optional[str] = None
    manual_uploaded: bool = False
    company_id: str