"""
Session Memory Store
Manages per-session conversation state with LRU cache
"""
import time
from typing import Dict, Optional
from collections import OrderedDict
from app.agent.state import AgentState
from app.config import config

class SessionStore:
    """
    In-memory session store with LRU eviction
    Stores AgentState per session_id
    """
    
    def __init__(self, max_sessions: int = 100):
        """
        Initialize session store
        
        Args:
            max_sessions: Maximum number of sessions to store (LRU eviction)
        """
        self.sessions: OrderedDict[str, Dict] = OrderedDict()
        self.max_sessions = max_sessions
        self.last_access: Dict[str, float] = {}
    
    def get_session(self, session_id: str) -> Optional[AgentState]:
        """
        Retrieve session state
        
        Args:
            session_id: Unique session identifier
            
        Returns:
            AgentState or None if not found
        """
        # Check if session exists
        if session_id not in self.sessions:
            return None
        
        # Check if session expired
        if self._is_expired(session_id):
            self.delete_session(session_id)
            return None
        
        # Update access time
        self.last_access[session_id] = time.time()
        
        # Move to end (most recently used)
        self.sessions.move_to_end(session_id)
        
        return self.sessions[session_id]
    
    def create_session(self, session_id: str) -> AgentState:
        """
        Create new session with default state
        
        Args:
            session_id: Unique session identifier
            
        Returns:
            New AgentState
        """
        # Enforce LRU eviction
        if len(self.sessions) >= self.max_sessions:
            # Remove oldest session
            oldest_id = next(iter(self.sessions))
            self.delete_session(oldest_id)
        
        # Create default state
        default_state: AgentState = {
            "messages": [],
            "intent": "greeting",
            "selected_plan": None,
            "name": None,
            "email": None,
            "platform": None,
            "yt_channel": None,
            "lead_captured": False,
            "session_id": session_id,
            "turn_count": 0,
            "retrieved_context": None
        }
        
        # Store session
        self.sessions[session_id] = default_state
        self.last_access[session_id] = time.time()
        
        return default_state
    
    def update_session(self, session_id: str, updates: dict):
        """
        Update session state
        
        Args:
            session_id: Session to update
            updates: Dictionary of state updates
        """
        if session_id not in self.sessions:
            # Create if doesn't exist
            self.create_session(session_id)
        
        # Update state
        self.sessions[session_id].update(updates)
        
        # Update access time
        self.last_access[session_id] = time.time()
        
        # Move to end
        self.sessions.move_to_end(session_id)
        
        # Enforce conversation turn limit
        self._enforce_turn_limit(session_id)
    
    def delete_session(self, session_id: str):
        """Delete a session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
        if session_id in self.last_access:
            del self.last_access[session_id]
    
    def _is_expired(self, session_id: str) -> bool:
        """Check if session has expired"""
        if session_id not in self.last_access:
            return True
        
        elapsed = time.time() - self.last_access[session_id]
        return elapsed > config.SESSION_TIMEOUT
    
    def _enforce_turn_limit(self, session_id: str):
        """
        Enforce maximum conversation turn limit
        Keeps only the last N turns to prevent memory bloat
        """
        if session_id not in self.sessions:
            return
        
        messages = self.sessions[session_id].get("messages", [])
        max_turns = config.MAX_CONVERSATION_TURNS
        
        # Keep last N*2 messages (N user + N assistant)
        if len(messages) > max_turns * 2:
            self.sessions[session_id]["messages"] = messages[-(max_turns * 2):]
    
    def get_or_create(self, session_id: str) -> AgentState:
        """
        Get session or create if doesn't exist
        
        Args:
            session_id: Session identifier
            
        Returns:
            AgentState
        """
        session = self.get_session(session_id)
        if session is None:
            session = self.create_session(session_id)
        return session
    
    def get_stats(self) -> dict:
        """Get store statistics"""
        return {
            "total_sessions": len(self.sessions),
            "max_sessions": self.max_sessions,
            "oldest_session": next(iter(self.sessions)) if self.sessions else None
        }

# Singleton instance
session_store = SessionStore()
