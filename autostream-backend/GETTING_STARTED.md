# Getting Started with AutoStream Backend

## 📋 Prerequisites Checklist

Before starting the server, make sure you have:

- [x] Python 3.9+ installed
- [x] Virtual environment activated
- [x] Dependencies installed (`requirements.txt`)
- [ ] **Gemini API Key** (Get from https://makersuite.google.com/app/apikey)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Set Your API Key

Edit the `.env` file in the `autostream-backend` directory:

```bash
# Open .env file and add your key:
GEMINI_API_KEY=your_actual_api_key_here
```

**Where to get the key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

### Step 2: Verify Setup

```bash
# Run the environment checker
python check_setup.py
```

You should see all ✅ green checkmarks.

### Step 3: Start the Server

**Option A - PowerShell Script (Recommended):**
```powershell
.\run_server.ps1
```

**Option B - Direct Python:**
```bash
python -m app.main
```

**Option C - Uvicorn:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🧪 Testing the Backend

### Method 1: Interactive API Docs

Once the server is running, open your browser:

**Swagger UI:** http://localhost:8000/docs

Try the `/api/chat` endpoint directly in the browser!

### Method 2: Test Script

```bash
# Run the automated test conversation
python test_agent.py
```

This will simulate a complete conversation from greeting to lead capture.

### Method 3: cURL Commands

```bash
# Test greeting
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"session_id\": \"test-123\", \"message\": \"Hi!\"}"

# Test pricing question
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"session_id\": \"test-123\", \"message\": \"What are your plans?\"}"
```

---

## ✅ What Should Happen

When the server starts successfully, you'll see:

```
AutoStream AI Assistant Backend
================================================
Model: gemini-1.5-flash
Max conversation turns: 6
Session timeout: 3600s
================================================
Server ready! 🚀
================================================
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🧭 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check & API info |
| `/api/chat` | POST | Main conversation endpoint |
| `/api/session/{id}` | GET | Get session state |
| `/api/session/{id}` | DELETE | Clear session |
| `/api/stats` | GET | Session statistics |
| `/docs` | GET | Interactive API docs |

---

## 🔍 Troubleshooting

### "GEMINI_API_KEY environment variable is required"

→ Your API key is not set in `.env`. Add it and restart.

### "Vector store initialization failed"

→ Make sure `app/data/knowledge.md` exists (it should be created automatically).

### "Module not found" errors

→ Install dependencies:
```bash
cd ..
pip install -r requirements.txt
cd autostream-backend
```

### Port 8000 already in use

→ Change the port:
```bash
uvicorn app.main:app --reload --port 8001
```

---

## 📖 Next Steps

1. **Test the agent** - Run through a conversation
2. **Customize prompts** - Edit `app/agent/prompts.py`
3. **Update knowledge base** - Edit `app/data/knowledge.md`
4. **Integrate with UI** - Point your frontend to `http://localhost:8000/api/chat`
5. **Add CRM integration** - Replace mock lead capture in `app/agent/tools.py`

---

## 🎯 Expected Lead Capture Flow

The agent will:

1. **Greet** the user (Intent: `greeting`)
2. **Answer questions** about pricing/features (Intent: `product_pricing`)
3. **Qualify the lead** when they show interest (Intent: `high_intent`)
4. **Collect information** naturally:
   - Name
   - Email
   - Platform (YouTube, Twitch, etc.)
   - Plan selection (Basic/Pro)
5. **Capture the lead** automatically when all fields are present

Check the console for:
```
============================================================
🎯 LEAD CAPTURED SUCCESSFULLY
============================================================
Name: John Doe
Email: john@example.com
Platform: YouTube
Selected Plan: PRO
============================================================
```

---

## 💡 Pro Tips

- **Session IDs**: Use UUIDs for real sessions, phone numbers for WhatsApp
- **Memory**: Sessions automatically expire after 1 hour of inactivity
- **Turn limit**: Only last 6 turns are kept (configurable in `config.py`)
- **RAG accuracy**: The agent will ONLY use knowledge from `knowledge.md`

---

## 📚 Documentation

- **Full README**: See `README.md` for architecture details
- **API Docs**: Visit `/docs` while server is running
- **Code Structure**: All prompts in `prompts.py`, all tools in `tools.py`

---

**Ready to convert conversations into leads? Start the server and test it out! 🚀**
