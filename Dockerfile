FROM node:22-alpine AS base

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

# Build stage
FROM base AS builder

# Copy source code
COPY apps ./apps
COPY packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm turbo build

# Build packages that need building (if they have build scripts)
WORKDIR /app

FROM node:22-alpine AS server

RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules

WORKDIR /app/apps/server

EXPOSE 4000

CMD ["pnpm", "start"]

# Runtime stage
FROM node:22-alpine AS web

RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/web/.output ./apps/web/.output
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "start"]