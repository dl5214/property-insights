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
│   │   ├── main.py            # FastAPI app & entry point
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

1. **Python 3.9+** and **Conda** (or venv)
   ```bash
   python3 --version
   conda --version
   ```

2. **Node.js 18+** and **npm**
   ```bash
   node --version
   npm --version
   ```

3. **Ollama** (must be installed and running)
   ```bash
   # Install from https://ollama.ai
   
   # Verify installation
   ollama list
   
   # Ensure llama3.2 model is available
   ollama run llama3.2:latest "reply with: OK"
   # Should output: OK
   ```

## Quick Start

### 1. Backend Setup

**Option A: Using Conda (Recommended)**
```bash
cd backend

# Create conda environment
conda create -n property-insights python=3.11 -y
conda activate property-insights

# Install dependencies
pip install -r requirements.txt

# (Optional) Create .env file for custom configuration
cp .env.example .env
```

**Option B: Using venv**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
conda activate property-insights  # or: source venv/bin/activate
cd app
python3 main.py
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

1. Ensure Ollama is running: `ollama list`
2. Open http://localhost:3000 in your browser
3. Fill in property information and click "Analyze Property"
4. Wait 10-30 seconds for AI analysis to complete

## Default Ports

| Service  | Port | URL |
|----------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend  | 8000 | http://localhost:8000 |
| Ollama   | 11434 | http://localhost:11434 |

**Port Conflicts?**
- Backend: Edit `backend/.env` and set `API_PORT=8001`
- Frontend: Run `npm run dev -- -p 3001`
- Ollama: Edit `backend/.env` and set `OLLAMA_HOST=http://localhost:YOUR_PORT`

## Configuration

### Backend Environment Variables

Create `backend/.env` (optional, defaults work out of the box):

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

Request body (all fields optional, provide at least one):
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

Response:
```json
{
  "property_summary": {
    "key_features": ["3 bedrooms", "2.5 bathrooms"],
    "property_type": "Single Family Home",
    "highlights": ["Modern updates", "Prime location"],
    "concerns": ["Price above market average"]
  },
  "analysis": "Comprehensive analysis text...",
  "insights": ["Key insight 1", "Key insight 2"],
  "confidence_score": 0.85
}
```

## Architecture Decisions

### Why local LLM (Ollama)?
- ✅ Free, no API costs
- ✅ Complete data privacy
- ✅ No rate limits
- ❌ Limited model capabilities vs GPT-4
- ❌ Requires local compute resources

### Why separate frontend/backend?
- Independent development and deployment
- API can be reused by other clients
- Clear separation of concerns

### Why no database?
- Simplifies MVP development
- No maintenance overhead
- Easy to add later (SQLite/PostgreSQL)

## Future Enhancements

**Short-term:** Streaming responses, multi-language support, public data integration, enhanced validation

**Medium-term:** User authentication, database persistence, PDF export, property comparison, image analysis

**Long-term:** RAG with real estate knowledge base, fine-tuned models, real-time market data, mobile app
