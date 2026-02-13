# Build & Development Guide

Version: 1.1.0
Last Updated: 2026-02-13

---

## Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | 22 LTS | `node --version` |
| npm | 10+ | `npm --version` |
| gcloud CLI | Latest | `gcloud --version` |
| GCP Project | `participation-translator` | `gcloud config get-value project` |

---

## Initial Setup

```bash
# Clone
git clone https://github.com/Absolute-Space-GHCP/leo-participation-translator.git
cd leo-participation-translator

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Authenticate with GCP (opens browser)
gcloud auth login --update-adc
gcloud config set project participation-translator
```

> **API Keys:** Exa.ai and Tavily keys are stored in GCP Secret Manager. The app reads them automatically at runtime. For local dev without Secret Manager access, set `EXA_API_KEY` and `TAVILY_API_KEY` in your `.env` file.

---

## Development Scripts

| Command | Purpose |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run dev` | Watch mode — recompiles on change |
| `npm test` | Run tests (Vitest) |
| `npm run ingest -- <file>` | Ingest a PPTX/PDF into vector store |
| `npm run convert -- -i <file> -o <out>` | Convert PPTX to Markdown |
| `npm run retrieve -- <query>` | Test RAG retrieval |
| `npm run stats` | View vector store statistics |
| `npm run cultural -- <command>` | Cultural intelligence CLI |
| `npm run seed-graph` | Seed knowledge graph |
| `npm run batch-ingest -- <dir>` | Bulk ingest a folder |
| `npm run extract-metadata -- <file>` | Extract metadata from a document |
| `npm run dashboard` | Launch monitoring dashboard |

---

## Project Structure

```
leo-participation-translator/
├── src/
│   ├── lib/
│   │   ├── cultural/       # Exa.ai, Tavily, sentiment, merger
│   │   ├── embeddings/     # Vertex AI embedding generation
│   │   ├── export/         # PPTX/PDF/Slides export (Phase 4)
│   │   ├── generation/     # Claude client, prompt assembly, formatters
│   │   ├── learning/       # Evolution system (observations, patterns)
│   │   ├── memory/         # Knowledge graph
│   │   ├── parsers/        # PPTX/PDF/DOCX parsing
│   │   ├── router/         # Task-based model routing
│   │   └── secrets/        # GCP Secret Manager client
│   ├── prompts/            # System prompts, framework sections
│   └── cli/                # CLI tools (ingest, retrieve, cultural, etc.)
├── app/                    # Next.js 14 frontend (Phase 4)
│   └── src/app/            # App Router pages
├── data/
│   ├── presentations/      # Source PPTX files (gitignored)
│   ├── markdown/           # Converted markdown versions
│   └── creators/           # Creator briefs
├── docs/                   # Project documentation
├── sessions/               # Session logs
├── dashboard/              # Monitoring dashboard
└── config/                 # IDE/tool configuration templates
```

---

## Build Process

```bash
# Full build
npm run build

# Output goes to dist/ (not committed)
# TypeScript config: tsconfig.json
# Module system: ESM (type: "module" in package.json)
```

### Important: ESM Module System

This project uses ES Modules. All import paths in source code must include `.js` extensions:

```typescript
// ✅ Correct
import { search } from '../cultural/exa.js';

// ❌ Will fail
import { search } from '../cultural/exa';
```

---

## Environment Configuration

See `.env.example` for the full template. Key variables:

| Variable | Required | Purpose |
|---|---|---|
| `GCP_PROJECT_ID` | Yes | GCP project for all services |
| `GCP_REGION` | Yes | Default: `us-central1` |
| `VERTEX_AI_CLAUDE_REGION` | Yes | Claude on Vertex: `us-east5` |
| `NEXTAUTH_SECRET` | Yes (app) | JWT session signing key |
| `NEXTAUTH_URL` | Yes (app) | Auth callback base URL |
| `GOOGLE_OAUTH_CLIENT_ID` | Yes (app) | Google OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Yes (app) | Google OAuth client secret |
| `ANTHROPIC_API_KEY` | Yes (app) | Claude API key (primary) |
| `EXA_API_KEY` | Yes (app) | Exa.ai semantic search |
| `TAVILY_API_KEY` | Yes (app) | Tavily LLM-optimized search |
| `NODE_ENV` | No | `development` (default) or `production` |
| `LOG_LEVEL` | No | `debug`, `info`, `warn`, `error` |

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

Test framework: **Vitest**

---

## Deployment

Production deployment uses Google Cloud Run with a Dockerfile in `app/`:

```bash
cd app

# Deploy (builds Docker image via Cloud Build and deploys to Cloud Run)
gcloud run deploy participation-translator \
  --source . \
  --region us-central1 \
  --project jl-participation-translator \
  --set-env-vars "NEXTAUTH_SECRET=...,NEXTAUTH_URL=https://...,GOOGLE_OAUTH_CLIENT_ID=...,GOOGLE_OAUTH_CLIENT_SECRET=...,ANTHROPIC_API_KEY=...,EXA_API_KEY=...,TAVILY_API_KEY=..." \
  --service-account participation-translator-sa@participation-translator.iam.gserviceaccount.com
```

**Production URL:** `https://participation-translator-904747039219.us-central1.run.app`

### Dockerfile

The `app/Dockerfile` uses a multi-stage build:
1. **deps** — Install production dependencies
2. **builder** — Build the Next.js standalone output
3. **runner** — Minimal production image (node:22-alpine)

**Key config:** `next.config.ts` uses `output: "standalone"` for Docker-compatible builds.

See `docs/GCP_SETUP.md` for full infrastructure setup.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `Secret Manager fallback` debug messages | Normal in local dev — keys fall back to `.env` |
| `GOOGLE_APPLICATION_CREDENTIALS` errors | Run `gcloud auth login --update-adc` |
| Import errors (ERR_MODULE_NOT_FOUND) | Ensure `.js` extensions on all imports |
| Firestore permission denied | Check service account roles in GCP Console |
| Cloud Build "Cannot find namespace JSX" | Use `React.ReactNode` instead of `JSX.Element` (React 19) |
| Redirected to `/login` | Expected — auth middleware protects all routes |
| `pdf-parse` import error in build | Use dynamic import with `as any` + fallback pattern |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
