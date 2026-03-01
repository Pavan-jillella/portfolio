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

A full-featured personal portfolio and productivity suite built with Next.js 14. The site combines a public portfolio (blog, projects, vlogs, about, contact) with private dashboards for finance tracking, education management, payroll, analytics, and more.

**Key capabilities:**
- Public portfolio with blog (MDX), projects (GitHub API), vlogs (YouTube), about, and contact
- Finance tracker with budgets, transactions, investments, subscriptions, net worth, payroll
- Education dashboard with courses, study sessions, notes (rich-text), projects, GitHub/LeetCode stats
- AI chat assistant powered by OpenAI with blog context
- Semantic search with OpenAI embeddings and knowledge graph visualization
- Real-time data sync via Supabase (PostgreSQL + Realtime)
- Analytics with page views, contribution heatmaps, growth metrics
- PIN-based authentication protecting private sections
- Admin panel for blog management, analytics, and database setup

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + tailwindcss-animate |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL + Realtime + Storage) |
| State | React hooks + localStorage + Supabase sync |
| Server State | TanStack React Query |
| AI | OpenAI (gpt-4o-mini, text-embedding-3-small) |
| Rich Text | TipTap editor |
| Search | Fuse.js (fuzzy) + OpenAI embeddings (semantic) |
| PDF | jsPDF |
| Spreadsheets | xlsx (SheetJS) |
| Validation | Zod |
| Forms | React Hook Form |
| Email | Nodemailer (SMTP) |
| CAPTCHA | Cloudflare Turnstile |
| Analytics | PostHog + Vercel Analytics |
| Error Tracking | Sentry |
| Deployment | Netlify (@netlify/plugin-nextjs) |
| Blog Content | MDX (gray-matter + next-mdx-remote) |
| UI Primitives | Radix UI (dialog, tabs, toast, label, separator) |

### Dependencies (47 production, 9 dev)

**Production:** @hookform/resolvers, @marsidev/react-turnstile, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-separator, @radix-ui/react-slot, @radix-ui/react-tabs, @radix-ui/react-toast, @sentry/nextjs, @supabase/ssr, @supabase/supabase-js, @tanstack/react-query, @tiptap/extension-code-block-lowlight, @tiptap/extension-link, @tiptap/extension-placeholder, @tiptap/pm, @tiptap/react, @tiptap/starter-kit, @vercel/analytics, class-variance-authority, clsx, framer-motion, fuse.js, gray-matter, jspdf, lenis, lowlight, lucide-react, next, next-mdx-remote, next-sitemap, next-themes, nodemailer, openai, posthog-js, react, react-dom, react-hook-form, react-markdown, rehype-autolink-headings, rehype-highlight, rehype-slug, remark-gfm, tailwind-merge, tailwindcss-animate, xlsx, zod

---

## 3. Architecture

```
src/
  app/                    # Next.js App Router (pages + API routes)
    (public routes)       # /, /about, /contact, /projects, /vlogs, /blog
    (private routes)      # /finance, /education, /dashboard, /admin
    api/                  # 23 API endpoints
  components/             # 114 React components organized by domain
    activity/             # Activity timeline
    analytics/            # Charts, heatmaps, knowledge graph
    blog/                 # Comment section
    chat/                 # AI chat widget
    education/            # Course tracker + education dashboard (7 sub-modules)
    finance/              # Finance tracker + payroll (39 components)
    layout/               # Shell layout
    mdx/                  # MDX renderer
    providers/            # React context providers (PostHog, Query, Theme)
    search/               # Command palette
    sections/             # Home page sections
    ui/                   # Shared UI primitives (23 components)
    vlogs/                # Vlog manager
  hooks/                  # 15 custom hooks (data, queries, sync)
  lib/                    # 20 utility modules (finance, payroll, search, etc.)
  types/                  # Central TypeScript definitions (100+ interfaces)
  middleware.ts           # Auth middleware
content/
  blog/                   # 6 MDX blog posts
supabase/
  migrations/             # 2 SQL migration files
public/                   # Static assets (robots.txt, sitemap)
```

### Data Flow

```
User Action
  -> React Component (useState / useLocalStorage)
  -> useSupabaseRealtimeSync hook
    -> localStorage (immediate, synchronous)
    -> Supabase PostgreSQL (async fire-and-forget upsert/delete)
  -> Supabase Realtime subscription
    -> Other tabs/devices receive updates
```

---

## 4. Authentication & Middleware

### PIN-Based Authentication

**File:** `src/middleware.ts`

All routes except public paths require authentication. The middleware checks for an `auth-token` cookie set to `"authenticated"`.

**Public paths (no auth required):**
- `/login` - Login page
- `/api/*` - All API routes
- `/_next/*` - Next.js internals
- `/favicon.ico` and static assets (`.svg`, `.png`, `.jpg`, `.css`, `.js`, etc.)

**Login flow:**
1. User visits any protected route -> redirected to `/login`
2. User enters 10-digit PIN on the login page
3. PIN is validated against `AUTH_PIN` env var via `POST /api/auth`
4. On success, `auth-token=authenticated` cookie is set (7-day expiry, httpOnly, sameSite: lax)
5. User is redirected to the originally requested page

**Login UI features:**
- Animated 10-digit PIN grid (2 rows x 5 inputs)
- Keyboard support (number keys, Backspace, Enter, paste)
- Progress bar visualization
- Shake animation on error
- Checkmark animation on success
- Animated blob background with floating particles

---

## 5. Pages & Routes

### Public Pages

#### Home (`/`)
- **File:** `src/app/page.tsx`
- **Sections:** HeroSection, VlogSection, BlogSection, ProjectsSection, StatsSection, PhilosophySection, Footer
- **Purpose:** Landing page showcasing all major content areas

#### About (`/about`)
- **File:** `src/app/about/page.tsx`
- **Sections:** Bio card, Technical Skills (Languages, Frontend, Backend, Tools), Journey Timeline (2021-2024)
- **Features:** Animated fade-ins, glass-morphism cards, skill tag pills

#### Contact (`/contact`)
- **File:** `src/app/contact/page.tsx`
- **Sections:** ContactForm component, social links (GitHub, LinkedIn, YouTube)
- **Features:** CAPTCHA-protected form, email delivery via SMTP

#### Projects (`/projects`)
- **File:** `src/app/projects/page.tsx`
- **Data Source:** GitHub API (top 6 repos by stars) with static fallback
- **Features:** Server-side rendered, ISR (1-hour revalidation), star/fork counts, topic tags

#### Vlogs (`/vlogs`)
- **File:** `src/app/vlogs/page.tsx`
- **Features:** Category filters (Technology, Education, Finance, Lifestyle, Other), YouTube embeds, add/edit/delete management, localStorage persistence, Framer Motion animations

#### Blog (`/blog`)
- **File:** `src/app/blog/page.tsx`
- **Data Source:** MDX files in `content/blog/`
- **Features:** Category filter tags, "Write" button linking to editor, post cards with title/description/date/category/read-time

#### Blog Post (`/blog/[slug]`)
- **File:** `src/app/blog/[slug]/page.tsx`
- **Features:** MDX content rendering, SEO metadata generation, comment section (Supabase), static generation via generateStaticParams

#### Blog Editor (`/blog/write`)
- **File:** `src/app/blog/write/page.tsx`
- **Features:** Split-view editor (Editor | Split | Preview), live Markdown preview, word count, read time estimate, metadata panel (description, category, tags), auto-slug generation, publishes via `POST /api/admin/blog`

#### Login (`/login`)
- **File:** `src/app/login/page.tsx`
- **Features:** 10-digit PIN authentication (see [Authentication](#4-authentication--middleware))

### Private Pages

#### Finance Hub (`/finance`)
- **File:** `src/app/finance/page.tsx`
- **Content:** FIRE philosophy, investment principles (4 cards), target allocation chart (VTSAX 60%, VXUS 20%, BND 10%, VNQ 10%), FIRE metrics (savings rate, contributions, FIRE number, withdrawal rate)

#### Finance Tracker (`/finance/tracker`)
- **File:** `src/app/finance/tracker/page.tsx`
- **Component:** `FinanceTrackerClient` (see [Finance Components](#finance-components-39))
- **Features:** Full budget tracking, transactions, investments, subscriptions, payroll, net worth, reports

#### Education Hub (`/education`)
- **File:** `src/app/education/page.tsx`
- **Content:** Learning principles (4 cards), recommended reading (6 books), knowledge system (PARA method), course tracker section

#### Education Dashboard (`/education/dashboard`)
- **File:** `src/app/education/dashboard/page.tsx`
- **Component:** `EducationDashboardClient` (see [Education Components](#education-components-24))
- **Features:** Study sessions, courses, notes, projects, files, GitHub stats, LeetCode stats

#### Activity Feed (`/dashboard/activity`)
- **File:** `src/app/dashboard/activity/page.tsx`
- **Component:** `ActivityTimeline`
- **Features:** Unified activity from study sessions, blog posts, code commits

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
- **UI:** Radial score ring, 4 domain cards with progress bars and key metrics, 6-month trend sparkline chart

### Admin Pages

#### Admin Dashboard (`/admin`)
- **File:** `src/app/admin/page.tsx`
- **Layout:** Sidebar with nav (Overview, Blog, Analytics, DB Setup) + main content
- **Content:** Metric cards (Page Views, Comments, Subscribers), quick actions

#### Admin Blog (`/admin/blog`)
- **File:** `src/app/admin/blog/page.tsx`
- **Features:** List all published posts, post count, "New post" button, view links

#### Admin New Post (`/admin/blog/new`)
- **File:** `src/app/admin/blog/new/page.tsx`
- **Features:** Title, slug (auto-generated), category select, description, MDX content editor, save/publish

#### Admin Analytics (`/admin/analytics`)
- **File:** `src/app/admin/analytics/page.tsx`
- **Features:** Total views, unique pages, top 10 pages by views, recent 20 page views with timestamps

#### DB Setup (`/admin/setup`)
- **File:** `src/app/admin/setup/page.tsx`
- **Features:** Checks which Supabase tables exist (green/red indicators), provides migration SQL for missing tables, "Copy SQL" button, direct link to Supabase SQL Editor, refresh to re-check, **"Download Backup"** button for full JSON snapshot export

---

## 6. API Endpoints

### Authentication

#### `POST /api/auth`
- **Purpose:** Validate PIN and set session cookie
- **Request:** `{ "pin": "1234567890" }`
- **Response:** `{ "success": true }` or `{ "error": "Invalid PIN" }`
- **Cookie:** Sets `auth-token` (httpOnly, 7-day expiry)

### Blog & Content

#### `POST /api/admin/blog`
- **Purpose:** Create new MDX blog post file (development only)
- **Request:** `{ "title", "slug", "description", "category", "content" }`
- **Behavior:** Writes MDX file to `content/blog/{slug}.mdx` with YAML frontmatter
- **Restriction:** Returns 403 in production

#### `GET /api/search-data`
- **Purpose:** Get simplified blog post data for search indexing
- **Response:** `{ "posts": [{ "slug", "title", "description", "category", "tags" }] }`
- **Cache:** 1-hour max-age

#### `GET & POST /api/comments`
- **Purpose:** Fetch and create blog comments
- **GET:** `?slug=post-slug` -> returns comments array sorted by created_at
- **POST:** `{ "blog_slug", "author_name", "content" }` -> creates comment
- **Rate Limit:** 10 requests / 60 seconds per IP
- **Validation:** Content max 2000 chars, author max 100 chars

### AI & Embeddings

#### `POST /api/chat`
- **Purpose:** AI chat assistant with blog context
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
- **Uses:** Supabase RPC for cosine similarity matching

#### `GET /api/knowledge-graph`
- **Purpose:** Generate knowledge graph from embeddings
- **Response:** `{ "nodes": [...], "edges": [...] }`
- **Edge Logic:** Tags (2+ shared = connection) + Similarity (>0.8 cosine)
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
- **Source:** GitHub PushEvent aggregation

#### `GET /api/leetcode`
- **Purpose:** Fetch LeetCode profile statistics
- **Source:** alfa-leetcode-api.onrender.com
- **Response:** Solved counts (easy/medium/hard), ranking, recent submissions, calendar

#### `GET /api/stats`
- **Purpose:** Combined GitHub + LeetCode statistics
- **Response:** `{ "github": { repos, stars, followers }, "leetcode": { solved, easy, medium, hard } }`

### Finance

#### `GET /api/finance/stocks`
- **Purpose:** Real-time stock quotes from Yahoo Finance
- **Params:** `?symbols=AAPL,GOOGL`
- **Response:** `{ "quotes": [{ "symbol", "price", "change", "changePercent" }] }`
- **Cache:** 15-minute revalidation

#### `GET /api/finance/currency`
- **Purpose:** USD exchange rates
- **Source:** exchangerate-api.com
- **Response:** `{ "rates": { "EUR": 0.92, ... }, "base": "USD" }`
- **Cache:** 1-hour revalidation

#### `POST /api/finance/report`
- **Purpose:** Generate and email monthly finance report (HTML)
- **Request:** `{ "email", "reportData": { month, income, expenses, savings, ... } }`
- **Email:** Styled HTML with stats cards, category table, recommendations

#### `POST /api/finance/payroll-import`
- **Purpose:** Import payroll from Google Sheets / Apps Script
- **URL Types:** Google Sheets (exported as CSV) or Apps Script endpoint (JSON)
- **Rate Limit:** 10 requests / 60 seconds per IP

### Activity & Analytics

#### `GET /api/activity`
- **Purpose:** Unified activity feed (study, notes, courses, projects, blog, code)
- **Params:** `?cursor=id&limit=20&filter=all|study|note|course|project|blog|code`
- **Sources:** Supabase + MDX + GitHub API

#### `POST & GET /api/analytics`
- **Purpose:** Track and retrieve page views
- **POST:** `{ "path", "referrer" }` -> records view
- **GET:** Returns view list and total count

### Utility

#### `POST /api/contact`
- **Purpose:** Send contact form email
- **Protection:** Cloudflare Turnstile CAPTCHA, honeypot field, rate limit (3/60s)
- **Email:** SMTP via Nodemailer

#### `POST /api/newsletter`
- **Purpose:** Newsletter subscription
- **Request:** `{ "email" }`
- **Storage:** Supabase `newsletter` table

#### `POST /api/education/upload` & `DELETE /api/education/upload/[path]`
- **Purpose:** Upload/delete files in Supabase storage (education-files bucket)
- **Limits:** 10MB max file size
- **Allowed:** PDF, images, text, Office docs, ZIP, CSV

#### `GET /api/admin/setup-db`
- **Purpose:** Check Supabase table status and provide migration SQL
- **Tables Checked:** transactions, budgets, savings_goals, investments, subscriptions, net_worth_entries, study_sessions, edu_notes, courses, edu_projects

#### `GET /api/admin/export`
- **Purpose:** Full JSON snapshot backup of all 14 database tables
- **Auth:** Requires `auth-token` cookie
- **Response:** Downloadable JSON file with `Content-Disposition: attachment` header
- **Includes:** Table data, row counts per table, error list, export timestamp, version number

#### `POST /api/sync`
- **Purpose:** Authenticated write proxy for all database mutations
- **Auth:** Requires `auth-token` cookie; uses service role key (bypasses RLS)
- **Request:** `{ "table", "upsert?": [...], "delete?": ["id1", ...] }`
- **Allowed Tables:** transactions, budgets, savings_goals, investments, subscriptions, net_worth_entries, study_sessions, edu_notes, courses, edu_projects

---

## 7. Components

### UI Components (23)

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
| **ProjectCard** | `ui/ProjectCard.tsx` | GitHub project card with stars/forks/language |
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

### ViewToggle Details

**File:** `src/components/ui/ViewToggle.tsx`

Reusable view mode switcher used across 5+ components. Supports `list`, `grid`, and `table` modes with SVG icons.

```typescript
type ViewMode = "list" | "grid" | "table";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  modes?: ViewMode[];  // defaults to all three
}
```

**Used in:** TransactionTable, InvestmentTracker, SubscriptionTracker, StudySessionList, ProjectsTab

### Home Page Sections (7)

| Component | Purpose |
|-----------|---------|
| **HeroSection** | Landing hero with name, title, CTA |
| **VlogSection** | Featured YouTube video embed |
| **BlogSection** | Latest blog posts grid |
| **ProjectsSection** | Featured GitHub projects |
| **StatsSection** | GitHub + LeetCode stat counters |
| **PhilosophySection** | Personal philosophy text |
| **Footer** | Site footer with links |

### Finance Components (39)

The finance tracker is the largest module with 39 components covering:

#### Core
| Component | Purpose |
|-----------|---------|
| **FinanceTrackerClient** | Main orchestrator - manages all state, tabs, and child components |
| **TransactionForm** | Add/edit transaction form (type, amount, category, date, description) |
| **TransactionTable** | Transaction display with 3 view modes (list/grid/table), sorting, inline editing, edit modal |
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
| **MonthlySummaryCards** | Income/Expenses/Savings summary with year selector and all-time mode |
| **MonthlyTrend** | Bar chart of monthly income vs expenses |
| **CategoryBreakdown** | Pie chart of spending by category |
| **PieChart** | Reusable SVG pie chart |
| **Recommendations** | AI-generated spending recommendations |
| **AIAnalysis** | AI chat for financial insights |
| **MonthlyReportEmail** | Generate and email monthly report |
| **IncomeForecast** | Income projection based on trends |

#### Investments & Net Worth
| Component | Purpose |
|-----------|---------|
| **InvestmentTracker** | Portfolio tracker with 3 view modes, stock quotes, gain/loss |
| **NetWorthCalculator** | Asset/liability tracker with net worth calculation |
| **SubscriptionTracker** | Subscription management with 3 view modes, billing alerts |

#### Payroll System
| Component | Purpose |
|-----------|---------|
| **PayrollTracker** | Main payroll management with tabs |
| **PayrollDashboard** | Payroll analytics with charts (defaults to latest month with data) |
| **PayrollMonthlyTrend** | Monthly payroll trend chart |
| **PayrollWeeklyTrend** | Weekly earnings trend chart |
| **PayrollPieChart** | Employer income distribution |
| **PayStubForm** | Create/edit pay stub with tax calculations |
| **PayStubList** | List pay stubs with 3 view modes |
| **PayrollSettingsPanel** | Payroll configuration (frequency, employers, taxes) |
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

#### Course Tracker
| Component | Purpose |
|-----------|---------|
| **CourseTrackerSection** | Course listing with add/edit/filter |
| **CourseCard** | Individual course card with progress ring |
| **CourseDetail** | Full course detail panel |
| **CourseForm** | Add/edit course form |
| **CourseFilters** | Filter by platform/status/category |
| **CourseStats** | Aggregate course statistics |
| **MaterialsList** | Course materials listing |
| **ProgressRing** | SVG circular progress indicator |
| **UpdatesLog** | Course activity log |

#### Education Dashboard
| Component | Purpose |
|-----------|---------|
| **EducationDashboardClient** | Main dashboard orchestrator with tabs |
| **OverviewTab** | Dashboard overview with summary stats and recent activity |

#### Study Planner (7)
| Component | Purpose |
|-----------|---------|
| **StudyPlannerTab** | Tab wrapper for study features |
| **StudySessionForm** | Log study session (subject, duration, date, notes) |
| **StudySessionList** | Session list with 3 view modes |
| **StudyGoalsTracker** | Weekly study hour goals |
| **StudyBarChart** | Daily study time bar chart |
| **StudyStreakCounter** | Consecutive study day counter |
| **SubjectBreakdownChart** | Study time by subject chart |

#### Notes (7)
| Component | Purpose |
|-----------|---------|
| **NotesTab** | Notes management tab |
| **NoteCard** | Note card with title/tags/preview |
| **NoteEditor** | Full note editor with TipTap |
| **TipTapEditor** | Rich text editor (bold, italic, links, code blocks) |
| **NoteSearch** | Note search by title/content/tags |
| **NoteFileAttachment** | File attachments on notes |
| **NoteVersionHistory** | Note revision history |

#### Courses Dashboard (4)
| Component | Purpose |
|-----------|---------|
| **CourseTrackerTab** | Course management within dashboard |
| **CourseModuleList** | Module progress checklist |
| **CourseNotesEditor** | Per-course notes |
| **CourseFileUpload** | Per-course file uploads |

#### Projects (5)
| Component | Purpose |
|-----------|---------|
| **ProjectsTab** | Projects list with 3 view modes and status filter |
| **ProjectCard** | Project card with status, milestones |
| **ProjectDetail** | Full project detail with milestones, notes, files |
| **ProjectForm** | Add/edit project form |
| **ProjectMilestoneList** | Milestone checklist with due dates |

#### Files (5)
| Component | Purpose |
|-----------|---------|
| **FilesTab** | File management tab |
| **FileList** | Uploaded files grid |
| **FilePreview** | File preview (images, PDFs, etc.) |
| **FileUploader** | Drag-and-drop file upload |
| **SupabaseStorageFallback** | Fallback when storage unavailable |

#### GitHub & LeetCode (5)
| Component | Purpose |
|-----------|---------|
| **GitHubDashboardTab** | GitHub repos, stats, language breakdown |
| **RepoCard** | GitHub repository card |
| **LanguageChart** | Language distribution bar chart |
| **LeetCodeDashboardTab** | LeetCode stats and submission history |
| **DifficultyBar** | Easy/medium/hard difficulty bar |

### Analytics Components (9)

| Component | Purpose |
|-----------|---------|
| **PersonalAnalyticsClient** | Main analytics dashboard |
| **ContributionHeatmap** | GitHub-style contribution grid |
| **CommitTimeline** | Commit activity timeline |
| **CorrelationChart** | Study vs coding correlation |
| **GrowthIndexCard** | Growth metric cards |
| **KnowledgeGraph** | Interactive embedding visualization |
| **KnowledgeGraphNode** | Graph node component |
| **KnowledgeGraphEdge** | Graph edge component |
| **PageViewTracker** | Track page views client-side |

### Dashboard Components (1)

| Component | Purpose |
|-----------|---------|
| **LifeIndexDashboard** | Unified Life Index with composite score ring, 4 domain cards (Financial Health, Learning, Technical, Personal Growth), progress bars, key metrics, and 6-month trend sparkline |

### Other Components

| Component | Purpose |
|-----------|---------|
| **CommentSection** | Blog comment system with Supabase, error handling |
| **ChatWidget** | AI chat widget with OpenAI |
| **SuggestedPrompts** | Chat prompt suggestions |
| **CommandPalette** | Cmd+K global search across all 8 data types (blog, notes, courses, projects, transactions, study sessions, subscriptions, pay stubs) using Fuse.js |
| **SearchResult** | Individual search result with type-specific icons and colors |
| **SearchResultGroup** | Grouped search results |
| **ActivityCard** | Activity item card |
| **ActivityTimeline** | Infinite scroll activity timeline |
| **FilterChips** | Activity type filter chips |
| **LayoutShell** | App shell with Navbar + ChatWidget |
| **MDXContent** | MDX renderer with rehype plugins |
| **VlogManager** | Vlog add/edit/delete management |
| **PostHogProvider** | PostHog analytics provider |
| **QueryProvider** | TanStack Query provider |
| **ThemeProvider** | Dark/light theme provider |

---

## 8. Custom Hooks

### Data Management Hooks

#### `useLocalStorage<T>(key, initialValue)`
**File:** `src/hooks/useLocalStorage.ts`
- Typed localStorage hook with SSR safety
- Returns `[value, setValue]` (setValue supports function updater)
- Syncs to localStorage on every set call

#### `useSupabaseRealtimeSync<T extends { id: string }>(storageKey, tableName, defaultValue)`
**File:** `src/hooks/useSupabaseRealtimeSync.ts`
- Bidirectional sync: localStorage <-> Supabase PostgreSQL
- **Initial sync:** Fetches from Supabase; if has data, uses as source of truth; if empty, pushes localStorage up
- **Write-through:** Every `setData` call diffs prev vs next and fire-and-forgets upserts/deletes to Supabase
- **Realtime:** Subscribes to postgres_changes (INSERT/UPDATE/DELETE) for live updates across tabs/devices
- **Deduplication:** Avoids duplicates from own realtime echoes
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
- Returns `{ searches, addSearch, clearSearches }`

#### `useSearchIndex()`
**File:** `src/hooks/useSearchIndex.ts`
- Full-text search with Fuse.js across notes, courses, projects, blog posts
- Returns `{ search(query), isReady }`

#### `useVisibility()`
**File:** `src/hooks/useVisibility.ts`
- Toggle visibility of dashboard sections (github, leetcode, study, activity, analytics, financeTracker, notes, files)
- Returns `{ visibility, toggleSection, isVisible }`

#### `useEmbeddingSync(entityType, items)`
**File:** `src/hooks/useEmbeddingSync.ts`
- Batch generate OpenAI embeddings for searchable content
- Debounces 2 seconds, batches up to 20 items, tracks embedded IDs in localStorage

#### `useAutoSync(config, callbacks)`
**File:** `src/hooks/useAutoSync.ts`
- Auto-sync payroll data from Google Apps Script
- Rate-limited (60s minimum), periodic polling, handles schedule-history and pay-stubs CSV types
- Returns `{ isSyncing, lastSyncedAt, syncError, triggerSync }`

### React Query Hooks

| Hook | File | API | Stale Time | Returns |
|------|------|-----|-----------|---------|
| `useGitHubData()` | `queries/useGitHubData.ts` | `/api/github?all=true` | 30 min | `{ repos, stats, languages }` |
| `useStockQuotes(symbols)` | `queries/useStockQuotes.ts` | `/api/finance/stocks` | 15 min | `{ quotes: StockQuote[] }` |
| `useCurrencyRates()` | `queries/useCurrencyRates.ts` | `/api/finance/currency` | 60 min | `{ rates, base, updated }` |
| `useActivityFeed(filter)` | `queries/useActivityFeed.ts` | `/api/activity` | 5 min | Infinite cursor pagination |
| `useKnowledgeGraph()` | `queries/useKnowledgeGraph.ts` | `/api/knowledge-graph` | 10 min | `{ nodes, edges }` |
| `useLeetCodeData()` | `queries/useLeetCodeData.ts` | `/api/leetcode` | 30 min | `LeetCodeDashboardData` |

---

## 9. Utility Libraries

### Supabase Clients (`src/lib/supabase/`)

| Module | Purpose | Auth |
|--------|---------|------|
| `client.ts` | Browser client | Anon key |
| `server.ts` | Server-side client (no session persistence) | Anon key |
| `admin.ts` | Admin client (full access) | Service role key |

### Core Utilities

#### `utils.ts` - `cn(...classes)`
- Merges Tailwind classes with `clsx` + `tailwind-merge`

#### `constants.ts` - Application Constants
- **Finance:** DEFAULT_EXPENSE_CATEGORIES (14), DEFAULT_INCOME_CATEGORIES (7), CATEGORY_COLORS, CATEGORY_HEX_COLORS, INVESTMENT_TYPES, NET_WORTH_ASSET_CATEGORIES, NET_WORTH_LIABILITY_CATEGORIES, SUBSCRIPTION_FREQUENCIES, SUPPORTED_CURRENCIES
- **Education:** COURSE_PLATFORMS, COURSE_CATEGORIES, COURSE_STATUS_CONFIG, STUDY_SUBJECTS, SUBJECT_COLORS
- **Projects:** PROJECT_STATUS_CONFIG (planned/in-progress/completed/on-hold/archived)
- **Payroll:** EMPLOYER_COLORS, PAY_TYPE_LABELS, DEFAULT_TAX_CONFIG, DEFAULT_EMPLOYERS, FILING_STATUS_LABELS
- **UI:** GITHUB_LANGUAGE_COLORS, FILE_TYPE_ICONS, DASHBOARD_TABS

#### `rate-limit.ts` - In-Memory Rate Limiter
- `rateLimit(ip, limit, windowMs)` -> `{ allowed, remaining }`
- Auto-cleanup of stale entries every 5 minutes

### Content

#### `mdx.ts` - Blog Post Processing
- `getAllPosts()` - All published MDX posts sorted by date
- `getPostBySlug(slug)` - Single post with full content
- `getAllPostSlugs()` - Slug list for static generation

#### `data.ts` - Static Fallback Data
- `BLOG_POSTS[]` (6 posts), `PROJECTS[]` (6 projects)

#### `vlogs.ts` - Vlog Data
- `VLOGS[]` (6 videos) with YouTube IDs

### API Helpers

#### `api.ts`
- `fetchGitHubRepos()` - Top 6 repos from Pavan-jillella (1-hour cache)
- `fetchLeetCodeStats()` - LeetCode profile stats (1-hour cache)

#### `ai-context.ts`
- `buildAIContext(data)` - Summarizes user data into compact string for AI prompts

#### `search-index.ts`
- `createSearchIndex(items)` - Creates Fuse.js instance with weighted fields

### Finance Utilities (`src/lib/finance-utils.ts`)

**ID & Time:**
- `generateId()` - UUID generator
- `getCurrentMonth()` - "YYYY-MM" format
- `getMonthLabel(month)` - "January 2025" format

**Currency:**
- `formatCurrency(amount)` - "$1,234" format
- `formatCurrencyWithCode(amount, code)` - With currency symbol
- `convertCurrency(amount, from, to, rates)` - Exchange rate conversion

**Transactions:**
- `getMonthlyTransactions(transactions, month)` - Filter by month
- `getCategoryBreakdown(transactions)` - Expense totals by category
- `getMonthlyTrend(transactions, months=6)` - Income/expenses/net over time
- `getSavingsTrend(transactions, months=6)` - Savings amounts over time
- `exportTransactionsCSV(transactions)` - CSV export string

**Budgets:**
- `getRecommendations(transactions, budgets)` - Spending alerts (>20% increase, budget exceeded)

**Reports:**
- `generateMonthlyReport(transactions, budgets, month)` - Full monthly report object

**Net Worth:**
- `calculateNetWorth(entries)` - `{ assets, liabilities, netWorth }`

**Subscriptions:**
- `getSubscriptionAlerts(subscriptions)` - Upcoming billing reminders
- `getMonthlySubscriptionTotal(subscriptions)` - Normalized monthly cost

**Payroll:**
- `getPayrollSummary(payStubs, year)` - YTD or annual totals
- `getPartTimeJobEarnings(jobs, hours, month)` - Earnings by job

**CSV Parsing:**
- `parseGoogleSheetsCSV(csvText)` - Parse pay stub CSV
- `parseCSVLine(line)` - Handle quoted values, escapes

**Schedule Parsing:**
- `calculateShiftHours(timeRange)` - Parse "10-4" format
- `parseTimeToMinutes(time)` - Multiple formats ("10:00", "4:30AM", "4PM")
- `parseScheduleSheet(csvText, name)` - Extract employee shifts

### Payroll Utilities (`src/lib/payroll-utils.ts`)

**Calculations:**
- `calculateGrossForEmployer(employer, regularHours, overtimeHours, isHoliday)` - Supports hourly/salary/commission/fixed_weekly/per_shift
- `calculateOvertimeHours(weeklyHours, threshold=40)` - Regular/overtime split
- `detectShiftConflicts(schedules, employers)` - Overlapping shift detection
- `forecastIncome(avgWeeklyHours, employer, weeksRemaining)` - Income projection

**Dashboard:**
- `getPayrollDashboardStats(schedules, paystubs, employers, month)` - Monthly metrics, employer breakdown, weekly/monthly trends
- `buildScheduleTree(schedules)` - Group by year > month

**Transform:**
- `formatShiftTime(raw)` - "02:00:00 GMT" -> "2AM"
- `appsScriptToShifts(data)` - Google Apps Script format conversion
- `formatRelativeTime(isoString)` - "12m ago", "2h ago"

**CSV:**
- `detectCSVType(csv)` - "schedule-history" or "pay-stubs"
- `parseScheduleHistoryCSV(csv)` - Weekly payroll history

### Tax Calculations (`src/lib/payroll-tax.ts`)

- `calculateFederalTax(annualTaxableIncome, filingStatus)` - 2024 federal brackets (7 tiers)
- `calculateVirginiaTax(annualTaxableIncome)` - VA state brackets (4 tiers)
- `calculateTaxBreakdown(grossPay, annualEstimate, config)` - Full breakdown: federal, state, FICA, Medicare, custom deductions, effective rate

### PDF Generation (`src/lib/payroll-pdf.ts`)

- `generatePayStubPDF(stub, employer)` - Creates styled PDF with header, earnings, deductions, net pay
- `downloadPayStubPDF(stub, employer)` - Generates and triggers browser download

### Validation Schemas (`src/lib/payroll-schemas.ts`)

Zod schemas for:
- `employerSchema` - Employer form (name, pay_type, rates, overtime settings)
- `shiftTimeSchema` - Time format validation ("10:00", "4PM")
- `scheduleImportUrlSchema` - Google Sheets/Apps Script URL validation
- `taxConfigSchema` - Tax configuration
- `payStubGenerateSchema` - Pay stub generation form
- `incomeGoalSchema` - Year + target amount

### Education Utilities (`src/lib/education-utils.ts`)

- `getStudyStreak(sessions)` - Consecutive study days count
- `getDailyStudyData(sessions, days=7)` - Daily minute aggregates
- `getWeeklyStudyData(sessions, weeks=4)` - Weekly aggregates
- `getSubjectBreakdown(sessions)` - Minutes per subject
- `getWeeklyGoalProgress(sessions, goals)` - Hours vs target
- `calculateModuleProgress(modules)` - Percentage complete
- `getRecentActivity(sessions, notes, projects)` - Combined timeline (max 15)
- `formatDuration(minutes)` - "1h 30m" format
- `searchNotes(notes, query)` - Search by title/content/tags
- `formatFileSize(bytes)` - "1.2 MB" format

### Visibility (`src/lib/visibility.ts`)

- `SectionVisibility` interface (8 toggleable sections)
- `DEFAULT_VISIBILITY` - All sections visible by default
- `SECTION_LABELS` - Human-readable labels

### Seed Data (`src/lib/stemtree-payroll.ts`)

- `STEMTREE_PAYROLL_HISTORY[]` - 25 sample PayStub objects (April 2024 - February 2025, biweekly, $14/hour)

---

## 10. Database & Supabase

### Connection

- **URL:** `NEXT_PUBLIC_SUPABASE_URL` (tawdygpdsqdqryuqewim.supabase.co)
- **Anon Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side access)
- **Service Role Key:** `SUPABASE_SERVICE_ROLE_KEY` (server-side admin access)

### Tables

#### Finance Tables (6)

| Table | Primary Key | Key Columns | RLS |
|-------|------------|-------------|-----|
| `transactions` | id (text) | type, amount, category, description, date, created_at | Open |
| `budgets` | id (text) | category, monthly_limit, month | Open |
| `savings_goals` | id (text) | name, target_amount, current_amount, deadline, created_at | Open |
| `investments` | id (text) | name, type, ticker, quantity, purchase_price, current_value, currency | Open |
| `subscriptions` | id (text) | name, amount, currency, frequency, category, next_billing_date, active | Open |
| `net_worth_entries` | id (text) | name, type, category, value, currency | Open |

#### Education Tables (4)

| Table | Primary Key | Key Columns | RLS |
|-------|------------|-------------|-----|
| `study_sessions` | id (text) | subject, duration_minutes, date, notes | Open |
| `edu_notes` | id (text) | title, content_html, linked_course_id, linked_project_id, tags (jsonb) | Open |
| `courses` | id (text) | name, platform, url, progress, status, category, total_hours | Open |
| `edu_projects` | id (text) | name, description, status, github_url | Open |

#### Payroll Tables (4) - From separate migration

| Table | Primary Key | Key Columns | RLS |
|-------|------------|-------------|-----|
| `employers` | id (uuid) | name, pay_type, hourly_rate, color, overtime settings | Open |
| `schedules` | id (uuid) | employer_id (FK), period_label, dates, hours, gross_amount | Open |
| `shifts` | id (uuid) | schedule_id (FK), date, day, times, hours, is_holiday | Open |
| `paystubs` | id (uuid) | employer_name, pay period, hours, deduction columns, net_pay | Open |

#### Other Tables (used by API routes)

| Table | Used By | Purpose |
|-------|---------|---------|
| `comments` | `/api/comments` | Blog post comments |
| `newsletter` | `/api/newsletter` | Email subscriptions |
| `page_views` | `/api/analytics` | Page view tracking |
| `embeddings` | `/api/embeddings/*` | AI semantic search vectors |

### Realtime

All finance and education tables have realtime enabled via `supabase_realtime` publication. Changes are pushed to connected clients via WebSocket.

### Storage

- **Bucket:** `education-files`
- **Used for:** Course materials, project files, note attachments
- **Limit:** 10MB per file
- **Allowed types:** PDF, images, text, Office docs, ZIP, CSV

### Migrations

| File | Purpose |
|------|---------|
| `20240301_payroll_tables.sql` | Creates employers, schedules, shifts, paystubs tables |
| `20240302_finance_education_tables.sql` | Creates transactions, budgets, savings_goals, investments, subscriptions, net_worth_entries, study_sessions, edu_notes, courses, edu_projects |
| `20240303_tighten_rls_policies.sql` | Restricts all 14 tables to SELECT-only for anon key; drops old permissive policies |

Both migrations are idempotent (safe to run multiple times).

### Data Sync Architecture

```
Component writes data
  -> useSupabaseRealtimeSync.setData()
    -> Computes new state from updater function
    -> Writes to localStorage (synchronous, immediate)
    -> Diffs prev vs next state
    -> Fire-and-forget POST to /api/sync (authenticated write proxy)
      -> Server validates auth-token cookie
      -> Uses service role key (bypasses RLS)
      -> Upserts changed items + deletes removed items in Supabase
  -> Returns new state to React

On page load:
  -> Fetch all rows from Supabase table (anon key, SELECT-only via RLS)
  -> If Supabase has data -> replace localStorage (Supabase is source of truth)
  -> If Supabase is empty -> push localStorage to Supabase via /api/sync
  -> Subscribe to realtime changes for live updates (anon key, read-only)
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
| `glass-white` | CSS var `--glass-bg` | Glass card fill |
| `glass-border` | CSS var `--glass-border` | Glass card borders |

### Animations (Tailwind)

| Class | Duration | Effect |
|-------|----------|--------|
| `animate-float-slow` | 8s | Gentle floating |
| `animate-float-medium` | 6s | Medium floating |
| `animate-float-fast` | 4s | Quick floating |
| `animate-pulse-glow` | 3s | Pulsing glow |
| `animate-grain` | 0.5s | Film grain movement |

### CSS Classes

- `glass-card` - Translucent card with border, backdrop blur (defined in globals.css)
- `bg-white/[0.04]` - Subtle white overlay for backgrounds
- `bg-white/10` - Skeleton loading states

---

## 12. External Integrations

### Supabase
- **PostgreSQL:** 14+ tables for finance, education, payroll, comments, analytics
- **Realtime:** WebSocket subscriptions for live data sync
- **Storage:** File uploads for education materials
- **Auth:** RLS policies (currently open for single-user)

### OpenAI
- **Chat:** gpt-4o-mini for AI assistant with blog context
- **Embeddings:** text-embedding-3-small for semantic search
- **Rate:** 5 chat requests / 60s, 10 embedding requests / 60s

### GitHub API
- **Repos:** Public repository listing with stars, forks, topics
- **Events:** Commit activity for contribution heatmaps
- **Token:** Optional `GITHUB_TOKEN` for higher rate limits

### LeetCode
- **API:** alfa-leetcode-api.onrender.com (third-party)
- **Data:** Solved problems, difficulty breakdown, ranking, submissions

### Yahoo Finance
- **Stocks:** Real-time stock quotes (price, change, changePercent)
- **Cache:** 15-minute refresh

### Exchange Rate API
- **Rates:** USD-based exchange rates for 100+ currencies
- **Cache:** 1-hour refresh

### Google Sheets / Apps Script
- **Payroll import:** CSV export from Google Sheets or JSON from Apps Script
- **Schedule parsing:** Extract work schedules by employee name

### Cloudflare Turnstile
- **CAPTCHA:** Contact form protection
- **Optional:** Skipped if not configured

### Email (SMTP)
- **Contact form:** Email delivery via Nodemailer
- **Finance reports:** Monthly report emails with HTML formatting
- **Config:** SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

### PostHog
- **Analytics:** Client-side event tracking and analytics

### Sentry
- **Error tracking:** Client, server, and edge runtime error monitoring

### Vercel Analytics
- **Web vitals:** Core Web Vitals and page performance

---

## 13. Security

### Authentication
- PIN-based auth (10-digit code via `AUTH_PIN` env var)
- httpOnly cookie (`auth-token`, 7-day expiry)
- Middleware enforces auth on all non-public routes

### Content Security Policy
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline' cloudflare
style-src 'self' 'unsafe-inline' fonts.googleapis.com
img-src 'self' blob: data: https:
font-src 'self' fonts.gstatic.com
connect-src 'self' supabase openai github leetcode cloudflare posthog sentry exchangerate-api yahoo
frame-src cloudflare youtube
```

### Security Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Rate Limiting
- Comments: 10 req / 60s
- Contact: 3 req / 60s
- Chat: 5 req / 60s
- Embeddings: 10 req / 60s + **100 embeddings/day** daily cap (in-memory counter with 24h rolling window)
- Payroll Import: 10 req / 60s

### Spam Protection
- Cloudflare Turnstile CAPTCHA on contact form
- Honeypot field detection
- Input validation with Zod schemas
- Content length limits

### Database Security
- Row Level Security (RLS) enabled on all 14 tables
- **Anon key:** SELECT-only (read) — cannot insert, update, or delete
- **Service role key:** Server-side only via `/api/sync` write proxy — bypasses RLS
- All client writes routed through authenticated `/api/sync` endpoint (validates `auth-token` cookie)

---

## 14. Deployment

### Platform: Netlify

**Config:** `netlify.toml`
- Plugin: `@netlify/plugin-nextjs`
- Build command managed by Netlify

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
| `AUTH_PIN` | Login PIN code | Yes |
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
- Per-page metadata via `generateMetadata()`
- OpenGraph and Twitter card support

---

## 15. File Tree

```
portfolio/
├── content/blog/                        # 6 MDX blog posts
│   ├── cognitive-overhead.mdx
│   ├── compounding-daily-documentation.mdx
│   ├── fire-math-early-retirement.mdx
│   ├── index-funds-developer-framework.mdx
│   ├── interfaces-people-want-to-use.mdx
│   └── second-brain-architecture.mdx
├── docs/
│   └── gmail-paystub-script.gs          # Google Apps Script
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── sitemap-0.xml
├── supabase/
│   └── migrations/
│       ├── 20240301_payroll_tables.sql
│       └── 20240302_finance_education_tables.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home
│   │   ├── globals.css                  # Global styles
│   │   ├── not-found.tsx                # 404
│   │   ├── global-error.tsx             # Error boundary
│   │   ├── robots.ts                    # SEO robots
│   │   ├── sitemap.ts                   # Dynamic sitemap
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── login/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── vlogs/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx                 # Blog listing
│   │   │   ├── loading.tsx
│   │   │   ├── write/page.tsx           # Blog editor
│   │   │   └── [slug]/
│   │   │       ├── page.tsx             # Blog post
│   │   │       └── loading.tsx
│   │   ├── finance/
│   │   │   ├── page.tsx                 # FIRE philosophy
│   │   │   └── tracker/page.tsx         # Finance tracker
│   │   ├── education/
│   │   │   ├── page.tsx                 # Education hub
│   │   │   └── dashboard/page.tsx       # Education dashboard
│   │   ├── dashboard/
│   │   │   ├── activity/page.tsx        # Activity feed
│   │   │   └── analytics/page.tsx       # Personal analytics
│   │   ├── admin/
│   │   │   ├── layout.tsx               # Admin layout + sidebar
│   │   │   ├── page.tsx                 # Admin overview
│   │   │   ├── setup/page.tsx           # DB setup
│   │   │   ├── analytics/page.tsx       # Page analytics
│   │   │   └── blog/
│   │   │       ├── page.tsx             # Blog management
│   │   │       └── new/page.tsx         # New post
│   │   └── api/
│   │       ├── auth/route.ts
│   │       ├── analytics/route.ts
│   │       ├── activity/route.ts
│   │       ├── chat/route.ts
│   │       ├── comments/route.ts
│   │       ├── contact/route.ts
│   │       ├── newsletter/route.ts
│   │       ├── search-data/route.ts
│   │       ├── stats/route.ts
│   │       ├── leetcode/route.ts
│   │       ├── knowledge-graph/route.ts
│   │       ├── github/
│   │       │   ├── route.ts
│   │       │   └── events/route.ts
│   │       ├── finance/
│   │       │   ├── stocks/route.ts
│   │       │   ├── currency/route.ts
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
│   │           ├── blog/route.ts
│   │           └── setup-db/route.ts
│   ├── components/
│   │   ├── activity/                    # 3 components
│   │   ├── analytics/                   # 9 components
│   │   ├── blog/                        # 1 component
│   │   ├── chat/                        # 2 components
│   │   ├── education/                   # 24 components (9 sub-modules)
│   │   ├── finance/                     # 39 components
│   │   ├── layout/                      # 1 component
│   │   ├── mdx/                         # 1 component
│   │   ├── providers/                   # 3 components
│   │   ├── search/                      # 3 components
│   │   ├── sections/                    # 7 components
│   │   ├── ui/                          # 23 components
│   │   └── vlogs/                       # 1 component
│   ├── hooks/
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
│   │       └── useStockQuotes.ts
│   ├── lib/
│   │   ├── ai-context.ts
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── data.ts
│   │   ├── education-utils.ts
│   │   ├── finance-utils.ts
│   │   ├── mdx.ts
│   │   ├── payroll-pdf.ts
│   │   ├── payroll-schemas.ts
│   │   ├── payroll-tax.ts
│   │   ├── payroll-utils.ts
│   │   ├── rate-limit.ts
│   │   ├── search-index.ts
│   │   ├── stemtree-payroll.ts
│   │   ├── utils.ts
│   │   ├── visibility.ts
│   │   ├── vlogs.ts
│   │   └── supabase/
│   │       ├── admin.ts
│   │       ├── client.ts
│   │       └── server.ts
│   ├── types/
│   │   └── index.ts                     # 100+ type definitions
│   └── middleware.ts                    # Auth middleware
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── next-sitemap.config.js
├── netlify.toml
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── sentry.server.config.ts
├── package.json
└── .env.local
```

### Totals

| Category | Count |
|----------|-------|
| Page Routes | 20 |
| API Endpoints | 23 |
| React Components | 114 |
| Custom Hooks | 15 |
| Utility Modules | 20 |
| TypeScript Interfaces | 100+ |
| Database Tables | 14+ |
| Blog Posts (MDX) | 6 |
| SQL Migrations | 2 |
| External Integrations | 10 |

---

*Generated on 2026-03-01. This document covers every feature, function, component, route, hook, utility, and integration in the portfolio project.*
