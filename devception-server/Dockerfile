# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Build tools needed to compile native Node addons (mirrors nixpacks.toml)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

# ─── Language runtimes required by taskRunner.service.ts ──────────────────────
# The task runner calls spawnSync('python3', ...) and spawnSync('g++', ...)
# at startup. If these binaries are absent the languages are silently disabled
# and players see "✗ C++ compiler not available on server" / Python errors.
#
# Package sizes on Alpine (compressed):
#   python3  ~50 MB   — needed for Python mini-tasks
#   g++      ~17 MB   — needed for C++ mini-tasks (pulls in gcc + libstdc++)
#   libstdc++ is auto-pulled as a g++ dependency
RUN apk add --no-cache python3 g++ libstdc++

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist/ ./dist/

RUN npm ci --omit=dev --ignore-scripts

# Verify runtimes are present — fail the Docker build loudly if missing
# rather than discovering it at game runtime.
RUN python3 --version && g++ --version && node --version

ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/index.js"]
