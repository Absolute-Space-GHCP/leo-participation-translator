# The Participation Translator

Version: 1.2.0
Last Updated: 2026-02-13
Purpose: AI-powered strategic tool that transforms passive advertising ideas into participation-worthy platforms

---

## Overview

The Participation Translator is an internal tool for Johannes Leonardo that applies the agency's proprietary 8-Part Participation Framework to transform traditional advertising concepts into participation-worthy platforms.

**Key Capabilities:**

- **RAG-powered context** - Retrieves relevant past JL work for pattern matching
- **Cultural intelligence** - Real-time trend analysis via Exa.ai + Tavily
- **Framework application** - Systematic 8-Part Participation Framework reasoning
- **Streaming generation** - Claude Sonnet 4.5 streams blueprints in real time
- **PDF export** - Client-side formatted PDF download
- **Authenticated access** - Google OAuth with JL email allowlist

**Priority:** HIGH | **Visibility:** HIGH | **Sponsor:** Leo (Founder)

**Production URL:** `https://participation-translator-904747039219.us-central1.run.app`

---

## Quick Start

### Prerequisites

- Node.js 22 LTS
- GCP account with billing enabled
- API keys: Anthropic (Claude), Exa.ai, Tavily

### Setup

```bash
# Clone the repo
git clone https://github.com/Absolute-Space-GHCP/leo-participation-translator.git
cd leo-participation-translator

# Install CLI/backend dependencies
npm install

# Install frontend dependencies
cd app && npm install && cd ..

# Copy environment template
cp .env.example .env
cp app/.env.example app/.env.local

# Configure your API keys in .env and app/.env.local
# See docs/GCP_SETUP.md for GCP configuration
```

### Development

```bash
# Start the web UI (dev server)
cd app && npx next dev --port 3005

# Open in browser
open http://localhost:3005

# Run CLI tools
npm run stats        # Vector store statistics
npm run retrieve -- "query"  # Test retrieval
```

### Authentication

The app requires Google OAuth login. Only allowlisted JL emails can access:
- `charleys@johannesleonardo.com`
- `leop@johannesleonardo.com`
- `janj@johannesleonardo.com`

---

## Documentation

| Document                 | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `CLAUDE.md`              | **Start here!** Project context for AI assistants |
| `PLAN.md`                | Implementation roadmap and phases                 |
| `TASKS.md`               | Current tasks and progress                        |
| `docs/GCP_SETUP.md`      | GCP project configuration guide                   |
| `docs/ARCHITECTURE-*.md` | Technical architecture details                    |

---

## Architecture

### Multi-Agent System

| Agent                      | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `document-analyzer`        | Parse presentations, extract JL patterns  |
| `rag-engineer`             | Embeddings, retrieval, vector operations  |
| `cultural-intelligence`    | Trend analysis, subculture identification |
| `participation-strategist` | 8-Part Framework application              |
| `presentation-generator`   | Google Slides output                      |

### Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Frontend     | Next.js 16, React 19, Tailwind CSS              |
| Backend      | Node.js 22 LTS, TypeScript, Next.js API Routes  |
| Auth         | NextAuth.js, Google OAuth, JWT sessions          |
| AI/LLM       | Claude Sonnet 4.5 (Direct + Vertex AI)          |
| Embeddings   | Vertex AI text-embedding-005                    |
| Vector Store | Cloud Firestore (vector search)                 |
| Cultural     | Exa.ai + Tavily (parallel search)               |
| PDF Export   | jsPDF (client-side)                              |
| Deployment   | Cloud Run (Dockerfile, standalone)               |

---

## Project Structure

```
leo-participation-translator/
├── app/                         # Next.js web application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/             # API routes (generate, upload, stats, auth)
│   │   │   ├── login/           # Google OAuth login page
│   │   │   ├── option-a/        # Clean Sheet demo
│   │   │   ├── option-b/        # Guided Flow demo
│   │   │   ├── option-c/        # Engine Room dashboard
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/          # UI components (shadcn/ui + auth)
│   │   ├── lib/                 # Core libraries (auth, claude, cultural, etc.)
│   │   └── middleware.ts        # Auth route protection
│   ├── Dockerfile               # Cloud Run production image
│   └── next.config.ts           # standalone output mode
├── src/                         # CLI tools (ingestion, embeddings)
├── data/                        # Presentations, manifests
├── docs/                        # Project documentation
├── sessions/                    # Session logs
└── PLAN.md                      # Implementation roadmap
```

---

## Implementation Phases

| Phase | Focus                 | Status                  |
| ----- | --------------------- | ----------------------- |
| 0     | Foundation Setup      | ✅ Complete             |
| 1     | Knowledge Base & RAG  | ✅ Complete             |
| 1.5   | Learning System       | ✅ Complete             |
| 2     | Framework Engine      | ✅ Complete             |
| 3     | Cultural Intelligence | ✅ Complete (Exa + Tavily) |
| 4     | UI & Presentation     | ✅ Complete (~85%)      |
| 5     | Testing & Refinement  | 🔄 In Progress          |
| 6     | Deployment & Auth     | ✅ Deployed (Cloud Run) |

---

## Contributing

See `CONTRIBUTING.md` for guidelines.

---

## Security

See `SECURITY.md` for security policy.

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
