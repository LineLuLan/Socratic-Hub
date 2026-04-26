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

(empty — sẽ populate khi build)

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
