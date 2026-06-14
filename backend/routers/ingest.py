from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import extract_and_chunk
from services.chroma_service import index_chunks, get_collection_stats
from services.video_service import load_transcript, get_chunks_from_transcript
from services.moss_service import index_to_moss   # ← ADD THIS
import shutil, os, json

router = APIRouter(prefix="/ingest", tags=["ingest"])
os.makedirs("uploads", exist_ok=True)

@router.post("/pdf/{product_id}")
async def ingest_pdf(product_id: str, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files accepted")
    temp_path = f"uploads/{product_id}_{file.filename}"
    try:
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        chunks = extract_and_chunk(temp_path, product_id)
        result = index_chunks(product_id, chunks)
        await index_to_moss(product_id, chunks)    # ← ADD THIS
        stats = get_collection_stats(product_id)
        return {
            "status": "success",
            "filename": file.filename,
            "chunks_indexed": result["indexed"],
            "total_chunks_in_db": stats["total_chunks"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# ─── VIDEO ─────────────────────────────────────────
@router.post("/video/{product_id}")
async def ingest_video(product_id: str, file: UploadFile = File(...)):
    SUPPORTED = [".mp4", ".mov", ".avi", ".mkv", ".webm"]
    ext = "." + file.filename.lower().split(".")[-1]
    
    if ext not in SUPPORTED:
        raise HTTPException(status_code=400, detail=f"Unsupported video type: {ext}")
    
    try:
        video_bytes = await file.read()
        
        # Transcribe + chunk using Groq Whisper
        chunks = transcribe_and_chunk(video_bytes, product_id, file.filename)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="No content extracted from video")
        
        result = index_chunks(product_id, chunks)
        await index_to_moss(product_id, chunks)
        stats = get_collection_stats(product_id)
        
        return {
            "status": "success",
            "filename": file.filename,
            "chunks_indexed": result["indexed"],
            "total_chunks_in_db": stats["total_chunks"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── STATUS ────────────────────────────────────────
@router.get("/status/{product_id}")
async def index_status(product_id: str):
    return get_collection_stats(product_id)