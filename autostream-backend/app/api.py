"""
API Endpoints for AutoStream AI Assistant
Handles /chat endpoint with session management
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from langchain_core.messages import HumanMessage
from app.agent.graph import autostream_graph
from app.memory.session_store import session_store

router = APIRouter()

class ChatRequest(BaseModel):
    """Chat request schema"""
    session_id: str = Field(..., description="Unique session identifier (UUID)")
    message: str = Field(..., min_length=1, description="User message")

class ChatResponse(BaseModel):
    """Chat response schema"""
    reply: str = Field(..., description="Assistant's reply")
    intent: str = Field(..., description="Classified intent")
    state: dict = Field(..., description="Current conversation state")
    ui_components: dict = Field(default={}, description="UI components to display")

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Process chat message and return AI response
    
    Args:
        request: ChatRequest with session_id and message
        
    Returns:
        ChatResponse with reply, intent, state, and ui_components
    """
    try:
        # Get or create session
        session = session_store.get_or_create(request.session_id)
        
        # Add user message to state
        user_message = HumanMessage(content=request.message)
        session["messages"].append(user_message)
        
        # Run graph
        updated_state = autostream_graph.run(session)
        
        # Update session store
        session_store.update_session(request.session_id, updated_state)
        
        # Get assistant's reply (last message)
        messages = updated_state.get("messages", [])
        assistant_reply = messages[-1].content if messages else "I'm sorry, I didn't understand that."
        
        # Determine UI components to show
        ui_components = {}
        intent = updated_state.get("intent", "greeting")
        
        # Show pricing cards for pricing intent
        if intent == "pricing" and not updated_state.get("selected_plan"):
            ui_components["show_pricing_cards"] = True
        
        # Show plan comparison when Basic is selected
        if updated_state.get("selected_plan") == "basic":
            ui_components["show_plan_comparison"] = True
        
        # Show YouTube permission request if channel detected
        if updated_state.get("yt_channel") and not updated_state.get("yt_permission_asked"):
            ui_components["show_youtube_permission"] = True
            ui_components["youtube_channel"] = updated_state.get("yt_channel")
            updated_state["yt_permission_asked"] = True
            session_store.update_session(request.session_id, updated_state)
        
        # Show confirmation when all fields collected
        if (updated_state.get("name") and 
            updated_state.get("email") and 
            updated_state.get("platform") and 
            not updated_state.get("lead_captured")):
            ui_components["show_confirmation"] = True
        
        # Show success when lead captured
        if updated_state.get("lead_captured"):
            ui_components["show_success"] = True
        
        # Show YouTube analysis in right panel
        if updated_state.get("yt_analysis"):
            ui_components["youtube_analysis"] = updated_state.get("yt_analysis")
        
        # Build response
        response = ChatResponse(
            reply=assistant_reply,
            intent=intent,
            state={
                "selected_plan": updated_state.get("selected_plan"),
                "name": updated_state.get("name"),
                "email": updated_state.get("email"),
                "platform": updated_state.get("platform"),
                "yt_channel": updated_state.get("yt_channel"),
                "lead_captured": updated_state.get("lead_captured", False),
                "turn_count": updated_state.get("turn_count", 0),
                "conversation_state": updated_state.get("conversation_state", "DISCOVERY")
            },
            ui_components=ui_components
        )
        
        return response
        
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """
    Get current session state
    
    Args:
        session_id: Session identifier
        
    Returns:
        Current session state
    """
    session = session_store.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "intent": session.get("intent"),
        "selected_plan": session.get("selected_plan"),
        "name": session.get("name"),
        "email": session.get("email"),
        "platform": session.get("platform"),
        "lead_captured": session.get("lead_captured", False),
        "turn_count": session.get("turn_count", 0),
        "message_count": len(session.get("messages", []))
    }

@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a session
    
    Args:
        session_id: Session to delete
        
    Returns:
        Success confirmation
    """
    session_store.delete_session(session_id)
    return {"message": f"Session {session_id} deleted"}

@router.get("/stats")
async def get_stats():
    """Get session store statistics"""
    return session_store.get_stats()
