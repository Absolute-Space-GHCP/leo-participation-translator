# How The Participation Translator Works

Version: 1.0.0
Last Updated: 2026-02-06

---

## The Big Picture

The Participation Translator takes a **passive advertising idea** and transforms it into a **participation-worthy platform** — a campaign designed so the audience doesn't just watch, they participate.

It does this by combining three things:

1. **JL's Institutional Memory** — decades of past presentations, case studies, and winning patterns stored in a searchable vector database
2. **Real-Time Cultural Intelligence** — live trend data, Reddit discussions, and subculture analysis
3. **Claude Opus 4.6** — an advanced AI reasoning engine that applies JL's 8-Part Participation Framework

---

## End-to-End Flow

```
┌─────────────────────────────────────────────────────────┐
│                    USER INPUT                           │
│  Brand, category, target audience, passive idea         │
│  + optional: shared interest, budget, dates             │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │    CONTEXT GATHERING    │
          │    (runs in parallel)   │
          └────────────┬────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
┌─────────┐     ┌───────────┐     ┌──────────┐
│   RAG   │     │ Cultural  │     │ Evolution│
│ Search  │     │  Intel    │     │ Context  │
│         │     │           │     │          │
│ Past JL │     │ Exa.ai +  │     │ Learned  │
│ work    │     │ Tavily    │     │ patterns │
└────┬────┘     └─────┬─────┘     └────┬─────┘
     │                │                │
     └────────────────┼────────────────┘
                      │
         ┌────────────▼────────────┐
         │    PROMPT ASSEMBLY      │
         │                         │
         │  System prompt          │
         │  + RAG context          │
         │  + Cultural context     │
         │  + Evolution context    │
         │  + Framework sections   │
         │  + User's project seed  │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   CLAUDE OPUS 4.6       │
         │                         │
         │  Applies 8-Part         │
         │  Participation          │
         │  Framework              │
         │  (invisibly)            │
         └────────────┬────────────┘
                      │
     ┌────────────────┼────────────────┐
     │                                 │
     ▼                                 ▼
┌──────────────┐              ┌────────────────┐
│  TIER A      │              │  TIER B        │
│  Write-up    │              │  Recommendations│
│              │              │                │
│  Seamless    │              │  Specific      │
│  narrative   │              │  executions    │
│  (invisible  │              │  with creative,│
│  framework)  │              │  media, creator│
└──────┬───────┘              └───────┬────────┘
       │                              │
       └──────────────┬───────────────┘
                      │
         ┌────────────▼────────────┐
         │   PARTICIPATION PACK    │
         │                         │
         │  Big Audacious Act      │
         │  Subculture Briefs      │
         │  Mechanic Deep-Dives    │
         │  Casting & Creators     │
         │  72-Hour Trend Hijacks  │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   OUTPUT FORMATTERS     │
         │                         │
         │  Markdown, HTML,        │
         │  Plain Text, Slides     │
         └─────────────────────────┘
```

---

## Key Components Explained

### 1. RAG (Retrieval-Augmented Generation)

When you input a brand and category, the system searches through all of JL's indexed presentations to find the most relevant past work. This gives Claude real examples to draw from — not generic AI output, but strategies grounded in JL's actual track record.

**Example:** If you input "Philadelphia Cream Cheese, dairy, millennials," the RAG system might retrieve chunks from past dairy campaigns, food brand presentations, and millennial-targeting strategies.

### 2. Cultural Intelligence

Two search APIs (Exa.ai and Tavily) scan the web in real-time for:
- **Trending topics** in the brand's category
- **Reddit discussions** about the brand and competitors
- **Subculture activity** among the target audience

This ensures the output is culturally relevant — not based on stale data.

### 3. The Invisible Framework

Claude uses JL's **8-Part Participation Framework** internally to structure its thinking:

1. Current Cultural Context
2. Brand Credibility
3. The Shared Interest
4. The Passive Trap
5. The Participation Worthy Idea
6. Moments and Places
7. Mechanics of Participation
8. First Responders
9. The Ripple Effect

**Critical:** The framework is used for reasoning but is **invisible in the output**. The final write-up reads as a seamless, flowing narrative — not numbered sections. This is Leo's explicit requirement.

### 4. Two-Tier Output

- **Tier A** — A high-level strategic narrative: the write-up, creative approach, media strategy, and creator strategy
- **Tier B** — Specific executional recommendations with creative, media, and creator details for each

### 5. Participation Pack

After the write-up, a second call to Claude generates tactical assets:
- **The Big Audacious Act** — the headline activation
- **Subculture Mini-Briefs** — tailored messages for specific communities
- **Mechanic Deep-Dives** — how participation actually works (digital, physical, social, hybrid)
- **Casting & Creators** — suggested talent archetypes
- **72-Hour Trend Hijacks** — real-time opportunities to ride cultural moments

### 6. Evolution System

Every generation is tracked. User edits, ratings, and regeneration requests are recorded as feedback. Over time, the system learns which patterns work and avoids approaches that get edited out — making each generation better than the last.

---

## Technology Stack

| Component | Technology |
|---|---|
| AI Reasoning | Claude Opus 4.6 via Google Vertex AI |
| Task Routing | Complexity-based model selection (Opus/Sonnet/Haiku) |
| Vector Store | Firestore with embedding search |
| Embeddings | Vertex AI `text-embedding-005` (768 dimensions) |
| Cultural Search | Exa.ai (primary) + Tavily (backup) |
| Secrets | GCP Secret Manager |
| Frontend | Next.js 14 + React 18 + Tailwind CSS |
| Deployment | Google Cloud Run |

---

## What Makes It Different

1. **It's not generic AI** — it's grounded in JL's actual past work
2. **It's culturally aware** — real-time data, not training cutoff
3. **The framework is invisible** — output sounds human, not formulaic
4. **It learns** — gets better with every use through feedback loops
5. **It's built for Leo** — the UI and workflow match how he thinks

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-06
