# DeepCorp AI

> AI-powered company intelligence agent that automatically researches any company and generates a one-page investment-grade report.

**Agent Forge Hackathon — Track 2: AI Agents & Automation**

## What It Does

Enter a company name or website → DeepCorp AI agents autonomously:

1. **Scrape** authoritative data sources (financial databases, consulting reports, World Bank, news)
2. **Browse** the company's website and social media for real-time insights
3. **Analyze** market position, capital background, and investment potential
4. **Generate** a beautiful one-page company intelligence report

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Web Scraping | **Bright Data** | Enterprise-grade data collection from financial databases, news sites, and public records |
| Browser Automation | **ActionBook** | Navigate company websites, extract dynamic content, handle authentication |
| Context Management | **Acontext** | Manage multi-step agent workflows with Session, Task, and Skill primitives |
| Backend | **FastAPI** (Python) | REST API, agent orchestration, report generation |
| AI Model | **Claude API** | Data analysis, insight generation, report writing |
| Frontend | **React** | Search interface and one-page report viewer |
| Deployment | **Zeabur** | One-click deployment |

## Features

- **Company Search** — Enter any company name or URL
- **Multi-Source Intelligence** — Aggregates data from 10+ authoritative sources
- **Market Analysis** — Industry position, competitors, market trends
- **Capital Background** — Funding history, investors, valuation
- **Investment Score** — AI-generated investment recommendation
- **Stock Insights** — Trading data and buy/sell signals (for public companies)
- **One-Page Report** — Auto-generated PDF-ready summary with charts

## Data Sources

- Company official websites & filings
- World Bank Open Data
- Financial news aggregators
- SEC / SGX public filings
- Crunchbase-style startup databases
- Industry research reports
- Social media sentiment

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Bright Data API key
- ActionBook API key
- Acontext API key
- Claude API key

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Fill in your API keys
uvicorn api.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Architecture

```
User Input (Company Name/URL)
        │
        ▼
┌─────────────────────┐
│   FastAPI Backend    │
│   (Orchestrator)     │
└──────┬──────────────┘
       │
       ├──► Bright Data Agent ──► Financial DBs, News, World Bank
       │
       ├──► ActionBook Agent ──► Company Website, Social Media
       │
       └──► Acontext Manager ──► Workflow State & Context
                │
                ▼
        ┌──────────────┐
        │  Claude AI    │
        │  (Analysis)   │
        └──────┬───────┘
               │
               ▼
     One-Page Intelligence Report
```

## Team

- **Jackson** — Solo Developer

## License

MIT
