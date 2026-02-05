# Quick Start Guide - The Participation Translator

Version: 1.0.1
Last Updated: 2026-02-03
Purpose: Get up and running with the Participation Translator
Time Required: ~15 minutes

---

## Prerequisites

Before you begin, ensure you have:

- [ ] Node.js 22 LTS installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Git configured with GitHub access
- [ ] GCP account with billing enabled
- [ ] Anthropic API key (Claude access)

---

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/Absolute-Space-GHCP/leo-participation-translator.git
cd leo-participation-translator

# Install dependencies
npm install
```

---

## Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# GCP
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Vertex AI (for embeddings)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

For full GCP setup, see `docs/GCP_SETUP.md`.

---

## Step 3: Verify Setup

```bash
# Type check
npm run typecheck

# Run tests
npm test
```

---

## Step 4: Start Development

```bash
# Start development server
npm run dev
```

Open http://localhost:3000 (when UI is implemented in Phase 4).

---

## Project Context Files

Read these files before working on the project:

| File        | Purpose                                          |
| ----------- | ------------------------------------------------ |
| `CLAUDE.md` | **Required** - Project context for AI assistants |
| `PLAN.md`   | Implementation roadmap and architecture          |
| `TASKS.md`  | Current tasks and progress tracking              |

---

## Current Phase: 1 (Knowledge Base & RAG)

The project is currently focused on:

1. **GCP Infrastructure** - Setting up Vertex AI, Vector Search
2. **Document Ingestion** - Parsing JL presentations
3. **Embedding Generation** - Creating vector representations
4. **Retrieval API** - Basic context retrieval

See `TASKS.md` for detailed task list.

---

## Key Commands

| Command             | Purpose                  |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm test`          | Run test suite           |
| `npm run typecheck` | TypeScript type checking |
| `npm run build`     | Production build         |
| `npm run lint`      | Run linter               |

---

## Getting Help

1. Check `docs/` folder for detailed documentation
2. Review session logs in `sessions/` for context
3. Read `.cursor/agents/` for agent capabilities

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
