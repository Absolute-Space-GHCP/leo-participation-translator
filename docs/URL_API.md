# API Keys & URLs Reference

Version: 1.1.0
Last Updated: 2026-02-06

---

## Secret Management

All external API keys are stored in **Google Cloud Secret Manager** (project: `participation-translator`). Keys are encrypted at rest with Google-managed encryption and accessed at runtime through IAM-controlled policies.

| Logical Name | Secret Manager ID | Used By |
|---|---|---|
| `EXA_API_KEY` | `exa-api-key` | `src/lib/cultural/exa.ts` |
| `TAVILY_API_KEY` | `tavily-api-key` | `src/lib/cultural/tavily.ts` |

**Runtime Resolution (via `src/lib/secrets/index.ts`):**
1. In-memory cache (avoids repeated API calls)
2. GCP Secret Manager (production — encrypted, IAM-controlled)
3. Environment variable fallback (local dev convenience)

**Adding a new key:**
```bash
echo -n "your-key-value" | gcloud secrets create secret-id \
  --project=participation-translator \
  --replication-policy="automatic" \
  --data-file=-

# Grant service account access
gcloud secrets add-iam-policy-binding secret-id \
  --project=participation-translator \
  --member="serviceAccount:participation-translator-sa@participation-translator.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Then add the mapping in `src/lib/secrets/index.ts` → `SECRET_MAP`.

---

## External APIs

### Exa.ai (Semantic Web Search)

| Property | Value |
|----------|-------|
| **Purpose** | Semantic search for Reddit, trends, subcultures |
| **API Key** | Stored in GCP Secret Manager: `exa-api-key` |
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
| **API Key** | Stored in GCP Secret Manager: `tavily-api-key` |
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
# ⚠️  API keys are stored in GCP Secret Manager — NOT in env vars or this file.
#     The application reads them at runtime via src/lib/secrets/index.ts

# GCP (required — tells the app which project to query Secret Manager in)
GCP_PROJECT_ID=participation-translator
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./sa-key.json

# Secret Manager Secrets (for reference only — do NOT paste keys here):
#   exa-api-key       → EXA_API_KEY
#   tavily-api-key    → TAVILY_API_KEY
#   (future) perplexity-api-key → PERPLEXITY_API_KEY

# Local dev override (optional — only if Secret Manager is unreachable):
# EXA_API_KEY=<get from Secret Manager or dashboard.exa.ai>
# TAVILY_API_KEY=<get from Secret Manager or app.tavily.com>
```

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-06
