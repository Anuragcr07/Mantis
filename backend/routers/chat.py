from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from services.agent_service import run_agent

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/{product_id}")
async def chat(
    product_id: str,
    user_id: str = Form(...),
    query: str = Form(...),
    conversation_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    image_bytes = await image.read() if image else None
    result = await run_agent(
        product_id=product_id,
        user_id=user_id,
        query=query,
        conversation_id=conversation_id,
        image_bytes=image_bytes
    )
    return result