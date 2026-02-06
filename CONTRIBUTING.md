# Contributing to The Participation Translator

Version: 1.0.0
Last Updated: 2026-02-06

---

## Overview

The Participation Translator is an internal JL tool. Contributions come from the development team and AI coding assistants (Claude, Cursor).

---

## Getting Started

1. Read `CLAUDE.md` — project context and conventions
2. Read `PLAN.md` — implementation roadmap and current phase
3. Read `TASKS.md` — immediate priorities
4. Set up your environment per `docs/QUICKSTART.md`

---

## Development Workflow

### Branch Strategy

```bash
# Feature work
git checkout -b feat/description

# Bug fixes
git checkout -b fix/description

# Documentation
git checkout -b docs/description
```

### Commit Conventions

Use conventional commits:

| Prefix | Use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `chore:` | Build, config, tooling |
| `refactor:` | Code restructuring (no behavior change) |
| `test:` | Tests only |

**Examples:**

```
feat: add Secret Manager integration for API keys
fix: resolve ESM import extension errors in learning module
docs: replace wrong-project docs with participation-translator content
chore: update dependencies and model references
```

---

## Code Standards

### TypeScript

- **ES Modules** — all imports use `.js` extensions
- **Explicit return types** on all exports
- **No `any`** — use `unknown` and narrow
- **Top-level `function`** declarations (not arrow functions)
- **kebab-case** filenames, **PascalCase** classes, **camelCase** functions

### File Headers

Every file needs an authorship header:

```typescript
/**
 * @file filename.ts
 * @description Brief description
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created YYYY-MM-DD
 * @updated YYYY-MM-DD
 */
```

### Import Order

```typescript
// 1. Node built-ins
import { readFile } from 'fs/promises';

// 2. External packages
import { Firestore } from '@google-cloud/firestore';

// 3. Internal (absolute)
import { KnowledgeGraph } from '@/lib/memory/knowledge-graph.js';

// 4. Relative
import { parseDocument } from './parsers.js';
import type { ChunkMetadata } from './types.js';
```

See `.cursor/rules/coding-standards.mdc` for the complete reference.

---

## API Keys & Secrets

- **Never hardcode API keys** in source code or documentation
- All external keys go in **GCP Secret Manager**
- Add the mapping to `src/lib/secrets/index.ts` → `SECRET_MAP`
- `.env` is for local dev fallbacks only (and is gitignored)

---

## Documentation

- Keep docs in `docs/` for technical references
- Session logs go in `sessions/`
- Update `TASKS.md` when completing work
- Update `PLAN.md` when phase status changes

---

## Testing

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # With coverage
```

Framework: **Vitest**

---

## Before Submitting

- [ ] Code compiles: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] No hardcoded keys or secrets
- [ ] Authorship header on new files
- [ ] Import paths include `.js` extensions
- [ ] `TASKS.md` updated if applicable

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-06
