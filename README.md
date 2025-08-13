# Hotel Al Raha (فندق الراحة)

A production-ready hotel booking web app built with Next.js 14, Prisma and PostgreSQL.

## Setup

```bash
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

## Build

```bash
pnpm build && pnpm start
```

## Test

```bash
pnpm test
pnpm e2e
```

## Docker

```bash
docker-compose up --build
```

Environment variables are documented in `.env.example`.
