"""
Optimized LangGraph Workflow using Groq
With conversation state management for proper flow control
"""
from typing import Literal, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.config import config
from app.agent.state import AgentState
from app.agent.rag import rag_pipeline
from app.agent.tools import lead_executor
from app.agent.youtube_analyzer import youtube_analyzer
import re

class AutoStreamGraph:
    """Simplified High-Speed LangGraph workflow using Groq"""
    
    def __init__(self):
        """Initialize with a single Groq LLM instance"""
        self.llm = ChatGroq(
            model_name=config.GROQ_MODEL,
            groq_api_key=config.GROQ_API_KEY,
            temperature=config.TEMPERATURE,
            max_tokens=config.MAX_TOKENS
        )
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Single-node streamlined graph"""
        workflow = StateGraph(AgentState)
        
        # We only need one smart node now
        workflow.add_node("agent", self._agent_node)
        
        workflow.set_entry_point("agent")
        workflow.add_edge("agent", END)
        
        return workflow.compile()

    def _agent_node(self, state: AgentState) -> AgentState:
        """
        Single-Pass Node using Groq for ultra-fast response with state management
        """
        messages = state.get("messages", [])
        if not messages: return {}
        
        latest_message = messages[-1].content
        
        # 1. Quick RAG Retrieval
        context = rag_pipeline.retrieve_context(latest_message)
        
        # 2. Use optimized system prompt
        from app.agent.prompts import SYSTEM_PROMPT
        
        # Get current conversation state
        current_conv_state = state.get('conversation_state', 'DISCOVERY')
        
        system_prompt = SYSTEM_PROMPT.format(
            context=context,
            name=state.get('name', 'Unknown'),
            email=state.get('email', 'Unknown'),
            platform=state.get('platform', 'Unknown'),
            plan=state.get('selected_plan', 'None'),
            conversation_state=current_conv_state
        )

        try:
            # Single High-Speed call to Groq
            response = self.llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=latest_message)
            ])
            
            ai_content = response.content
            
            # 3. Fast Extraction
            intent_match = re.search(r'INTENT:\s*(\w+)', ai_content, re.IGNORECASE)
            if not intent_match:
                intent_match = re.search(r'\[INTENT:\s*(.*?)\]', ai_content, re.IGNORECASE)
            
            intent = intent_match.group(1).strip().lower() if intent_match else "greeting"
            
            # Remove ALL intent and state tags from response
            clean_reply = ai_content
            clean_reply = re.sub(r'\[INTENT:.*?\]', '', clean_reply, flags=re.IGNORECASE)
            clean_reply = re.sub(r'INTENT:\s*\w+\s*', '', clean_reply, flags=re.IGNORECASE)
            clean_reply = re.sub(r'STATE:\s*\w+\s*', '', clean_reply, flags=re.IGNORECASE)
            clean_reply = clean_reply.strip()
            
            # Regex extraction from the USER'S message
            updates = self._fast_extract(latest_message, state)
            
            # 4. Conversation State Transition Logic
            new_conv_state = self._determine_next_state(
                current_conv_state,
                intent,
                latest_message.lower(),
                state,
                updates
            )
            updates["conversation_state"] = new_conv_state
            
            # 4.5 YouTube Channel Analysis
            if updates.get("yt_channel") and not state.get("yt_analysis_done"):
                yt_analysis = youtube_analyzer.analyze_channel(updates["yt_channel"])
                if yt_analysis:
                    updates["yt_analysis"] = yt_analysis
                    updates["yt_analysis_done"] = True
            
            # 5. Check for Lead Capture trigger
            new_state = {**state, **updates}
            if not state.get("lead_captured") and lead_executor.should_capture_lead(new_state):
                lead_executor.execute_capture(new_state)
                # Move to FINAL state and use proper closure message
                updates["conversation_state"] = "FINAL"
                updates["lead_captured"] = True
                clean_reply = "Thanks for sharing your details. Our team will review your information and reach out to you shortly to help you get started with AutoStream. Looking forward to supporting your content journey."

            return {
                "messages": [AIMessage(content=clean_reply)],
                "intent": intent,
                "turn_count": state.get("turn_count", 0) + 1,
                "retrieved_context": context,
                **updates
            }
            
        except Exception as e:
            print(f"Groq Agent Error: {e}")
            return {"messages": [AIMessage(content="I'm here to help! What would you like to know about our video editing plans?")]}

    def _determine_next_state(self, current_state: str, intent: str, message: str, state: dict, updates: dict) -> str:
        """
        Determine next conversation state based on current state and user input
        """
        # If already in FINAL state, stay there
        if current_state == "FINAL":
            return "FINAL"
        
        # DISCOVERY to EXPLORING
        if current_state == "DISCOVERY":
            if any(word in message for word in ["youtube", "tiktok", "instagram", "weekly", "daily", "monthly"]):
                return "EXPLORING"
            return "DISCOVERY"
        
        # EXPLORING to PRICING
        if current_state == "EXPLORING":
            if intent in ["pricing", "comparison"] or any(word in message for word in ["price", "cost", "plan", "how much"]):
                return "PRICING"
            return "EXPLORING"
        
        # PRICING to CONFIRMATION
        if current_state == "PRICING":
            if any(word in message for word in ["sounds good", "okay", "interested", "like it"]):
                return "CONFIRMATION"
            if intent == "high_intent":
                return "QUALIFIED"
            return "PRICING"
        
        # CONFIRMATION to QUALIFIED (ONE TURN ONLY)
        if current_state == "CONFIRMATION":
            # Any response in CONFIRMATION state moves to QUALIFIED
            if intent == "high_intent" or updates.get("selected_plan"):
                return "QUALIFIED"
            # Even if not explicit, move forward to avoid loop
            return "QUALIFIED"
        
        # QUALIFIED to FINAL (when lead captured)
        if current_state == "QUALIFIED":
            if state.get("lead_captured") or updates.get("lead_captured"):
                return "FINAL"
            return "QUALIFIED"
        
        return current_state

    def _fast_extract(self, text: str, state: AgentState) -> dict:
        """Ultra-fast regex extraction"""
        updates = {}
        low_text = text.lower()
        
        # Email
        email = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email and not state.get("email"): updates["email"] = email.group(0)
        
        # Plan
        if "pro" in low_text: updates["selected_plan"] = "pro"
        elif "basic" in low_text: updates["selected_plan"] = "basic"
        
        # Platform
        for p in ["youtube", "tiktok", "instagram"]:
            if p in low_text and not state.get("platform"):
                updates["platform"] = p.capitalize()
                
        # Name
        name = re.search(r"(?:my name is|i'm|i am|call me) ([\w\s]+)", low_text)
        if name and not state.get("name"):
            updates["name"] = name.group(1).strip().split()[0].capitalize()
            
        # YouTube Link
        if "youtube.com" in low_text or "youtu.be" in low_text:
            yt = re.search(r'(?:https?://)?(?:www\.)?youtube\.com/\S+|youtu\.be/\S+', text)
            if yt: updates["yt_channel"] = yt.group(0)
            
        return updates

    def run(self, state: AgentState) -> AgentState:
        """Execute the optimized graph"""
        return self.graph.invoke(state)

# Singleton instance
autostream_graph = AutoStreamGraph()
