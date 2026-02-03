# Changelog - The Participation Translator

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-02-03 - PHASE 0 COMPLETE

**Author:** Charley Scholz (Johannes Leonardo IT)
**Co-author:** Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

### Architecture

- **Multi-Agent System** - Specialized agents for different tasks

  - `document-analyzer` - Parse presentations, extract JL patterns
  - `rag-engineer` - Embeddings, retrieval, vector operations
  - `cultural-intelligence` - Trend analysis (Phase 3 placeholder)
  - `participation-strategist` - Framework application (Phase 2 placeholder)
  - `presentation-generator` - Google Slides output (Phase 4 placeholder)

- **Knowledge Graph** - Relationship-based institutional memory

  - Pattern-campaign-cultural moment relationships
  - Framework section mapping
  - Complements vector similarity search

- **Task Router** - Intelligent model selection
  - Routes simple tasks to fast/cheap models
  - Routes complex reasoning to Claude Opus 4.5
  - Cost optimization without quality sacrifice

### Added

- Agent delegation rules (`.cursor/rules/agents.mdc`)
- 5 subagent definitions (`.cursor/agents/`)
- 3 skills (participation-rag, document-analysis, session-workflow)
- 15 rules for workflows, standards, patterns
- Cursor hooks for session management
- Knowledge graph implementation (`src/lib/memory/knowledge-graph.ts`)
- Task router implementation (`src/lib/router/task-router.ts`)
- GCP setup documentation (`docs/GCP_SETUP.md`)

### Changed

- Output format changed from PPTX to Google Slides
- Vector store specified as Vertex AI Vector Search
- Reasoning engine upgraded to Claude Opus 4.5 (configurable)
- Phased approach: Phase 0-1 focus, Leo guides Phase 2+

---

## [1.0.0] - 2026-02-03 - INITIAL RELEASE

**Author:** Charley Scholz (Johannes Leonardo IT)
**Co-author:** Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

### Changed

- Primary output changed from document to presentation (PPTX)
- Added PptxGenJS integration planning
- Updated architecture diagrams for presentation flow
- Recommended Claude Opus 4.5 over Sonnet for complex reasoning

### Added

- Export module scaffolding (`src/lib/export/`)
- Slide layout templates (`src/templates/slide-layouts.json`)
- Presentation generation specifications in PLAN.md

---

## [0.1.0] - 2026-02-03 - INITIAL SCAFFOLDING

**Author:** Charley Scholz (Johannes Leonardo IT)
**Co-author:** Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

### Added

- Comprehensive implementation plan (`PLAN.md`)
- Technical architecture documentation (`docs/ARCHITECTURE-PARTICIPATION-TRANSLATOR.md`)
- Project context file (`CLAUDE.md`)
- Task tracking (`TODO.md`)
- Core library scaffolding:
  - Document parsers (`src/lib/parsers/`)
  - Embedding operations (`src/lib/embeddings/`)
  - Cultural intelligence (`src/lib/cultural/`)
  - Generation engine (`src/lib/generation/`)
- 8-Part Participation Framework prompts (`src/prompts/participation-framework.ts`)
- Environment configuration template (`.env.example`)
- Session logging structure (`sessions/`)

### Architecture Decisions

- RAG-based approach with JL institutional memory
- Real-time cultural intelligence via external APIs
- Chain-of-thought reasoning for framework application
- GCP-native infrastructure (Vertex AI, Cloud Run)

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
