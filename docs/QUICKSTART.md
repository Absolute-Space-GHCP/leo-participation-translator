# Quickstart Guide

Version: 1.1.0
Last Updated: 2026-02-13

---

Get the Participation Translator running locally in 10 minutes.

---

## 1. Prerequisites

- **Node.js 22 LTS** — `node --version` (must be ≥ 20)
- **GCP CLI** — `gcloud --version` (install from https://cloud.google.com/sdk)
- **GCP access** to the `participation-translator` project

---

## 2. Clone & Install

```bash
git clone https://github.com/Absolute-Space-GHCP/leo-participation-translator.git
cd leo-participation-translator
npm install
```

---

## 3. Authenticate

```bash
gcloud auth login --update-adc
gcloud config set project participation-translator
```

This gives the app access to Firestore, Vertex AI, Cloud Storage, and Secret Manager.

---

## 4. Configure Environment

```bash
cp .env.example .env
```

The defaults work for most cases. API keys (Exa, Tavily) are fetched from Secret Manager automatically. Only override in `.env` if you need local fallbacks.

---

## 5. Verify

```bash
# Check vector store connectivity
npm run stats

# Test retrieval
npm run retrieve -- "participation strategy for automotive brand"

# Test cultural intelligence
npm run cultural -- search "Gen Z trends 2026"
```

---

## 6. Common Workflows

### Ingest a Presentation

```bash
# Convert PPTX to Markdown (optional — for version control)
npm run convert -- -i data/presentations/MyDeck.pptx -o data/markdown/MyDeck.md

# Dry run (preview without indexing)
npm run ingest -- data/presentations/MyDeck.pptx --dry-run

# Full ingest (parse → embed → index)
npm run ingest -- data/presentations/MyDeck.pptx
```

### Search the Knowledge Base

```bash
# Semantic search
npm run retrieve -- "brand credibility Philadelphia cream cheese"

# With filters
npm run retrieve -- "VW participation mechanics" --client VW --top-k 5
```

### Cultural Intelligence

```bash
# Trend search
npm run cultural -- search "dairy trends millennials"

# Sentiment analysis
npm run cultural -- sentiment "cream cheese is having a moment"

# AI answer (Tavily)
npm run cultural -- answer "What are Gen Z's favorite dairy brands?"
```

---

## 7. Frontend (Web UI)

```bash
cd app
npm install
npx next dev --port 3005
# Opens at http://localhost:3005
```

**Authentication:** All routes require Google OAuth login. Only allowlisted JL emails can access:
- `charleys@johannesleonardo.com`
- `leop@johannesleonardo.com`
- `janj@johannesleonardo.com`

**Production URL:** `https://participation-translator-904747039219.us-central1.run.app`

---

## Next Steps

- Read `CLAUDE.md` for full project context
- Read `PLAN.md` for the implementation roadmap
- Read `docs/ARCHITECTURE-PARTICIPATION-TRANSLATOR.md` for the technical deep-dive
- Read `docs/GCP_SETUP.md` if you need to set up GCP from scratch

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
