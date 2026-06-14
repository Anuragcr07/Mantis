import asyncio
import os
from dotenv import load_dotenv
from inferedge_moss import MossClient, DocumentInfo, QueryOptions

load_dotenv()

client = MossClient(
    os.getenv("MOSS_PROJECT_ID"),
    os.getenv("MOSS_PROJECT_KEY")
)

async def index_to_moss(product_id: str, chunks: list):
    """Index chunks into MOSS after ChromaDB indexing."""
    docs = [
        DocumentInfo(id=f"{product_id}_{i}", text=chunk["text"])
        for i, chunk in enumerate(chunks)
    ]
    index_name = f"product-{product_id}"
    await client.create_index(index_name, docs, "moss-minilm")
    await client.load_index(index_name)
    return {"indexed": len(docs), "index": index_name}

async def query_moss(product_id: str, query: str, top_k: int = 5):
    """Fast semantic search via MOSS (<10ms)."""
    index_name = f"product-{product_id}"
    try:
        await client.load_index(index_name)
        results = await client.query(index_name, query, QueryOptions(top_k=top_k))
        return [{"id": doc.id, "text": doc.text, "score": doc.score} for doc in results.docs]
    except Exception as e:
        print(f"MOSS query error: {e}")
        return []

def query_moss_sync(product_id: str, query: str, top_k: int = 5):
    """Sync wrapper for FastAPI endpoints"""
    return asyncio.run(query_moss(product_id, query, top_k))