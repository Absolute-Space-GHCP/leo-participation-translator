# Dashboard - AI Context

This directory contains the local monitoring dashboard for the JL Dev Environment.

## Purpose

Real-time monitoring of development environment health including:
- Runtime versions (Node.js, Java, Python)
- Package managers (Homebrew, nvm, SDKMAN)
- DevOps tools (Docker, gcloud, gh)
- Authentication status (GitHub, GCP)
- AI tool status (Cursor, Continue, Claude)

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Express server with health check endpoints |
| `public/index.html` | Dashboard UI |
| `public/app.js` | Frontend JavaScript |
| `public/styles.css` | Dark theme styling |

## Running

```bash
# From repo root
./scripts/utils/dashboard.sh

# Or manually
cd dashboard && npm install && npm start
```

**URL:** http://localhost:3333

## API Endpoints

- `GET /api/status` - Full status JSON
- `GET /api/runtimes` - Runtime versions
- `GET /api/auth` - Authentication status

---

*See `dashboard/README.md` for full documentation.*
