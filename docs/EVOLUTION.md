# System Evolution & Learning Architecture

Version: 1.0.2
Last Updated: 2026-02-05
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

---

## Overview

This document defines the **learning and evolution system** for the Participation Translator. The goal is continuous improvement through:

1. **Session Learning** - Capturing what works/fails during development
2. **Output Feedback** - Learning from Leo's ratings and edits
3. **Pattern Recognition** - Identifying successful strategies across outputs
4. **Model Evolution** - Improving prompts and retrieval based on data

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVOLUTION SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     1. OBSERVATION LAYER                             │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │   │
│  │  │ Session Events   │  │ Output Feedback  │  │ Error Tracking   │   │   │
│  │  │ ────────────────  │  │ ────────────────  │  │ ────────────────  │   │   │
│  │  │ • File edits     │  │ • User ratings   │  │ • Generation     │   │   │
│  │  │ • Shell commands │  │ • Manual edits   │  │   failures       │   │   │
│  │  │ • Tool usage     │  │ • Export choices │  │ • API errors     │   │   │
│  │  │ • Decisions made │  │ • Regenerations  │  │ • Fixes applied  │   │   │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘   │   │
│  │           │                     │                     │             │   │
│  └───────────┼─────────────────────┼─────────────────────┼─────────────┘   │
│              │                     │                     │                  │
│              └─────────────────────┼─────────────────────┘                  │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     2. MEMORY CONSOLIDATION                          │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Knowledge Graph                            │   │   │
│  │  │  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐   │   │   │
│  │  │  │Patterns │◄──►│Campaigns│◄──►│ Tactics │◄──►│Outcomes │   │   │   │
│  │  │  │         │    │         │    │         │    │         │   │   │   │
│  │  │  │success  │    │context  │    │mechanics│    │ratings  │   │   │   │
│  │  │  │failure  │    │client   │    │formats  │    │edits    │   │   │   │
│  │  │  └─────────┘    └─────────┘    └─────────┘    └─────────┘   │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Observation Store                          │   │   │
│  │  │  • Session logs with context                                  │   │   │
│  │  │  • Decision rationale                                         │   │   │
│  │  │  • Fix patterns                                               │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     3. LEARNING EXTRACTION                           │   │
│  │                                                                      │   │
│  │  ┌─────────────────────┐    ┌─────────────────────┐                 │   │
│  │  │ Pattern Analyzer    │    │ Prompt Optimizer    │                 │   │
│  │  │ ─────────────────   │    │ ─────────────────   │                 │   │
│  │  │ • What strategies   │    │ • Which prompts     │                 │   │
│  │  │   produce high      │    │   produce best      │                 │   │
│  │  │   ratings?          │    │   outputs?          │                 │   │
│  │  │ • Common edit       │    │ • Temperature       │                 │   │
│  │  │   patterns?         │    │   tuning            │                 │   │
│  │  └─────────────────────┘    └─────────────────────┘                 │   │
│  │                                                                      │   │
│  │  ┌─────────────────────┐    ┌─────────────────────┐                 │   │
│  │  │ Retrieval Tuner     │    │ Error Classifier    │                 │   │
│  │  │ ─────────────────   │    │ ─────────────────   │                 │   │
│  │  │ • Which chunks      │    │ • Categorize        │                 │   │
│  │  │   are most useful?  │    │   failures          │                 │   │
│  │  │ • Optimal K value?  │    │ • Auto-fix known    │                 │   │
│  │  │ • Metadata filters  │    │   patterns          │                 │   │
│  │  └─────────────────────┘    └─────────────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     4. EVOLUTION APPLICATION                         │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │ Context Injection (Before Generation)                        │    │   │
│  │  │ ─────────────────────────────────────                        │    │   │
│  │  │ • Inject learned patterns relevant to current task           │    │   │
│  │  │ • Include successful examples from similar campaigns         │    │   │
│  │  │ • Apply client-specific learnings                            │    │   │
│  │  │ • Warn about known failure patterns                          │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │ Rules Evolution (.cursor/rules/)                             │    │   │
│  │  │ ─────────────────────────────────                            │    │   │
│  │  │ • Auto-update coding standards based on fixes                │    │   │
│  │  │ • Add new patterns discovered during development             │    │   │
│  │  │ • Deprecate patterns that consistently fail                  │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │ Agent Memory (claude-mem integration)                        │    │   │
│  │  │ ─────────────────────────────────────                        │    │   │
│  │  │ • Persist observations across sessions                       │    │   │
│  │  │ • Surface relevant past context                              │    │   │
│  │  │ • Track session-to-session improvement                       │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Observation Layer

Captures events from multiple sources:

#### Session Events (Development)

```typescript
interface SessionObservation {
  id: string;
  timestamp: Date;
  type:
    | "file_edit"
    | "shell_command"
    | "tool_use"
    | "decision"
    | "discovery"
    | "bugfix";
  context: {
    file?: string;
    command?: string;
    tool?: string;
    rationale?: string;
  };
  outcome: "success" | "failure" | "partial";
  tags: string[];
  tokenCost: number;
}
```

#### Output Feedback (Production)

```typescript
interface OutputFeedback {
  generationId: string;
  timestamp: Date;
  userRating?: number; // 1-10 from Leo
  manualEdits?: {
    section: string; // Which framework section
    originalText: string;
    editedText: string;
    editType: "minor" | "major" | "rewrite";
  }[];
  regenerationRequested: boolean;
  regenerationReason?: string;
  exportFormat: "pptx" | "pdf" | "slides" | "none";
  timeToExport?: number; // Seconds from generation to export
}
```

#### Error Tracking

```typescript
interface ErrorObservation {
  id: string;
  timestamp: Date;
  errorType: "generation" | "retrieval" | "api" | "parsing" | "export";
  errorMessage: string;
  stackTrace?: string;
  context: Record<string, unknown>;
  fixApplied?: {
    description: string;
    successful: boolean;
  };
  recurrence: number; // How many times this error has occurred
}
```

### 2. Memory Consolidation

Two storage mechanisms work together:

#### Knowledge Graph (Structured Relationships)

- **Patterns**: Strategic approaches that work/fail
- **Campaigns**: Client context and history
- **Tactics**: Specific mechanics and their outcomes
- **Outcomes**: User feedback linked to outputs

```typescript
// Extend existing knowledge-graph.ts
export type EvolutionNodeType =
  | JLNodeType
  | "fix_pattern" // Recurring fix that should become a rule
  | "success_pattern" // Approach that consistently gets high ratings
  | "failure_pattern" // Approach to avoid
  | "user_preference"; // Leo's editing preferences

export type EvolutionEdgeType =
  | JLEdgeType
  | "fixes" // Fix pattern resolves error type
  | "improves" // Pattern improves another pattern
  | "preferred_over" // User preference edge
  | "causes"; // Pattern causes outcome
```

#### Observation Store (Time-Series)

- Firestore collection for raw observations
- Indexed by session, type, outcome
- Retention: 90 days detailed, aggregated indefinitely

### 3. Learning Extraction

Periodic analysis to extract actionable learnings:

#### Pattern Analyzer

```typescript
async function analyzePatterns(): Promise<LearnedPattern[]> {
  // 1. Fetch recent feedback (last 30 days)
  const feedback = await getRecentFeedback(30);

  // 2. Cluster by framework section and rating
  const clusters = clusterBySection(feedback);

  // 3. Identify what differentiates high-rated from low-rated
  const patterns = [];
  for (const section of Object.keys(clusters)) {
    const highRated = clusters[section].filter((f) => f.rating >= 8);
    const lowRated = clusters[section].filter((f) => f.rating <= 5);

    // Use Claude to analyze differences
    const analysis = await claude.analyze({
      prompt: `Compare these high-rated and low-rated outputs for ${section}.
               What patterns distinguish success from failure?`,
      highRated,
      lowRated,
    });

    patterns.push({
      section,
      successPatterns: analysis.successPatterns,
      failurePatterns: analysis.failurePatterns,
      confidence: analysis.confidence,
    });
  }

  return patterns;
}
```

#### Prompt Optimizer

```typescript
interface PromptVariant {
  id: string;
  prompt: string;
  avgRating: number;
  sampleSize: number;
  lastUsed: Date;
}

async function optimizePrompts(): Promise<void> {
  // A/B test prompt variants
  const variants = await getPromptVariants("participation_framework");

  // Identify statistically significant winners
  const winners = variants.filter(
    (v) => v.sampleSize >= 10 && v.avgRating >= 8
  );

  // Promote winners, deprecate losers
  for (const winner of winners) {
    await promotePromptVariant(winner.id);
  }
}
```

### 4. Evolution Application

How learnings get applied:

#### Context Injection

Before each generation, inject relevant learnings:

```typescript
async function injectEvolutionContext(
  seed: ProjectSeed
): Promise<EvolutionContext> {
  // 1. Find similar past campaigns
  const similar = await knowledgeGraph.findSimilar(seed);

  // 2. Get success patterns for this client/category
  const patterns = await getSuccessPatterns({
    client: seed.client,
    category: seed.category,
  });

  // 3. Get user preferences (Leo's editing patterns)
  const preferences = await getUserPreferences("leo");

  // 4. Get warnings (failure patterns to avoid)
  const warnings = await getFailurePatterns({
    client: seed.client,
    category: seed.category,
  });

  return {
    similarCampaigns: similar.slice(0, 3),
    successPatterns: patterns.slice(0, 5),
    userPreferences: preferences,
    warnings: warnings.slice(0, 3),
  };
}
```

#### Rules Evolution

Automatically update `.cursor/rules/` based on learnings:

```typescript
async function evolveRules(): Promise<void> {
  // 1. Find recurring fixes (same fix applied 3+ times)
  const recurringFixes = await getRecurringFixes(3);

  // 2. Generate rule updates
  for (const fix of recurringFixes) {
    const ruleContent = await generateRuleFromFix(fix);

    // 3. Append to appropriate rule file
    await appendToRule(
      fix.ruleFile || ".cursor/rules/learned-patterns.mdc",
      ruleContent
    );
  }

  // 4. Log evolution event
  await logEvolution({
    type: "rules_updated",
    rulesAffected: recurringFixes.map((f) => f.ruleFile),
    timestamp: new Date(),
  });
}
```

---

## Integration with Existing Systems

### Claude-Mem Integration

The system integrates with the existing claude-mem infrastructure:

```typescript
// Observations flow to claude-mem
async function captureObservation(obs: SessionObservation): Promise<void> {
  // 1. Store in local observation store
  await observationStore.add(obs);

  // 2. If significant, push to claude-mem
  if (obs.type === "decision" || obs.type === "bugfix") {
    await claudeMem.addObservation({
      project: "participation-translator",
      type: obs.type,
      title: generateTitle(obs),
      content: JSON.stringify(obs),
      tags: obs.tags,
    });
  }
}
```

### Knowledge Graph Integration

Learnings enrich the existing JL knowledge graph:

```typescript
// After pattern analysis, update knowledge graph
async function updateGraphWithLearnings(
  patterns: LearnedPattern[]
): Promise<void> {
  for (const pattern of patterns) {
    // Add success patterns as nodes
    for (const success of pattern.successPatterns) {
      graph.addNode({
        id: `success_${hash(success)}`,
        type: "success_pattern",
        label: success.name,
        data: {
          frameworkSection: pattern.section,
          effectiveness: success.avgRating / 10,
          description: success.description,
        },
        createdAt: new Date(),
      });
    }
  }
}
```

---

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Development │     │ Production  │     │ Analysis    │
│ Session     │     │ Usage       │     │ Jobs        │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ Observations      │ Feedback          │ Patterns
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────┐
│                   Firestore                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │observations/│  │feedback/    │  │patterns/    │ │
│  │{sessionId}  │  │{generationId}│ │{patternId}  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│               Knowledge Graph                        │
│  (patterns, campaigns, tactics, outcomes)           │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│            Context Injection & Rules                 │
│  • Pre-generation context                           │
│  • .cursor/rules/ updates                           │
│  • claude-mem observations                          │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1.5 (Before Phase 2) - Foundation

- [ ] Create `src/lib/learning/` module structure
- [ ] Set up Firestore collections for observations and feedback
- [ ] Implement basic observation capture (file edits, commands)
- [ ] Create feedback capture UI for Leo

### Phase 2 - Active Learning

- [ ] Implement pattern analysis jobs (weekly)
- [ ] Create context injection for generation
- [ ] Build basic rules evolution

### Phase 3+ - Advanced

- [ ] A/B testing for prompt variants
- [ ] Automated retrieval tuning
- [ ] Predictive pattern matching

---

## Metrics & Monitoring

### Learning Effectiveness

| Metric                  | Target     | Measurement                 |
| ----------------------- | ---------- | --------------------------- |
| Avg output rating trend | Increasing | 30-day rolling average      |
| Regeneration rate       | Decreasing | % outputs regenerated       |
| Time to export          | Decreasing | Avg seconds to first export |
| Edit intensity          | Decreasing | Avg edits per output        |

### System Health

| Metric                    | Alert Threshold      |
| ------------------------- | -------------------- |
| Observations captured/day | < 10                 |
| Pattern analysis failures | > 2/week             |
| Rule evolution errors     | Any                  |
| Knowledge graph size      | Stagnant for 14 days |

---

## Security & Privacy

- Observations are project-scoped
- No PII in observations (use IDs)
- Feedback data is aggregated for analysis
- Rules evolution is logged and reversible

---

## Related Documents

- [ARCHITECTURE-PARTICIPATION-TRANSLATOR.md](./ARCHITECTURE-PARTICIPATION-TRANSLATOR.md)
- [CULTURAL_INTELLIGENCE.md](./CULTURAL_INTELLIGENCE.md)
- `src/lib/memory/knowledge-graph.ts` - Existing knowledge graph implementation

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-05
