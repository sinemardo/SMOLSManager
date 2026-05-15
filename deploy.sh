#!/bin/sh

set -e

echo "🚀 Deploying SMOLSManager production stack..."

if [ ! -f .env.production ]; then
  echo "⚠️ .env.production not found"
  echo "Creating from template..."
  cp .env.production.example .env.production
  echo "Please edit .env.production before continuing"
  exit 1
fi

echo "📦 Building containers..."
docker compose -f docker-compose.prod.yml build

echo "🗄️ Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete"

echo "Backend:  http://localhost:3000/api/v1/health"
echo "Admin PWA: http://localhost:5173"
echo "Web:      http://localhost:3001"
