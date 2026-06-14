from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client["mantis"]
conversations_col = db["conversations"]

async def create_conversation(conversation_id: str, product_id: str, user_id: str):
    doc = {
        "conversation_id": conversation_id,
        "product_id": product_id,
        "user_id": user_id,
        "messages": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await conversations_col.insert_one(doc)
    return doc

async def add_message(conversation_id: str, role: str, content: str, image_url: str = None):
    message = {
        "role": role,
        "content": content,
        "image_url": image_url,
        "timestamp": datetime.utcnow()
    }
    await conversations_col.update_one(
        {"conversation_id": conversation_id},
        {
            "$push": {"messages": message},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    return message

async def get_conversation(conversation_id: str):
    return await conversations_col.find_one(
        {"conversation_id": conversation_id},
        {"_id": 0}
    )

async def get_conversation_history(conversation_id: str) -> list:
    conv = await get_conversation(conversation_id)
    if not conv:
        return []
    return conv.get("messages", [])