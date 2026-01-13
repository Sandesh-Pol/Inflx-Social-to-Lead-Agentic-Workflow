"""
Configuration module for AutoStream AI Assistant
Handles Groq API configuration and environment variables
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""
    
    # Groq API Configuration
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = "llama-3.3-70b-versatile"
    
    # LLM Parameters
    TEMPERATURE = 0.4
    MAX_TOKENS = 1024
    
    # Memory Configuration
    MAX_CONVERSATION_TURNS = 6
    SESSION_TIMEOUT = 3600  # 1 hour in seconds
    
    # RAG Configuration
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50
    TOP_K_RESULTS = 3
    
    # Knowledge Base Path
    KNOWLEDGE_BASE_PATH = "app/data/knowledge.md"
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY environment variable is required")
        return True

config = Config()