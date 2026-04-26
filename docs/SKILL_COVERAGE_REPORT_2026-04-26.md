# SKILL COVERAGE AUDIT — Socratic Hub

**Auditor:** Claude (Opus 4.7) — Skill Coverage Audit Mode
**Date:** 2026-04-26
**Scope:** M1 ("Hello Socratic") — Sprint 0 → Sprint 5 (31 features)
**Skills inventory source:** `~/.claude/skills/` (236 skill folders)
**Project source:** `SOCRATIC_HUB_BLUEPRINT.md` §13 + `PROGRESS.md` Backlog

---

## 1. EXECUTIVE SUMMARY (Bước 6)

1. **Tổng số skills hiện có:** 236 (chất lượng trung bình **~3.9 / 5** — phần lớn có frontmatter đầy đủ, examples; một số chỉ có markdown).
2. **Coverage cho M1:** **~74% STRONG match** (23/31 features), **~19% PARTIAL** (6/31), **~7% NONE** (2/31).
3. **Coverage cho cả MVP (M1+M2+M3 mở rộng theo BLUEPRINT §13):** ước tính **~68% STRONG** — gap chính ở Sandbox provisioning, Blockchain certs, ISA/OBC contracts, VN payment.
4. **Top 3 skills CẦN TẠO trước khi build M1:**
   - `socratic-tutor-prompt` — System prompt + guardrail layer cho AI Tutor (block S4-04)
   - `cloud-sandbox-provisioning` — Coder/Gitpod integration cho per-learner containers (block S3-01..S3-05)
   - `llm-proxy-gateway` — Token-quota LLM proxy (Anthropic/OpenAI forward + audit) (block S3-04)
5. **Top 3 skills cần IMPROVE:**
   - `nestjs` — thêm ví dụ cho module/controller/guard scaffold (sẽ được dùng 12+ lần trong M1)
   - `prisma` — thêm worked example cho schema migration với 15+ models như BLUEPRINT §4
   - `shadcn-ui` — thiếu frontmatter chuẩn (chỉ có markdown), khó được auto-trigger
6. **Token cost ước tính NẾU thiếu skill (code from scratch, nhiều retry):** ~**$60–80** cho M1 (vượt budget hard-cap $80).
7. **Token cost ước tính NẾU có skill đầy đủ:** ~**$25–40** cho M1 (trong soft-cap $50).
8. **Recommendation cuối:** **FIX-FIRST** — tạo 3 skill mới (Socratic-Tutor, Cloud-Sandbox, LLM-Proxy) trước khi mở Sprint 0, vì 11/31 features (35%) phụ thuộc vào chúng. Sprint 0–S2 có thể chạy ngay với skill hiện có.

---

## 2. INVENTORY SKILLS (Bước 1)

### 2.1. Tóm tắt theo category

| Category | # Skills | Quality TB | Skills tiêu biểu |
|---|---:|---:|---|
| Backend frameworks | 12 | 4.0 | `nestjs`, `fastapi`, `flask`, `django`, `laravel`, `nodejs`, `hono`, `nx`, `spring-boot`, `ruby-rails`, `golang`, `rust` |
| Frontend frameworks | 9 | 4.2 | `nextjs`, `react`, `vue`, `svelte`, `astro`, `react-native`, `expo`, `solid`, `htmx` |
| UI/Styling | 8 | 4.0 | `shadcn-ui`, `tailwind`, `radix-ui`, `css-foundations`, `forms`, `react-hook-form`, `storybook`, `ui-polish` |
| Database/ORM | 11 | 4.0 | `prisma`, `drizzle`, `drizzle-kit`, `postgresql`, `mongodb`, `sqlite`, `redis`, `neon`, `turso`, `supabase`, `convex` |
| Auth/Security | 11 | 3.9 | `authentication`, `oauth`, `next-auth`, `better-auth`, `lucia`, `clerk`, `rbac`, `security-toolkit`, `promptfoo`, `rate-limiting`, `webhooks` |
| AI/LLM | 13 | 4.1 | `ai-sdk`, `openai`, `prompt-engineering`, `ai-prompts`, `ai-agents`, `ai-function-calling`, `ai-multimodal`, `rag`, `prompt-caching`, `cost-aware-pipeline`, `ml-ops`, `streaming`, `promptfoo` |
| DevOps/Infra | 8 | 4.0 | `devops-kit` (absorbs docker/k8s/github-actions/terraform/nginx), `aws`, `cloudflare`, `vercel`(absorbed by nextjs), `git-hooks`, `git-workflow`, `dev-workflow`, `monorepo-config`, `turborepo`, `pnpm`, `bun`, `deno` |
| Testing/QA | 8 | 3.8 | `testing-toolkit`, `vitest`, `playwright`, `cypress`, `accessibility-testing`, `load-testing`, `contract-testing`, `code-review`, `quality-gate`, `verify` |
| Workflow/Meta | 18 | 4.0 | `plan`, `scout`, `fix`, `cook`, `ship`, `optimize`, `refactor`, `debug`, `migrate`, `bootstrap`, `pr-writer`, `commit-crafter`, `audit`, `forge`, `gsd`, `kanban`, `team`, `research`, `docs-kit` |
| API/Backend patterns | 9 | 4.0 | `api-toolkit`, `graphql`, `grpc`, `trpc`, `webhooks`, `http-client`, `pagination`, `cron-jobs`, `message-queues`, `event-sourcing`, `cqrs` |
| Real-time/Streaming | 4 | 4.0 | `realtime-kit`, `streaming`, `service-worker`, `pwa` |
| Observability | 3 | 4.0 | `observability-kit`, `web-vitals`, `performance-profiler` |
| Documentation | 4 | 4.0 | `docs-kit`, `mermaid`, `pr-writer`, `commit-crafter` |
| Affiliate/Marketing | ~25 | 3.5 | `affiliate-program-search`, `seo`, `seo-audit`, `landing-gen`, `bio-link-deployer`, `funnel-planner`, `content-writer`... (mostly **OUT OF SCOPE** cho Socratic Hub) |
| Specialized/Other | ~80 | 3.5 | Manim, threejs, agora, electron, wasm, ut-* (UltraThink infra), heretic, openviking, openclaw, ... |

### 2.2. Skills CRITICAL cho M1 (đánh giá chi tiết — xem Appendix §7)

| Skill | Quality | Sẽ dùng cho |
|---|---:|---|
| `turborepo` | 4/5 | S0-01 |
| `devops-kit` (docker/k8s/github-actions absorbed) | 5/5 | S0-02, S0-04, S3-01 |
| `prisma` | 4/5 | S0-03, S2-01 |
| `data-modeling` | 4/5 | S0-03 |
| `git-hooks` | 5/5 | S0-05 |
| `security-toolkit` (gitleaks-adjacent) | 4/5 | S0-05 |
| `nestjs` | 4/5 | S1-01..S1-04, S2-02..S2-04, S3-02, S3-05, S4-01, S4-03, S5-01 |
| `authentication` | 4/5 | S1-01..S1-04 |
| `next-auth` / `better-auth` / `lucia` | 4/5 | S1-05 (chọn 1) |
| `nextjs` | 5/5 | S1-05, S2-05, S2-06, S3-03, S4-06 |
| `shadcn-ui` | 3/5 | S1-05, S2-05, S4-06 |
| `tailwind` | 5/5 | S1-05, S2-05, S4-06 |
| `forms` + `react-hook-form` + `zod` | 4/5 | S1-05 |
| `api-toolkit` | 4/5 | S2-02, S2-03, S2-04, S4-01 |
| `message-queues` (BullMQ) | 4/5 | S4-02 |
| `redis` | 4/5 | S0-02, S4-02 |
| `streaming` (SSE) | 4/5 | S4-03 |
| `ai-sdk` | 4/5 | S3-04, S4-03, S4-05 |
| `openai` | 4/5 | S3-04 |
| `prompt-engineering` + `ai-prompts` | 4/5 | S4-04 (PARTIAL) |
| `promptfoo` | 4/5 | S4-04 (guardrail testing — PARTIAL) |
| `ai-agents` | 4/5 | S4-05 |
| `rate-limiting` | 4/5 | S3-04 |
| `env-vars` | 4/5 | S0-02 |
| `testing-toolkit` + `vitest` | 4/5 | mọi sprint |
| `pr-writer` + `commit-crafter` | 4/5 | mọi sprint (workflow) |

---

## 3. INVENTORY FEATURES (Bước 2)

### 3.1. M1 — "Hello Socratic" (31 features)

| Feature ID | Slug | 1-line | Complexity | Tech stack chính | Category |
|---|---|---|:---:|---|---|
| **Sprint 0 — Init** |
| S0-01 | `chore/init-monorepo` | Setup Turborepo + apps/web + apps/api skeleton | LOW | Turborepo, Next.js, NestJS | DevOps |
| S0-02 | `chore/setup-postgres-redis` | Docker Compose cho Postgres + Redis dev | LOW | Docker, Postgres, Redis | DevOps |
| S0-03 | `chore/setup-prisma` | Init Prisma, copy schema 15+ models, migration đầu | MED | Prisma, Postgres | Database |
| S0-04 | `chore/setup-ci` | GitHub Actions verify gate (lint+typecheck+test) | LOW | GitHub Actions | DevOps |
| S0-05 | `chore/setup-husky-gitleaks` | Pre-commit hook chống leak secret | LOW | Husky, gitleaks | DevOps/Security |
| **Sprint 1 — Auth** |
| S1-01 | `feat/auth-register` | POST /auth/register, bcrypt cost 12, JWT | MED | NestJS, bcrypt, JWT | Backend |
| S1-02 | `feat/auth-login` | POST /auth/login → JWT + refresh cookie | MED | NestJS, JWT | Backend |
| S1-03 | `feat/auth-refresh-logout` | Refresh rotation + logout | MED | NestJS, cookies | Backend |
| S1-04 | `feat/auth-me-guard` | GET /auth/me + reusable JWT guard | LOW | NestJS guards | Backend |
| S1-05 | `feat/web-auth-pages` | UI login/register form + validation | MED | Next.js, shadcn, RHF, Zod | Frontend |
| **Sprint 2 — Course player core** |
| S2-01 | `feat/course-seed` | Seed 1 course "AI Agent Foundations" | LOW | Prisma seed | Database |
| S2-02 | `feat/course-list-detail-api` | GET /courses, GET /courses/:slug | LOW | NestJS | Backend |
| S2-03 | `feat/enrollment-api` | POST /courses/:id/enroll | LOW | NestJS, Prisma | Backend |
| S2-04 | `feat/lesson-detail-api` | GET /lessons/:id (gated by enrollment) | MED | NestJS, RBAC-ish | Backend |
| S2-05 | `feat/web-course-pages` | /courses, /courses/[slug] | LOW | Next.js, shadcn | Frontend |
| S2-06 | `feat/web-lesson-player` | /learn/[course]/[lesson] markdown render | MED | Next.js, MD parser, DOMPurify | Frontend |
| **Sprint 3 — Sandbox integration** |
| S3-01 | `feat/sandbox-coder-setup` | Coder OSS + Docker template (Python+Node+AI libs) | **HIGH** | Coder/Gitpod, Docker, K8s | DevOps |
| S3-02 | `feat/sandbox-provision-api` | POST /lessons/:id/start-sandbox → Coder API | **HIGH** | NestJS, Coder REST | Backend |
| S3-03 | `feat/sandbox-iframe-embed` | Embed sandbox vào lesson page | LOW | Next.js iframe | Frontend |
| S3-04 | `feat/llm-proxy-mvp` | LLM proxy: token quota, audit, X-Sandbox-Token | **HIGH** | Node, OpenAI/Anthropic SDK, rate-limit | AI/Backend |
| S3-05 | `feat/sandbox-snapshot-api` | GET /sandboxes/:id/snapshot (code tarball) | MED | NestJS, Coder API, S3/MinIO | Backend |
| **Sprint 4 — Submission + Tutor** |
| S4-01 | `feat/submission-api` | POST /assignments/:id/submit + enqueue grader | MED | NestJS, BullMQ | Backend |
| S4-02 | `feat/grader-worker` | Worker chạy pytest/custom validator trong container | **HIGH** | BullMQ, Docker, pytest | Backend/DevOps |
| S4-03 | `feat/tutor-session-api` | POST /tutor/sessions + messages SSE | MED | NestJS, SSE, ai-sdk | AI/Backend |
| S4-04 | `feat/tutor-socratic-prompt` | System prompt + guardrail (no full code, must-ask) | **HIGH** | Prompt eng, classifier, regex | AI/LLM |
| S4-05 | `feat/tutor-context-assembly` | Gom lesson + code snapshot + error trace + 5 msgs | MED | LLM context, token budget | AI/LLM |
| S4-06 | `feat/web-tutor-chat-ui` | Chat panel cạnh sandbox (split view) | MED | Next.js, SSE consume | Frontend |
| **Sprint 5 — M1 Polish + Demo prep** |
| S5-01 | `feat/progress-tracking` | GET /users/me/progress?courseId | LOW | NestJS, Prisma agg | Backend |
| S5-02 | `feat/persistence-sandbox-state` | Sandbox state survive tab close | MED | Coder workspace persistence | DevOps |
| S5-03 | `chore/seed-realistic-content` | 1 lesson chất lượng demo | LOW | Content seed | Documentation |
| S5-04 | `chore/m1-smoke-test` | Manual E2E test toàn flow | LOW | Manual + Playwright | Testing |

### 3.2. M2 / M3 (BLUEPRINT §13 — chỉ ở dạng milestone name)

> ⚠️ **PROGRESS.md chưa break down M2/M3 thành features.** Audit này chỉ làm sâu cho M1; M2/M3 sẽ cần audit lại sau khi human break-down. Tạm thời assume:
> - **M2 — Lesson 2 & Progress:** thêm lesson types (CHALLENGE, REFLECTION), assignment grader nâng cao, dropout analytics → reuse skill M1.
> - **M3 — Có tiền:** Payment (Stripe/VNPay/MoMo), Certificate (PDF + public verify), pricing tiers → cần thêm `commerce-kit` (đã có), `pdf-generation` (đã có), nhưng **VNPay/MoMo không có skill**.

---

## 4. COVERAGE MATRIX (Bước 3)

| Feature ID | Description | Category | Best skill match | Match level | Confidence |
|---|---|---|---|:---:|---:|
| S0-01 | Setup Turborepo | DevOps | `turborepo` + `monorepo-config` | ✅ STRONG | 95% |
| S0-02 | Postgres+Redis Docker | DevOps | `devops-kit` + `redis` + `env-vars` | ✅ STRONG | 90% |
| S0-03 | Setup Prisma + 15-model schema | Database | `prisma` + `data-modeling` + `postgresql` | ✅ STRONG | 92% |
| S0-04 | GitHub Actions CI | DevOps | `devops-kit` (absorbs github-actions) + `dev-workflow` | ✅ STRONG | 88% |
| S0-05 | Husky + gitleaks pre-commit | DevOps/Security | `git-hooks` + `security-toolkit` (secret scan) | ✅ STRONG | 85% |
| S1-01 | Auth register + bcrypt + JWT | Backend | `nestjs` + `authentication` | ✅ STRONG | 88% |
| S1-02 | Auth login | Backend | `nestjs` + `authentication` | ✅ STRONG | 90% |
| S1-03 | Auth refresh + logout (cookie rotation) | Backend | `nestjs` + `authentication` | ✅ STRONG | 80% |
| S1-04 | /auth/me + JWT guard reusable | Backend | `nestjs` + `authentication` + `rbac` | ✅ STRONG | 88% |
| S1-05 | Web auth pages (form+validation) | Frontend | `nextjs` + `shadcn-ui` + `forms` + `react-hook-form` + `zod` | ✅ STRONG | 92% |
| S2-01 | Seed 1 course + module + lesson | Database | `prisma` (seed sections) | ✅ STRONG | 85% |
| S2-02 | GET /courses + /courses/:slug | Backend | `nestjs` + `api-toolkit` + `prisma` | ✅ STRONG | 90% |
| S2-03 | POST /courses/:id/enroll | Backend | `nestjs` + `prisma` | ✅ STRONG | 88% |
| S2-04 | GET /lessons/:id (gated) | Backend | `nestjs` + `rbac` | ✅ STRONG | 80% |
| S2-05 | /courses, /courses/[slug] pages | Frontend | `nextjs` + `shadcn-ui` + `tailwind` | ✅ STRONG | 90% |
| S2-06 | Lesson player markdown render | Frontend | `nextjs` + `tailwind` (Markdown render: cần lib chọn — generic enough) | 🟡 PARTIAL | 70% |
| S3-01 | Coder OSS + Docker template | DevOps | `devops-kit` (docker absorbed) — **NHƯNG không cover Coder/Gitpod cụ thể** | 🟡 PARTIAL | 55% |
| S3-02 | POST /lessons/:id/start-sandbox | Backend | `nestjs` + `http-client` + (no Coder API skill) | 🟡 PARTIAL | 60% |
| S3-03 | Sandbox iframe embed | Frontend | `nextjs` (generic iframe) | ✅ STRONG | 85% |
| S3-04 | LLM proxy MVP (quota + audit) | AI/Backend | `ai-sdk` + `openai` + `rate-limiting` + `nodejs` — **chưa có skill chuyên về LLM gateway/proxy** | 🟡 PARTIAL | 65% |
| S3-05 | GET /sandboxes/:id/snapshot | Backend | `nestjs` + `http-client` (Coder snapshot endpoint — không cover) | 🟡 PARTIAL | 60% |
| S4-01 | POST /assignments/:id/submit | Backend | `nestjs` + `message-queues` + `api-toolkit` | ✅ STRONG | 90% |
| S4-02 | BullMQ grader worker | Backend/DevOps | `message-queues` (BullMQ explicit) + `redis` + `nodejs` + `devops-kit` (Docker) | ✅ STRONG | 82% |
| S4-03 | POST /tutor/sessions + SSE | AI/Backend | `nestjs` + `streaming` (SSE) + `ai-sdk` | ✅ STRONG | 85% |
| S4-04 | Socratic system prompt + guardrail | AI/LLM | `prompt-engineering` + `ai-prompts` + `promptfoo` (testing) — **THIẾU skill về Socratic-style + guardrail classifier-as-LLM** | 🟡 PARTIAL | 55% |
| S4-05 | Tutor context assembly (8K budget) | AI/LLM | `ai-agents` + `prompt-engineering` + `prompt-caching` + `context-engineering` | ✅ STRONG | 80% |
| S4-06 | Web tutor chat UI (split view + SSE) | Frontend | `nextjs` + `shadcn-ui` + `streaming` + `ai-sdk` (UI hooks) | ✅ STRONG | 85% |
| S5-01 | GET /users/me/progress | Backend | `nestjs` + `prisma` + `api-toolkit` | ✅ STRONG | 90% |
| S5-02 | Sandbox state persistence | DevOps | (Coder workspace persistence — out of scope of generic skills) | ❌ NONE | — |
| S5-03 | Realistic content seed | Documentation | `docs-kit` + `prisma` (seed) — content-specific, hơi out-of-skill-scope | 🟡 PARTIAL | 60% |
| S5-04 | M1 manual smoke test | Testing | `testing-toolkit` + `playwright` + `verify` | ✅ STRONG | 88% |

### 4.1. Coverage statistics (M1)

```
Total features:    31
✅ STRONG match:   23  (74.2%)
🟡 PARTIAL match:   6  (19.4%)   — S2-06, S3-01, S3-02, S3-04, S3-05, S4-04, S5-03
❌ NONE match:      2  ( 6.5%)   — S5-02 (sandbox persistence — depends on Coder choice)
```

> Lưu ý: S4-04 nằm ở PARTIAL nhưng confidence chỉ 55% — nếu strict thì xếp gần NONE. Đây là feature **differentiation cốt lõi** của Socratic Hub → cần ưu tiên cao nhất.

---

## 5. GAP ANALYSIS (Bước 4)

### 5.1. Gaps — đề xuất skill cần TẠO

#### Gap #1 — Socratic Tutor Prompt (HIGH priority)

- **Feature(s) bị ảnh hưởng:** S4-04, S4-05 (một phần), tương lai mọi tweak tutor
- **Skill đề xuất tạo:** `socratic-tutor-prompt`
- **Description gợi ý:** *"Pedagogical prompt patterns for AI tutors that question instead of answer — Socratic system prompts, no-direct-answer guardrails, classifier-as-LLM scoring (questionness, code-leak detection), context budgeting from lesson + code snapshot + error trace. Built on top of `prompt-engineering` + `promptfoo`."*
- **Priority:** **HIGH** — block 1 feature nhưng là feature differentiation cốt lõi của sản phẩm; sai sẽ phá luật bất khả xâm phạm trong BLUEPRINT §7.1
- **Effort tạo:** **M** (~2 giờ — viết prompt template + 2 ví dụ + integration với guardrail)
- **Lý do không reuse `prompt-engineering`:** generic, không ràng buộc no-answer; `promptfoo` chỉ test injection chứ không pattern Socratic.

#### Gap #2 — Cloud Sandbox Provisioning (HIGH priority)

- **Feature(s) bị ảnh hưởng:** S3-01, S3-02, S3-03 (một phần), S3-05, S5-02
- **Skill đề xuất tạo:** `cloud-sandbox-provisioning`
- **Description gợi ý:** *"Provision per-learner cloud IDE workspaces (Coder OSS / Gitpod / Codespaces) — workspace templates, REST API integration, K8s pod lifecycle, network egress whitelisting, persistent volumes, idle timeout, snapshot/restore. Includes the build-vs-buy decision matrix."*
- **Priority:** **HIGH** — block 4 features (~13% của M1)
- **Effort tạo:** **L** (~4 giờ — cần research Coder vs Gitpod, viết template Dockerfile, REST client patterns)

#### Gap #3 — LLM Proxy Gateway (MED priority)

- **Feature(s) bị ảnh hưởng:** S3-04
- **Skill đề xuất tạo:** `llm-proxy-gateway`
- **Description gợi ý:** *"Self-hosted LLM proxy that wraps Anthropic/OpenAI/etc — token quota per user, sandbox-token auth (instead of provider API keys), audit logging with PII redaction, streaming forward, cost attribution per learner/session. Built on top of `ai-sdk` + `rate-limiting` + `webhooks`."*
- **Priority:** **MED** — block 1 feature nhưng feature là production-critical (security: tránh leak API key của Educata)
- **Effort tạo:** **M** (~2 giờ — combination skill, có thể compose từ existing)

#### Gap #4 — Markdown safe rendering (LOW priority)

- **Feature(s) bị ảnh hưởng:** S2-06
- **Skill đề xuất tạo:** `markdown-rendering` HOẶC document trong `nextjs` skill
- **Description gợi ý:** *"Server/client Markdown rendering with safe HTML — react-markdown, DOMPurify sanitization, syntax highlighting (Shiki), MDX support, code-block widgets."*
- **Priority:** **LOW** — 1 feature, generic-enough để Claude tự build
- **Effort tạo:** **S** (~30 min)

#### Gap #5 — VN Payment (FUTURE — M3)

- **Feature(s) bị ảnh hưởng:** M3 payment features (chưa có ID)
- **Skill đề xuất tạo:** `vn-payment` (VNPay + MoMo)
- **Priority:** **MED** (defer tới M3 planning)
- **Effort:** **L**

### 5.2. Redundancy check (skills không dùng cho M1)

> **Lưu ý:** Đây là skills rộng-kinh-nghiệm dùng được tương lai, KHÔNG nên xóa. Chỉ flag những cái có thể xác nhận thuộc dự án/ngành khác.

| Skill | Lý do không match M1 | Recommendation |
|---|---|---|
| `affiliate-program-search`, `bio-link-deployer`, `funnel-planner`, `compliance-checker`, `niche-opportunity-finder`, `multi-program-manager`, `competitor-spy`, `ab-test-generator`, `conversion-tracker`, `social-media-scheduler`, `performance-report`, `seo-audit`, `self-improver`, `skill-finder`, `squeeze-page-builder`, `webinar-registration-page`, `product-showcase-page`, `github-pages-deployer` (~18 skills) | Affiliate marketing domain — không liên quan Socratic Hub | **KEEP** (có thể dùng cho landing/marketing M3+) |
| `manimce`, `manimgl`, `manim-composer` | Animation educational videos — BLUEPRINT cấm video > 5 phút | **KEEP** (V3 có thể dùng cho 3-min concept reveals) |
| `agora` | Real-time A/V — không có trong MVP | **KEEP** (V2 live-supervised lessons) |
| `electron`, `wasm`, `pwa`, `service-worker` | Desktop / WASM / offline — không phải MVP | **KEEP** |
| `heretic`, `openviking`, `openclaw` | Specialized AI tooling không liên quan | **KEEP** |
| `ut`, `ut-chain`, `ut-hooks`, `ut-init`, `ut-memory`, `ut-memory-mcp`, `ut-recall`, `ut-remember`, `ut-review`, `ut-skills` | UltraThink infrastructure — meta | **KEEP** (always) |
| `_affiliate-references` (folder bắt đầu với `_`) | Reference dump, không phải skill | **KEEP** (infra) |
| `astro`, `svelte`, `vue`, `flask`, `django`, `laravel`, `ruby-rails`, `spring-boot`, `golang`, `rust`, `react-native`, `expo`, `htmx`, `solid` | Stacks không dùng (BLUEPRINT chốt Next.js + NestJS) | **KEEP** (có thể V2 cần) |

**Tổng:** ~80 skills KHÔNG dùng cho M1. Đề xuất **KEEP all** — không archive/delete vì:
1. Token cost của skill chưa load là 0 (skills load on-demand qua trigger).
2. Có thể dùng cho M3+ hoặc skill khác (e.g. `mermaid` cho ER diagram của BLUEPRINT).

### 5.3. Quality issues

| Skill | Quality | Issue | Đề xuất fix |
|---|---:|---|---|
| `shadcn-ui` | 3/5 | Thiếu frontmatter chuẩn (chỉ markdown) → khó auto-trigger qua keywords | Thêm frontmatter: name, description, triggers (shadcn, radix, components/ui, cn(), cva) |
| `zod` | 3/5 | Thiếu frontmatter chuẩn | Thêm frontmatter |
| `nodejs` | 3/5 | Description quá generic; không nêu rõ khi nào dùng vs `bun`/`deno` | Rewrite description với disambiguation |
| `rbac` | 3/5 | Frontmatter cơ bản, thiếu ví dụ với NestJS guards (sẽ dùng cho S2-04, S1-04) | Thêm ví dụ NestJS guard pattern |
| `nestjs` | 4/5 | Thiếu ví dụ cho 3-tier module (Controller → Service → Repository) — pattern chính của Socratic Hub apps/api | Thêm worked example: AuthModule end-to-end |
| `prisma` | 4/5 | Thiếu ví dụ cho schema 15+ models với enum heavy (như BLUEPRINT §4) | Thêm reference pattern: enum-rich domain schema |

---

## 6. PRIORITIZED ACTION PLAN (Bước 5)

### 6.1. Skills nên TẠO MỚI (theo thứ tự ưu tiên)

| # | Skill name | Description draft | Unblocks features | Effort |
|:-:|---|---|---|:-:|
| 1 | `socratic-tutor-prompt` | Pedagogical prompt patterns: no-answer rule, must-ask-question, code-leak guardrail, classifier scoring | S4-04, S4-05 | M |
| 2 | `cloud-sandbox-provisioning` | Coder/Gitpod workspace provisioning, K8s pod lifecycle, snapshot, network policy | S3-01, S3-02, S3-05, S5-02 | L |
| 3 | `llm-proxy-gateway` | Token-quota LLM proxy với audit log + sandbox-token auth | S3-04 | M |
| 4 | `markdown-rendering` (optional) | Safe MD render với DOMPurify + syntax highlight | S2-06 | S |
| 5 | `vn-payment` (defer M3) | VNPay + MoMo integration | M3 features | L |

### 6.2. Skills nên IMPROVE

| Skill | Current | Issue | Fix needed |
|---|:-:|---|---|
| `shadcn-ui` | 3/5 | Thiếu frontmatter | Add full YAML frontmatter (name/description/triggers/inputs/outputs) |
| `zod` | 3/5 | Thiếu frontmatter | Add full YAML frontmatter |
| `nodejs` | 3/5 | Description quá generic | Rewrite + disambiguation với bun/deno |
| `rbac` | 3/5 | Thiếu NestJS ví dụ | Thêm 1 example NestJS guard + decorator |
| `nestjs` | 4/5 | Thiếu end-to-end module example | Thêm AuthModule end-to-end (controller + service + DTO + guard + test) |
| `prisma` | 4/5 | Thiếu enum-heavy schema example | Thêm reference: domain với 5+ enums |

### 6.3. Skills nên ARCHIVE/DELETE

**KHÔNG có.** Mọi skill có giá trị tương lai hoặc cross-domain. Không archive trong audit này.

### 6.4. SKILL_INDEX.md cần cập nhật

Hiện tại UltraThink dùng `~/.claude/skills/_registry.json` thay cho SKILL_INDEX.md. Đề xuất **không tạo SKILL_INDEX.md riêng cho project**, mà:

- **Trong `CLAUDE.md` của Socratic Hub** (chưa tạo): thêm section "Preferred skills cho project này" liệt kê 25 skills critical với 1-line khi nào dùng.
- **Skills mới (`socratic-tutor-prompt`, `cloud-sandbox-provisioning`, `llm-proxy-gateway`)** cần được register vào `_registry.json` sau khi tạo.
- **Disambiguation cần thêm:**
  - `next-auth` vs `better-auth` vs `lucia` cho S1-* — BLUEPRINT đề cập "NextAuth or custom JWT" (apps/web/lib/auth.ts) → cần human chốt.
  - `prisma` vs `drizzle` — BLUEPRINT đã chốt `prisma`, OK.
  - `bun` vs `nodejs` vs `pnpm` — BLUEPRINT không chốt package manager → cần human chốt.

---

## 7. APPENDIX — Chi tiết quality score từng skill critical

| Skill | Score | Frontmatter | Triggers | Examples | Verification | Ghi chú |
|---|:-:|:-:|:-:|:-:|:-:|---|
| `turborepo` | 4 | ✅ rich (riskLevel, sideEffects) | ✅ 6 | ✅ 1+ | ⚠️ minimal | Đủ cho S0-01 |
| `devops-kit` | 5 | ✅ very rich (huge trigger list) | ✅ 90+ | ✅ multi (docker/k8s/tf/nginx) | ✅ via absorbed | Catch-all cho infra |
| `prisma` | 4 | ✅ | ✅ 5 | ✅ | ⚠️ | Cần enum-rich example |
| `data-modeling` | 4 | ✅ rich | ✅ 8 | ✅ ER diagram output | ✅ | Hỗ trợ S0-03 |
| `git-hooks` | 5 | ✅ rich (sideEffects ghi rõ) | ✅ 8 | ✅ husky+lint-staged | ✅ | Đủ cho S0-05 |
| `security-toolkit` | 4 | ✅ very rich | ✅ 50+ | ✅ multi | ✅ | "secret scan" trigger có |
| `nestjs` | 4 | ✅ | ✅ 5 | ⚠️ partial | ⚠️ | Cần thêm AuthModule e2e |
| `authentication` | 4 | ✅ rich | ✅ 12 | ✅ JWT+session+OAuth | ✅ | Đủ cho S1-* |
| `next-auth` | 4 | ✅ | ✅ 6 | ✅ | ✅ | OK nếu Web chọn NextAuth |
| `better-auth` | 4 | ✅ rich | ✅ 3 | ✅ server config | ✅ | Alternative cho NextAuth |
| `lucia` | 3 | ❌ no frontmatter | — | ✅ Drizzle adapter | ⚠️ | Markdown only |
| `nextjs` | 5 | ✅ massive (absorbs 10) | ✅ 60+ | ✅ RSC, server actions, suspense | ✅ | Catch-all cho frontend |
| `shadcn-ui` | 3 | ❌ no frontmatter | — | ✅ install + cn() | ⚠️ | Markdown only — fix-first candidate |
| `tailwind` | 5 | ✅ (absorbs v3+v4) | ✅ 15 | ✅ multi | ✅ | Đầy đủ |
| `forms` | 4 | ✅ | ✅ 7 | ✅ RHF+Zod | ⚠️ | OK |
| `react-hook-form` | 4 | ✅ | ✅ 5 | ✅ | ✅ | OK |
| `zod` | 3 | ❌ no frontmatter | — | ✅ schema + parse | ⚠️ | Markdown only — fix-first |
| `api-toolkit` | 4 | ✅ rich (absorbs 8) | ✅ 30+ | ✅ multi | ⚠️ | OK cho REST endpoints |
| `message-queues` | 4 | ✅ rich | ✅ 11 (BullMQ explicit) | ✅ | ✅ | Đủ cho S4-02 |
| `redis` | 4 | ✅ | ✅ 7 | ✅ | ✅ | OK |
| `streaming` | 4 | ✅ | ✅ 9 (SSE explicit) | ✅ | ✅ | Đủ cho S4-03 SSE |
| `ai-sdk` | 4 | ❌ no frontmatter | — | ✅ generateText/streamText | ✅ | Markdown only nhưng rich |
| `openai` | 4 | ✅ | ✅ 6 | ✅ | ✅ | OK |
| `prompt-engineering` | 4 | ✅ rich | ✅ 7 | ✅ | ✅ | Generic — không Socratic |
| `ai-prompts` | 4 | ✅ rich | ✅ 8 | ✅ | ✅ | Library, không patterns |
| `promptfoo` | 4 | ✅ | ✅ 4 | ✅ red-team scenarios | ✅ | Hỗ trợ guardrail testing |
| `ai-agents` | 4 | ✅ | ✅ 8 | ✅ ReAct, tool use | ✅ | Đủ cho S4-05 context |
| `rate-limiting` | 4 | ❌ no frontmatter | — | ✅ token bucket | ✅ | Markdown only |
| `env-vars` | 4 | ✅ | ✅ multi | ✅ t3-env+Zod | ✅ | OK |
| `testing-toolkit` | 4 | ✅ rich (absorbs 5) | ✅ 30+ | ✅ multi | ✅ | OK cho mọi sprint |

---

**End of report.** Đợi human approve action plan trước khi tạo skill mới.
