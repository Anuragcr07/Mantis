import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.pdf_service import extract_and_chunk
from services.chroma_service import index_chunks, get_collection_stats, query_knowledge, delete_product_index
from services.agent_service import run_agent

async def run_reset():
    product_id = "ac"
    pdf_path = "c:\\moss-hack\\Mantis\\mitsubishi_manual.pdf"
    
    print("1. Deleting old index...")
    del_res = delete_product_index(product_id)
    print(f"Delete result: {del_res}")
    
    print("\n2. Ingesting manual once...")
    chunks = extract_and_chunk(pdf_path, product_id)
    print(f"Extracted {len(chunks)} chunks.")
    result = index_chunks(product_id, chunks)
    print(f"Indexed result: {result}")
    
    stats = get_collection_stats(product_id)
    print(f"Collection stats: {stats}")
    
    print("\n3. Testing retrieval...")
    query = "My AC has TIMER light ON and it flashes 1 time. What does it mean?"
    retrieved = query_knowledge(product_id, query, n_results=4)
    print(f"Retrieved {len(retrieved)} chunks:")
    for i, r in enumerate(retrieved):
        print(f"Chunk {i} (Page {r['metadata'].get('page')}): {r['text'][:150]}...")
        
    print("\n4. Testing chatbot diagnosis response...")
    response = await run_agent(product_id, "test_user", query)
    print("\nResponse:")
    print("==================================================")
    print(response["answer"])
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_reset())
