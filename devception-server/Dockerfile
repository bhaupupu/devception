# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
# Use Node 22 LTS (Iron) for building. Alpine keeps the image lean.
FROM node:22-alpine AS builder

# Install build tools needed for native addons (e.g. bcrypt, canvas).
# python3 + make + g++ mirror what nixpacks.toml installs on Railway.
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first to leverage Docker layer cache.
# Dependencies are only reinstalled when package*.json changes.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
# Separate stage: no dev-dependencies, no source code, minimal attack surface.
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist/ ./dist/

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts

# Render/Railway inject PORT at runtime; default to 4000 for local Docker use
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

# Use the compiled JS entrypoint (not ts-node) — consistent with Railway + Render
CMD ["node", "dist/index.js"]
