"""
Agent State Schema for LangGraph
Defines the stateful structure for conversation tracking
"""
from typing import TypedDict, List, Optional, Annotated
import operator
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """
    State object for the AutoStream AI Assistant
    Maintains conversation context and lead qualification progress
    """
    # Conversation history
    messages: Annotated[List[BaseMessage], operator.add]
    
    # Intent classification
    intent: str  # "greeting", "info", "pricing", "comparison", "objection", "high_intent"
    
    # Conversation state (CRITICAL for proper flow)
    conversation_state: str  # "DISCOVERY", "EXPLORING", "PRICING", "CONFIRMATION", "QUALIFIED", "FINAL"
    
    # Plan selection
    selected_plan: Optional[str]  # "basic" or "pro"
    
    # Lead information
    name: Optional[str]
    email: Optional[str]
    platform: Optional[str]  # "YouTube", "Twitch", etc.
    yt_channel: Optional[str]
    
    # Lead qualification status
    lead_captured: bool
    
    # Session metadata
    session_id: str
    turn_count: int
    
    # RAG context
    retrieved_context: Optional[str]
