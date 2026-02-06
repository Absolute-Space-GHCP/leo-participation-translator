# Project Guardrails

Version: 1.0.0
Last Updated: 2026-02-06

---

## Purpose

Hard constraints for The Participation Translator. These are non-negotiable rules that protect the project's quality, security, and strategic alignment.

---

## 1. Security

| Rule | Detail |
|---|---|
| **No hardcoded secrets** | All API keys in GCP Secret Manager. Never in source, docs, or env files committed to git. |
| **No PII in outputs** | Check generated blueprints for emails, phone numbers, SSNs before export. |
| **SA keys never committed** | `sa-key.json` and all credential files are gitignored. |
| **Rotate exposed keys immediately** | If a key appears in git history, rotate it and disable the old version. |

---

## 2. Quality

| Rule | Detail |
|---|---|
| **TypeScript only** | No plain JavaScript in `src/`. All new code is TypeScript. |
| **ESM with `.js` extensions** | All import specifiers include `.js` extension for strict ESM compliance. |
| **No `any` type** | Use `unknown` and type narrowing. |
| **Explicit return types** | All exported functions declare their return type. |
| **Error handling on external calls** | All API calls (Claude, Exa, Tavily, Firestore) wrapped in try/catch. |

---

## 3. Architecture

| Rule | Detail |
|---|---|
| **Single source of truth** | Version number lives in `package.json`. All other files reference it. |
| **Secrets via `src/lib/secrets/`** | All external API keys fetched through the secrets module. No `process.env` for API keys in production code. |
| **Model selection via task router** | Never hardcode a Claude model in business logic. Use `src/lib/router/task-router.ts`. |
| **Framework is invisible** | Output must never expose the 9-section structure. Seamless narrative only. |
| **No wrong-project artifacts** | This repo contains ONLY Participation Translator content. No jl-dev-environment-gm, glados, or leonnes-prod files. |

---

## 4. Data

| Rule | Detail |
|---|---|
| **PPTX files not committed** | Large presentation files stay in `data/presentations/` (gitignored). |
| **Markdown conversions committed** | Converted `.md` versions go in `data/markdown/` for version control. |
| **Vector store is append-only** | Don't delete indexed documents without explicit approval. |
| **Cultural data is ephemeral** | Trend data has a TTL. Don't treat cached cultural results as permanent. |

---

## 5. Process

| Rule | Detail |
|---|---|
| **Conventional commits** | `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:` |
| **Session logs required** | Every session creates a log in `sessions/`. |
| **Archive before destructive git ops** | Pre-commit and pre-push backups per `git-operations.mdc`. |
| **Leo is the end user** | UX decisions optimize for Leo's workflow. Simple, fast, strategic. |
| **High visibility project** | Quality over speed. Every output reflects on the team. |

---

## 6. AI Assistants

| Rule | Detail |
|---|---|
| **Read CLAUDE.md first** | Every session starts by reading project context. |
| **Authorship attribution** | All files include author + AI co-author credit. |
| **Don't trust LLM output** | Validate/sanitize Claude responses before using in file paths, queries, or exports. |
| **Delegate to specialized agents** | Use the right agent for the task (see `.cursor/rules/agents.mdc`). |

---

## Enforcement

These guardrails are enforced by:
- `.cursor/rules/` — AI assistant rules (always applied)
- `.gitignore` — prevents committing secrets and large files
- Code review — manual verification before merge
- `src/lib/secrets/` — runtime enforcement of secret management

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-06
