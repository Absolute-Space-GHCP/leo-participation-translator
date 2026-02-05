#!/bin/bash
# ============================================================================
# deploy.sh
# Deploy Participation Translator Dashboard to Cloud Run with IAP
# ============================================================================
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
# Created: 2026-02-05
# ============================================================================

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-jl-participation-translator}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="participation-dashboard"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🎯 Deploying Participation Translator Dashboard"
echo "   Project: ${PROJECT_ID}"
echo "   Region: ${REGION}"
echo "   Service: ${SERVICE_NAME}"
echo ""

# Step 1: Build Docker image
echo "📦 Building Docker image..."
docker build -t ${IMAGE_NAME} .

# Step 2: Push to Container Registry
echo "📤 Pushing to Container Registry..."
docker push ${IMAGE_NAME}

# Step 3: Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --timeout 60 \
  --no-allow-unauthenticated

# Step 4: Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format 'value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo "   URL: ${SERVICE_URL}"
echo ""
echo "📝 Next steps for IAP configuration:"
echo ""
echo "1. Enable IAP in Google Cloud Console:"
echo "   https://console.cloud.google.com/security/iap?project=${PROJECT_ID}"
echo ""
echo "2. Add authorized users (Leo, Charley, Maggie):"
echo "   - Go to IAP settings for ${SERVICE_NAME}"
echo "   - Click 'Add Principal'"
echo "   - Add each user's email with 'IAP-secured Web App User' role"
echo ""
echo "3. Configure OAuth consent screen if not already done:"
echo "   https://console.cloud.google.com/apis/credentials/consent?project=${PROJECT_ID}"
echo ""
echo "4. Access the dashboard at: ${SERVICE_URL}"
echo "   (Users will be prompted to sign in with their JL Google account)"
