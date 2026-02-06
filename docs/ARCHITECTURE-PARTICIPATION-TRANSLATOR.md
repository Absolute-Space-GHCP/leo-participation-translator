# Participation Translator - Technical Architecture

Version: 1.0.1
Last Updated: 2026-02-03
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

---

## Overview

This document details the technical architecture for The Participation Translator, an AI-powered strategic tool that transforms passive advertising ideas into participation-worthy platforms.

---

## System Components

### 1. Frontend Application

**Technology:** Next.js 14 with App Router, React 18, Tailwind CSS

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    App Router (Next.js 14)               │    │
│  │  /                     → Landing page                    │    │
│  │  /generate             → Multi-step generation wizard    │    │
│  │  /generate/[id]        → View generation in progress     │    │
│  │  /history              → Past outputs list               │    │
│  │  /history/[id]         → View specific output            │    │
│  │  /admin/ingest         → Document upload (admin)         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────┐      │
│  │                  Component Library                     │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │      │
│  │  │ SeedForm    │  │ OutputView  │  │ ExportMenu  │   │      │
│  │  │ (wizard)    │  │ (blueprint) │  │ (PDF/PPTX)  │   │      │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │      │
│  │  │ ProgressBar │  │ TrendCard   │  │ HistoryList │   │      │
│  │  │ (streaming) │  │ (cultural)  │  │ (sessions)  │   │      │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**

- Server-side rendering for SEO and performance
- Streaming responses for real-time generation feedback
- Responsive design (desktop + iPad)
- Dark mode support

### 2. Backend API Layer

**Technology:** Next.js API Routes (Node.js runtime)

```
┌─────────────────────────────────────────────────────────────────┐
│                      API ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Routes                            │    │
│  │                                                          │    │
│  │  POST /api/generate                                      │    │
│  │    → Accept project seed                                 │    │
│  │    → Orchestrate RAG + Cultural + Generation             │    │
│  │    → Return streaming response                           │    │
│  │                                                          │    │
│  │  GET /api/generate/[id]                                  │    │
│  │    → Get generation status/result                        │    │
│  │                                                          │    │
│  │  GET /api/cultural/trends                                │    │
│  │    → Fetch current cultural momentum                     │    │
│  │                                                          │    │
│  │  POST /api/ingest                                        │    │
│  │    → Upload and process documents                        │    │
│  │                                                          │    │
│  │  GET /api/history                                        │    │
│  │    → List past generations                               │    │
│  │                                                          │    │
│  │  GET /api/history/[id]                                   │    │
│  │    → Get specific output                                 │    │
│  │                                                          │    │
│  │  POST /api/export/[format]                               │    │
│  │    → Export to PDF/PPTX/DOCX                             │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3. RAG Pipeline

**Technology:** LangChain.js, Vertex AI Embeddings, Pinecone/Vertex AI Vector Search

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE DETAIL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INGESTION FLOW                                                  │
│  ═══════════════                                                 │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │ Document    │    │ Parser      │    │ Chunker     │          │
│  │ Upload      │ ─► │ (pdf-parse, │ ─► │ (semantic   │          │
│  │ (GCS)       │    │ mammoth,    │    │ splitting)  │          │
│  │             │    │ pptx2json)  │    │             │          │
│  └─────────────┘    └─────────────┘    └──────┬──────┘          │
│                                               │                  │
│                                               ▼                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │ Vector DB   │ ◄─ │ Vertex AI   │ ◄─ │ Text        │          │
│  │ (Pinecone   │    │ Embeddings  │    │ Chunks      │          │
│  │ or Vertex)  │    │ (768-dim)   │    │ + Metadata  │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                  │
│  RETRIEVAL FLOW                                                  │
│  ══════════════                                                  │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │ User Query  │    │ Query       │    │ Similarity  │          │
│  │ (Project    │ ─► │ Embedding   │ ─► │ Search      │          │
│  │ Seed)       │    │             │    │ (Top-K=10)  │          │
│  └─────────────┘    └─────────────┘    └──────┬──────┘          │
│                                               │                  │
│                                               ▼                  │
│                                        ┌─────────────┐          │
│                                        │ Retrieved   │          │
│                                        │ Context     │          │
│                                        │ (Ranked)    │          │
│                                        └─────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Chunking Strategy:**

| Parameter    | Value                 | Rationale                        |
| ------------ | --------------------- | -------------------------------- |
| Chunk size   | 512-1024 tokens       | Balance context vs. specificity  |
| Overlap      | 64 tokens             | Preserve cross-chunk context     |
| Split method | Semantic + structural | Respect slide/section boundaries |

**Metadata Schema:**

```typescript
interface ChunkMetadata {
  id: string; // UUID
  source: string; // File path in GCS
  client: string; // Client name (VW, Adidas, etc.)
  campaign?: string; // Campaign name if applicable
  documentType: "presentation" | "case_study" | "framework";
  section?: string; // Strategic section name
  page?: number; // Page/slide number
  chunkIndex: number; // Position in document
  createdAt: Date;
  tokenCount: number;
}
```

### 4. Cultural Intelligence Service

**Technology:** Exa.ai + Tavily (dual), Gemini Grounding + Perplexity (failover), Reddit API

See [CULTURAL_INTELLIGENCE.md](./CULTURAL_INTELLIGENCE.md) for full research, alternatives, and pricing.

```
┌─────────────────────────────────────────────────────────────────┐
│                CULTURAL INTELLIGENCE ARCHITECTURE                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SEMANTIC WEB SEARCH (DUAL INTEGRATION)                          │
│  ══════════════════════════════════════                          │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐                             │
│  │ Exa.ai      │    │ Tavily      │    Alternatives:            │
│  │ (Neural     │    │ (LLM-       │    • Parallel (deep)        │
│  │ Search)     │    │ Optimized)  │    • Brave (volume)         │
│  │ 94.9% acc   │    │ 93.3% acc   │    • You.com (enterprise)   │
│  └──────┬──────┘    └──────┬──────┘                             │
│         │                  │                                     │
│         └────────┬─────────┘                                     │
│                  ▼                                               │
│         ┌─────────────────┐                                      │
│         │ Result Merger   │                                      │
│         │ & Deduplication │                                      │
│         └────────┬────────┘                                      │
│                  │                                               │
│  SEARCH + SUMMARIZATION (FAILOVER)                               │
│  ═════════════════════════════════                               │
│                  │                                               │
│  ┌───────────────▼───────────────┐                              │
│  │ Gemini + Google Search        │──failover──┐                 │
│  │ Grounding (PRIMARY)           │            │                 │
│  │ Native GCP, ~$0.001/query     │            ▼                 │
│  └───────────────────────────────┘   ┌─────────────────┐        │
│                                      │ Perplexity API  │        │
│                                      │ (FAILOVER)      │        │
│                                      │ $5/1000 queries │        │
│                                      └─────────────────┘        │
│                  │                                               │
│  PLATFORM-SPECIFIC SOURCES                                       │
│  ═════════════════════════                                       │
│                  │                                               │
│  ┌───────────────▼───────────────┐    ┌─────────────────┐       │
│  │ Reddit API (PRAW)             │    │ TikTok Trends   │       │
│  │ Official, Free, 100 QPM       │    │ (via Exa search │       │
│  │                               │    │ of news/blogs)  │       │
│  └───────────────────────────────┘    └─────────────────┘       │
│                  │                                               │
│  ANALYSIS LAYER                                                  │
│  ═══════════════                                                 │
│                  │                                               │
│  ┌───────────────▼───────────────────────────────────────┐      │
│  │ Claude Opus 4.6 - Sentiment & Trend Analysis          │      │
│  │ • Cultural moment identification                      │      │
│  │ • 72-hour opportunity window detection                │      │
│  │ • Subculture mapping                                  │      │
│  └───────────────────────────────────────────────────────┘      │
│                  │                                               │
│  FUTURE: Social Listening (when needed)                          │
│  ═══════════════════════════════════════                         │
│  • Xpoz ($20/mo) - AI-native, budget                            │
│  • Brand24 ($79/mo) - Comprehensive                             │
│  • Brandwatch ($800+/mo) - Enterprise                           │
│                  │                                               │
│                  ▼                                               │
│         ┌─────────────────┐                                      │
│         │ Firestore       │                                      │
│         │ (Cached Trends) │                                      │
│         │ 24-hour TTL     │                                      │
│         └─────────────────┘                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Cultural Data Model:**

```typescript
interface CulturalContext {
  timestamp: Date;

  currentMomentum: {
    topic: string;
    description: string;
    velocity: "rising" | "peak" | "declining";
    relevance: number; // 0-1 score
    sources: string[];
  }[];

  subcultures: {
    name: string;
    platforms: string[]; // Reddit, TikTok, Discord, etc.
    interests: string[];
    size: "niche" | "growing" | "mainstream";
    engagementStyle: string;
  }[];

  trendHijacks: {
    trend: string;
    expiresIn: string; // "72 hours", "1 week"
    brandFit: number; // 0-1 score
    riskLevel: "low" | "medium" | "high";
    executionHint: string;
  }[];
}
```

### 5. Generation Engine

**Technology:** Vertex AI Claude 3.5 Sonnet, LangChain.js

```
┌─────────────────────────────────────────────────────────────────┐
│                  GENERATION ENGINE ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT ASSEMBLY                                                  │
│  ══════════════                                                  │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Project     │  │ Retrieved   │  │ Cultural    │              │
│  │ Seed        │  │ Context     │  │ Context     │              │
│  │ (User)      │  │ (RAG)       │  │ (APIs)      │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│                  ┌─────────────┐                                 │
│                  │ Prompt      │                                 │
│                  │ Assembler   │                                 │
│                  └──────┬──────┘                                 │
│                         │                                        │
│  SYSTEM PROMPT          │                                        │
│  ═════════════          │                                        │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8-PART PARTICIPATION FRAMEWORK                          │    │
│  │                                                          │    │
│  │ You are a senior strategist at Johannes Leonardo...      │    │
│  │                                                          │    │
│  │ FRAMEWORK SECTIONS:                                      │    │
│  │ 1. Current Cultural Context                              │    │
│  │ 2. Brand Credibility                                     │    │
│  │ 3. The Shared Interest                                   │    │
│  │ 4. The Passive Trap                                      │    │
│  │ 5. The Participation Worthy Idea                         │    │
│  │ 6. Moments and Places                                    │    │
│  │ 7. Mechanics of Participation                            │    │
│  │ 8. First Responders                                      │    │
│  │ 9. The Ripple Effect                                     │    │
│  │                                                          │    │
│  │ OUTPUT: Structured Participation Blueprint...            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         ▼                                        │
│                 ┌─────────────┐                                  │
│                 │ Claude 3.5  │                                  │
│                 │ Sonnet      │                                  │
│                 │ (Vertex AI) │                                  │
│                 └──────┬──────┘                                  │
│                        │                                         │
│                        ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ OUTPUT                                                   │    │
│  │                                                          │    │
│  │ A. Participation Worthy Write-up (9 sections)           │    │
│  │ B. Participation Pack                                    │    │
│  │    - Big Audacious Act                                   │    │
│  │    - Subculture Mini-Briefs                              │    │
│  │    - Mechanic Deep-Dives                                 │    │
│  │    - Casting & Creators                                  │    │
│  │    - Trend Hijacks                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Chain of Thought Implementation:**

```typescript
const generateBlueprint = async (input: GenerationInput) => {
  // Step 1: Research phase
  const researchPrompt = buildResearchPrompt(input);
  const research = await claude.generate(researchPrompt);

  // Step 2: Framework application
  const frameworkPrompt = buildFrameworkPrompt(input, research);
  const writeup = await claude.generate(frameworkPrompt);

  // Step 3: Participation Pack generation
  const packPrompt = buildPackPrompt(input, writeup);
  const pack = await claude.generate(packPrompt);

  return { writeup, pack };
};
```

### 6. Data Persistence

**Technology:** Cloud Firestore, Cloud Storage

```
┌─────────────────────────────────────────────────────────────────┐
│                  DATA PERSISTENCE ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLOUD FIRESTORE                                                 │
│  ═══════════════                                                 │
│                                                                  │
│  Collections:                                                    │
│                                                                  │
│  ├── users/                                                      │
│  │   └── {userId}                                                │
│  │       ├── email: string                                       │
│  │       ├── name: string                                        │
│  │       └── createdAt: timestamp                                │
│  │                                                               │
│  ├── generations/                                                │
│  │   └── {generationId}                                          │
│  │       ├── userId: string                                      │
│  │       ├── status: 'pending' | 'processing' | 'complete'       │
│  │       ├── seed: ProjectSeed                                   │
│  │       ├── output: ParticipationBlueprint                      │
│  │       ├── createdAt: timestamp                                │
│  │       └── completedAt: timestamp                              │
│  │                                                               │
│  ├── documents/                                                  │
│  │   └── {documentId}                                            │
│  │       ├── filename: string                                    │
│  │       ├── storagePath: string                                 │
│  │       ├── client: string                                      │
│  │       ├── chunkCount: number                                  │
│  │       ├── status: 'processing' | 'indexed'                    │
│  │       └── createdAt: timestamp                                │
│  │                                                               │
│  └── cultural_cache/                                             │
│      └── {date}                                                  │
│          ├── trends: CulturalContext                             │
│          └── updatedAt: timestamp                                │
│                                                                  │
│  CLOUD STORAGE                                                   │
│  ═════════════                                                   │
│                                                                  │
│  Buckets:                                                        │
│                                                                  │
│  ├── participation-documents/                                    │
│  │   ├── presentations/                                          │
│  │   │   └── {client}/{filename}                                 │
│  │   ├── case_studies/                                           │
│  │   │   └── {client}/{filename}                                 │
│  │   └── frameworks/                                             │
│  │       └── {filename}                                          │
│  │                                                               │
│  └── participation-exports/                                      │
│      └── {userId}/{generationId}/                                │
│          └── {filename}.{format}                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GOOGLE CLOUD PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           VPC Network                                    │    │
│  │                                                                          │    │
│  │  ┌───────────────────┐        ┌───────────────────┐                     │    │
│  │  │   Cloud Load      │        │   Cloud IAP       │                     │    │
│  │  │   Balancer        │◄──────►│   (Auth)          │                     │    │
│  │  │   (HTTPS)         │        │                   │                     │    │
│  │  └─────────┬─────────┘        └───────────────────┘                     │    │
│  │            │                                                             │    │
│  │            ▼                                                             │    │
│  │  ┌───────────────────────────────────────────────────────────────┐      │    │
│  │  │                       Cloud Run                                │      │    │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │      │    │
│  │  │  │           participation-translator                       │  │      │    │
│  │  │  │                                                          │  │      │    │
│  │  │  │  Container: Next.js Application                          │  │      │    │
│  │  │  │  Memory: 2Gi  |  CPU: 2  |  Min: 1  |  Max: 10           │  │      │    │
│  │  │  │                                                          │  │      │    │
│  │  │  └─────────────────────────────────────────────────────────┘  │      │    │
│  │  └───────────────────────────────┬───────────────────────────────┘      │    │
│  │                                  │                                       │    │
│  │          ┌───────────────────────┼───────────────────────┐              │    │
│  │          │                       │                       │              │    │
│  │          ▼                       ▼                       ▼              │    │
│  │  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐       │    │
│  │  │ Firestore   │         │ Cloud       │         │ Vertex AI   │       │    │
│  │  │ (Native)    │         │ Storage     │         │             │       │    │
│  │  │             │         │             │         │ • Claude 3.5│       │    │
│  │  │ • Sessions  │         │ • Documents │         │ • Embeddings│       │    │
│  │  │ • Outputs   │         │ • Exports   │         │ • Vector    │       │    │
│  │  │ • Cache     │         │             │         │   Search    │       │    │
│  │  └─────────────┘         └─────────────┘         └─────────────┘       │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        External Services                                 │    │
│  │                                                                          │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │    │
│  │  │ Exa.ai      │    │ Perplexity  │    │ Zapier      │                  │    │
│  │  │ (Search)    │    │ (Search)    │    │ (Automation)│                  │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘                  │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │     │ Cloud IAP   │     │ Cloud Run   │     │ GCP APIs    │
│   Browser   │     │ (Google     │     │ Service     │     │             │
│             │     │ Workspace)  │     │             │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │  HTTPS Request    │                   │                   │
       │──────────────────►│                   │                   │
       │                   │                   │                   │
       │  Google Login     │                   │                   │
       │◄─────────────────►│                   │                   │
       │                   │                   │                   │
       │                   │  Authenticated    │                   │
       │                   │  Request          │                   │
       │                   │──────────────────►│                   │
       │                   │                   │                   │
       │                   │                   │  Service Account  │
       │                   │                   │  Auth             │
       │                   │                   │──────────────────►│
       │                   │                   │                   │
       │                   │                   │◄──────────────────│
       │                   │◄──────────────────│                   │
       │◄──────────────────│                   │                   │
       │                   │                   │                   │
```

### API Key Management

| Key                              | Storage              | Purpose                     |
| -------------------------------- | -------------------- | --------------------------- |
| `EXA_API_KEY`                    | Secret Manager       | Exa.ai semantic search      |
| `TAVILY_API_KEY`                 | Secret Manager       | Tavily LLM-optimized search |
| `PERPLEXITY_API_KEY`             | Secret Manager       | Perplexity (failover)       |
| `REDDIT_CLIENT_ID`               | Secret Manager       | Reddit API OAuth            |
| `REDDIT_CLIENT_SECRET`           | Secret Manager       | Reddit API OAuth            |
| `GOOGLE_APPLICATION_CREDENTIALS` | Local/Secret Manager | GCP services (Gemini, etc.) |

---

## Performance Considerations

### Latency Targets

| Operation           | Target | Strategy                   |
| ------------------- | ------ | -------------------------- |
| Page load           | < 2s   | SSR, CDN caching           |
| Retrieval (RAG)     | < 3s   | Optimized vectors, caching |
| Generation (Claude) | < 45s  | Streaming, progress UI     |
| Export (PDF)        | < 10s  | Client-side generation     |

### Caching Strategy

```typescript
// Cultural context: 24-hour cache
const getCulturalContext = async (category: string) => {
  const cached = await firestore.doc(`cultural_cache/${today}`).get();
  if (cached.exists) return cached.data();

  const fresh = await fetchCulturalData(category);
  await firestore.doc(`cultural_cache/${today}`).set(fresh);
  return fresh;
};

// Vector search: Query-level caching
const searchVectors = async (query: string, options: SearchOptions) => {
  const cacheKey = hash(query + JSON.stringify(options));
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const results = await vectorStore.search(query, options);
  await redis.setex(cacheKey, 3600, JSON.stringify(results)); // 1hr TTL
  return results;
};
```

---

## Monitoring & Observability

### Metrics to Track

| Metric                | Source        | Alert Threshold |
| --------------------- | ------------- | --------------- |
| Generation latency    | Cloud Run     | > 60s           |
| Error rate            | Cloud Logging | > 5%            |
| Vector search latency | Custom metric | > 5s            |
| API costs             | Billing       | > $100/day      |

### Logging Strategy

```typescript
// Structured logging for Cloud Logging
const log = {
  severity: "INFO",
  component: "generation-engine",
  generationId: "xxx",
  userId: "yyy",
  duration_ms: 45000,
  tokens_used: 8500,
  retrieval_count: 10,
  message: "Generation completed successfully",
};
```

---

## Related Documents

- [PLAN.md](/PLAN.md) - Implementation phases and timeline
- [docs/SETUP.md](/docs/SETUP.md) - Developer setup guide (TBD)
- [docs/USER_GUIDE.md](/docs/USER_GUIDE.md) - End-user documentation (TBD)

---

_This document evolves with the implementation. Last updated: 2026-02-03_
