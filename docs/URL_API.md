# API Keys & URLs Reference

Version: 1.0.0
Last Updated: 2026-02-05

---

## External APIs

### Exa.ai (Semantic Web Search)

| Property | Value |
|----------|-------|
| **Purpose** | Semantic search for Reddit, trends, subcultures |
| **API Key** | `5d8ea719-42c2-4732-8120-13b69538077e` |
| **Base URL** | `https://api.exa.ai` |
| **Documentation** | https://docs.exa.ai |
| **Dashboard** | https://dashboard.exa.ai |
| **Pricing** | Pay-as-you-go (1000 free searches to start) |

#### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST /search` | Semantic search with neural understanding |
| `POST /contents` | Retrieve full page content |

#### Rate Limits

- Free tier: 1000 searches
- Paid: Varies by plan

---

### Google Cloud Platform

| Property | Value |
|----------|-------|
| **Project ID** | `participation-translator` |
| **Region** | `us-central1` |
| **Service Account** | `sa-key.json` (local) |

#### APIs Enabled

- Vertex AI
- Cloud Firestore
- Cloud Storage
- Google Slides API
- Secret Manager

---

#### Tavily (Backup Semantic Search)

| Property | Value |
|----------|-------|
| **Purpose** | Backup semantic search, AI answers |
| **API Key** | *(Add your key to .env)* |
| **Base URL** | `https://api.tavily.com` |
| **Documentation** | https://docs.tavily.com |
| **Dashboard** | https://app.tavily.com |
| **Pricing** | Free tier: 1000 searches/month |

#### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST /search` | Web search with semantic understanding |
| Answer feature | AI-generated answers from search |

#### Features

- Search depth: basic or advanced
- Topic filtering: general or news
- Date range filtering for news
- AI-generated answers included

---

## Future Integrations (Pending)

| Service | Purpose | Status |
|---------|---------|--------|
| Gemini Grounding | Search/summarization | Planned |
| Perplexity | Failover summarization | Planned |

---

## Internal Endpoints

| Endpoint | Purpose | Port |
|----------|---------|------|
| Next.js Dev | Frontend | 3000 |
| API Routes | Backend | 3000 |

---

## Environment Variables

```bash
# Exa.ai (Primary)
EXA_API_KEY=5d8ea719-42c2-4732-8120-13b69538077e

# Tavily (Backup)
TAVILY_API_KEY=your-tavily-api-key

# GCP
GCP_PROJECT_ID=participation-translator
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./sa-key.json

# Future
# PERPLEXITY_API_KEY=
```

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-05
