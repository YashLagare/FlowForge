# FlowForge

Browser automation platform with a visual, real-time collaborative node-based workflow builder.

**Business Problem Solved:** Automating repetitive browser tasks without requiring deep coding knowledge. Allows teams to collaboratively build and execute web automation workflows.
**Target Users:** Marketing teams, data entry specialists, developers, and QA engineers.
**Business Value:** Increases productivity, reduces manual browser interactions, enables seamless collaboration on automation scripts, and provides a clear visual representation of complex automation logic.
**Last Updated:** July 2026

**Repository Structure Summary:**
A modern Next.js 16 monorepo-style structure utilizing the App Router. The application is divided by domain logic in the `features/` directory and routed through `app/`. It integrates heavily with external managed services for authentication, database, real-time collaboration, and background task execution.

[INSERT_PROJECT_COVER_SCREENSHOT]

---

## Table of Contents

- [1 Executive Summary](#1-executive-summary)
- [2 Project Overview](#2-project-overview)
- [3 Technology Stack](#3-technology-stack)
- [4 System Architecture](#4-system-architecture)
- [5 Repository Structure](#5-repository-structure)
- [6 Features](#6-features)
- [7 UI Screenshots](#7-ui-screenshots)
- [8 Database Design](#8-database-design)
- [9 Entity Relationship Diagram](#9-entity-relationship-diagram)
- [10 Security](#10-security)
- [11 Authentication](#11-authentication)
- [12 API Documentation](#12-api-documentation)
- [13 Third-party Services](#13-third-party-services)
- [14 Environment Variables](#14-environment-variables)
- [15 Major Dependencies](#15-major-dependencies)
- [16 Installation Guide](#16-installation-guide)
- [17 Deployment](#17-deployment)
- [18 Request Lifecycle](#18-request-lifecycle)
- [19 Performance](#19-performance)
- [20 Security Review](#20-security-review)
- [21 Challenges & Engineering Decisions](#21-challenges--engineering-decisions)
- [22 Future Improvements](#22-future-improvements)
- [23 Developer Notes](#23-developer-notes)

---

## 1 Executive Summary

**Purpose:** Provide a scalable, real-time collaborative platform for designing and executing browser automation workflows.
**Key Capabilities:** Visual workflow building, multi-player collaboration, reliable background execution of browser actions, and role/plan-based access control.
**Technology Summary:** Built with Next.js (React 19), styled with Tailwind CSS v4, backed by a Neon Serverless Postgres database via Drizzle ORM, and leveraging Trigger.dev for asynchronous task execution. Authentication is handled by Clerk, and real-time collaboration by Liveblocks.
**Architecture Summary:** Serverless client-server architecture utilizing Next.js Server Actions for mutations, an external database, and external specialized managed services for auth, real-time sync, and background jobs.
**Business Value:** Accelerates automation development through visual tools and team collaboration while ensuring reliable execution via dedicated background runners and robust browser orchestration.

---

## 2 Project Overview

**Objective:** To simplify the creation and execution of browser automation scripts.
**Scope:** Covers authentication, organization management, workflow creation/editing (via a visual canvas), billing/subscription gating, and background execution of defined workflows.
**Primary Modules:**
- Landing/Marketing module.
- Authentication & Dashboard.
- Collaborative Workflow Canvas.
- Execution Engine (Trigger.dev + Stagehand).
**Target Audience:** Non-technical operators and developers looking to quickly script web interactions.
**Real-world Use Cases:** Automated data scraping, regular UI testing, form filling, and scheduled web monitoring.

---

## 3 Technology Stack

### Frontend
| Technology | Description |
|---|---|
| Next.js (App Router) | React Framework for SSR and routing. |
| React 19 | UI Library. |
| React Flow (@xyflow/react) | Node-based visual graph editor. |
| @liveblocks/react | Real-time collaboration hooks. |

### Backend
| Technology | Description |
|---|---|
| Next.js Server Actions | Server-side mutations. |
| Trigger.dev | Background job processing and durable execution. |

### Database
| Technology | Description |
|---|---|
| Neon | Serverless PostgreSQL. |
| Drizzle ORM | TypeScript ORM. |

### Authentication & Authorization
| Technology | Description |
|---|---|
| Clerk | Auth and Organization management. |

### State Management & Real-time
| Technology | Description |
|---|---|
| Liveblocks | Multi-player presence and document state synchronization. |

### Styling & UI
| Technology | Description |
|---|---|
| Tailwind CSS v4 | Utility-first CSS framework. |
| shadcn/ui & Radix UI | Accessible, customizable UI components. |
| Framer Motion | Animation library. |

### Background & Automation
| Technology | Description |
|---|---|
| Stagehand (@browserbasehq) | Browser automation framework. |

### DevOps & Tooling
| Technology | Description |
|---|---|
| Sentry | Error tracking and performance monitoring. |
| Resend | Transactional email delivery. |
| TypeScript | Static typing. |
| ESLint / Prettier | Linting and formatting. |

---

## 4 System Architecture

The application follows a modern Serverless/Hybrid architecture. The frontend and lightweight backend logic (Server Actions/API Routes) are hosted on a serverless platform (e.g., Vercel). Heavy background tasks (browser automation) are dispatched to Trigger.dev workers. Real-time canvas synchronization bypasses the main backend entirely, connecting clients directly to Liveblocks servers. Authentication state is verified on the edge/server via Clerk.

```text
+-------------------------------------------------------+
|                       Clients (Browser)               |
|  (React, React Flow, Liveblocks Client, Clerk UI)     |
+---------+--------------------+------------------+-----+
          |                    |                  |
      HTTPS (UI/API)    WebSocket (Yjs/Presence)  |
          |                    |                  | HTTPS (Auth)
          v                    v                  v
+-------------------+  +---------------+  +---------------+
| Next.js App       |  |  Liveblocks   |  |     Clerk     |
| (Server Actions,  |  |  (Real-time   |  | (Auth, Orgs,  |
|  Server Comps)    |  |   Sync)       |  |  Billing)     |
+---------+---------+  +---------------+  +---------------+
          |
    HTTPS (DB, Jobs, Logs)
          |
          v
+-------------------------------------------------------+
|                  External Services                    |
|                                                       |
|  +--------------+  +-------------+  +--------------+  |
|  | Neon Postgres|  | Trigger.dev |  | Browserbase  |  |
|  | (via Drizzle)|  | (Job Runner)|  | (Automation) |  |
|  +--------------+  +-------------+  +--------------+  |
|                                                       |
|  +--------------+  +-------------+                    |
|  |   Sentry     |  |   Resend    |                    |
|  | (Monitoring) |  |  (Emails)   |                    |
|  +--------------+  +-------------+                    |
+-------------------------------------------------------+
```

---

## 5 Repository Structure

```text
/
├── app/                      # Next.js App Router definitions
│   ├── (auth)/               # Clerk authentication routes (sign-in, sign-up, orgs)
│   ├── (dashboard)/          # Authenticated app routes (dashboard, workflows, billing)
│   ├── (marketing)/          # Public landing and legal pages
│   └── api/                  # Next.js API routes (Liveblocks auth, replays)
├── components/               # Shared UI components (shadcn/ui, base components)
├── features/                 # Domain-driven feature modules
│   ├── landing/              # Landing page specific logic/components
│   └── workflows/            # Core workflow domain
│       ├── actions.ts        # Server actions for workflow CRUD and execution
│       ├── components/       # Canvas, nodes, and workflow UI
│       ├── data.ts           # Data fetching logic
│       ├── hooks/            # Custom React hooks
│       ├── nodes/            # React Flow node definitions
│       └── tasks/            # Trigger.dev background tasks (run-workflow.ts)
├── lib/                      # Global utilities and configurations
│   ├── db/                   # Drizzle schema and migrations
│   └── liveblocks/           # Liveblocks client configuration
├── public/                   # Static assets
├── .env.example              # Environment variable templates
├── drizzle.config.ts         # Drizzle ORM configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
└── trigger.config.ts         # Trigger.dev configuration
```

---

## 6 Features

**User Authentication & Organization Management**
- **Purpose:** Secure access and group users into collaborative teams.
- **Business Value:** Enables B2B SaaS usage and team-based collaboration.
- **Main Components:** Clerk Next.js middleware, `app/(auth)` routes.
- **Dependencies:** `@clerk/nextjs`.

**Visual Workflow Builder**
- **Purpose:** Allow users to construct automation scripts visually.
- **Business Value:** Lowers the barrier to entry for browser automation.
- **Main Components:** React Flow canvas, Liveblocks provider, custom node components (`features/workflows/nodes`).
- **Dependencies:** `@xyflow/react`, `@liveblocks/react-flow`.

**Real-time Collaboration**
- **Purpose:** Enable multiple users in the same organization to edit a workflow simultaneously.
- **Business Value:** Improves team productivity and prevents conflicting edits.
- **Main Components:** Liveblocks room, presence cursors.
- **Dependencies:** `@liveblocks/react`, `@liveblocks/node`.

**Workflow Execution Engine**
- **Purpose:** Run constructed workflows in the background reliably.
- **Business Value:** Ensures automations execute without tying up the user's browser, handling retries and timeouts gracefully.
- **Main Components:** Server Action `runWorkflowAction`, Trigger.dev task `runWorkflowTask`.
- **Dependencies:** `@trigger.dev/sdk`, `@browserbasehq/stagehand`.

**Plan-Based Feature Gating**
- **Purpose:** Restrict premium features (e.g., AI Agent nodes) to paid users.
- **Business Value:** Drives monetization.
- **Main Components:** Clerk billing entitlements (`has({ plan: "pro" })`).
- **Dependencies:** `@clerk/nextjs`.

---

## 7 UI Screenshots

<img width="1901" height="907" alt="1home-page" src="https://github.com/user-attachments/assets/5707f1ac-d3e3-430a-ac59-5824338fe19a" />


<img width="1917" height="905" alt="2login-page" src="https://github.com/user-attachments/assets/d9176ebf-6c61-4387-ad5d-c70fb3ffccf2" />


<img width="1917" height="912" alt="3org-page" src="https://github.com/user-attachments/assets/a0a0a89e-400c-4cb3-8391-b6d0b8d9c08a" />


<img width="1917" height="907" alt="4join-invitationORCreateOrg" src="https://github.com/user-attachments/assets/f570d3bd-3766-4efc-97ad-df14ab7c9582" />


<img width="1917" height="907" alt="5dashboardPage" src="https://github.com/user-attachments/assets/7f61b1c9-a0ce-4f61-a249-e060ef0bfc1f" />


<img width="1911" height="897" alt="dashbord collabration-shows" src="https://github.com/user-attachments/assets/889905f9-2d8c-4920-8d5a-273e537ca1a0" />


<img width="1902" height="912" alt="pricing -page" src="https://github.com/user-attachments/assets/e82b3663-a4ce-4dab-b206-55859aca5bdb" />

---

## 8 Database Design

The application uses a serverless Postgres database to store canonical state, while users and organizations are entirely managed by Clerk.

### Table: `workflows`
**Purpose:** Stores the canonical, server-readable snapshot of a workflow graph.
**Fields:**
- `id` (uuid, Primary Key): Unique identifier for the workflow. Doubles as the Liveblocks Room ID.
- `org_id` (text, Not Null): The Clerk Organization ID this workflow belongs to.
- `name` (text, Not Null): Human-readable name of the workflow.
- `graph` (jsonb): Stores the React Flow nodes and edges array.
- `created_at` (timestamp, Not Null): Creation time.
- `updated_at` (timestamp, Not Null): Last updated time.

---

## 9 Entity Relationship Diagram

```text
+-----------------------+
| workflows             |
+-----------------------+
| id (PK) - UUID        |
| org_id (FK*) - TEXT   |
| name - TEXT           |
| graph - JSONB         |
| created_at - TIMESTAMP|
| updated_at - TIMESTAMP|
+-----------------------+
* org_id maps to Clerk's Organization ID (external).
```

---

## 10 Security

**Implemented Mechanisms:**
- **Authentication:** Enforced globally via Next.js Middleware and Clerk.
- **Authorization:** Route and action-level checks verifying the user belongs to the active `orgId`.
- **Protected Routes:** All routes under `app/(dashboard)` require valid sessions.
- **Plan Enforcement:** Server Actions (e.g., `runWorkflowAction`) strictly check billing entitlements before dispatching jobs.
- **Database Access:** Direct database queries are not exposed to the client; all mutations go through authenticated Server Actions.
- **Real-time Security:** Liveblocks rooms are secured via backend API token generation (`api/liveblocks/auth`) which verifies Clerk authentication first.

---

## 11 Authentication

**Authentication Provider:** Clerk
**Login Flow:** Handled via `@clerk/nextjs` components routed through `app/(auth)/sign-in`.
**Session Strategy:** JWT tokens managed by Clerk.
**Authorization Checks:** `auth()` and `has()` helpers from Clerk are used in Server Actions and Route Handlers to verify identity and active organization.

```text
+----------+          +-------------+           +--------------+
|  Client  |          | Next.js App |           | Clerk Server |
+----+-----+          +------+------+           +------+-------+
     |                       |                         |
     | 1. Request Protected  |                         |
     |    Page/Action        |                         |
     +---------------------->|                         |
     |                       | 2. Verify Session Token |
     |                       +------------------------>|
     |                       |                         |
     |                       |<------------------------+
     |                       |    (Valid Session)      |
     |<----------------------+                         |
     | 3. Return Content     |                         |
```

---

## 12 API Documentation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/liveblocks/auth` | Required (Clerk) | Authenticates a user for Liveblocks real-time sync. |
| GET | `/api/liveblocks/users` | Required (Clerk) | Retrieves user metadata for Liveblocks presence features. |
| GET | `/api/replays/[sessionId]` | Required (Clerk) | Retrieves Browserbase session replay HLS streams. |

### Endpoint Details

**`/api/liveblocks/auth`**
- **Purpose:** Generates a secure token for the Liveblocks client.
- **Authentication:** Valid Clerk session required.
- **Response:** JSON containing the Liveblocks JWT.

**`/api/replays/[sessionId]`**
- **Purpose:** Proxies the request to Browserbase to fetch session recordings. Needs server-side proxying to protect the `BROWSERBASE_API_KEY`.
- **Parameters (Path):** `sessionId` (String) - The Browserbase session ID.
- **Authentication:** Valid Clerk session required.
- **Response:** HLS playlist data or video stream.

---

## 13 Third-party Services

- **Clerk:** Identity management, B2B organizations, and billing/entitlements.
- **Neon:** Serverless PostgreSQL database hosting.
- **Trigger.dev:** Durable background task execution (Workflow runs).
- **Liveblocks:** WebSockets infrastructure for real-time multiplayer cursor tracking and graph state synchronization.
- **Browserbase:** Headless browser infrastructure and session recording.
- **Resend:** Transactional email delivery.
- **Sentry:** Error tracking, crash reporting, and performance monitoring.

---

## 14 Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk client-side publishable key. |
| `CLERK_SECRET_KEY` | Yes | Clerk server-side secret key. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Routing path for sign-in. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Routing path for sign-up. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Yes | Redirect after login. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Yes | Redirect after registration. |
| `DATABASE_URL` | Yes | Neon connection string for runtime queries (pooled). |
| `DATABASE_URL_UNPOOLED` | Yes | Neon connection string for schema migrations. |
| `NEON_BRANCH` | No | Target branch for Neon environments. |
| `TRIGGER_SECRET_KEY` | Yes | Trigger.dev secret API key for queuing tasks. |
| `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` | Yes | Liveblocks client key. |
| `LIVEBLOCKS_SECRET_KEY` | Yes | Liveblocks server key for token generation. |
| `BROWSERBASE_API_KEY` | Yes | Authentication for Stagehand/Browserbase automation. |
| `RESEND_API_KEY` | Yes | API key for sending emails. |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes | Sentry DSN for client-side tracking. |
| `SENTRY_DSN` | Yes | Sentry DSN for server-side tracking. |
| `SENTRY_AUTH_TOKEN` | Yes | Used during build for sourcemap uploads. |

---

## 15 Major Dependencies

- **`@clerk/nextjs`**: Core authentication wrapper and middleware.
- **`@liveblocks/react-flow`**: Deep integration bridging React Flow state with Liveblocks CRDTs.
- **`@xyflow/react`**: Powers the visual node-based workflow editor.
- **`drizzle-orm`**: Type-safe database interactions.
- **`@trigger.dev/sdk`**: SDK for defining and triggering background workflows.
- **`@browserbasehq/stagehand`**: High-level browser automation framework utilized inside Trigger.dev tasks.
- **`@sentry/nextjs`**: Full-stack error and performance observability.
- **`shadcn/ui` (Radix Primitives, Tailwind, motion, etc.)**: Foundation for the user interface.

---

## 16 Installation Guide

**Prerequisites:**
- Node.js (v20+ recommended)
- `npm` or `pnpm`
- Accounts for Neon, Clerk, Trigger.dev, Liveblocks, Browserbase, Resend, and Sentry.

**Step-by-step:**
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd FlowForge
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment:**
   Copy the example environment file and fill in the secrets.
   ```bash
   cp .env.example .env.local
   ```
4. **Database Setup:**
   Generate and push the schema to your Neon database.
   ```bash
   npm run db:generate
   npm run db:push
   ```
5. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 17 Deployment

**Frontend & API Hosting:** Vercel (recommended for Next.js App Router).
**Background Workers:** Trigger.dev managed infrastructure (v3/v4).
**Database:** Neon Serverless Postgres.

**Deployment Workflow:**
1. Code pushed to main branch.
2. Vercel triggers a build (`npm run build`).
3. `sentryEsbuildPlugin` (configured in `trigger.config.ts`) and Next.js config uploads sourcemaps to Sentry using `SENTRY_AUTH_TOKEN`.
4. Trigger.dev CLI/Build extensions deploy the tasks found in `features/` to the Trigger.dev project environment.
5. Vercel deploys the Next.js application.

---

## 18 Request Lifecycle

Example: **Triggering a Workflow Execution**

```text
+-------------+
|    User     |
| (UI Canvas) |
+------+------+
       |
       | 1. Clicks "Run Workflow"
       v
+------+-----------------------+
|  Server Action               |
| (runWorkflowAction)          |
+------+-----------------------+
       |
       | 2. Verifies Auth & Org (Clerk)
       | 3. Checks Billing Plan (Pro)
       | 4. Saves Graph Snapshot (Neon DB)
       | 5. Triggers Task via SDK
       v
+------+-----------------------+
|    Trigger.dev API           |
+------+-----------------------+
       |
       | 6. Queues job & provisions worker
       v
+------+-----------------------+
|  Trigger.dev Background Task |
| (runWorkflowTask)            |
+------+-----------------------+
       |
       | 7. Initializes Stagehand
       | 8. Parses Workflow Graph
       | 9. Executes Browser Actions
       v
+------+-----------------------+
| Browserbase (Headless Chrome)|
+------------------------------+
```

---

## 19 Performance

**Implemented Optimizations:**
- **Offloaded Workloads:** Heavy browser automation completely offloaded from the Vercel request lifecycle to Trigger.dev background workers.
- **Serverless Edge:** Auth checks and Next.js rendering optimized for serverless/edge environments.
- **CRDT Synchronization:** Liveblocks efficiently synchronizes only structural changes to the React Flow graph using Yjs/CRDTs, preventing full payload rebroadcasts.

**Scalability Considerations:**
- Database connections to Neon are pooled dynamically, ensuring Vercel serverless function cold starts do not exhaust database connections.
- Trigger.dev allows workflows to run up to 3600 seconds (`maxDuration`) without hitting Next.js serverless execution limits (which typically cap at 15-60 seconds).

---

## 20 Security Review

**Current Security Strengths:**
- Auth/Orgs natively handled by a robust provider (Clerk).
- Secrets (like `BROWSERBASE_API_KEY`) are kept on the server and never leaked to the client (proxied via API routes).
- Server Actions use strict authorization and plan capability checks (`has({ plan: "pro" })`) before accessing database or triggering jobs.

**Best Practices Followed:**
- Sentry error logging captures contextual context (e.g., `orgId`, `workflowId`, `runId`) using `Sentry.getIsolationScope().setAttributes()`, aiding debugging without exposing PII.

---

## 21 Challenges & Engineering Decisions

- **State Sync Architecture:** Using Liveblocks for the active, collaborative editing session allows for smooth multiplayer experiences. However, a "snapshot" of the graph is saved to Postgres (`workflows` table) right before execution. This ensures the backend execution engine operates on a deterministic version of the workflow, decoupled from the live, mutating canvas.
- **Background Execution:** Using Trigger.dev instead of standard API route queues bypasses Vercel's strict timeout limits, crucial for browser automation tasks that often take minutes to complete and require retry capabilities.
- **Domain-Driven Folder Structure:** Grouping logic by feature (e.g., `features/workflows`) instead of technically (e.g., grouping all hooks, all components globally) improves maintainability as the platform grows.

---

## 22 Future Improvements

- **Local Execution:** Support running Stagehand automations locally during development without consuming Browserbase credits.
- **Workflow Versioning:** Store historical snapshots of the `graph` in the database, allowing users to revert to previous versions.
- **Webhooks:** Allow workflows to be triggered via inbound webhooks, not just via the UI.
- **More Node Types:** Expand the library of React Flow nodes for advanced logic (conditionals, loops).

---

## 23 Developer Notes

- **Maintainability:** The codebase separates concerns cleanly. React Flow components should remain visual, while the Trigger.dev tasks (`runWorkflowTask`) should handle the actual execution logic.
- **Adding Nodes:** To add a new workflow action node, you must implement the UI component in `features/workflows/nodes`, update the node registry, and update the execution logic in `features/workflows/tasks/run-workflow.ts`.
- **Database Migrations:** Remember to use the unpooled connection string (`DATABASE_URL_UNPOOLED`) when running `npm run db:migrate` or `db:push`.

---
Written by Yash Lagare
