# TODO - Future Development

Version: 1.2.0
Last Updated: 2025-12-09
Purpose: Tracks planned enhancements and future development priorities

Priority Legend: HIGH | MEDIUM | LOW
Status Legend: PENDING | IN_PROGRESS | DONE

---

## ✅ Monitoring Dashboard Fixes (COMPLETED)

Issues resolved for the local monitoring dashboard at `dashboard/`:

| Priority | Task | File | Notes | Status |
|----------|------|------|-------|--------|
| HIGH | Fix hardcoded repo paths | `server.js` | Changed to `~/dev/ai-agents-and-apps-dev/` | ✅ DONE |
| HIGH | Fix internal fetch calls in /api/status | `server.js` | Refactored to direct function calls | ✅ DONE |
| HIGH | Add Quick Link verification | `server.js`, `app.js` | ⚡ Verify Links button + API | ✅ DONE |
| MEDIUM | Fix deprecated kubectl --short flag | `server.js` | Updated to use `-o json` | ✅ DONE |
| MEDIUM | Add version display in header | `index.html` | Shows project version dynamically | ✅ DONE |
| MEDIUM | Organize Quick Links by category | `index.html` | Repos, Cloud & AI, Dev Tools, Docs | ✅ DONE |
| LOW | Add error boundary/fallbacks | `app.js` | Better UI handling when API calls fail | PENDING |
| LOW | Add disk space monitoring | `server.js` | Show available disk space | PENDING |
| LOW | Add CPU/memory usage display | `server.js` | Show system resource usage | PENDING |

### Dashboard Enhancement Ideas (Remaining)

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| MEDIUM | Add health check history | Store last N check results | PENDING |
| LOW | Add dark/light theme toggle | Currently dark only | PENDING |
| LOW | Add notification sounds | Alert on status changes | PENDING |
| LOW | Add export to JSON | Export current status snapshot | PENDING |

---

## Current Project Status

### ✅ Completed Components

| Component | Status | Notes |
|-----------|--------|-------|
| Core documentation | ✅ Done | README, QUICKSTART, BUILD, AUTH, DOCKER |
| Session management | ✅ Done | Archive system with templates |
| Validation script | ✅ Done | 19 checks (includes workspace path) |
| Dashboard v1.2 | ✅ Done | Fixed paths, ⚡ Verify Links, organized Quick Links |
| Docker integration | ✅ Done | Dev container + compose files |
| AI context files | ✅ Done | CLAUDE.md v1.3, PROJECT_GUARDRAILS.md v1.1 |
| GitHub templates | ✅ Done | PR and issue templates |
| Bootstrap script | ✅ Done | One-command setup |
| Link verification | ✅ Done | CLI script + Dashboard button |

### 🟡 Needs Improvement

| Component | Issue | Priority |
|-----------|-------|----------|
| Test coverage | No automated tests | LOW |
| nvm version detection | Sometimes shows "installed" | LOW |

### ⚪ Not Started

| Component | Notes |
|-----------|-------|
| MCP Server | Model Context Protocol for AI |
| Slack slash commands | Interactive bot commands |
| CI/CD pipeline | GitHub Actions automation |
| Architecture diagrams | Visual documentation |

---

## Local Development Infrastructure

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| MEDIUM | MCP Server (Local) | Local Model Context Protocol server | PENDING |
| LOW | Hot-reload dev server | Local Slack bot testing | PENDING |
| LOW | ngrok/Cloudflare tunnel | Expose local dev for webhooks | PENDING |

---

## Slack Bot Enhancements

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| MEDIUM | Slash commands | Interactive dev workflow commands | PENDING |
| LOW | Home tab | Bot home screen with quick actions | PENDING |
| LOW | App mentions | Respond when @DevBot-v3 mentioned | PENDING |

---

## CI/CD and Automation

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| HIGH | GitHub Actions to Slack | Push/PR notifications | PENDING |
| MEDIUM | Deployment notifications | Cloud Run deploy status | PENDING |
| MEDIUM | Build status badges | README badges | PENDING |

---

## AI Integration

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| MEDIUM | Continue + Codebase indexing | Full repo context for AI | PENDING |
| LOW | Gemini function calling | Tool use for bot responses | PENDING |
| LOW | RAG pipeline | Document retrieval for bot | PENDING |

---

## Documentation

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| MEDIUM | Architecture diagram | Visual system overview | PENDING |
| LOW | Video walkthrough | Screen recording of setup | PENDING |
| DONE | Troubleshooting guide | Common issues and solutions | DONE |
| DONE | AI assistant context | CLAUDE.md created | DONE |
| DONE | Project guardrails | PROJECT_GUARDRAILS.md created | DONE |

---

## Infrastructure

| Priority | Task | Notes | Status |
|----------|------|-------|--------|
| LOW | Terraform/Pulumi | Infrastructure as code | PENDING |
| LOW | Secret Manager | Migrate from env vars | PENDING |
| LOW | Monitoring/Alerting | Cloud Monitoring dashboards | PENDING |

---

## Next Steps (Immediate)

1. **Dashboard Fixes** (This Session)
   - [ ] Fix hardcoded repository paths in `server.js`
   - [ ] Refactor `/api/status` to avoid internal HTTP calls
   - [ ] Fix deprecated kubectl flag

2. **Testing**
   - [ ] Test full setup on clean machine
   - [ ] Run validation script
   - [ ] Test all dashboard endpoints

3. **Documentation**
   - [x] Update CLAUDE.md with workspace rules
   - [x] Create PROJECT_GUARDRAILS.md
   - [ ] Update CHANGELOG.md with session changes

---

## Notes

- GitHub Actions Slack notification requires SLACK_WEBHOOK_URL secret
- See docs/AUTH.md for authentication details
- Dashboard runs on port 3333 by default (configurable via DASHBOARD_PORT)

---

Maintained by: Charley (@charleymm)
