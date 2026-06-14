import os
import base64
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(title="Mantis — Product Diagnostic Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

from routers.diagnose import router as diagnose_router
app.include_router(diagnose_router)


from routers import ingest
app.include_router(ingest.router)

from services.chroma_service import query_knowledge

class DiagnosisResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[dict]
    diagnostic_state: str

@app.get("/")
async def root():
    return {"status": "Mantis API running", "docs": "/docs"}

@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(
    product_id: str = Form(...),
    query: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        chunks = query_knowledge(product_id, query, n_results=4)
        context = "\n\n".join(c["text"] for c in chunks)
        sources = [c["metadata"] for c in chunks]

        if not context:
            context = "No documentation found for this product."

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

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ]
        )

        return DiagnosisResponse(
            answer=response.choices[0].message.content,
            confidence=0.85,
            sources=sources,
            diagnostic_state="Diagnosis In Progress"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

