# CLAUDE.md - AI Assistant Context

Version: 1.5.0
Last Updated: 2026-01-14
Purpose: Provide context to Claude and other AI assistants working in this codebase

---

## ⚠️ CRITICAL: Workspace Rules

**ALWAYS READ THIS FILE AND `PROJECT_GUARDRAILS.md` BEFORE STARTING ANY SESSION TASKS.**

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
   pwd  # Should be: /Users/charleymm/Projects/jl-dev-environment-gm
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

## AI Development Tooling

**Last Updated:** 2026-01-14

### Claude-Mem (Persistent Memory)

Claude-mem provides persistent memory across AI coding sessions. It automatically captures tool usage, file edits, and shell commands, then injects relevant context into future sessions.

**Setup:** User-level installation at `~/.cursor/hooks.json` (applies to ALL projects)

**How it works:**
- **Before prompt:** Session initialized, past context injected
- **During work:** All tool usage, commands, edits captured automatically
- **When done:** AI-powered session summary generated (via Gemini)
- **Next session:** Fresh context from past sessions available

**Web Viewer:** http://localhost:37777 (when worker is running)

**Worker Commands:**
```bash
# Start worker (from claude-mem directory)
cd ~/.claude/plugins/marketplaces/thedotmack && bun run worker:start

# Check status
curl http://127.0.0.1:37777/api/readiness
```

### Code-Simplifier Plugin

The code-simplifier plugin (from [claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit)) helps maintain code quality by simplifying and refining code for clarity, consistency, and maintainability while preserving functionality.

**Install:**
```bash
claude plugin install pr-review-toolkit@claude-plugins-official
```

**Principles:**
1. Preserve original functionality (NEVER alter behavior)
2. Reduce complexity without sacrificing clarity
3. Follow project-specific standards defined in this CLAUDE.md
4. Use consistent naming, formatting, and patterns

**When to use:**
- After completing a feature to clean up code
- When refactoring legacy code
- To improve readability of complex functions

### Superpowers Plugin

The Superpowers plugin by Jesse Vincent enhances Claude Code with structured workflows for TDD, systematic debugging, and collaborative planning.

**Install:**
```bash
# In Claude Code CLI:
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

**Key Commands:**
| Command | Purpose |
|---------|---------|
| `/superpowers:brainstorm` | Structured brainstorming sessions |
| `/superpowers:write-plan` | Create detailed implementation plans |
| `/superpowers:execute-plan` | Execute plans with checkpoints |
| `/superpowers:tdd` | Test-Driven Development (RED-GREEN-REFACTOR) |
| `/superpowers:debug` | Systematic 4-phase debugging process |

**When to use:**
- Starting complex features (brainstorm → write-plan → execute-plan)
- Implementing new functionality with TDD workflow
- Debugging tricky issues systematically
- Pair programming sessions requiring structure

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
