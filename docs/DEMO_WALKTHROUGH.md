# Demo Walkthrough - Leo Session Script

**Version:** 1.0.0
**Date:** 2026-02-05
**Purpose:** Step-by-step guide for demonstrating the Participation Translator

---

## Pre-Demo Checklist

- [ ] Data files copied to project (`data/presentations/`, `data/creators/`, `data/media/`)
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Terminal ready in project directory

---

## Demo Flow Overview

```
Phase 1: Architecture Overview (5 min)
    ↓
Phase 2: Data Organization (2 min)
    ↓
Phase 3: Live Ingestion Demo (10 min)
    ↓
Phase 4: RAG Retrieval Demo (5 min)
    ↓
Phase 5: Frontend Preview (3 min)
    ↓
Phase 6: Discussion & Next Steps (10 min)
```

---

## Phase 1: Architecture Overview (5 minutes)

### 1.1 Project Structure

```bash
# Show project structure
tree -L 2 -I 'node_modules|.git'
```

**Talking Points:**
- `src/lib/` - Core processing libraries
- `data/` - JL institutional knowledge
- `app/` - Frontend application
- `.cursor/agents/` - Specialized AI agents

### 1.2 Knowledge Graph

```bash
# Show knowledge graph stats
cat data/knowledge-graph.json | head -50
```

**Talking Points:**
- 18 nodes: 9 framework sections + 5 patterns + 4 tactics
- 8 edges connecting concepts
- Foundation for understanding JL's approach

### 1.3 Participation Framework

```bash
# Show the codified framework
cat src/prompts/participation-framework.ts | head -100
```

**Talking Points:**
- 9 sections of the framework
- System prompt establishing JL strategist persona
- Framework is USED but INVISIBLE in output

---

## Phase 2: Data Organization (2 minutes)

### 2.1 Show Data Structure

```bash
# List data directories
ls -la data/
ls -la data/presentations/ | head -20
```

**Talking Points:**
- 36 participation presentations for training
- Media options collection
- Creator options collection
- Metadata manifest for better retrieval

### 2.2 Show Manifest (if created)

```bash
# Show metadata
cat data/presentations/manifest.csv | head -10
```

---

## Phase 3: Live Ingestion Demo (10 minutes)

### 3.1 Dry Run First

```bash
# Show what WOULD happen without actually processing
npm run ingest -- ./data/presentations/[SMALLEST_FILE].pptx \
  --client "JL" \
  --type presentation \
  --dry-run
```

**Talking Points:**
- Document parsing extracts text from slides
- Chunking breaks content into semantic segments
- Each chunk gets embedded as a vector

### 3.2 Actual Ingestion

```bash
# Ingest a presentation (pick smallest for speed)
npm run ingest -- ./data/presentations/[FILE].pptx \
  --client "JL" \
  --type presentation
```

**Expected Output:**
```
Parsing document: [filename].pptx
File type: pptx
Created X chunks
Generating embeddings...
Indexing chunks...
Successfully indexed X chunks
```

### 3.3 Check Vector Store Stats

```bash
# Show what's been indexed
npm run stats
```

**Talking Points:**
- Documents indexed
- Total chunks
- Ready for retrieval

---

## Phase 4: RAG Retrieval Demo (5 minutes)

### 4.1 Test Participation Query

```bash
# Query for participation mechanics
npm run retrieve -- "participation mechanics for consumer engagement" --top-k 5
```

**Talking Points:**
- Semantic search finds relevant chunks
- Not keyword matching - understands meaning
- Returns context from past JL work

### 4.2 Test Cultural Context Query

```bash
# Query for cultural context approaches
npm run retrieve -- "cultural context and brand credibility" --top-k 5
```

### 4.3 Test First Responders Query

```bash
# Query for first responder strategies
npm run retrieve -- "first responder subcultures activation" --top-k 5
```

**Talking Points:**
- Different queries surface different relevant content
- This is how the system will find similar past work
- Grounds generation in JL's institutional knowledge

---

## Phase 5: Frontend Preview (3 minutes)

### 5.1 Start Development Server

```bash
# Start the frontend
cd app && npm run dev
```

### 5.2 Show Key Pages

1. **Landing Page** (`http://localhost:3000`)
   - Project overview
   - JL branding
   - Key features

2. **Generation Wizard** (`http://localhost:3000/generate`)
   - Step 1: Project Seed (brand, category, idea)
   - Step 2: Additional Context
   - Step 3: Review
   - Step 4: Generate

3. **History** (`http://localhost:3000/history`)
   - Past generations
   - Export options

**Talking Points:**
- Desktop-friendly interface
- Multi-step wizard captures all inputs
- History enables learning from past outputs

---

## Phase 6: Discussion & Next Steps (10 minutes)

### Questions for Leo

1. **Priority Documents**
   - Which presentations should we ingest first?
   - Any that are particularly good examples?

2. **Framework Refinement**
   - Any adjustments to the 9-section structure?
   - Sections that need more/less emphasis?

3. **Output Format**
   - Google Slides template - brand guidelines?
   - Preferred export formats?

4. **Trial Assignment**
   - Which specific assignment for POC?
   - Timeline expectations?

### Immediate Next Steps

| Step | Description | Timeline |
|------|-------------|----------|
| 1 | Ingest all 36 presentations | Today |
| 2 | Create metadata manifest | Today |
| 3 | Ingest media + creator collections | Today |
| 4 | Test retrieval quality | Today |
| 5 | Select trial assignment | With Leo |
| 6 | Build generation pipeline | Next phase |

---

## Quick Command Reference

```bash
# Ingestion
npm run ingest -- <file> --client "Name" --type presentation
npm run ingest -- <file> --dry-run  # Preview only

# Retrieval
npm run retrieve -- "query text" --top-k 10
npm run stats  # Vector store statistics

# Frontend
cd app && npm run dev  # Start dev server
cd app && npm run build  # Production build

# Knowledge Graph
npm run seed-graph  # Seed framework nodes
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` in root and `app/` |
| Embedding errors | Check GCP credentials in `.env` |
| Large file timeout | Start with smaller presentations |
| Port 3000 in use | Kill existing process or use different port |

---

## Demo Success Criteria

- [ ] Leo understands the RAG pipeline
- [ ] At least 1 presentation successfully ingested
- [ ] Retrieval returns relevant results
- [ ] Frontend wizard is clear
- [ ] Next steps agreed upon

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Created: 2026-02-05
