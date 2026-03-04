# Portfolio Website — Architecture & Feature Documentation

**Author:** Pavan Jillella
**Stack:** Next.js 14 (App Router) | TypeScript | Tailwind CSS | Framer Motion | Supabase | TipTap
**Deployment:** Vercel (`pavanjillella.vercel.app`)
**Auth:** Google OAuth via Supabase Auth (all routes protected)

---

## Table of Contents

1. [Site-Wide Infrastructure](#1-site-wide-infrastructure)
2. [Home Page](#2-home-page)
3. [About](#3-about)
4. [Projects](#4-projects)
5. [Blog System](#5-blog-system)
6. [Vlogs](#6-vlogs)
7. [Contact](#7-contact)
8. [Authentication & Admin Panel](#8-authentication--admin-panel)
9. [Finance Tracker](#9-finance-tracker)
10. [Education & Dashboard](#10-education--dashboard)
11. [API Routes](#11-api-routes)
12. [Database Schema](#12-database-schema)
13. [File & Directory Structure](#13-file--directory-structure)
14. [Dependencies](#14-dependencies)
15. [Summary Statistics](#15-summary-statistics)

---

## 1. Site-Wide Infrastructure

### Layout & Visual Layer

The root layout (`src/app/layout.tsx`) wraps every page with a unified dark-theme visual system:

| Component | File | Purpose |
|---|---|---|
| `Navbar` | `src/components/ui/Navbar.tsx` | Responsive navigation with active route highlighting |
| `CursorGlow` | `src/components/ui/CursorGlow.tsx` | Mouse-following radial glow effect |
| `FloatingBackground` | `src/components/ui/FloatingBackground.tsx` | Animated floating particles |
| `GrainOverlay` | `src/components/ui/GrainOverlay.tsx` | Film grain texture overlay |
| `SmoothScroll` | `src/components/ui/SmoothScroll.tsx` | Lenis-powered smooth scrolling |
| `PageViewTracker` | `src/components/analytics/PageViewTracker.tsx` | Background page view analytics |
| `ChatWidget` | `src/components/chat/ChatWidget.tsx` | AI chat overlay (GPT-4o-mini) |
| `AuthProvider` | `src/components/providers/AuthProvider.tsx` | Supabase auth context |

### Design System

- **Fonts:** Syne (display/headings), DM Sans (body), JetBrains Mono (code)
- **Theme:** Dark mode with glassmorphism (`glass-card` utility: backdrop-blur + white/5 border + white/2 background)
- **Animations:** Framer Motion for page transitions, `FadeIn` wrapper for scroll-triggered reveals, `AnimatedCounter` for number animations
- **Tailwind Utilities:** `font-display`, `font-body`, `font-mono`, `text-white/40` opacity variants

### Authentication & Middleware

- **Provider:** Supabase Auth with Google OAuth (`@supabase/ssr`)
- **Middleware:** `src/middleware.ts` protects ALL routes, redirects unauthenticated users to `/login`
- **Public paths:** `/login`, `/api/auth/callback`, `/api/contact`, `/api/comments`, `/api/analytics`, static assets
- **Session:** Cookie-based via Supabase, validated with `getUser()` on every request
- **Clients:** Four Supabase client factories:
  - `src/lib/supabase/client.ts` — browser client (SSR-aware, reads auth cookies)
  - `src/lib/supabase/server.ts` — server client with disabled session persistence
  - `src/lib/supabase/admin.ts` — admin client using service role key (bypasses RLS)
  - `src/lib/supabase/middleware.ts` — middleware-specific client for auth checks

### Data Persistence Pattern (Multi-User)

All interactive features use a three-layer persistence strategy via `useSupabaseRealtimeSync`:

1. **localStorage:** Immediate, synchronous writes for instant UI feedback
2. **Supabase PostgreSQL:** Async fire-and-forget writes via `/api/sync` (authenticated, injects `user_id`)
3. **Supabase Realtime:** WebSocket subscriptions for live cross-tab/device sync (RLS-filtered by `user_id`)

**Multi-user isolation:**
- localStorage is cleared when user changes (prevents cross-account data leak)
- Supabase reads are RLS-filtered: `auth.uid() = user_id`
- Writes go through `/api/sync` which automatically injects `user_id` from session
- New users start with completely empty data (0 blogs, 0 vlogs, 0 projects)

### SEO

- Dynamic `sitemap.ts` and `robots.ts` route handlers
- `next-sitemap` post-build generation
- Per-page `metadata` exports on static pages

---

## 2. Home Page

**Route:** `/`
**Type:** Server Component with client sub-sections
**File:** `src/app/page.tsx`

Composed of 7 sections rendered in order:

| Section | Component | Data Source | Description |
|---|---|---|---|
| Hero | `HeroSection` | Static | Name, title, animated entrance |
| Vlogs | `VlogSection` | `useSupabaseRealtimeSync<Vlog>` | Featured vlog (or null if empty) |
| Blog | `BlogSection` | `useSupabaseRealtimeSync<BlogPost>` | Latest 3 published posts (or null if empty) |
| Projects | `ProjectsSection` | `useSupabaseRealtimeSync<UserProject>` | Top 3 projects (or null if empty) |
| Stats | `StatsSection` | GitHub + LeetCode APIs | Animated counters (repos, stars, LeetCode) |
| Philosophy | `PhilosophySection` | Static | Personal philosophy cards |
| Footer | `Footer` | Static | Links, newsletter signup, social |

---

## 3. About

**Route:** `/about`
**Type:** Server Component
**File:** `src/app/about/page.tsx`

- Skills grid organized by category
- Professional timeline
- Personal bio section

---

## 4. Projects

**Route:** `/projects`
**Type:** Client Component
**File:** `src/app/projects/page.tsx`

- **Data Source:** `useSupabaseRealtimeSync<UserProject>("pj-user-projects", "user_projects", [])`
- Built-in management UI: add/edit/delete projects with inline form
- Language filter chips
- Project cards displaying: name, description, stars, forks, language badge, topic tags
- Empty state with "Add your first project" prompt for new users

---

## 5. Blog System

### Blog List

**Route:** `/blog`
**Type:** Client Component
**File:** `src/app/blog/page.tsx`

- **Data Source:** `useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", [])`
- Filters by `published === true`, sorts by `created_at` desc
- Category filter tags, post cards with title/description/category/read_time/created_at
- Empty state with "Write your first post" link
- "Write" button linking to `/blog/write`

### Blog Post Detail

**Route:** `/blog/[slug]`
**Type:** Client Component
**File:** `src/app/blog/[slug]/page.tsx`

- Uses `use(params)` for Next.js 15 async params
- Finds post by slug from `useSupabaseRealtimeSync` data
- Renders markdown with `react-markdown` + `remark-gfm`
- Styled component overrides for: h1-h3, p, a, ul, ol, blockquote, code (inline/block), hr, table, th, td
- Loading state while data fetches, "Post not found" fallback
- `CommentSection` for per-slug comments (global, not per-user)

### Blog Content Pipeline

```
User writes markdown in /blog/write
  -> setPosts() via useSupabaseRealtimeSync
    -> localStorage + /api/sync -> Supabase blog_posts table
  -> Navigate to /blog/[slug]
    -> useSupabaseRealtimeSync fetches blog_posts
    -> Find post by slug
    -> react-markdown renders content
```

### Blog Editor

**Route:** `/blog/write`
**Type:** Client Component
**File:** `src/app/blog/write/page.tsx`

- Split-view modes: Editor | Split | Preview
- Live markdown preview with `react-markdown`
- Auto-slug generation from title
- Word count and auto-calculated read time
- Metadata: description, category (Technology/Finance/Education), tags (comma-separated)
- Saves directly via `setPosts()` — creates BlogPost with `id: Date.now().toString()`, `created_at: new Date().toISOString()`

---

## 6. Vlogs

**Route:** `/vlogs`
**Type:** Client Component
**File:** `src/app/vlogs/page.tsx`

- **Data Source:** `useSupabaseRealtimeSync<Vlog>("pj-vlogs", "vlogs", [])`
- Category filter tabs (Technology, Education, Finance, Lifestyle, Other)
- `YouTubeEmbed` component for video playback
- Framer Motion card animations
- `VlogManager` component for add/edit/delete with inline form
- Field names: `youtube_id`, `published_at` (snake_case matching DB)

---

## 7. Contact

**Route:** `/contact`
**Type:** Server Component + Client Form
**File:** `src/app/contact/page.tsx`

| Component | Purpose |
|---|---|
| `ContactForm` | Form with `react-hook-form` + Zod validation, Cloudflare Turnstile CAPTCHA, sends via NodeMailer |
| `NewsletterForm` | Email subscription stored in Supabase |

---

## 8. Authentication & Admin Panel

### Login

**Route:** `/login`
**Type:** Client Component
**File:** `src/app/login/page.tsx`

- Google OAuth "Sign in with Google" button
- Supabase Auth handles the OAuth flow
- Redirects to `/api/auth/callback` then to original route
- Animated background

### OAuth Callback

**Route:** `/api/auth/callback`
**File:** `src/app/api/auth/callback/route.ts`

- Exchanges auth code for Supabase session
- Sets session cookies
- Redirects to `next` query param or `/`

### Admin Panel

All `/admin/*` routes protected by Google OAuth middleware.

| Route | File | Feature |
|---|---|---|
| `/admin` | `src/app/admin/page.tsx` | Dashboard with overview stats |
| `/admin/blog` | `src/app/admin/blog/page.tsx` | Links to `/blog` and `/blog/write` (blog management moved to main pages) |
| `/admin/blog/new` | `src/app/admin/blog/new/page.tsx` | Server redirect to `/blog/write` |
| `/admin/analytics` | `src/app/admin/analytics/page.tsx` | Page view analytics |
| `/admin/setup` | `src/app/admin/setup/page.tsx` | DB table checker, migration SQL, backup download |

---

## 9. Finance Tracker

### Finance Landing

**Route:** `/finance`
**Type:** Server Component
**File:** `src/app/finance/page.tsx`

- FIRE (Financial Independence, Retire Early) philosophy
- Financial principles cards
- Asset allocation breakdown

### Finance Tracker App

**Route:** `/finance/tracker`
**Type:** Server Component wrapping Client Orchestrator
**Orchestrator:** `src/components/finance/FinanceTrackerClient.tsx`
**Pattern:** Central "use client" component managing all state via `useSupabaseRealtimeSync` hooks

#### Tabs & Features

| Tab | Components | Features |
|---|---|---|
| **Overview** | `MonthlySummaryCards`, `MonthlyTrend`, `Sparkline` | Income/expense/savings summary, monthly trend chart |
| **Transactions** | `TransactionForm`, `TransactionList`, `TransactionTable`, `TransactionFilters` | Add/edit/delete transactions, 3 view modes, sorting, filtering |
| **Budgets** | `BudgetManager`, `BudgetPlanner` | Monthly budgets per category, progress bars, over-budget alerts |
| **Savings** | `SavingsGoals`, `SavingsTrendChart` | Target/current amounts, deadline tracking, trend visualization |
| **Investments** | `InvestmentTracker` | Portfolio tracking (stocks, crypto, real estate), live stock quotes via Yahoo Finance |
| **Net Worth** | `NetWorthCalculator` | Assets vs liabilities, category breakdown, net worth total |
| **Subscriptions** | `SubscriptionTracker` | Recurring payments with renewal alerts |
| **Analysis** | `AIAnalysis`, `CategoryBreakdown`, `PieChart`, `Recommendations` | AI spending analysis, pie chart, smart recommendations |
| **Reports** | `MonthlyReportEmail` | Email monthly finance reports via NodeMailer |
| **Categories** | `CategoryManager` | Custom expense category CRUD |
| **Payroll** | `PayrollTracker`, `PayrollDashboard`, `PayStubForm`, `PayStubList` | Full payroll system with tax calculations, charts, employer management |

#### Additional Finance Features

- **Multi-Currency:** 10 currencies with live exchange rates
- **Export:** CSV and Excel (XLSX) transaction export
- **Payroll:** Federal + Virginia state tax calculations, pay stub PDF generation, shift calendar, Google Sheets import
- **Live Data:** Stock quotes (Yahoo Finance), exchange rates (ExchangeRate-API), crypto prices

---

## 10. Education & Dashboard

### Education Landing

**Route:** `/education`
**Type:** Server Component
**File:** `src/app/education/page.tsx`

- 4 learning principle cards
- 6-book recommended reading list
- Knowledge system description (PARA method)
- Course Tracker section

### Education Dashboard App

**Route:** `/education/dashboard`
**Type:** Server Component wrapping Client Orchestrator
**Orchestrator:** `src/components/education/dashboard/EducationDashboardClient.tsx`
**Pattern:** Central "use client" component managing all state via `useSupabaseRealtimeSync` hooks

#### 8 Dashboard Tabs

1. **Overview** — Stats cards, weekly study chart, recent activity feed
2. **Study Planner** — Study session logging, bar charts, streak counter, subject breakdown, weekly goals
3. **Courses** — Course tracker with modules, notes, file uploads, progress tracking
4. **Notes** — Rich text editor (TipTap), tag management, course/project linking, version history, search
5. **Projects** — Project management with milestones, status tracking, notes, files
6. **GitHub** — Live repo stats, language breakdown chart
7. **LeetCode** — Solved problems, difficulty bar, ranking
8. **Files** — File upload/management with Supabase Storage (10MB limit)

### Dashboard Pages

| Route | Component | Features |
|---|---|---|
| `/dashboard/activity` | `ActivityTimeline` | Unified activity feed (study, notes, courses, projects, blog, code) |
| `/dashboard/analytics` | `PersonalAnalyticsClient` | Contribution heatmap, commit timeline, correlation charts, growth metrics |
| `/dashboard/life-index` | `LifeIndexDashboard` | Composite 0-100 life score across Financial Health, Learning, Technical, Personal Growth |

---

## 11. API Routes

### Content & Data

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/callback` | GET | Google OAuth callback handler |
| `/api/sync` | POST | Authenticated write proxy for all 19 user data tables (injects user_id) |
| `/api/search-data` | GET | Returns empty (blog data is per-user, client-fetched) |
| `/api/comments` | GET, POST | Blog comments (global by slug) |
| `/api/chat` | POST | AI chat (OpenAI GPT-4o-mini) |
| `/api/activity` | GET | Unified activity feed (Supabase + GitHub) |

### GitHub & LeetCode

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/github` | GET | GitHub repos with stats |
| `/api/github/events` | GET | Commit activity timeline |
| `/api/leetcode` | GET | LeetCode profile stats |
| `/api/stats` | GET | Combined GitHub + LeetCode stats |

### Finance

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/finance/stocks` | GET | Stock quotes (Yahoo Finance) |
| `/api/finance/stocks/history` | GET | Historical stock prices |
| `/api/finance/stocks/search` | GET | Stock symbol search |
| `/api/finance/currency` | GET | Exchange rates |
| `/api/finance/crypto` | GET | Cryptocurrency prices |
| `/api/finance/report` | POST | Email monthly finance report |
| `/api/finance/payroll-import` | POST | Import payroll from Google Sheets |

### Embeddings & Analytics

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/embeddings/generate` | POST | Generate OpenAI embeddings |
| `/api/embeddings/search` | GET | Semantic vector search |
| `/api/knowledge-graph` | GET | Knowledge graph from embeddings |
| `/api/analytics` | GET, POST | Page view tracking |

### Admin & Utility

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/setup-db` | GET | Check table status, provide migration SQL |
| `/api/admin/export` | GET | Full JSON backup of all tables |
| `/api/admin/check-tables` | GET | Check which tables exist |
| `/api/admin/migrate-owner` | POST | Migrate data ownership between users |
| `/api/contact` | POST | Contact form email (CAPTCHA-protected) |
| `/api/newsletter` | POST | Newsletter subscription |
| `/api/education/upload` | POST | Upload file to Supabase Storage |
| `/api/education/upload/[path]` | DELETE | Delete file from Supabase Storage |

---

## 12. Database Schema

**Provider:** Supabase (PostgreSQL)
**All user data tables have Row Level Security (RLS): `auth.uid() = user_id`**

### Content Tables (3)

| Table | Key Columns | Purpose |
|---|---|---|
| `vlogs` | id, user_id, title, youtube_id, category, duration, published_at, description | Per-user YouTube vlogs |
| `blog_posts` | id, user_id, title, slug, description, content, category, read_time, published, tags (jsonb), created_at | Per-user blog posts (markdown content stored in DB) |
| `user_projects` | id, user_id, name, description, language, url, stars, forks, topics (jsonb), created_at | Per-user portfolio projects |

### Finance Tables (6)

| Table | Key Columns | Purpose |
|---|---|---|
| `transactions` | id, user_id, type, amount, category, description, date | Income/expense records |
| `budgets` | id, user_id, category, monthly_limit, month | Monthly budget limits |
| `savings_goals` | id, user_id, name, target_amount, current_amount, deadline | Savings targets |
| `investments` | id, user_id, name, type, ticker, quantity, purchase_price, current_value | Investment portfolio |
| `subscriptions` | id, user_id, name, amount, currency, frequency, category, next_billing_date | Recurring payments |
| `net_worth_entries` | id, user_id, name, type, category, value, currency | Assets and liabilities |

### Education Tables (4)

| Table | Key Columns | Purpose |
|---|---|---|
| `study_sessions` | id, user_id, subject, duration_minutes, date, notes | Study session logs |
| `edu_notes` | id, user_id, title, content_html, tags (jsonb) | Knowledge base notes |
| `courses` | id, user_id, name, platform, url, progress, status | Course tracking |
| `edu_projects` | id, user_id, name, description, status, github_url | Project workspace |

### Payroll & Schedule Tables (6)

| Table | Key Columns | Purpose |
|---|---|---|
| `pay_stubs` | id, user_id, employer_name, pay period, hours, deductions, net_pay | Individual pay stubs |
| `part_time_jobs` | id, user_id, name, pay_rate | Part-time job records |
| `part_time_hours` | id, user_id, job_id, hours, date | Hourly time entries |
| `employers` | id, user_id, name, pay_type, hourly_rate, color | Employer configuration |
| `work_schedules` | id, user_id, period_label, dates, hours | Work schedule records |
| `enhanced_work_schedules` | id, user_id, shifts, employer | Enhanced shift data |

### System Tables

| Table | Purpose |
|---|---|
| `comments` | Blog comments (global by slug) |
| `newsletter` | Email subscriptions |
| `page_views` | Analytics tracking |
| `embeddings` | AI semantic search vectors |
| `user_profiles` | User profile data |

### Migrations (11 files)

Located in `supabase/migrations/`:

| Migration | Purpose |
|---|---|
| `20240301_payroll_tables` | Initial payroll tables |
| `20240302_finance_education_tables` | Finance + education tables |
| `20240303_tighten_rls_policies` | Tighten RLS to SELECT-only |
| `20240303_payroll_tables` | Additional payroll setup |
| `20240304_fix_payroll_schema` | Fix column types |
| `20240305_add_hours_times` | Add hours/times columns |
| `20240306_expand_investment_types` | Expand investment options |
| `20240307_investment_exchange_market` | Add exchange/market fields |
| `20240308_add_user_profiles` | User profiles table |
| `20240309_add_user_id_to_tables` | Add user_id to all tables |
| `20240310_user_based_rls_policies` | Per-user RLS + vlogs/blog_posts/user_projects tables (idempotent) |

### Storage

- **Bucket:** `education-files` (private) in Supabase Storage
- **Limit:** 10MB per file
- **Types:** PDF, images, text, Office docs, ZIP, CSV

---

## 13. File & Directory Structure

```
src/
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home
│   ├── not-found.tsx                       # 404
│   ├── global-error.tsx                    # Sentry error boundary
│   ├── robots.ts                           # SEO
│   ├── sitemap.ts                          # SEO
│   ├── about/page.tsx
│   ├── projects/page.tsx                   # Per-user + management UI
│   ├── blog/
│   │   ├── page.tsx                        # Per-user blog list
│   │   ├── write/page.tsx                  # Blog editor -> Supabase
│   │   └── [slug]/page.tsx                 # Blog post (react-markdown)
│   ├── vlogs/page.tsx                      # Per-user + management UI
│   ├── contact/page.tsx
│   ├── login/page.tsx                      # Google OAuth
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── blog/page.tsx                   # -> /blog redirect
│   │   ├── blog/new/page.tsx              # -> /blog/write redirect
│   │   ├── analytics/page.tsx
│   │   └── setup/page.tsx
│   ├── finance/
│   │   ├── page.tsx                        # Finance landing
│   │   └── tracker/page.tsx                # Finance tracker app
│   ├── education/
│   │   ├── page.tsx                        # Education landing
│   │   └── dashboard/page.tsx              # Education dashboard app
│   ├── dashboard/
│   │   ├── activity/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── life-index/page.tsx
│   └── api/                                # 29 API routes
│       ├── auth/callback/route.ts
│       ├── sync/route.ts                   # Write proxy (19 tables)
│       ├── activity/route.ts
│       ├── analytics/route.ts
│       ├── chat/route.ts
│       ├── comments/route.ts
│       ├── contact/route.ts
│       ├── newsletter/route.ts
│       ├── search-data/route.ts
│       ├── stats/route.ts
│       ├── leetcode/route.ts
│       ├── knowledge-graph/route.ts
│       ├── github/{route,events/route}.ts
│       ├── finance/{stocks,stocks/history,stocks/search,currency,crypto,report,payroll-import}
│       ├── embeddings/{generate,search}
│       ├── education/upload/{route,[path]/route}.ts
│       └── admin/{setup-db,export,check-tables,migrate-owner}
│
├── components/
│   ├── activity/                           # 3: ActivityCard, ActivityTimeline, FilterChips
│   ├── analytics/                          # 9: PersonalAnalyticsClient, ContributionHeatmap, etc.
│   ├── blog/                               # 2: BlogFilters, CommentSection
│   ├── chat/                               # 2: ChatWidget, SuggestedPrompts
│   ├── dashboard/                          # 1: LifeIndexDashboard
│   ├── education/                          # 24 components across 9 sub-modules
│   ├── finance/                            # 42 components
│   ├── layout/                             # 1: LayoutShell
│   ├── mdx/                                # 1: MDXContent (legacy)
│   ├── providers/                          # 4: AuthProvider, PostHogProvider, QueryProvider, ThemeProvider
│   ├── search/                             # 3: CommandPalette, SearchResult, SearchResultGroup
│   ├── sections/                           # 7: Hero, Vlog, Blog, Projects, Stats, Philosophy, Footer
│   ├── ui/                                 # 22 reusable components
│   └── vlogs/                              # 1: VlogManager
│
├── hooks/
│   ├── useLocalStorage.ts                  # SSR-safe localStorage
│   ├── useSupabaseRealtimeSync.ts          # Primary data hook (3-layer sync)
│   ├── useSupabaseSync.ts                  # Simple one-way sync
│   ├── useSupabaseStorage.ts               # File upload/delete
│   ├── useAutoRefresh.ts                   # Auto-refresh intervals
│   ├── useAutoSync.ts                      # Payroll auto-sync
│   ├── useEmbeddingSync.ts                 # AI embedding generation
│   ├── useRecentSearches.ts                # Search history
│   ├── useSearchIndex.ts                   # Fuse.js search
│   ├── useVisibility.ts                    # Section visibility toggle
│   └── queries/                            # 7 React Query hooks
│
├── lib/
│   ├── supabase/{client,server,admin,middleware}.ts
│   ├── finance-utils.ts                    # Finance calculations
│   ├── payroll-{utils,tax,pdf,schemas}.ts  # Payroll system
│   ├── education-utils.ts                  # Education calculations
│   ├── constants.ts                        # All app constants
│   ├── {api,ai-context,search-index,rate-limit,utils,visibility}.ts
│   └── stemtree-payroll.ts                 # Seed payroll data
│
├── types/
│   └── index.ts                            # 80+ TypeScript interfaces
│
└── middleware.ts                            # Google OAuth enforcement
```

---

## 14. Dependencies

### Production (~47 packages)

| Category | Packages |
|---|---|
| **Framework** | `next@14.2.5`, `react@18`, `react-dom@18` |
| **Styling** | `tailwindcss`, `tailwind-merge`, `tailwindcss-animate`, `clsx`, `class-variance-authority` |
| **Animation** | `framer-motion`, `lenis` |
| **Database & Auth** | `@supabase/supabase-js`, `@supabase/ssr` |
| **Rich Text** | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-code-block-lowlight`, `@tiptap/pm`, `lowlight` |
| **UI Primitives** | `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `lucide-react` |
| **Blog Rendering** | `react-markdown`, `remark-gfm` |
| **Server State** | `@tanstack/react-query` |
| **Forms** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **AI** | `openai` |
| **Email** | `nodemailer` |
| **Export** | `xlsx`, `jspdf` |
| **SEO** | `next-sitemap` |
| **Analytics** | `posthog-js`, `@vercel/analytics` |
| **Error Tracking** | `@sentry/nextjs` |
| **CAPTCHA** | `@marsidev/react-turnstile` |
| **Search** | `fuse.js` |

### Dev (~9 packages)

`typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/nodemailer`, `eslint`, `eslint-config-next`, `autoprefixer`, `postcss`

---

## 15. Summary Statistics

| Metric | Count |
|---|---|
| Page Routes | 21 |
| API Endpoints | 29 |
| React Components | ~110 |
| Custom Hooks | 17 (10 data + 7 query) |
| Utility Libraries | 18 |
| Type Definitions | 80+ interfaces |
| Database Tables | 19 user data + 4-5 system |
| SQL Migrations | 11 |
| Storage Buckets | 1 |
| External Integrations | 11 |
| Production Dependencies | ~47 |
| Dev Dependencies | ~9 |

---

*Updated on 2026-03-03. Reflects Google OAuth authentication, per-user Supabase data isolation (vlogs, blogs, projects), Vercel deployment, and RLS policies on all tables.*
