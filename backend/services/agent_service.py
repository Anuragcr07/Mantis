from services.chroma_service import query_knowledge
from services.moss_service import query_moss
from services.llm_service import build_messages
from services.grok_service import call_grok
from services.db_service import (
    get_conversation_history,
    add_message,
    create_conversation,
    get_conversation
)
import uuid

async def run_agent(
    product_id: str,
    user_id: str,
    query: str,
    conversation_id: str = None,
    image_bytes: bytes = None
) -> dict:

    # Create or verify conversation
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        await create_conversation(conversation_id, product_id, user_id)
    else:
        existing = await get_conversation(conversation_id)
        if not existing:
            await create_conversation(conversation_id, product_id, user_id)

    # 1. ChromaDB chunks
    chroma_chunks = query_knowledge(product_id, query, n_results=8)

    # 2. MOSS chunks — safe handling
    try:
        moss_raw = await query_moss(product_id, query, top_k=3)
        moss_chunks = [
            {"text": r["text"], "metadata": {"source": "moss"}}
            for r in moss_raw
            if r.get("text")
        ]
    except Exception:
        moss_chunks = []

    # 3. Merge + deduplicate
    seen = set()
    all_chunks = []
    for chunk in chroma_chunks + moss_chunks:
        if chunk["text"] not in seen:
            seen.add(chunk["text"])
            all_chunks.append(chunk)

    # 4. Conversation history
    history = await get_conversation_history(conversation_id)

    # 5. Build messages
    messages = build_messages(query, history, all_chunks)

    # 6. Call Grok/Groq — passes image_bytes
    # grok_service handles routing:
    # image_bytes=None  → Groq (llama, fast)
    # image_bytes=data  → Grok-3 Vision (xAI)
    answer = await call_grok(messages, image_bytes)

    # 7. Save to MongoDB
    await add_message(conversation_id, "user", query,
                      image_url="image_provided" if image_bytes else None)
    await add_message(conversation_id, "assistant", answer)

    return {
        "conversation_id": conversation_id,
        "answer": answer,
        "sources": [
            {
                "text": c["text"][:100] + "...",
                "metadata": c.get("metadata", {})
            }
            for c in chroma_chunks
        ]
    }