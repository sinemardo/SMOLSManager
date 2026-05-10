FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/prisma ./prisma/
RUN npx prisma generate

COPY backend/src ./src/

EXPOSE 3000

CMD ["node", "src/server.js"]
