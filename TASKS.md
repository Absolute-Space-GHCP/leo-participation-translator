# TODO - The Participation Translator

Version: 1.3.0
Last Updated: 2026-02-13
Purpose: Tracks implementation progress across all phases

Priority Legend: HIGH | MEDIUM | LOW
Status Legend: PENDING | IN_PROGRESS | DONE

---

## Current Status: DEPLOYED to Cloud Run + Auth Live

**Architecture:** Multi-agent with specialized subagents, knowledge graph, task routing
**Vector Store:** 23 documents, 1,186 chunks indexed (re-indexed Feb 10)
**Cultural Intel:** Exa.ai + Tavily connected in parallel ✅
**Generation:** Claude Sonnet 4.5 via Vertex AI with SSE streaming ✅
**Frontend:** Engine Room dashboard (Option C) — full pipeline visibility ✅
**Auth:** NextAuth.js Google OAuth — 3 JL email allowlist ✅
**Deployment:** Cloud Run — `https://participation-translator-904747039219.us-central1.run.app` ✅
**Focus:** Live testing with Leo & Jan → iteration → production hardening

---

## Phase 0: Foundation Setup - COMPLETE

| Task                           | Status  | Notes                               |
| ------------------------------ | ------- | ----------------------------------- |
| Create agent delegation rule   | ✅ DONE | `.cursor/rules/agents.mdc`          |
| Create 5 subagent definitions  | ✅ DONE | 2 active, 3 placeholders            |
| Create participation-rag skill | ✅ DONE | SKILL.md + scripts                  |
| Create document-analysis skill | ✅ DONE | SKILL.md                            |
| Adapt knowledge graph          | ✅ DONE | `src/lib/memory/knowledge-graph.ts` |
| Adapt task router              | ✅ DONE | `src/lib/router/task-router.ts`     |
| Document GCP setup             | ✅ DONE | `docs/GCP_SETUP.md`                 |
| Update documentation           | ✅ DONE | PLAN.md, CLAUDE.md, TASKS.md        |

---

## Phase 1: Knowledge Base & RAG Core - IN PROGRESS

### 1.1 GCP Infrastructure - ✅ COMPLETE

| Priority | Task                         | Notes                         | Status  |
| -------- | ---------------------------- | ----------------------------- | ------- |
| HIGH     | Create GCP project           | `participation-translator`    | ✅ DONE |
| HIGH     | Enable required APIs         | Vertex AI, Firestore, Storage | ✅ DONE |
| HIGH     | Set up service account       | IAM roles configured          | ✅ DONE |
| HIGH     | Link billing                 | JL billing account            | ✅ DONE |
| HIGH     | Create Cloud Storage buckets | documents, exports            | ✅ DONE |
| HIGH     | Create Firestore database    | Native mode, us-central1      | ✅ DONE |
| MEDIUM   | Create Vector Search index   | 768 dimensions                | PENDING |

### 1.2 Document Ingestion Pipeline - ✅ MOSTLY COMPLETE

| Priority | Task                        | Notes                      | Status  |
| -------- | --------------------------- | -------------------------- | ------- |
| HIGH     | Implement PDF parser        | `src/lib/parsers/index.ts` | ✅ DONE |
| HIGH     | Implement PPTX parser       | `src/lib/parsers/index.ts` | ✅ DONE |
| MEDIUM   | Implement DOCX parser       | `src/lib/parsers/index.ts` | ✅ DONE |
| HIGH     | Implement chunking strategy | Semantic with overlap      | ✅ DONE |
| MEDIUM   | Create CLI ingest script    | `src/cli/ingest.ts`        | ✅ DONE |

### 1.3 Embedding & Vector Storage - ✅ MOSTLY COMPLETE

| Priority | Task                           | Notes                           | Status  |
| -------- | ------------------------------ | ------------------------------- | ------- |
| HIGH     | Implement embedding generation | Vertex AI text-embedding-005    | ✅ DONE |
| HIGH     | Implement vector upsert        | Firestore (temp), Vector Search | ✅ DONE |
| HIGH     | Create retrieval API           | `src/cli/retrieve.ts`           | ✅ DONE |
| MEDIUM   | Implement metadata filtering   | Client, category, year          | ✅ DONE |
| MEDIUM   | Upgrade to Vector Search       | For production performance      | PENDING |

### 1.4 Knowledge Graph - ✅ COMPLETE

| Priority | Task                     | Notes                | Status  |
| -------- | ------------------------ | -------------------- | ------- |
| HIGH     | Seed framework sections  | 9 sections as nodes  | ✅ DONE |
| HIGH     | Add strategic patterns   | 5 initial patterns   | ✅ DONE |
| HIGH     | Add initial tactics      | 4 initial tactics    | ✅ DONE |
| MEDIUM   | Create graph persistence | JSON export to data/ | ✅ DONE |
| MEDIUM   | Build pattern extractor  | Identify JL patterns | PENDING |

### 1.5 Initial Document Ingestion - ✅ COMPLETE

| Priority | Task                              | Notes                        | Status  |
| -------- | --------------------------------- | ---------------------------- | ------- |
| HIGH     | Get sample presentations          | 19 PPTX files from Sylvia    | ✅ DONE |
| HIGH     | Copy to data directories          | presentations/creators/media | ✅ DONE |
| HIGH     | Create metadata manifest          | manifest.csv with metadata   | ✅ DONE |
| HIGH     | Image-heavy detection             | Skill + parser updated       | ✅ DONE |
| HIGH     | Index to vector store             | 40 docs, 2,086 chunks        | ✅ DONE |
| HIGH     | Validate retrieval quality        | Tested with queries          | ✅ DONE |

### Data Assets (2026-02-05)

| Asset                       | Location                          | Count/Size     | Indexed |
| --------------------------- | --------------------------------- | -------------- | ------- |
| Participation Presentations | `data/presentations/`             | 19 PPTX files  | ✅ Yes  |
| Collection of Creators      | `data/creators/`                  | 1 file (326MB) | ✅ Yes  |
| Collection of Media Options | `data/media/`                     | 1 file (291MB) | ✅ Yes  |
| Metadata Manifest           | `data/presentations/manifest.csv` | 19 entries     | —       |
| Creators Markdown           | `data/markdown/creators.md`       | 54 KB (37 chunks) | ✅ Yes  |
| Media Options Markdown      | `data/markdown/media.md`          | 43 KB (30 chunks) | ✅ Yes  |
| Creators Metadata           | `data/metadata/creators.json`     | 76 creators    | —       |
| Media Ideas Metadata        | `data/metadata/media-ideas.json`  | 15 ideas       | —       |

---

## Phase 1.5: Learning/Evolution System - ✅ COMPLETE

| Task                            | Status  | Notes                                   |
| ------------------------------- | ------- | --------------------------------------- |
| Create observation types        | ✅ DONE | `src/lib/learning/types.ts`             |
| Implement observation store     | ✅ DONE | `src/lib/learning/observation-store.ts` |
| Implement pattern analyzer      | ✅ DONE | `src/lib/learning/pattern-analyzer.ts`  |
| Create context injector         | ✅ DONE | `src/lib/learning/context-injector.ts`  |
| Document evolution architecture | ✅ DONE | `docs/EVOLUTION.md`                     |

---

## Phase 4: Frontend & Demo — ACTIVE

| Task                              | Status  | Notes                                          |
| --------------------------------- | ------- | ---------------------------------------------- |
| Create Next.js app                | ✅ DONE | `app/` directory                               |
| Install shadcn/ui                 | ✅ DONE | 14 components installed                        |
| Build Engine Room dashboard       | ✅ DONE | `app/src/app/option-c/page.tsx` (Feb 11)       |
| Build streaming generate API      | ✅ DONE | `app/src/app/api/generate/route.ts` (SSE)      |
| Build retrieval API               | ✅ DONE | `app/src/app/api/retrieve/route.ts`            |
| Build stats API                   | ✅ DONE | `app/src/app/api/stats/route.ts`               |
| Build file upload API             | ✅ DONE | `app/src/app/api/upload/route.ts` (in-memory)  |
| Connect RAG retrieval (Firestore) | ✅ DONE | Direct SDK, no child process                   |
| Connect cultural intel (Exa+Tavily) | ✅ DONE | Parallel queries, merged results             |
| Connect Claude streaming          | ✅ DONE | `@anthropic-ai/vertex-sdk` SSE                |
| File upload + text extraction     | ✅ DONE | PPTX/PDF/DOCX/TXT, in-memory only             |
| Landing page with option picker   | ✅ DONE | `app/src/app/page.tsx`                         |
| Option A: Clean Sheet             | ✅ DONE | `app/src/app/option-a/page.tsx`                |
| Option B: Guided Flow             | ✅ DONE | `app/src/app/option-b/` (input + results)      |
| PDF export (jsPDF)                | ✅ DONE | Client-side download with title page           |
| Copy to clipboard                 | ✅ DONE | Per-tab content copy                           |
| Refine with feedback              | ✅ DONE | Re-generate with user notes                    |
| PPTX export                       | PENDING | PptxGenJS integration                          |
| History / saved outputs           | PENDING | Session persistence                            |
| Feedback dashboard                | PENDING | Ratings, corrections                           |
| Firestore session logging         | ✅ DONE | All generations logged to `user-sessions` collection |
| Deck-input pair library           | PENDING | Auto-suggest paired idea write-ups when known decks are uploaded |

## Phase 6: Deployment & Auth — COMPLETE

| Task                              | Status  | Notes                                          |
| --------------------------------- | ------- | ---------------------------------------------- |
| NextAuth.js + Google OAuth        | ✅ DONE | `app/src/lib/auth.ts` (Feb 13)                 |
| Login page (JL-branded)           | ✅ DONE | `app/src/app/login/page.tsx`                   |
| Auth middleware (route protection) | ✅ DONE | `app/src/middleware.ts`                        |
| AuthProvider (session context)    | ✅ DONE | `app/src/components/auth-provider.tsx`          |
| Email allowlist (3 users)         | ✅ DONE | charleys@, leop@, janj@johannesleonardo.com   |
| Dockerfile + standalone build     | ✅ DONE | `app/Dockerfile`, `next.config.ts` standalone  |
| Cloud Run deployment              | ✅ DONE | `https://participation-translator-904747039219.us-central1.run.app` |
| OAuth client setup (GCP)          | ✅ DONE | Client ID + redirect URIs configured           |
| Footer branding update            | ✅ DONE | "Johannes Leonardo" + authorship credit        |
| Sidebar brightness improvements   | ✅ DONE | Multiple passes for readability                |

---

## Files Created/Updated This Session

### Core Libraries (`src/lib/`)

| File                            | Status      |
| ------------------------------- | ----------- |
| `parsers/index.ts`              | ✅ Complete |
| `parsers/types.ts`              | ✅ Complete |
| `embeddings/index.ts`           | ✅ Complete |
| `memory/knowledge-graph.ts`     | ✅ Complete |
| `learning/types.ts`             | ✅ Complete |
| `learning/observation-store.ts` | ✅ Complete |
| `learning/pattern-analyzer.ts`  | ✅ Complete |
| `learning/context-injector.ts`  | ✅ Complete |
| `learning/index.ts`             | ✅ Complete |
| `cultural/exa.ts`               | ✅ Complete |
| `cultural/tavily.ts`            | ✅ Complete |
| `cultural/merger.ts`            | ✅ Complete |
| `cultural/sentiment.ts`         | ✅ Complete |
| `cultural/index.ts`             | ✅ Complete |

### CLI Tools (`src/cli/`)

| File                  | Status      |
| --------------------- | ----------- |
| `ingest.ts`           | ✅ Complete |
| `retrieve.ts`         | ✅ Complete |
| `seed-graph.ts`       | ✅ Complete |
| `cultural.ts`         | ✅ Complete |
| `convert.ts`          | ✅ Complete |
| `batch-ingest.ts`     | ✅ Complete |
| `extract-metadata.ts` | ✅ Complete |

### Configuration

| File            | Status      |
| --------------- | ----------- |
| `package.json`  | ✅ Complete |
| `tsconfig.json` | ✅ Complete |
| `.env`          | ✅ Updated  |
| `.env.example`  | ✅ Updated  |

### Documentation

| File                            | Status     |
| ------------------------------- | ---------- |
| `docs/CULTURAL_INTELLIGENCE.md` | ✅ Created |
| `docs/EVOLUTION.md`             | ✅ Created |
| `docs/LEOS_REQUIREMENTS.md`     | ✅ Created |
| `docs/DEMO_WALKTHROUGH.md`      | ✅ Created |

### Skills & Data

| File/Directory                                     | Status     |
| -------------------------------------------------- | ---------- |
| `.cursor/skills/image-heavy-detection/SKILL.md`    | ✅ Created |
| `data/presentations/` (19 PPTX files)              | ✅ Copied  |
| `data/creators/Collection of Creators.pptx`        | ✅ Copied  |
| `data/media/Collection of Media Options.pptx`      | ✅ Copied  |
| `data/presentations/manifest.csv`                  | ✅ Created |

---

## ═══════════════════════════════════════════════════════════════
## SYSTEM WORKFLOW CHART — Full Technology Pipeline
## ═══════════════════════════════════════════════════════════════

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     THE PARTICIPATION TRANSLATOR                        │
│                    Full-Stack Workflow (Feb 2026)                        │
└─────────────────────────────────────────────────────────────────────────┘

USER ──► BROWSER (Next.js 16 + React 19) ──► API ROUTES (Next.js Server)
                                                    │
                         ┌──────────────────────────┼──────────────────────┐
                         ▼                          ▼                      ▼
               Firestore Vector Store    Cultural Intelligence APIs    Claude via Vertex AI
               (Embeddings + Chunks)       (Exa.ai + Tavily)       (Anthropic Vertex SDK)
```

### Step-by-Step Workflow

| Step | Trigger | Platform / Technology | Action | Responsible For |
|------|---------|----------------------|--------|-----------------|
| **1. User Opens App** | Browser navigates to `localhost:3005/option-c` | **Next.js 16** (Turbopack dev server) | Serves the React SPA; renders the Engine Room dashboard | Routing, SSR, static assets |
| **2. Stats Load** | Page mount (`useEffect`) | **Next.js API Route** `GET /api/stats` → **Google Cloud Firestore** | Queries `documents` and `chunks` collections for counts and client list | Knowledge base status display |
| **3. User Fills Form** | Manual input | **React 19** (client-side state) | Captures brand, category, audience, passive idea, optional fields into `ProjectSeed` state | Form validation, UX |
| **4a. File Upload** *(optional)* | User drops/selects a file | **Browser** `FormData` → **Next.js API Route** `POST /api/upload` | Receives file as `ArrayBuffer`, converts to `Buffer` (in-memory, NO disk) | File acceptance, size/type validation |
| **4b. Text Extraction** | Upload API receives buffer | **PizZip** (PPTX) / **pdf-parse** (PDF) / **Mammoth** (DOCX) / direct read (TXT/MD) | Extracts text content from binary file buffer entirely in memory | Text extraction from office formats |
| **4c. Return Text** | Extraction complete | **Next.js API Route** `POST /api/upload` response | Returns `{ text, filename, fileType, pageCount, charCount }` to client | Extracted text storage in component state |
| **5. User Clicks Generate** | Button click | **React** `useGeneration()` hook → `fetch('/api/generate')` | Sends `ProjectSeed` (+ uploaded doc text) as JSON POST; opens SSE stream reader | Initiating the generation pipeline |
| **6. RAG Retrieval** | Generate API receives POST | **Vertex AI** `text-embedding-005` (via REST API) + **Google Cloud Firestore** | 1. Generates query embedding (768-dim vector) via Vertex AI REST endpoint<br>2. Fetches up to 1,000 chunks from Firestore<br>3. Computes cosine similarity in-memory<br>4. Returns top-10 ranked chunks | Finding relevant JL institutional knowledge |
| **7. Cultural Intelligence** | After RAG retrieval completes | **Exa.ai** REST API + **Tavily** Node SDK (in parallel) | Exa: Semantic web search for trends + Reddit discussions<br>Tavily: News search + community discussions<br>Results merged, deduplicated, formatted | Real-time cultural context (trends, discussions, news) |
| **8. Context Assembly** | After RAG + Cultural complete | **Node.js** (in-process) | Formats retrieved chunks + cultural results + uploaded doc text into structured prompt sections | Building the complete context window for Claude |
| **9. Prompt Assembly** | Context ready | `buildSystemPrompt()` + `buildUserPrompt()` in `app/src/lib/prompts.ts` | Combines:<br>- JL strategist persona<br>- Invisible 9-section framework<br>- Output format instructions<br>- Project seed data<br>- RAG context<br>- Cultural intelligence<br>- Uploaded document context | Constructing the full system + user prompt |
| **10. Claude Streaming** | Prompt assembled | **Anthropic Vertex SDK** → **Google Cloud Vertex AI** → **Claude Sonnet 4.5** (us-east5) | Streams response via `client.messages.stream()`. Each text delta is sent as an SSE `chunk` event to the browser | Strategic blueprint generation |
| **11. SSE Events → UI** | Each stream event | **Browser** `ReadableStream` reader in `useGeneration()` hook | Parses SSE events: `status`, `context`, `chunk`, `done`, `error`<br>Updates React state progressively | Real-time UI updates (progress, context display, streaming text) |
| **12. Output Display** | Text chunks accumulate | **React 19** + **Tailwind CSS** | Renders streaming text in right panel with typing cursor; shows retrieved chunks and cultural intel in left panel | Live generation visualization |
| **13. Completion** | Claude stream ends (`done` event) | **Next.js API Route** sends final SSE `done` event | Reports model, token usage (input + output), generation duration | Cost tracking, performance metrics |
| **14. Export** | User clicks Copy/Download | **Browser** `navigator.clipboard` / `Blob` + `URL.createObjectURL` | Copy to clipboard or download as `.md` file | Output delivery |

### Technology Inventory

| Technology | Version | Role | Location |
|------------|---------|------|----------|
| **Next.js** | 16.1.6 | Web framework, API routes, SSR | `app/` |
| **React** | 19 | UI rendering, state management | `app/src/` |
| **Tailwind CSS** | 4.x | Styling, responsive layout | `app/src/globals.css` |
| **shadcn/ui** | latest | UI component library (14 components) | `app/src/components/ui/` |
| **Node.js** | 22 LTS | Server runtime | API routes runtime |
| **TypeScript** | 5.x | Type safety | Throughout |
| **Google Cloud Firestore** | 8.x SDK | Vector store (chunks + documents) | `app/src/lib/embeddings.ts` |
| **Vertex AI Embeddings** | text-embedding-005 | 768-dim text embeddings | Via REST API + `google-auth-library` |
| **Claude Sonnet 4.5** | via Vertex AI | Strategic reasoning + generation | `app/src/lib/claude.ts` via `@anthropic-ai/vertex-sdk` |
| **Exa.ai** | REST API | Semantic web search (primary cultural) | `app/src/lib/cultural.ts` |
| **Tavily** | @tavily/core SDK | News + discussion search (secondary) | `app/src/lib/cultural.ts` |
| **PizZip** | latest | PPTX text extraction (in-memory) | `app/src/lib/file-parser.ts` |
| **pdf-parse** | latest | PDF text extraction (in-memory) | `app/src/lib/file-parser.ts` |
| **Mammoth** | 1.9.x | DOCX text extraction (in-memory) | `app/src/lib/file-parser.ts` |

### SSE Event Flow

```
Browser                   API Route                  External Services
  │                          │                              │
  │── POST /api/generate ──►│                              │
  │                          │── status: "retrieving" ────►│
  │◄── SSE: status ─────────│                              │
  │                          │── embed query ─────────────►│ Vertex AI
  │                          │◄── 768-dim vector ──────────│
  │                          │── search Firestore ────────►│ Firestore
  │                          │◄── top-10 chunks ───────────│
  │◄── SSE: status ─────────│── status: "cultural" ──────►│
  │                          │── parallel search ─────────►│ Exa + Tavily
  │                          │◄── cultural results ────────│
  │◄── SSE: context ────────│                              │
  │◄── SSE: status ─────────│── status: "generating" ────►│
  │                          │── stream request ──────────►│ Claude (Vertex)
  │◄── SSE: chunk ──────────│◄── text delta ───────────────│
  │◄── SSE: chunk ──────────│◄── text delta ───────────────│
  │◄── SSE: chunk ──────────│◄── text delta ───────────────│
  │    ... (streaming) ...   │    ... (streaming) ...       │
  │◄── SSE: done ───────────│◄── final message ───────────│
  │                          │                              │
```

### Trigger Map

| Trigger | Source | Target | Type |
|---------|--------|--------|------|
| Page load | Browser navigation | Next.js server | HTTP GET |
| Stats fetch | React `useEffect` mount | `/api/stats` → Firestore | HTTP GET → gRPC |
| File drop/select | User drag-drop or file picker | `/api/upload` | HTTP POST (FormData) |
| Generate click | User button click | `/api/generate` | HTTP POST (JSON) → SSE stream |
| Query embedding | Generate route Step 6 | Vertex AI REST API | HTTP POST (OAuth2) |
| Vector search | After embedding returns | Firestore `chunks` collection | gRPC (Firestore SDK) |
| Cultural search | After vector search | Exa.ai REST + Tavily SDK | HTTP POST (API keys) |
| Claude stream | After prompt assembly | Vertex AI Anthropic endpoint | HTTP POST (OAuth2) → SSE |
| SSE parsing | Each stream event | React state update | In-browser stream reader |
| Copy/Download | User action | Browser APIs | `navigator.clipboard` / `Blob` |

---

## ═══════════════════════════════════════════════════════════════
## COMPREHENSIVE NEXT STEPS - All Remaining Phases
## ═══════════════════════════════════════════════════════════════

### ✅ COMPLETED (Phase 0 + 1)

1. [x] Create GCP project `participation-translator`
2. [x] Implement parsers (PDF, PPTX, DOCX)
3. [x] Implement embeddings
4. [x] Seed knowledge graph
5. [x] Get sample presentations from Sylvia (19 files)
6. [x] Create data directories and copy files
7. [x] Create metadata manifest
8. [x] Add image-heavy detection
9. [x] Configure GCP service account key
10. [x] Index presentations to vector store (40 docs, 2,086 chunks)
11. [x] Integrate Exa.ai for cultural intelligence

---

### 🎯 IMMEDIATE (Easy Wins)

| # | Task | Complexity | Est. Time | Status |
|---|------|------------|-----------|--------|
| 1 | Demo retrieval to Leo | Low | 15 min | PENDING |
| 2 | ~~Add Tavily API (backup search)~~ | Low | 30 min | ✅ DONE |
| 3 | ~~Create context merger service~~ | Medium | 1 hr | ✅ DONE |
| 4 | ~~Build sentiment analysis endpoint~~ | Medium | 1 hr | ✅ DONE (needs model enabled) |
| 5 | Opus 4.6 compatibility audit | Low | 30 min | ✅ DONE |
| 6 | Evaluate Agent Teams feature for project | Medium | 1 hr | PENDING |

### 🔧 MAINTENANCE: Opus 4.6 Compatibility Audit

| # | Area | Description | Status |
|---|------|-------------|--------|
| M.1 | Services | Check all GCP/Vertex AI service configs for model version references | ✅ DONE |
| M.2 | Code | Audit `src/lib/` for hardcoded model identifiers or Opus-specific assumptions | ✅ DONE |
| M.3 | Skills | Review `.cursor/skills/` for outdated model references or capabilities | ✅ DONE |
| M.4 | Tools/CLI | Check CLI tools (`src/cli/`) for model-specific logic | ✅ DONE |
| M.5 | Rules | Review `.cursor/rules/` for Opus 4.5-specific guidance that needs updating | ✅ DONE |
| M.6 | Task Router | Update `src/lib/router/task-router.ts` model identifiers if needed | ✅ DONE |
| M.7 | Environment | Check `.env.example` and config for model version strings | ✅ DONE |
| M.8 | Prompts | Review `src/prompts/` for model-specific prompt tuning | ✅ DONE |

### 🎨 JL BRANDING TOOLKIT

| # | Task | Description | Priority | Status |
|---|------|-------------|----------|--------|
| B.1 | Ingest branding toolkit | Receive file, convert, index to vector store | HIGH | PENDING (awaiting file) |
| B.2 | Extract brand elements | Colors, typography, spacing, logo usage, tone | HIGH | PENDING |
| B.3 | Create JL Branding Skill | `.cursor/skills/jl-branding/SKILL.md` | HIGH | PENDING |
| B.4 | Apply to frontend | Tailwind theme, component styling per guidelines | MEDIUM | PENDING |
| B.5 | Apply to PPTX template | Branded slide master for presentation export | MEDIUM | PENDING |

**Note:** Branding Skill will be referenced by frontend, UI/UX, and presentation generation tasks.

---

### 🧪 EXPLORATION: Agent Teams Feature Viability

| # | Task | Description | Status |
|---|------|-------------|--------|
| E.1 | Research Agent Teams | Understand Cursor Agent Teams capabilities and constraints | PENDING |
| E.2 | Map to architecture | Evaluate fit with existing multi-agent delegation pattern | PENDING |
| E.3 | Prototype feasibility | Determine if Agent Teams can replace/enhance current subagent system | PENDING |
| E.4 | Document findings | Write up recommendation with pros/cons | PENDING |

---

### 📋 PHASE 2: 8-Part Framework Integration

| # | Task | Description | Complexity | Status |
|---|------|-------------|------------|--------|
| 2.1 | Document framework sections | Detailed spec per section | Medium | PENDING |
| 2.2 | Create system prompt templates | `/prompts/` directory | Medium | PENDING |
| 2.3 | Build prompt assembly service | Dynamic prompt construction | Medium | PENDING |
| 2.4 | Implement Claude integration | Vertex AI Claude calls | Medium | PENDING |
| 2.5 | Create output formatters | Structured JSON → display | Low | PENDING |
| 2.6 | Test with sample inputs | Validation outputs | Low | PENDING |
| 2.7 | Integrate evolution context | Context injection before gen | Medium | PENDING |

**Dependency:** Requires Leo's input on framework nuances

---

### 📋 PHASE 3: Cultural Intelligence (Continued)

| # | Task | Description | Complexity | Status |
|---|------|-------------|------------|--------|
| 3.1 | Exa.ai integration | Semantic web search | Low | ✅ DONE |
| 3.2 | Tavily integration | Backup search | Low | ✅ DONE |
| 3.3 | Build context merger | Dedupe + rank results | Medium | ✅ DONE |
| 3.4 | Sentiment analysis | Claude via Vertex AI | Medium | ✅ DONE (enable model) |
| 3.5 | Perplexity integration | Search + summarization | Low | PENDING |
| 3.6 | Build trend aggregator | Unified trend model | Medium | PENDING |
| 3.7 | Create subculture mapping | Audience → communities | Medium | PENDING |
| 3.8 | Build 72-hour trend hijacks | Time-sensitive opportunities | High | PENDING |

---

### 📋 PHASE 4: User Interface & Presentation

| # | Task | Description | Complexity | Status |
|---|------|-------------|------------|--------|
| 4.1 | Connect frontend to backend | API route integration | Medium | PENDING |
| 4.2 | Build generation progress UI | Real-time streaming | Medium | PENDING |
| 4.3 | Create JL presentation template | Branded PPTX master | High | PENDING |
| 4.4 | Build PPTX generation engine | PptxGenJS integration | High | PENDING |
| 4.5 | Build slide preview components | In-browser deck view | Medium | PENDING |
| 4.6 | Add export functionality | PPTX, PDF, Google Slides | Medium | PENDING |
| 4.7 | Implement history/saved outputs | User sessions with preview | Medium | PENDING |
| 4.8 | Create feedback dashboard | Ratings, corrections, suggestions | High | PENDING |
| 4.9 | Deck-input pair library | Auto-suggest idea write-ups for known decks | Medium | PENDING |
| 4.10 | Firestore session logging | Every generation logged per-user for learning | Medium | ✅ DONE |

---

### 📋 PHASE 5: Testing & Refinement

| # | Task | Description | Complexity | Status |
|---|------|-------------|------------|--------|
| 5.1 | End-to-end testing | Full pipeline test suite | Medium | PENDING |
| 5.2 | Prompt engineering refinement | Improved outputs | High | PENDING |
| 5.3 | Retrieval quality tuning | Better context selection | Medium | PENDING |
| 5.4 | Performance optimization | Sub-30s generation | Medium | PENDING |
| 5.5 | Security audit | Auth, data protection | Medium | PENDING |

---

### 📋 PHASE 6: Deployment & Training

| # | Task | Description | Complexity | Status |
|---|------|-------------|------------|--------|
| 6.1 | Production deployment | Cloud Run live with Dockerfile | Medium | ✅ DONE |
| 6.2 | Auth system | NextAuth.js + Google OAuth + email allowlist | Medium | ✅ DONE |
| 6.3 | Create user documentation | Demo walkthrough for Leo | Low | ✅ DONE |
| 6.4 | Training session | 1:1 walkthrough with Leo | Low | IN PROGRESS |
| 6.5 | Feedback collection | Iteration backlog | Low | PENDING |
| 6.6 | Handoff documentation | Maintenance guide | Low | PENDING |

---

### 🏆 PRIORITY ORDER (Recommended Sequence)

**Week 1 (Current):**
1. ✅ Vector indexing - DONE
2. ✅ Exa.ai integration - DONE
3. Demo to Leo
4. Tavily + context merger

**Week 2:**
5. Phase 2: Framework prompts (with Leo)
6. Claude generation integration
7. Basic output formatters

**Week 3:**
8. Phase 4: PPTX generation
9. Connect frontend APIs
10. Slide preview

**Week 4:**
11. Testing & refinement
12. Feedback dashboard
13. Production deployment

---

## Phase 3: Cultural Intelligence - IN PROGRESS

### 3.1 Exa.ai Integration - ✅ COMPLETE

| Priority | Task | Description | Status |
|----------|------|-------------|--------|
| HIGH | Create Exa.ai client | `src/lib/cultural/exa.ts` | ✅ DONE |
| HIGH | Add API key to .env | EXA_API_KEY configured | ✅ DONE |
| HIGH | Test semantic search | General + Reddit queries | ✅ DONE |
| HIGH | Create CLI tool | `npm run cultural` | ✅ DONE |
| HIGH | Document API | `docs/URL_API.md` | ✅ DONE |

### 3.2 Additional Cultural Sources - IN PROGRESS

| Priority | Task | Description | Status |
|----------|------|-------------|--------|
| MEDIUM | Integrate Tavily API | Backup semantic search | ✅ DONE |
| MEDIUM | Build context merger | Combine RAG + Cultural intel | ✅ DONE |
| MEDIUM | Implement sentiment analysis | Claude via Vertex AI | ✅ DONE (enable model) |
| MEDIUM | Integrate Perplexity | Search + summarization | PENDING |
| LOW | Reddit PRAW microservice | Direct API (if needed later) | DEFERRED |

**Note:** Direct Reddit API access deferred - Exa.ai provides excellent Reddit content coverage via semantic search

### 3.3 Reddit App Setup (For Future Direct API Access)

| Priority | Task | Description | Status |
|----------|------|-------------|--------|
| LOW | Create Reddit application | reddit.com/prefs/apps → "script" type | PENDING |
| LOW | Configure PRAW credentials | client_id, client_secret, user_agent | PENDING |
| LOW | Add Reddit env vars | REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET | PENDING |
| LOW | Implement PRAW client | `src/lib/cultural/reddit.ts` | PENDING |

**Reddit App Setup Instructions:**
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Choose "script" type (for server-side usage)
4. Name: `participation-translator`
5. Redirect URI: `http://localhost:8080` (required but not used for script apps)
6. Save credentials to `.env`:
   ```
   REDDIT_CLIENT_ID=your_client_id
   REDDIT_CLIENT_SECRET=your_client_secret
   REDDIT_USER_AGENT=participation-translator/1.0 by /u/your_username
   ```

**Note:** Currently using Exa.ai for Reddit content search. Direct PRAW access provides additional capabilities like subreddit-specific queries, comment threads, and real-time monitoring.

---

## CLI Commands Reference

```bash
# Ingest a document
npm run ingest -- ./path/to/document.pptx --client "ClientName" --type presentation

# Test retrieval
npm run retrieve -- "participation mechanics for automotive"

# Show vector store stats
npm run stats

# Seed knowledge graph
npm run seed-graph

# Convert PPTX to Markdown
npm run convert -- ./data/creators/file.pptx --output ./data/markdown/output.md
npm run convert -- ./data/creators/file.pptx --analysis  # Show text density analysis

# Extract structured metadata
npm run extract-metadata  # Creates JSON + CSV from markdown files

# Cultural Intelligence
npm run cultural -- search "sneaker culture Gen Z"
npm run cultural -- reddit "brand opinions Nike"
npm run cultural -- trends "streetwear fashion"
npm run cultural -- context "Adidas" "footwear"
npm run cultural -- answer "What are top sneaker trends?" --provider tavily
npm run cultural -- merge "participation for sneakers" --brand Adidas
npm run cultural -- sentiment "Nike brand perception" --brand Nike
npm run cultural -- sentiment "Nike brand" --brand Nike --deep  # Full analysis
```

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
