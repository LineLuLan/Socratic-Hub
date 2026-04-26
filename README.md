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

```bash
pnpm install
cp .env.example .env   # điền DATABASE_URL (Neon) khi tới S0-02
pnpm dev               # chạy cả apps/web (port 3000) và apps/api (port 4000)
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

## Documentation

- [BLUEPRINT](docs/SOCRATIC_HUB_BLUEPRINT.md) — full executable spec
- [PROGRESS](docs/PROGRESS.md) — task checker + decisions log
- [CLAUDE.md](CLAUDE.md) — project conventions cho AI agent
