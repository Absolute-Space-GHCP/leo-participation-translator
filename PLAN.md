# The Participation Translator - Implementation Plan

Version: 1.1.0
Last Updated: 2026-02-06
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)

---

## Executive Summary

The Participation Translator is an internal AI-powered strategic tool that transforms "passive" advertising ideas into "participation-worthy" platforms. It combines JL's institutional knowledge with real-time cultural intelligence using a Retrieval-Augmented Generation (RAG) architecture.

**Priority:** HIGH | **Visibility:** HIGH | **Sponsor:** Leo (Founder)

---

## Table of Contents

1. [Progress at a Glance](#progress-at-a-glance)
2. [System Overview](#system-overview)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Implementation Phases](#implementation-phases)
6. [Component Specifications](#component-specifications)
7. [Integration Points](#integration-points)
8. [Data Pipeline](#data-pipeline)
9. [Deployment Strategy](#deployment-strategy)
10. [Success Criteria](#success-criteria)
11. [Risk Assessment](#risk-assessment)

---

## Progress at a Glance

| Phase | Name | Status | Completion |
|-------|------|--------|------------|
| **0** | Foundation Setup | ✅ COMPLETE | 100% |
| **1** | Knowledge Base & RAG Core | ✅ COMPLETE | ~95% (Vector Search upgrade pending) |
| **1.5** | Learning/Evolution System | ✅ COMPLETE | 100% |
| **2** | 8-Part Framework Integration | 🔜 READY | 0% (waiting for Leo) |
| **3** | Cultural Intelligence Layer | 🔄 IN PROGRESS | ~55% |
| **4** | User Interface & Presentation | 🔄 SCAFFOLDED | ~25% |
| **5** | Testing & Refinement | ⏳ PENDING | 0% |
| **6** | Deployment & Training | ⏳ PENDING | 0% |
| **M** | Maintenance / Compatibility | ✅ COMPLETE | 100% |
| **B** | JL Branding Toolkit | 🆕 AWAITING FILE | 0% |
| **E** | Exploration / R&D | 🆕 NEW | 0% |

**Data Assets:** 42 documents, 2,153 chunks indexed | 19 presentations | 76 creators | 15 media ideas

---

## System Overview

### Core Concept

Transform traditional advertising ideas into participation-worthy platforms by:

1. Grounding outputs in JL's historical excellence (past presentations, case studies)
2. Layering real-time cultural intelligence (trends, subcultures, momentum)
3. Applying the 8-Part Participation Framework systematically

### Strategic Inputs (The Knowledge Stack)

| Input                              | Source                                                   | Purpose                                             |
| ---------------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| **JL Institutional Memory**        | Vector DB (past presentations: VW, Adidas, etc.)         | Train on agency's unique voice and tactical history |
| **8-Part Participation Framework** | Structured prompt/system instructions                    | Governing logic for all strategic outputs           |
| **Culture & Subculture Feeds**     | Live APIs (Exa.ai, Tavily, Reddit, TikTok)               | Identify where people are already leaning in        |
| **Project Seed**                   | User input form                                          | Initial idea + budget, dates, brand considerations  |

### Desired Outputs

**Primary Output: Participation Blueprint Presentation (PPTX)**

The tool generates a **presentation-ready deck** that Leo can use directly with clients or internal teams. No reformatting required.

**A. The Participation Worthy Write-up** (9 slides):

| Slide | Section                       | Content                                |
| ----- | ----------------------------- | -------------------------------------- |
| 1     | Title                         | Brand, Campaign, Generated Date        |
| 2     | Current Cultural Context      | The "moving vehicle" in culture        |
| 3     | Brand Credibility             | Authentic "right to play"              |
| 4     | The Shared Interest           | Brand purpose meets consumer passion   |
| 5     | The Passive Trap              | Traditional approach to avoid          |
| 6     | The Participation Worthy Idea | "Unfinished Platform" (The Invitation) |
| 7     | Moments and Places            | Environments primed for participation  |
| 8     | Mechanics of Participation    | The tactical "how" (3-5 methods)       |
| 9     | First Responders              | Niche subcultures to ignite the fire   |
| 10    | The Ripple Effect             | Measurable cultural/business legacy    |

**B. The Participation Pack** (Additional slides):

| Slide | Section                | Content                                       |
| ----- | ---------------------- | --------------------------------------------- |
| 11    | The Big Audacious Act  | High-risk, high-reward provocation            |
| 12-14 | Subculture Mini-Briefs | Tailored variations per First Responder group |
| 15-17 | Mechanic Deep-Dives    | 3-5 specific participation methods detailed   |
| 18    | Casting & Creators     | Influencers, celebrities, community leaders   |
| 19    | Trend Hijacks          | 2-3 trends leverageable within 72 hours       |
| 20    | Next Steps             | Recommended actions and timeline              |

**Export Formats:**

- **PPTX** (Primary) - Presentation-ready, JL-branded template
- **PDF** - For sharing/review
- **Google Slides** - Direct export to Google Workspace

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     Web Application (Next.js/React)                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │ Project     │  │ Framework   │  │ Output      │  │ History/    │    │   │
│  │  │ Seed Form   │  │ Wizard      │  │ Viewer      │  │ Export      │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Cloud Run Service (Node.js/Express)                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │ /api/seed   │  │ /api/       │  │ /api/       │  │ /api/       │    │   │
│  │  │ (input)     │  │ generate    │  │ cultural    │  │ history     │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│   RAG PIPELINE        │ │  CULTURAL INTEL       │ │  REASONING ENGINE     │
│   (Retrieval)         │ │  (Real-time Feeds)    │ │  (Generation)         │
├───────────────────────┤ ├───────────────────────┤ ├───────────────────────┤
│ ┌─────────────────┐   │ │ ┌─────────────────┐   │ │ ┌─────────────────┐   │
│ │ Embedding       │   │ │ │ Exa.ai API      │   │ │ │ Claude Opus     │   │
│ │ Service         │   │ │ │ (Web Search)    │   │ │ │ 4.6             │   │
│ │ (Vertex AI)     │   │ │ └─────────────────┘   │ │ │ (configurable)  │   │
│ └────────┬────────┘   │ │ ┌─────────────────┐   │ │ └─────────────────┘   │
│          │            │ │ │ Tavily API      │   │ │ ┌─────────────────┐   │
│ ┌────────▼────────┐   │ │ │ (Backup Search) │   │ │ │ Chain of        │   │
│ │ Vector Store    │   │ │ └─────────────────┘   │ │ │ Thought         │   │
│ │ (Firestore +    │   │ │ ┌─────────────────┐   │ │ │ Prompting       │   │
│ │  Vector Search) │   │ │ │ Perplexity API  │   │ │ └─────────────────┘   │
│ └────────┬────────┘   │ │ │ (Search/Trends) │   │ │ ┌─────────────────┐   │
│          │            │ │ └─────────────────┘   │ │ │ 8-Part          │   │
│ ┌────────▼────────┐   │ │ ┌─────────────────┐   │ │ │ Framework       │   │
│ │ JL Knowledge    │   │ │ │ Reddit/TikTok   │   │ │ │ (System Prompt) │   │
│ │ Base            │   │ │ │ (via Exa.ai)    │   │ │ └─────────────────┘   │
│ │ - Presentations │   │ │ └─────────────────┘   │ │                       │
│ │ - Case Studies  │   │ │ ┌─────────────────┐   │ │                       │
│ │ - Frameworks    │   │ │ │ Sentiment       │   │ │                       │
│ └─────────────────┘   │ │ │ (Claude)        │   │ │                       │
│                       │ │ └─────────────────┘   │ │                       │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA PERSISTENCE LAYER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ Cloud Firestore │  │ Cloud Storage   │  │ BigQuery        │                 │
│  │ (Sessions,      │  │ (Documents,     │  │ (Analytics,     │                 │
│  │  Outputs)       │  │  Exports)       │  │  Usage Logs)    │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### RAG Pipeline Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RAG PIPELINE FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. DOCUMENT INGESTION                                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Past Presentations    →   Document Parser    →   Chunking   │   │
│  │  (PDF, PPTX, DOCX)         (Custom)               Strategy   │   │
│  └───────────────────────────────────┬──────────────────────────┘   │
│                                      │                               │
│  2. EMBEDDING GENERATION             ▼                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Text Chunks   →   Embedding Model   →   Vector Embeddings   │   │
│  │                    (text-embedding-005)   (768 dimensions)   │   │
│  └───────────────────────────────────┬──────────────────────────┘   │
│                                      │                               │
│  3. VECTOR STORAGE                   ▼                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Cloud Firestore (current) → Vertex AI Vector Search (prod)  │   │
│  │  - Metadata: client, date, campaign, category                │   │
│  │  - Namespace: presentations, frameworks, case_studies        │   │
│  └───────────────────────────────────┬──────────────────────────┘   │
│                                      │                               │
│  4. RETRIEVAL                        ▼                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  User Query   →   Query Embedding   →   Similarity Search    │   │
│  │                                          (Top-K: 5-10)       │   │
│  └───────────────────────────────────┬──────────────────────────┘   │
│                                      │                               │
│  5. AUGMENTED GENERATION             ▼                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Retrieved Context + Cultural Intel + Project Seed           │   │
│  │                          ↓                                   │   │
│  │  Claude Opus 4.6 (Chain of Thought Reasoning)                │   │
│  │                          ↓                                   │   │
│  │  Structured Blueprint JSON                                   │   │
│  └───────────────────────────────────┬──────────────────────────┘   │
│                                      │                               │
│  6. PRESENTATION GENERATION          ▼                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Blueprint JSON + JL Brand Template                          │   │
│  │                          ↓                                   │   │
│  │  PptxGenJS (Slide Generation)                                │   │
│  │                          ↓                                   │   │
│  │  Participation Blueprint Presentation (PPTX)                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Technologies

| Layer                      | Technology                          | Rationale                         |
| -------------------------- | ----------------------------------- | --------------------------------- |
| **Frontend**               | Next.js 14 + React 18               | Modern web app, SSR, API routes   |
| **Backend API**            | Node.js 22 LTS + Express            | Matches existing stack            |
| **Reasoning Engine**       | Claude Opus 4.6 (configurable)      | Best-in-class strategic reasoning |
| **Embedding Model**        | Vertex AI text-embedding-005        | Google ecosystem, high quality    |
| **Vector Store**           | Firestore (current) → Vector Search | GCP-native, production upgrade    |
| **Document Storage**       | Cloud Storage                       | Presentation files                |
| **Session/Output Storage** | Cloud Firestore                     | Real-time, scalable               |
| **Search API**             | Exa.ai + Tavily                     | Cultural momentum discovery       |
| **Presentation Gen**       | PptxGenJS + Custom Templates        | Native PPTX generation            |
| **Deployment**             | Cloud Run                           | Serverless, auto-scaling          |

### AI Model Configuration

| Model                  | Use Case                    | Availability             | Notes                           |
| ---------------------- | --------------------------- | ------------------------ | ------------------------------- |
| **Claude Opus 4.6**    | Primary (complex reasoning) | Anthropic API, Vertex AI | Current primary model           |
| **Claude Sonnet 4.5**  | Development/fallback        | Anthropic API, Vertex AI | Good balance of speed/quality   |
| **Claude Haiku 4.5**   | Simple tasks                | Anthropic API, Vertex AI | Fastest, lowest cost            |

```typescript
// Model configuration in .env
AI_MODEL_PROVIDER=vertex              // or 'anthropic'
AI_MODEL_NAME=claude-opus-4-6         // Current primary
AI_MODEL_FALLBACK=claude-sonnet-4-5   // Current fallback
```

### API Dependencies

| API                        | Purpose                     | Status              |
| -------------------------- | --------------------------- | ------------------- |
| **Vertex AI (Claude)**     | Claude Opus 4.6             | ✅ Active           |
| **Vertex AI (Embeddings)** | Vector embeddings           | ✅ Active           |
| **Exa.ai**                 | Semantic web search         | ✅ Active           |
| **Tavily**                 | Backup semantic search      | ✅ Active           |
| **Perplexity API**         | Search + summarization      | ⏳ Pending          |
| **Brandwatch**             | Social listening (optional) | ⏳ Pending          |

---

## Implementation Phases

### Phase 0: Foundation Setup ✅ COMPLETE

**Goal:** Project scaffolding and infrastructure setup

| Task | Description                    | Deliverable                                 | Status |
| ---- | ------------------------------ | ------------------------------------------- | ------ |
| 0.1  | Create project structure       | `/src`, `/api`, `/lib`, `/docs` directories | ✅ DONE |
| 0.2  | Initialize Next.js application | Working web app skeleton                    | ✅ DONE |
| 0.3  | Configure GCP project          | Cloud Run, Storage, Firestore enabled       | ✅ DONE |
| 0.4  | Set up environment variables   | `.env.example`, secure secrets              | ✅ DONE |
| 0.5  | Create agent delegation rules  | `.cursor/rules/agents.mdc`                  | ✅ DONE |
| 0.6  | Create 5 subagent definitions  | 2 active, 3 placeholders                    | ✅ DONE |
| 0.7  | Create participation-rag skill | SKILL.md + scripts                          | ✅ DONE |
| 0.8  | Create document-analysis skill | SKILL.md                                    | ✅ DONE |
| 0.9  | Adapt knowledge graph          | `src/lib/memory/knowledge-graph.ts`         | ✅ DONE |
| 0.10 | Adapt task router              | `src/lib/router/task-router.ts`             | ✅ DONE |
| 0.11 | Document GCP setup             | `docs/GCP_SETUP.md`                         | ✅ DONE |

---

### Phase 1: Knowledge Base & RAG Core ✅ ~95% COMPLETE

**Goal:** Build the JL institutional memory system

#### 1.1 GCP Infrastructure ✅ COMPLETE

| Task | Description                        | Deliverable                   | Status |
| ---- | ---------------------------------- | ----------------------------- | ------ |
| 1.1a | Create GCP project                | `participation-translator`    | ✅ DONE |
| 1.1b | Enable required APIs              | Vertex AI, Firestore, Storage | ✅ DONE |
| 1.1c | Set up service account            | IAM roles configured          | ✅ DONE |
| 1.1d | Link billing                      | JL billing account            | ✅ DONE |
| 1.1e | Create Cloud Storage buckets      | documents, exports            | ✅ DONE |
| 1.1f | Create Firestore database         | Native mode, us-central1      | ✅ DONE |
| 1.1g | Create Vector Search index        | 768 dimensions                | ⏳ PENDING (production upgrade) |

#### 1.2 Document Ingestion Pipeline ✅ COMPLETE

| Task | Description                        | Deliverable                      | Status |
| ---- | ---------------------------------- | -------------------------------- | ------ |
| 1.2a | Implement PDF parser              | `src/lib/parsers/index.ts`       | ✅ DONE |
| 1.2b | Implement PPTX parser             | `src/lib/parsers/index.ts`       | ✅ DONE |
| 1.2c | Implement DOCX parser             | `src/lib/parsers/index.ts`       | ✅ DONE |
| 1.2d | Implement chunking strategy       | Semantic with overlap            | ✅ DONE |
| 1.2e | Create CLI ingest script          | `src/cli/ingest.ts`              | ✅ DONE |
| 1.2f | Create batch ingest CLI           | `src/cli/batch-ingest.ts`        | ✅ DONE |
| 1.2g | PPTX to Markdown converter        | `src/cli/convert.ts`             | ✅ DONE |
| 1.2h | Image-heavy detection             | Skill + parser updated           | ✅ DONE |

#### 1.3 Embedding & Vector Storage ✅ MOSTLY COMPLETE

| Task | Description                        | Deliverable                           | Status |
| ---- | ---------------------------------- | ------------------------------------- | ------ |
| 1.3a | Implement embedding generation    | Vertex AI text-embedding-005          | ✅ DONE |
| 1.3b | Implement vector upsert           | Firestore (temp), Vector Search (prod)| ✅ DONE |
| 1.3c | Create retrieval API              | `src/cli/retrieve.ts`                 | ✅ DONE |
| 1.3d | Implement metadata filtering      | Client, category, year                | ✅ DONE |
| 1.3e | Upgrade to Vector Search          | For production performance            | ⏳ PENDING |

#### 1.4 Knowledge Graph ✅ COMPLETE

| Task | Description                        | Deliverable                | Status |
| ---- | ---------------------------------- | -------------------------- | ------ |
| 1.4a | Seed framework sections           | 9 sections as nodes        | ✅ DONE |
| 1.4b | Add strategic patterns            | 5 initial patterns         | ✅ DONE |
| 1.4c | Add initial tactics               | 4 initial tactics          | ✅ DONE |
| 1.4d | Create graph persistence          | JSON export to data/       | ✅ DONE |
| 1.4e | Build pattern extractor           | Identify JL patterns       | ⏳ PENDING |

#### 1.5 Initial Document Ingestion ✅ COMPLETE

| Task | Description                        | Deliverable                        | Status |
| ---- | ---------------------------------- | ---------------------------------- | ------ |
| 1.5a | Get sample presentations          | 19 PPTX files from Sylvia         | ✅ DONE |
| 1.5b | Copy to data directories          | presentations/creators/media       | ✅ DONE |
| 1.5c | Create metadata manifest          | manifest.csv with metadata         | ✅ DONE |
| 1.5d | Index to vector store             | 42 docs, 2,153 chunks             | ✅ DONE |
| 1.5e | Validate retrieval quality        | Tested with queries                | ✅ DONE |
| 1.5f | Extract structured metadata       | creators.json, media-ideas.json    | ✅ DONE |

#### Data Assets (as of 2026-02-06)

| Asset                       | Location                          | Count/Size     | Indexed |
| --------------------------- | --------------------------------- | -------------- | ------- |
| Participation Presentations | `data/presentations/`             | 19 PPTX files  | ✅ Yes  |
| Collection of Creators      | `data/creators/`                  | 1 file (326MB) | ✅ Yes  |
| Collection of Media Options | `data/media/`                     | 1 file (291MB) | ✅ Yes  |
| Metadata Manifest           | `data/presentations/manifest.csv` | 19 entries     | —       |
| Creators Markdown           | `data/markdown/creators.md`       | 54 KB          | ✅ Yes  |
| Media Options Markdown      | `data/markdown/media.md`          | 43 KB          | ✅ Yes  |
| Creators Metadata           | `data/metadata/creators.json`     | 76 creators    | —       |
| Media Ideas Metadata        | `data/metadata/media-ideas.json`  | 15 ideas       | —       |
| New PDF (from Leo)          | TBD                               | Large          | ⏳ Needs ingestion |
| JL Branding Toolkit         | TBD                               | Large (expected) | ⏳ Needs ingestion + Skill |

---

### Phase 1.5: Learning/Evolution System ✅ COMPLETE

**Goal:** Build the foundation for continuous improvement

See [docs/EVOLUTION.md](/docs/EVOLUTION.md) for full architecture.

| Task  | Description                              | Deliverable                          | Status |
| ----- | ---------------------------------------- | ------------------------------------ | ------ |
| 1.5.1 | Set up Firestore observation collections | Schema and indexes                   | ✅ DONE |
| 1.5.2 | Implement observation capture            | `src/lib/learning/observation-store.ts` | ✅ DONE |
| 1.5.3 | Implement pattern analyzer               | `src/lib/learning/pattern-analyzer.ts`  | ✅ DONE |
| 1.5.4 | Build context injector                   | `src/lib/learning/context-injector.ts`  | ✅ DONE |
| 1.5.5 | Create feedback capture UI               | Leo rating/edit interface            | ⏳ PENDING (Phase 4) |
| 1.5.6 | Integrate with knowledge graph           | Evolution nodes in graph             | ⏳ PENDING |

---

### Phase 2: 8-Part Framework Integration 🔜 READY

**Goal:** Codify the Participation Framework as system prompts

**Dependency:** Requires Leo's input on framework nuances

| Task | Description                    | Deliverable                         | Status |
| ---- | ------------------------------ | ----------------------------------- | ------ |
| 2.1  | Document framework sections    | Detailed spec per section           | ⏳ PENDING |
| 2.2  | Create system prompt templates | `/prompts/` directory               | ⏳ PENDING |
| 2.3  | Build prompt assembly service  | Dynamic prompt construction         | ⏳ PENDING |
| 2.4  | Implement Claude integration   | Vertex AI Claude calls              | ⏳ PENDING |
| 2.5  | Create output formatters       | Structured JSON → display           | ⏳ PENDING |
| 2.6  | Test with sample inputs        | Validation outputs                  | ⏳ PENDING |
| 2.7  | Integrate evolution context    | Context injection before generation | ⏳ PENDING |

---

### Phase 3: Cultural Intelligence Layer 🔄 ~55% COMPLETE

**Goal:** Real-time trend and subculture discovery

See [docs/CULTURAL_INTELLIGENCE.md](/docs/CULTURAL_INTELLIGENCE.md) for full research and alternatives.

| Task | Description                         | Deliverable                        | Status |
| ---- | ----------------------------------- | ---------------------------------- | ------ |
| 3.1  | Integrate Exa.ai API               | `src/lib/cultural/exa.ts`         | ✅ DONE |
| 3.2  | Integrate Tavily API                | `src/lib/cultural/tavily.ts`      | ✅ DONE |
| 3.3  | Build result merger/deduplicator    | `src/lib/cultural/merger.ts`      | ✅ DONE |
| 3.4  | Implement sentiment analysis        | `src/lib/cultural/sentiment.ts`   | ✅ DONE (needs model enabled) |
| 3.5  | Integrate Perplexity (failover)     | `src/lib/cultural/perplexity.ts`  | ⏳ PENDING |
| 3.6  | Build trend aggregator              | Unified trend data model           | ⏳ PENDING |
| 3.7  | Create subculture mapping           | Target audience → communities      | ⏳ PENDING |
| 3.8  | Build 72-hour trend hijacks         | Time-sensitive opportunities       | ⏳ PENDING |
| 3.9  | Reddit direct API (if needed)       | PRAW microservice (deferred)       | 🔽 DEFERRED |

**Note:** Direct Reddit API access deferred — Exa.ai provides excellent Reddit content coverage via semantic search.

---

### Phase 4: User Interface & Presentation Generation 🔄 ~25% SCAFFOLDED

**Goal:** Build Leo-friendly web application with presentation-ready output

| Task | Description                     | Deliverable                        | Status |
| ---- | ------------------------------- | ---------------------------------- | ------ |
| 4.0  | Create Next.js app              | `app/` directory                   | ✅ DONE |
| 4.0b | Install shadcn/ui               | 14 components installed            | ✅ DONE |
| 4.0c | Create landing page             | `app/src/app/page.tsx`             | ✅ DONE |
| 4.0d | Create generation wizard        | `app/src/app/generate/`            | ✅ DONE |
| 4.0e | Create history page             | `app/src/app/history/`             | ✅ DONE |
| 4.1  | Connect frontend to backend     | API route integration              | ⏳ PENDING |
| 4.2  | Build generation progress UI    | Real-time streaming                | ⏳ PENDING |
| 4.3  | Create JL presentation template | Branded PPTX master                | ⏳ PENDING |
| 4.4  | Build PPTX generation engine    | PptxGenJS integration              | ⏳ PENDING |
| 4.5  | Build slide preview components  | In-browser deck view               | ⏳ PENDING |
| 4.6  | Add export functionality        | PPTX, PDF, Google Slides           | ⏳ PENDING |
| 4.7  | Implement history/saved outputs | User sessions with preview         | ⏳ PENDING |
| 4.8  | Create feedback dashboard       | Ratings, corrections, suggestions  | ⏳ PENDING |
| 4.9  | Mobile responsiveness           | iPad-friendly                      | ⏳ PENDING |

---

### Phase 5: Testing & Refinement ⏳ PENDING

**Goal:** Quality assurance and tuning

| Task | Description                   | Deliverable                     | Status |
| ---- | ----------------------------- | ------------------------------- | ------ |
| 5.1  | End-to-end testing            | Test suite                      | ⏳ PENDING |
| 5.2  | Prompt engineering refinement | Improved outputs                | ⏳ PENDING |
| 5.3  | Retrieval quality tuning      | Better context selection        | ⏳ PENDING |
| 5.4  | Performance optimization      | Sub-30s generation              | ⏳ PENDING |
| 5.5  | Security audit                | Authentication, data protection | ⏳ PENDING |

---

### Phase 6: Deployment & Training ⏳ PENDING

**Goal:** Production launch and user onboarding

| Task | Description               | Deliverable            | Status |
| ---- | ------------------------- | ---------------------- | ------ |
| 6.1  | Production deployment     | Live Cloud Run service | ⏳ PENDING |
| 6.2  | Create user documentation | User guide for Leo     | ⏳ PENDING |
| 6.3  | Training session          | 1:1 walkthrough        | ⏳ PENDING |
| 6.4  | Feedback collection       | Iteration backlog      | ⏳ PENDING |
| 6.5  | Handoff documentation     | Maintenance guide      | ⏳ PENDING |

---

### Phase M: Maintenance & Compatibility 🆕

**Goal:** Keep tooling current with AI model and IDE upgrades

#### M.1 Opus 4.6 Compatibility Audit

| Task | Area | Description | Status |
|------|------|-------------|--------|
| M.1a | Services | Check GCP/Vertex AI service configs for model version references | ✅ DONE |
| M.1b | Code | Audit `src/lib/` for hardcoded model identifiers | ✅ DONE |
| M.1c | Skills | Review `.cursor/skills/` for outdated model references | ✅ DONE |
| M.1d | CLI Tools | Check `src/cli/` for model-specific logic | ✅ DONE |
| M.1e | Rules | Review `.cursor/rules/` for Opus 4.5-specific guidance | ✅ DONE |
| M.1f | Task Router | Update `src/lib/router/task-router.ts` model IDs if needed | ✅ DONE |
| M.1g | Environment | Check `.env.example` and config for model version strings | ✅ DONE |
| M.1h | Prompts | Review `src/prompts/` for model-specific prompt tuning | ✅ DONE |

---

### Phase B: JL Branding Toolkit 🆕

**Goal:** Ingest JL brand guidelines and create a reusable Branding Skill for frontend/UI/presentation design

| Task | Description | Deliverable | Priority | Status |
|------|-------------|-------------|----------|--------|
| B.1 | Receive and ingest JL Branding Toolkit deck | Indexed in vector store | 🔴 HIGH | ⏳ PENDING (awaiting file) |
| B.2 | Convert to Markdown (if PPTX/PDF) | `data/markdown/jl-branding-toolkit.md` | 🔴 HIGH | ⏳ PENDING |
| B.3 | Extract brand elements | Colors, typography, spacing, logo usage, tone | 🔴 HIGH | ⏳ PENDING |
| B.4 | Create JL Branding Skill | `.cursor/skills/jl-branding/SKILL.md` | 🔴 HIGH | ⏳ PENDING |
| B.5 | Apply to frontend components | Tailwind theme, component styling | 🟡 MEDIUM | ⏳ PENDING |
| B.6 | Apply to PPTX export template | Branded slide master for PptxGenJS | 🟡 MEDIUM | ⏳ PENDING |

**Branding Skill will be used for:**
- Frontend UI/UX design decisions (colors, fonts, spacing, components)
- Presentation template generation (PPTX export branding)
- Any user-facing output that represents JL

---

### Phase E: Exploration & R&D 🆕

**Goal:** Evaluate new capabilities for potential integration

#### E.1 Agent Teams Feature Viability

| Task | Description | Status |
|------|-------------|--------|
| E.1a | Research Agent Teams capabilities and constraints | ⏳ PENDING |
| E.1b | Map to existing multi-agent delegation pattern | ⏳ PENDING |
| E.1c | Prototype feasibility assessment | ⏳ PENDING |
| E.1d | Document recommendation with pros/cons | ⏳ PENDING |

---

### Progress Dashboard 🔄 BUILT (Not Deployed)

| Task | Description | Status |
|------|-------------|--------|
| D.1 | Create dashboard server | ✅ DONE (`dashboard/server.js`) |
| D.2 | Create tasks data model | ✅ DONE (`dashboard/tasks.json`, 80+ tasks) |
| D.3 | Create Dockerfile | ✅ DONE (`dashboard/Dockerfile`) |
| D.4 | Create deploy script | ✅ DONE (`dashboard/deploy.sh`) |
| D.5 | Deploy to Cloud Run | ⏳ PENDING |
| D.6 | Configure IAP (Leo/Charley/Maggie) | ⏳ PENDING |
| D.7 | Sync tasks.json with TASKS.md | ⏳ PENDING |

**Local test:** `cd dashboard && node server.js` → http://localhost:8080

---

## 🏆 Recommended Priority Order

### Before Leo Arrives (Quick Wins - 30 min)

| # | Task | Time | Phase |
|---|------|------|-------|
| 1 | Opus 4.6 compatibility audit | ~15 min | M.1 |
| 2 | Agent Teams quick research | ~15 min | E.1a |

### With Leo (Session Focus)

| # | Task | Time | Phase |
|---|------|------|-------|
| 3 | Demo retrieval to Leo | 15 min | Immediate #1 |
| 4 | Phase 2 kickoff - Framework specs | 30-60 min | 2.1 |

### After Leo Session (Backend Work)

| # | Task | Time | Phase |
|---|------|------|-------|
| 5 | Deploy dashboard to Cloud Run | 30 min | D.5-D.6 |
| 6 | Perplexity integration | 30 min | 3.5 |
| 7 | Build trend aggregator | 1 hr | 3.6 |
| 8 | Connect frontend to backend APIs | 1-2 hr | 4.1 |

---

## Component Specifications

### 1. Document Ingestion Service

```typescript
// src/lib/parsers/index.ts
/**
 * Supported formats: PDF, PPTX, DOCX, TXT
 * Output: Structured chunks with metadata
 * Includes image-heavy detection for PPTX files
 */
```

**Chunking Strategy:**

- Chunk size: 512-1024 tokens
- Overlap: 50-100 tokens
- Preserve slide/section boundaries
- Metadata: filename, page, section, client, campaign

### 2. Vector Store Schema

```javascript
// Firestore vector store (current) → Vertex AI Vector Search (production)
{
  id: "uuid",
  values: [/* 768 float32 embeddings */],
  metadata: {
    source: "presentations/vw-think-small-2024.pptx",
    client: "Volkswagen",
    campaign: "Think Small Revival",
    section: "Strategy",
    page: 12,
    chunk_index: 3,
    created_at: "2026-01-15T10:00:00Z"
  }
}
```

### 3. 8-Part Framework System Prompt

```
You are a senior strategist at Johannes Leonardo...

PARTICIPATION FRAMEWORK:

1. CURRENT CULTURAL CONTEXT
   Identify the momentum. What's the "moving vehicle" in culture right now?

2. BRAND CREDIBILITY
   Define the brand's authentic "right to play" in this space.

3. THE SHARED INTEREST
   Find the intersection where brand purpose meets consumer passion.

... [Full framework codified]

OUTPUT FORMAT:
Return a structured Participation Blueprint with all 9 sections...
```

### 4. Cultural Intelligence Service

```typescript
// src/lib/cultural/index.ts - Multi-source cultural intelligence
// Active: Exa.ai, Tavily, Sentiment (Claude)
// Pending: Perplexity, trend aggregator, subculture mapping
```

### 5. Presentation Generation Service

```typescript
// src/lib/export/pptx.ts
import PptxGenJS from "pptxgenjs";

// Generates 20-slide branded PPTX from blueprint JSON
// Export: PPTX (primary), PDF, Google Slides
```

---

## Integration Points

### Existing Infrastructure Integration

| System             | Integration Method             | Purpose                  | Status |
| ------------------ | ------------------------------ | ------------------------ | ------ |
| **GCP Vertex AI**  | SDK (@google-cloud/aiplatform) | Claude, embeddings       | ✅ Active |
| **Cloud Run**      | gcloud CLI deploy              | Serverless hosting       | ⏳ Pending |
| **Cloud Storage**  | SDK (@google-cloud/storage)    | Document storage         | ✅ Active |
| **Firestore**      | SDK (firebase-admin)           | Session/output storage   | ✅ Active |
| **GitHub Actions** | Workflow YAML                  | CI/CD pipeline           | ⏳ Pending |
| **Slack**          | Webhook                        | Deployment notifications | ⏳ Pending |

### Authentication Flow

```
User → Cloud IAP (Identity-Aware Proxy) → Cloud Run → GCP APIs
                     ↓
              JL Google Workspace
```

---

## Data Pipeline

### Document Ingestion Pipeline (Active)

```
Admin runs CLI:
  npm run ingest -- <file> --client "Name" --type presentation
           ↓
Parse document → Chunk → Embed → Store vectors in Firestore
           ↓
Metadata updated in manifest
```

### Cultural Intelligence Pipeline (Active)

```
CLI or API request:
  npm run cultural -- search "query"
           ↓
Exa.ai + Tavily (parallel) → Merge & Dedupe → Return ranked results
           ↓
Optional: Sentiment analysis via Claude
```

### Future: Daily Automated Pipeline

```
06:00 UTC: Fetch trending topics (Reddit, TikTok, Twitter/X)
           ↓
07:00 UTC: Process and categorize trends
           ↓
08:00 UTC: Update "Cultural Momentum" cache in Firestore
           ↓
On-demand: User queries pull fresh + cached cultural data
```

---

## Deployment Strategy

### Environment Tiers

| Environment     | URL                          | Purpose           | Status |
| --------------- | ---------------------------- | ----------------- | ------ |
| **Development** | localhost:3000               | Local development | ✅ Active |
| **Dashboard**   | localhost:8080               | Progress tracking | ✅ Local only |
| **Staging**     | participation-staging.jl.dev | Testing/QA        | ⏳ Pending |
| **Production**  | participation.jl.dev         | Leo's access      | ⏳ Pending |

### Cloud Run Configuration

```yaml
# cloudrun.yaml
service: participation-translator
region: us-central1
memory: 2Gi
cpu: 2
max-instances: 10
min-instances: 1 # Keep warm for Leo
timeout: 300s # Allow long generations
```

---

## Success Criteria

### Functional Requirements

| Requirement         | Metric           | Target         |
| ------------------- | ---------------- | -------------- |
| Generation time     | End-to-end       | < 60 seconds   |
| Output quality      | Leo satisfaction | 8+/10 rating   |
| Retrieval relevance | Context accuracy | > 85% relevant |
| Trend freshness     | Data age         | < 24 hours     |
| Availability        | Uptime           | 99.5%          |

### Non-Functional Requirements

| Requirement       | Target                             |
| ----------------- | ---------------------------------- |
| Mobile-friendly   | iPad responsive                    |
| Primary output    | **PPTX presentation** (20 slides)  |
| Export formats    | PPTX (primary), PDF, Google Slides |
| Template branding | JL brand guidelines applied        |
| History retention | 90 days                            |
| Concurrent users  | 5 (internal tool)                  |

---

## Risk Assessment

| Risk                              | Likelihood | Impact | Mitigation                        |
| --------------------------------- | ---------- | ------ | --------------------------------- |
| Low-quality RAG retrieval         | Medium     | High   | Extensive testing, prompt tuning  |
| API rate limits (Exa, Perplexity) | Medium     | Medium | Caching, fallback sources         |
| Claude hallucinations             | Medium     | High   | Grounding in retrieved context    |
| Slow generation time              | Low        | Medium | Streaming responses, optimization |
| Leo UX friction                   | Medium     | High   | User testing, iteration           |
| Cost overruns                     | Low        | Medium | Usage monitoring, budgets         |

---

## Leo's Requirements (Founder Session - 2026-02-05)

See full details in [docs/LEOS_REQUIREMENTS.md](/docs/LEOS_REQUIREMENTS.md)

### Core Design Decisions

| Decision                  | Specification                                         |
| ------------------------- | ----------------------------------------------------- |
| Framework visibility      | **INVISIBLE** in output - seamless flow               |
| Input format              | Manifesto-style, few paragraphs, single page          |
| Strategy deck key element | Extract the "Shared Interest" reframe                 |
| Executional flexibility   | Not every suggestion needs creative + media + creator |
| Social platform for POC   | Reddit first (official API)                           |
| Initial access            | Leo + Charley only                                    |
| Feedback approach         | Dashboard with ratings, corrections, text suggestions |

### Output Tiers

**Tier A: High-Level Summary**
- Participation Worthy Idea Write-up (transformed manifesto, seamless flow)
- Overall Creative Approach
- Media Strategy Overview
- Creator/Influencer Strategy Overview

**Tier B: Specific Executional Recommendations**
- Each MAY combine: Creative idea + Media choice + Creator choice
- NOT every suggestion needs all three elements

### Rollout Plan

| Phase | Scope                             | Feedback By          |
| ----- | --------------------------------- | -------------------- |
| 1     | Single specific assignment        | Leo + Charley        |
| 2     | Same client, different assignment | Leo + Charley        |
| 3     | Same internal client team         | Leo + Charley + Team |
| 4+    | Broader rollout                   | Internal teams       |

---

## CLI Commands Reference

```bash
# Ingest a document
npm run ingest -- ./path/to/document.pptx --client "ClientName" --type presentation

# Batch ingest
npm run batch-ingest -- --dry-run

# Test retrieval
npm run retrieve -- "participation mechanics for automotive"

# Show vector store stats
npm run stats

# Seed knowledge graph
npm run seed-graph

# Convert PPTX to Markdown
npm run convert -- ./data/creators/file.pptx --output ./data/markdown/output.md

# Extract structured metadata
npm run extract-metadata

# Cultural Intelligence
npm run cultural -- search "sneaker culture Gen Z"
npm run cultural -- reddit "brand opinions Nike"
npm run cultural -- trends "streetwear fashion"
npm run cultural -- context "Adidas" "footwear"
npm run cultural -- answer "What are top sneaker trends?" --provider tavily
npm run cultural -- merge "participation for sneakers" --brand Adidas
npm run cultural -- sentiment "Nike brand perception" --brand Nike

# Dashboard (local)
cd dashboard && node server.js
```

---

_This plan is a living document. Update as requirements evolve._

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-06
