# DBP AI Prototype — XaC

**DBP_AI_Prototype_XaC** is an AI prototype environment for the **DBP XaC** initiative. It demonstrates how entrepreneur-facing AI experiences—recommendations, concierge guidance, and semantic discovery—can be built on a normalized knowledge base with a **frontend-first**, **mock-ready**, and **Supabase-backed** architecture.

This repository is a **working prototype**, not a production platform. It prioritizes interaction flows, AI experience simulation, and scalable patterns that can evolve toward runtime orchestration, real auth, and vector retrieval.

---

## Table of Contents

1. [Overview](#overview)
2. [Initiative Context](#initiative-context)
3. [Current Prototype Goals](#current-prototype-goals)
4. [Current Architecture](#current-architecture)
5. [Tech Stack](#tech-stack)
6. [Repository Structure](#repository-structure)
7. [AI Prototype Features](#ai-prototype-features)
8. [Knowledge Base Architecture](#knowledge-base-architecture)
9. [Data Ingestion Pipeline](#data-ingestion-pipeline)
10. [Mock Personalization Layer](#mock-personalization-layer)
11. [Current User Flows](#current-user-flows)
12. [Setup](#setup)
13. [Environment Variables](#environment-variables)
14. [Local Development](#local-development)
15. [Knowledge Base Seeder](#knowledge-base-seeder)
16. [AI Retrieval Layer](#ai-retrieval-layer)
17. [Railway Deployment](#railway-deployment)
18. [Current Project Status](#current-project-status)
19. [Planned Next Steps](#planned-next-steps)
20. [Governance Notes](#governance-notes)
21. [Contribution Notes](#contribution-notes)

---

## Overview

The prototype simulates an AI-enabled entrepreneur portal for the UAE SME ecosystem. It combines:

- **Normalized domain data** (Services, Courses, Events) sourced from BMC/eJP-style datasets
- **A Supabase PostgreSQL knowledge base** (`kb_services`, `kb_courses`, `kb_events`)
- **Client-side AI service scaffolding** (recommendation, retrieval, concierge)
- **Mock user personas** with Zustand-driven personalization context
- **Dual experiences** for logged-in demo users and guests
- **Deployable frontend** on Railway via static build + `serve`

The frontend consumes **bundled JSON datasets** for retrieval and recommendations today. Supabase is the **system of record** for seeded knowledge and future live queries; the UI does not yet call Supabase directly for retrieval.

---

## Initiative Context

| Item | Description |
|------|-------------|
| **Program** | DBP XaC (Experience as Code) |
| **Repository** | `DBP_AI_Prototype_XaC` |
| **Purpose** | Validate AI UX patterns, data normalization, KB seeding, and deployment before investing in full backend orchestration |
| **Audience** | Product, engineering, and stakeholder demos |

---

## Current Prototype Goals

- Prove **AI-native UX** patterns (dashboard, recommendations, concierge, discovery)
- Validate **knowledge normalization** across Services, Courses, and Events
- Establish a **repeatable Supabase seeding pipeline** for prototype environments
- Support **persona-based personalization** without production auth
- Keep architecture **frontend-first** with a reserved backend scaffold
- Prepare for **semantic retrieval and embeddings** without claiming they are production-complete

---

## Current Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DBP AI Prototype (XaC)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  React SPA (Vite)                                                       │
│  ├── Routes & AppLayout                                                 │
│  ├── Zustand (auth + saved items)                                       │
│  ├── AI Services (recommendation / retrieval / concierge)               │
│  └── Normalized JSON datasets (services, courses, events)               │
├─────────────────────────────────────────────────────────────────────────┤
│  Standalone Seeder (Node + ts-node)                                     │
│  └── scripts/seedKnowledgeBase.ts → Supabase kb_* tables                │
├─────────────────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                                                  │
│  ├── kb_services                                                        │
│  ├── kb_courses                                                         │
│  └── kb_events                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  Backend scaffold (reserved) — Express deps, no runtime API yet           │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Railway (static frontend deploy)
                    GitHub (source control)
```

### Why Frontend-First?

| Decision | Rationale |
|----------|-----------|
| **UI and AI flows first** | Stakeholders need clickable demos before API contracts are finalized |
| **Mock auth & personalization** | Personas can be switched instantly for workshops and reviews |
| **JSON + Supabase dual path** | Fast local iteration; Supabase holds the canonical KB for future APIs |
| **Thin backend scaffold** | Avoids premature orchestration; `backend/` is reserved for future agents/runtime |

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui patterns, Zustand, React Router 7, lucide-react |
| **Knowledge ingestion** | Node.js, ts-node, `@supabase/supabase-js`, dotenv |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Railway (`serve` static), GitHub |
| **Backend (scaffold)** | Express 5 + TypeScript tooling (not wired to UI) |

---

## Repository Structure

```
DBP_AI_Prototype_XaC/
├── README.md
├── package.json                 # Root tooling: npm run seed:kb
├── tsconfig.scripts.json
├── scripts/
│   ├── seedKnowledgeBase.ts     # KB ingestion entrypoint
│   ├── config/supabase.ts
│   ├── loaders/jsonLoader.ts
│   ├── seeders/                 # services, courses, events
│   ├── validators/recordValidator.ts
│   ├── utils/
│   └── sql/grant_kb_tables.sql  # Required Postgres GRANTs
├── frontend/
│   ├── package.json             # Vite app; Railway start script
│   ├── vite.config.ts
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── assets/
│       ├── components/          # cards, concierge, dashboard, layout, navigation, ui
│       ├── context/             # ThemeContext (dark mode)
│       ├── data/                # services.json, courses.json, events.json
│       ├── hooks/               # useRecommendations
│       ├── layouts/             # AppLayout
│       ├── lib/                 # utils, theme
│       ├── mocks/users/         # mockProfiles.ts
│       ├── pages/               # dashboard, recommendations, saved, concierge, discover, browse
│       ├── routes/              # appRoutes, ProtectedRoute
│       ├── services/ai/         # recommendationEngine, retrievalService, conciergeService, embeddingService (stub)
│       ├── store/               # authStore, savedItemsStore
│       ├── styles/
│       └── types/               # user.ts, knowledge.ts
└── backend/                     # Scaffold only (Express + TS deps)
```

---

## AI Prototype Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Dashboard** | Implemented | Profile summary, stats, featured retrieval |
| **AI Recommendations** | Implemented | Tag/stage scoring via `recommendationEngine.ts` |
| **Saved Items** | Implemented | Local Zustand mock state |
| **Concierge AI** | Implemented | Mock conversational responses + retrieval simulation |
| **Discover Services** | Implemented | Search and filters via `retrievalService.ts` |
| **Browse Events/Courses** | Implemented | Tabbed learning browser + profile suggestions |
| **Dark mode** | Implemented | Theme toggle, `localStorage` persistence |
| **Mock personas** | Implemented | 5 profiles via profile switcher |
| **Protected routes** | Implemented | Simulated login gate for logged-in pages |
| **Embeddings** | Scaffold only | `embeddingService.ts` is empty |
| **Production auth** | Not implemented | Mock Zustand only |
| **Live Supabase reads in UI** | Not implemented | UI uses bundled JSON |

---

## Knowledge Base Architecture

### Domains

| Domain | Supabase table | Source data |
|--------|----------------|-------------|
| Services | `kb_services` | `frontend/src/data/services.json` |
| Courses | `kb_courses` | `frontend/src/data/courses.json` |
| Events | `kb_events` | `frontend/src/data/events.json` |

### Design Principles

- Records are **normalized** from BMC/eJP-style sources into AI-ready JSON
- Each record includes **tags**, **business stage**, **searchable_content**, and domain-specific metadata
- **`slug`** is the idempotent key for seeding (duplicate skip on re-run)
- Table shapes align with JSON fields to support future API and embedding pipelines

### Required Supabase Grants

After creating tables, run `scripts/sql/grant_kb_tables.sql` in the Supabase SQL Editor so `service_role` (seeder) and `anon` (future client reads) can access `kb_*` tables.

---

## Data Ingestion Pipeline

```
frontend/src/data/*.json
        │
        ▼
scripts/loaders/jsonLoader.ts
        │
        ▼
scripts/validators/recordValidator.ts   (minimal field validation)
        │
        ▼
scripts/seeders/*Seeder.ts              (slug duplicate check → insert)
        │
        ▼
Supabase: kb_services | kb_courses | kb_events
```

**Characteristics:**

- Idempotent re-runs (skips existing slugs)
- Validation warnings for malformed records
- Service role key required for seeding (bypasses RLS; still needs table GRANTs)
- Console summary: inserted / skipped / validation errors

---

## Mock Personalization Layer

### Personas (`frontend/src/mocks/users/mockProfiles.ts`)

| Profile ID | Description |
|------------|-------------|
| `guest` | Unauthenticated explorer (default) |
| `startup_founder` | Launch-stage technology founder |
| `growth_sme` | Growth-stage retail/e-commerce SME |
| `agritech_founder` | Sustainability/agritech focus |
| `student_entrepreneur` | Idea-stage learning-oriented user |

### State (`frontend/src/store/authStore.ts`)

- **`currentUser`** / **`isAuthenticated`**
- **`loginAs`**, **`logout`**, **`switchProfile`**
- Selectors for recommendation context (business stage, interests, tags, goals)
- Uses **Zustand `useShallow`** to avoid unstable selector re-render loops

### Saved Items (`frontend/src/store/savedItemsStore.ts`)

- Local prototype bookmark state (not persisted to Supabase)

---

## Current User Flows

### Route Map

| Route | Access | Experience |
|-------|--------|------------|
| `/` | All | Redirects to `/dashboard` (authenticated) or `/concierge` (guest) |
| `/dashboard` | Logged-in (mock) | Welcome, profile, stats, featured content |
| `/recommendations` | Logged-in (mock) | Personalized services, events, courses |
| `/saved` | Logged-in (mock) | Saved items by domain |
| `/concierge` | All | AI chat (guest + logged-in) |
| `/discover` | All | Service search and filters |
| `/browse` | All | Events and courses browser |

### Logged-In vs Guest

```
Guest ──► Concierge, Discover, Browse
         (Dashboard / Recommendations / Saved require demo login)

Demo login ──► Profile switcher or ProtectedRoute actions
              ──► Full logged-in prototype flow
```

---

## Setup

### Prerequisites

- **Node.js** 20+ (recommended)
- **npm**
- **Supabase project** (URL, anon key, service role key)
- **Git**

### Clone

```bash
git clone <your-repo-url>
cd DBP_AI_Prototype_XaC
```

### Install Dependencies

```bash
# Root (KB seeder)
npm install

# Frontend
cd frontend
npm install
```

---

## Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Used by | Description |
|----------|---------|-------------|
| `VITE_SUPABASE_URL` | Frontend (future), seeder | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend (future), seeder fallback | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Seeder only (`npm run seed:kb`) | Service role secret — **never expose in client bundles** |

> **Security:** Only `VITE_*` variables are intended for the browser. Keep `SUPABASE_SERVICE_ROLE_KEY` for local seeding and CI scripts only.

---

## Local Development

### Run the frontend

```bash
cd frontend
npm run dev
```

Default Vite dev server: `http://localhost:5173`

### Build for production

```bash
cd frontend
npm run build
npm run preview
```

### Lint

```bash
cd frontend
npm run lint
```

### Prototype tips

- Use the **profile switcher** in the header to change personas
- Use **Demo login** for quick access to protected pages
- Toggle **dark/light mode** via the sun/moon control in the navbar

---

## Knowledge Base Seeder

From the repository root:

```bash
npm run seed:kb
```

### Before seeding

1. Create `kb_services`, `kb_courses`, `kb_events` in Supabase (matching JSON field shapes)
2. Run `scripts/sql/grant_kb_tables.sql` in the SQL Editor
3. Set `frontend/.env` with `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Expected output (example)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
DBP AI KNOWLEDGE BASE SEEDER
━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Services inserted: N
✓ Courses inserted: N
✓ Events inserted: N
⚠ Skipped records: N (duplicates or validation)
✓ Seeder completed successfully
```

---

## AI Retrieval Layer

| Module | Path | Current behavior |
|--------|------|------------------|
| **Retrieval** | `frontend/src/services/ai/retrievalService.ts` | Loads bundled JSON; search, filter, context-aware `retrieveForUser` |
| **Recommendations** | `frontend/src/services/ai/recommendationEngine.ts` | Scores items by tags, stage, interests, capabilities |
| **Concierge** | `frontend/src/services/ai/conciergeService.ts` | Mock LLM-style responses routed by intent; uses retrieval |
| **Embeddings** | `frontend/src/services/ai/embeddingService.ts` | **Stub** — reserved for vector pipeline |

### Personalization flow

```
mockProfiles / authStore
        │
        ▼
UserRecommendationContext
        │
        ├──► recommendationEngine → Recommendations UI
        ├──► retrievalService → Discover / Browse / Dashboard
        └──► conciergeService → Concierge chat
```

### Future direction

- Wire UI retrieval to Supabase PostgREST or Edge Functions
- Add `embeddingService` + vector column search in Supabase
- Optional backend orchestration for agent runtime and tool calling

---

## Railway Deployment

The frontend is configured for Railway static hosting:

| Setting | Value |
|---------|--------|
| **Root directory** | `frontend` |
| **Build command** | `npm install && npm run build` |
| **Start command** | `npm run start` (runs `serve -s dist -l $PORT`) |

Railway injects `$PORT` automatically. No backend service is required for the current prototype.

### GitHub integration

Connect the repository to Railway via GitHub for automatic deploys on push. Ensure build/start commands target the `frontend` directory.

### Environment on Railway

For future Supabase client usage in the browser, set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do **not** set `SUPABASE_SERVICE_ROLE_KEY` on the Railway frontend service.

---

## Current Project Status

### Completed

- [x] Prototype repository and AI-ready folder structure
- [x] React + TypeScript + Vite prototype shell
- [x] Normalized Services / Courses / Events JSON datasets
- [x] Supabase KB seeding pipeline (`scripts/`)
- [x] Mock user profiles and Zustand auth store
- [x] Logged-in and guest prototype screens
- [x] Recommendation, retrieval, and concierge service implementations (mock/scoring)
- [x] Stable routing, protected route simulation, error boundary
- [x] Dark mode with persistence
- [x] Railway-ready frontend build (`serve` + `$PORT`)

### In progress / scaffold only

- [ ] `embeddingService.ts` — not implemented
- [ ] `backend/` — Express scaffold, no API surface
- [ ] Live Supabase queries from the frontend
- [ ] Supabase Auth integration
- [ ] Production LLM / agent runtime

---

## Planned Next Steps

1. **Connect frontend retrieval** to Supabase `kb_*` tables (read path)
2. **Implement embeddings pipeline** and vector search in Supabase
3. **Introduce backend runtime** for agent orchestration and secure server-side AI calls
4. **Replace mock concierge** with governed LLM integration (prompt + retrieval grounding)
5. **Harden auth** with Supabase Auth and map `supabaseUserId` on profiles
6. **Expand knowledge domains** and refresh seeding from upstream BMC/eJP exports
7. **Observability** — logging, analytics, and evaluation harness for recommendations

---

## Governance Notes

- This repository is a **prototype** under the DBP XaC initiative; patterns here inform production design but are not production guarantees.
- **Service role keys** must never be committed or exposed in frontend builds.
- Knowledge base content is derived from **normalized prototype datasets**; upstream data governance applies to source systems (BMC/eJP).
- AI responses in the concierge are **simulated**; do not treat them as regulated advice or official government guidance.
- Before wider distribution, review **PII**, **licensing**, and **content accuracy** with program owners.

---

## Contribution Notes

### Branching and PRs

- Use feature branches from `main` (or your team’s default branch)
- Keep PRs focused: UI flows, seeder changes, and KB schema updates should be separable
- Do not commit `frontend/.env` or secrets

### Code conventions

- **TypeScript strict** in frontend and scripts
- **Zustand selectors** must be stable (`useShallow` for object selectors)
- **AI services** stay in `frontend/src/services/ai/` until backend orchestration exists
- **New KB fields** require updates to JSON data, types, validators, and seeders together

### Local verification checklist

```bash
cd frontend && npm run build
cd .. && npm run seed:kb    # against a dev Supabase project
```

### Questions or ownership

Contact the **DBP XaC / AI prototype** program owners for access to Supabase projects, Railway services, and roadmap prioritization.

---

<p align="center">
  <strong>DBP AI Prototype — XaC</strong><br>
  Frontend-first · Supabase-backed · AI-ready architecture
</p>
