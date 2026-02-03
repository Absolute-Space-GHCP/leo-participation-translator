---
name: session-workflow
description: Session management including startup, wrap-up, and handoff procedures. Use when starting a new session, ending a session, creating session logs, or preparing handoff documentation.
---

# Session Workflow Skill

## Session Start Checklist

```
Task Progress:
- [ ] Step 1: Verify workspace
- [ ] Step 2: Check git status
- [ ] Step 3: Review TODO.md priorities
- [ ] Step 4: Check claude-mem status
```

### Step 1: Verify Workspace

```bash
# Confirm correct workspace
pwd
# Expected: /Users/charleymm/Projects/leo-participation-translator

# Verify it's the right project
ls CLAUDE.md PLAN.md TODO.md
```

### Step 2: Check Git Status

```bash
git status
git fetch origin main
git log HEAD..origin/main --oneline  # Check if behind
```

### Step 3: Review Priorities

Read `TODO.md` to identify current priorities and in-progress tasks.

### Step 4: Check Claude-Mem

```bash
curl -s http://127.0.0.1:37777/api/readiness
# Expected: {"status":"ready","mcpReady":true}
```

---

## Session End Checklist

```
Task Progress:
- [ ] Step 1: Update TODO.md
- [ ] Step 2: Create session log
- [ ] Step 3: Commit changes
- [ ] Step 4: Push to remote
- [ ] Step 5: Create handoff
```

### Step 1: Update TODO.md

Mark completed tasks, update progress percentages.

### Step 2: Create Session Log

Create `sessions/SESSION_{DATE}_{VERSION}.md`:

```markdown
# Session Summary: Participation Translator vX.X.X

**Date:** YYYY-MM-DD
**Duration:** X hours

## What Was Done

- [Key accomplishment 1]
- [Key accomplishment 2]

## Files Changed

- `file1.ts` - Description
- `file2.md` - Description

## Next Steps

1. [Priority task 1]
2. [Priority task 2]
```

### Step 3: Commit Changes

```bash
git add -A
git commit -m "feat(vX.X.X): brief description of changes"
```

### Step 4: Push to Remote

```bash
# Archive remote first if it has diverged
git fetch origin main
git log HEAD..origin/main --oneline
# If empty, safe to push
git push origin main
```

### Step 5: Create Handoff

Provide handoff summary in conversation:

```
## Participation Translator Handoff

**Session End**: {datetime}
**Version**: {version}

### What Was Done
- [Key items]

### Current State
- Git: Clean/Dirty
- Phase: 0/1/2/etc

### Next Steps
1. [Priority 1]
2. [Priority 2]

### Quick Commands
npm run dev
npm test
```

---

## Quick Reference Commands

| Task            | Command            |
| --------------- | ------------------ |
| Check workspace | `pwd`              |
| Git status      | `git status`       |
| Run dev server  | `npm run dev`      |
| Run tests       | `npm test`         |
| Build           | `npm run build`    |
| Type check      | `npx tsc --noEmit` |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
