# The Participation Translator - Implementation Plan

Version: 1.0.1
Last Updated: 2026-02-03
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

---

## Executive Summary

The Participation Translator is an internal AI-powered strategic tool that transforms "passive" advertising ideas into "participation-worthy" platforms. It combines JL's institutional knowledge with real-time cultural intelligence using a Retrieval-Augmented Generation (RAG) architecture.

**Priority:** HIGH | **Visibility:** HIGH | **Sponsor:** Leo (Founder)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Implementation Phases](#implementation-phases)
5. [Component Specifications](#component-specifications)
6. [Integration Points](#integration-points)
7. [Data Pipeline](#data-pipeline)
8. [Deployment Strategy](#deployment-strategy)
9. [Success Criteria](#success-criteria)
10. [Risk Assessment](#risk-assessment)

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
| **Culture & Subculture Feeds**     | Live APIs (Brandwatch, Exploding Topics, Reddit, TikTok) | Identify where people are already leaning in        |
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
│ │ Service         │   │ │ │ (Web Search)    │   │ │ │ 4.5             │   │
│ │ (Vertex AI)     │   │ │ └─────────────────┘   │ │ │ (configurable)  │   │
│ └────────┬────────┘   │ │ ┌─────────────────┐   │ │ └─────────────────┘   │
│          │            │ │ │ Perplexity API  │   │ │ ┌─────────────────┐   │
│ ┌────────▼────────┐   │ │ │ (Search/Trends) │   │ │ │ Chain of        │   │
│ │ Vector Store    │   │ │ └─────────────────┘   │ │ │ Thought         │   │
│ │ (Pinecone or    │   │ │ ┌─────────────────┐   │ │ │ Prompting       │   │
│ │  Vertex AI)     │   │ │ │ Reddit/TikTok   │   │ │ └─────────────────┘   │
│ └────────┬────────┘   │ │ │ Scrapers        │   │ │ ┌─────────────────┐   │
│          │            │ │ │ (via Zapier)    │   │ │ │ 8-Part          │   │
│ ┌────────▼────────┐   │ │ └─────────────────┘   │ │ │ Framework       │   │
│ │ JL Knowledge    │   │ │ ┌─────────────────┐   │ │ │ (System Prompt) │   │
│ │ Base            │   │ │ │ Brandwatch API  │   │ │ └─────────────────┘   │
│ │ - Presentations │   │ │ │ (Social Listen) │   │ │                       │
│ │ - Case Studies  │   │ │ └─────────────────┘   │ │                       │
│ │ - Frameworks    │   │ │                       │ │                       │
│ └─────────────────┘   │ │                       │ │                       │
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
│  │  (PDF, PPTX, DOCX)         (LangChain)            Strategy   │   │
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
│  │  Vector DB (Pinecone/Vertex AI Vector Search)                │   │
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
│  │  Claude Opus 4.5 (Chain of Thought Reasoning)                │   │
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

### Core Technologies (Leveraging Existing Infrastructure)

| Layer                      | Technology                          | Rationale                         |
| -------------------------- | ----------------------------------- | --------------------------------- |
| **Frontend**               | Next.js 14 + React 18               | Modern web app, SSR, API routes   |
| **Backend API**            | Node.js 22 LTS + Express            | Matches existing stack            |
| **Reasoning Engine**       | Claude Opus 4.5 (configurable)      | Best-in-class strategic reasoning |
| **Embedding Model**        | Vertex AI text-embedding-005        | Google ecosystem, high quality    |
| **Vector Store**           | Vertex AI Vector Search OR Pinecone | GCP-native option available       |
| **Document Storage**       | Cloud Storage                       | Presentation files                |
| **Session/Output Storage** | Cloud Firestore                     | Real-time, scalable               |
| **Search API**             | Exa.ai + Perplexity                 | Cultural momentum discovery       |
| **Presentation Gen**       | PptxGenJS + Custom Templates        | Native PPTX generation            |
| **Automation**             | Zapier/Make.com                     | Trend data ingestion              |
| **Deployment**             | Cloud Run                           | Serverless, auto-scaling          |

### AI Model Configuration

The reasoning engine is **configurable** to support model upgrades:

| Model                 | Use Case              | Availability             | Notes                            |
| --------------------- | --------------------- | ------------------------ | -------------------------------- |
| **Claude Opus 4.5**   | Primary (recommended) | Anthropic API, Vertex AI | Best strategic reasoning         |
| **Claude Opus 4**     | Alternative           | Vertex AI                | Excellent, slightly faster       |
| **Claude Sonnet 4**   | Development/testing   | Vertex AI                | Faster iteration, lower cost     |
| **Claude 5** (future) | Upgrade path          | TBD                      | Configurable swap when available |

```typescript
// Model configuration in .env
AI_MODEL_PROVIDER = anthropic; // or 'vertex'
AI_MODEL_NAME = claude - opus - 4 - 5 - 20250131; // configurable
AI_MODEL_FALLBACK = claude - sonnet - 4 - 20250514;
```

### API Dependencies

| API                        | Purpose                     | Cost Model              |
| -------------------------- | --------------------------- | ----------------------- |
| **Anthropic API**          | Claude Opus 4.5             | Pay-per-token           |
| **Vertex AI (Claude)**     | Claude Opus 4 (alternative) | Pay-per-token           |
| **Vertex AI (Embeddings)** | Vector embeddings           | Pay-per-request         |
| **Exa.ai**                 | Semantic web search         | Subscription            |
| **Perplexity API**         | Search + summarization      | Pay-per-query           |
| **Brandwatch**             | Social listening (optional) | Enterprise subscription |

---

## Implementation Phases

### Phase 0: Foundation Setup (Week 1)

**Goal:** Project scaffolding and infrastructure setup

| Task | Description                    | Deliverable                                 |
| ---- | ------------------------------ | ------------------------------------------- |
| 0.1  | Create project structure       | `/src`, `/api`, `/lib`, `/docs` directories |
| 0.2  | Initialize Next.js application | Working web app skeleton                    |
| 0.3  | Configure GCP project          | Cloud Run, Storage, Firestore enabled       |
| 0.4  | Set up environment variables   | `.env.example`, secure secrets              |
| 0.5  | Create CI/CD pipeline          | GitHub Actions for deployment               |
| 0.6  | Document setup process         | `docs/SETUP.md`                             |

### Phase 1: Knowledge Base & RAG Core (Weeks 2-3)

**Goal:** Build the JL institutional memory system

| Task | Description                        | Deliverable               |
| ---- | ---------------------------------- | ------------------------- |
| 1.1  | Design document ingestion pipeline | Architecture doc          |
| 1.2  | Build PDF/PPTX/DOCX parser         | `/lib/parsers/` modules   |
| 1.3  | Implement chunking strategy        | Semantic chunking logic   |
| 1.4  | Set up Vertex AI Vector Search     | Vector store configured   |
| 1.5  | Build embedding pipeline           | `/lib/embeddings/` module |
| 1.6  | Create retrieval service           | `/api/retrieve` endpoint  |
| 1.7  | Ingest initial JL presentations    | Populated vector store    |
| 1.8  | Test retrieval quality             | Evaluation metrics        |

### Phase 1.5: Learning/Evolution System (Week 3)

**Goal:** Build the foundation for continuous improvement

See [docs/EVOLUTION.md](/docs/EVOLUTION.md) for full architecture.

| Task  | Description                              | Deliverable                          |
| ----- | ---------------------------------------- | ------------------------------------ |
| 1.5.1 | Set up Firestore observation collections | Schema and indexes                   |
| 1.5.2 | Implement observation capture            | `/lib/learning/observation-store.ts` |
| 1.5.3 | Implement pattern analyzer               | `/lib/learning/pattern-analyzer.ts`  |
| 1.5.4 | Build context injector                   | `/lib/learning/context-injector.ts`  |
| 1.5.5 | Create feedback capture UI               | Leo rating/edit interface            |
| 1.5.6 | Integrate with knowledge graph           | Evolution nodes in graph             |

### Phase 2: 8-Part Framework Integration (Week 4)

**Goal:** Codify the Participation Framework as system prompts

| Task | Description                    | Deliverable                         |
| ---- | ------------------------------ | ----------------------------------- |
| 2.1  | Document framework sections    | Detailed spec per section           |
| 2.2  | Create system prompt templates | `/prompts/` directory               |
| 2.3  | Build prompt assembly service  | Dynamic prompt construction         |
| 2.4  | Implement Claude integration   | Vertex AI Claude calls              |
| 2.5  | Create output formatters       | Structured JSON → display           |
| 2.6  | Test with sample inputs        | Validation outputs                  |
| 2.7  | Integrate evolution context    | Context injection before generation |

### Phase 3: Cultural Intelligence Layer (Weeks 5-6)

**Goal:** Real-time trend and subculture discovery

See [docs/CULTURAL_INTELLIGENCE.md](/docs/CULTURAL_INTELLIGENCE.md) for full research and alternatives.

**Selected Stack:**

- **Semantic Search:** Exa.ai + Tavily (dual integration, merged results)
- **Summarization:** Gemini Grounding (primary) + Perplexity (failover)
- **Reddit:** Official API with PRAW
- **TikTok:** Via Exa search of news/blog coverage
- **Sentiment:** Claude Opus 4.5 analysis (no dedicated service for MVP)

| Task | Description                         | Deliverable                        |
| ---- | ----------------------------------- | ---------------------------------- |
| 3.1  | Integrate Exa.ai API                | `/lib/cultural/exa.ts`             |
| 3.2  | Integrate Tavily API                | `/lib/cultural/tavily.ts`          |
| 3.3  | Build result merger/deduplicator    | `/lib/cultural/merger.ts`          |
| 3.4  | Integrate Gemini with Grounding     | `/lib/cultural/gemini-grounded.ts` |
| 3.5  | Integrate Perplexity (failover)     | `/lib/cultural/perplexity.ts`      |
| 3.6  | Integrate Reddit API (PRAW)         | `/lib/cultural/reddit.ts`          |
| 3.7  | Build trend aggregator              | Unified trend data model           |
| 3.8  | Create subculture mapping           | Target audience → communities      |
| 3.9  | Build 72-hour trend hijacks         | Time-sensitive opportunities       |
| 3.10 | Implement Claude sentiment analysis | `/lib/cultural/sentiment.ts`       |

### Phase 4: User Interface & Presentation Generation (Weeks 7-8)

**Goal:** Build Leo-friendly web application with presentation-ready output

| Task | Description                     | Deliverable                        |
| ---- | ------------------------------- | ---------------------------------- |
| 4.1  | Design UI/UX wireframes         | Figma/mockups                      |
| 4.2  | Build Project Seed input form   | Multi-step wizard                  |
| 4.3  | Create generation progress UI   | Real-time status with streaming    |
| 4.4  | Create JL presentation template | Branded PPTX master template       |
| 4.5  | Build PPTX generation engine    | PptxGenJS integration              |
| 4.6  | Build slide preview components  | In-browser presentation view       |
| 4.7  | Add export functionality        | PPTX (primary), PDF, Google Slides |
| 4.8  | Implement history/saved outputs | User sessions with deck preview    |
| 4.9  | Mobile responsiveness           | iPad-friendly                      |

### Phase 5: Testing & Refinement (Week 9)

**Goal:** Quality assurance and tuning

| Task | Description                   | Deliverable                     |
| ---- | ----------------------------- | ------------------------------- |
| 5.1  | End-to-end testing            | Test suite                      |
| 5.2  | Prompt engineering refinement | Improved outputs                |
| 5.3  | Retrieval quality tuning      | Better context selection        |
| 5.4  | Performance optimization      | Sub-30s generation              |
| 5.5  | Security audit                | Authentication, data protection |

### Phase 6: Deployment & Training (Week 10)

**Goal:** Production launch and user onboarding

| Task | Description               | Deliverable            |
| ---- | ------------------------- | ---------------------- |
| 6.1  | Production deployment     | Live Cloud Run service |
| 6.2  | Create user documentation | User guide for Leo     |
| 6.3  | Training session          | 1:1 walkthrough        |
| 6.4  | Feedback collection       | Iteration backlog      |
| 6.5  | Handoff documentation     | Maintenance guide      |

---

## Component Specifications

### 1. Document Ingestion Service

```javascript
// /lib/parsers/index.js
/**
 * Supported formats: PDF, PPTX, DOCX
 * Output: Structured chunks with metadata
 */
const parseDocument = async (file, options) => {
  // Extract text, preserve structure
  // Return: { chunks: [], metadata: {} }
};
```

**Chunking Strategy:**

- Chunk size: 512-1024 tokens
- Overlap: 50-100 tokens
- Preserve slide/section boundaries
- Metadata: filename, page, section, client, campaign

### 2. Vector Store Schema

```javascript
// Pinecone/Vertex AI Vector Search
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

```javascript
// /lib/cultural/index.js
const getCulturalContext = async (brandCategory, targetAudience) => {
  const [exaResults, perplexityResults] = await Promise.all([
    exa.search(`${brandCategory} trends 2026`),
    perplexity.search(`what's trending in ${targetAudience} culture`),
  ]);

  return {
    currentMomentum: aggregateTrends(exaResults, perplexityResults),
    subcultures: identifySubcultures(targetAudience),
    trendHijacks: find72HourOpportunities(exaResults),
  };
};
```

### 5. Presentation Generation Service

The primary output is a **presentation-ready PPTX deck** using PptxGenJS.

```typescript
// /lib/export/pptx.ts
import PptxGenJS from "pptxgenjs";

interface SlideContent {
  title: string;
  subtitle?: string;
  body: string[];
  bulletPoints?: string[];
  image?: { url: string; caption: string };
}

const generatePresentation = async (
  blueprint: ParticipationBlueprint,
  template: "jl-master" | "minimal" = "jl-master"
): Promise<Buffer> => {
  const pptx = new PptxGenJS();

  // Apply JL branding
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Johannes Leonardo";
  pptx.company = "Johannes Leonardo";

  // Generate 20 slides from blueprint
  generateTitleSlide(pptx, blueprint);
  generateWriteupSlides(pptx, blueprint.writeup); // 9 slides
  generatePackSlides(pptx, blueprint.pack); // 10 slides

  return await pptx.write({ outputType: "nodebuffer" });
};
```

**Slide Template Structure:**

```json
{
  "layouts": {
    "title": {
      "background": "#1A1A2E",
      "titleFont": "Helvetica Neue Bold",
      "titleSize": 44,
      "subtitleSize": 24
    },
    "section": {
      "background": "#FFFFFF",
      "headerFont": "Helvetica Neue Bold",
      "headerSize": 32,
      "bodyFont": "Helvetica Neue",
      "bodySize": 18,
      "accentColor": "#E94560"
    },
    "content": {
      "maxBullets": 5,
      "bulletIndent": 0.5,
      "imagePosition": "right"
    }
  }
}
```

**Export Options:**

| Format            | Library              | Notes                         |
| ----------------- | -------------------- | ----------------------------- |
| **PPTX**          | PptxGenJS            | Primary format, full fidelity |
| **PDF**           | pdf-lib or Puppeteer | Flattened for sharing         |
| **Google Slides** | Google Slides API    | Direct to GCP                 |

---

## Integration Points

### Existing Infrastructure Integration

| System             | Integration Method             | Purpose                  |
| ------------------ | ------------------------------ | ------------------------ |
| **GCP Vertex AI**  | SDK (@google-cloud/aiplatform) | Claude, embeddings       |
| **Cloud Run**      | gcloud CLI deploy              | Serverless hosting       |
| **Cloud Storage**  | SDK (@google-cloud/storage)    | Document storage         |
| **Firestore**      | SDK (firebase-admin)           | Session/output storage   |
| **GitHub Actions** | Workflow YAML                  | CI/CD pipeline           |
| **Slack**          | Webhook                        | Deployment notifications |

### Authentication Flow

```
User → Cloud IAP (Identity-Aware Proxy) → Cloud Run → GCP APIs
                     ↓
              JL Google Workspace
```

---

## Data Pipeline

### Daily Automated Pipeline (via Zapier/Make)

```
06:00 UTC: Fetch trending topics (Reddit, TikTok, Twitter/X)
           ↓
07:00 UTC: Process and categorize trends
           ↓
08:00 UTC: Update "Cultural Momentum" cache in Firestore
           ↓
On-demand: User queries pull fresh + cached cultural data
```

### Document Ingestion Pipeline

```
Admin uploads presentation
           ↓
Cloud Function triggered (Storage event)
           ↓
Parse document → Chunk → Embed → Store vectors
           ↓
Firestore metadata updated
           ↓
Slack notification: "New knowledge added: {filename}"
```

---

## Deployment Strategy

### Environment Tiers

| Environment     | URL                          | Purpose           |
| --------------- | ---------------------------- | ----------------- |
| **Development** | localhost:3000               | Local development |
| **Staging**     | participation-staging.jl.dev | Testing/QA        |
| **Production**  | participation.jl.dev         | Leo's access      |

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

## Next Steps (Immediate)

1. **Review this plan with stakeholder** - Get Leo's feedback on priorities
2. **Set up GCP project** - `participation-translator` project
3. **Begin Phase 0** - Project scaffolding
4. **Collect initial presentations** - VW, Adidas decks for ingestion

---

## Appendix: File Structure

```
leo-participation-translator/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Home/landing
│   │   ├── generate/           # Generation wizard
│   │   ├── history/            # Past outputs
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── SeedForm/           # Project seed wizard
│   │   ├── SlidePreview/       # In-browser deck preview
│   │   ├── ProgressTracker/    # Generation progress UI
│   │   └── ExportMenu/         # Download options
│   ├── lib/
│   │   ├── parsers/            # Document parsing
│   │   ├── embeddings/         # Vector operations
│   │   ├── cultural/           # Trend APIs
│   │   ├── generation/         # Claude integration
│   │   └── export/             # Presentation export
│   │       ├── pptx.ts         # PptxGenJS integration
│   │       ├── pdf.ts          # PDF generation
│   │       └── google-slides.ts # Google Slides API
│   ├── prompts/                # System prompts
│   └── templates/              # Presentation templates
│       ├── jl-master.pptx      # JL branded master
│       └── slide-layouts.json  # Slide structure definitions
├── docs/
│   ├── SETUP.md                # Developer setup
│   ├── ARCHITECTURE.md         # Technical architecture
│   ├── USER_GUIDE.md           # For Leo
│   └── API.md                  # API documentation
├── scripts/
│   ├── ingest.js               # Document ingestion CLI
│   └── seed-db.js              # Initial data seeding
├── sessions/                   # Session logs
├── tests/                      # Test files
├── PLAN.md                     # This file
├── CLAUDE.md                   # AI context
└── package.json
```

---

_This plan is a living document. Update as requirements evolve._
