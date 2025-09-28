# Base deps
FROM node:22-alpine AS deps
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci

# Build
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
ARG DATABASE_PROVIDER=sqlite
ENV DATABASE_PROVIDER=${DATABASE_PROVIDER}

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Swap to PG if building for prod/docker
RUN if [ "$DATABASE_PROVIDER" = "postgresql" ]; then \
      rm -f src/db/index.ts src/db/schema.ts && \
      cp src/db/pg/client.ts  src/db/index.ts && \
      cp src/db/pg/schema.ts  src/db/schema.ts ; \
    fi

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner
FROM node:22-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
