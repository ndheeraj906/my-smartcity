#!/usr/bin/env bash
# -------------------------------------------------
# Deploy My SmartCity to Google Cloud Run
# -------------------------------------------------
# Project: smartcity-deploy-1744
# Region: us-central1
# -------------------------------------------------

PROJECT_ID="smart-city-496909"
REGION="us-central1"
REPO_NAME="smartcity-repo"

echo "Using Project: $PROJECT_ID in Region: $REGION"

# 0. Enable required APIs and setup repository
echo "Enabling required Google Cloud services..."
gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com --project="$PROJECT_ID"

echo "Checking and creating Artifact Registry repository if necessary..."
gcloud artifacts repositories describe "$REPO_NAME" --project="$PROJECT_ID" --location="$REGION" &>/dev/null || \
gcloud artifacts repositories create "$REPO_NAME" --project="$PROJECT_ID" --location="$REGION" --repository-format=docker

# 1. Build & push Backend image
echo "Building Backend..."
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest" ./backend --project="$PROJECT_ID"

# 2. Deploy Backend to Cloud Run
echo "Deploying Backend..."
gcloud run deploy smartcity-backend \
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --project="$PROJECT_ID"

# 3. Get Backend URL & Extract Host
BACKEND_URL=$(gcloud run services describe smartcity-backend --platform managed --region "$REGION" --format='value(status.url)' --project="$PROJECT_ID")
echo "Backend URL: $BACKEND_URL"
BACKEND_HOST=$(echo "$BACKEND_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
echo "Backend Host: $BACKEND_HOST"

# 4. Update Frontend Environment
echo "Updating Frontend Environment..."
echo "VITE_API_BASE_URL=" > ./frontend/.env.docker

# 5. Build & push Frontend image
echo "Building Frontend..."
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest" ./frontend --project="$PROJECT_ID"

# 6. Deploy Frontend to Cloud Run
echo "Deploying Frontend..."
gcloud run deploy smartcity-frontend \
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --project="$PROJECT_ID" \
    --set-env-vars BACKEND_HOST="$BACKEND_HOST"

# 7. Get Frontend URL
FRONTEND_URL=$(gcloud run services describe smartcity-frontend --platform managed --region "$REGION" --format='value(status.url)' --project="$PROJECT_ID")
echo "Frontend URL: $FRONTEND_URL"

echo "-------------------------------------------------"
echo "Deployment Complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "-------------------------------------------------"
