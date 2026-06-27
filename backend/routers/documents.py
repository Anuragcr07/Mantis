from fastapi import APIRouter, HTTPException
from services.chroma_service import get_collection_stats, delete_product_index

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("/{product_id}")
async def get_document_stats(product_id: str):
    stats = get_collection_stats(product_id)
    if "error" in stats:
        raise HTTPException(status_code=404, detail=f"No documents found for product {product_id}")
    return stats

@router.delete("/{product_id}")
async def delete_document(product_id: str):
    result = delete_product_index(product_id)
    if not result["deleted"]:
        raise HTTPException(status_code=404, detail=result.get("error", "Failed to delete"))
    return {"status": "deleted", "product_id": product_id}