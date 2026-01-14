# Property Insights

AI-powered real estate analysis system that integrates data from multiple sources, resolves conflicts, and delivers reliable property insights.

## Problem Statement

Real estate information is scattered across multiple platforms (Zillow, Redfin, public records), often with inconsistent values and missing data. This system demonstrates how AI can integrate disparate sources, identify conflicts, and provide unified, trustworthy analysis.

## Tech Stack

- **Backend**: FastAPI, Python 3.9+
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI**: Ollama (llama3.2) - local LLM for data analysis
- **Data**: Mock sources simulating Zillow, Redfin, and public records

## Key Features

**Multi-Source Data Integration**
- Fetches property data from 3 simulated sources
- Each source contains realistic inconsistencies and missing fields
- Example conflicts: bedroom counts, price variations, square footage discrepancies

**AI-Powered Conflict Resolution**
- Analyzes all sources to identify conflicts
- Determines most reliable value with detailed reasoning
- Assigns confidence scores to each field
- Explains source reliability (e.g., "Redfin data more recent than Zillow")

**Comprehensive Analysis**
- Data quality assessment with overall confidence score
- Visual conflict resolution with AI reasoning
- Missing information tracking
- Actionable recommendations for verification

## Architecture

```
property-insights/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point
│   │   ├── data/
│   │   │   ├── mock_properties.py     # Property database (5 properties)
│   │   │   └── mock_sources.py        # 3 data sources with conflicts
│   │   ├── models/property.py         # Pydantic data models
│   │   ├── services/
│   │   │   ├── llm_service.py         # Ollama integration
│   │   │   └── property_service.py    # Multi-source analysis logic
│   │   └── api/routes/property.py     # REST endpoints
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx                   # Main application
    │   └── globals.css
    ├── components/
    │   ├── SearchSection.tsx          # Property search interface
    │   ├── AnalysisReport.tsx         # Analysis orchestration
    │   ├── UnifiedSummary.tsx         # Main analysis display
    │   ├── DataSourcesView.tsx        # Source comparison
    │   └── ConflictResolutionView.tsx # Conflict visualization
    └── lib/
        ├── api.ts                     # API client
        ├── types.ts                   # TypeScript definitions
        └── mockData.ts                # Mock data for immediate display
```

## Prerequisites

- Python 3.9+ (Conda or venv)
- Node.js 18+
- Ollama with llama3.2 model

Install Ollama from https://ollama.ai, then verify:
```bash
ollama list
ollama run llama3.2:latest "test"
```

## Quick Start

**Backend:**
```bash
cd backend
conda create -n property-insights python=3.11 -y
conda activate property-insights
pip install -r requirements.txt
cd app
python3 main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Configuration

**Backend** (`backend/.env`):
```bash
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## How It Works

1. **Search**: User searches for property by address/city/zip
2. **Fetch**: System retrieves data from 3 mock sources (with intentional conflicts)
3. **Analyze**: AI performs 3 LLM calls:
   - Resolve conflicts field-by-field with reasoning
   - Generate unified summary with quality assessment
   - Create actionable insights
4. **Display**: Frontend shows raw sources, conflicts, resolution, and analysis

**Example Conflict Resolution:**

```
Field: bedrooms
Sources: Zillow (5), Redfin (4), Public Records (4)
AI Decision: 4 bedrooms (85% confidence)
Reasoning: "Redfin and public records agree. Zillow likely counting 
finished attic as bedroom, which may not meet code requirements."
```

## API Endpoints

**GET** `/api/property/search?q={query}`
- Search properties by address, city, or zip
- Returns: List of PropertySearchResult

**GET** `/api/property/{property_id}/analyze`
- Analyze property from multiple sources
- Returns: PropertyAnalysis with conflict resolution

See http://localhost:8000/docs for interactive documentation.

## Design Decisions

**Mock Data Sources**
- Real APIs (Zillow/Redfin) require authentication, have rate limits, and legal constraints
- Mock sources allow controlled demonstration of conflict resolution
- Easy to add realistic inconsistencies for testing

**Local LLM (Ollama)**
- Pros: Free, private, no rate limits, works offline
- Cons: Slower (20-40s per analysis), less capable than GPT-4
- Trade-off: Accessibility and privacy over speed

**No Database**
- Simplifies setup and deployment
- Focuses on core conflict resolution logic
- Easy to add PostgreSQL/SQLite later

## Approach & Trade-offs

**Multi-Source Integration**
- Simulates real-world scenario where data is scattered
- Each source has different strengths (Redfin: recent prices, Public: official records)
- AI learns to weigh source reliability contextually

**Conflict Resolution Strategy**
- LLM analyzes conflicts with domain knowledge
- Considers recency, source authority, and cross-validation
- Provides transparency through reasoning
- Assigns confidence scores for decision support

**Performance vs Accuracy**
- 3 LLM calls per analysis (40-60s total)
- Could reduce to 1 call but lose granular reasoning
- Trade-off: Detailed analysis over speed

## Future Enhancements

**Short-term**
- Real API integration with Zillow/Redfin
- Streaming LLM responses for real-time feedback
- Database persistence for analysis history
- PDF report export

**Long-term**
- RAG system with real estate knowledge base
- Fine-tuned model for real estate domain
- Image analysis from listing photos
- Predictive pricing models
