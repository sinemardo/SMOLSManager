#!/bin/bash
# SMOLSManager - Deploy Script

echo "🚀 Desplegando SMOLSManager..."

# Backend
echo "📦 Construyendo backend..."
cd backend
npm ci
npx prisma generate
npx prisma db push
cd ..

# PWA
echo "🎨 Construyendo PWA..."
cd admin-pwa
npm ci
npm run build
cd ..

# Web pública
echo "🌐 Construyendo Web..."
cd web
npm ci
npm run build
cd ..

echo "✅ Deploy listo!"
echo "Backend: node backend/src/server.js"
echo "PWA: npx serve admin-pwa/dist"
echo "Web: npx serve web/.next"
