# Authentication & Credentials Guide

Version: 1.0.0
Last Updated: 2026-02-06

---

## Overview

The Participation Translator uses Google Cloud Platform for all backend services. Authentication follows a layered approach:

| Environment | Auth Method | API Keys |
|---|---|---|
| **Local Dev** | Application Default Credentials (ADC) | `.env` fallback |
| **Cloud Run** | Service Account (attached) | Secret Manager |
| **CI/CD** | Service Account Key | Secret Manager |

---

## Local Development

### Step 1: Authenticate with GCP

```bash
# Login and update Application Default Credentials
gcloud auth login --update-adc

# Set the project
gcloud config set project participation-translator

# Verify
gcloud auth list
```

This creates credentials at `~/.config/gcloud/application_default_credentials.json` that all GCP SDKs use automatically.

### Step 2: API Keys

External API keys (Exa.ai, Tavily) are stored in **GCP Secret Manager**. The app reads them automatically via `src/lib/secrets/index.ts`.

**If Secret Manager is unreachable locally** (no service account), set fallback env vars in `.env`:

```bash
EXA_API_KEY=<your-key>
TAVILY_API_KEY=<your-key>
```

### Resolution Order

The secrets module (`src/lib/secrets/index.ts`) resolves keys in this order:

1. **In-memory cache** — avoids repeat network calls
2. **GCP Secret Manager** — encrypted, IAM-controlled (production path)
3. **Environment variable** — `.env` file fallback (local dev convenience)

---

## Secret Manager

### Current Secrets

| Secret ID | Logical Name | Used By |
|---|---|---|
| `exa-api-key` | `EXA_API_KEY` | `src/lib/cultural/exa.ts` |
| `tavily-api-key` | `TAVILY_API_KEY` | `src/lib/cultural/tavily.ts` |

### Managing Secrets

```bash
# List all secrets
gcloud secrets list --project=participation-translator

# View versions
gcloud secrets versions list <secret-id> --project=participation-translator

# Rotate a key (add new version)
echo -n "NEW_KEY_VALUE" | gcloud secrets versions add <secret-id> \
  --data-file=- --project=participation-translator

# Disable old version
gcloud secrets versions disable <version-number> \
  --secret=<secret-id> --project=participation-translator

# Add a new secret
echo -n "key-value" | gcloud secrets create new-secret-id \
  --project=participation-translator \
  --replication-policy="automatic" \
  --data-file=-

# Grant service account access
gcloud secrets add-iam-policy-binding new-secret-id \
  --project=participation-translator \
  --member="serviceAccount:participation-translator-sa@participation-translator.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Then add the mapping in `src/lib/secrets/index.ts` → `SECRET_MAP`.

---

## Service Account

| Property | Value |
|---|---|
| **Email** | `participation-translator-sa@participation-translator.iam.gserviceaccount.com` |
| **Project** | `participation-translator` |

### Assigned Roles

| Role | Purpose |
|---|---|
| `roles/aiplatform.user` | Vertex AI (Claude, embeddings) |
| `roles/datastore.user` | Firestore read/write |
| `roles/storage.objectAdmin` | Cloud Storage buckets |
| `roles/secretmanager.secretAccessor` | Read secrets |

### Using SA Locally (Optional)

```bash
# Download key (only if ADC doesn't work)
gcloud iam service-accounts keys create ./sa-key.json \
  --iam-account=participation-translator-sa@participation-translator.iam.gserviceaccount.com

# Set in environment
export GOOGLE_APPLICATION_CREDENTIALS=./sa-key.json
```

> **Never commit `sa-key.json`** — it's in `.gitignore`.

---

## Production (Cloud Run)

Cloud Run services use the attached service account automatically — no key files needed.

```bash
gcloud run deploy participation-translator \
  --service-account=participation-translator-sa@participation-translator.iam.gserviceaccount.com \
  --region=us-central1
```

The service account's IAM roles grant access to all needed GCP services. Secret Manager keys are fetched at runtime.

---

## Claude on Vertex AI

Claude is accessed via the Anthropic Vertex SDK, which uses GCP credentials (not an Anthropic API key):

```typescript
import AnthropicVertex from '@anthropic-ai/vertex-sdk';

// Uses ADC or GOOGLE_APPLICATION_CREDENTIALS automatically
const client = new AnthropicVertex({
  region: 'us-east5',
  projectId: 'participation-translator',
});
```

| Model | Identifier | Use |
|---|---|---|
| Claude Opus 4.6 | `claude-opus-4-20250514` | Blueprint generation, complex reasoning |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | Sentiment analysis, simpler tasks |
| Claude Haiku 3.5 | `claude-3-5-haiku-20241022` | Metadata extraction, lightweight tasks |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `Reauthentication failed` | `gcloud auth login --update-adc` |
| `Permission denied` on Firestore | Check SA has `roles/datastore.user` |
| `Secret not found` | Verify secret exists: `gcloud secrets list` |
| `Could not load default credentials` | Run `gcloud auth application-default login` |
| Claude returns 403 | Ensure SA has `roles/aiplatform.user` and Claude is enabled in region |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-06
