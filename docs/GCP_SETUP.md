# GCP Project Setup Guide

Version: 1.0.1
Last Updated: 2026-02-03
Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)

---

## Overview

This guide covers the Google Cloud Platform setup required for the Participation Translator.

---

## Prerequisites

- GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- Appropriate IAM permissions (Project Creator or Editor)

---

## Step 1: Create Project

```bash
# Create the project
gcloud projects create participation-translator --name="Participation Translator"

# Set as active project
gcloud config set project participation-translator

# Enable billing (replace BILLING_ACCOUNT_ID)
gcloud billing projects link participation-translator --billing-account=BILLING_ACCOUNT_ID
```

---

## Step 2: Enable Required APIs

```bash
# Enable all required APIs
gcloud services enable \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  slides.googleapis.com \
  drive.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com
```

| API                            | Purpose                         |
| ------------------------------ | ------------------------------- |
| `aiplatform.googleapis.com`    | Vertex AI (embeddings, Claude)  |
| `firestore.googleapis.com`     | Session storage, cultural cache |
| `storage.googleapis.com`       | Document storage                |
| `slides.googleapis.com`        | Google Slides generation        |
| `drive.googleapis.com`         | File management                 |
| `secretmanager.googleapis.com` | API key storage                 |
| `cloudbuild.googleapis.com`    | CI/CD                           |
| `run.googleapis.com`           | Deployment                      |

---

## Step 3: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create participation-translator-sa \
  --display-name="Participation Translator Service Account"

# Grant necessary roles
PROJECT_ID=$(gcloud config get-value project)
SA_EMAIL="participation-translator-sa@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

# Create and download key (for local development)
gcloud iam service-accounts keys create ./sa-key.json \
  --iam-account="${SA_EMAIL}"

# Move to secure location (don't commit!)
mv sa-key.json ~/.config/gcloud/participation-translator-sa-key.json
```

---

## Step 4: Set Up Cloud Storage

```bash
# Create buckets
gsutil mb -l us-central1 gs://participation-documents
gsutil mb -l us-central1 gs://participation-exports

# Set lifecycle (optional - auto-delete exports after 90 days)
cat > /tmp/lifecycle.json << 'EOF'
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 90}
    }
  ]
}
EOF

gsutil lifecycle set /tmp/lifecycle.json gs://participation-exports
```

---

## Step 5: Set Up Firestore

```bash
# Create Firestore database (Native mode)
gcloud firestore databases create --location=us-central1

# Database will be created with these collections:
# - generations (blueprint outputs)
# - documents (ingested document metadata)
# - cultural_cache (cached trend data)
```

---

## Step 6: Set Up Vertex AI Vector Search

```bash
# Note: Vector Search index creation is done via API or console
# This is a placeholder - actual setup requires more configuration

# Create index endpoint
gcloud ai index-endpoints create \
  --display-name="jl-knowledge-base-endpoint" \
  --region=us-central1

# Index creation requires:
# 1. Define index schema
# 2. Create index with embeddings
# 3. Deploy index to endpoint
```

**Manual Steps Required:**

1. Go to Vertex AI Console → Vector Search
2. Create Index with:
   - Dimensions: 768
   - Distance measure: DOT_PRODUCT or COSINE
   - Shard size: SMALL (for dev)
3. Deploy index to endpoint
4. Note the endpoint ID for `.env`

---

## Step 7: Store API Keys in Secret Manager

```bash
# Store Anthropic API key
echo -n "your-anthropic-api-key" | \
  gcloud secrets create anthropic-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Store Exa API key (when ready)
echo -n "your-exa-api-key" | \
  gcloud secrets create exa-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Store Perplexity API key (when ready)
echo -n "your-perplexity-api-key" | \
  gcloud secrets create perplexity-api-key \
  --data-file=- \
  --replication-policy="automatic"
```

---

## Step 8: Local Development Setup

Create `.env` file (copy from `.env.example`):

```bash
# GCP
GCP_PROJECT_ID=participation-translator
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/participation-translator-sa-key.json

# Vertex AI
VERTEX_AI_EMBEDDING_MODEL=text-embedding-005
VERTEX_VECTOR_INDEX_ENDPOINT=projects/participation-translator/locations/us-central1/indexEndpoints/YOUR_ENDPOINT_ID

# Storage
GCS_DOCUMENTS_BUCKET=participation-documents
GCS_EXPORTS_BUCKET=participation-exports
```

---

## Verification Checklist

- [ ] Project created and billing enabled
- [ ] All APIs enabled
- [ ] Service account created with correct roles
- [ ] Cloud Storage buckets created
- [ ] Firestore database initialized
- [ ] Vector Search index created (manual step)
- [ ] API keys stored in Secret Manager
- [ ] Local `.env` configured
- [ ] Can authenticate: `gcloud auth application-default login`

---

## Cost Considerations

| Service                 | Estimated Monthly Cost      |
| ----------------------- | --------------------------- |
| Vertex AI Embeddings    | ~$10-50 (depends on volume) |
| Vertex AI Vector Search | ~$50-100 (index hosting)    |
| Cloud Storage           | ~$5 (documents)             |
| Firestore               | ~$5 (reads/writes)          |
| Cloud Run               | ~$10-30 (when deployed)     |

**Total Estimate:** $80-200/month for development/light usage

---

## Next Steps

1. Complete Vector Search index setup (manual)
2. Test embedding generation
3. Ingest first documents
4. Validate retrieval

---

_Note: This guide assumes JL Google Workspace. Adjust project/billing settings as needed._
