# CLAUDE.md - The Participation Translator

Version: 1.2.0
Last Updated: 2026-02-13
Purpose: Project-specific context for AI assistants working on The Participation Translator

---

**Global Standards:** See `~/.cursor/CLAUDE.md` for coding standards, session protocols, and AI development tooling.

---

## ⚠️ CRITICAL: Workspace Rules

**ALWAYS READ:**

1. `~/.cursor/CLAUDE.md` (global standards - session protocols, coding standards, AI tooling)
2. This file (project-specific context)
3. `PLAN.md` (implementation roadmap)
4. `PROJECT_GUARDRAILS.md` (project constraints)

### Current Project Path

This project MUST only be worked on from:

```
~/Projects/leo-participation-translator
```

**Full absolute path:**

```
/Users/charleymm/Projects/leo-participation-translator
```

### First Check Before Any Session

```bash
# Verify workspace path
pwd
# Expected: /Users/charleymm/Projects/leo-participation-translator

[[ "$PWD" == *"Projects/leo-participation-translator"* ]] && echo "✓ Correct workspace" || echo "✗ Wrong workspace!"
```

---

## Project Overview

**The Participation Translator** is an internal AI-powered strategic tool for Johannes Leonardo that transforms "passive" advertising ideas into "participation-worthy" platforms.

### Project Sponsor

- **Leo** (Founder) - Primary stakeholder and end user
- **Priority:** HIGH
- **Visibility:** HIGH
- **Turnaround:** FAST

### Core Concept

The tool combines:

1. **JL Institutional Memory** - Vector database of past presentations (VW, Adidas, etc.)
2. **8-Part Participation Framework** - Strategic structure for all outputs
3. **Real-time Cultural Intelligence** - Live API feeds (trends, subcultures)
4. **Claude Opus 4.6** - Chain-of-thought reasoning for nuanced strategy

### Key Outputs

**A. Participation Worthy Write-up (9 sections):**

1. Current Cultural Context
2. Brand Credibility
3. The Shared Interest
4. The Passive Trap
5. The Participation Worthy Idea
6. Moments and Places
7. Mechanics of Participation
8. First Responders
9. The Ripple Effect

**B. Participation Pack:**

- The Big Audacious Act
- Subculture Mini-Briefs
- Mechanic Deep-Dives (3-5)
- Casting & Creators
- Trend Hijacks (72-hour opportunities)

---

## Technical Architecture

### Multi-Agent System

The Participation Translator uses specialized agents for different tasks:

| Agent                      | Purpose                                  | Phase           |
| -------------------------- | ---------------------------------------- | --------------- |
| `document-analyzer`        | Parse presentations, extract JL patterns | 1 (Active)      |
| `rag-engineer`             | Embeddings, retrieval, vector ops        | 1 (Active)      |
| `cultural-intelligence`    | Trend analysis, subcultures              | 3 (Placeholder) |
| `participation-strategist` | 8-Part Framework application             | 2 (Placeholder) |
| `presentation-generator`   | Google Slides output                     | 4 (Placeholder) |

**Agent Delegation:** See `.cursor/rules/agents.mdc`

### Tech Stack

| Layer                | Technology                                            |
| -------------------- | ----------------------------------------------------- |
| **Frontend**         | Next.js 16 + React 19 + Tailwind CSS                  |
| **Backend**          | Node.js 22 LTS + Next.js API Routes                   |
| **Auth**             | NextAuth.js + Google OAuth (email allowlist)           |
| **Reasoning Engine** | Claude Sonnet 4.5 (primary) / Vertex AI (fallback)    |
| **Task Routing**     | Complexity-based model selection                      |
| **Embeddings**       | Vertex AI text-embedding-005                          |
| **Vector Store**     | Cloud Firestore (vector search)                       |
| **Knowledge Graph**  | Patterns, campaigns, cultural moments                 |
| **Cultural APIs**    | Exa.ai, Tavily (4 parallel searches)                  |
| **Storage**          | Cloud Firestore, Cloud Storage                        |
| **PDF Export**       | jsPDF                                                 |
| **Deployment**       | Cloud Run (Dockerfile, standalone output)              |

### Architecture Flow

```
Document Upload → document-analyzer → Chunks + Patterns
                                           ↓
                  rag-engineer → Embeddings → Vector Store
                                                    ↓
                                            Knowledge Graph
                                           (patterns, relationships)
                                                    ↓
Project Seed → rag-engineer → Retrieved Context
                                    ↓
               cultural-intelligence → Cultural Intel (Phase 3)
                                    ↓
               participation-strategist → 8-Part Framework (Phase 2)
                                    ↓
               presentation-generator → Google Slides (Phase 4)
```

---

## Repository Structure

```
leo-participation-translator/
├── .cursor/
│   ├── agents/                 # Specialized subagents
│   ├── rules/                  # Workspace rules
│   └── skills/                 # Agent skills (RAG, branding, etc.)
├── app/                        # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/            # API routes (generate, upload, stats, email, auth)
│   │   │   ├── login/          # Google OAuth login page
│   │   │   ├── option-a/       # Clean Sheet demo
│   │   │   ├── option-b/       # Guided Flow demo
│   │   │   ├── option-c/       # Engine Room dashboard
│   │   │   ├── layout.tsx      # Root layout with AuthProvider
│   │   │   └── page.tsx        # Landing page (3-option selector)
│   │   ├── components/         # UI components (shadcn/ui + auth-provider)
│   │   ├── lib/                # Core libraries
│   │   │   ├── auth.ts         # NextAuth config + email allowlist
│   │   │   ├── claude.ts       # Claude API client (Direct + Vertex)
│   │   │   ├── cultural.ts     # Exa.ai + Tavily integration
│   │   │   ├── embeddings.ts   # Firestore vector search
│   │   │   ├── prompts.ts      # System/user prompt assembly
│   │   │   └── ...             # PDF export, file parsing, etc.
│   │   └── middleware.ts       # Auth middleware (route protection)
│   ├── Dockerfile              # Cloud Run production image
│   ├── .dockerignore
│   └── next.config.ts          # standalone output mode
├── src/                        # CLI tools (ingestion, embeddings)
├── data/                       # Presentations, manifests
├── docs/                       # Project documentation
├── sessions/                   # Session logs
├── CLAUDE.md                   # This file
├── PLAN.md                     # Implementation roadmap
└── TASKS.md                    # Task tracking
```

---

## Key Documentation

| Document                                        | Purpose                                              |
| ----------------------------------------------- | ---------------------------------------------------- |
| `PLAN.md`                                       | **Implementation roadmap** - Phases, tasks, timeline |
| `docs/ARCHITECTURE-PARTICIPATION-TRANSLATOR.md` | Technical architecture deep-dive                     |
| `PROJECT_GUARDRAILS.md`                         | Project constraints and rules                        |
| `TASKS.md`                                      | Current tasks and priorities                         |

---

## Development Phases

| Phase         | Description                  | Status                  |
| ------------- | ---------------------------- | ----------------------- |
| **Phase 0**   | Foundation Setup             | ✅ COMPLETE             |
| **Phase 1**   | Knowledge Base & RAG Core    | ✅ COMPLETE             |
| **Phase 1.5** | Learning/Evolution System    | ✅ COMPLETE             |
| **Phase 2**   | 8-Part Framework Integration | ✅ COMPLETE             |
| **Phase 3**   | Cultural Intelligence Layer  | ✅ COMPLETE (Exa.ai + Tavily) |
| **Phase 4**   | User Interface               | ✅ COMPLETE (3 demo modes + Engine Room) |
| **Phase 5**   | Testing & Refinement         | 🔄 IN PROGRESS          |
| **Phase 6**   | Deployment & Training        | ✅ DEPLOYED (Cloud Run) |

---

## GCP Project

- **Project ID:** `jl-participation-translator`
- **Region:** `us-central1`
- **Services:** Cloud Run, Firestore, Cloud Storage, Vertex AI, Cloud Build, Artifact Registry
- **Service Account:** `participation-translator-sa@participation-translator.iam.gserviceaccount.com`
- **Buckets:** `participation-translator-documents`, `participation-translator-exports`
- **Production URL:** `https://participation-translator-904747039219.us-central1.run.app`

### Authentication

- **Provider:** Google OAuth via NextAuth.js
- **Email Allowlist:** `charleys@johannesleonardo.com`, `leop@johannesleonardo.com`, `janj@johannesleonardo.com`
- **Strategy:** JWT sessions + auth middleware on all routes
- **Login Page:** `/login` (JL-branded)

---

## API Dependencies

| API             | Purpose                     | Credentials              |
| --------------- | --------------------------- | ------------------------ |
| **Anthropic**   | Claude Sonnet 4.5 (primary) | API Key (env var)        |
| **Vertex AI**   | Embeddings, Claude fallback | GCP Service Account      |
| **Exa.ai**      | Semantic web search         | API Key (env var)        |
| **Tavily**      | Search + summarization      | API Key (env var)        |
| **Google OAuth** | User authentication        | OAuth Client ID/Secret   |

---

## Coding Standards

**Full standards:** See `~/.cursor/CLAUDE.md`

**Project-specific:**

- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- TypeScript for all new code
- Tailwind CSS for styling
- React Server Components where possible
- All API keys in Secret Manager, never in code

---

## Session Workflow

### Starting a Session

1. **Read context:**

   - `~/.cursor/CLAUDE.md` (global)
   - This `CLAUDE.md` file
   - `PLAN.md` for current phase
   - `TASKS.md` for immediate tasks

2. **Create backup** (per global protocol):

   ```bash
   ARCHIVE_DIR="$HOME/Projects/ARCHIVED"
   PROJECT_NAME=$(basename $(pwd))
   TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)
   mkdir -p "$ARCHIVE_DIR"
   rsync -a --exclude='node_modules' --exclude='.git' . "$ARCHIVE_DIR/${PROJECT_NAME}_backup_${TIMESTAMP}/"
   ```

3. **Verify workspace:**
   ```bash
   pwd  # Should be: /Users/charleymm/Projects/leo-participation-translator
   ```

### Ending a Session

- Follow **Session Wrap-Up Protocol** in `~/.cursor/CLAUDE.md`
- Create session log in `sessions/SESSION_YYYY-MM-DD_vX.X.X.md`
- Update `ACCOMPLISHMENTS.md`
- Commit all changes

---

## Notes for AI Assistants

1. **Leo is the end user** - Keep UX simple and intuitive
2. **High priority, high visibility** - Quality over speed
3. This is a **strategic tool**, not just technical
4. Outputs must sound like JL (train on past presentations)
5. Real-time cultural data is essential for relevance
6. Export capabilities (PDF, PPTX) are critical for Leo's workflow
7. **Session logs required** after each session

---

## Quick Reference

| Action           | Command / Location                                                      |
| ---------------- | ----------------------------------------------------------------------- |
| Start dev server | `cd app && npx next dev --port 3005`                                    |
| Run tests        | `npm test`                                                              |
| Build            | `cd app && npm run build`                                               |
| Deploy           | `cd app && gcloud run deploy participation-translator --source . --region us-central1 --project jl-participation-translator` |
| Ingest documents | `npx tsx src/ingest.ts <file>`                                          |
| Landing page     | `http://localhost:3005/` (dev) or production URL                        |
| Engine Room      | `http://localhost:3005/option-c` (dev) or production `/option-c`        |
| Production URL   | `https://participation-translator-904747039219.us-central1.run.app`     |

---

## AI Development Tooling

| Tool                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| Claude-Mem          | Persistent memory across sessions           |
| Code-Simplifier     | Refine code for clarity and maintainability |
| Sequential-Thinking | Step-by-step reasoning for complex tasks    |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
