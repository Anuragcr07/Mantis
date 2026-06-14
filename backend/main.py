import os
import base64
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from openai import OpenAI

# 1. Setup
app = FastAPI(title="Multimodal Troubleshooting API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- ADD YOUR OPENAI KEY HERE ---
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

# 2. Vector DB (Member 2 will fill this)
chroma_client = chromadb.PersistentClient(path="./maintenance_db")
collection = chroma_client.get_or_create_collection(name="product_knowledge")

class DiagnosisResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[dict]
    diagnostic_state: str

async def encode_image(file: UploadFile):
    bytes_data = await file.read()
    return base64.b64encode(bytes_data).decode('utf-8')

# --- ENDPOINTS ---

@app.post("/ingest")
async def ingest_knowledge(text: str = Form(...), metadata_json: str = Form(...)):
    """Member 2 uses this to add PDF/Video data"""
    try:
        meta = json.loads(metadata_json)
        collection.add(
            documents=[text],
            metadatas=[meta],
            ids=[f"id_{os.urandom(4).hex()}"]
        )
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(
    query: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    """The main Brain of the platform"""
    try:
        # 1. Search Vector DB for context
        results = collection.query(query_texts=[query], n_results=3)
        context = "\n".join(results['documents'][0]) if results['documents'] else "No manual context found."
        sources = results['metadatas'][0] if results['metadatas'] else []

        # 2. Build the AI message
        messages = [
            {"role": "system", "content": f"You are a Master Maintenance Technician. Use this context: {context}"},
            {"role": "user", "content": [{"type": "text", "text": query}]}
        ]

        # 3. Add Image if uploaded
        if image:
            base64_img = await encode_image(image)
            messages[1]["content"].append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}
            })

        # 4. Get Answer from GPT-4o
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=500
        )

        return DiagnosisResponse(
            answer=response.choices[0].message.content,
            confidence=0.85,
            sources=sources,
            diagnostic_state="Solution Identified"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)