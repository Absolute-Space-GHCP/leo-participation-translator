# Cultural Intelligence Architecture

Version: 1.1.0
Last Updated: 2026-02-05
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

---

## Overview

The Cultural Intelligence layer provides real-time trend discovery, sentiment analysis, and cultural momentum detection to inform participation strategies. This document captures the research, decisions, and alternative options for future optimization.

---

## Current Stack (Selected)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CULTURAL INTELLIGENCE ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SEMANTIC WEB SEARCH (DUAL)                        │   │
│  │  ┌──────────────────────┐    ┌──────────────────────┐               │   │
│  │  │      Exa.ai          │    │      Tavily          │               │   │
│  │  │  ─────────────────   │    │  ─────────────────   │               │   │
│  │  │  • Neural search     │    │  • LLM-optimized     │               │   │
│  │  │  • 94.9% accuracy    │    │  • API-native SDK     │               │   │
│  │  │  • Semantic intent   │    │  • Structured JSON   │               │   │
│  │  │  • $49/mo starter    │    │  • $50/mo starter    │               │   │
│  │  └──────────┬───────────┘    └──────────┬───────────┘               │   │
│  │             │                            │                           │   │
│  │             └──────────┬─────────────────┘                           │   │
│  │                        ▼                                             │   │
│  │             ┌──────────────────────┐                                 │   │
│  │             │   Result Merger &    │                                 │   │
│  │             │   Deduplication      │                                 │   │
│  │             └──────────┬───────────┘                                 │   │
│  └───────────────────────┼──────────────────────────────────────────────┘   │
│                          │                                                   │
│  ┌───────────────────────▼──────────────────────────────────────────────┐   │
│  │                 SEARCH + SUMMARIZATION (FAILOVER)                     │   │
│  │                                                                       │   │
│  │  ┌──────────────────────┐    ┌──────────────────────┐                │   │
│  │  │  Gemini + Grounding  │───▶│   Perplexity API     │                │   │
│  │  │  (PRIMARY)           │fail│   (FAILOVER)         │                │   │
│  │  │  ──────────────────  │over│   ──────────────────  │                │   │
│  │  │  • Native GCP        │    │   • Search + summary │                │   │
│  │  │  • $0.001/query      │    │   • $5/1000 queries  │                │   │
│  │  │  • Real-time data    │    │   • Good citations   │                │   │
│  │  └──────────────────────┘    └──────────────────────┘                │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                          │                                                   │
│  ┌───────────────────────▼──────────────────────────────────────────────┐   │
│  │                    PLATFORM-SPECIFIC SOURCES                          │   │
│  │                                                                       │   │
│  │  ┌──────────────────────┐    ┌──────────────────────┐                │   │
│  │  │   Reddit API         │    │   TikTok Trends      │                │   │
│  │  │   (via PRAW)         │    │   (via Exa search)   │                │   │
│  │  │   ──────────────────  │    │   ──────────────────  │                │   │
│  │  │   • Official API     │    │   • News/blog coverage│                │   │
│  │  │   • Free tier        │    │   • No brittle scrape │                │   │
│  │  │   • 100 QPM          │    │   • Semantic search  │                │   │
│  │  └──────────────────────┘    └──────────────────────┘                │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                          │                                                   │
│  ┌───────────────────────▼──────────────────────────────────────────────┐   │
│  │                    SENTIMENT & ANALYSIS                               │   │
│  │                                                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐    │   │
│  │  │              Claude Opus 4.6 (Analysis Layer)                 │    │   │
│  │  │  ──────────────────────────────────────────────────────────   │    │   │
│  │  │  • Sentiment analysis on aggregated content                   │    │   │
│  │  │  • Trend velocity detection                                   │    │   │
│  │  │  • Cultural moment identification                             │    │   │
│  │  │  • 72-hour opportunity window detection                       │    │   │
│  │  └──────────────────────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                          │                                                   │
│                          ▼                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                     FIRESTORE (Cached Trends)                         │   │
│  │  └── cultural_cache/{date}                                           │   │
│  │      ├── momentum: CulturalMomentum[]                                │   │
│  │      ├── subcultures: SubcultureData[]                               │   │
│  │      ├── trendHijacks: TrendHijack[]                                 │   │
│  │      └── updatedAt: timestamp                                        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Service Comparison & Alternatives

### 1. Semantic Web Search

**Selected: Exa.ai + Tavily (Dual Integration)**

| Service      | Accuracy        | Latency      | Cost    | Best For               | Status         |
| ------------ | --------------- | ------------ | ------- | ---------------------- | -------------- |
| **Exa.ai**   | 94.9%           | 350ms (Fast) | $49/mo  | Semantic understanding | ✅ SELECTED    |
| **Tavily**   | 93.3%           | ~500ms       | $50/mo  | LLM integration        | ✅ SELECTED    |
| Parallel     | 58% (multi-hop) | Variable     | $82 CPM | Deep research          | 📋 ALTERNATIVE |
| Brave Search | ~90%            | Fast         | $5/1000 | Large index            | 📋 ALTERNATIVE |
| You.com      | 93%             | Fast         | Custom  | Enterprise             | 📋 ALTERNATIVE |

**Why Dual Integration:**

- Exa excels at semantic understanding (finding content by meaning)
- Tavily excels at LLM-optimized structured responses
- Combined results provide better coverage and deduplication
- Failover capability if one service is degraded

**Alternative Considerations:**

- **Parallel** ($82 CPM) - Better for deep, multi-hop research tasks
- **Brave Search** ($5/1000) - More cost-effective for high volume
- **You.com** - Enterprise-grade with vertical indexes

### 2. Search + Summarization

**Selected: Gemini Grounding (Primary) + Perplexity (Failover)**

| Service                | Method               | Cost                 | Pros                  | Cons           | Status         |
| ---------------------- | -------------------- | -------------------- | --------------------- | -------------- | -------------- |
| **Gemini + Grounding** | Native Google Search | ~$0.001/query        | GCP native, real-time | Newer feature  | ✅ PRIMARY     |
| **Perplexity API**     | Search + AI summary  | $5/1000              | Great citations       | Another vendor | ✅ FAILOVER    |
| Claude + Tavily        | Tool use             | Claude + Tavily cost | Best reasoning        | Two services   | 📋 ALTERNATIVE |

**Why This Architecture:**

- Gemini with Grounding keeps everything in GCP ecosystem
- Perplexity provides reliable failover with good citation quality
- Cost-effective: Gemini is ~5x cheaper than Perplexity

### 3. Social Listening

**Selected: Skip dedicated service for MVP - Use Exa/Tavily + Claude**

| Service             | Cost     | Coverage                    | Sentiment  | Status          |
| ------------------- | -------- | --------------------------- | ---------- | --------------- |
| **Claude Analysis** | Included | Via search                  | Excellent  | ✅ MVP APPROACH |
| Brand24             | $79/mo   | 100+ languages              | AI-powered | 📋 FUTURE       |
| Mention             | $41/mo   | Basic                       | Limited    | 📋 FUTURE       |
| Xpoz                | $20/mo   | Twitter, IG, TikTok, Reddit | AI-native  | 📋 FUTURE       |
| SocialRails         | $29/mo   | 9 platforms                 | Included   | 📋 FUTURE       |
| Brandwatch          | $800+/mo | Comprehensive               | Enterprise | 📋 ENTERPRISE   |

**Future Upgrade Path:**
When dedicated social listening is needed:

1. **Budget option**: Xpoz ($20/mo) - AI-native queries, good coverage
2. **Mid-tier**: Brand24 ($79/mo) - Comprehensive sentiment, 100+ languages
3. **Enterprise**: Brandwatch ($800+/mo) - Full social intelligence suite

### 4. TikTok Trends

**Selected: Exa.ai for news/blog coverage**

| Method                             | Reliability | Data Freshness | Risk      | Status             |
| ---------------------------------- | ----------- | -------------- | --------- | ------------------ |
| **Exa search for TikTok coverage** | High        | Good           | None      | ✅ SELECTED        |
| TikTok Creative Center (manual)    | High        | Real-time      | Manual    | 📋 ALTERNATIVE     |
| Unofficial APIs                    | Low         | Real-time      | ToS risk  | ❌ NOT RECOMMENDED |
| CreatorIQ/Traackr                  | High        | Real-time      | Expensive | 📋 ENTERPRISE      |

### 5. Reddit

**Selected: Reddit API with PRAW**

| Method                | Rate Limit | Cost       | Reliability | Status             |
| --------------------- | ---------- | ---------- | ----------- | ------------------ |
| **Reddit API (PRAW)** | 100 QPM    | Free       | High        | ✅ SELECTED        |
| Exa semantic search   | N/A        | Included   | Good        | 📋 SUPPLEMENT      |
| Third-party scrapers  | Variable   | $50-200/mo | Low         | ❌ NOT RECOMMENDED |

---

## API Configuration

### Required API Keys

```bash
# .env

# ===================
# Semantic Web Search
# ===================
EXA_API_KEY=your-exa-api-key
TAVILY_API_KEY=your-tavily-api-key

# ===================
# Search + Summarization
# ===================
# Gemini uses ADC (Application Default Credentials)
# GCP_PROJECT_ID already configured

# Perplexity (failover)
PERPLEXITY_API_KEY=your-perplexity-api-key

# ===================
# Reddit
# ===================
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
REDDIT_USER_AGENT=participation-translator/1.0
```

### Service Endpoints

| Service    | Endpoint                                     | Auth Method        |
| ---------- | -------------------------------------------- | ------------------ |
| Exa.ai     | `https://api.exa.ai/search`                  | Bearer token       |
| Tavily     | `https://api.tavily.com/search`              | API key            |
| Perplexity | `https://api.perplexity.ai/chat/completions` | Bearer token       |
| Reddit     | OAuth2 via PRAW                              | Client credentials |
| Gemini     | Vertex AI SDK                                | ADC                |

---

## Data Models

### Cultural Momentum

```typescript
interface CulturalMomentum {
  topic: string;
  description: string;
  velocity: "emerging" | "rising" | "peak" | "declining";
  relevanceScore: number; // 0-1
  platforms: string[]; // Where it's trending
  sources: {
    url: string;
    title: string;
    source: "exa" | "tavily" | "gemini" | "perplexity" | "reddit";
  }[];
  firstSeen: Date;
  lastUpdated: Date;
}
```

### Subculture Data

```typescript
interface SubcultureData {
  name: string;
  description: string;
  platforms: string[];
  interests: string[];
  estimatedSize: "niche" | "growing" | "mainstream";
  engagementPatterns: string[];
  relevantSubreddits?: string[];
  relevantHashtags?: string[];
}
```

### Trend Hijack Opportunity

```typescript
interface TrendHijack {
  trend: string;
  description: string;
  expiresIn: string; // "24 hours", "72 hours", "1 week"
  expiresAt: Date;
  brandFitScore: number; // 0-1
  riskLevel: "low" | "medium" | "high";
  executionHint: string;
  examples?: string[];
  sources: string[];
}
```

---

## Implementation Notes

### Result Merging Strategy

```typescript
// src/lib/cultural/merger.ts
async function mergeSearchResults(
  exaResults: ExaResult[],
  tavilyResults: TavilyResult[]
): Promise<MergedResult[]> {
  // 1. Normalize to common format
  const normalized = [
    ...exaResults.map(normalizeExa),
    ...tavilyResults.map(normalizeTavily),
  ];

  // 2. Deduplicate by URL similarity
  const deduped = deduplicateByUrl(normalized, 0.9);

  // 3. Rank by combined relevance
  const ranked = rankByRelevance(deduped);

  // 4. Return top results
  return ranked.slice(0, 20);
}
```

### Failover Logic

```typescript
// src/lib/cultural/summarizer.ts
async function summarizeWithFailover(query: string): Promise<Summary> {
  try {
    // Primary: Gemini with Grounding
    return await geminiGroundedSearch(query);
  } catch (error) {
    console.warn("Gemini failed, falling back to Perplexity:", error);

    // Failover: Perplexity
    return await perplexitySearch(query);
  }
}
```

---

## Cost Projections

### Monthly Estimates (MVP Usage)

| Service               | Queries/Month | Unit Cost    | Monthly Cost |
| --------------------- | ------------- | ------------ | ------------ |
| Exa.ai                | ~500          | $49 base     | $49          |
| Tavily                | ~500          | $50 base     | $50          |
| Gemini Grounding      | ~1000         | $0.001/query | $1           |
| Perplexity (failover) | ~100          | $0.005/query | $0.50        |
| Reddit API            | Free tier     | $0           | $0           |
| **Total**             |               |              | **~$100/mo** |

### Scaling Considerations

If usage increases:

- Exa: Volume discounts available
- Tavily: Pay-as-you-go at $0.008/credit after base
- Consider Brave Search ($5/1000) for high-volume secondary searches

---

## Future Enhancements

### Phase 3+ Upgrades

1. **Dedicated Social Listening** (when needed)

   - Add Brand24 ($79/mo) or Xpoz ($20/mo)
   - Real-time monitoring vs. on-demand search

2. **TikTok Direct Integration** (when stable)

   - TikTok Business API (if approved)
   - CreatorIQ integration for influencer data

3. **Predictive Trend Analysis**

   - ML model for trend velocity prediction
   - Historical pattern matching

4. **Enterprise Social Intelligence**
   - Brandwatch integration for large clients
   - Custom dashboards per client/category

---

## Related Documents

- [ARCHITECTURE-PARTICIPATION-TRANSLATOR.md](./ARCHITECTURE-PARTICIPATION-TRANSLATOR.md)
- [PLAN.md](../PLAN.md)
- [EVOLUTION.md](./EVOLUTION.md) - Learning/improvement system

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-05
