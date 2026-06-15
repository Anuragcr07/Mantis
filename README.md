Mantis 
AI-Powered Product Diagnostic Platform
Mantis is a SaaS platform where companies upload product documentation (PDFs, videos) and users get AI-powered diagnostic assistance — like talking to a real technician, not a search engine.

Features
Core

AI diagnostic assistant that asks focused follow-up questions
Cites exact page numbers from product manuals
Multi-turn conversation with memory
Image-based troubleshooting via Grok Vision
Video transcript ingestion with timestamp citations
PDF manual ingestion and semantic search

Bonus Features Implemented

🖼️ Image-based Troubleshooting — upload photos of error screens or damaged parts for visual diagnosis
🎥 Video Support — Whisper transcribes repair videos; AI directs users to relevant timestamps
🌍 Multi-language Support — LLaMA 3.3 70B handles queries in multiple languages


Tech Stack
Frontend
TechnologyPurposeNext.js 15Core React framework with SSR and secure API routesTailwind CSS v4Utility-first styling for the dark-mode industrial UIshadcn/uiAccessible UI components (cards, inputs, progress bars)MongoDB AtlasCloud NoSQL database for product metadata and garage recordsMongooseODM library for structured user and product schemasAWS S3Cloud storage for manuals, repair videos, and fault photosAWS Pre-signed URLsSecure direct-to-cloud file uploads
Backend
TechnologyPurposeFastAPIHigh-performance Python REST API frameworkChromaDBPersistent vector database for semantic search over manualsMOSS (inferedge-moss)Fast MiniLM-based search layer for sub-10ms retrievalGroq (LLaMA 3.3 70B)Primary LLM for diagnostic responsesGrok Vision (grok-2-vision)Vision model for image-based troubleshootingMongoDB + MotorAsync NoSQL database for conversation historypdfplumberPDF text extraction and chunkingOpenAI WhisperSpeech-to-text transcription of repair videosyt-dlpYouTube video audio downloaderpython-dotenvSecure environment variable managementuvicornASGI server for running FastAPI

 Architecture
PDF/Video uploaded by company
        ↓
POST /ingest/pdf/{product_id} or /ingest/transcript/{product_id}/{video_id}
        ↓
pdfplumber → extract text → chunk into ~400 word pieces
Whisper → transcribe video → timestamp segments
        ↓
ChromaDB → semantic vector storage (cosine similarity)
MOSS → fast search index
        ↓
User reports issue via chat UI
        ↓
MOSS query → top chunks (fast)
ChromaDB → fetch chunks with metadata (page, filename, timestamp)
        ↓
Groq/Grok gets: chunks + conversation history + user query
        ↓
Response with diagnosis + PDF page citation + video timestamp
MongoDB → conversation history saved

📁 Backend Structure
backend/
├── main.py                        # FastAPI app entry point
├── .env                           # API keys (not committed)
├── requirements.txt               # Python dependencies
├── routers/
│   ├── ingest.py                  # PDF and transcript ingestion endpoints
│   ├── diagnose.py                # Single diagnosis endpoint
│   ├── chat.py                    # Multi-turn chat endpoint
│   ├── auth.py                    # Authentication
│   ├── products.py                # Product management
│   └── documents.py               # Document management
├── services/
│   ├── chroma_service.py          # ChromaDB vector operations
│   ├── pdf_service.py             # PDF extraction and chunking
│   ├── video_service.py           # Transcript loading and chunking
│   ├── moss_service.py            # MOSS fast search
│   ├── agent_service.py           # Core diagnostic agent
│   ├── grok_service.py            # Groq/Grok LLM routing
│   ├── llm_service.py             # Prompt building
│   └── db_service.py              # MongoDB operations
├── models/
│   ├── user.py                    # User model
│   ├── product.py                 # Product model
│   └── chat.py                    # Chat/message models
├── knowledge/
│   ├── knowledge_graph.json       # Diagnostic decision trees
│   ├── source_map.json            # Chunk to page mappings
│   └── transcripts/               # Whisper transcript JSONs
└── scripts/
    └── run_whisper.py             # Video transcription script

Setup
Prerequisites

Python 3.13+
Node.js 18+
MongoDB (local or Atlas)
ffmpeg

Backend
bashcd backend
pip install -r requirements.txt
Create .env:
GROQ_API_KEY=your_groq_api_key
GROK_API_KEY=your_grok_api_key
MOSS_PROJECT_ID=your_moss_project_id
MOSS_PROJECT_KEY=your_moss_project_key
MONGODB_URI=mongodb://localhost:27017
Run server:
bashpython3 -m uvicorn main:app --reload --port 8000
Frontend
bashcd frontend
npm install
npm run dev

 API Endpoints
MethodRoutePurposeGET/Health checkPOST/ingest/pdf/{product_id}Upload and index PDF manualPOST/ingest/transcript/{product_id}/{video_id}Upload and index video transcriptGET/ingest/stats/{product_id}Check indexed chunksPOST/diagnose/Single AI diagnosisPOST/chat/{product_id}Multi-turn diagnostic chatGET/documents/{product_id}Get document statsDELETE/documents/{product_id}Delete product index


<img width="654" height="408" alt="DEMO_mantis" src="https://github.com/user-attachments/assets/aa83cbc3-3a6e-42cc-ad83-31395b2c1180" />

> A user reports "water is leaking from my AC" — Mantis instantly references 
> Section 3, Page 15 of the official manual and provides three targeted 
> troubleshooting steps with exact page citations.



https://github.com/user-attachments/assets/2ab40d3b-b69a-4438-ba7b-4a16846436fe


