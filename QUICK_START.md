# ⚡ GROQ QUICK START

## 🔑 Get API Key
https://console.groq.com/keys

## 📝 Add to .env
```bash
GROQ_API_KEY=gsk_your_key_here
```

## 🚀 Start Backend
```powershell
cd autostream-backend
.\run_server.ps1
```

## 🌐 Start Frontend
```powershell
cd frontend
npm run dev
```

## 🧪 Test
http://localhost:5173

---

## ⚡ Why Groq?
- **10-100x faster** than GPUs
- **Sub-second responses**
- **Free tier**: 30 req/min
- **Model**: Llama 3.3 70B

---

## 📊 Architecture
```
User → Frontend → FastAPI → Groq (Llama 3.3) → Response
                    ↓
              Local RAG (FAISS)
```

**Single LLM call per message = Maximum Speed!**
