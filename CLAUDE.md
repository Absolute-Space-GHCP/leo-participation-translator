# CLAUDE.md - AI Assistant Context

Version: 1.3.0
Last Updated: 2025-12-09
Purpose: Provide context to Claude and other AI assistants working in this codebase

---

## ⚠️ CRITICAL: Workspace Rules

**ALWAYS READ THIS FILE AND `PROJECT_GUARDRAILS.md` BEFORE STARTING ANY SESSION TASKS.**

### Standard Project Path Convention

On ANY local device, projects should follow this folder structure:

```
~/dev/ai-agents-and-apps-dev/PROJECT_NAME/
```

**Path breakdown:**
- `~` → User home directory (e.g., `/Users/charleymm`)
- `dev/` → Development folder
- `ai-agents-and-apps-dev/` → AI projects parent folder
- `PROJECT_NAME/` → Specific project (e.g., `jl-dev-environment-gm-v1.0`)

### Current Project Path

This project MUST only be worked on from:

```
~/dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0
```

**Full absolute path example:**
```
/Users/charleymm/dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0
```

### First Check Before Any Session

Before starting any tasks, verify you are in the correct workspace:

```bash
# Verify workspace path
pwd
# Expected output should end with: /dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0

# Or check with this command:
[[ "$PWD" == *"dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0"* ]] && echo "✓ Correct workspace" || echo "✗ Wrong workspace!"
```

**DO NOT:**
- Navigate to or modify files in other directories
- Clone or work from alternative locations (e.g., `~/Projects/`)
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
jl-dev-environment-gm-v1.0/
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

### Starting a New Session

1. **Read context files first:**
   - `CLAUDE.md` (this file)
   - `PROJECT_GUARDRAILS.md`
   - `TODO.md` for current priorities
   - Recent entries in `ACCOMPLISHMENTS.md`

2. **Verify workspace:**
   ```bash
   pwd  # Should be: /Users/charleymm/dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0
   ```

3. **Check current status:**
   ```bash
   ./scripts/validate.sh
   ```

### During a Session

- Update `TODO.md` as tasks are completed
- Follow existing patterns in the codebase
- Test changes before committing
- Document significant changes in CHANGELOG.md

### Ending a Session

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
