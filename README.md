# Socratic Hub

> LMS dạy AI Engineer thực chiến tại Việt Nam — phương pháp Socratic + Cloud Sandbox + Outcome-based pricing. Part of Educata Ecosystem.

**Spec:** `docs/SOCRATIC_HUB_BLUEPRINT.md` · **Progress:** `docs/PROGRESS.md` · **Conventions:** `CLAUDE.md`

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Backend:** NestJS + Prisma + PostgreSQL (Neon dev)
- **Sandbox:** WebContainers (StackBlitz SDK) — TypeScript runtime in-browser
- **LLM:** Groq (`llama-3.3-70b-versatile`) default, Claude Sonnet fallback
- **Monorepo:** Turborepo + pnpm

## Yêu cầu môi trường

- Node.js >= 20 (khuyến nghị 22)
- pnpm >= 10 (qua corepack: `corepack enable && corepack prepare pnpm@10.33.2 --activate`)

## Setup

### 1. Cài deps

```bash
pnpm install
```

### 2. Setup database (Neon Postgres)

1. Tạo account + project tại https://console.neon.tech
2. Copy connection string từ Neon dashboard (dạng `postgresql://user:pass@host/neondb?sslmode=require`)
3. Tạo `.env` từ template:
   ```bash
   cp .env.example .env
   ```
4. Điền `DATABASE_URL` với connection string vừa copy
5. Verify connection:
   ```bash
   pnpm --filter @socratic-hub/api db:check
   # → DB OK: [ { ok: 1 } ]
   ```
6. Apply Prisma schema (S0-02 empty schema, S0-03 sẽ thêm models):
   ```bash
   pnpm --filter @socratic-hub/api prisma:db:push
   ```

⚠️ **Cảnh báo data:** Nếu `prisma db push` báo "drop table X (Y rows)" → DB không phải fresh. KHÔNG dùng `--accept-data-loss` mà chưa verify project Neon đúng. Tạo project Neon mới hoặc dùng schema namespace.

### 3. Chạy dev

```bash
pnpm dev   # chạy cả apps/web (port 3000) và apps/api (port 4000)
```

## Apps

| App | Port | Mô tả |
|---|---|---|
| `apps/web` | 3000 | Frontend Next.js — landing, auth, course player, dashboard |
| `apps/api` | 4000 | Backend NestJS — auth, courses, sandbox, tutor, LLM proxy (gộp module M1) |

## Verify dev mode

```bash
# Terminal 1
pnpm dev

# Terminal 2 — health check
curl http://localhost:4000/health
# → { "status": "ok", "service": "socratic-hub-api", ... }

# Browser
# http://localhost:3000 → Socratic Hub homepage
```

## Scripts (root)

- `pnpm dev` — chạy tất cả apps trong watch mode
- `pnpm build` — build production
- `pnpm lint` — lint tất cả
- `pnpm typecheck` — TypeScript check
- `pnpm test` — chạy test (S0-01: stub, sẽ thêm Sprint 1+)
- `pnpm verify` — full quality gate (lint + typecheck + test + build)

### Database scripts (apps/api)

- `pnpm --filter @socratic-hub/api db:check` — smoke test connection (`SELECT 1`)
- `pnpm --filter @socratic-hub/api prisma:generate` — regenerate Prisma client
- `pnpm --filter @socratic-hub/api prisma:db:push` — apply schema không qua migration (dev only)
- `pnpm --filter @socratic-hub/api prisma:studio` — mở Prisma Studio GUI

## Documentation

- [BLUEPRINT](docs/SOCRATIC_HUB_BLUEPRINT.md) — full executable spec
- [PROGRESS](docs/PROGRESS.md) — task checker + decisions log
- [CLAUDE.md](CLAUDE.md) — project conventions cho AI agent
