FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN corepack enable \
    && pnpm install --no-frozen-lockfile

COPY . ./
RUN pnpm build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

USER node
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build"]
