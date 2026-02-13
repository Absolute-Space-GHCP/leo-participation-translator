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
- [ ] Step 3: Review TASKS.md priorities
- [ ] Step 4: Check claude-mem status
- [ ] Step 5: Validate API keys & services
- [ ] Step 6: Verify dev server (if needed)
```

### Step 1: Verify Workspace

```bash
# Confirm correct workspace
pwd
# Expected: /Users/charleymm/Projects/leo-participation-translator

# Verify it's the right project
ls CLAUDE.md PLAN.md TASKS.md
```

### Step 2: Check Git Status

```bash
git status
git fetch origin main
git log HEAD..origin/main --oneline  # Check if behind
```

### Step 3: Review Priorities

Read `TASKS.md` to identify current priorities and in-progress tasks.

### Step 4: Check Claude-Mem

```bash
curl -s http://127.0.0.1:37777/api/readiness
# Expected: {"status":"ready","mcpReady":true}
```

### Step 5: Validate API Keys & Services

Run these checks to verify all external dependencies are healthy:

```bash
# --- GCP Authentication ---
gcloud auth application-default print-access-token > /dev/null 2>&1 \
  && echo "✅ GCP auth valid" || echo "❌ GCP auth expired — run: gcloud auth login --update-adc"

# --- Exa.ai API Key ---
EXA_KEY=$(grep "EXA_API_KEY" app/.env.local | cut -d'=' -f2)
EXA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" -H "x-api-key: $EXA_KEY" \
  -d '{"query":"test","numResults":1}')
[ "$EXA_STATUS" = "200" ] && echo "✅ Exa.ai key valid" || echo "❌ Exa.ai key INVALID ($EXA_STATUS) — rotate at dashboard.exa.ai"

# --- Tavily API Key ---
TAVILY_KEY=$(grep "TAVILY_API_KEY" app/.env.local | cut -d'=' -f2)
TAVILY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\":\"$TAVILY_KEY\",\"query\":\"test\",\"max_results\":1}")
[ "$TAVILY_STATUS" = "200" ] && echo "✅ Tavily key valid" || echo "❌ Tavily key INVALID ($TAVILY_STATUS) — check app.tavily.com"

# --- Anthropic API Key ---
ANTHROPIC_KEY=$(grep "ANTHROPIC_API_KEY" app/.env.local | cut -d'=' -f2)
ANTHROPIC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://api.anthropic.com/v1/models" \
  -H "x-api-key: $ANTHROPIC_KEY" -H "anthropic-version: 2023-06-01")
[ "$ANTHROPIC_STATUS" = "200" ] && echo "✅ Anthropic key valid" || echo "❌ Anthropic key INVALID ($ANTHROPIC_STATUS)"

# --- Cloud Run (production) ---
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://participation-translator-904747039219.us-central1.run.app/login")
[ "$PROD_STATUS" = "200" ] && echo "✅ Cloud Run healthy" || echo "❌ Cloud Run issue ($PROD_STATUS)"
```

### Step 6: Verify Dev Server (if needed)

```bash
cd app && npx next dev --port 3005
# Verify: curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/api/stats
```

---

## Session End Checklist

```
Task Progress:
- [ ] Step 1: Update TASKS.md
- [ ] Step 2: Create session log
- [ ] Step 3: Commit changes
- [ ] Step 4: Push to remote
- [ ] Step 5: Create handoff
```

### Step 1: Update TASKS.md

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

| Task            | Command                                     |
| --------------- | ------------------------------------------- |
| Check workspace | `pwd`                                       |
| Git status      | `git status`                                |
| Run dev server  | `cd app && npx next dev --port 3005`        |
| Run tests       | `npm test`                                  |
| Build           | `cd app && npm run build`                   |
| Type check      | `cd app && npx tsc --noEmit`                |
| Deploy          | `cd app && gcloud run deploy participation-translator --source . --region us-central1 --project jl-participation-translator` |
| Production URL  | `https://participation-translator-904747039219.us-central1.run.app` |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
