# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Complete!

The AutoStream frontend is now fully integrated with the FastAPI backend using real-time AI conversation.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│                   (localhost:5173)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ChatContainer.tsx                                  │    │
│  │  • Handles UI state                                │    │
│  │  • Manages pricing cards, confirmations           │    │
│  └──────────────┬─────────────────────────────────────┘    │
│                 │                                            │
│  ┌──────────────▼─────────────────────────────────────┐    │
│  │  useChatState Hook                                  │    │
│  │  • Session management                              │    │
│  │  • Message handling                                │    │
│  │  • Backend API integration                         │    │
│  └──────────────┬─────────────────────────────────────┘    │
│                 │                                            │
│  ┌──────────────▼─────────────────────────────────────┐    │
│  │  API Client (lib/api.ts)                           │    │
│  │  • HTTP requests to backend                        │    │
│  │  • Error handling                                  │    │
│  │  • TypeScript types                                │    │
│  └──────────────┬─────────────────────────────────────┘    │
└─────────────────┼─────────────────────────────────────────┘
                  │
                  │ HTTP POST /api/chat
                  │
┌─────────────────▼─────────────────────────────────────────┐
│                FastAPI Backend                             │
│                (localhost:8000)                            │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  /api/chat Endpoint                                 │  │
│  │  • Receives user message                           │  │
│  │  • Returns AI response + state                     │  │
│  └──────────────┬─────────────────────────────────────┘  │
│                 │                                          │
│  ┌──────────────▼─────────────────────────────────────┐  │
│  │  LangGraph Workflow                                 │  │
│  │  • Intent classification                           │  │
│  │  • RAG retrieval                                   │  │
│  │  • Lead capture logic                              │  │
│  └──────────────┬─────────────────────────────────────┘  │
│                 │                                          │
│  ┌──────────────▼─────────────────────────────────────┐  │
│  │  Gemini 1.5 Flash                                   │  │
│  │  • Generates AI responses                          │  │
│  │  • Context-aware conversations                     │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 Files Created/Modified

### **New Files:**
1. **`frontend/src/lib/api.ts`** - API client for backend communication
2. **`frontend/.env`** - Environment variables (API URL)
3. **`frontend/INTEGRATION.md`** - This file

### **Modified Files:**
1. **`frontend/src/hooks/useChatState.ts`** - Added `sendMessageToBackend()` function
2. **`frontend/src/components/chat/ChatContainer.tsx`** - Updated to use backend API

---

## 🚀 How It Works

### **1. User Sends Message**
```typescript
// User types "What are your pricing plans?"
handleUserMessage("What are your pricing plans?")
```

### **2. Frontend Calls Backend**
```typescript
const response = await api.sendMessage(sessionId, message);
// POST http://localhost:8000/api/chat
// Body: { session_id: "abc123", message: "What are your pricing plans?" }
```

### **3. Backend Processes with LangGraph**
```
Intent Classification → RAG Retrieval → Response Generation → Lead Capture (if ready)
```

### **4. Backend Returns Response**
```json
{
  "reply": "Great question! We have two plans...",
  "intent": "product_pricing",
  "state": {
    "selected_plan": null,
    "name": null,
    "email": null,
    "platform": null,
    "yt_channel": null,
    "lead_captured": false,
    "turn_count": 2
  }
}
```

### **5. Frontend Updates UI**
- Adds AI message to chat
- Updates intent level
- Shows pricing cards if needed
- Updates lead progress panel

---

## 🔄 Conversation Flow

### **Example: Complete Lead Capture**

```
User: "Hi"
  ↓
Backend: Intent = greeting
  ↓
AI: "Hi there! 👋 I'm the AutoStream AI Assistant..."

User: "What are your pricing plans?"
  ↓
Backend: Intent = product_pricing, RAG retrieves pricing info
  ↓
AI: "Great question! We have two plans..."
Frontend: Shows pricing cards

User: Clicks "Pro Plan"
  ↓
Backend: Intent = high_intent, selected_plan = "pro"
  ↓
AI: "Excellent choice! What's your name?"

User: "Sarah Chen"
  ↓
Backend: Extracts name, updates state
  ↓
AI: "Nice to meet you, Sarah! What's your email?"

User: "sarah@example.com"
  ↓
Backend: Extracts email, updates state
  ↓
AI: "Perfect! Which platform do you create content for?"

User: "YouTube"
  ↓
Backend: All fields present → Lead Capture Tool executes
  ↓
AI: "Thanks Sarah! You'll receive an email at sarah@example.com..."
Frontend: Shows success card, displays "Lead captured! 🎉"
```

---

## 🎯 Key Features

### ✅ **Real-Time AI Responses**
- Every message goes through Gemini 1.5 Flash
- Context-aware conversations (5-6 turn memory)
- No hardcoded responses

### ✅ **Automatic Lead Capture**
- Backend detects when all fields are present
- Triggers lead capture tool automatically
- Frontend shows success notification

### ✅ **State Synchronization**
- Backend maintains session state
- Frontend syncs with backend state
- Lead progress panel updates in real-time

### ✅ **Error Handling**
- Graceful fallbacks if backend is down
- Toast notifications for errors
- Retry logic built-in

### ✅ **Session Management**
- Each session has unique ID
- Sessions persist in backend (1 hour timeout)
- Can switch between sessions

---

## 🧪 Testing the Integration

### **1. Start Backend**
```bash
cd autostream-backend
.\run_server.ps1
# Backend runs on http://localhost:8000
```

### **2. Start Frontend**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### **3. Test Conversation**
1. Open http://localhost:5173
2. Type "Hi" → Should get AI greeting
3. Type "What are your plans?" → Should show pricing cards
4. Click "Pro Plan" → Should ask for name
5. Provide name, email, platform → Should capture lead

### **4. Verify Backend**
- Check backend console for lead capture output:
```
============================================================
🎯 LEAD CAPTURED SUCCESSFULLY
============================================================
Name: Sarah Chen
Email: sarah@example.com
Platform: YouTube
Selected Plan: PRO
============================================================
```

---

## 🔧 Configuration

### **Change API URL**
Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:8000  # Local development
# VITE_API_URL=https://api.autostream.ai  # Production
```

### **CORS Configuration**
Backend already configured to allow all origins (development):
```python
# autostream-backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For production**, update to specific origin:
```python
allow_origins=["https://autostream.ai"],
```

---

## 📊 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Send message, get AI response |
| `/api/session/{id}` | GET | Get session state |
| `/api/session/{id}` | DELETE | Delete session |
| `/api/stats` | GET | Get session statistics |
| `/health` | GET | Health check |

---

## 🐛 Troubleshooting

### **"Failed to send message" Error**
1. Check if backend is running: `http://localhost:8000/health`
2. Check browser console for CORS errors
3. Verify `.env` file has correct `VITE_API_URL`

### **Backend Returns 500 Error**
1. Check backend console for error details
2. Verify `GEMINI_API_KEY` is set in `autostream-backend/.env`
3. Check if RAG pipeline initialized successfully

### **No AI Response**
1. Check network tab in browser DevTools
2. Verify request is reaching backend
3. Check backend logs for errors

### **Lead Not Capturing**
1. Verify all fields are filled (name, email, platform)
2. Check backend console for lead capture output
3. Ensure intent is "high_intent"

---

## 🚀 Next Steps

### **Immediate:**
- ✅ Integration complete
- ✅ Real-time AI conversations working
- ✅ Lead capture functional

### **Enhancements:**
1. **Add Loading States** - Show skeleton loaders while waiting for AI
2. **Message Retry** - Allow users to retry failed messages
3. **Session Persistence** - Save sessions to localStorage
4. **Analytics** - Track conversation metrics
5. **A/B Testing** - Test different prompts/flows

### **Production:**
1. **Environment Variables** - Use production API URL
2. **Error Monitoring** - Add Sentry or similar
3. **Rate Limiting** - Implement on backend
4. **Authentication** - Add user authentication
5. **Database** - Replace in-memory store with Redis/PostgreSQL

---

## ✨ What's Different from Mock?

| Feature | Before (Mock) | After (Backend) |
|---------|---------------|-----------------|
| **Responses** | Hardcoded | AI-generated |
| **Intent** | Keyword matching | Gemini classification |
| **Lead Capture** | Manual trigger | Automatic detection |
| **Context** | Local state only | 5-6 turn memory |
| **Pricing Info** | Static | RAG-retrieved |
| **State Sync** | Frontend only | Backend + Frontend |

---

## 📚 Documentation

- **Backend README**: `autostream-backend/README.md`
- **API Docs**: http://localhost:8000/docs (when running)
- **Architecture**: `autostream-backend/ARCHITECTURE.md`
- **Getting Started**: `autostream-backend/GETTING_STARTED.md`

---

**Integration Status:** ✅ **COMPLETE & WORKING**

**Built with:** React + TypeScript + FastAPI + LangGraph + Gemini 1.5 Flash
