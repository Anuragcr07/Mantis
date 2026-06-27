import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.chroma_service import query_knowledge
from services.agent_service import run_agent

async def debug():
    product_id = "ac"
    query = "My AC has TIMER light ON and it flashes 1 time. What does it mean?"
    
    print("--- ChromaDB Retrieval ---")
    retrieved = query_knowledge(product_id, query, n_results=4)
    for i, r in enumerate(retrieved):
        print(f"Chunk {i} (Page {r['metadata'].get('page')}):")
        print(r['text'])
        print("-" * 50)
        
    print("\n--- Running Agent ---")
    response = await run_agent(product_id, "debug_user", query)
    print("\nAnswer:")
    print(response["answer"])

if __name__ == "__main__":
    asyncio.run(debug())
