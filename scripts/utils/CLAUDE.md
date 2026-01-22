# Utility Scripts - AI Context

This directory contains utility scripts for day-to-day development tasks.

## Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `dashboard.sh` | Launch monitoring dashboard | `./dashboard.sh` |
| `docker-start.sh` | Start Docker Compose services | `./docker-start.sh` |
| `archive-session.sh` | Archive AI chat sessions | `./archive-session.sh "topic"` |
| `slack-notify.sh` | Send Slack webhook notification | `./slack-notify.sh "message"` |
| `verify-links.sh` | Test Quick Links connectivity | `./verify-links.sh` |
| `end-session.ps1` | Windows: End-of-session cleanup | `.\end-session.ps1` |

## Dashboard Script

```bash
# Start dashboard on default port 3333
./dashboard.sh

# Use custom port
DASHBOARD_PORT=8080 ./dashboard.sh
```

## Archive Script

Archives AI chat sessions to `sessions/` directory:

```bash
./archive-session.sh "bug-fix-auth"
# Creates: sessions/2026-01-22_bug-fix-auth/
```

## Slack Notifications

Requires `SLACK_WEBHOOK_AI_SANDBOX` environment variable:

```bash
./slack-notify.sh "Build complete!"
```

---

*Parent: `scripts/` - See `scripts/CLAUDE.md` for full script documentation.*
