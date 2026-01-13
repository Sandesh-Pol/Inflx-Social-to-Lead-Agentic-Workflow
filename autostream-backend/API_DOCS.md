# AutoStream AI Assistant - API Documentation

## Base URL
```
http://localhost:8000
```

---

## Endpoints

### 1. Health Check

**`GET /`**

Root endpoint providing service information and available endpoints.

**Response:**
```json
{
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
```

---

### 2. Health Status

**`GET /health`**

Simple health check.

**Response:**
```json
{
  "status": "healthy"
}
```

---

### 3. Chat (Main Endpoint)

**`POST /api/chat`**

Process a user message and get AI response.

**Request Body:**
```json
{
  "session_id": "string (UUID recommended)",
  "message": "string (min length: 1)"
}
```

**Example Request:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Hi! I'm interested in your pricing plans."
}
```

**Response:**
```json
{
  "reply": "string (AI response)",
  "intent": "greeting | product_pricing | high_intent",
  "state": {
    "selected_plan": "string | null",
    "name": "string | null",
    "email": "string | null",
    "platform": "string | null",
    "yt_channel": "string | null",
    "lead_captured": "boolean",
    "turn_count": "integer"
  }
}
```

**Example Response:**
```json
{
  "reply": "Hello! I'd be happy to help you learn about AutoStream's pricing. We offer two plans: Basic ($29/month) for new creators with 10 video exports and 720p quality, and Pro ($79/month) for professionals with unlimited exports and 4K quality. Which would you like to know more about?",
  "intent": "product_pricing",
  "state": {
    "selected_plan": null,
    "name": null,
    "email": null,
    "platform": null,
    "yt_channel": null,
    "lead_captured": false,
    "turn_count": 1
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `422 Unprocessable Entity` - Invalid request format
- `500 Internal Server Error` - Server error

---

### 4. Get Session

**`GET /api/session/{session_id}`**

Retrieve current state of a session.

**Path Parameters:**
- `session_id` (string, required) - Session identifier

**Example Request:**
```
GET /api/session/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "intent": "high_intent",
  "selected_plan": "pro",
  "name": "Sarah Chen",
  "email": "sarah@example.com",
  "platform": "YouTube",
  "lead_captured": true,
  "turn_count": 4,
  "message_count": 8
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Session not found or expired

---

### 5. Delete Session

**`DELETE /api/session/{session_id}`**

Clear a session from memory.

**Path Parameters:**
- `session_id` (string, required) - Session to delete

**Example Request:**
```
DELETE /api/session/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "message": "Session 550e8400-e29b-41d4-a716-446655440000 deleted"
}
```

**Status Codes:**
- `200 OK` - Success (even if session didn't exist)

---

### 6. Session Statistics

**`GET /api/stats`**

Get session store statistics.

**Response:**
```json
{
  "total_sessions": 5,
  "max_sessions": 100,
  "oldest_session": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Intent Classification

The API classifies user messages into three intents:

| Intent | Description | Example Messages |
|--------|-------------|------------------|
| `greeting` | User is starting conversation or introducing themselves | "Hi", "Hello", "I'm John" |
| `product_pricing` | User asking about features, pricing, or plans | "What are your plans?", "How much does it cost?", "Tell me about features" |
| `high_intent` | User ready to buy or providing contact details | "I want to sign up", "I'll take the Pro plan", "My email is..." |

---

## Conversation Lifecycle

### 1. Starting a Conversation

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-abc-123",
    "message": "Hello!"
  }'
```

**Response:**
- Intent: `greeting`
- State: All fields null
- Reply: Welcome message

---

### 2. Information Gathering

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-abc-123",
    "message": "What pricing plans do you have?"
  }'
```

**Response:**
- Intent: `product_pricing`
- Reply: RAG-powered response with pricing details

---

### 3. Plan Selection

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-abc-123",
    "message": "I want the Pro plan"
  }'
```

**Response:**
- Intent: `high_intent`
- State: `selected_plan: "pro"`
- Reply: Confirmation + benefits of Pro

---

### 4. Lead Qualification

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-abc-123",
    "message": "My name is Sarah Chen, email is sarah@example.com, I create on YouTube"
  }'
```

**Response:**
- Intent: `high_intent`
- State: All fields populated, `lead_captured: true`
- Console output: Lead capture confirmation
- Reply: Next steps confirmation

---

## State Management

### Session State Schema

```typescript
{
  messages: Message[],           // Conversation history
  intent: string,                 // Current intent classification
  selected_plan: string | null,   // "basic" or "pro"
  name: string | null,            // User's name
  email: string | null,           // User's email
  platform: string | null,        // Content platform
  yt_channel: string | null,      // YouTube channel URL
  lead_captured: boolean,         // Lead capture status
  session_id: string,             // Session identifier
  turn_count: number,             // Number of conversation turns
  retrieved_context: string | null // Latest RAG context
}
```

### Memory Management

- **Retention**: Last 6 conversation turns (12 messages)
- **Timeout**: 1 hour of inactivity
- **Capacity**: 100 active sessions (LRU eviction)
- **Isolation**: Each session_id has independent state

---

## Lead Capture Rules

A lead is captured **automatically** when ALL conditions are met:

✅ Intent = `high_intent`  
✅ `name` is present  
✅ `email` is present  
✅ `platform` is present  
✅ `lead_captured == false` (not already captured)

**Optional fields:**
- `selected_plan` (recommended but not required)
- `yt_channel` (optional for YouTube creators)

**Console Output:**
```
============================================================
🎯 LEAD CAPTURED SUCCESSFULLY
============================================================
Name: Sarah Chen
Email: sarah@example.com
Platform: YouTube
Selected Plan: PRO
YouTube Channel: youtube.com/@sarahtech
============================================================
```

---

## Error Handling

### Common Errors

**422 Unprocessable Entity**
```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
**Fix:** Ensure request body includes required fields.

**500 Internal Server Error**
```json
{
  "detail": "Internal server error: GEMINI_API_KEY environment variable is required"
}
```
**Fix:** Set `GEMINI_API_KEY` in `.env` file.

**404 Not Found**
```json
{
  "detail": "Session not found"
}
```
**Fix:** Session expired or doesn't exist. Start new conversation.

---

## Rate Limiting (Production Recommendation)

For production deployment, implement rate limiting:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat(request: ChatRequest):
    ...
```

---

## Frontend Integration Example

### JavaScript (Fetch API)

```javascript
async function sendMessage(sessionId, message) {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message
      })
    });
    
    const data = await response.json();
    
    console.log('AI Reply:', data.reply);
    console.log('Intent:', data.intent);
    console.log('State:', data.state);
    
    return data;
  } catch (error) {
    console.error('Chat error:', error);
  }
}

// Usage
const sessionId = crypto.randomUUID();
await sendMessage(sessionId, "Hi! I'm interested in your plans.");
```

### Python (Requests)

```python
import requests
import uuid

def send_message(session_id, message):
    response = requests.post(
        'http://localhost:8000/api/chat',
        json={
            'session_id': session_id,
            'message': message
        }
    )
    return response.json()

# Usage
session_id = str(uuid.uuid4())
result = send_message(session_id, "What are your pricing plans?")
print(f"Reply: {result['reply']}")
print(f"Intent: {result['intent']}")
```

---

## Interactive Documentation

When the server is running, visit these URLs for interactive API exploration:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Both provide:
- Interactive API testing
- Schema documentation
- Request/response examples
- Try-it-out functionality

---

## Best Practices

### Session IDs

✅ **Good:**
- UUIDs: `550e8400-e29b-41d4-a716-446655440000`
- Phone numbers (WhatsApp): `+1234567890`
- User IDs: `user_12345`

❌ **Avoid:**
- Sequential numbers: `1`, `2`, `3`
- Predictable patterns
- Reusing session IDs across users

### Message Format

✅ **Good:**
- Natural language: `"I'm interested in the Pro plan"`
- Complete sentences: `"My email is john@example.com"`

❌ **Avoid:**
- Empty messages: `""`
- Only whitespace: `"   "`
- Excessively long messages (>1000 chars)

### Error Recovery

If a request fails:
1. Check server logs for details
2. Retry with exponential backoff
3. For 404 errors, create new session
4. For 500 errors, verify environment setup

---

**For more details, see the interactive docs at `/docs` after starting the server.** 🚀
