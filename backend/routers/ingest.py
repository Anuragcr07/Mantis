from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.pdf_service import extract_and_chunk
from services.chroma_service import index_chunks
import shutil, os

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("/pdf/{product_id}")
async def ingest_pdf(product_id: str, file: UploadFile = File(...)):
    # save temp
    temp_path = f"uploads/{product_id}_{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    # extract + chunk + index
    chunks = extract_and_chunk(temp_path, product_id)
    result = index_chunks(product_id, chunks)
    
    os.remove(temp_path)  # cleanup
    return {"status": "success", "chunks_indexed": result["indexed"]}

@router.post("/transcript/{product_id}")
async def ingest_transcript(product_id: str, file: UploadFile = File(...)):
    """Upload whisper transcript JSON"""
    import json
    content = await file.read()
    segments = json.loads(content)
    
    chunks = [{
        "text": seg["text"],
        "metadata": {
            "product_id": product_id,
            "source_type": "video",
            "timestamp": seg["timestamp_label"],
            "start_sec": seg["start"]
        }
    } for seg in segments]
    
    result = index_chunks(product_id, chunks)
    return {"status": "success", "chunks_indexed": result["indexed"]}