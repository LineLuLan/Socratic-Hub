# SKILL EXTRACTION QUEUE — Patterns to extract AFTER M1

> Khi build feature mà phát hiện pattern reusable, ghi vào đây.
> KHÔNG tạo skill ngay. Đợi sau M1 done để extract từ code thực tế.

---

## 🎯 EXTRACTION PRIORITY MATRIX

Sau M1, review queue theo công thức:

```
Priority Score = (số feature dùng pattern) × (effort save per use) / (effort tạo skill)

Priority HIGH (tạo): score > 5
Priority MED (cân nhắc): score 2-5
Priority LOW (skip): score < 2
```

---

## 📥 QUEUE ENTRIES

> Format mỗi entry:
> ```
> [feature-id] Pattern name
> - Description: gì cần làm
> - Đã dùng ở: [feature-list]
> - Sẽ dùng ở (estimate): [feature-list]
> - Effort tạo skill: S/M/L
> - Notes: ...
> ```

### [S0-02] Monorepo .env loader pattern (`dotenv-cli` wrapper for Prisma + Nest)
- **Description:** Trong Turborepo monorepo có root `.env`, các app cần load env từ root khi chạy CLI tools (Prisma, NestJS). Dùng `dotenv -e ../../.env -- <cmd>` wrapper trong package.json scripts. NestJS ConfigModule.envFilePath array để cover cả 2 vị trí.
- **Đã dùng ở:** S0-02
- **Sẽ dùng ở (estimate):** S0-03 (prisma migrate dev), S1-01..S1-04 (auth env), S3-04 (LLM proxy env), S4-02 (Redis worker)
- **Effort tạo skill:** S (~30 min — pattern rõ, ít edge case)
- **Notes:** Alternative: per-app `.env` (Next.js style). Quyết định root `.env` cho M1 vì single source of truth, ít confusion. Pattern cũng applicable cho turbo `globalDependencies: [".env"]` để cache invalidation.

### [S0-02] Zod env validation với fail-fast pattern
- **Description:** `validateEnv(config)` function dùng `z.safeParse` → throw rich error message với `path.message` từng field. Register vào `ConfigModule.forRoot({validate: validateEnv})`. App boot fail ngay nếu env sai thay vì runtime.
- **Đã dùng ở:** S0-02 (DATABASE_URL, NODE_ENV, PORT)
- **Sẽ dùng ở (estimate):** S1-01 (BETTER_AUTH_SECRET), S3-04 (GROQ_API_KEY), S4-02 (REDIS_URL)
- **Effort tạo skill:** S (~20 min — boilerplate + 1 example)
- **Notes:** Có thể merge vào skill `env-vars` hiện có. Check skill `env-vars` xem đã có Zod example chưa, nếu chưa thì PR cải tiến thay vì tạo skill mới.

### [S0-03] Prisma schema từ executable spec pattern
- **Description:** BLUEPRINT viết schema sẵn dạng `prisma` code block. S0-03 copy verbatim → migration init đầu tiên không có drift. V2 entities preserved cho forward compat (schema-first principle).
- **Đã dùng ở:** S0-03 (16 models / 9 enums từ §4)
- **Sẽ dùng ở (estimate):** Mọi schema evolution sau (M2 lesson 2 sẽ thêm fields, M3 payment sẽ unlock IsaPayment usage)
- **Effort tạo skill:** S (~30 min — document workflow "spec → schema → migration → controllers")
- **Notes:** Có thể là addon cho skill `prisma`. Pattern: KHÔNG bao giờ viết schema không có spec. Schema-first nguyên tắc trong BLUEPRINT §14.

### [S0-02] DB destructive-op safety check pattern
- **Description:** Trước khi chạy `prisma db push` lần đầu trên DB lạ, query `pg_tables WHERE schemaname='public'` để liệt kê tables. Nếu có tables → STOP, verify project. Document trong README warning.
- **Đã dùng ở:** S0-02 (caught UltraThink data store)
- **Sẽ dùng ở (estimate):** S0-03 (first migration), S5-* (production prep)
- **Effort tạo skill:** S (~20 min — script + checklist)
- **Notes:** Generic pattern cho mọi project share DB infra. Có thể là addon cho skill `prisma` hoặc `postgresql`. KHÔNG nên tạo skill mới riêng (anti-pattern: skill chỉ dùng 1-2 lần).

---

## 📋 EXPECTED CANDIDATES (dự đoán dựa trên audit)

Đây là dự đoán pre-build. Chờ build thực tế để confirm/adjust.

### Strong candidates (likely sẽ extract sau M1)

#### EC-1: `socratic-tutor-prompt`
- **Sẽ dùng ở:** S4-04, S4-05, mọi tweak tutor tương lai (M2+)
- **Reusability:** Rất cao — đây là differentiation core, sẽ tweak liên tục
- **Effort tạo:** M (~2 giờ sau khi đã build)
- **Triggered by:** mọi câu hỏi về AI Tutor, Socratic method, no-direct-answer guardrail

#### EC-2: `cloud-sandbox-provisioning`
- **Sẽ dùng ở:** S3-01..S3-05, S5-02, mọi sandbox-related feature M2+
- **Reusability:** Cao — sandbox là infrastructure core
- **Effort tạo:** L (~4 giờ — cần document Coder API patterns)
- **Triggered by:** sandbox, IDE, Coder, Gitpod, workspace, learner container

#### EC-3: `llm-proxy-gateway`
- **Sẽ dùng ở:** S3-04, có thể dùng cho mọi service cần proxy LLM (analytics, content gen)
- **Reusability:** Trung bình — pattern rõ nhưng implementation cụ thể
- **Effort tạo:** M (~2 giờ)
- **Triggered by:** LLM proxy, token quota, API key protection, audit log AI

### Medium candidates (cân nhắc sau M1)

#### EC-4: `nestjs-auth-module-pattern`
- **Sẽ dùng ở:** Extract từ S1-01..S1-04 — pattern có thể reuse cho B2B auth (M2)
- **Effort:** S (~1 giờ — chỉ document pattern)
- **Triggered by:** auth module, JWT, refresh token, RBAC NestJS

#### EC-5: `prisma-enum-rich-schema`
- **Sẽ dùng ở:** Mở rộng skill `prisma` hiện có
- **Effort:** S (~30 min)
- **Triggered by:** schema với nhiều enum, domain modeling

### Low priority (có thể skip)

#### EC-6: `markdown-safe-rendering`
- **Sẽ dùng ở:** S2-06 và có thể vài lesson page khác
- **Effort:** S (~30 min)
- **Decision:** Skip nếu pattern quá đơn giản (chỉ 5-10 dòng code)

---

## 🔄 POST-MILESTONE REVIEW PROCESS

### Sau M1 done (kích hoạt P6):
1. Đọc toàn bộ queue
2. Map mỗi entry với code thực tế đã build
3. Tính priority score
4. Quyết định: tạo / defer / skip
5. Cho mỗi extract: tạo skill mới với content rút từ code thực tế

### Format khi extract thành skill:
```markdown
---
name: <skill-name>
description: <triggered description với keywords>
when_to_use:
  - [extracted from real usage]
when_not_to_use:
  - [extracted from anti-patterns gặp khi build]
related_skills:
  - [extracted from co-occurrence trong queue]
inputs_required: [...]
outputs: [...]
---

# <Skill Name>

## When to use
[Lặp lại từ frontmatter]

## Pre-flight checklist
[Extract từ DECISIONS LOG khi build]

## Pattern (từ code thực tế)
[Code example RÚT từ project, không phải hypothetical]

## Common mistakes
[Extract từ debug attempts khi build feature gốc]

## Verification
[Commands đã verify trong project thực tế]
```

---

## 📝 TRACKING METRICS

| Sprint | Entries added | Patterns extracted | Skills created |
|---|---:|---:|---:|
| S0 | 0 | — | — |
| S1 | — | — | — |
| S2 | — | — | — |
| S3 | — | — | — |
| S4 | — | — | — |
| S5 | — | — | — |
| **Post-M1 review** | — | — | — |

---

## ⚠️ ANTI-PATTERN — KHI NÀO KHÔNG GHI VÀO QUEUE

Đừng add vào queue nếu:
- Pattern chỉ dùng 1 lần trong toàn MVP
- Pattern quá đơn giản (< 10 dòng code)
- Pattern là implementation detail của một library cụ thể (tốt hơn để trong CFS- decisions log)
- Pattern đã có skill cover sẵn (chỉ thiếu ví dụ — fix skill hiện có thay vì tạo mới)

---

**Maintain by:** Claude session sau mỗi feature done.  
**Review by:** human sau mỗi milestone.
