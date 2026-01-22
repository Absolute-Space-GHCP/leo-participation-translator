# Architecture Overview

Version: 1.0.0
Last Updated: 2026-01-22
Purpose: Technical architecture of the AI-powered development environment

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPER WORKSTATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   Cursor IDE    │    │  Claude Code    │    │   Gemini CLI    │         │
│  │  (Primary IDE)  │    │   (AI Agent)    │    │  (AI Terminal)  │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                   │
│           └──────────────────────┼──────────────────────┘                   │
│                                  │                                          │
│  ┌───────────────────────────────┴───────────────────────────────┐         │
│  │                    MCP SERVER LAYER                            │         │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │         │
│  │  │ Sequential  │  │ Filesystem  │  │    Git      │            │         │
│  │  │  Thinking   │  │   Server    │  │   Server    │            │         │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │         │
│  └───────────────────────────────────────────────────────────────┘         │
│                                  │                                          │
│  ┌───────────────────────────────┴───────────────────────────────┐         │
│  │                    CURSOR INTEGRATION LAYER                    │         │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │         │
│  │  │   Hooks     │  │   Rules     │  │  Plugins    │            │         │
│  │  │ (claude-mem)│  │ (6 .mdc)    │  │ (simplifier)│            │         │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │         │
│  └───────────────────────────────────────────────────────────────┘         │
│                                  │                                          │
│  ┌───────────────────────────────┴───────────────────────────────┐         │
│  │                    PERSISTENT MEMORY LAYER                     │         │
│  │  ┌─────────────────────────────────────────────────────┐      │         │
│  │  │                   Claude-Mem Worker                  │      │         │
│  │  │  - Session tracking    - Context injection          │      │         │
│  │  │  - Observation capture - AI summarization           │      │         │
│  │  │  - Web viewer (port 37777)                          │      │         │
│  │  └─────────────────────────────────────────────────────┘      │         │
│  └───────────────────────────────────────────────────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLOUD SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   GitHub    │  │   Google    │  │  Anthropic  │  │   Google    │        │
│  │ (Version    │  │   Cloud     │  │  (Claude    │  │  AI Studio  │        │
│  │  Control)   │  │ (GCP APIs)  │  │   API)      │  │ (Gemini)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. IDE Layer

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Cursor IDE** | Primary development environment | VS Code fork with AI |
| **Extensions** | 27 productivity extensions | See `config/cursor/extensions.txt` |
| **Settings** | Shared workspace settings | `config/cursor/settings.json` |

### 2. AI Agent Layer

| Component | Purpose | Model |
|-----------|---------|-------|
| **Claude Code** | AI coding assistant | Claude Opus 4.5 |
| **Continue** | IDE-integrated AI | Gemini 2.5 Pro |
| **Gemini CLI** | Terminal AI assistant | Gemini 2.5 Flash |

### 3. MCP Server Layer

| Server | Purpose | Scope |
|--------|---------|-------|
| **Sequential Thinking** | Step-by-step reasoning | Global |
| **Filesystem** | Secure file operations | `~/Projects/` |
| **Git** | Repository automation | `~/Projects/` |

### 4. Cursor Integration Layer

| Component | Files | Purpose |
|-----------|-------|---------|
| **Hooks** | `~/.cursor/hooks.json` | Event-driven automation |
| **Rules** | `~/.cursor/rules/*.mdc` | AI behavior guidelines |
| **Plugins** | `~/.cursor/plugins/` | Extended capabilities |

### 5. Persistent Memory Layer

| Component | Port | Purpose |
|-----------|------|---------|
| **Claude-Mem Worker** | 37777 | Session tracking & context injection |
| **Web Viewer** | 37777 | Visual session history |
| **Gemini Summarizer** | - | AI-powered session summaries |

---

## Data Flow

### Session Start Flow

```
1. Developer opens Cursor
2. hooks.json triggers session-init.sh
3. Claude-mem injects past context via context-inject.sh
4. Cursor rules (.mdc files) loaded
5. MCP servers available for AI tools
```

### During Development

```
1. Developer writes code / asks AI
2. AI uses MCP servers (filesystem, git, thinking)
3. Hooks capture: shell output, file edits, MCP results
4. Claude-mem stores observations
5. Rules guide AI behavior (auth, git safety, etc.)
```

### Session End Flow

```
1. Developer ends session (or Cursor closes)
2. session-summary.sh generates AI summary via Gemini
3. Summary stored in claude-mem database
4. Context available for next session
```

---

## Directory Structure

```
~/
├── .cursor/
│   ├── CLAUDE.md              # Global AI standards
│   ├── hooks.json             # Event hook configuration
│   ├── mcp.json               # MCP server configuration
│   ├── hooks/                 # Hook scripts (6 files)
│   ├── rules/                 # Cursor rules (6 .mdc files)
│   └── plugins/               # AI plugins
│       └── code-simplifier/
│
├── .claude/
│   └── plugins/
│       └── marketplaces/
│           ├── thedotmack/    # Claude-mem
│           └── superpowers-marketplace/
│
└── Projects/
    ├── jl-dev-environment-gm/ # This repository
    ├── other-project-1/
    └── other-project-2/
```

---

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `mcp.json` | `~/.cursor/` | MCP server definitions |
| `hooks.json` | `~/.cursor/` | Cursor event hooks |
| `CLAUDE.md` | `~/.cursor/` | Global AI standards |
| `*.mdc` | `~/.cursor/rules/` | Cursor behavior rules |
| `settings.json` | Project `.cursor/` | Workspace settings |

---

## Security Boundaries

| Boundary | Scope | Enforcement |
|----------|-------|-------------|
| **Filesystem MCP** | `~/Projects/` only | MCP server args |
| **Git MCP** | `~/Projects/` only | MCP server args |
| **Auth flows** | Pre-authorized | `auth-permissions.mdc` |
| **Git pushes** | Archive-first | `git-safety-archive.mdc` |

---

## Scalability

### Single Developer
- All components run locally
- ~2GB memory footprint (Cursor + workers)
- No external dependencies except AI APIs

### Team Deployment
- Clone repo per developer
- Shared `config/` templates
- Individual `~/.cursor/` installations
- Consider: shared claude-mem server (future)

---

## Dependencies

### Required
| Dependency | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 10+ | Package manager |
| Git | 2.30+ | Version control |

### Optional
| Dependency | Version | Purpose |
|------------|---------|---------|
| Docker | 24+ | Containerization |
| Python | 3.11+ | Git MCP server |
| Java | 21+ | Some tooling |
| bun | 1.0+ | Claude-mem worker |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-01-22
