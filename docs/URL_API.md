# API Keys & URLs Reference

Version: 1.2.0
Last Updated: 2026-02-13

---

## Secret Management

All external API keys are stored in **Google Cloud Secret Manager** (project: `participation-translator`). Keys are encrypted at rest with Google-managed encryption and accessed at runtime through IAM-controlled policies.

| Logical Name | Secret Manager ID | Used By |
|---|---|---|
| `EXA_API_KEY` | `exa-api-key` | `app/src/lib/cultural.ts`, `src/lib/cultural/exa.ts` |
| `TAVILY_API_KEY` | `tavily-api-key` | `app/src/lib/cultural.ts`, `src/lib/cultural/tavily.ts` |
| `ANTHROPIC_API_KEY` | (env var only) | `app/src/lib/claude.ts` |

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

### Anthropic (Claude API)

| Property | Value |
|----------|-------|
| **Purpose** | Primary LLM for blueprint generation (Claude Sonnet 4.5) |
| **API Key** | Environment variable: `ANTHROPIC_API_KEY` |
| **Base URL** | `https://api.anthropic.com` |
| **Documentation** | https://docs.anthropic.com |
| **Console** | https://console.anthropic.com |
| **Pricing** | Per-token (input + output) |

#### Models Used

| Model | Purpose |
|-------|---------|
| `claude-sonnet-4-5-20250514` | Primary generation (via Direct API) |
| `claude-sonnet-4-5-v2@20250514` | Fallback (via Vertex AI) |

---

### Google Cloud Platform

| Property | Value |
|----------|-------|
| **Project ID (infra)** | `participation-translator` |
| **Project ID (Cloud Run)** | `jl-participation-translator` |
| **Region** | `us-central1` |
| **Service Account** | `participation-translator-sa@participation-translator.iam.gserviceaccount.com` |
| **Cloud Run URL** | `https://participation-translator-904747039219.us-central1.run.app` |

#### APIs Enabled

- Vertex AI (embeddings, Claude fallback)
- Cloud Firestore (vector store, documents, chunks)
- Cloud Storage (presentation files, exports)
- Cloud Build (Docker image builds)
- Artifact Registry (Docker image storage)
- Secret Manager
- Cloud Run

---

### Google OAuth (Authentication)

| Property | Value |
|----------|-------|
| **Purpose** | User authentication for the web UI |
| **Client ID** | Environment variable: `GOOGLE_OAUTH_CLIENT_ID` |
| **Client Secret** | Environment variable: `GOOGLE_OAUTH_CLIENT_SECRET` |
| **Console** | https://console.cloud.google.com/apis/credentials |
| **Authorized Redirect** | `https://participation-translator-904747039219.us-central1.run.app/api/auth/callback/google` |

#### Email Allowlist

| Email | User |
|-------|------|
| `charleys@johannesleonardo.com` | Charley (developer) |
| `leop@johannesleonardo.com` | Leo (founder) |
| `janj@johannesleonardo.com` | Jan (founder) |

Managed in: `app/src/lib/auth.ts` → `ALLOWED_EMAILS`

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
| Perplexity | Failover summarization | Planned |
| Resend | Email delivery of blueprints | Planned (optional) |
| Brandwatch | Social listening | Deferred |

---

## Internal Endpoints

### Production

| URL | Purpose |
|-----|---------|
| `https://participation-translator-904747039219.us-central1.run.app` | Production (Cloud Run) |
| `https://participation-translator-904747039219.us-central1.run.app/login` | Login page |
| `https://participation-translator-904747039219.us-central1.run.app/option-c` | Engine Room |

### Local Development

| Endpoint | Purpose | Port |
|----------|---------|------|
| Next.js Dev | Frontend + API Routes | 3005 |
| Dashboard (legacy) | Progress tracker | 8080 |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth Google OAuth |
| `/api/generate` | POST | SSE streaming blueprint generation |
| `/api/upload` | POST | File upload + text extraction |
| `/api/stats` | GET | Knowledge base statistics |
| `/api/email` | POST | Email blueprint delivery (optional) |

---

## Environment Variables

### CLI Tools (`/.env`)

```bash
# GCP (required — tells the app which project to query Secret Manager in)
GCP_PROJECT_ID=participation-translator
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./sa-key.json

# Secret Manager Secrets (for reference only — do NOT paste keys here):
#   exa-api-key       → EXA_API_KEY
#   tavily-api-key    → TAVILY_API_KEY
```

### Web App (`app/.env.local`)

```bash
# Authentication (required)
NEXTAUTH_SECRET=<random-string>
NEXTAUTH_URL=http://localhost:3005          # or Cloud Run URL for production
GOOGLE_OAUTH_CLIENT_ID=<from-gcp-console>
GOOGLE_OAUTH_CLIENT_SECRET=<from-gcp-console>

# Claude API (required)
ANTHROPIC_API_KEY=<from-console.anthropic.com>

# Cultural Intelligence (required)
EXA_API_KEY=<from-dashboard.exa.ai>
TAVILY_API_KEY=<from-app.tavily.com>

# GCP (for Firestore vector search + Vertex AI embeddings)
GCP_PROJECT_ID=participation-translator
VERTEX_AI_CLAUDE_REGION=us-east5

# Optional
# RESEND_API_KEY=<for-email-delivery>
```

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
