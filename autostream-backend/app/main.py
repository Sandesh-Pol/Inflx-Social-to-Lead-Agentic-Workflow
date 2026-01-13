"""
FastAPI Main Application
Entry point for AutoStream AI Assistant backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
from app.config import config

# Create FastAPI app
app = FastAPI(
    title="AutoStream AI Assistant",
    description="Stateful AI sales agent that converts conversations into qualified leads",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router, prefix="/api", tags=["chat"])

@app.on_event("startup")
async def startup_event():
    """Initialize components on startup"""
    try:
        # Validate configuration
        config.validate()
        print("✓ Configuration validated")
        
        # Initialize RAG pipeline (happens in rag.py on import)
        print("✓ RAG pipeline initialized")
        
        print("=" * 60)
        print("AutoStream AI Assistant Backend")
        print("=" * 60)
        print(f"Model: {config.GROQ_MODEL}")
        print(f"Max conversation turns: {config.MAX_CONVERSATION_TURNS}")
        print(f"Session timeout: {config.SESSION_TIMEOUT}s")
        print("=" * 60)
        print("Server ready! 🚀")
        print("=" * 60)
        
    except Exception as e:
        print(f"Startup error: {e}")
        raise

@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "service": "AutoStream AI Assistant",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "session": "/api/session/{session_id}",
            "stats": "/api/stats",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
