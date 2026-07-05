ARG FUMADOCS_VERSION=latest

FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN if [ "$FUMADOCS_VERSION" != "latest" ]; then \
      bun add fumadocs-core@$FUMADOCS_VERSION fumadocs-ui@$FUMADOCS_VERSION @fumadocs/local-md@$FUMADOCS_VERSION; \
    fi
RUN bun install --frozen-lockfile 2>/dev/null || bun install

FROM oven/bun:1
WORKDIR /app

RUN apt-get update && apt-get install -y inotify-tools && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chmod +x /app/entrypoint.sh

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CONTENT_DIR=/content/docs

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
