# Authentication and OAuth Reference

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Documents all OAuth accounts, service connections, and authentication methods.

---

## Quick Reference

| Service | Account | Auth Method |
|---------|---------|-------------|
| GitHub | `<your-github-username>` | gh auth login |
| Google Cloud | `<your-email>@johannesleonardo.com` | gcloud auth login |
| Claude | Anthropic account | claude setup-token |
| Cursor | Cursor Pro Plan | Built-in OAuth |
| Slack | Johannes Leonardo workspace | Slack App OAuth |

---

## GitHub

- Username: `<your-github-username>`
- Organization: `<company-github-org>`
- Repositories: jl-dev-environment-gm-v1.0, ai-agents-gmaster-build

### Setup

```bash
gh auth login
# Select: GitHub.com → HTTPS → Yes → Login with web browser
gh auth status  # Verify
```

---

## Google Cloud Platform

- Email: `<your-email>@johannesleonardo.com`
- Project: `<gcp-project-id>`
- Region: us-central1 (default), global (Gemini 3)
- ADC File: ~/.config/gcloud/application_default_credentials.json

### Setup

```bash
gcloud auth login
gcloud config set project <gcp-project-id>
gcloud auth application-default login --project=<gcp-project-id>
```

---

## Gemini Models

Available models (via Vertex AI):

| Model | Endpoint | Region |
|-------|----------|--------|
| gemini-3-pro-preview | Vertex AI | global |
| gemini-2.5-pro | Vertex AI | us-central1 |
| gemini-2.5-flash | Vertex AI | us-central1 |

---

## Claude (Anthropic)

- Subscription: Claude Pro/Max via Cursor Pro Plan
- Config: ~/.claude.json
- Default Model: Opus 4.5

### Setup

```bash
# Via Cursor extension (recommended)
Cmd+Shift+P → "Claude Code: Setup"

# Or via CLI
claude setup-token
```

---

## Cursor IDE

- Plan: Cursor Pro (recommended)
- Available Models: Opus 4.5, Sonnet 4.5, Gemini 3 Pro, GPT-5.1

### Setup

1. Download from https://cursor.sh
2. Sign in with your account
3. Upgrade to Pro for full AI access

---

## Slack

- Workspace: Johannes Leonardo
- App: DevBot-v3
- Channel: `#ai-v3-sandbox` (or your team channel)

### Setup

1. Get invited to the Slack workspace
2. Request access to the DevBot app
3. Configure webhook URL in `.env`

---

## Security Notes

1. **Never commit credentials** to version control
2. Use `.env` files for local secrets (gitignored)
3. Use GitHub Secrets for CI/CD credentials
4. Rotate tokens periodically
5. Use short-lived credentials when possible

---

## Environment Variables Template

Copy to `.env` and fill in your values:

```bash
# GitHub (usually not needed - use gh auth)
# GITHUB_TOKEN=<your-token>

# Google Cloud (usually not needed - use gcloud auth)
# GCP_PROJECT_ID=<project-id>

# Slack
SLACK_WEBHOOK_URL=<your-webhook-url>
```

---

Maintained by: JL Engineering Team
