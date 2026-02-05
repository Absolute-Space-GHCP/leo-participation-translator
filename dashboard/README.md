# Participation Translator - Progress Dashboard

A visual progress tracking dashboard for The Participation Translator project.

## Features

- **Overall Progress**: Visual completion percentage across all phases
- **Phase Breakdown**: Expandable sections for each implementation phase
- **Task Tracking**: Complete/In-Progress/Pending status for all tasks
- **Metrics Display**: Documents indexed, vector chunks, creators, media ideas
- **Testing Methodologies**: Full testing plan with coverage areas
- **Real-time Updates**: Edit `tasks.json` to update the dashboard

## Quick Start (Local)

```bash
cd dashboard
node server.js

# Or with custom port
PORT=3334 node server.js
```

Then open http://localhost:8080 (or your custom port)

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/` | Dashboard HTML |
| `/api/tasks` | JSON data for all tasks |
| `/health` | Health check endpoint |

## Deployment to Cloud Run

### Prerequisites

1. Google Cloud CLI installed and authenticated
2. Docker installed
3. GCP project with billing enabled

### Deploy

```bash
# Set your project ID
export GCP_PROJECT_ID=jl-participation-translator

# Run deployment script
./deploy.sh
```

### IAP Configuration (Internal Access Only)

After deployment, configure Identity-Aware Proxy:

1. Go to [IAP Console](https://console.cloud.google.com/security/iap)
2. Enable IAP for the `participation-dashboard` service
3. Add authorized users:
   - Leo (leo@johannesleonardo.com)
   - Charley (charleys@johannesleonardo.com)
   - Maggie (maggie@johannesleonardo.com)
4. Grant "IAP-secured Web App User" role to each user

## Updating Tasks

Edit `tasks.json` to update progress:

```json
{
  "tasks": [
    {
      "id": "p1-1",
      "name": "Task Name",
      "status": "complete",  // complete | in_progress | pending
      "notes": "Additional notes"
    }
  ]
}
```

Then redeploy or restart the server.

## File Structure

```
dashboard/
├── server.js       # Node.js server
├── tasks.json      # Task data (edit to update)
├── package.json    # Dependencies
├── Dockerfile      # Container build
├── deploy.sh       # Cloud Run deployment
└── README.md       # This file
```

## Access

**Authorized Users:**
- Leo (Founder)
- Charley (Developer)
- Maggie (EA)

**Access Method:** Google Workspace SSO via IAP

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-05
