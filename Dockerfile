FROM node:20-alpine AS base
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# pnpm --filter still evaluates the workspace; copy all workspace package.json
# files so frozen-lockfile stays consistent with pnpm-lock.yaml importers.
COPY app/au/package.json app/au/package.json
COPY app/cv/package.json app/cv/package.json
COPY app/rm/package.json app/rm/package.json
COPY app/ls/package.json app/ls/package.json

RUN corepack enable \
    && pnpm install --frozen-lockfile --prod=false --filter ./app/cv...

COPY app/cv ./app/cv

WORKDIR /app/app/cv
RUN pnpm build

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build"]
