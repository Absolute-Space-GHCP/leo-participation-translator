# The Participation Translator

Version: 1.0.2
Last Updated: 2026-02-05
Purpose: AI-powered strategic tool that transforms passive advertising ideas into participation-worthy platforms

---

## Overview

The Participation Translator is an internal tool for Johannes Leonardo that applies the agency's proprietary 8-Part Participation Framework to transform traditional advertising concepts into participation-worthy platforms.

**Key Capabilities:**

- **RAG-powered context** - Retrieves relevant past JL work for pattern matching
- **Cultural intelligence** - Real-time trend analysis and subculture identification
- **Framework application** - Systematic 8-Part Participation Framework reasoning
- **Presentation output** - Google Slides blueprint generation

**Priority:** HIGH | **Visibility:** HIGH | **Sponsor:** Leo (Founder)

---

## Quick Start

### Prerequisites

- Node.js 22 LTS
- GCP account with billing enabled
- API keys: Anthropic (Claude), Exa.ai, Perplexity

### Setup

```bash
# Clone the repo
git clone https://github.com/Absolute-Space-GHCP/leo-participation-translator.git
cd leo-participation-translator

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your API keys in .env
# See docs/GCP_SETUP.md for GCP configuration
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck
```

---

## Documentation

| Document                 | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `CLAUDE.md`              | **Start here!** Project context for AI assistants |
| `PLAN.md`                | Implementation roadmap and phases                 |
| `TODO.md`                | Current tasks and progress                        |
| `docs/GCP_SETUP.md`      | GCP project configuration guide                   |
| `docs/ARCHITECTURE-*.md` | Technical architecture details                    |

---

## Architecture

### Multi-Agent System

| Agent                      | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `document-analyzer`        | Parse presentations, extract JL patterns  |
| `rag-engineer`             | Embeddings, retrieval, vector operations  |
| `cultural-intelligence`    | Trend analysis, subculture identification |
| `participation-strategist` | 8-Part Framework application              |
| `presentation-generator`   | Google Slides output                      |

### Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Frontend     | Next.js 14, React 18, Tailwind CSS              |
| Backend      | Node.js 22 LTS, TypeScript                      |
| AI/LLM       | Claude Opus 4.5 (Vertex AI), task-based routing |
| Vector Store | Vertex AI Vector Search                         |
| Storage      | Cloud Firestore, Cloud Storage                  |
| Presentation | Google Slides API                               |

---

## Project Structure

```
leo-participation-translator/
├── .cursor/
│   ├── agents/          # Specialized subagents
│   ├── rules/           # AI guidance rules
│   ├── skills/          # Reusable skills
│   └── hooks/           # Session automation
├── src/
│   ├── lib/
│   │   ├── memory/      # Knowledge graph
│   │   ├── router/      # Task routing
│   │   ├── parsers/     # Document parsing
│   │   ├── embeddings/  # Vector operations
│   │   └── ...
│   └── prompts/         # System prompts
├── docs/                # Documentation
├── sessions/            # Session logs
└── PLAN.md              # Implementation roadmap
```

---

## Implementation Phases

| Phase | Focus                 | Status                  |
| ----- | --------------------- | ----------------------- |
| 0     | Foundation Setup      | ✅ Complete             |
| 1     | Knowledge Base & RAG  | ✅ Complete (need docs) |
| 1.5   | Learning System       | ✅ Complete             |
| 2     | Framework Engine      | 🔜 Ready for Leo        |
| 3     | Cultural Intelligence | 📋 Research complete    |
| 4     | UI & Presentation     | ✅ Scaffolded           |
| 5     | Testing & Refinement  | ⏳ Pending              |
| 6     | Deployment            | ⏳ Pending              |

---

## Contributing

See `CONTRIBUTING.md` for guidelines.

---

## Security

See `SECURITY.md` for security policy.

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
