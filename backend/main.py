import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Mantis — Product Diagnostic Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

from routers import ingest, diagnose, chat
app.include_router(ingest.router)
app.include_router(diagnose.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"status": "Mantis API running", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)