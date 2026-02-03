---
name: participation-rag
description: RAG operations for the Participation Translator - document ingestion, embedding, and retrieval. Use when ingesting JL presentations or retrieving context for blueprint generation.
---

# Participation RAG Skill

## Quick Start

### Ingest a Document

```bash
npx ts-node scripts/ingest.ts --file path/to/presentation.pptx --client "ClientName"
```

### Retrieve Context

```bash
npx ts-node scripts/retrieve.ts --query "participation mechanics for automotive brand"
```

## When to Use

- **Document ingestion**: New JL presentation to add to knowledge base
- **Context retrieval**: Gathering past work for blueprint generation
- **Embedding operations**: Batch processing documents

## Workflow

### Ingestion Flow

```
Document → Parse → Chunk → Embed → Store
   ↓         ↓       ↓        ↓       ↓
PPTX     Extract  Split   Vertex   Vector
PDF      text &   into    AI API   Store
DOCX     metadata chunks
```

### Retrieval Flow

```
Query → Embed → Search → Rank → Return
  ↓       ↓        ↓       ↓       ↓
Text   Vertex   Vector   By      Top-K
       AI API   Store    score   results
```

## Configuration

Environment variables required:

```bash
# GCP
GCP_PROJECT_ID=participation-translator
GCP_REGION=us-central1

# Vertex AI
VERTEX_AI_EMBEDDING_MODEL=text-embedding-005

# Vector Store
VERTEX_VECTOR_INDEX_ENDPOINT=projects/.../indexEndpoints/...
```

## Scripts

| Script                    | Purpose                 |
| ------------------------- | ----------------------- |
| `scripts/ingest.ts`       | Ingest single document  |
| `scripts/retrieve.ts`     | Query vector store      |
| `scripts/batch-ingest.ts` | Batch process directory |

## Chunking Strategy

- **Size**: 512-1024 tokens
- **Overlap**: 64 tokens
- **Preserve**: Slide boundaries, section headers
- **Metadata**: Client, campaign, year, patterns, framework sections

## Related

- `document-analyzer` agent - Uses this skill for parsing
- `rag-engineer` agent - Uses this skill for all vector operations

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
