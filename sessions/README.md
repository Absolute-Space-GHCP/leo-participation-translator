# Session Archives

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Archive of AI chat sessions for knowledge preservation and reference

---

## Overview

This folder contains archived transcripts and summaries of AI-assisted development sessions. These serve as:

- **Knowledge base** - Decisions, solutions, and context
- **Audit trail** - What was done and why
- **Onboarding resource** - New team members can learn from past sessions
- **Continuity** - Resume work after interruptions

---

## Quick Archive (End of Session)

```bash
# From repo root
./scripts/utils/archive-session.sh "brief-topic-description"

# Example
./scripts/utils/archive-session.sh "gcp-auth-setup"
```

This will:
1. Create a dated file: `sessions/2025-12-08_gcp-auth-setup.md`
2. Open it in your default editor
3. Prompt you to paste/edit the session content
4. Commit and push to GitHub

---

## Manual Archive

1. Copy `SESSION_TEMPLATE.md` to a new file:
   ```bash
   cp sessions/SESSION_TEMPLATE.md sessions/$(date +%Y-%m-%d)_topic-name.md
   ```

2. Fill in the template with session details

3. Commit and push:
   ```bash
   git add sessions/
   git commit -m "docs(sessions): archive session - topic-name"
   git push
   ```

---

## File Naming Convention

```
YYYY-MM-DD_brief-topic-description.md
```

Examples:
- `2025-12-08_initial-environment-setup.md`
- `2025-12-08_gemini-integration.md`
- `2025-12-09_slack-bot-debugging.md`

---

## What to Include

### Always Include
- Date and approximate duration
- AI assistant used (Claude, Gemini, etc.)
- Main topics/goals
- Key decisions made
- Files created/modified
- Commands run
- Problems solved

### Optional
- Full chat transcript (for complex sessions)
- Screenshots
- Links to related issues/PRs

---

## Template Sections

| Section | Purpose |
|---------|---------|
| Metadata | Date, duration, AI model |
| Summary | 2-3 sentence overview |
| Goals | What you set out to accomplish |
| Outcomes | What was actually accomplished |
| Key Decisions | Important choices and rationale |
| Files Changed | List of created/modified files |
| Commands | Notable commands run |
| Follow-ups | Action items for next session |
| Transcript | Full or partial chat log |

---

## Tips

1. **Archive immediately** - Don't wait; context fades fast
2. **Be specific** - Future you will thank present you
3. **Include rationale** - Not just what, but why
4. **Link related sessions** - Build a knowledge graph
5. **Tag with keywords** - Makes searching easier

---

## Searching Archives

```bash
# Search all sessions for a keyword
grep -r "keyword" sessions/

# Find sessions by date
ls sessions/2025-12-*

# Find sessions by topic
ls sessions/*slack*
```

---

Maintained by: Charley (@charleymm)

