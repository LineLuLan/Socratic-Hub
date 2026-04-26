# SOCRATIC HUB (by Educata) — BLUEPRINT KỸ THUẬT CHO CLAUDE CLI

> **Mục đích file này:** Đây là tài liệu duy nhất Claude CLI cần đọc để hiểu toàn bộ dự án và bắt đầu build từ con số 0. File được viết theo nguyên tắc "executable spec" — mọi quyết định kiến trúc, schema, contract, và lộ trình triển khai đều được nêu rõ ràng để AI agent có thể thực thi mà không cần hỏi lại.

> **Stack mặc định:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui (frontend), NestJS + TypeScript + Prisma + PostgreSQL (backend), Docker Compose cho dev, Kubernetes cho production sandboxes.

> **Quy ước:** Mọi phần đánh dấu `[MVP]` là phải có ở vòng 1. `[V2]` là vòng 2. `[V3+]` là dài hạn. Claude CLI chỉ build `[MVP]` trước khi chuyển sang vòng kế tiếp.

---

## 1. TÓM TẮT EXECUTIVE — ĐỌC TRƯỚC KHI VIẾT BẤT KỲ DÒNG CODE NÀO

**Tên sản phẩm:** Socratic Hub (by Educata)

**Một câu định nghĩa:** Nền tảng đào tạo Kỹ sư AI Agent thực chiến tại Việt Nam, dạy bằng phương pháp Socratic (gợi mở tư duy thay vì cung cấp đáp án), thực hành trong Cloud IDE Sandbox, định giá theo kết quả (OBC cho B2B, ISA cho B2C).

**Khác biệt cốt lõi (đại dương xanh) — KHÔNG được phá vỡ:**
1. **Không có video bài giảng dài thụ động.** Mọi nội dung phải dẫn tới một thao tác code trong Sandbox trong vòng 5 phút.
2. **AI Tutor không bao giờ viết code thay học viên.** Chỉ đặt câu hỏi Socratic, chỉ ra dòng code có vấn đề, gợi ý hướng tư duy.
3. **Đánh giá dựa trên project thực tế chạy được**, không phải trắc nghiệm.
4. **Chứng chỉ neo trên blockchain**, có cổng xác thực công khai cho HR.
5. **Định giá gắn với kết quả** (OBC/ISA), không phải số ghế hay số giờ video.

**Đối tượng người dùng `[MVP]`:**
- **B2C:** Lập trình viên Việt Nam mid-level (2-5 năm kinh nghiệm) muốn chuyển sang AI Engineering.
- **B2B (vòng 2):** CTO/Engineering Manager tại các công ty công nghệ vừa cần upskill team.

**Tiêu chí thành công của MVP:** Một học viên có thể đăng ký → vào lesson đầu tiên của module "AI Agent Fundamentals" → mở Cloud Sandbox → viết code → submit → AI Tutor phản hồi theo phương pháp Socratic → autograder chấm pass/fail → tiến độ được cập nhật → nhận badge khi hoàn thành module.

---

## 2. BỐI CẢNH NGHIỆP VỤ (BUSINESS CONTEXT) CHO AI AGENT HIỂU NGỮ NGHĨA

Claude CLI cần nhớ những ràng buộc nghiệp vụ sau khi viết code, đặt tên biến, thiết kế UX:

| Khái niệm | Ý nghĩa nghiệp vụ | Hệ quả kỹ thuật |
|---|---|---|
| Socratic Pedagogy | Gia sư dẫn dắt bằng câu hỏi | AI Tutor có system prompt cấm trả lời trực tiếp; phải hỏi lại |
| ERRC | Eliminate / Reduce / Raise / Create | UX phải loại video dài, loại setup local, nâng gamification, tạo Cloud IDE |
| OBC (Outcomes-Based Contracting) | B2B trả tiền theo milestone học viên đạt được | Cần data layer ghi nhận `outcome_event` có thể audit |
| ISA (Income Share Agreement) | B2C trả % lương sau khi tốt nghiệp & có việc | Cần module quản lý hợp đồng + tracking thu nhập |
| VQF / VN-NARIC | Khung trình độ quốc gia VN & cơ quan công nhận văn bằng | Schema certificate phải có trường tương thích chuẩn quốc gia |
| Blended Learning ≤ 30% online | Quy định cho văn bằng chính quy | Cần phân loại lesson: `online_self_paced` vs `live_supervised` vs `offline_capstone` |

---

## 3. KIẾN TRÚC TỔNG THỂ

### 3.1. Sơ đồ hệ thống cấp cao

```
┌─────────────────────────────────────────────────────────────────┐
│                       NGƯỜI DÙNG (Browser)                       │
└───────────────────┬─────────────────────────────────────────────┘
                    │ HTTPS
┌───────────────────▼─────────────────────────────────────────────┐
│  WEB APP (Next.js 14 — apps/web)                                 │
│  - Marketing pages, Auth, Dashboard, Course Player               │
│  - Embedded Cloud IDE (iframe → Sandbox Service)                 │
└───────────────────┬─────────────────────────────────────────────┘
                    │ REST + WebSocket
┌───────────────────▼─────────────────────────────────────────────┐
│  API GATEWAY (NestJS — apps/api)                                 │
│  - Auth (JWT + RBAC), Courses, Enrollments, Submissions          │
│  - Tutor Orchestrator, Certificate Service, Payment, Funnel CRM  │
└──┬─────────────┬──────────────┬──────────────┬─────────────────┘
   │             │              │              │
   ▼             ▼              ▼              ▼
┌──────┐   ┌─────────┐   ┌──────────────┐  ┌──────────────┐
│Postgres│  │ Redis   │   │ Sandbox Svc  │  │ AI Tutor Svc │
│(Prisma)│  │(cache + │   │(K8s/Docker — │  │(LLM proxy +  │
│        │  │ queue)  │   │ per-learner  │  │ Socratic     │
│        │  │         │   │ containers)  │  │ guardrails)  │
└────────┘  └─────────┘   └──────────────┘  └──────────────┘
                              │                    │
                              ▼                    ▼
                    ┌──────────────────┐   ┌────────────────┐
                    │ Object Storage   │   │ LLM Providers  │
                    │ (S3/MinIO —      │   │ (Anthropic,    │
                    │  artifacts, logs)│   │  OpenAI)       │
                    └──────────────────┘   └────────────────┘
```

### 3.2. Monorepo layout — Claude CLI tạo theo đúng cấu trúc này

```
socratic-hub/
├── apps/
│   ├── web/                      # Next.js 14 (App Router)
│   │   ├── app/
│   │   │   ├── (marketing)/      # Landing, pricing, blog
│   │   │   ├── (auth)/           # login, register, forgot-password
│   │   │   ├── (learn)/          # course player, sandbox, tutor chat
│   │   │   ├── (dashboard)/      # student / instructor / admin dashboards
│   │   │   └── api/              # Next.js route handlers (BFF mỏng — proxy sang api)
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui primitives
│   │   │   ├── course/           # LessonPlayer, ProgressBar, CodeBlock
│   │   │   ├── sandbox/          # SandboxFrame, ConsolePanel, FileTree
│   │   │   ├── tutor/            # TutorChat, SocraticPromptInput
│   │   │   └── funnel/           # ApplyForm, CalendlyEmbed, CaseStudyCard
│   │   ├── lib/
│   │   │   ├── api-client.ts     # fetch wrapper with auth
│   │   │   ├── auth.ts           # NextAuth or custom JWT helpers
│   │   │   └── analytics.ts      # event tracking
│   │   ├── stores/                # Zustand stores (UI state only)
│   │   └── styles/
│   ├── api/                       # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── courses/
│   │   │   │   ├── lessons/
│   │   │   │   ├── enrollments/
│   │   │   │   ├── submissions/
│   │   │   │   ├── tutor/        # Socratic AI orchestrator
│   │   │   │   ├── sandbox/      # Sandbox provisioning client
│   │   │   │   ├── certificates/ # Blockchain anchoring
│   │   │   │   ├── payments/     # Stripe / VNPay / MoMo
│   │   │   │   ├── isa/          # ISA contract lifecycle
│   │   │   │   ├── obc/          # B2B outcome milestones
│   │   │   │   └── funnel/       # Lead capture, scoring, CRM hooks
│   │   │   ├── common/           # guards, pipes, interceptors, filters
│   │   │   ├── prisma/           # PrismaService
│   │   │   └── main.ts
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── migrations/
│   ├── sandbox-orchestrator/     # Service Go/Node quản lý K8s pods
│   │   └── src/
│   └── tutor-worker/             # Worker xử lý long-running tutor sessions
│       └── src/
├── packages/
│   ├── shared-types/             # TypeScript types dùng chung (DTO, enums)
│   ├── ui-kit/                   # Component library (nếu tách khỏi apps/web)
│   ├── grader-sdk/               # SDK chấm bài chạy trong sandbox
│   └── eslint-config/
├── infra/
│   ├── docker/
│   │   ├── sandbox.Dockerfile    # Image cho learner sandbox (Python+Node+AI libs)
│   │   ├── api.Dockerfile
│   │   └── web.Dockerfile
│   ├── k8s/                      # Helm charts cho production
│   └── terraform/                # IaC cho cloud (V2)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_CONTRACT.md
│   ├── SOCRATIC_PROMPTS.md       # Prompt library cho AI Tutor
│   ├── MVP_NOTES.md
│   └── SECURITY.md
├── docker-compose.yml            # Dev environment
├── turbo.json                    # Turborepo config
├── package.json
└── README.md
```

---

## 4. DATABASE SCHEMA `[MVP]`

> Claude CLI tạo file `apps/api/prisma/schema.prisma` đúng theo schema dưới đây. Các bảng có suffix `[V2]` thì bỏ qua trong vòng 1.

### 4.1. Core entities

```prisma
// User & Auth
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  fullName      String
  role          Role     @default(STUDENT)
  avatarUrl     String?
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  enrollments   Enrollment[]
  submissions   Submission[]
  tutorSessions TutorSession[]
  certificates  Certificate[]
  isaContract   IsaContract?
  leadProfile   Lead?
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
  B2B_ADMIN     // quản lý của một tổ chức khách hàng
}

// Course catalogue
model Course {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  subtitle      String?
  description   String   @db.Text
  level         CourseLevel
  thumbnailUrl  String?
  priceVnd      Int      // giá list, đơn vị VND
  isaEligible   Boolean  @default(false)
  obcEligible   Boolean  @default(false)
  publishedAt   DateTime?
  createdAt     DateTime @default(now())

  modules       Module[]
  enrollments   Enrollment[]
}

enum CourseLevel {
  FOUNDATION    // Python, Math, SQL
  LLM_BASICS    // Prompting, Transformer
  RAG           // RAG, Vector DB
  AGENT_CORE    // ReAct, LangChain, CrewAI
  PRODUCTION    // MLOps, Guardrails
}

model Module {
  id        String   @id @default(cuid())
  courseId  String
  title     String
  order     Int
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons   Lesson[]

  @@index([courseId, order])
}

model Lesson {
  id              String   @id @default(cuid())
  moduleId        String
  slug            String
  title           String
  order           Int
  type            LessonType
  // Nội dung học: KHÔNG dùng video dài. Chỉ dùng:
  //   - markdown ngắn (< 500 từ)
  //   - 1-2 video < 3 phút (concept reveal)
  //   - sandbox starter code
  contentMd       String   @db.Text
  starterRepoRef  String?  // git URL hoặc tarball ID trong object storage
  estimatedMin    Int      // ước tính thời gian
  // Phân loại để tuân thủ quy định blended ≤ 30% online cho văn bằng chính quy
  deliveryMode    DeliveryMode @default(ONLINE_SELF_PACED)

  module          Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  assignments     Assignment[]

  @@unique([moduleId, slug])
  @@index([moduleId, order])
}

enum LessonType {
  CONCEPT       // markdown + 1 video ngắn
  GUIDED_LAB    // step-by-step trong sandbox
  CHALLENGE     // học viên tự build, có autograder
  REFLECTION    // viết về điều đã học
}

enum DeliveryMode {
  ONLINE_SELF_PACED
  LIVE_SUPERVISED
  OFFLINE_CAPSTONE
}

// Assignment & Grading
model Assignment {
  id            String   @id @default(cuid())
  lessonId      String
  title         String
  instructionMd String   @db.Text
  // Cấu hình autograder — JSON schema chi tiết ở docs/API_CONTRACT.md
  graderConfig  Json
  passThreshold Int      @default(70)  // %
  maxAttempts   Int?     // null = unlimited

  lesson        Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  submissions   Submission[]
}

model Submission {
  id            String   @id @default(cuid())
  assignmentId  String
  userId        String
  sandboxId     String?
  // Snapshot code khi submit — lưu dưới dạng tarball ID
  artifactRef   String
  status        SubmissionStatus @default(PENDING)
  score         Int?
  graderOutput  Json?    // stdout, stderr, test results, hints
  submittedAt   DateTime @default(now())
  gradedAt      DateTime?

  assignment    Assignment @relation(fields: [assignmentId], references: [id])
  user          User       @relation(fields: [userId], references: [id])
  tutorMessages TutorMessage[]

  @@index([userId, submittedAt])
}

enum SubmissionStatus {
  PENDING
  GRADING
  PASSED
  FAILED
  ERROR
}

// Enrollment & Progress
model Enrollment {
  id           String   @id @default(cuid())
  userId       String
  courseId     String
  enrolledAt   DateTime @default(now())
  completedAt  DateTime?
  // Progress được tính từ Submission, không lưu cứng % ở đây
  // mà query realtime để tránh stale data

  user         User     @relation(fields: [userId], references: [id])
  course       Course   @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
}

// Socratic AI Tutor
model TutorSession {
  id          String   @id @default(cuid())
  userId      String
  lessonId    String?
  context     Json     // { codeSnapshot, errorTrace, lastSandboxState }
  startedAt   DateTime @default(now())
  endedAt     DateTime?

  user        User     @relation(fields: [userId], references: [id])
  messages    TutorMessage[]
}

model TutorMessage {
  id            String   @id @default(cuid())
  sessionId     String
  submissionId  String?
  role          TutorRole
  content       String   @db.Text
  // Bằng chứng AI tuân thủ Socratic: lưu lại classifier score
  socraticScore Float?   // 0-1, càng cao càng "Socratic"
  createdAt     DateTime @default(now())

  session       TutorSession @relation(fields: [sessionId], references: [id])
  submission    Submission?  @relation(fields: [submissionId], references: [id])
}

enum TutorRole {
  USER
  TUTOR
  SYSTEM
}

// Certificate
model Certificate {
  id              String   @id @default(cuid())
  userId          String
  courseId        String
  issuedAt        DateTime @default(now())
  // Blockchain anchor
  blockchainTxHash String?
  blockchainNetwork String? // 'polygon', 'ethereum'
  // Public verify URL: /verify/{publicId}
  publicId        String   @unique
  pdfUrl          String?
  // Để tương thích VQF
  vqfLevelMapping String?  // null nếu chỉ là Professional Certificate

  user            User     @relation(fields: [userId], references: [id])
}

// Funnel & CRM
model Lead {
  id              String   @id @default(cuid())
  userId          String?  @unique
  email           String
  fullName        String?
  source          String?  // utm_source
  utm             Json?
  leadScore       Int      @default(0)
  stage           FunnelStage @default(AWARENESS)
  appliedAt       DateTime?
  consultationAt  DateTime?

  user            User?    @relation(fields: [userId], references: [id])

  @@index([email])
}

enum FunnelStage {
  AWARENESS
  NURTURE
  WEBINAR_REGISTERED
  APPLIED
  CONSULTATION_BOOKED
  CONVERTED
  LOST
}

// ISA — V2 nhưng schema vẫn nên có sẵn
model IsaContract {
  id              String   @id @default(cuid())
  userId          String   @unique
  courseId        String
  signedAt        DateTime @default(now())
  startedAt       DateTime?  // khi học viên có việc đạt ngưỡng lương
  // Tham số hợp đồng
  sharePct        Decimal  @db.Decimal(5,2)   // ví dụ 15.00
  durationMonths  Int                          // ví dụ 36
  minSalaryVnd    Int                          // ngưỡng tối thiểu để kích hoạt
  capVnd          Int?                         // trần tổng số tiền phải trả
  status          IsaStatus @default(DRAFT)

  user            User     @relation(fields: [userId], references: [id])
  payments        IsaPayment[]
}

enum IsaStatus {
  DRAFT
  ACTIVE
  PAUSED       // mất việc, dưới ngưỡng
  COMPLETED
  CAPPED       // chạm trần, dừng thu
  DEFAULTED
}

model IsaPayment {
  id           String   @id @default(cuid())
  contractId   String
  monthIndex   Int
  reportedSalaryVnd Int
  amountDueVnd Int
  paidAt       DateTime?
  contract     IsaContract @relation(fields: [contractId], references: [id])

  @@unique([contractId, monthIndex])
}

// OBC — V2
model B2BAccount {
  id           String   @id @default(cuid())
  name         String
  contactEmail String
  obcContracts ObcContract[]
}

model ObcContract {
  id          String   @id @default(cuid())
  accountId   String
  totalValueVnd Int
  signedAt    DateTime @default(now())
  account     B2BAccount @relation(fields: [accountId], references: [id])
  milestones  ObcMilestone[]
}

model ObcMilestone {
  id            String   @id @default(cuid())
  contractId    String
  title         String
  // Định nghĩa khi nào milestone được "đạt"
  // Ví dụ: { type: 'completion_rate', courseId: 'xxx', threshold: 0.8 }
  criteria      Json
  amountVnd     Int
  status        MilestoneStatus @default(PENDING)
  achievedAt    DateTime?
  contract      ObcContract @relation(fields: [contractId], references: [id])
}

enum MilestoneStatus {
  PENDING
  ACHIEVED
  INVOICED
  PAID
}
```

### 4.2. Indexing & performance notes

- Mọi bảng có `userId` đều index theo `userId` (đã có nhờ FK + composite index nơi cần).
- `Submission.submittedAt` index để query "bài mới nhất của user".
- `Lead.email` index để dedupe khi import từ marketing campaigns.
- Soft delete: KHÔNG dùng. Dùng status enum hoặc archive bảng riêng nếu cần audit.

---

## 5. API CONTRACT `[MVP]`

> File chi tiết: `docs/API_CONTRACT.md`. Dưới đây là các endpoint quan trọng nhất.

**Quy ước chung:**
- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <jwt>` (access token 15 phút, refresh token 7 ngày, lưu refresh trong httpOnly cookie).
- Response chuẩn: `{ data: T } | { error: { code, message, details? } }`
- Error codes theo `docs/API_CONTRACT.md`.

### 5.1. Auth

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password, fullName }` | `{ user, accessToken }` |
| POST | `/auth/login` | `{ email, password }` | `{ user, accessToken }` |
| POST | `/auth/refresh` | (cookie) | `{ accessToken }` |
| POST | `/auth/logout` | — | `204` |
| GET  | `/auth/me` | — | `{ user }` |

### 5.2. Courses & Learning

| Method | Path | Mô tả |
|---|---|---|
| GET    | `/courses` | List với filter `?level=AGENT_CORE` |
| GET    | `/courses/:slug` | Chi tiết + modules + lessons (chỉ trả lessons đã unlock nếu user đã enroll) |
| POST   | `/courses/:id/enroll` | Tạo Enrollment + khởi tạo progress |
| GET    | `/lessons/:id` | Trả contentMd + assignmentId nếu có |
| POST   | `/lessons/:id/start-sandbox` | → Sandbox Service provision pod, trả `{ sandboxUrl, sandboxId, expiresAt }` |

### 5.3. Submissions & Grading

| Method | Path | Mô tả |
|---|---|---|
| POST | `/assignments/:id/submit` | Body: `{ sandboxId }`. API gọi Sandbox Service snapshot code → enqueue grader job → return `{ submissionId, status: 'GRADING' }` |
| GET  | `/submissions/:id` | Polling status. Khi `status='PASSED'\|'FAILED'`, trả `graderOutput` |
| GET  | `/users/me/progress?courseId=` | Trả % completion, list lesson đã pass |

### 5.4. Socratic Tutor

| Method | Path | Mô tả |
|---|---|---|
| POST | `/tutor/sessions` | Body: `{ lessonId, submissionId? }` → `{ sessionId }` |
| POST | `/tutor/sessions/:id/messages` | Body: `{ content, codeContext? }` → SSE stream câu trả lời Socratic |
| GET  | `/tutor/sessions/:id` | Lấy lịch sử messages |

**Quan trọng:** Endpoint `/tutor/sessions/:id/messages` PHẢI gọi qua Tutor Service nội bộ với guardrail prompt (xem mục 7).

### 5.5. Certificates

| Method | Path | Mô tả |
|---|---|---|
| POST | `/certificates/issue` | Trigger nội bộ khi enrollment.completedAt được set |
| GET  | `/verify/:publicId` | **Public, không cần auth.** Trả `{ holderName, courseTitle, issuedAt, blockchainTxHash, valid }` |

### 5.6. Funnel

| Method | Path | Mô tả |
|---|---|---|
| POST | `/funnel/leads` | Capture từ landing page form |
| POST | `/funnel/apply` | Submit application form (Apply to Enroll) |
| POST | `/funnel/book-consultation` | Đặt lịch tư vấn 1-1 |

---

## 6. CLOUD SANDBOX — KIẾN TRÚC `[MVP]`

> Đây là tính năng tốn công nhất. Vòng MVP có thể dùng **Coder/Gitpod/Codespaces** as-a-service để rút ngắn TTM. Vòng V2 mới tự build trên K8s.

### 6.1. Yêu cầu chức năng

1. Học viên click "Start Lab" → trong < 10 giây có IDE chạy trong browser.
2. IDE phải có: Python 3.11, Node 20, sẵn các thư viện `langchain`, `llama-index`, `crewai`, `openai`, `anthropic`.
3. Mỗi sandbox cô lập (network policy: chỉ allow egress tới whitelist của LLM providers + npm/pypi).
4. Persistent state: học viên đóng tab, mở lại sau 1 ngày, code vẫn còn.
5. **API keys của học viên KHÔNG được lộ.** Educata cấp một proxy LLM endpoint riêng (xem 6.3) — học viên gọi `https://llm-proxy.educata.io/v1/messages` thay vì gọi thẳng provider.
6. Resource limit: 2 vCPU, 4GB RAM, 10GB disk, 2h idle timeout.

### 6.2. Kiến trúc đề xuất `[MVP]` — dùng Coder OSS

```
apps/api/sandbox-module
        │
        │ REST → Coder API
        ▼
   ┌──────────────┐
   │  Coder       │  ← provision workspace từ template Docker
   │  Control     │
   │  Plane       │
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │ K8s cluster  │  → mỗi workspace = 1 Pod
   │              │
   └──────────────┘
```

**Template Dockerfile** đặt tại `infra/docker/sandbox.Dockerfile`:

```dockerfile
FROM codercom/code-server:latest
USER root

RUN apt-get update && apt-get install -y python3.11 python3-pip nodejs npm git

# Pre-install AI libs để khởi động nhanh
RUN pip install --no-cache-dir \
    langchain==0.2.* langchain-openai langchain-anthropic \
    llama-index crewai pyautogen \
    openai anthropic \
    chromadb qdrant-client \
    fastapi uvicorn pytest

# Cấu hình proxy LLM
ENV ANTHROPIC_BASE_URL=https://llm-proxy.educata.io/v1
ENV OPENAI_BASE_URL=https://llm-proxy.educata.io/v1

USER coder
WORKDIR /home/coder/workspace
```

### 6.3. LLM Proxy `[MVP]`

> **Update 2026-04-26 (xem §17):** Provider mặc định đổi sang **Groq**. M1 monorepo gộp logic này vào `apps/api` module thay vì app riêng `apps/llm-proxy`.

Module trong `apps/api` (M1) hoặc service `apps/llm-proxy` riêng (V2) làm:
1. Nhận request từ sandbox tại endpoint `https://llm-proxy.educata.io/v1/messages` (header có `X-Sandbox-Token` thay vì API key thật).
2. Verify token → biết user nào, lesson nào, quota còn bao nhiêu.
3. **Route theo model name:**
   - `llama-*` → Groq (`https://api.groq.com/openai/v1`) — provider mặc định M1.
   - `claude-*` → Anthropic — fallback khi `socraticScore < 0.7`.
   - `gpt-*` → OpenAI — defer post-M1.
4. Forward request bằng API key của Educata (giữ secret server-side).
5. Đếm tokens, trừ quota, ghi audit log (PII redact).
6. Trả response stream về sandbox.

Quota mặc định MVP: 100,000 tokens/tuần/học viên. Vượt thì block và hiện modal upsell.

**Lý do chọn Groq mặc định:** free tier đủ M1 dev + early beta, tốc độ inference 300+ tok/s (giảm latency tutor chat). Multi-provider routing thiết kế từ đầu để switch dễ khi cần.

---

## 7. SOCRATIC AI TUTOR — PHẦN QUAN TRỌNG NHẤT VỀ DIFFERENTIATION

> File prompt chi tiết: `docs/SOCRATIC_PROMPTS.md`. Dưới đây là khung tổng.

### 7.1. System prompt chuẩn (rút gọn)

```
Bạn là Socratic Tutor của Educata. Vai trò của bạn KHÔNG PHẢI là cung cấp đáp án.
Vai trò của bạn là dẫn dắt học viên tự tìm ra đáp án thông qua câu hỏi gợi mở.

LUẬT BẤT KHẢ XÂM PHẠM:
1. KHÔNG bao giờ viết lại đoạn code đã sửa lỗi cho học viên.
2. KHÔNG bao giờ cung cấp giải pháp đầy đủ, kể cả khi học viên năn nỉ.
3. Mỗi phản hồi PHẢI chứa ít nhất một câu hỏi mở.
4. Khi học viên có code lỗi, hãy:
   a. Chỉ ra dòng/khối có vấn đề (không nói nó sai cái gì cụ thể).
   b. Đặt câu hỏi về giả định của họ ("Bạn đang kỳ vọng biến X có giá trị gì ở dòng này?").
   c. Gợi ý một thí nghiệm họ có thể chạy để tự kiểm chứng.
5. Khi học viên hỏi định nghĩa một khái niệm hoàn toàn mới mà họ chưa được dạy,
   bạn ĐƯỢC phép giải thích ngắn gọn (< 3 câu), sau đó kèm câu hỏi áp dụng.
6. Phong cách: tôn trọng, kiên nhẫn, không chế giễu. Dùng ngôi "bạn" thân thiện.

NGỮ CẢNH HỌC VIÊN:
- Lesson: {lessonTitle}
- Mục tiêu lesson: {lessonObjectives}
- Code hiện tại của học viên: {codeSnapshot}
- Lỗi gần nhất (nếu có): {errorTrace}
- Lịch sử 5 message gần nhất: {recentMessages}

KHI HỌC VIÊN VIẾT: "{userMessage}"
HÃY PHẢN HỒI THEO PHƯƠNG PHÁP SOCRATIC.
```

### 7.2. Guardrail layer

Trước khi trả response cho học viên, chạy classifier nhỏ kiểm tra:
1. Response có chứa câu hỏi không? Nếu không → reject + retry.
2. Response có chứa khối code dài (> 5 dòng) không? Nếu có → reject + retry với prompt bổ sung "Bạn vừa viết quá nhiều code. Hãy thay bằng câu hỏi gợi mở."
3. Lưu `socraticScore` (0-1) vào `TutorMessage` để monitor.

Implement bằng cách gọi LLM lần 2 với prompt phân loại, hoặc dùng regex đơn giản ở MVP.

### 7.3. Context assembly

Khi học viên gửi message, backend tổng hợp context theo thứ tự ưu tiên:
1. Lesson objectives (từ DB).
2. Code snapshot mới nhất từ Sandbox Service (gọi `GET /sandboxes/:id/snapshot`).
3. Stack trace lỗi gần nhất (nếu user đang debug).
4. 5 message gần nhất trong session.
5. User message hiện tại.

Tổng context budget: 8K tokens. Truncate code nếu quá dài, ưu tiên giữ phần liên quan dòng lỗi.

---

## 8. CHỨNG CHỈ BLOCKCHAIN `[V2]` — schema sẵn sàng từ MVP

MVP: cấp PDF + record DB + URL `/verify/:publicId` show "Verified by Educata".

V2: anchor hash của certificate metadata lên Polygon (chi phí thấp). Smart contract đơn giản:

```solidity
contract EducataCerts {
  mapping(bytes32 => uint256) public anchored; // hash → blockNumber
  event CertAnchored(bytes32 indexed hash, address indexed issuer);
  function anchor(bytes32 hash) external onlyIssuer { ... }
}
```

Verify URL fetch: `(metadata) → keccak256 → contract.anchored(hash) > 0 ? valid : invalid`.

---

## 9. PHỄU BÁN HÀNG HIGH-TICKET `[MVP partial]`

### 9.1. Trang cần xây cho MVP

1. **Landing** (`/`) — hero + ICP qualifier + lead magnet form.
2. **Lead magnet** (`/resources/ai-engineer-salary-2025`) — gated content.
3. **Webinar registration** (`/webinar/[slug]`).
4. **Apply to Enroll** (`/apply`) — KHÔNG có nút "Mua ngay". Form 7-10 câu sàng lọc.
5. **Booking consultation** (`/book`) — Cal.com hoặc Calendly embed.
6. **Pricing** (`/pricing`) — show 3 options: Pay upfront / Installment / ISA.

### 9.2. Lead scoring `[V2]`

Quy tắc đơn giản:

```
+10 điểm: nghề nghiệp = "Software Engineer / Developer"
+15 điểm: kinh nghiệm > 2 năm
+20 điểm: đã hoàn thành lead magnet
+25 điểm: đăng ký webinar
+30 điểm: tham dự webinar > 30 phút
+50 điểm: submit Apply form

Score >= 80 → tự động assign sales rep, gửi link booking.
Score 40-79 → vào nurture sequence (email).
Score < 40 → giữ trong pool, retarget.
```

---

## 10. ĐỊNH GIÁ — IMPLEMENTATION

### 10.1. Pricing tiers `[MVP]`

| Tier | Giá | Mô tả |
|---|---|---|
| Free Foundations | 0đ | 3 lessons đầu của course Foundation |
| Pro Bootcamp | 35,000,000đ | Full course AI Agent Engineer (12 tuần) |
| Pro + Job Guarantee (ISA) | 0đ upfront | 15% lương × 36 tháng, min 20tr/tháng, cap 60tr |
| B2B Enterprise (OBC) | thỏa thuận | Min 10 ghế, milestone-based |

### 10.2. Công thức ISA LTV (để bộ phận finance & dashboard dùng)

```
LTV_ISA = Σ (S_t × α) / (1 + r)^t   với t = 1..N

Trong đó:
  S_t  = lương tháng t (có growth assumption ~ 8%/năm)
  α    = sharePct (vd 0.15)
  N    = durationMonths (vd 36)
  r    = discount rate hàng tháng của Educata (vd 0.01)
  capVnd = trần
```

Implement utility function tại `packages/shared-types/src/finance/isa.ts`:

```typescript
export function projectIsaLtv(params: {
  startingSalaryVnd: number;
  annualGrowthRate: number;     // 0.08
  sharePct: number;             // 0.15
  durationMonths: number;
  monthlyDiscountRate: number;  // 0.01
  capVnd?: number;
}): { totalNominal: number; totalDiscounted: number; cappedAt?: number } { ... }
```

---

## 11. PHÁP LÝ & TUÂN THỦ VN `[MVP awareness — V2 implement]`

Trước khi launch công khai, Claude CLI **không cần** code phần này nhưng PHẢI:

1. Tạo file `docs/COMPLIANCE_VN.md` ghi rõ:
   - Đăng ký hoạt động giáo dục thường xuyên với Sở LĐ-TB&XH (cho khóa < 3 tháng).
   - Vốn pháp định: Trung tâm GDNN 5 tỷ, Trung cấp 50 tỷ, Cao đẳng 100 tỷ.
   - Văn bằng chính quy: online ≤ 30% tổng khối lượng (Thông tư 13/2021/TT-BGDĐT).
   - Công nhận quốc tế: VN-NARIC.

2. Schema `Lesson.deliveryMode` (đã có) cho phép sau này tính tỷ lệ online tự động.

3. Tách 2 loại chứng chỉ:
   - **Professional Certificate** (Educata cấp, không có VQF mapping) → sẵn ở MVP.
   - **Recognized Diploma** (cần partner với cơ sở GDNN) → V3.

---

## 12. SECURITY CHECKLIST `[MVP]`

- [ ] Password: bcrypt cost 12.
- [ ] JWT: HS256 với secret 256-bit lưu trong env, KHÔNG hardcode.
- [ ] Rate limit: `/auth/login` 5 req/phút/IP, các endpoint khác 60 req/phút/user.
- [ ] CORS: whitelist domain frontend, không `*`.
- [ ] Input validation: dùng `class-validator` (NestJS) ở mọi DTO.
- [ ] SQL injection: chỉ dùng Prisma (không raw query trừ migration).
- [ ] XSS: sanitize markdown render bằng DOMPurify ở frontend.
- [ ] Sandbox: network policy egress whitelist, không cho gọi internal services.
- [ ] LLM proxy: rate limit per-user, log đầy đủ prompt + response để audit (PII redact).
- [ ] Secret management: dev dùng `.env`, prod dùng Vault/AWS Secrets Manager.
- [ ] HTTPS bắt buộc, HSTS header.
- [ ] OWASP top 10 review trước khi launch.

---

## 13. ROADMAP TRIỂN KHAI THEO SPRINT (CLAUDE CLI ĐỌC TỪ TRÊN XUỐNG)

### Sprint 0 — Khởi tạo (1 tuần)
- [ ] Khởi tạo monorepo với Turborepo.
- [ ] Setup `apps/web` (Next.js 14 + Tailwind + shadcn/ui).
- [ ] Setup `apps/api` (NestJS + Prisma + Postgres trong Docker Compose).
- [ ] Setup CI cơ bản (lint + typecheck + test).
- [ ] Tạo `docs/` đầy đủ stub theo cấu trúc mục 3.2.

### Sprint 1 — Auth + Course catalogue (2 tuần)
- [ ] User register/login/refresh/logout/me.
- [ ] Migration đầy đủ schema mục 4.
- [ ] Seed 1 course mẫu "AI Agent Foundations" với 3 modules × 4 lessons.
- [ ] Trang `/courses`, `/courses/[slug]`, `/dashboard`.

### Sprint 2 — Course player + Sandbox tích hợp (2 tuần)
- [ ] Trang `/learn/[courseSlug]/[lessonSlug]` — render markdown, embed sandbox.
- [ ] Tích hợp Coder/Gitpod (chọn 1) cho sandbox.
- [ ] LLM Proxy MVP (Node service forward Anthropic/OpenAI).
- [ ] Lesson type `CONCEPT` + `GUIDED_LAB` chạy được end-to-end.

### Sprint 3 — Submission + Autograder (2 tuần)
- [ ] Submit API + queue (BullMQ trên Redis).
- [ ] Grader runs trong worker container — chạy pytest hoặc custom validator.
- [ ] UI hiển thị kết quả + retry.

### Sprint 4 — Socratic AI Tutor (2 tuần)
- [ ] System prompt + guardrail layer.
- [ ] UI chat panel cạnh sandbox.
- [ ] Context assembly từ lesson + code + error.
- [ ] Logging `socraticScore`.

### Sprint 5 — Certificates + Progress + Funnel landing (1.5 tuần)
- [ ] Tự động cấp Professional Certificate khi enrollment.completedAt set.
- [ ] PDF generation + public verify URL.
- [ ] Landing page + Apply form + booking embed.

### Sprint 6 — Polish + Launch beta (1 tuần)
- [ ] Performance audit (Lighthouse > 90).
- [ ] Security checklist mục 12.
- [ ] Onboard 20 beta học viên.

**Tổng MVP: ~11.5 tuần.**

---

## 14. MENTAL MODEL CHO CLAUDE CLI KHI BUILD

Khi gặp một quyết định không có trong file này, áp dụng thứ tự ưu tiên:

1. **Differentiation trước, scale sau.** Nếu chọn giữa "thêm tính năng giống Coursera" và "đào sâu tính Socratic / Sandbox", luôn chọn vế thứ hai.
2. **Build cho người học vừa code vừa học, không phải xem.** UI mặc định luôn là split-view: nội dung trái + IDE phải.
3. **Tránh video dài quá 3 phút.** Nếu cần giải thích nhiều, viết markdown + interactive widget.
4. **AI Tutor không bao giờ giải quyết vấn đề thay học viên.** Nếu nghi ngờ, sai về phía hỏi nhiều hơn.
5. **Mỗi feature mới phải trả lời được:** "Cái này thuộc Eliminate / Reduce / Raise / Create nào của ERRC?" Nếu không thuộc cái nào → có thể đang lạc đề.
6. **Schema-first.** Trước khi viết controller, viết Prisma model + DTO + tests.
7. **Vietnamese first, English-friendly.** UI tiếng Việt mặc định, nhưng codebase + identifier bằng tiếng Anh.
8. **Lưu mọi event quan trọng vào DB** (enrollment, submission, tutor interaction, certificate issue) — đây là dữ liệu tài sản để chạy OBC sau này.

---

## 15. NHỮNG GÌ CLAUDE CLI **KHÔNG** ĐƯỢC LÀM

- ❌ KHÔNG dùng video bài giảng > 5 phút làm phương tiện chính.
- ❌ KHÔNG implement bài kiểm tra trắc nghiệm như công cụ đánh giá năng lực chính (chỉ dùng cho concept check phụ).
- ❌ KHÔNG để AI Tutor trả lời trực tiếp lời giải.
- ❌ KHÔNG dùng pricing per-seat như mô hình mặc định cho B2B.
- ❌ KHÔNG hard-code khóa API LLM ở frontend hoặc trong sandbox của học viên.
- ❌ KHÔNG bỏ qua bước verify endpoint công khai cho certificate (phòng giả mạo).
- ❌ KHÔNG triển khai văn bằng "chính quy" mà chưa có pháp nhân GDNN tương ứng.

---

## 16. NEXT STEP CHO CLAUDE CLI NGAY KHI ĐỌC XONG

```bash
# 1. Tạo monorepo
npx create-turbo@latest socratic-hub
cd socratic-hub

# 2. Tạo apps/web
cd apps && npx create-next-app@14 web --typescript --tailwind --app --src-dir=false

# 3. Tạo apps/api
nest new api --package-manager npm
cd api && npm i @prisma/client && npx prisma init

# 4. Copy schema từ mục 4 vào apps/api/prisma/schema.prisma

# 5. Khởi tạo Postgres + Redis bằng docker-compose

# 6. Tạo docs/ với 6 file stub theo mục 3.2

# 7. Bắt đầu Sprint 0 → Sprint 1
```

Sau bước 7, đọc lại mục 13 và bắt đầu implement theo sprint, mỗi sprint kết thúc bằng một PR có demo chạy được.

---

**End of blueprint. Build with discipline. Stay in the blue ocean.**

---

## 17. DECISIONS LOG POST-2026-04-26 — OVERRIDES

> **Authoritative source:** `CLAUDE.md` (project root). Các quyết định dưới đây OVERRIDE các mục tương ứng trong §3-§16. Khi có mâu thuẫn, CLAUDE.md > BLUEPRINT.

### D1 — Sandbox approach M1 (override §6.2)
- **Quyết định:** Dùng **WebContainers (StackBlitz SDK)** thay vì Coder OSS K8s cho M1.
- **Ngôn ngữ runtime:** TypeScript/Node.js only. Course "AI Agent Foundations" dạy bằng TypeScript SDK (Anthropic SDK, Vercel AI SDK, LangChain.js) thay Python.
- **Lý do:** Zero infra (in-browser), faster M1 demo, không cần Docker/K8s. Trade-off: mất Python ecosystem nhưng AI Agent core concepts dạy được tốt qua TS.
- **Defer:** Coder OSS K8s tới V2 khi cần Python heavy (chấm bài Pytorch, etc.).

### D2 — Monorepo scope M1 (override §3.2)
- **Quyết định:** M1 chỉ build **2 apps**: `apps/web` (Next.js 14) + `apps/api` (NestJS).
- **Logic merge:** `apps/sandbox-orchestrator` → module trong `apps/api`. `apps/tutor-worker` → module trong `apps/api` (background job qua BullMQ ở Sprint 4). `apps/llm-proxy` → module trong `apps/api`.
- **Lý do:** Giảm complexity ops, vẫn cùng codebase. Tách app riêng khi scale (M2+).
- **Packages giữ nguyên:** `packages/shared-types`, `packages/ui-kit` (nếu cần), defer các package khác.

### D3 — LLM Provider mặc định (override §6.3)
- **Quyết định:** Provider mặc định = **Groq** (`https://api.groq.com/openai/v1`), model = `llama-3.3-70b-versatile`.
- **Fallback:** Claude Sonnet 4.6 — kích hoạt khi `socraticScore < 0.7` (test bằng promptfoo trong S4-04).
- **Defer:** OpenAI hoàn toàn cho M1.
- **Lý do:** Free tier đủ M1, tốc độ cao, giảm cost cho early beta.

### D4 — Database hosting dev (clarify §11)
- **Quyết định:** Dev dùng **Neon** (managed Postgres, US-based) cho tốc độ setup.
- **Compliance plan:** Migration sang VN host (Viettel/MCC/FPT) trước khi launch công khai (M3 trở đi). M1 + early private beta OK với Neon.

### D5 — Per-sprint token budget
- **Quyết định:** S0=$5, S1=$8, S2=$8, S3=$15, S4=$15, S5=$5. Total $56.
- **Hard cap M1:** $80 (bất biến).
- **Trip-wire per feature:** > $5 → STOP review. Per sprint: vượt 50% budget → STOP review.

---

**v1.1 Changelog (2026-04-26):**
- Update §6.3 LLM Proxy với Groq + multi-provider routing
- Add §17 Decisions log post-planning P1
