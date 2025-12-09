# JL Dev Environment Dashboard

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Local status dashboard for monitoring dev environment health

---

## Quick Start

### One-Click Launch

```bash
# From repo root
./scripts/utils/dashboard.sh
```

This will:
1. Install dependencies (first run only)
2. Start the server on port 3333
3. Open the dashboard in your default browser

### Manual Start

```bash
cd dashboard
npm install  # First time only
npm start
```

Then open: http://localhost:3333

---

## Features

### Real-Time Monitoring

| Section | What It Checks |
|---------|----------------|
| **Runtimes** | Node.js, npm, Java, Python versions |
| **Package Managers** | Homebrew, nvm, SDKMAN installation |
| **DevOps Tools** | Docker (running?), gcloud, gh, git, kubectl |
| **Authentication** | GitHub auth, GCP auth, ADC, project config |
| **AI Integration** | Cursor, Continue config, Claude CLI |
| **Repositories** | Clone status, branch, uncommitted changes |

### Status Indicators

- 🟢 **Green** - All good
- 🟡 **Yellow** - Warning (optional component missing or not running)
- 🔴 **Red** - Error (required component missing or broken)

### Quick Links

Direct links to:
- GitHub repositories
- GCP Console
- Vertex AI Console
- Slack App settings
- Cursor documentation

---

## Configuration

### Custom Port

```bash
DASHBOARD_PORT=8080 ./scripts/utils/dashboard.sh
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DASHBOARD_PORT` | 3333 | Server port |

---

## API Endpoints

The dashboard exposes REST APIs you can use programmatically:

| Endpoint | Description |
|----------|-------------|
| `GET /api/system` | System info (hostname, OS, memory) |
| `GET /api/runtimes` | Runtime versions and status |
| `GET /api/packages` | Package manager status |
| `GET /api/devops` | DevOps tools status |
| `GET /api/auth` | Authentication status |
| `GET /api/repos` | Repository status |
| `GET /api/ai` | AI tools status |
| `GET /api/status` | Full status (all checks combined) |

### Example API Usage

```bash
# Get full status as JSON
curl http://localhost:3333/api/status | jq

# Check if GitHub is authenticated
curl http://localhost:3333/api/auth | jq '.github.authenticated'
```

---

## Architecture

```
dashboard/
├── package.json          # Dependencies
├── server.js             # Express server + health checks
├── public/
│   ├── index.html        # Dashboard UI
│   ├── styles.css        # Dark theme styling
│   └── app.js            # Frontend JavaScript
└── README.md             # This file
```

---

## Extending the Dashboard

### Adding New Checks

1. Add a new API endpoint in `server.js`:
```javascript
app.get('/api/mycheck', (req, res) => {
  // Your check logic
  res.json({ status: 'ok', data: {...} });
});
```

2. Add UI section in `public/index.html`
3. Add data loader in `public/app.js`

### Customizing the Theme

Edit CSS variables in `public/styles.css`:
```css
:root {
  --bg-primary: #0d1117;
  --accent-blue: #58a6ff;
  /* ... */
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3333
lsof -ti:3333 | xargs kill -9

# Or use a different port
DASHBOARD_PORT=8080 ./scripts/utils/dashboard.sh
```

### Dashboard Not Loading

1. Check if server is running: `lsof -i:3333`
2. Check for errors in terminal
3. Try reinstalling: `rm -rf node_modules && npm install`

---

Maintained by: Charley (@charleymm)

