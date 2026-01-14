# Property Insights

AI-powered real estate information analysis system that transforms scattered, inconsistent property data into clear, comprehensive reports to help buyers make confident decisions.

## Tech Stack

- **Backend**: FastAPI (Python 3.9+)
- **Frontend**: Next.js 14 (React, TypeScript)
- **AI**: Ollama (llama3.2) - runs locally
- **Styling**: Tailwind CSS

## Project Structure

```
property-insights/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── config.py          # Configuration
│   │   ├── models/            # Pydantic data models
│   │   ├── services/          # Business logic
│   │   │   ├── llm_service.py      # Ollama integration
│   │   │   └── property_service.py # Property analysis
│   │   └── api/routes/        # API endpoints
│   └── requirements.txt
├── frontend/                  # Next.js frontend
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # API client & types
│   └── package.json
└── README.md
```

## Prerequisites

1. **Python 3.9+**
   ```bash
   python --version  # or python3 --version
   ```

2. **Node.js 18+**
   ```bash
   node --version
   ```

3. **Ollama** (must be installed and running)
   ```bash
   # Install Ollama from https://ollama.ai
   
   # Verify installation
   ollama list
   
   # Ensure llama3.2 model is available
   ollama run llama3.2:latest "reply with: OK"
   # Should output: OK
   ```

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional, defaults work out of the box)
cp .env.example .env
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies (no need to create new project!)
npm install
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
source venv/bin/activate  # if not already activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 4. Verify Everything Works

1. Ensure Ollama is running (check with `ollama list`)
2. Open http://localhost:3000 in your browser
3. Fill in property information and click "Analyze Property"
4. Wait 10-30 seconds for AI analysis to complete

## Default Ports

| Service  | Port | URL |
|----------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend  | 8000 | http://localhost:8000 |
| Ollama   | 11434 | http://localhost:11434 |

**Port Conflicts?** Modify these files:
- Backend: `backend/.env` (set `API_PORT`)
- Frontend: `frontend/package.json` (change dev script to `next dev -p 3001`)
- Ollama: Set `OLLAMA_HOST` in `backend/.env`

## Configuration

### Backend Environment Variables

Create `backend/.env` (optional):

```bash
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest

# API Configuration
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend Environment Variables

Create `frontend/.env.local` (optional):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

### Main Endpoint

**POST** `/api/property/analyze`

Request body:
```json
{
  "address": "123 Main St, San Francisco, CA",
  "price": 1200000,
  "bedrooms": 3,
  "bathrooms": 2.5,
  "square_feet": 1800,
  "year_built": 2005,
  "description": "Beautiful modern home..."
}
```

All fields are optional. Provide at least one field for analysis.

Response:
```json
{
  "property_summary": {
    "key_features": ["3 bedrooms", "2.5 bathrooms"],
    "property_type": "Single Family Home",
    "highlights": [...],
    "concerns": [...]
  },
  "analysis": "Comprehensive analysis text...",
  "insights": ["Key insight 1", "Key insight 2"],
  "confidence_score": 0.85
}
```

## Troubleshooting

### Backend won't start

**Issue**: `Module not found` errors
```bash
# Solution: Ensure virtual environment is activated and dependencies installed
source venv/bin/activate
pip install -r requirements.txt
```

**Issue**: `Cannot connect to Ollama`
```bash
# Solution: Start Ollama and verify it's running
ollama list
ollama serve  # if not running
```

### Frontend won't start

**Issue**: `Cannot find module` errors
```bash
# Solution: Install dependencies
cd frontend
npm install
```

**Issue**: Port 3000 already in use
```bash
# Solution: Use a different port
npm run dev -- -p 3001
# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

### Analysis takes too long or times out

- Check Ollama is running: `ollama list`
- Restart Ollama: `killall ollama && ollama serve`
- Try a simpler prompt (less text in description)
- Check Ollama logs for errors

### CORS errors in browser

- Verify backend is running on port 8000
- Check `backend/.env` has correct `CORS_ORIGINS`
- Restart backend after changing configuration

## Development Notes

### Architecture Decisions

**Why local LLM (Ollama)?**
- ✅ Free, no API costs
- ✅ Complete data privacy
- ✅ No rate limits
- ❌ Limited model capabilities compared to GPT-4
- ❌ Requires local compute resources

**Why separate frontend/backend?**
- Independent development and deployment
- API can be reused by other clients
- Clear separation of concerns

**Why no database?**
- Simplifies MVP development
- No maintenance overhead
- Easy to add later (SQLite/PostgreSQL)

### Key Design Patterns

1. **Service Layer** (`services/`): Encapsulates business logic and external API calls
2. **Pydantic Models**: Strong typing and validation for API requests/responses
3. **Error Handling**: Graceful degradation when LLM is unavailable

## Future Enhancements

### Short-term
- Streaming responses for real-time generation feedback
- Multi-language support (Chinese/English)
- Integration with public property data sources
- Data validation and enhanced error handling

### Medium-term
- User authentication and session management
- Database persistence for analysis history
- PDF report export
- Property comparison feature
- Image analysis (property photos)

### Long-term
- RAG (Retrieval Augmented Generation) with real estate knowledge base
- Fine-tuned model for real estate domain
- Real-time market data integration
- Mobile application
