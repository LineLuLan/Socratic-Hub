# TASK CHECKER — Socratic Hub Build Progress

> **Đây là single source of truth cho Claude CLI biết "đã làm tới đâu".**
> Mọi session Claude CLI mới PHẢI đọc file này TRƯỚC TIÊN, trước cả BLUEPRINT.md.
> Cập nhật file này là việc cuối cùng phải làm sau mỗi feature, KHÔNG được skip.

---

## 🎯 CURRENT STATE — Đọc 30 giây để biết đang ở đâu

**Milestone hiện tại:** M1 — "Hello Socratic"
**Sprint trong milestone:** Sprint 0 — Init
**Feature đang build:** (S0-03 done — chờ PR review, next: S0-04 CI)
**Branch hiện tại:** chore/setup-prisma (PR pending)
**Last commit on dev:** `815eab9` Merge PR #5 (S0-02)
**Last commit on main:** `74532a5` Merge PR #3 (S0-01 + baseline)
**Workflow note:** user dùng `dev` integration branch, `main` release. Feature → PR vào dev.
**Last updated:** 2026-04-26 (session #2)
**Last updated by:** Claude session #2

**Sprint 0 execution sequence (tối ưu):**
S0-01 → (S0-02 + S0-03 song song) → S0-04 → S0-05

**Health check:**
- [ ] Repo clean (no uncommitted changes)
- [ ] CI green on main
- [ ] No open PRs blocked > 24h
- [ ] Token spend tracking up to date

---

## 📍 MILESTONE ROADMAP — Bức tranh lớn

| # | Milestone | Status | Target | Demo criteria |
|---|---|---|---|---|
| M1 | Hello Socratic | 🟡 IN_PROGRESS | 1 lesson chạy E2E | Show cho 5 lập trình viên dùng được |
| M2 | Lesson 2 & Progress | ⬜ TODO | Module hoàn chỉnh | Đo được dropout rate |
| M3 | Có tiền | ⬜ TODO | Payment + cert | Thu được customer đầu tiên |
| M4+ | (chỉ định nghĩa sau M3) | ⬜ FUTURE | — | — |

**Status legend:** ⬜ TODO · 🟡 IN_PROGRESS · 🟢 DONE · 🔴 BLOCKED · ⏸️ PAUSED

**RULE BẤT BIẾN:** sau khi M1 DONE → DỪNG loop, đi show cho 5 người thật, cập nhật M2 dựa trên feedback. KHÔNG để loop chạy xuyên milestone.

---

## 🏃 ACTIVE MILESTONE: M1 — Hello Socratic

**Definition of Done cho M1:**
- [ ] Một học viên có thể đăng ký tài khoản
- [ ] Login và vào dashboard
- [ ] Mở 1 lesson của course "AI Agent Foundations"
- [ ] Lesson có markdown content + sandbox embedded
- [ ] Học viên viết code trong sandbox
- [ ] AI Tutor phản hồi theo phương pháp Socratic (có guardrail)
- [ ] Học viên submit code → autograder chấm pass/fail
- [ ] Progress được lưu khi học viên đóng tab và quay lại

**Out of scope cho M1 (đừng build):**
- ❌ Payment / pricing
- ❌ Certificate
- ❌ Funnel / landing đẹp
- ❌ Multi-course catalogue
- ❌ Instructor / Admin dashboard
- ❌ Blockchain
- ❌ Email verification
- ❌ Forgot password flow
- ❌ ISA / OBC contracts

---

## 📋 BACKLOG — Sprint hiện tại

### Sprint 0: Init (target: 2 ngày)

- [x] **S0-01** `chore/init-monorepo` — Setup Turborepo skeleton, apps/web + apps/api ✅ DONE 2026-04-26
  - Acceptance: ✅ `pnpm dev` chạy cả 2 apps. Web: HTTP 200 / Ready in 7.4s. API: `/health` OK.
  - Files: `package.json`, `turbo.json`, `pnpm-workspace.yaml`, `.npmrc`, `apps/web/` (Next.js 14 + Tailwind), `apps/api/` (NestJS minimal)
  - Verify: `pnpm verify` 8/8 tasks pass (lint + typecheck + test + build × 2 apps)

- [x] **S0-02** `chore/setup-database-connection` — Setup Neon connection + .env structure ✅ DONE 2026-04-26
  - Acceptance: ✅ .env.example DATABASE_URL placeholder ✅ .env Neon string ✅ Prisma db push OK ("database is already in sync")
  - Files: `apps/api/prisma/schema.prisma`, `apps/api/src/config/env.schema.ts`, `apps/api/src/app.module.ts` (ConfigModule + Zod validate), `apps/api/src/app.controller.ts` (env-aware health), `README.md` (DB setup section)
  - Smoke: `db:check` → `[ { ok: 1 } ]`, `/health` → `databaseConfigured: true`
  - Stack: Prisma 6.19.3 (downgrade từ 7 vì 7 đổi schema config sang prisma.config.ts), @nestjs/config 4, zod 4, dotenv-cli 11

- [x] **S0-03** `chore/setup-prisma` — Init Prisma, copy schema mục 4 BLUEPRINT ✅ DONE 2026-04-26
  - Acceptance: ✅ `prisma migrate dev --name init` tạo migration `20260426163035_init` + applied to Neon ✅ Prisma client v6.19.3 generated ✅ 16 tables tạo trong DB
  - Files: `apps/api/prisma/schema.prisma` (full §4: 16 models + 9 enums), `apps/api/prisma/migrations/20260426163035_init/migration.sql`
  - Verify: `pnpm verify` 8/8 pass. V2 entities (IsaContract, IsaPayment, B2BAccount, ObcContract, ObcMilestone) included for forward compat — controllers defer.

- [ ] **S0-04** `chore/setup-ci` — GitHub Actions với verify gate
  - Acceptance: PR mở thấy CI chạy, fail nếu lint/typecheck/test fail
  - Files: `.github/workflows/ci.yml`, root `package.json` script `verify`

- [ ] **S0-05** `chore/setup-husky-gitleaks` — Pre-commit hook chống leak secret
  - Acceptance: thử commit `.env` bị block
  - Files: `.husky/pre-commit`, `.gitleaks.toml`

### Sprint 1: Auth (target: 3 ngày)

- [ ] **S1-01** `feat/auth-register` — POST /auth/register
  - Acceptance: tạo user thành công, password hash bcrypt cost 12, trả JWT
  - Test cases: email duplicate → 409, password yếu → 400, happy path → 201
  - Files: `apps/api/src/modules/auth/*`

- [ ] **S1-02** `feat/auth-login` — POST /auth/login
  - Acceptance: đúng pass → JWT + refresh cookie, sai pass → 401
  - Test cases: sai email → 401, sai pass → 401, happy → 200

- [ ] **S1-03** `feat/auth-refresh-logout` — POST /auth/refresh + /auth/logout
  - Acceptance: refresh token rotation, logout invalidate cookie

- [ ] **S1-04** `feat/auth-me-guard` — GET /auth/me + JWT guard reusable
  - Acceptance: guard áp dụng được cho route khác, hết hạn → 401

- [ ] **S1-05** `feat/web-auth-pages` — UI login/register
  - Acceptance: form validation, error messages, redirect sau login
  - Files: `apps/web/app/(auth)/*`

### Sprint 2: Course player core (target: 4 ngày)

- [ ] **S2-01** `feat/course-seed` — Seed 1 course "AI Agent Foundations" với 1 module 1 lesson
- [ ] **S2-02** `feat/course-list-detail-api` — GET /courses + GET /courses/:slug
- [ ] **S2-03** `feat/enrollment-api` — POST /courses/:id/enroll
- [ ] **S2-04** `feat/lesson-detail-api` — GET /lessons/:id (chỉ trả nếu enrolled)
- [ ] **S2-05** `feat/web-course-pages` — /courses và /courses/[slug]
- [ ] **S2-06** `feat/web-lesson-player` — /learn/[course]/[lesson] với markdown render

### Sprint 3: Sandbox integration (target: 4 ngày)

- [ ] **S3-01** `feat/sandbox-coder-setup` — Coder OSS template Docker
- [ ] **S3-02** `feat/sandbox-provision-api` — POST /lessons/:id/start-sandbox
- [ ] **S3-03** `feat/sandbox-iframe-embed` — Embed sandbox vào lesson page
- [ ] **S3-04** `feat/llm-proxy-mvp` — Service forward Anthropic/OpenAI với auth
- [ ] **S3-05** `feat/sandbox-snapshot-api` — Get code snapshot từ sandbox

### Sprint 4: Submission + Tutor (target: 4 ngày)

- [ ] **S4-01** `feat/submission-api` — POST /assignments/:id/submit
- [ ] **S4-02** `feat/grader-worker` — BullMQ worker chấm bài
- [ ] **S4-03** `feat/tutor-session-api` — POST /tutor/sessions + messages SSE
- [ ] **S4-04** `feat/tutor-socratic-prompt` — System prompt + guardrail layer
- [ ] **S4-05** `feat/tutor-context-assembly` — Gom lesson+code+error vào context
- [ ] **S4-06** `feat/web-tutor-chat-ui` — Chat panel cạnh sandbox

### Sprint 5: M1 Polish + Demo prep (target: 2 ngày)

- [ ] **S5-01** `feat/progress-tracking` — GET /users/me/progress
- [ ] **S5-02** `feat/persistence-sandbox-state` — Sandbox lưu state khi đóng tab
- [ ] **S5-03** `chore/seed-realistic-content` — 1 lesson đầy đủ chất lượng để demo
- [ ] **S5-04** `chore/m1-smoke-test` — Manual E2E test toàn flow

---

## ✅ DONE — Lịch sử (mới nhất ở trên)

> Format mỗi entry: `[ID] branch — date — PR# — 1 dòng tóm tắt — token spend (input/output)`

- **S0-01** `chore/init-monorepo` — 2026-04-26 — PR #1 — Turborepo + pnpm workspace, apps/web (Next.js 14 + Tailwind), apps/api (NestJS minimal với /health), pnpm verify 8/8 pass — token: ~50K/~18K
- **S0-02** `chore/setup-database-connection` — 2026-04-26 — PR #4 (merged dev) — ConfigModule + Zod env validation, Prisma 6.19 scaffold, dotenv-cli wrapper, Neon connection verified — token: ~30K/~10K
- **S0-03** `chore/setup-prisma` — 2026-04-26 — PR# (pending) — Full schema BLUEPRINT §4 (16 models, 9 enums), migration `20260426163035_init` applied tới Neon, V2 entities included forward compat — token: ~25K/~10K

---

## 🔴 BLOCKED — Cần human can thiệp

> Loop chuyển vào đây khi gặp issue không tự giải quyết được.
> Format: `[ID] — date_blocked — reason — error_excerpt — what_was_tried`

(empty)

---

## 💡 SUGGESTIONS — Ý tưởng phát sinh khi build

> Khi agent thấy spec thiếu hoặc có cải tiến → ghi vào đây, KHÔNG tự code.
> Human review weekly, quyết định promote thành feature hay drop.

(empty)

---

## ⚠️ DECISIONS LOG — Quyết định kiến trúc đã chốt

> Mỗi khi gặp decision không có trong BLUEPRINT, ghi lại để session sau hiểu why.
> Format: `[date] — context — decision — alternatives considered — rationale`

| Date | Context | Decision | Rationale |
|---|---|---|---|
| 2026-04-26 | Skill audit cho thấy 5 gap (Socratic prompt, Sandbox, LLM proxy, MD render, VN payment) | KHÔNG tạo skill mới trước khi build M1 | (1) ROI thấp khi mỗi skill chỉ unblock 1-4 feature. (2) Chưa build thực tế thì skill viết sẽ là theoretical. (3) Coverage 74% strong + 19% partial đủ để PROCEED. Sẽ extract skill SAU khi build feature thật. |
| 2026-04-26 | Máy dev yếu, không chạy Docker | Dùng cloud DB (Neon + Upstash) cho M1, defer Docker tới Sprint 3 nếu cần | Skip Docker tiết kiệm 4-8GB RAM. Cloud free tier đủ cho M1 dev. Có thể self-host post-M1. |
| 2026-04-26 | Sandbox approach TBD (Coder vs WebContainers vs Codespaces) — block S3 toàn bộ | **WebContainers (StackBlitz SDK)** + **TypeScript runtime** thay Python | Zero infra (in-browser), faster M1 demo. Trade-off: mất Python ecosystem nhưng AI Agent dạy được tốt qua TS SDK. Coder OSS K8s defer V2. |
| 2026-04-26 | Monorepo scope cho S0-01: 4 apps (BLUEPRINT §3.2) hay 2 apps? | **2 apps M1**: `apps/web` + `apps/api`. Sandbox-orchestrator + tutor-worker + llm-proxy gộp module trong `apps/api` | Giảm complexity ops, cùng codebase. Tách app khi scale M2+. Alternative: 4 apps full spec → tốn time setup, không cần thiết M1. |
| 2026-04-26 | LLM provider chọn cho S3-04 LLM Proxy | **Groq** (default) `llama-3.3-70b-versatile` + Claude Sonnet fallback khi socraticScore < 0.7 | Free tier đủ M1 dev + early beta. Tốc độ 300+ tok/s giảm latency tutor chat. Multi-provider routing thiết kế từ đầu. OpenAI defer hoàn toàn. |
| 2026-04-26 | Token budget M1 chưa có per-sprint trip-wire | Per-sprint budget: S0=$5, S1=$8, S2=$8, S3=$15, S4=$15, S5=$5. Total $56, margin $24 | Catch drift sớm. Trip-wire per feature > $5 → STOP review. Per sprint vượt 50% → STOP review. |
| 2026-04-26 | Prisma 7.x mới release đổi config (datasource url → prisma.config.ts + driver adapter). BLUEPRINT §4 schema viết theo classic syntax | **Prisma 6.19.x** (stable, classic config) | Prisma 7 cần adapter package + rewrite schema → tốn time setup, không match BLUEPRINT. Prisma 6 mature, fit ngay. Upgrade khi 7 ecosystem stabilize. |
| 2026-04-26 | S0-02 Neon DB user provide chứa 504 rows project khác (UltraThink memory store) — risk catastrophic data loss nếu --accept-data-loss | DỪNG, ask user → user tạo Neon project mới (US-East), retry pass | **Pattern bất biến:** mọi `prisma db push` ra "drop table X (Y rows)" → STOP, verify project. KHÔNG tự dùng `--accept-data-loss`. README đã document warning. |


---

## 📊 METRICS — Theo dõi sức khỏe loop

### Token spend
| Date | Feature ID | Input tokens | Output tokens | Cost (Sonnet) | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

**Total spent:** $0.00
**Budget cap (soft):** $56 cho M1 (per-sprint sum)
**Budget cap (hard — STOP):** $80 cho M1

### Per-sprint budget (chốt 2026-04-26)
| Sprint | Budget | Spent | Remaining |
|---|---|---|---|
| S0 Init | $5 | ~$2.1 (S0-01 + S0-02 + S0-03) | ~$2.9 |
| S1 Auth | $8 | $0 | $8 |
| S2 Course | $8 | $0 | $8 |
| S3 Sandbox | $15 | $0 | $15 |
| S4 Tutor | $15 | $0 | $15 |
| S5 Polish | $5 | $0 | $5 |
| **M1 Total** | **$56** | **$0** | **$56** |

**Trip-wires:**
- Per-feature > $5 → STOP review skill mapping
- Per-sprint vượt 50% → STOP review approach

### Quality indicators
| Sprint | Features done | Bumpy rate | Stuck rate | Coverage delta | Bundle delta |
|---|---|---|---|---|---|
| S0 | 3/5 | 2/3 (S0-03 zero retry — schema copy clean) | 0% | — | web: 87.2 kB / DB: 16 tables migrated |

**Drift alert thresholds:**
- Bumpy rate > 50% trong 5 feature liên tiếp → review spec
- Stuck rate > 20% → pause loop, debug workflow
- Coverage giảm 3 PR liên tiếp → flag

---

## 🛡️ SAFETY STATUS

- [ ] Branch protection trên `main` đã bật?
- [ ] Pre-commit hook gitleaks active?
- [ ] CI chạy < 5 phút?
- [ ] `.env` có trong `.gitignore`?
- [ ] Git tag backup gần nhất: `(chưa có)`

---

## 🔄 SESSION LOG — Phiên Claude CLI

> Mỗi session tạo 1 entry. Giúp debug khi loop kết quả không như mong đợi.

### Session #1 — 2026-04-26
- **Started from feature:** P1 sanity check + P1.5 pre-build planning + S0-01 build
- **Completed:** 5 decisions chốt, docs v1.1, S0-01 (Turborepo + Next.js + NestJS), PR #1 merged
- **Token spend:** ~50K/~18K
- **Notes:** WebContainers + TS-only sẽ ảnh hưởng course design S2-01.

### Session #2 — 2026-04-26
- **Started from feature:** S0-02 chore/setup-database-connection
- **Completed:** S0-02 (ConfigModule + Zod, Prisma scaffold, DB verified) → PR #4 merged dev. Then S0-03 (full schema §4, migration init) → PR pending.
- **Bumpy moments:** (1) Prisma 7 → 6 downgrade. (2) DB safety pause — user tạo Neon project mới.
- **Token spend:** ~55K/~20K (cả 2 features)
- **Next:** S0-04 chore/setup-ci (GitHub Actions verify gate)

---

## 📖 PROTOCOL — Cách Claude CLI tương tác với file này

### Khi bắt đầu session:
1. Đọc TOÀN BỘ file này (không skim).
2. Note: "Current state" + "Active Milestone" + feature đầu tiên trong Backlog chưa check.
3. Verify health check: `git status`, `git log -1`, kiểm tra branch.
4. Nếu mismatch giữa file này và git state → DỪNG, báo cho human.

### Khi pick feature mới:
1. Move feature từ Backlog → Current State.
2. Đổi status thành 🟡 IN_PROGRESS.
3. Update timestamp.
4. Commit file này như commit đầu tiên của branch: `chore: start <feature-id>`.

### Khi hoàn thành feature (PR merged):
1. Tick [x] feature trong Backlog.
2. Add entry vào DONE với token spend.
3. Update Metrics table.
4. Reset Current State về "chưa bắt đầu" cho feature kế tiếp.
5. Commit: `chore: complete <feature-id>`.

### Khi BLOCKED:
1. Move feature vào Blocked với:
   - Date
   - Reason ngắn gọn
   - Excerpt error log (max 20 dòng)
   - Liệt kê những gì đã thử
2. KHÔNG xóa khỏi Backlog (để biết feature nào đang trong limbo).
3. Commit: `chore: block <feature-id>` rồi sang feature kế tiếp.

### Khi có Decision không trong spec:
1. Ghi vào Decisions Log NGAY trước khi code.
2. Format đầy đủ 5 trường (date, context, decision, alternatives, rationale).
3. Reference decision ID trong commit message nếu liên quan.

### Khi phát hiện Suggestion:
1. Ghi vào Suggestions với context đủ để human hiểu.
2. KHÔNG tự implement.
3. Tiếp tục feature đang làm.

### Cuối session (dù thành công hay bị stop):
1. Update Session Log #N với token spend, completed, blocked.
2. Update timestamp ở Current State.
3. Commit file này nếu có thay đổi: `chore: update progress (session #N)`.

---

## 🚨 STOP CONDITIONS — Khi nào loop tự dừng

Loop PHẢI dừng và báo human nếu:

1. ✋ Feature hiện tại stuck > 3 attempts.
2. ✋ 2 feature liên tiếp BLOCKED.
3. ✋ Token spend session vượt $20.
4. ✋ Phát hiện file `.env`, `secrets/*`, hoặc credential bị stage.
5. ✋ CI fail > 2 round liên tiếp trên cùng feature.
6. ✋ Git rebase conflict ở file trong "no-touch list" (mục 7 của AUTONOMOUS_BUILD_LOOP_PROMPT).
7. ✋ Test coverage giảm > 5%.
8. ✋ Đã hoàn thành milestone hiện tại — DỪNG để human validate với người dùng thật.

Khi dừng, cập nhật Session Log với lý do và đợi human signal.

---

**End of Task Checker. Cập nhật mỗi feature là sacred duty — đừng skip.**


