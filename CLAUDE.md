# CLAUDE.md - The Participation Translator

Version: 1.0.2
Last Updated: 2026-02-05
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
4. **Claude 3.5 Sonnet** - Chain-of-thought reasoning for nuanced strategy

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
| **Frontend**         | Next.js 14 + React 18 + Tailwind CSS                  |
| **Backend**          | Node.js 22 LTS + Next.js API Routes                   |
| **Reasoning Engine** | Claude Opus 4.6 (primary) / Sonnet 4.5 (fallback)     |
| **Task Routing**     | Complexity-based model selection                      |
| **Embeddings**       | Vertex AI text-embedding-005                          |
| **Vector Store**     | Vertex AI Vector Search                               |
| **Knowledge Graph**  | Patterns, campaigns, cultural moments                 |
| **Cultural APIs**    | Exa.ai, Perplexity API (Phase 3)                      |
| **Storage**          | Cloud Firestore, Cloud Storage                        |
| **Presentation**     | Google Slides API                                     |
| **Deployment**       | Cloud Run                                             |

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
│   │   ├── document-analyzer.md
│   │   ├── rag-engineer.md
│   │   ├── cultural-intelligence.md (placeholder)
│   │   ├── participation-strategist.md (placeholder)
│   │   └── presentation-generator.md (placeholder)
│   ├── rules/
│   │   └── agents.mdc          # Agent delegation rules
│   └── skills/
│       ├── participation-rag/  # RAG operations skill
│       └── document-analysis/  # Parsing skill
├── src/
│   ├── app/                    # Next.js App Router (Phase 4)
│   ├── lib/
│   │   ├── memory/             # Knowledge graph
│   │   ├── router/             # Task routing
│   │   ├── parsers/            # Document parsing
│   │   ├── embeddings/         # Vector operations
│   │   ├── cultural/           # Trend APIs (Phase 3)
│   │   ├── generation/         # Claude integration (Phase 2)
│   │   └── export/             # Google Slides export (Phase 4)
│   └── prompts/                # System prompts
├── docs/
│   ├── GCP_SETUP.md            # GCP configuration guide
│   └── ARCHITECTURE-*.md       # Technical architecture
├── sessions/                   # Session logs
├── PLAN.md                     # Implementation roadmap
├── CLAUDE.md                   # This file
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
| **Phase 1**   | Knowledge Base & RAG Core    | ✅ COMPLETE (need docs) |
| **Phase 1.5** | Learning/Evolution System    | ✅ COMPLETE             |
| **Phase 2**   | 8-Part Framework Integration | 🔜 READY FOR LEO        |
| **Phase 3**   | Cultural Intelligence Layer  | 📋 RESEARCH COMPLETE    |
| **Phase 4**   | User Interface               | ✅ SCAFFOLDED           |
| **Phase 5**   | Testing & Refinement         | ⏳ PENDING              |
| **Phase 6**   | Deployment & Training        | ⏳ PENDING              |

---

## GCP Project

- **Project ID:** `participation-translator` ✅ Created
- **Region:** `us-central1`
- **Services:** Cloud Run, Firestore, Cloud Storage, Vertex AI
- **Service Account:** `participation-translator-sa@participation-translator.iam.gserviceaccount.com`
- **Buckets:** `participation-translator-documents`, `participation-translator-exports`

---

## API Dependencies

| API            | Purpose                     | Credentials              |
| -------------- | --------------------------- | ------------------------ |
| **Vertex AI**  | Claude 3.5, Embeddings      | GCP Service Account      |
| **Exa.ai**     | Semantic web search         | API Key (Secret Manager) |
| **Perplexity** | Search + summarization      | API Key (Secret Manager) |
| **Brandwatch** | Social listening (optional) | Enterprise subscription  |

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

| Action           | Command / Location              |
| ---------------- | ------------------------------- |
| Start dev server | `npm run dev` (after setup)     |
| Run tests        | `npm test`                      |
| Build            | `npm run build`                 |
| Deploy           | `gcloud run deploy`             |
| Ingest documents | `node scripts/ingest.js <file>` |

---

## AI Development Tooling

| Tool                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| Claude-Mem          | Persistent memory across sessions           |
| Code-Simplifier     | Refine code for clarity and maintainability |
| Sequential-Thinking | Step-by-step reasoning for complex tasks    |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-05
