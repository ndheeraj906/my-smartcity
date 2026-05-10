#!/usr/bin/env bash
# -------------------------------------------------
# Deploy My SmartCity to Google Cloud Run
# -------------------------------------------------
# Project: smartcity-deploy-1744
# Region: us-central1
# -------------------------------------------------

PROJECT_ID="smartcity-deploy-1744"
REGION="us-central1"
REPO_NAME="smartcity-repo"

echo "Using Project: $PROJECT_ID in Region: $REGION"

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

# 3. Get Backend URL
BACKEND_URL=$(gcloud run services describe smartcity-backend --platform managed --region "$REGION" --format='value(status.url)' --project="$PROJECT_ID")
echo "Backend URL: $BACKEND_URL"

# 4. Update Frontend Environment
echo "Updating Frontend Environment..."
echo "VITE_API_BASE_URL=$BACKEND_URL" > ./frontend/.env.docker

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
    --project="$PROJECT_ID"

# 7. Get Frontend URL
FRONTEND_URL=$(gcloud run services describe smartcity-frontend --platform managed --region "$REGION" --format='value(status.url)' --project="$PROJECT_ID")
echo "Frontend URL: $FRONTEND_URL"

echo "-------------------------------------------------"
echo "Deployment Complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "-------------------------------------------------"
