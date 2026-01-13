"""
RAG Pipeline for Knowledge Retrieval
Uses FAISS vector store with Gemini embeddings
"""
import os
from typing import List
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.config import config
from app.agent.state import AgentState

class RAGPipeline:
    """RAG pipeline for retrieving knowledge base context"""
    
    def __init__(self):
        """Initialize RAG components"""
        self.embeddings = HuggingFaceEmbeddings(
            model_name=config.EMBEDDING_MODEL
        )
        self.vector_store = None
        self._initialize_vector_store()
    
    def _initialize_vector_store(self):
        """Load knowledge base and create vector store"""
        try:
            # Read knowledge base
            kb_path = config.KNOWLEDGE_BASE_PATH
            
            if not os.path.exists(kb_path):
                print(f"Warning: Knowledge base not found at {kb_path}")
                return
            
            with open(kb_path, 'r', encoding='utf-8') as f:
                knowledge_content = f.read()
            
            # Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=config.CHUNK_SIZE,
                chunk_overlap=config.CHUNK_OVERLAP,
                separators=["\n## ", "\n### ", "\n\n", "\n", " ", ""]
            )
            
            chunks = text_splitter.split_text(knowledge_content)
            
            # Create documents
            documents = [
                Document(page_content=chunk, metadata={"source": "knowledge.md"})
                for chunk in chunks
            ]
            
            # Create FAISS vector store
            self.vector_store = FAISS.from_documents(
                documents=documents,
                embedding=self.embeddings
            )
            
            print(f"✓ Vector store initialized with {len(documents)} chunks")
            
        except Exception as e:
            print(f"Error initializing vector store: {e}")
            self.vector_store = None
    
    def retrieve_context(self, query: str, k: int = None) -> str:
        """
        Retrieve relevant context from knowledge base
        
        Args:
            query: User query or message
            k: Number of top results to retrieve
            
        Returns:
            Retrieved context as formatted string
        """
        if not self.vector_store:
            return "Knowledge base not available."
        
        if k is None:
            k = config.TOP_K_RESULTS
        
        try:
            # Retrieve relevant documents
            docs = self.vector_store.similarity_search(query, k=k)
            
            # Format context
            context_parts = []
            for i, doc in enumerate(docs, 1):
                context_parts.append(f"[Context {i}]\n{doc.page_content}")
            
            return "\n\n".join(context_parts)
            
        except Exception as e:
            print(f"RAG retrieval error: {e}")
            return "Unable to retrieve context at this time."
    
    def should_retrieve(self, state: AgentState) -> bool:
        """
        Determine if RAG retrieval is needed based on intent
        
        Args:
            state: Current agent state
            
        Returns:
            True if retrieval should happen
        """
        intent = state.get("intent", "")
        
        # Retrieve for product/pricing questions
        return intent in ["product_pricing", "greeting"]

# Singleton instance
rag_pipeline = RAGPipeline()


def rag_retrieval_node(state: AgentState) -> AgentState:
    """
    LangGraph node for RAG retrieval
    
    Args:
        state: Current agent state
        
    Returns:
        Updated state with retrieved context
    """
    # Check if retrieval is needed
    if not rag_pipeline.should_retrieve(state):
        return {"retrieved_context": None}
    
    # Get latest message
    messages = state.get("messages", [])
    if not messages:
        return {"retrieved_context": None}
    
    latest_message = messages[-1].content
    
    # Retrieve context
    context = rag_pipeline.retrieve_context(latest_message)
    
    return {
        "retrieved_context": context
    }
