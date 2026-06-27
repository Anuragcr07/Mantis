import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

# moss_service.py - MOSS disabled, using ChromaDB only

async def index_to_moss(product_id: str, chunks: list):
    """MOSS disabled"""
    return {"indexed": 0, "skipped": True}

async def query_moss(product_id: str, query: str, top_k: int = 5):
    """MOSS disabled - returning empty list, ChromaDB handles search"""
    return []

def query_moss_sync(product_id: str, query: str, top_k: int = 5):
    """Sync wrapper for FastAPI endpoints"""
    return asyncio.run(query_moss(product_id, query, top_k))