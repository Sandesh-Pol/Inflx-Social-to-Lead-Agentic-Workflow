"""
Intent Identification Module
Classifies user intent using Groq LLM
"""
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.config import config
from app.agent.prompts import INTENT_CLASSIFICATION_PROMPT
from app.agent.state import AgentState

class IntentClassifier:
    """Classifies user intent for conversation routing"""
    
    def __init__(self):
        """Initialize Groq LLM for intent classification"""
        self.llm = ChatGroq(
            model_name=config.GROQ_MODEL,
            groq_api_key=config.GROQ_API_KEY,
            temperature=0.3,
            max_tokens=10
        )
    
    def classify_intent(self, state: AgentState) -> str:
        """
        Classify user intent based on conversation context
        """
        messages = state.get("messages", [])
        if not messages:
            return "greeting"
        
        latest_message = messages[-1].content
        previous_intent = state.get("intent", "greeting")
        
        context = self._build_context(state)
        
        prompt = INTENT_CLASSIFICATION_PROMPT.format(
            message=latest_message,
            previous_intent=previous_intent,
            context=context
        )
        
        try:
            response = self.llm.invoke([HumanMessage(content=prompt)])
            intent = response.content.strip().upper()
            
            # Validate against 6 fixed intents
            valid_intents = ["GREETING", "INFO", "PRICING", "COMPARISON", "OBJECTION", "HIGH_INTENT"]
            if intent not in valid_intents:
                # Default escalation based on previous
                if previous_intent == "GREETING":
                    intent = "INFO"
                elif previous_intent in ["INFO", "PRICING"]:
                    intent = "COMPARISON"
                else:
                    intent = previous_intent
            
            return intent.lower()
            
        except Exception as e:
            print(f"Intent classification error: {e}")
            return previous_intent or "greeting"
    
    def _build_context(self, state: AgentState) -> str:
        """Build context string from state"""
        context_parts = []
        if state.get("selected_plan"):
            context_parts.append(f"Plan interest: {state['selected_plan']}")
        if state.get("name"):
            context_parts.append(f"User is {state['name']}")
        if state.get("email"):
            context_parts.append("User provided email")
        if state.get("platform"):
            context_parts.append(f"Platform: {state['platform']}")
        
        return " | ".join(context_parts) if context_parts else "No context"
    
    def is_high_intent(self, state: AgentState) -> bool:
        """Check if user is showing high purchase intent"""
        intent = state.get("intent", "")
        has_plan = state.get("selected_plan") is not None
        has_contact = state.get("email") is not None
        return intent == "high_intent" or (has_plan and has_contact)

# Singleton instance
intent_classifier = IntentClassifier()

def classify_intent_node(state: AgentState) -> AgentState:
    """LangGraph node for intent classification"""
    intent = intent_classifier.classify_intent(state)
    return {"intent": intent}
