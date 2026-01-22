# CLAUDE.md - JL Dev Environment Golden Master

Version: 1.6.0
Last Updated: 2026-01-22
Purpose: Project-specific context for AI assistants working in this codebase

---

**Global Standards:** See `~/.cursor/CLAUDE.md` for coding standards, session protocols, and AI development tooling.

---

## ⚠️ CRITICAL: Workspace Rules

**ALWAYS READ:**
1. `~/.cursor/CLAUDE.md` (global standards - session protocols, coding standards, AI tooling)
2. This file (project-specific context)
3. `PROJECT_GUARDRAILS.md` (project constraints)

### Standard Project Path Convention

On ANY local device, projects should follow this folder structure:

```
~/Projects/PROJECT_NAME/
```

**Path breakdown:**
- `~` → User home directory (e.g., `/Users/charleymm`)
- `Projects/` → Projects folder (our working local directory)
- `PROJECT_NAME/` → Specific project (e.g., `jl-dev-environment-gm`)

### Current Project Path

This project MUST only be worked on from:

```
~/Projects/jl-dev-environment-gm
```

**Full absolute path example:**
```
/Users/charleymm/Projects/jl-dev-environment-gm
```

### First Check Before Any Session

Before starting any tasks, verify you are in the correct workspace:

```bash
# Verify workspace path
pwd
# Expected output should end with: /Projects/jl-dev-environment-gm

# Or check with this command:
[[ "$PWD" == *"Projects/jl-dev-environment-gm"* ]] && echo "✓ Correct workspace" || echo "✗ Wrong workspace!"
```

**DO NOT:**
- Navigate to or modify files in other directories
- Clone or work from alternative locations
- Reference or make changes to files outside this workspace
- Assume paths from other projects apply here

**DO:**
- Verify you are in the correct workspace before making changes
- Use absolute paths when running scripts
- Reference this workspace path in all file operations

---

## Project Overview

This is the **JL Dev Environment Golden Master** - a reproducible, AI-first development environment for the Johannes Leonardo engineering team.

---

## Repository Structure

```
jl-dev-environment-gm/
├── .devcontainer/     # VS Code/Cursor dev container config
├── .github/           # GitHub Actions, templates
├── config/            # Tool configurations (Cursor, Continue, Slack)
├── dashboard/         # Local status dashboard (Node.js/Express)
├── docker/            # Docker Compose and Dockerfiles
├── docs/              # Documentation (AUTH, BUILD, DOCKER)
├── scripts/           # Bootstrap, validation, utilities
├── sessions/          # Archived AI chat sessions
├── templates/         # Configuration templates
└── tests/             # Test files
```

---

## Version Control & GitHub

**Repository:** https://github.com/absolute-space-ghcp/jl-dev-environment-gm.git

**Authentication:**
- Uses existing GitHub credentials (SSH keys or GitHub CLI)
- User is authorized to use any available auth credentials (OAuth, tokens, SSH keys)
- Check authentication: `gh auth status` or `ssh -T git@github.com`

**Branch:** `main` (tracked as `origin/main`)

**Common Git Operations:**
```bash
# Check sync status
git status
git fetch origin
git log origin/main..HEAD  # Show unpushed commits

# Push changes
git push origin main

# Pull updates
git pull origin main
```

---

## Key Files

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | New developer setup guide |
| `PROJECT_GUARDRAILS.md` | Project constraints and rules |
| `scripts/bootstrap.sh` | One-command environment setup |
| `scripts/validate.sh` | Verify all tools installed |
| `scripts/utils/dashboard.sh` | Launch status dashboard |
| `scripts/utils/archive-session.sh` | Archive AI chat sessions |
| `TODO.md` | Current tasks and priorities |
| `ACCOMPLISHMENTS.md` | Session accomplishment logs |

---

## Tech Stack

- **Runtime**: Node.js 22 LTS, Java 21 LTS, Python 3.11+
- **Package Managers**: Homebrew, nvm, SDKMAN
- **IDE**: Cursor with 27 extensions
- **AI**: Claude Opus 4.5, Gemini 3 Pro
- **Cloud**: Google Cloud Platform (Vertex AI)
- **DevOps**: Docker, gcloud CLI, gh CLI

---

## Coding Standards

**Full standards:** See `~/.cursor/CLAUDE.md` for JavaScript/Node.js conventions, error handling, security rules, and naming conventions.

**Project-specific:**
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- All files should have version headers
- Follow existing code style and patterns
- Update CHANGELOG.md for notable changes
- Run `./scripts/validate.sh` before committing

---

## Common Tasks

### Run the Dashboard
```bash
./scripts/utils/dashboard.sh
```

### Validate Setup
```bash
./scripts/validate.sh
```

### Archive a Session
```bash
./scripts/utils/archive-session.sh "topic-name"
```

### Start Docker Services
```bash
./scripts/utils/docker-start.sh
```

---

## Session Workflow

**Note:** Full session protocols (backup, wrap-up, git safety) are in `~/.cursor/CLAUDE.md`

### Starting a New Session

1. **Read context files:**
   - `~/.cursor/CLAUDE.md` (global standards)
   - This `CLAUDE.md` file
   - `PROJECT_GUARDRAILS.md`
   - `TODO.md` for current priorities

2. **Create session backup** (per global protocol):
   ```bash
   ARCHIVE_DIR="$HOME/Projects/ARCHIVED"
   PROJECT_NAME=$(basename $(pwd))
   TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)
   mkdir -p "$ARCHIVE_DIR"
   rsync -a --exclude='node_modules' --exclude='.git' . "$ARCHIVE_DIR/${PROJECT_NAME}_backup_${TIMESTAMP}/"
   ```

3. **Verify workspace:**
   ```bash
   pwd  # Should be: /Users/charleymm/Projects/jl-dev-environment-gm
   ./scripts/validate.sh
   ```

### During a Session

- Update `TODO.md` as tasks are completed
- Follow existing patterns in the codebase
- Test changes before committing
- Document significant changes in CHANGELOG.md

### Ending a Session

- Follow **Session Wrap-Up Protocol** in `~/.cursor/CLAUDE.md`
- Update `ACCOMPLISHMENTS.md` with session summary
- Commit all changes with conventional commit messages
- Archive the session if significant work was done

---

## Notes for AI Assistants

1. This is a macOS-focused environment (Apple Silicon)
2. The dashboard runs on port 3333
3. Sensitive data should never be committed
4. Check `.gitignore` before creating new files
5. Update documentation when adding features
6. Test changes with `./scripts/validate.sh`
7. **Always work from the designated workspace path**
8. **Read PROJECT_GUARDRAILS.md for constraints**

---

## Session Archives

AI chat sessions are archived in `sessions/` for continuity. When starting a new session, check recent archives for context.

---

## AI Development Tooling

**Full documentation:** See `~/.cursor/CLAUDE.md` for complete AI tooling setup including:
- Claude-Mem (Persistent Memory)
- Code-Simplifier Plugin
- Superpowers Plugin
- Sequential-Thinking MCP Server
- Context7 MCP Server

**Quick Reference:**
| Tool | Purpose |
|------|---------|
| Claude-Mem | Persistent memory across sessions |
| Code-Simplifier | Refine code for clarity and maintainability |
| Superpowers | TDD, debugging, planning workflows |
| Sequential-Thinking | Step-by-step reasoning |
| Context7 | Real-time library documentation |

---

## Quick Reference

| Action | Command / Location |
|--------|-------------------|
| Validate environment | `./scripts/validate.sh` |
| Start dashboard | `./scripts/utils/dashboard.sh` |
| Verify quick links (CLI) | `./scripts/utils/verify-links.sh` |
| Verify quick links (UI) | Dashboard → ⚡ Verify Links button |
| Start Docker | `./scripts/utils/docker-start.sh` |
| Archive session | `./scripts/utils/archive-session.sh "topic"` |
| Send Slack notification | `./scripts/utils/slack-notify.sh "message"` |

### Dashboard Features

The local dashboard (port 3333) includes:
- Real-time status monitoring for all dev tools
- **⚡ Verify Links button** - Tests connectivity to all Quick Links
- Organized Quick Links by category
- Auto-refresh every 30 seconds

---
