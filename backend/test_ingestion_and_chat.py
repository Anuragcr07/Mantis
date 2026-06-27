import asyncio
import os
import sys

# Add backend directory to sys.path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.pdf_service import extract_and_chunk
from services.chroma_service import index_chunks, get_collection_stats, query_knowledge
from services.agent_service import run_agent

async def test_flow():
    pdf_path = "c:\\moss-hack\\Mantis\\mitsubishi_manual.pdf"
    product_id = "ac"
    
    print("1. Extracting and chunking manual...")
    chunks = extract_and_chunk(pdf_path, product_id)
    print(f"Extracted {len(chunks)} chunks.")
    
    print("\n2. Indexing chunks into ChromaDB...")
    result = index_chunks(product_id, chunks)
    print(f"Indexed result: {result}")
    
    stats = get_collection_stats(product_id)
    print(f"Total chunks in collection: {stats}")
    
    print("\n3. Testing retrieval...")
    retrieved = query_knowledge(product_id, "TIMER light flashing 1 time", n_results=2)
    print(f"Retrieved {len(retrieved)} relevant chunks:")
    for r in retrieved:
        print(f"- Page {r['metadata'].get('page')}: {r['text'][:150]}...")
        
    print("\n4. Testing chatbot diagnosis...")
    query = "My AC has TIMER light flashing 1 time. What does it mean and what is the cause?"
    response = await run_agent(
        product_id=product_id,
        user_id="test_user_001",
        query=query
    )
    print("\nChatbot Response:")
    print("==================================================")
    print(response["answer"])
    print("==================================================")
    print("\nSources Cited:")
    for source in response["sources"]:
        print(f"- Page {source['metadata'].get('page')}: {source['text']}")

if __name__ == "__main__":
    asyncio.run(test_flow())
