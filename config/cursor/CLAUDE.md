# CLAUDE.md - Global Standards for All Projects

Version: 1.0.0
Last Updated: 2026-01-22
Purpose: Provide global AI assistant context for all projects in ~/Projects/

---

## ⚠️ CRITICAL: Session Startup Requirements

**READ THIS FILE FIRST** at the start of every new or resumed session.

### User Authorization Policy

The user (Charley) has pre-authorized the following:

1. **Login Windows:** You ARE AUTHORIZED to trigger any login/auth flows that open browser windows. The user will complete authentication manually. Don't wait for permission - just run the command.

2. **Auto-Login:** If you have credentials available (e.g., `sa-key.json`, cached tokens), you ARE AUTHORIZED to use them automatically without asking.

3. **Authentication Commands:** If auth is expired, run `gcloud auth login --update-adc` (or similar) - this will open a browser window that the user will complete.

4. **Service Account:** Use `sa-key.json` with `GOOGLE_APPLICATION_CREDENTIALS` for DWD operations when available.

5. **Edits:** Batch documentation updates, version bumps, and cross-project maintenance tasks are pre-approved.

### Session Startup Checklist

1. Read this global CLAUDE.md file
2. Read the project's CLAUDE.md for project-specific context
3. **Create backup of the project repo** (see Session Backup Protocol below)
4. Check auth status
5. If auth fails, trigger login via browser (pre-authorized)
6. Review TASKS.md and any priority files for current tasks

### AI Session Guidelines

**REQUIRED:** Follow these guidelines in every AI coding session.

1. **Use Thinking Mode:** Always use thinking/reasoning mode to work through problems step by step before implementing solutions.

2. **Incremental Development Rule:** 
   ```
   Feature Implemented → Test → Rinse and Repeat
   ```
   - Implement ONE feature at a time
   - Test the feature thoroughly before moving on
   - Only proceed to next feature if tests pass
   - This prevents cascading failures and makes debugging easier

3. **Debug Before Rollback:** When something appears broken:
   - First, add logging to identify the actual failure point
   - Preserve existing features - don't throw away weeks of work
   - Only rollback as a last resort after debugging fails

4. **Test in Production:** Local development can behave differently than production due to:
   - Browser security policies for file system access
   - CORS configurations
   - Service worker caching
   - Environment variable differences
   
   **Always verify functionality in production, not just localhost.**

---

## Session Protocols

### Session Backup Protocol

**REQUIRED:** Before making any code changes in a session, create a backup of the current project state.

```bash
# Create timestamped backup (run at session start)
ARCHIVE_DIR="$HOME/Projects/ARCHIVED"
PROJECT_NAME=$(basename $(pwd))
TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)
ARCHIVE_PATH="$ARCHIVE_DIR/${PROJECT_NAME}_backup_${TIMESTAMP}"

mkdir -p "$ARCHIVE_DIR"
rsync -a --exclude='node_modules' --exclude='.git' . "$ARCHIVE_PATH/"
echo "Backup created: $ARCHIVE_PATH"
```

**Purpose:** Enables quick rollback if changes introduce issues.

**Archive Location:** `~/Projects/ARCHIVED/{project-name}_backup_{timestamp}`

### Session Wrap-Up Protocol

**REQUIRED:** At the end of every session, complete the following checklist:

1. **Sync Repos:**
   - Ensure local and GitHub repos are 1:1 in sync
   - Commit all changes with descriptive messages
   - Push to remote: `git push origin <branch>`
   - If on feature branch, merge to main when stable

2. **Archive Working Code:**
   - Before replacing working code with new versions, create an archive
   - Archive naming: `{project-name}_working_{version}_{date}`
   - Archive location: `~/Projects/ARCHIVED/`

3. **Update Documentation:**
   - Update version numbers in README.md, CHANGELOG.md
   - Add session notes to `docs/SESSION_{date}_{version}.md`
   - Update TASKS.md with completed tasks and new items

4. **Verify No Remnants:**
   - Check documentation for references to other projects
   - Ensure all file paths and URLs are correct for this project

5. **Final Checks:**
   - Run `git status` to confirm clean working tree
   - Verify production deployment matches committed code
   - Note any pending items for next session

### Pre-Push Archive Protocol

**CRITICAL:** Before ANY `git push` that would overwrite remote changes, the remote state MUST be archived locally.

```bash
# 1. Fetch remote state
git fetch origin main

# 2. Check if remote has commits not in local
git log HEAD..origin/main --oneline

# 3. If remote has changes, archive before push:
ARCHIVE_DIR="$HOME/Projects/ARCHIVED"
PROJECT_NAME=$(basename $(pwd))
ARCHIVE_PATH="$ARCHIVE_DIR/${PROJECT_NAME}_remote_$(date +%Y-%m-%d)"

git clone --depth 1 $(git remote get-url origin) "$ARCHIVE_PATH"
echo "Archived to: $ARCHIVE_PATH"

# 4. Now safe to push
git push origin main
```

**When to Archive:**
- Before force push
- Before push that overwrites remote commits
- Before major refactoring pushes
- NOT needed for fast-forward pushes (no remote-only commits)

---

## Coding Standards

### JavaScript/Node.js
- Use ES modules with CommonJS (`require`/`module.exports`) for Node.js projects
- Use `async/await` for asynchronous operations
- Use `const` for variables that won't be reassigned, `let` otherwise
- Prefer explicit function declarations over arrow functions for top-level functions
- Use descriptive variable and function names
- Add JSDoc comments for exported functions

### Error Handling
- Always handle async errors with try/catch
- Log errors with context: `console.error('❌ Error description:', error.message)`
- Return structured error responses: `{ success: false, error: message }`
- Don't swallow errors silently

### Code Organization
- Keep functions focused and single-purpose
- Extract reusable logic into utility functions
- Group related functions together with section comments
- Use meaningful section separators: `// =============================================================================`

### API Endpoints
- Use Express.js patterns
- Return JSON responses with `success` boolean
- Include helpful error messages
- Log request details at start of handlers

### Google APIs
- Cache auth clients when possible
- Handle rate limits with exponential backoff
- Use batch operations where available
- Use DWD (Domain-Wide Delegation) for user impersonation when needed

### Security
- NEVER hardcode secrets or API keys
- Use environment variables via `process.env`
- Keep `sa-key.json` in `.gitignore`
- Validate all user inputs
- Block PII exposure in logs

### Naming Conventions
- Functions: `camelCase` - `handleSlackEvent`, `extractInvoiceNumber`
- Constants: `UPPER_SNAKE_CASE` - `CONFIG`, `MAX_RETRIES`
- Files: `kebab-case` - `drive-sync.js`, `job-report-parser.js`
- API routes: `/kebab-case` - `/reconcile/full`, `/api/search`

### Comments
- Use emoji prefixes for log messages: `📊`, `✅`, `❌`, `⚠️`, `🔐`
- Keep comments concise and meaningful
- Remove commented-out code before committing
- Update comments when changing code logic

## Avoid

- Nested ternary operators - use if/else or switch
- Deep callback nesting - use async/await
- Magic numbers - use named constants
- Overly clever one-liners - prefer readability
- Duplicate code - extract to functions
- Silent error swallowing
- Hardcoded configuration values

---

## AI Development Tooling

**Last Updated:** 2026-01-22

> **Auto-Approve Edits:** For batch documentation updates, version bumps, and cross-project maintenance tasks, the user has pre-approved all edits. No individual confirmation needed for these operations.

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

The code-simplifier plugin helps maintain code quality by simplifying and refining code for clarity, consistency, and maintainability while preserving functionality.

**Install:**
```bash
claude plugin install pr-review-toolkit@claude-plugins-official
```

**Principles:**
1. Preserve original functionality (NEVER alter behavior)
2. Reduce complexity without sacrificing clarity
3. Follow project-specific standards defined in project CLAUDE.md
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

### Sequential-Thinking MCP Server

Enables structured, step-by-step reasoning with revision and branching capabilities within conversations.

**Setup:** User-level MCP server (already configured)

**Capabilities:**
- **Structured Breakdown:** Converts complex queries into numbered, logical steps
- **Dynamic Revision:** Revise previous thoughts, triggering re-evaluation of subsequent steps
- **Parallel Exploration:** Branch to test multiple hypotheses or solutions

**Trigger:** Automatically activates for complex reasoning tasks, or prompt with "think step by step"

### Context7 MCP Server

Provides real-time, version-specific documentation for libraries and frameworks. Eliminates outdated API references from training data.

**Setup:** User-level MCP server (already configured)

**Trigger:** Add "use context7" to prompts or mention library documentation needs

**Supported Libraries:** Next.js, React, Tailwind, Node.js, Express, and 1000+ others

**When to use:**
- Working with fast-moving frameworks (Next.js, React, etc.)
- Need current API documentation, not training data
- Debugging API usage issues

---

## Quick Auth Check Commands

```bash
# 1. Check ADC (Application Default Credentials)
gcloud auth list

# 2. Check GitHub CLI
gh auth status

# 3. Test GCS access (if using GCP)
gsutil ls gs://YOUR_BUCKET/ | head -3

# 4. Fix ADC if expired
gcloud auth login --update-adc

# 5. Fix GitHub if expired
gh auth login -h github.com -p https -w
```

### Auth Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid_rapt` | ADC token expired | `gcloud auth login --update-adc` |
| `unauthorized_client` | DWD not configured | Check Workspace Admin scopes |
| `insufficient scopes` | Missing scope grant | Add scope in Workspace Admin |
| `PERMISSION_DENIED` | SA lacks IAM role | Grant role in GCP IAM |
| `The token is invalid` | GitHub token expired | `gh auth login -h github.com -p https -w` |

---

## Standard Project Structure

All projects should follow this path convention:

```
~/Projects/PROJECT_NAME/
```

Example:
```
/Users/charleymm/Projects/jl-dev-environment-gm
/Users/charleymm/Projects/glados-ba-reconciliation
/Users/charleymm/Projects/leonnes-prod
```

---

*This global CLAUDE.md applies to all projects. Each project has its own CLAUDE.md with project-specific details.*
