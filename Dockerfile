# syntax=docker/dockerfile:1
#
# Chạm Cội — single-image deploy.
# Build the frontend, then run the Express server that serves both the built
# SPA (dist/) and the /api RAG endpoints on one port.
#
#   docker build -t cham-coi .
#   docker run -p 3001:3001 -e GEMINI_API_KEY=... cham-coi
#
# Without GEMINI_API_KEY the server still starts; /api/chat returns 503.

# ─── base: Node + corepack (pnpm pinned via packageManager field) ───
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ─── stage 1: install ALL deps (needed to build the frontend) ───
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ─── stage 2: build the production frontend ───
FROM deps AS build
COPY . .
RUN pnpm build

# ─── stage 3: install PRODUCTION deps only (smaller runtime image) ───
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ─── final runtime image ───
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3001
# Minimal package metadata for the server.
COPY package.json ./
# Production node_modules (express, @google/generative-ai, dotenv, …).
COPY --from=prod-deps /app/node_modules ./node_modules
# Built frontend served as static SPA.
COPY --from=build /app/dist ./dist
# Backend: RAG engine + corpus + endpoints.
COPY server ./server

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -q --spider http://localhost:${PORT:-3001}/ || exit 1

CMD ["node", "server/index.js"]
