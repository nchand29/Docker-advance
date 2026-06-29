# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Production Stage
FROM node:20-alpine

WORKDIR /app


RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app .

USER appuser

EXPOSE 3000

CMD ["npm", "start"]