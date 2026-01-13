"""
Agent Tools - Lead Capture
Defines tools that the agent can execute
"""
from typing import Optional
from langchain.tools import tool
from app.agent.state import AgentState

@tool
def capture_lead(name: str, email: str, platform: str, selected_plan: str, yt_channel: Optional[str] = None) -> str:
    """
    Capture a qualified lead with their contact information and preferences.
    
    Args:
        name: Lead's full name
        email: Lead's email address
        platform: Primary content platform (e.g., YouTube, Twitch)
        selected_plan: Selected pricing plan (basic or pro)
        yt_channel: YouTube channel URL (optional)
    
    Returns:
        Success confirmation message
    """
    # In production, this would:
    # 1. Save to CRM/database
    # 2. Trigger welcome email
    # 3. Notify sales team
    # 4. Create HubSpot/Salesforce contact
    
    print("=" * 60)
    print("🎯 LEAD CAPTURED SUCCESSFULLY")
    print("=" * 60)
    print(f"Name: {name}")
    print(f"Email: {email}")
    print(f"Platform: {platform}")
    print(f"Selected Plan: {selected_plan.upper()}")
    if yt_channel:
        print(f"YouTube Channel: {yt_channel}")
    print("=" * 60)
    
    return f"Lead captured: {name} ({email}) - {selected_plan} plan"


class LeadCaptureExecutor:
    """Handles lead capture logic and validation"""
    
    @staticmethod
    def should_capture_lead(state: AgentState) -> bool:
        """
        Determine if lead should be captured
        
        Conditions:
        1. Intent is high_intent
        2. All required fields are present
        3. Lead not already captured
        
        Args:
            state: Current agent state
            
        Returns:
            True if lead should be captured
        """
        # Check if already captured
        if state.get("lead_captured", False):
            return False
        
        # Check intent
        if state.get("intent") != "high_intent":
            return False
        
        # Check required fields
        required_fields = ["name", "email", "platform", "selected_plan"]
        
        for field in required_fields:
            if not state.get(field):
                return False
        
        return True
    
    @staticmethod
    def get_missing_fields(state: AgentState) -> list:
        """
        Get list of missing required fields
        
        Args:
            state: Current agent state
            
        Returns:
            List of missing field names
        """
        required_fields = {
            "name": "Name",
            "email": "Email",
            "platform": "Platform",
            "selected_plan": "Plan selection"
        }
        
        missing = []
        for field, label in required_fields.items():
            if not state.get(field):
                missing.append(label)
        
        return missing
    
    @staticmethod
    def execute_capture(state: AgentState) -> dict:
        """
        Execute lead capture tool
        
        Args:
            state: Current agent state
            
        Returns:
            Updated state dict with lead_captured flag
        """
        try:
            # Call the tool
            result = capture_lead.invoke({
                "name": state["name"],
                "email": state["email"],
                "platform": state["platform"],
                "selected_plan": state["selected_plan"],
                "yt_channel": state.get("yt_channel")
            })
            
            print(f"Lead capture result: {result}")
            
            return {"lead_captured": True}
            
        except Exception as e:
            print(f"Lead capture error: {e}")
            return {"lead_captured": False}


# Singleton instance
lead_executor = LeadCaptureExecutor()


def lead_capture_node(state: AgentState) -> AgentState:
    """
    LangGraph node for lead capture execution
    
    Args:
        state: Current agent state
        
    Returns:
        Updated state with lead capture status
    """
    # Check if we should capture
    if lead_executor.should_capture_lead(state):
        return lead_executor.execute_capture(state)
    
    # No capture needed
    return {}
