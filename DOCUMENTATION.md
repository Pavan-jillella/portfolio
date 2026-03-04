# Pavan Jillella - Portfolio Website Documentation

> Comprehensive documentation of every feature, function, component, route, hook, utility, and integration in this portfolio project.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Authentication & Middleware](#4-authentication--middleware)
5. [Pages & Routes](#5-pages--routes)
6. [API Endpoints](#6-api-endpoints)
7. [Components](#7-components)
8. [Custom Hooks](#8-custom-hooks)
9. [Utility Libraries](#9-utility-libraries)
10. [Database & Supabase](#10-database--supabase)
11. [Styling & Design System](#11-styling--design-system)
12. [External Integrations](#12-external-integrations)
13. [Security](#13-security)
14. [Deployment](#14-deployment)
15. [File Tree](#15-file-tree)

---

## 1. Project Overview

A full-featured personal portfolio and productivity suite built with Next.js 14. Every page is behind Google OAuth authentication — each user gets their own isolated data (blogs, vlogs, projects, finances, education) with zero cross-user visibility.

**Key capabilities:**
- Multi-user Google OAuth authentication via Supabase Auth
- Per-user blog system (write, publish, view) stored in Supabase with react-markdown rendering
- Per-user projects with management UI (add/edit/delete) stored in Supabase
- Per-user vlogs with YouTube embeds and management UI stored in Supabase
- Finance tracker with budgets, transactions, investments, subscriptions, net worth, payroll
- Education dashboard with courses, study sessions, notes (rich-text), projects, GitHub/LeetCode stats
- AI chat assistant powered by OpenAI
- Semantic search with OpenAI embeddings and knowledge graph visualization
- Real-time data sync via Supabase (PostgreSQL + Realtime) with offline-first localStorage
- Analytics with page views, contribution heatmaps, growth metrics
- Admin panel for database setup, analytics, and data export
- Complete data isolation between user accounts via Row Level Security (RLS)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + tailwindcss-animate |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL + Realtime + Storage) |
| Auth | Supabase Auth (Google OAuth) |
| State | React hooks + localStorage + Supabase realtime sync |
| Server State | TanStack React Query |
| AI | OpenAI (gpt-4o-mini, text-embedding-3-small) |
| Rich Text | TipTap editor |
| Blog Rendering | react-markdown + remark-gfm |
| Search | Fuse.js (fuzzy) + OpenAI embeddings (semantic) |
| PDF | jsPDF |
| Spreadsheets | xlsx (SheetJS) |
| Validation | Zod |
| Forms | React Hook Form |
| Email | Nodemailer (SMTP) |
| CAPTCHA | Cloudflare Turnstile |
| Analytics | PostHog + Vercel Analytics |
| Error Tracking | Sentry |
| Deployment | Vercel |
| UI Primitives | Radix UI (dialog, tabs, toast, label, separator) |

---

## 3. Architecture

```
src/
  app/                    # Next.js App Router (pages + API routes)
    (all routes)          # All behind Google OAuth
    api/                  # 29 API endpoints
  components/             # ~110 React components organized by domain
    activity/             # Activity timeline
    analytics/            # Charts, heatmaps, knowledge graph
    blog/                 # Blog filters and comment section
    chat/                 # AI chat widget
    dashboard/            # Life Index dashboard
    education/            # Course tracker + education dashboard (7 sub-modules)
    finance/              # Finance tracker + payroll (42 components)
    layout/               # Shell layout
    mdx/                  # MDX renderer (legacy, unused by blog)
    providers/            # React context providers (Auth, PostHog, Query, Theme)
    search/               # Command palette
    sections/             # Home page sections
    ui/                   # Shared UI primitives (22 components)
    vlogs/                # Vlog manager
  hooks/                  # 17 custom hooks (data, queries, sync)
  lib/                    # 18 utility modules (finance, payroll, search, etc.)
  types/                  # Central TypeScript definitions (80+ interfaces)
  middleware.ts           # Google OAuth middleware
supabase/
  migrations/             # 11 SQL migration files
public/                   # Static assets (robots.txt, sitemap)
```

### Data Flow (Multi-User)

```
User Action
  -> React Component (useState)
  -> useSupabaseRealtimeSync hook
    -> localStorage (immediate, synchronous, namespaced by user)
    -> Diff prev vs next state
    -> Fire-and-forget POST to /api/sync (authenticated, injects user_id)
      -> Supabase PostgreSQL via service role key (bypasses RLS)
  -> Supabase Realtime subscription (filtered by user_id via RLS)
    -> Other tabs/devices receive updates for SAME user only
```

### User Isolation

```
User Login (Google OAuth)
  -> Supabase session established
  -> useSupabaseRealtimeSync detects user change
    -> Clears ALL localStorage keys to prevent cross-user data leak
  -> Fetches fresh data from Supabase (filtered by RLS: auth.uid() = user_id)
  -> Subscribes to realtime changes (RLS-filtered)
  -> New user sees empty data everywhere (0 blogs, 0 vlogs, 0 projects)
```

---

## 4. Authentication & Middleware

### Google OAuth Authentication

**Provider:** Supabase Auth with Google OAuth
**File:** `src/middleware.ts`

All routes require Google OAuth authentication. The middleware uses `@supabase/ssr` to check session cookies.

**Public paths (no auth required):**
- `/login` — Login page with Google OAuth button
- `/api/auth/callback` — OAuth callback handler
- `/api/contact` — Contact form submissions
- `/api/comments` — Blog comments (GET only)
- `/api/analytics` — Page view tracking
- `/_next/*`, static assets (`.svg`, `.png`, `.jpg`, `.css`, `.js`, `.woff2`, etc.)

**Auth flow:**
1. User visits any protected route → redirected to `/login?next=[original_path]`
2. User clicks "Sign in with Google" → Supabase OAuth flow
3. Google authenticates → callback to `/api/auth/callback`
4. Supabase session cookie set → user redirected to originally requested page
5. Middleware validates session on every request via `supabase.auth.getUser()`

**API route handling:**
- API routes refresh session cookies but don't redirect
- Individual API routes return `401` if auth is required and missing

**AuthProvider** (`src/components/providers/AuthProvider.tsx`):
- Wraps app with Supabase auth context
- Provides current user session to all components

---

## 5. Pages & Routes

### All Pages (Protected by Google OAuth)

#### Home (`/`)
- **File:** `src/app/page.tsx`
- **Sections:** HeroSection, VlogSection, BlogSection, ProjectsSection, StatsSection, PhilosophySection, Footer
- **Data:** VlogSection, BlogSection, ProjectsSection all use `useSupabaseRealtimeSync` — show current user's content or empty state

#### About (`/about`)
- **File:** `src/app/about/page.tsx`
- **Sections:** Bio card, Technical Skills (Languages, Frontend, Backend, Tools), Journey Timeline

#### Contact (`/contact`)
- **File:** `src/app/contact/page.tsx`
- **Sections:** ContactForm component, social links (GitHub, LinkedIn, YouTube)
- **Features:** CAPTCHA-protected form, email delivery via SMTP

#### Projects (`/projects`)
- **File:** `src/app/projects/page.tsx`
- **Type:** Client component
- **Data Source:** `useSupabaseRealtimeSync<UserProject>("pj-user-projects", "user_projects", [])`
- **Features:** Built-in management UI (add/edit/delete), language filter chips, project cards with stars/forks/language/topics
- **Empty State:** "Add your first project" prompt for new users

#### Vlogs (`/vlogs`)
- **File:** `src/app/vlogs/page.tsx`
- **Type:** Client component
- **Data Source:** `useSupabaseRealtimeSync<Vlog>("pj-vlogs", "vlogs", [])`
- **Features:** Category filters (Technology, Education, Finance, Lifestyle, Other), YouTube embeds, add/edit/delete via VlogManager

#### Blog Listing (`/blog`)
- **File:** `src/app/blog/page.tsx`
- **Type:** Client component
- **Data Source:** `useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", [])`
- **Features:** Category filter tags, "Write" button, post cards with title/description/created_at/category/read_time
- **Filtering:** Only shows posts where `published === true`, sorted by `created_at` desc
- **Empty State:** "Write your first post" link for new users

#### Blog Post (`/blog/[slug]`)
- **File:** `src/app/blog/[slug]/page.tsx`
- **Type:** Client component with `use(params)` for Next.js 15 async params
- **Data Source:** Finds post by slug from `useSupabaseRealtimeSync` blog_posts
- **Rendering:** `react-markdown` + `remark-gfm` with styled component overrides (headings, paragraphs, code blocks, tables, blockquotes, lists)
- **Features:** Loading state, "Post not found" state, CommentSection
- **Note:** No `generateStaticParams` or `generateMetadata` — fully client-rendered per-user

#### Blog Editor (`/blog/write`)
- **File:** `src/app/blog/write/page.tsx`
- **Type:** Client component
- **Data Source:** `useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", [])`
- **Features:** Split-view editor (Editor | Split | Preview), live Markdown preview, word count, read time estimate, metadata panel (description, category, tags), auto-slug generation
- **Save:** Directly calls `setPosts()` from the sync hook — creates a `BlogPost` object with `id: Date.now().toString()`, auto-calculated `read_time`, `created_at: new Date().toISOString()`

#### Login (`/login`)
- **File:** `src/app/login/page.tsx`
- **Features:** Google OAuth sign-in button, animated background

### Dashboard Pages

#### Activity Feed (`/dashboard/activity`)
- **File:** `src/app/dashboard/activity/page.tsx`
- **Component:** `ActivityTimeline`
- **Features:** Unified activity from study sessions, notes, courses, projects, blog posts, code commits

#### Personal Analytics (`/dashboard/analytics`)
- **File:** `src/app/dashboard/analytics/page.tsx`
- **Component:** `PersonalAnalyticsClient`
- **Features:** Study patterns, coding activity, growth metrics

#### Life Index (`/dashboard/life-index`)
- **File:** `src/app/dashboard/life-index/page.tsx`
- **Component:** `LifeIndexDashboard`
- **Features:** Composite life score (0-100) across four equally weighted domains:
  - **Financial Health** — savings rate, budget adherence, net worth, savings goal progress
  - **Learning** — study hours vs 40h/mo target, course completion rate, LeetCode solved, active projects
  - **Technical** — GitHub commits this month, repos, stars, language diversity
  - **Personal Growth** — notes written, blog posts, study streak, completed projects
- **UI:** Radial score ring, 4 domain cards with progress bars, 6-month trend sparkline

### Finance Pages

#### Finance Hub (`/finance`)
- **File:** `src/app/finance/page.tsx`
- **Content:** FIRE philosophy, investment principles, target allocation chart, FIRE metrics

#### Finance Tracker (`/finance/tracker`)
- **File:** `src/app/finance/tracker/page.tsx`
- **Component:** `FinanceTrackerClient`
- **Features:** Full budget tracking, transactions, investments, subscriptions, payroll, net worth, reports

### Education Pages

#### Education Hub (`/education`)
- **File:** `src/app/education/page.tsx`
- **Content:** Learning principles, recommended reading, knowledge system, course tracker

#### Education Dashboard (`/education/dashboard`)
- **File:** `src/app/education/dashboard/page.tsx`
- **Component:** `EducationDashboardClient`
- **Features:** Study sessions, courses, notes, projects, files, GitHub stats, LeetCode stats

### Admin Pages

#### Admin Dashboard (`/admin`)
- **File:** `src/app/admin/page.tsx`
- **Layout:** Sidebar with nav (Overview, Blog, Analytics, DB Setup) + main content

#### Admin Blog (`/admin/blog`)
- **File:** `src/app/admin/blog/page.tsx`
- **Features:** Redirect links to `/blog` (view) and `/blog/write` (create) — blog management moved to main pages

#### Admin New Post (`/admin/blog/new`)
- **File:** `src/app/admin/blog/new/page.tsx`
- **Features:** Server-side redirect to `/blog/write`

#### Admin Analytics (`/admin/analytics`)
- **File:** `src/app/admin/analytics/page.tsx`
- **Features:** Total views, unique pages, top 10 pages by views, recent 20 page views

#### DB Setup (`/admin/setup`)
- **File:** `src/app/admin/setup/page.tsx`
- **Features:** Table existence checker, migration SQL provider, backup download

---

## 6. API Endpoints

### Authentication

#### `GET /api/auth/callback`
- **Purpose:** Handle Google OAuth callback from Supabase Auth
- **Behavior:** Exchanges auth code for session, sets cookies, redirects to `next` param or home

### Blog & Content

#### `GET /api/search-data`
- **Purpose:** Search data endpoint (returns empty — blog data is per-user, fetched client-side)
- **Response:** `{ "posts": [] }`
- **Cache:** 1-hour max-age

#### `GET & POST /api/comments`
- **Purpose:** Fetch and create blog comments (global by slug, not per-user)
- **GET:** `?slug=post-slug` -> returns comments array sorted by created_at
- **POST:** `{ "blog_slug", "author_name", "content" }` -> creates comment
- **Rate Limit:** 10 requests / 60 seconds per IP

### AI & Embeddings

#### `POST /api/chat`
- **Purpose:** AI chat assistant
- **Request:** `{ "messages": [{ "role", "content" }], "context": "optional" }`
- **Model:** OpenAI gpt-4o-mini (max 500 tokens)
- **Rate Limit:** 5 requests / 60 seconds per IP

#### `POST /api/embeddings/generate`
- **Purpose:** Generate OpenAI embeddings and store in Supabase
- **Request:** `{ "entityType", "entityId", "content", "tags" }`
- **Model:** text-embedding-3-small
- **Rate Limit:** 10 requests / 60 seconds per IP

#### `GET /api/embeddings/search`
- **Purpose:** Semantic search via vector similarity
- **Params:** `?query=search+text&limit=10&threshold=0.7`

#### `GET /api/knowledge-graph`
- **Purpose:** Generate knowledge graph from embeddings
- **Response:** `{ "nodes": [...], "edges": [...] }`
- **Cache:** 10-minute max-age

### GitHub & LeetCode

#### `GET /api/github`
- **Purpose:** Fetch GitHub repos with stats
- **Params:** `?all=true` for full repo list + language breakdown + aggregate stats
- **Default:** Top 6 repos by stars
- **Cache:** 1-hour revalidation

#### `GET /api/github/events`
- **Purpose:** Get commit activity timeline
- **Response:** `{ "commits": [{ "date", "count" }] }`

#### `GET /api/leetcode`
- **Purpose:** Fetch LeetCode profile statistics
- **Source:** alfa-leetcode-api.onrender.com

#### `GET /api/stats`
- **Purpose:** Combined GitHub + LeetCode statistics

### Finance

#### `GET /api/finance/stocks`
- **Purpose:** Real-time stock quotes from Yahoo Finance
- **Params:** `?symbols=AAPL,GOOGL`
- **Cache:** 15-minute revalidation

#### `GET /api/finance/stocks/history`
- **Purpose:** Historical stock price data

#### `GET /api/finance/stocks/search`
- **Purpose:** Search for stock symbols

#### `GET /api/finance/currency`
- **Purpose:** USD exchange rates
- **Source:** exchangerate-api.com
- **Cache:** 1-hour revalidation

#### `GET /api/finance/crypto`
- **Purpose:** Cryptocurrency price data

#### `POST /api/finance/report`
- **Purpose:** Generate and email monthly finance report (HTML)

#### `POST /api/finance/payroll-import`
- **Purpose:** Import payroll from Google Sheets / Apps Script

### Activity & Analytics

#### `GET /api/activity`
- **Purpose:** Unified activity feed (study, notes, courses, projects, blog, code)
- **Params:** `?cursor=id&limit=20&filter=all|study|note|course|project|blog|code`
- **Sources:** Supabase (study/notes/courses/projects/blog) + GitHub API (code)
- **Blog data:** Fetched from Supabase `blog_posts` table (not MDX)

#### `POST & GET /api/analytics`
- **Purpose:** Track and retrieve page views

### Data Sync

#### `POST /api/sync`
- **Purpose:** Authenticated write proxy for ALL database mutations
- **Auth:** Validates Supabase session; uses service role key (bypasses RLS)
- **Request:** `{ "table", "upsert?": [...], "delete?": ["id1", ...] }`
- **Behavior:** Automatically injects `user_id` into all upserted records; deletes only where `user_id` matches
- **Allowed Tables (19):** transactions, budgets, savings_goals, investments, subscriptions, net_worth_entries, study_sessions, edu_notes, courses, edu_projects, pay_stubs, part_time_jobs, part_time_hours, employers, work_schedules, enhanced_work_schedules, vlogs, blog_posts, user_projects

### Admin

#### `GET /api/admin/setup-db`
- **Purpose:** Check Supabase table status and provide migration SQL

#### `GET /api/admin/export`
- **Purpose:** Full JSON snapshot backup of all database tables

#### `GET /api/admin/check-tables`
- **Purpose:** Check which tables exist in Supabase

#### `POST /api/admin/migrate-owner`
- **Purpose:** Migrate data ownership between users

### Utility

#### `POST /api/contact`
- **Purpose:** Send contact form email
- **Protection:** Cloudflare Turnstile CAPTCHA, honeypot field, rate limit (3/60s)

#### `POST /api/newsletter`
- **Purpose:** Newsletter subscription

#### `POST /api/education/upload` & `DELETE /api/education/upload/[path]`
- **Purpose:** Upload/delete files in Supabase storage
- **Limits:** 10MB max file size

---

## 7. Components

### UI Components (22)

| Component | File | Purpose |
|-----------|------|---------|
| **AnimatedCounter** | `ui/AnimatedCounter.tsx` | Animated number counter with easing |
| **ContactForm** | `ui/ContactForm.tsx` | Contact form with Turnstile CAPTCHA |
| **CursorGlow** | `ui/CursorGlow.tsx` | Mouse-following glow effect |
| **EmptyState** | `ui/EmptyState.tsx` | Empty state placeholder with icon/message |
| **ErrorBoundary** | `ui/ErrorBoundary.tsx` | React error boundary wrapper |
| **FadeIn** | `ui/FadeIn.tsx` | Framer Motion fade-in animation wrapper |
| **FloatingBackground** | `ui/FloatingBackground.tsx` | Animated floating gradient blobs |
| **GrainOverlay** | `ui/GrainOverlay.tsx` | Film grain texture overlay |
| **Navbar** | `ui/Navbar.tsx` | Top navigation bar with route links |
| **NewsletterForm** | `ui/NewsletterForm.tsx` | Email subscription form |
| **PageHeader** | `ui/PageHeader.tsx` | Consistent page header (label, title, description) |
| **PrivateSection** | `ui/PrivateSection.tsx` | Wrapper that checks auth before rendering |
| **RealtimeStatus** | `ui/RealtimeStatus.tsx` | Supabase connection indicator dot |
| **ShareLink** | `ui/ShareLink.tsx` | Copy-to-clipboard share button |
| **SkeletonCard** | `ui/SkeletonCard.tsx` | Loading skeleton card placeholder |
| **SkeletonGrid** | `ui/SkeletonGrid.tsx` | Grid of skeleton cards |
| **SmoothScroll** | `ui/SmoothScroll.tsx` | Lenis smooth scroll wrapper |
| **StatsClient** | `ui/StatsClient.tsx` | Client-side stats display |
| **ThemeToggle** | `ui/ThemeToggle.tsx` | Dark/light mode toggle |
| **TurnstileWidget** | `ui/TurnstileWidget.tsx` | Cloudflare Turnstile CAPTCHA widget |
| **ViewToggle** | `ui/ViewToggle.tsx` | Shared list/grid/table view mode switcher |
| **VisibilityToggle** | `ui/VisibilityToggle.tsx` | Toggle dashboard section visibility |
| **YouTubeEmbed** | `ui/YouTubeEmbed.tsx` | Responsive YouTube video iframe |

### Home Page Sections (7)

| Component | Purpose |
|-----------|---------|
| **HeroSection** | Landing hero with name, title, CTA |
| **VlogSection** | Featured vlog — uses `useSupabaseRealtimeSync<Vlog>`, returns null if no vlogs |
| **BlogSection** | Latest 3 published blog posts — uses `useSupabaseRealtimeSync<BlogPost>`, returns null if empty |
| **ProjectsSection** | Top 3 projects — uses `useSupabaseRealtimeSync<UserProject>`, returns null if empty |
| **StatsSection** | GitHub + LeetCode stat counters |
| **PhilosophySection** | Personal philosophy text |
| **Footer** | Site footer with links |

### Blog Components (2)

| Component | Purpose |
|-----------|---------|
| **BlogFilters** | Category filter tabs, post card display, search, empty state with "Write your first post" link |
| **CommentSection** | Blog comment system with Supabase (global by slug, not per-user) |

### Finance Components (42)

The finance tracker is the largest module:

#### Core
| Component | Purpose |
|-----------|---------|
| **FinanceTrackerClient** | Main orchestrator - manages all state, tabs, and child components |
| **TransactionForm** | Add/edit transaction form |
| **TransactionTable** | Transaction display with 3 view modes, sorting, inline editing |
| **TransactionList** | Legacy transaction list (card view) |
| **TransactionFilters** | Filter bar (type, category, date range) |
| **MonthPicker** | Month selector dropdown |

#### Budgets & Savings
| Component | Purpose |
|-----------|---------|
| **BudgetManager** | Set monthly category budgets with progress bars |
| **BudgetPlanner** | Budget planning and analysis |
| **SavingsGoals** | Target savings goals with progress tracking |
| **SavingsTrendChart** | Line chart of savings over time |

#### Analysis & Reports
| Component | Purpose |
|-----------|---------|
| **MonthlySummaryCards** | Income/Expenses/Savings summary |
| **MonthlyTrend** | Bar chart of monthly income vs expenses |
| **CategoryBreakdown** | Pie chart of spending by category |
| **PieChart** | Reusable SVG pie chart |
| **Sparkline** | Mini sparkline chart |
| **Recommendations** | AI-generated spending recommendations |
| **AIAnalysis** | AI chat for financial insights |
| **MonthlyReportEmail** | Generate and email monthly report |
| **IncomeForecast** | Income projection based on trends |

#### Investments & Net Worth
| Component | Purpose |
|-----------|---------|
| **InvestmentTracker** | Portfolio tracker with stock quotes, gain/loss |
| **NetWorthCalculator** | Asset/liability tracker |
| **SubscriptionTracker** | Subscription management with billing alerts |

#### Payroll System
| Component | Purpose |
|-----------|---------|
| **PayrollTracker** | Main payroll management with tabs |
| **PayrollDashboard** | Payroll analytics with charts |
| **PayrollMonthlyTrend** | Monthly payroll trend chart |
| **PayrollWeeklyTrend** | Weekly earnings trend chart |
| **PayrollPieChart** | Employer income distribution |
| **PayStubForm** | Create/edit pay stub with tax calculations |
| **PayStubList** | List pay stubs with 3 view modes |
| **PayrollSettingsPanel** | Payroll configuration |
| **EmployerManager** | Add/edit/remove employers with pay rates |
| **IncomeGoalTracker** | Annual income goal setting and tracking |

#### Schedule & Shifts
| Component | Purpose |
|-----------|---------|
| **ShiftCalendar** | Visual calendar of work shifts |
| **ShiftConflictAlert** | Alert for overlapping shifts |
| **ScheduleImport** | Import schedules from Google Sheets |
| **ScheduleFileManager** | Manage schedule files |
| **GoogleSheetsImport** | Google Sheets payroll import |
| **PartTimeJobsTracker** | Track part-time job hours and earnings |

#### Export & Settings
| Component | Purpose |
|-----------|---------|
| **ExportButton** | CSV export of transactions |
| **ExcelExport** | Full Excel export (xlsx) |
| **CurrencySettings** | Display currency selector |
| **CategoryManager** | Custom category management |

### Education Components (24)

#### Course Tracker (9)
CourseTrackerSection, CourseCard, CourseDetail, CourseForm, CourseFilters, CourseStats, MaterialsList, ProgressRing, UpdatesLog

#### Education Dashboard
EducationDashboardClient, OverviewTab

#### Study Planner (7)
StudyPlannerTab, StudySessionForm, StudySessionList, StudyGoalsTracker, StudyBarChart, StudyStreakCounter, SubjectBreakdownChart

#### Notes (7)
NotesTab, NoteEditor, NoteCard, NoteSearch, NoteFileAttachment, NoteVersionHistory, TipTapEditor

#### Courses Dashboard (4)
CourseTrackerTab, CourseModuleList, CourseNotesEditor, CourseFileUpload

#### Projects (5)
ProjectsTab, ProjectCard, ProjectForm, ProjectDetail, ProjectMilestoneList

#### Files (5)
FilesTab, FileList, FilePreview, FileUploader, SupabaseStorageFallback

#### GitHub & LeetCode (5)
GitHubDashboardTab, RepoCard, LanguageChart, LeetCodeDashboardTab, DifficultyBar

### Analytics Components (9)
PersonalAnalyticsClient, ContributionHeatmap, CommitTimeline, CorrelationChart, GrowthIndexCard, KnowledgeGraph, KnowledgeGraphNode, KnowledgeGraphEdge, PageViewTracker

### Other Components

| Component | Purpose |
|-----------|---------|
| **ChatWidget** | AI chat widget with OpenAI |
| **SuggestedPrompts** | Chat prompt suggestions |
| **CommandPalette** | Cmd+K global search across all data types using Fuse.js |
| **SearchResult** | Individual search result |
| **SearchResultGroup** | Grouped search results |
| **ActivityCard** | Activity item card |
| **ActivityTimeline** | Infinite scroll activity timeline |
| **FilterChips** | Activity type filter chips |
| **LayoutShell** | App shell with Navbar + ChatWidget |
| **MDXContent** | MDX renderer (legacy component, not used by blog) |
| **VlogManager** | Vlog add/edit/delete management |
| **LifeIndexDashboard** | Composite life score ring + 4 domain cards |
| **AuthProvider** | Supabase auth context provider |
| **PostHogProvider** | PostHog analytics provider |
| **QueryProvider** | TanStack Query provider |
| **ThemeProvider** | Dark/light theme provider |

---

## 8. Custom Hooks

### Data Management Hooks

#### `useLocalStorage<T>(key, initialValue)`
**File:** `src/hooks/useLocalStorage.ts`
- Typed localStorage hook with SSR safety
- Returns `[value, setValue]`
- Handles hydration mismatch between server/client

#### `useSupabaseRealtimeSync<T extends { id: string }>(storageKey, tableName, defaultValue)`
**File:** `src/hooks/useSupabaseRealtimeSync.ts`
- **Primary data hook for the entire application**
- Three-layer sync: localStorage <-> /api/sync <-> Supabase Realtime
- **Initial sync:** Fetches from Supabase (filtered by RLS/user_id); if has data, uses as source of truth
- **Write-through:** Every `setData` call diffs prev vs next and fire-and-forgets upserts/deletes via `/api/sync`
- **Realtime:** Subscribes to postgres_changes (INSERT/UPDATE/DELETE) filtered by `user_id`
- **Multi-user safety:** Tracks current user ID; clears ALL localStorage when user changes to prevent cross-user data leak
- **Does NOT push stale localStorage** to Supabase on fresh login
- Returns `[data, setData, isConnected]`

#### `useSupabaseSync<T extends { id: string }>(localStorageKey, supabaseTable, initialValue)`
**File:** `src/hooks/useSupabaseSync.ts`
- Simpler one-way sync: fetches from Supabase on mount, merges with local state
- No realtime subscription

#### `useSupabaseStorage()`
**File:** `src/hooks/useSupabaseStorage.ts`
- Upload/delete files from Supabase storage (`education-files` bucket)
- Returns `{ isAvailable, upload(file, path), remove(path) }`

#### `useRecentSearches()`
**File:** `src/hooks/useRecentSearches.ts`
- Recent search history (max 10, deduped)

#### `useSearchIndex()`
**File:** `src/hooks/useSearchIndex.ts`
- Full-text search with Fuse.js across notes, courses, projects, blog posts

#### `useVisibility()`
**File:** `src/hooks/useVisibility.ts`
- Toggle visibility of dashboard sections

#### `useEmbeddingSync(entityType, items)`
**File:** `src/hooks/useEmbeddingSync.ts`
- Batch generate OpenAI embeddings for searchable content

#### `useAutoSync(config, callbacks)`
**File:** `src/hooks/useAutoSync.ts`
- Auto-sync payroll data from Google Apps Script
- Rate-limited (60s minimum), periodic polling

#### `useAutoRefresh()`
**File:** `src/hooks/useAutoRefresh.ts`
- Auto-refresh data at configurable intervals

### React Query Hooks

| Hook | File | API | Stale Time |
|------|------|-----|-----------|
| `useGitHubData()` | `queries/useGitHubData.ts` | `/api/github?all=true` | 30 min |
| `useStockQuotes(symbols)` | `queries/useStockQuotes.ts` | `/api/finance/stocks` | 15 min |
| `useCurrencyRates()` | `queries/useCurrencyRates.ts` | `/api/finance/currency` | 60 min |
| `useActivityFeed(filter)` | `queries/useActivityFeed.ts` | `/api/activity` | 5 min |
| `useKnowledgeGraph()` | `queries/useKnowledgeGraph.ts` | `/api/knowledge-graph` | 10 min |
| `useLeetCodeData()` | `queries/useLeetCodeData.ts` | `/api/leetcode` | 30 min |
| `usePriceHistory()` | `queries/usePriceHistory.ts` | `/api/finance/stocks/history` | 15 min |

---

## 9. Utility Libraries

### Supabase Clients (`src/lib/supabase/`)

| Module | Purpose | Auth |
|--------|---------|------|
| `client.ts` | Browser client (SSR-aware, reads auth cookies) | Anon key |
| `server.ts` | Server-side client (no session persistence) | Anon key |
| `admin.ts` | Admin client (full access, bypasses RLS) | Service role key |
| `middleware.ts` | Middleware-specific client for auth checks | Anon key |

### Core Utilities

#### `utils.ts` — `cn(...classes)`
- Merges Tailwind classes with `clsx` + `tailwind-merge`

#### `constants.ts` — Application Constants
- **Finance:** DEFAULT_EXPENSE_CATEGORIES (14), DEFAULT_INCOME_CATEGORIES (7), CATEGORY_COLORS, INVESTMENT_TYPES, NET_WORTH categories, SUBSCRIPTION_FREQUENCIES, SUPPORTED_CURRENCIES
- **Education:** COURSE_PLATFORMS, COURSE_CATEGORIES, COURSE_STATUS_CONFIG, STUDY_SUBJECTS, SUBJECT_COLORS
- **Projects:** PROJECT_STATUS_CONFIG (planned/in-progress/completed/on-hold/archived)
- **Payroll:** EMPLOYER_COLORS, PAY_TYPE_LABELS, DEFAULT_TAX_CONFIG, FILING_STATUS_LABELS
- **UI:** GITHUB_LANGUAGE_COLORS, FILE_TYPE_ICONS, DASHBOARD_TABS

#### `rate-limit.ts` — In-Memory Rate Limiter
- `rateLimit(ip, limit, windowMs)` -> `{ allowed, remaining }`
- Auto-cleanup of stale entries every 5 minutes

### API Helpers

#### `api.ts`
- `fetchGitHubRepos()` — Top 6 repos (1-hour cache)
- `fetchLeetCodeStats()` — LeetCode profile stats (1-hour cache)

#### `ai-context.ts`
- `buildAIContext(data)` — Summarizes user data for AI prompts

#### `search-index.ts`
- `createSearchIndex(items)` — Creates Fuse.js instance with weighted fields

### Finance Utilities (`src/lib/finance-utils.ts`)

**ID & Time:** generateId(), getCurrentMonth(), getMonthLabel()
**Currency:** formatCurrency(), formatCurrencyWithCode(), convertCurrency()
**Transactions:** getMonthlyTransactions(), getCategoryBreakdown(), getMonthlyTrend(), getSavingsTrend(), exportTransactionsCSV()
**Budgets:** getRecommendations()
**Reports:** generateMonthlyReport()
**Net Worth:** calculateNetWorth()
**Subscriptions:** getSubscriptionAlerts(), getMonthlySubscriptionTotal()
**Payroll:** getPayrollSummary(), getPartTimeJobEarnings()
**CSV Parsing:** parseGoogleSheetsCSV(), parseCSVLine()
**Schedule Parsing:** calculateShiftHours(), parseTimeToMinutes(), parseScheduleSheet()

### Payroll Utilities (`src/lib/payroll-utils.ts`)

**Calculations:** calculateGrossForEmployer(), calculateOvertimeHours(), detectShiftConflicts(), forecastIncome()
**Dashboard:** getPayrollDashboardStats(), buildScheduleTree()
**Transform:** formatShiftTime(), appsScriptToShifts(), formatRelativeTime()
**CSV:** detectCSVType(), parseScheduleHistoryCSV()

### Tax Calculations (`src/lib/payroll-tax.ts`)
- calculateFederalTax() — 2024 federal brackets (7 tiers)
- calculateVirginiaTax() — VA state brackets (4 tiers)
- calculateTaxBreakdown() — Full breakdown: federal, state, FICA, Medicare

### PDF Generation (`src/lib/payroll-pdf.ts`)
- generatePayStubPDF() / downloadPayStubPDF()

### Validation Schemas (`src/lib/payroll-schemas.ts`)
- Zod schemas: employerSchema, shiftTimeSchema, scheduleImportUrlSchema, taxConfigSchema, payStubGenerateSchema, incomeGoalSchema

### Education Utilities (`src/lib/education-utils.ts`)
- getStudyStreak(), getDailyStudyData(), getWeeklyStudyData(), getSubjectBreakdown(), getWeeklyGoalProgress(), calculateModuleProgress(), getRecentActivity(), formatDuration(), searchNotes(), formatFileSize()

### Visibility (`src/lib/visibility.ts`)
- SectionVisibility interface, DEFAULT_VISIBILITY, SECTION_LABELS

### Seed Data (`src/lib/stemtree-payroll.ts`)
- Sample PayStub objects for development

---

## 10. Database & Supabase

### Connection

- **URL:** `NEXT_PUBLIC_SUPABASE_URL`
- **Anon Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side, RLS-filtered reads)
- **Service Role Key:** `SUPABASE_SERVICE_ROLE_KEY` (server-side, bypasses RLS for writes via /api/sync)

### Tables

#### Content Tables (3) — NEW

| Table | Primary Key | Key Columns | RLS Policy |
|-------|------------|-------------|------------|
| `vlogs` | id (text) | user_id, title, youtube_id, category, duration, published_at, description | SELECT WHERE auth.uid() = user_id |
| `blog_posts` | id (text) | user_id, title, slug, description, content, category, read_time, published, tags (jsonb), created_at | SELECT WHERE auth.uid() = user_id |
| `user_projects` | id (text) | user_id, name, description, language, url, stars, forks, topics (jsonb), created_at | SELECT WHERE auth.uid() = user_id |

#### Finance Tables (6)

| Table | Primary Key | Key Columns | RLS Policy |
|-------|------------|-------------|------------|
| `transactions` | id (text) | user_id, type, amount, category, description, date | SELECT WHERE auth.uid() = user_id |
| `budgets` | id (text) | user_id, category, monthly_limit, month | SELECT WHERE auth.uid() = user_id |
| `savings_goals` | id (text) | user_id, name, target_amount, current_amount, deadline | SELECT WHERE auth.uid() = user_id |
| `investments` | id (text) | user_id, name, type, ticker, quantity, purchase_price, current_value | SELECT WHERE auth.uid() = user_id |
| `subscriptions` | id (text) | user_id, name, amount, currency, frequency, category, next_billing_date | SELECT WHERE auth.uid() = user_id |
| `net_worth_entries` | id (text) | user_id, name, type, category, value, currency | SELECT WHERE auth.uid() = user_id |

#### Education Tables (4)

| Table | Primary Key | Key Columns | RLS Policy |
|-------|------------|-------------|------------|
| `study_sessions` | id (text) | user_id, subject, duration_minutes, date, notes | SELECT WHERE auth.uid() = user_id |
| `edu_notes` | id (text) | user_id, title, content_html, tags (jsonb) | SELECT WHERE auth.uid() = user_id |
| `courses` | id (text) | user_id, name, platform, url, progress, status | SELECT WHERE auth.uid() = user_id |
| `edu_projects` | id (text) | user_id, name, description, status, github_url | SELECT WHERE auth.uid() = user_id |

#### Payroll Tables (4)

| Table | Primary Key | Key Columns | RLS Policy |
|-------|------------|-------------|------------|
| `pay_stubs` | id (text) | user_id, employer_name, pay period, hours, deductions, net_pay | SELECT WHERE auth.uid() = user_id |
| `part_time_jobs` | id (text) | user_id, name, pay_rate | SELECT WHERE auth.uid() = user_id |
| `part_time_hours` | id (text) | user_id, job_id, hours, date | SELECT WHERE auth.uid() = user_id |
| `employers` | id (text) | user_id, name, pay_type, hourly_rate, color | SELECT WHERE auth.uid() = user_id |

#### Schedule Tables (2)

| Table | Primary Key | Key Columns | RLS Policy |
|-------|------------|-------------|------------|
| `work_schedules` | id (text) | user_id, period_label, dates, hours | SELECT WHERE auth.uid() = user_id |
| `enhanced_work_schedules` | id (text) | user_id, shifts, employer | SELECT WHERE auth.uid() = user_id |

#### System Tables (used by API routes)

| Table | Used By | Purpose |
|-------|---------|---------|
| `comments` | `/api/comments` | Blog post comments (global by slug) |
| `newsletter` | `/api/newsletter` | Email subscriptions |
| `page_views` | `/api/analytics` | Page view tracking |
| `embeddings` | `/api/embeddings/*` | AI semantic search vectors |
| `user_profiles` | Auth system | User profile data |

### Row Level Security (RLS)

**All user data tables** have the same RLS pattern:
- **SELECT:** `auth.uid() = user_id` — users can only read their own data
- **INSERT/UPDATE/DELETE:** Routed through `/api/sync` which uses service role key (bypasses RLS) and automatically injects `user_id`

This ensures complete data isolation between users — User A can never see User B's data.

### Realtime

All 19 user data tables have realtime enabled via `supabase_realtime` publication. Changes push to connected clients via WebSocket, filtered by RLS.

### Storage

- **Bucket:** `education-files`
- **Used for:** Course materials, project files, note attachments
- **Limit:** 10MB per file

### Migrations (11)

| File | Purpose |
|------|---------|
| `20240301_payroll_tables.sql` | Creates employers, schedules, shifts, paystubs |
| `20240302_finance_education_tables.sql` | Creates transactions, budgets, savings_goals, investments, subscriptions, net_worth_entries, study_sessions, edu_notes, courses, edu_projects |
| `20240303_tighten_rls_policies.sql` | Tightens RLS to SELECT-only for anon key |
| `20240303_payroll_tables.sql` | Additional payroll table setup |
| `20240304_fix_payroll_schema.sql` | Fix payroll column types |
| `20240305_add_hours_times.sql` | Add hours/times columns |
| `20240306_expand_investment_types.sql` | Expand investment type options |
| `20240307_investment_exchange_market.sql` | Add exchange/market to investments |
| `20240308_add_user_profiles.sql` | Create user_profiles table |
| `20240309_add_user_id_to_tables.sql` | Add user_id column to all existing tables |
| `20240310_user_based_rls_policies.sql` | Per-user RLS policies + creates vlogs, blog_posts, user_projects tables with RLS + realtime (idempotent) |

### Data Sync Architecture

```
Component writes data
  -> useSupabaseRealtimeSync.setData()
    -> Computes new state from updater function
    -> Writes to localStorage (synchronous, immediate)
    -> Diffs prev vs next state
    -> Fire-and-forget POST to /api/sync (authenticated)
      -> Server validates Supabase session
      -> Injects user_id from session
      -> Uses service role key (bypasses RLS)
      -> Upserts changed items + deletes removed items
  -> Returns new state to React

On page load:
  -> Check if user changed since last session
    -> If different user: clear ALL localStorage (prevent data leak)
  -> Fetch all rows from Supabase (anon key, RLS filters by user_id)
  -> If Supabase has data -> replace localStorage (Supabase is source of truth)
  -> Subscribe to realtime changes (RLS-filtered by user_id)

On user logout -> login as different user:
  -> localStorage cleared automatically
  -> Fresh Supabase fetch returns only new user's data
  -> New user with no data sees empty state everywhere
```

---

## 11. Styling & Design System

### Design Language

- **Glass-morphism:** Translucent cards with backdrop blur and subtle borders
- **Dark-first:** Charcoal backgrounds with white/blue accents
- **Grain overlay:** Film grain texture for visual depth
- **Cursor glow:** Mouse-following ambient light effect
- **Floating backgrounds:** Animated gradient blobs

### Fonts

| Font | Usage | CSS Variable |
|------|-------|-------------|
| Syne | Display headings | `font-display` |
| DM Sans | Body text | `font-body` |
| JetBrains Mono | Code, monospace | `font-mono` |

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| `charcoal-950` | Custom CSS var | Deepest background |
| `charcoal-900` | Custom CSS var | Card backgrounds |
| `neon-blue` | `#3b82f6` | Primary accent |
| `neon-cyan` | `#06b6d4` | Secondary accent |
| `glass-white` | CSS var | Glass card fill |
| `glass-border` | CSS var | Glass card borders |

### Animations (Tailwind)

| Class | Duration | Effect |
|-------|----------|--------|
| `animate-float-slow` | 8s | Gentle floating |
| `animate-float-medium` | 6s | Medium floating |
| `animate-float-fast` | 4s | Quick floating |
| `animate-pulse-glow` | 3s | Pulsing glow |
| `animate-grain` | 0.5s | Film grain movement |

### CSS Classes

- `glass-card` — translucent card with border, backdrop blur (globals.css)
- `bg-white/[0.04]` — subtle white overlay
- `bg-white/10` — skeleton loading states

---

## 12. External Integrations

### Supabase
- **PostgreSQL:** 19+ user data tables + system tables
- **Auth:** Google OAuth with session cookies
- **Realtime:** WebSocket subscriptions for live multi-device sync
- **Storage:** File uploads for education materials
- **RLS:** Per-user data isolation (auth.uid() = user_id)

### OpenAI
- **Chat:** gpt-4o-mini for AI assistant
- **Embeddings:** text-embedding-3-small for semantic search
- **Rate:** 5 chat requests / 60s, 10 embedding requests / 60s

### GitHub API
- **Repos:** Public repository listing with stars, forks, topics
- **Events:** Commit activity for contribution heatmaps
- **Token:** Optional `GITHUB_TOKEN` for higher rate limits

### LeetCode
- **API:** alfa-leetcode-api.onrender.com (third-party)
- **Data:** Solved problems, difficulty breakdown, ranking

### Yahoo Finance
- **Stocks:** Real-time stock quotes, history, search
- **Cache:** 15-minute refresh

### Exchange Rate API
- **Rates:** USD-based exchange rates for 100+ currencies
- **Cache:** 1-hour refresh

### Google Sheets / Apps Script
- **Payroll import:** CSV export from Google Sheets or JSON from Apps Script

### Cloudflare Turnstile
- **CAPTCHA:** Contact form protection

### Email (SMTP)
- **Contact form:** Email delivery via Nodemailer
- **Finance reports:** Monthly report emails

### PostHog
- **Analytics:** Client-side event tracking

### Sentry
- **Error tracking:** Client, server, and edge runtime monitoring

### Vercel Analytics
- **Web vitals:** Core Web Vitals and page performance

---

## 13. Security

### Authentication
- Google OAuth via Supabase Auth
- Session cookies managed by `@supabase/ssr`
- Middleware enforces auth on all non-public routes
- `getUser()` validation on every request

### Multi-User Data Isolation
- Row Level Security (RLS) on all 19 user data tables
- `auth.uid() = user_id` policy on every table
- Anon key: SELECT-only (RLS-filtered reads)
- Service role key: Server-side only via `/api/sync` (bypasses RLS for writes)
- `/api/sync` automatically injects `user_id` from session — users cannot write to other accounts
- For deletes: only removes records matching current `user_id`
- localStorage cleared on user change to prevent cross-account data leakage

### Content Security Policy
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline' cloudflare accounts.google.com
style-src 'self' 'unsafe-inline' fonts.googleapis.com
img-src 'self' blob: data: https:
font-src 'self' fonts.gstatic.com
connect-src 'self' supabase openai github leetcode cloudflare posthog sentry exchangerate-api yahoo accounts.google.com
frame-src cloudflare youtube accounts.google.com
```

### Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Rate Limiting
- Comments: 10 req / 60s
- Contact: 3 req / 60s
- Chat: 5 req / 60s
- Embeddings: 10 req / 60s + 100 embeddings/day daily cap
- Payroll Import: 10 req / 60s

### Spam Protection
- Cloudflare Turnstile CAPTCHA on contact form
- Honeypot field detection
- Input validation with Zod schemas

---

## 14. Deployment

### Platform: Vercel

**Domain:** `pavanjillella.vercel.app`

### Build Pipeline
```bash
next build          # Production build
next-sitemap        # Generate sitemap (postbuild)
```

### Environment Variables Required

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key | Yes |
| `GITHUB_TOKEN` | GitHub API token | Optional |
| `LEETCODE_USERNAME` | LeetCode profile | Optional |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `SMTP_HOST` | Email SMTP host | Optional |
| `SMTP_PORT` | Email SMTP port | Optional |
| `SMTP_USER` | Email SMTP user | Optional |
| `SMTP_PASS` | Email SMTP password | Optional |
| `SMTP_FROM` | Email sender address | Optional |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile | Optional |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile | Optional |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics | Optional |
| `SENTRY_DSN` | Sentry error tracking | Optional |

### SEO
- Dynamic sitemap via `next-sitemap` (auto-generated on build)
- `robots.ts` for search engine directives
- Per-page metadata on static pages

---

## 15. File Tree

```
portfolio/
├── docs/
│   └── gmail-paystub-script.gs          # Google Apps Script
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── sitemap-0.xml
├── supabase/
│   └── migrations/
│       ├── 20240301_payroll_tables.sql
│       ├── 20240302_finance_education_tables.sql
│       ├── 20240303_tighten_rls_policies.sql
│       ├── 20240303_payroll_tables.sql
│       ├── 20240304_fix_payroll_schema.sql
│       ├── 20240305_add_hours_times.sql
│       ├── 20240306_expand_investment_types.sql
│       ├── 20240307_investment_exchange_market.sql
│       ├── 20240308_add_user_profiles.sql
│       ├── 20240309_add_user_id_to_tables.sql
│       └── 20240310_user_based_rls_policies.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home
│   │   ├── globals.css                  # Global styles
│   │   ├── not-found.tsx                # 404
│   │   ├── global-error.tsx             # Error boundary (Sentry)
│   │   ├── robots.ts                    # SEO robots
│   │   ├── sitemap.ts                   # Dynamic sitemap
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── login/page.tsx               # Google OAuth login
│   │   ├── projects/page.tsx            # Per-user projects + management UI
│   │   ├── vlogs/page.tsx               # Per-user vlogs + management UI
│   │   ├── blog/
│   │   │   ├── page.tsx                 # Per-user blog listing
│   │   │   ├── loading.tsx
│   │   │   ├── write/page.tsx           # Blog editor (saves to Supabase)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx             # Blog post (react-markdown)
│   │   │       └── loading.tsx
│   │   ├── finance/
│   │   │   ├── page.tsx
│   │   │   └── tracker/page.tsx
│   │   ├── education/
│   │   │   ├── page.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── dashboard/
│   │   │   ├── activity/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── life-index/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── setup/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx             # Redirects to /blog
│   │   │       └── new/page.tsx         # Redirects to /blog/write
│   │   └── api/
│   │       ├── auth/callback/route.ts   # OAuth callback
│   │       ├── analytics/route.ts
│   │       ├── activity/route.ts
│   │       ├── chat/route.ts
│   │       ├── comments/route.ts
│   │       ├── contact/route.ts
│   │       ├── newsletter/route.ts
│   │       ├── search-data/route.ts
│   │       ├── stats/route.ts
│   │       ├── sync/route.ts            # Authenticated write proxy (19 tables)
│   │       ├── leetcode/route.ts
│   │       ├── knowledge-graph/route.ts
│   │       ├── github/
│   │       │   ├── route.ts
│   │       │   └── events/route.ts
│   │       ├── finance/
│   │       │   ├── stocks/route.ts
│   │       │   ├── stocks/history/route.ts
│   │       │   ├── stocks/search/route.ts
│   │       │   ├── currency/route.ts
│   │       │   ├── crypto/route.ts
│   │       │   ├── report/route.ts
│   │       │   └── payroll-import/route.ts
│   │       ├── embeddings/
│   │       │   ├── generate/route.ts
│   │       │   └── search/route.ts
│   │       ├── education/
│   │       │   └── upload/
│   │       │       ├── route.ts
│   │       │       └── [path]/route.ts
│   │       └── admin/
│   │           ├── setup-db/route.ts
│   │           ├── export/route.ts
│   │           ├── check-tables/route.ts
│   │           └── migrate-owner/route.ts
│   ├── components/
│   │   ├── activity/                    # 3 components
│   │   ├── analytics/                   # 9 components
│   │   ├── blog/                        # 2 components
│   │   ├── chat/                        # 2 components
│   │   ├── dashboard/                   # 1 component
│   │   ├── education/                   # 24 components (9 sub-modules)
│   │   ├── finance/                     # 42 components
│   │   ├── layout/                      # 1 component
│   │   ├── mdx/                         # 1 component (legacy)
│   │   ├── providers/                   # 4 components (Auth, PostHog, Query, Theme)
│   │   ├── search/                      # 3 components
│   │   ├── sections/                    # 7 components
│   │   ├── ui/                          # 22 components
│   │   └── vlogs/                       # 1 component
│   ├── hooks/
│   │   ├── useAutoRefresh.ts
│   │   ├── useAutoSync.ts
│   │   ├── useEmbeddingSync.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useRecentSearches.ts
│   │   ├── useSearchIndex.ts
│   │   ├── useSupabaseRealtimeSync.ts
│   │   ├── useSupabaseStorage.ts
│   │   ├── useSupabaseSync.ts
│   │   ├── useVisibility.ts
│   │   └── queries/
│   │       ├── useActivityFeed.ts
│   │       ├── useCurrencyRates.ts
│   │       ├── useGitHubData.ts
│   │       ├── useKnowledgeGraph.ts
│   │       ├── useLeetCodeData.ts
│   │       ├── usePriceHistory.ts
│   │       └── useStockQuotes.ts
│   ├── lib/
│   │   ├── ai-context.ts
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── education-utils.ts
│   │   ├── finance-utils.ts
│   │   ├── payroll-pdf.ts
│   │   ├── payroll-schemas.ts
│   │   ├── payroll-tax.ts
│   │   ├── payroll-utils.ts
│   │   ├── rate-limit.ts
│   │   ├── search-index.ts
│   │   ├── stemtree-payroll.ts
│   │   ├── utils.ts
│   │   ├── visibility.ts
│   │   └── supabase/
│   │       ├── admin.ts
│   │       ├── client.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   ├── types/
│   │   └── index.ts                     # 80+ type definitions
│   └── middleware.ts                    # Google OAuth middleware
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── next-sitemap.config.js
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── sentry.server.config.ts
├── package.json
└── .env.local
```

### Totals

| Category | Count |
|----------|-------|
| Page Routes | 21 |
| API Endpoints | 29 |
| React Components | ~110 |
| Custom Hooks | 17 |
| Utility Modules | 18 |
| TypeScript Interfaces | 80+ |
| Database Tables | 19 user + 4 system |
| SQL Migrations | 11 |
| External Integrations | 11 |

---

*Updated on 2026-03-03. Reflects multi-user Google OAuth authentication, per-user Supabase data (vlogs, blogs, projects), Vercel deployment, and complete data isolation via RLS.*
