# Participation Translator - Technical Architecture

Version: 1.1.0
Last Updated: 2026-02-13
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)

---

## Overview

This document details the technical architecture for The Participation Translator, an AI-powered strategic tool that transforms passive advertising ideas into participation-worthy platforms.

---

## System Components

### 1. Frontend Application

**Technology:** Next.js 16 with App Router, React 19, Tailwind CSS, NextAuth.js

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    App Router (Next.js 16)               │    │
│  │  /                     → Landing page (3-option picker)  │    │
│  │  /login                → Google OAuth login (JL-branded) │    │
│  │  /option-a             → Clean Sheet demo                │    │
│  │  /option-b             → Guided Flow demo                │    │
│  │  /option-c             → Engine Room dashboard           │    │
│  │  /api/auth/[...nextauth] → NextAuth API routes           │    │
│  │  /api/generate         → SSE streaming generation        │    │
│  │  /api/upload           → File upload + text extraction   │    │
│  │  /api/stats            → Knowledge base statistics       │    │
│  │  /api/email            → Email delivery (optional)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────┐      │
│  │            Auth Middleware (middleware.ts)              │      │
│  │  Protects all routes except /login, /api/auth, static │      │
│  │  Redirects unauthenticated → /login with callbackUrl  │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**

- Server-side rendering for SEO and performance
- SSE streaming responses for real-time blueprint generation
- Google OAuth authentication with JL email allowlist
- Responsive dark-mode design (desktop + iPad)
- 3-tab output (Strategic Narrative, Executional, Participation Pack)

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

**Technology:** Vertex AI Embeddings, Firestore Vector Search

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
│  │ (Firestore) │    │ Embeddings  │    │ Chunks      │          │
│  │             │    │ (768-dim)   │    │ + Metadata  │          │
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

**Technology:** Claude Opus 4.6 via Vertex AI, Prompt Assembly Service

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
│                 │ Claude      │                                  │
│                 │ Opus 4.6    │                                  │
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
│  │  │   Cloud Run       │        │   NextAuth.js     │                     │    │
│  │  │   HTTPS           │◄──────►│   (Google OAuth)  │                     │    │
│  │  │   (Auto TLS)      │        │                   │                     │    │
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
│  │  │             │         │             │         │ • Claude 4.6│       │    │
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
│  │  │ Exa.ai      │    │ Tavily      │    │ Anthropic   │                  │    │
│  │  │ (Search)    │    │ (Search)    │    │ (Claude)    │                  │    │
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
│   User      │     │ NextAuth.js │     │ Cloud Run   │     │ GCP APIs    │
│   Browser   │     │ (Google     │     │ Service     │     │             │
│             │     │ OAuth)      │     │             │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │  HTTPS Request    │                   │                   │
       │──────────────────►│                   │                   │
       │                   │                   │                   │
       │  Google Login     │                   │                   │
       │◄─────────────────►│                   │                   │
       │                   │                   │                   │
       │  Check Allowlist  │                   │                   │
       │  (JWT Session)    │                   │                   │
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

Email Allowlist:
  - charleys@johannesleonardo.com
  - leop@johannesleonardo.com
  - janj@johannesleonardo.com
```

### API Key Management

| Key                              | Storage              | Purpose                     |
| -------------------------------- | -------------------- | --------------------------- |
| `NEXTAUTH_SECRET`                | Env var              | JWT session signing         |
| `NEXTAUTH_URL`                   | Env var              | Auth callback base URL      |
| `GOOGLE_OAUTH_CLIENT_ID`         | Env var              | Google OAuth client ID      |
| `GOOGLE_OAUTH_CLIENT_SECRET`     | Env var              | Google OAuth client secret  |
| `ANTHROPIC_API_KEY`              | Env var              | Claude API (primary)        |
| `EXA_API_KEY`                    | Env var              | Exa.ai semantic search      |
| `TAVILY_API_KEY`                 | Env var              | Tavily LLM-optimized search |
| `GOOGLE_APPLICATION_CREDENTIALS` | Local/Secret Manager | GCP services (Vertex AI)    |

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
- [docs/QUICKSTART.md](/docs/QUICKSTART.md) - Developer quickstart guide
- [docs/BUILD.md](/docs/BUILD.md) - Build and development guide

---

_This document evolves with the implementation. Last updated: 2026-02-13_
