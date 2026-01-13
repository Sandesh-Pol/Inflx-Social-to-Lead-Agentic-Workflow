# AutoStream AI Assistant - Backend

A production-ready, **stateful AI sales agent** that converts conversations into qualified leads using **LangGraph**, **FastAPI**, and **Gemini 1.5 Flash**.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Navigate to the backend directory
cd autostream-backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Run Locally

```bash
# Start the FastAPI server
python -m app.main

# Or use uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📋 API Endpoints

### `POST /api/chat`
Main chat endpoint for conversation

**Request:**
```json
{
  "session_id": "uuid-string",
  "message": "I want to learn about your pricing"
}
```

**Response:**
```json
{
  "reply": "Great! We offer two plans...",
  "intent": "product_pricing",
  "state": {
    "selected_plan": null,
    "name": null,
    "email": null,
    "platform": null,
    "lead_captured": false
  }
}
```

### `GET /api/session/{session_id}`
Retrieve session state

### `DELETE /api/session/{session_id}`
Delete a session

### `GET /api/stats`
Get session store statistics

---

## 🏗️ Architecture

### Why LangGraph?

**LangGraph** was chosen over simple chain-based approaches for several critical reasons:

1. **Explicit State Management**: LangGraph's state graph architecture allows us to maintain complex conversation state across 5-6 turns, tracking user intent, lead qualification progress, and plan selection without manual state juggling.

2. **Conditional Routing**: The sales conversation requires dynamic flow control:
   - Route to RAG when users ask about features
   - Trigger plan comparison logic when Basic is selected
   - Execute lead capture only when all fields are present
   - LangGraph's conditional edges make this natural and maintainable

3. **Debuggability**: Each node (intent → RAG → plan selection → response → lead capture) is isolated, making it easy to debug and test individual components.

4. **Scalability**: As the product evolves (e.g., adding CRM integrations, payment processing, or multi-turn negotiations), LangGraph's modular node structure scales cleanly without refactoring the entire flow.

### System Flow

```
User Message
    ↓
[Intent Classification Node]
    ↓
[RAG Retrieval Node]
    ↓
[Plan Selection Node] (conditional)
    ↓
[Response Generation Node]
    ↓
[Lead Capture Node] (conditional)
    ↓
Response
```

### Key Components

#### 1. **Agent State** (`agent/state.py`)
TypedDict schema that maintains:
- Conversation history (last 5-6 turns)
- Intent classification
- Lead information (name, email, platform)
- Plan selection (basic/pro)
- Lead capture status

#### 2. **Intent Classification** (`agent/intent.py`)
Uses Gemini to classify user messages into:
- `greeting`: Initial contact
- `product_pricing`: Feature/pricing questions
- `high_intent`: Ready-to-buy signals

#### 3. **RAG Pipeline** (`agent/rag.py`)
- Loads `knowledge.md` (pricing, features, policies)
- Creates FAISS vector store with Gemini embeddings
- Retrieves top-K relevant context for accurate responses
- **Prevents hallucination** by grounding responses in facts

#### 4. **Plan Selection Logic** (`agent/graph.py`)
- **Basic Plan**: Shows comparison table + soft CTA to upgrade
- **Pro Plan**: Celebrates choice, highlights premium benefits (no comparison)

#### 5. **Lead Capture Tool** (`agent/tools.py`)
- Executes ONLY when:
  - Intent = high_intent
  - All fields present (name, email, platform)
  - Not already captured
- Currently logs to console (production: CRM integration)

#### 6. **Session Store** (`memory/session_store.py`)
- In-memory store with LRU eviction
- Per-session state isolation
- Automatic expiration (1-hour timeout)
- Keeps last 5-6 conversation turns

---

## 🔌 WhatsApp Integration (Future)

**How it would work:**

1. **Webhook Setup**: Register a webhook endpoint with WhatsApp Business API
   ```python
   @app.post("/webhook/whatsapp")
   async def whatsapp_webhook(payload: WhatsAppPayload):
       # Extract user message and phone number
       session_id = payload.phone_number
       message = payload.message
       
       # Call existing /api/chat endpoint
       response = await chat(ChatRequest(
           session_id=session_id,
           message=message
       ))
       
       # Send reply via WhatsApp API
       await send_whatsapp_message(
           to=payload.phone_number,
           message=response.reply
       )
   ```

2. **Session Mapping**: Use phone number as `session_id` for continuity

3. **Rich Media**: Extend responses to include:
   - Comparison tables → WhatsApp List Messages
   - Plan selection → Quick Reply buttons
   - Lead capture → WhatsApp Form

4. **Async Processing**: Use background tasks for lead capture triggers (CRM, email, notifications)

**No changes needed to core agent logic**—the LangGraph workflow remains identical!

---

## 🧠 Features Implemented

✅ **Intent Identification** - Gemini-powered classification  
✅ **RAG-Powered Responses** - FAISS + Gemini embeddings  
✅ **Plan Selection Logic** - Smart Basic vs Pro handling  
✅ **Lead Capture** - Automated when qualified  
✅ **YouTube Strategy** - Optional channel analysis  
✅ **Memory Management** - 5-6 turn context retention  
✅ **Session Isolation** - Per-user state tracking  

---

## 🔒 Production Considerations

### Security
- API key stored in environment variables (never hardcoded)
- Session timeout (1 hour) prevents stale sessions
- Input validation via Pydantic schemas

### Scalability
- **Current**: In-memory session store (100 sessions max)
- **Production**: Replace with Redis for distributed sessions
  ```python
  from redis import Redis
  session_store = RedisSessionStore(Redis(host='...'))
  ```

### Monitoring
Add logging and metrics:
```python
import logging
logger.logging.getLogger(__name__)

# Log lead captures
logger.info(f"Lead captured: {email} - {selected_plan}")

# Track intent distribution
metrics.increment(f"intent.{intent}")
```

### Database Integration
Replace mock lead capture with actual CRM:
```python
async def capture_lead(...):
    # Save to PostgreSQL
    await db.execute(
        "INSERT INTO leads (name, email, plan) VALUES ($1, $2, $3)",
        name, email, selected_plan
    )
    
    # Trigger welcome email
    await send_email(email, template="welcome")
    
    # Notify sales team
    await slack.post(f"🎯 New lead: {name}")
```

---

## 📂 Project Structure

```
autostream-backend/
│
├── app/
│   ├── main.py                 # FastAPI entry point
│   ├── api.py                  # /chat endpoint
│   ├── config.py               # Gemini config
│   │
│   ├── agent/
│   │   ├── graph.py            # LangGraph workflow ⭐
│   │   ├── state.py            # AgentState schema
│   │   ├── intent.py           # Intent classification
│   │   ├── rag.py              # RAG pipeline (FAISS)
│   │   ├── prompts.py          # All LLM prompts
│   │   └── tools.py            # Lead capture tool
│   │
│   ├── memory/
│   │   └── session_store.py    # In-memory session store
│   │
│   └── data/
│       └── knowledge.md        # Product knowledge base
│
├── .env.example
├── requirements.txt
└── README.md
```

---

## 🧪 Testing the Agent

### Test Conversation Flow

```bash
# Start server
python -m app.main
```

**Test with curl:**

```bash
# 1. Greeting
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Hi there!"
  }'

# 2. Ask about pricing
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "What are your pricing plans?"
  }'

# 3. Select Pro plan
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "I want the Pro plan. My name is John Doe"
  }'

# 4. Provide email (triggers lead capture)
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "My email is john@example.com and I create YouTube content"
  }'
```

Check console for lead capture output! 🎯

---

## 🛠️ Customization

### Modify Prompts
Edit `app/agent/prompts.py` to adjust tone, personality, or sales strategy

### Update Knowledge Base
Edit `app/data/knowledge.md` to add new features, pricing, or FAQs

### Adjust Memory Limits
In `app/config.py`:
```python
MAX_CONVERSATION_TURNS = 6  # Change retention window
SESSION_TIMEOUT = 3600       # Change timeout (seconds)
```

### Change LLM
Swap Gemini for another provider:
```python
# In graph.py
from langchain_openai import ChatOpenAI
self.llm = ChatOpenAI(model="gpt-4", api_key=...)
```

---

## 📄 License

This is a production-ready backend for the AutoStream AI Assistant project.

---

## 🙋 Support

For issues or questions:
1. Check `/docs` endpoint for API documentation
2. Review console logs for debugging
3. Verify `.env` configuration

**Built with ❤️ using LangGraph, FastAPI, and Gemini 1.5 Flash**
