import chromadb
import os

# Persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path="./maintenance_db")

def get_collection(product_id: str):
    """Each product gets its own collection"""
    return chroma_client.get_or_create_collection(
        name=f"product_{product_id}",
        metadata={"hnsw:space": "cosine"}  # cosine similarity = better semantic search
    )

def index_chunks(product_id: str, chunks: list) -> dict:
    """
    chunks = [{ "text": "...", "metadata": { "page": 1, "source_type": "pdf", ... } }]
    """
    collection = get_collection(product_id)
    
    documents = []
    metadatas = []
    ids = []
    
    for i, chunk in enumerate(chunks):
        documents.append(chunk["text"])
        metadatas.append(chunk["metadata"])
        ids.append(f"{product_id}_chunk_{i}_{os.urandom(2).hex()}")
    
    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )
    
    return {"indexed": len(chunks), "product_id": product_id}

def query_knowledge(product_id: str, query: str, n_results: int = 4) -> list:
    """
    Returns top N relevant chunks for a query.
    Used by gemini_service.py to build context.
    """
    collection = get_collection(product_id)
    
    # check if collection has data
    if collection.count() == 0:
        return []
    
    results = collection.query(
        query_texts=[query],
        n_results=min(n_results, collection.count())
    )
    
    docs = results["documents"][0] if results["documents"] else []
    metas = results["metadatas"][0] if results["metadatas"] else []
    ids = results["ids"][0] if results["ids"] else []
    
    return [
        {
            "chunk_id": ids[i],
            "text": docs[i],
            "metadata": metas[i]
        }
        for i in range(len(docs))
    ]

def delete_product_index(product_id: str) -> dict:
    """Called when a company deletes a product"""
    try:
        chroma_client.delete_collection(name=f"product_{product_id}")
        return {"deleted": True, "product_id": product_id}
    except Exception as e:
        return {"deleted": False, "error": str(e)}

def get_collection_stats(product_id: str) -> dict:
    """How many chunks are indexed for a product"""
    try:
        collection = get_collection(product_id)
        return {"product_id": product_id, "total_chunks": collection.count()}
    except Exception as e:
        return {"error": str(e)}