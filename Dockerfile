# Next.js app image (repo split 2026-11-01: one app per repo, no workspace).
# Usage: docker build -t wire-docs .
FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

# --- deps: cached on the lockfile ---
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# --ignore-scripts: postinstall codegen (docs' fumadocs-mdx) needs the source;
# `next build` runs it in the build stage.
RUN pnpm install --frozen-lockfile --ignore-scripts

# --- build to a standalone bundle ---
FROM base AS build
# NEXT_PUBLIC_* are inlined into the client bundle at BUILD time.
ARG NEXT_PUBLIC_DASHBOARD_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENV
ARG NEXT_PUBLIC_GIT_SHA
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_DASHBOARD_URL=$NEXT_PUBLIC_DASHBOARD_URL \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_SENTRY_ENV=$NEXT_PUBLIC_SENTRY_ENV \
    NEXT_PUBLIC_GIT_SHA=$NEXT_PUBLIC_GIT_SHA \
    SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT=$SENTRY_PROJECT
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The Sentry upload token is a BuildKit secret, never an ARG (ARG values persist
# in layer metadata and the build cache).
RUN --mount=type=secret,id=sentrytoken \
    if [ -s /run/secrets/sentrytoken ]; then export SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentrytoken)"; fi \
 && pnpm install --frozen-lockfile --offline \
 && pnpm build

# --- run: minimal standalone image ---
FROM base AS run
# tzdata so TZ=Asia/Ulaanbaatar resolves (alpine ships no zone database).
RUN apk add --no-cache tzdata
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# The image-optimization cache (.next/cache/images) is created lazily by the
# unprivileged user; the copied layers are root-owned.
RUN mkdir -p .next/cache && chown -R node:node .next
EXPOSE 3000
USER node
CMD ["node", "server.js"]
