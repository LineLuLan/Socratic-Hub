# CLAUDE.md — Socratic Hub Project Conventions

> Đây là file project-level cho Claude Code. Override default behavior khi 
> làm việc trong repo này. Đọc cùng với `~/.claude/skills/_registry.json`.

---

## 🎯 PROJECT CONTEXT (đọc 30 giây)

**Sản phẩm:** Socratic Hub (by Educata) — LMS cho AI Engineer training tại VN  
**Stack chốt:** Next.js 14 + TypeScript + NestJS + Prisma + Postgres + Redis  
**Spec chính:** `docs/SOCRATIC_HUB_BLUEPRINT.md`  
**Progress tracker:** `docs/PROGRESS.md` (single source of truth về state)  
**Workflow rules:** `docs/AUTONOMOUS_BUILD_LOOP_PROMPT.md`  
**Differentiation cốt lõi (KHÔNG được phá):** Socratic AI Tutor + Cloud Sandbox + Outcome-based pricing

---

## 🔧 STACK DECISIONS (đã chốt — KHÔNG thay đổi)

| Layer | Choice | Lý do |
|---|---|---|
| Frontend | Next.js 14 App Router | BLUEPRINT §3.2 |
| Backend | NestJS | BLUEPRINT §3.2 |
| ORM | Prisma | BLUEPRINT §4 (schema đã viết bằng Prisma) |
| Database | Postgres | BLUEPRINT §3.2 |
| Cache/Queue | Redis + BullMQ | BLUEPRINT §3.2, §13 Sprint 3 |
| Styling | Tailwind + shadcn/ui | BLUEPRINT §3.2 |
| Form | react-hook-form + Zod | Standard |
| Auth | **better-auth** | Type-safe, self-hosted, fit JWT+cookie pattern. Quyết định 2026-04-26. |
| Package manager | **pnpm** (qua corepack) | Stable cho Turborepo monorepo. Quyết định 2026-04-26. |
| Database hosting (dev) | **Neon** (managed Postgres) | Máy 16GB RAM nhưng chọn cloud để đỡ tốn local resource cho Next.js+NestJS. Local Postgres giữ làm backup. |
| Redis (dev) | **Defer tới Sprint 4** | Chỉ cần khi build BullMQ. Quyết định cloud (Upstash) hay local sau. |
| Container runtime | **KHÔNG dùng Docker cho M1** | Máy dev không cần Docker. Sandbox dùng WebContainers (StackBlitz). |
| Sandbox approach (M1) | **WebContainers (StackBlitz SDK)** — TypeScript runtime in-browser | Quyết định 2026-04-26. Zero infra, fastest demo. Course AI Agent dạy bằng TypeScript thay Python. Coder OSS K8s defer V2. |
| Sandbox runtime ngôn ngữ | **TypeScript only** (cho M1) | WebContainers chỉ chạy được Node.js stack, không có Python full env. Dạy AI Agent qua TypeScript SDK (Anthropic SDK, Vercel AI SDK, LangChain.js). |
| Monorepo scope (M1) | **2 apps: `apps/web` + `apps/api`** | Quyết định 2026-04-26. Sandbox-orchestrator + tutor-worker logic gộp vào `apps/api` modules cho M1. Tách app riêng khi scale (M2+). |
| Monorepo tool | Turborepo | BLUEPRINT §3.2 |
| LLM Provider mặc định | **Groq (OpenAI-compatible)** với `llama-3.3-70b-versatile` | Quyết định 2026-04-26. Free tier đủ M1 dev + early beta, tốc độ cao (300+ tok/s). |
| LLM Fallback | Claude Sonnet 4.6 | Trigger khi `socraticScore < 0.7` (test bằng promptfoo trong S4-04). Multi-provider routing thêm sau. |

---

## 🎓 PREFERRED SKILLS CHO PROJECT NÀY

> Khi gặp task tương ứng, ưu tiên các skill này. Reference đến 
> `~/.claude/skills/<n>/SKILL.md` để đọc chi tiết.

### Always-on (mọi sprint)
- `pr-writer` + `commit-crafter` — cho PR description và conventional commits
- `testing-toolkit` + `vitest` — cho unit/integration test
- `code-review` — self-review trước khi push
- `verify` / `quality-gate` — chạy local gate

### Sprint 0 (Init)
- `turborepo` + `monorepo-config` — S0-01
- `devops-kit` (Docker/Compose/GitHub Actions) — S0-02, S0-04
- `prisma` + `data-modeling` + `postgresql` — S0-03
- `git-hooks` + `security-toolkit` — S0-05
- `env-vars` — config management

### Sprint 1 (Auth)
- `nestjs` + `authentication` — S1-01..S1-04 (backend)
- `nextjs` + `shadcn-ui` + `forms` + `react-hook-form` + `zod` — S1-05 (frontend)
- `rbac` — S1-04 guard

### Sprint 2 (Course player)
- `nestjs` + `api-toolkit` + `prisma` — S2-01..S2-04
- `nextjs` + `tailwind` — S2-05, S2-06
- (Markdown rendering: code from scratch với react-markdown + DOMPurify, 
  KHÔNG có skill chuyên — đây là decision)

### Sprint 3 (Sandbox) ⚠️ NHIỀU GAP
- `devops-kit` (Docker) + `nestjs` + `http-client` — S3-01, S3-02
- (Coder/Gitpod integration: code from scratch, document trong DECISIONS LOG)
- `ai-sdk` + `openai` + `rate-limiting` + `nodejs` — S3-04 (LLM proxy)
- (LLM proxy gateway pattern: compose từ existing skills, 
  document trong SKILL_EXTRACTION_QUEUE)

### Sprint 4 (Submission + Tutor) ⚠️ DIFFERENTIATION CORE
- `nestjs` + `message-queues` + `redis` — S4-01, S4-02
- `streaming` (SSE) + `ai-sdk` — S4-03
- `prompt-engineering` + `ai-prompts` + `promptfoo` — S4-04 (PARTIAL)
- (Socratic-specific patterns: code from scratch, document kỹ trong 
  DECISIONS LOG — đây sẽ là source cho future skill `socratic-tutor-prompt`)
- `ai-agents` + `prompt-caching` — S4-05
- `nextjs` + `shadcn-ui` + `streaming` — S4-06

### Sprint 5 (Polish)
- `nestjs` + `prisma` — S5-01
- `playwright` + `testing-toolkit` — S5-04

---

## 🚫 SKILLS KHÔNG DÙNG TRONG PROJECT NÀY

Để giảm noise context, KHÔNG load các skills sau khi làm Socratic Hub:

- Affiliate marketing skills (~25): `affiliate-program-search`, `bio-link-deployer`, `funnel-planner`, `niche-opportunity-finder`, `competitor-spy`, etc.
- Stack alternatives đã loại: `astro`, `svelte`, `vue`, `flask`, `django`, `laravel`, `ruby-rails`, `spring-boot`, `golang`, `rust`, `react-native`, `expo`, `htmx`, `solid`, `drizzle` (đã chốt Prisma)
- Animation: `manim*` (BLUEPRINT cấm video > 5 phút trong M1)
- Out-of-scope: `electron`, `wasm`, `agora`, `heretic`, `openviking`, `openclaw`

---

## ⚠️ DECISIONS — CODE FROM SCRATCH (KHÔNG có skill phù hợp)

> Khi gặp các task này, code từ đầu và document patterns vào 
> `docs/SKILL_EXTRACTION_QUEUE.md` để extract skill sau M1.

### CFS-01: Socratic Tutor Prompt + Guardrail (S4-04, S4-05)
- **Lý do code from scratch:** Skill `prompt-engineering` quá generic, không có pattern Socratic-specific.
- **Pattern cần:** System prompt với "no-direct-answer" rule, classifier-as-LLM scoring questionness, regex check code-block leak, context budget 8K.
- **Reference:** BLUEPRINT §7 (chi tiết đầy đủ system prompt + guardrail layer).
- **Post-build action:** extract thành skill `socratic-tutor-prompt`.

### CFS-02: WebContainers Sandbox Integration (S3-01, S3-02, S3-05, S5-02)
- **Approach chốt 2026-04-26:** **WebContainers (StackBlitz SDK)** — không Coder OSS, không Codespaces, không Docker.
- **Lý do code from scratch:** Skill mới chưa có. WebContainers SDK pattern khác hoàn toàn Coder API.
- **Pattern cần:**
  - Mount file system lúc lesson load (starter files từ DB)
  - Spawn process (`npm install`, `tsx index.ts`) qua WebContainer API
  - Snapshot file tree → POST tới `apps/api` để lưu state
  - Restore từ DB khi học viên quay lại lesson
  - Network policy: WebContainers tự sandbox, chỉ allow fetch tới `llm-proxy.educata.io`
- **Reference:** [WebContainers docs](https://webcontainers.io), BLUEPRINT §6 (override §6.2 Coder approach — xem BLUEPRINT §17).
- **Constraint:** TypeScript/Node.js only — KHÔNG có Python. Course design phải fit Node ecosystem (Vercel AI SDK, LangChain.js, Anthropic TS SDK).
- **Post-build action:** extract thành skill `webcontainers-lesson-sandbox`.

### CFS-03: LLM Proxy Gateway (S3-04)
- **Provider chốt 2026-04-26:** **Groq** (default) với endpoint `https://api.groq.com/openai/v1`, model `llama-3.3-70b-versatile`. Anthropic fallback khi cần.
- **Lý do code from scratch:** Combination skill — compose `ai-sdk` + `rate-limiting` + audit logging + provider routing.
- **Pattern cần:**
  - Endpoint: `https://llm-proxy.educata.io/v1/messages` (sandbox client gọi)
  - Auth: header `X-Sandbox-Token` (NOT real provider key)
  - Verify token → resolve user/lesson, check quota
  - Route theo model name: `llama-*` → Groq, `claude-*` → Anthropic (V2)
  - Đếm token, trừ quota, audit log (PII redact)
  - Quota mặc định: 100k tokens/tuần/học viên (BLUEPRINT §6.3)
- **Reference:** BLUEPRINT §6.3 (đã update với Groq, xem §17).
- **Post-build action:** extract thành skill `llm-proxy-gateway`.

### CFS-04: Markdown Safe Rendering (S2-06)
- **Lý do:** Quá đơn giản để cần skill — react-markdown + DOMPurify đủ.
- **Pattern cần:** None — generic pattern.
- **Post-build action:** Có thể document trong `nextjs` skill như sub-pattern, không cần skill riêng.

### CFS-05: VN Payment (M3 — defer)
- **Lý do:** Chưa cần cho M1.
- **Post-build action:** Nghiên cứu khi planning M3, có thể tạo skill `vn-payment`.

---

## 🔑 EXTERNAL DEPENDENCIES & API KEYS

> Quản lý qua `.env` (gitignored), template trong `.env.example`. Quyết định 2026-04-26.

| Dependency | Required by | Status | Notes |
|---|---|---|---|
| `DATABASE_URL` (Neon Postgres) | S0-02 | **Required** từ Sprint 0 | Free tier OK cho M1. Migration sang VN host trước M3. |
| `GROQ_API_KEY` | S3-04 | **Required** từ Sprint 3 | Free tier đủ M1 dev + early beta. Provider mặc định cho LLM proxy. |
| `BETTER_AUTH_SECRET` | S1-01 | **Required** từ Sprint 1 | Random 32+ char string. Rotate trước launch. |
| `ANTHROPIC_API_KEY` | S4-04 (fallback) | Defer Sprint 4 | Chỉ cần khi setup fallback path. |
| `OPENAI_API_KEY` | — | **Defer hoàn toàn** | Không dùng trong M1. |
| `REDIS_URL` (Upstash) | S4-02 | Defer Sprint 4 | Cần khi build BullMQ worker. Cloud (Upstash) hoặc local TBD. |
| GitHub branch protection `main` | S0-04 (CI) | Manual setup pre-S0 | Human setup, Claude không thay đổi. |

---

## 💰 TOKEN BUDGET — Per Sprint (chốt 2026-04-26)

| Sprint | Budget | Rationale |
|---|---|---|
| S0 Init | $5 | 5 features × $1 avg, skill mạnh |
| S1 Auth | $8 | better-auth + nestjs skill có |
| S2 Course | $8 | Course player chuẩn, ít unknown |
| S3 Sandbox | $15 | WebContainers SDK + LLM proxy unknown |
| S4 Tutor | $15 | Socratic prompt iteration risk |
| S5 Polish | $5 | Playwright skill có |
| **M1 Total** | **$56** | Margin $24 trên hard cap $80 |

**Per-feature trip-wire:** bất kỳ feature dự kiến > $5 → DỪNG, review skill mapping trước khi tiếp tục.
**Per-sprint trip-wire:** sprint vượt budget 50% → STOP, review approach.

---

## 🔧 SKILLS CẦN IMPROVE — POST-MVP

Audit identify một số skill quality 3/5 thiếu frontmatter chuẩn. KHÔNG fix bây giờ (tốn thời gian, không block build). Note để sau M1:

- `shadcn-ui` — thêm frontmatter chuẩn
- `zod` — thêm frontmatter chuẩn
- `nodejs` — disambiguation với bun/deno
- `rbac` — thêm NestJS guard example
- `nestjs` — thêm AuthModule end-to-end example (extract từ S1-* sau khi build)
- `prisma` — thêm enum-rich schema example (extract từ S0-03 sau khi build)

---

## 🎓 SKILL EXTRACTION POLICY

**Quy tắc:** KHÔNG tạo skill mới trước khi build. Extract sau khi đã build feature thật.

**Quy trình:**
1. Khi build feature có pattern reusable → ghi vào `docs/SKILL_EXTRACTION_QUEUE.md`
2. Sau mỗi sprint → review queue, identify top 3 candidates
3. Sau M1 done (P6 milestone end) → tạo skill từ code thực tế
4. Skill mới phải có:
   - Frontmatter đầy đủ (name, description, triggers, when_to_use, when_not_to_use)
   - Ít nhất 2 ví dụ extracted từ code thực tế trong project
   - Verification command
5. Register vào `~/.claude/skills/_registry.json`

**Tại sao policy này:**
- Skill viết trước build = theoretical, dễ sai
- Skill viết sau build = pattern đã proven, rút từ kinh nghiệm
- Tiết kiệm 8+ giờ effort không tạo skill premature

---

## 📋 PROTOCOL CHO CLAUDE KHI WORK TRONG REPO NÀY

### Đầu mỗi session:
1. Đọc `docs/PROGRESS.md` — biết đang ở đâu
2. Đọc file này (`CLAUDE.md`) — biết stack + skill preference
3. KHÔNG cần đọc lại toàn bộ BLUEPRINT — chỉ đọc mục liên quan feature

### Khi pick feature:
1. Check feature ID trong PROGRESS Backlog
2. Map skills theo bảng "PREFERRED SKILLS" ở trên
3. Nếu feature thuộc CFS-* → code from scratch + document trong DECISIONS LOG
4. Báo cáo trước khi code: "Feature X dùng skills: [...] hoặc CFS-Y (code from scratch)"

### Sau khi feature done:
1. Update PROGRESS như thường
2. Nếu phát hiện pattern reusable → ghi vào `docs/SKILL_EXTRACTION_QUEUE.md`
3. Format: `[feature-id] pattern X — appears in: [feature-list] — extract effort: S/M/L`

### Khi gặp task không trong skill và không trong CFS-*:
1. DỪNG, hỏi human
2. KHÔNG tự code from scratch nếu không chắc đây là decision đúng

---

## 🚨 RED FLAGS — STOP IMMEDIATELY

Dừng và báo human nếu:
- Phát hiện cần thay đổi stack đã chốt (vd: muốn dùng Drizzle thay Prisma)
- Phát hiện skill `next-auth` vs `better-auth` vs `lucia` chưa có quyết định mà đang code S1-05
- Package manager chưa chốt mà đang setup S0-01
- Phát hiện feature tốn > 30% token hơn estimate ban đầu (có thể dấu hiệu skill miss)
- File extraction queue tăng quá nhanh (>3 entries/feature) — pattern recognition đang gãy

---

**Cập nhật:** 2026-04-26 — sau Pre-build Planning (P1) + 5 decisions chốt
**Maintained by:** human + Claude session
**Version:** 1.1

**Changelog v1.1 (2026-04-26):**
- Sandbox approach chốt: WebContainers (StackBlitz) + TypeScript runtime
- Monorepo M1 scope: 2 apps thôi (web + api), gộp sandbox/tutor logic vào api
- LLM provider mặc định: Groq (`llama-3.3-70b-versatile`), fallback Claude Sonnet
- Thêm section External Dependencies (Neon, Groq required; Anthropic defer; OpenAI skip)
- Thêm section Token Budget per-sprint với trip-wire
- CFS-02 rewrite hoàn toàn cho WebContainers (override Coder OSS)
- CFS-03 specify Groq endpoint + routing pattern
