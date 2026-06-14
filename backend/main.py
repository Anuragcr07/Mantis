import os
import base64
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

load_dotenv()

# 1. App Setup
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Mantis — Product Diagnostic Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# 2. Wire Routers
from routers import ingest
app.include_router(ingest.router)

# 3. Chroma for diagnose endpoint
from services.chroma_service import query_knowledge

# 4. Response Model
class DiagnosisResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[dict]
    diagnostic_state: str

# 5. Helper
async def encode_image(file: UploadFile):
    bytes_data = await file.read()
    return base64.b64encode(bytes_data).decode('utf-8')

# --- ENDPOINTS ---

@app.get("/")
async def root():
    return {"status": "Mantis API running", "docs": "/docs"}

@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(
    product_id: str = Form(...),
    query: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    """
    Main diagnostic endpoint using Gemini.
    Member 3 will expand with multi-turn conversation history.
    """
    try:
        # 1. Retrieve relevant chunks from ChromaDB
        chunks = query_knowledge(product_id, query, n_results=4)
        context = "\n\n".join(c["text"] for c in chunks)
        sources = [c["metadata"] for c in chunks]

        if not context:
            context = "No documentation found for this product."

        # 2. Build prompt
        system_prompt = f"""You are an expert diagnostic technician for this product.
You have access to the official product documentation below.

DOCUMENTATION:
{context}

RULES:
- Never dump all information at once
- Ask ONE focused follow-up question at a time to narrow down the issue
- Only suggest a fix after gathering enough information
- Always cite which section or page your answer comes from
- Be concise and practical"""

        # 3. Handle image if uploaded
        if image:
            image_bytes = await file.read()
            image_part = {
                "mime_type": image.content_type,
                "data": base64.b64encode(image_bytes).decode('utf-8')
            }
            response = model.generate_content([system_prompt, query, image_part])
        else:
            response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=f"{system_prompt}\n\nUser: {query}"
)

        return DiagnosisResponse(
            answer=response.text,
            confidence=0.85,
            sources=sources,
            diagnostic_state="Diagnosis In Progress"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)