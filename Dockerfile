# Temporary solution freeze NodeJs version https://github.com/vercel/next.js/discussions/69326
# https://github.com/vercel/next.js/issues/69150
FROM node:24-alpine AS builder_root
WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY ui/package.json ui/package.json

RUN corepack use pnpm@10.22.0

RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

FROM builder_root AS builder_ui
WORKDIR /app
COPY ./ui ./ui
COPY --from=builder_root /app/ui/node_modules /app/ui/node_modules

ENV NEXT_TELEMETRY_DISABLED=1

ARG PUBLIC_REPO_NAME
ENV NEXT_PUBLIC_PRODUCT_REPO=$PUBLIC_REPO_NAME

ARG PUBLIC_PRODUCT_NAME
ENV NEXT_PUBLIC_PRODUCT_NAME=$PUBLIC_PRODUCT_NAME

ARG PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$PUBLIC_VERSION

ARG PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=$PUBLIC_ENV

RUN pnpm --filter ui build:ci

# Production image, copy all the files and run next
FROM node:24-slim AS ui
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates curl && update-ca-certificates && apt-get clean

ENV NODE_ENV=PRODUCTION
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

ARG PUBLIC_REPO_NAME
ENV NEXT_PUBLIC_PRODUCT_REPO=$PUBLIC_REPO_NAME

ARG PUBLIC_PRODUCT_NAME
ENV NEXT_PUBLIC_PRODUCT_NAME=$PUBLIC_PRODUCT_NAME

ARG PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$PUBLIC_VERSION

ARG PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=$PUBLIC_ENV

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# cf. https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/.next/standalone /app
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/.next/static /app/.next/static
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/public /app/public
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/public /app

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/next.config.ts /app/next.config.ts
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/package.json /app/package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "/app/server.js"]
