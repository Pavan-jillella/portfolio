# Portfolio Website — Architecture & Feature Documentation

**Author:** Pavan Jillella
**Stack:** Next.js 14 (App Router) | TypeScript | Tailwind CSS | Framer Motion | Supabase | TipTap
**URL:** pavanjillella.com

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

### Design System

- **Fonts:** Syne (display/headings), DM Sans (body), JetBrains Mono (code)
- **Theme:** Dark mode with glassmorphism (`glass-card` utility: backdrop-blur + white/5 border + white/2 background)
- **Animations:** Framer Motion for page transitions, `FadeIn` wrapper for scroll-triggered reveals, `AnimatedCounter` for number animations
- **Tailwind Utilities:** `font-display`, `font-body`, `font-mono`, `text-white/40` opacity variants

### Authentication & Middleware

- **Provider:** Supabase Auth (`@supabase/ssr`)
- **Middleware:** `src/middleware.ts` protects `/admin/*` routes, redirects unauthorized users to `/login`
- **Clients:** Three Supabase client factories:
  - `src/lib/supabase/client.ts` — browser client for client components
  - `src/lib/supabase/server.ts` — server client with disabled session persistence
  - `src/lib/supabase/admin.ts` — admin client using service role key

### Data Persistence Pattern

All interactive features use a two-layer persistence strategy:

1. **Primary:** `useLocalStorage<T>` hook — SSR-safe browser storage with TypeScript generics and `pj-` namespaced keys
2. **Optional:** `useSupabaseSync` hook — syncs localStorage data to Supabase cloud when configured
3. **Files:** `useSupabaseStorage` hook — upload/delete to Supabase Storage `education-files` bucket

### SEO

- Dynamic `sitemap.ts` and `robots.ts` route handlers
- `next-sitemap` post-build generation
- Per-page `metadata` exports on every route

---

## 2. Home Page

**Route:** `/`
**Type:** Server Component
**File:** `src/app/page.tsx`

Composed of 7 sections rendered in order:

| Section | Component | Description |
|---|---|---|
| Hero | `HeroSection` | Name, title, animated entrance |
| Vlogs | `VlogSection` | Featured vlogs with YouTube embeds |
| Blog | `BlogSection` | Latest blog post cards |
| Projects | `ProjectsSection` | Featured projects from GitHub |
| Stats | `StatsSection` | Animated counters (repos, stars, LeetCode) |
| Philosophy | `PhilosophySection` | Personal philosophy cards |
| Footer | `Footer` | Links, newsletter signup, social |

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
**Type:** Server Component
**File:** `src/app/projects/page.tsx`

- Live GitHub repos fetched via `/api/github`
- `ProjectCard` components displaying: repo name, description, stars, forks, language badge, topic tags

---

## 5. Blog System

### Blog List

**Route:** `/blog`
**Type:** Server Component
**File:** `src/app/blog/page.tsx`

- MDX files parsed with `gray-matter` for frontmatter extraction
- Post cards with title, date, description, category
- Loading skeleton (`loading.tsx`)

### Blog Post Detail

**Route:** `/blog/[slug]`
**Type:** Server Component with `generateStaticParams`
**File:** `src/app/blog/[slug]/page.tsx`

- Full MDX rendering via `next-mdx-remote`
- Syntax highlighting (`rehype-highlight`)
- Auto-linked headings (`rehype-autolink-headings` + `rehype-slug`)
- GitHub Flavored Markdown (`remark-gfm`)
- `CommentSection` — fetch/post comments via Supabase

### Blog Content Pipeline

```
/content/blog/*.mdx → gray-matter → next-mdx-remote → rendered page
```

**Utilities:** `src/lib/mdx.ts` — `getAllPosts()`, `getPostBySlug()`, `getAllPostSlugs()`

---

## 6. Vlogs

**Route:** `/vlogs`
**Type:** Client Component
**File:** `src/app/vlogs/page.tsx`

- Category filter tabs
- `YouTubeEmbed` component for video playback
- Framer Motion card animations
- Static data from `src/lib/vlogs.ts`

---

## 7. Contact

**Route:** `/contact`
**Type:** Server Component + Client Form
**File:** `src/app/contact/page.tsx`

| Component | Purpose |
|---|---|
| `ContactForm` | Form with `react-hook-form` + Zod validation, sends via NodeMailer |
| `NewsletterForm` | Email subscription stored in Supabase |

---

## 8. Authentication & Admin Panel

### Login

**Route:** `/login`
**Type:** Client Component
**File:** `src/app/login/page.tsx`

- Supabase email/password authentication
- Redirects to `/admin` on success

### Admin Panel

All `/admin/*` routes protected by Supabase auth middleware.

| Route | File | Feature |
|---|---|---|
| `/admin` | `src/app/admin/page.tsx` | Dashboard with overview stats |
| `/admin/blog` | `src/app/admin/blog/page.tsx` | Blog post management (list, delete) |
| `/admin/blog/new` | `src/app/admin/blog/new/page.tsx` | MDX blog post editor (create) |
| `/admin/analytics` | `src/app/admin/analytics/page.tsx` | Page view analytics with charts |

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
**Pattern:** Central "use client" component managing all state via 8 `useLocalStorage` hooks

#### Tabs & Features

| Tab | Components | Features |
|---|---|---|
| **Overview** | `MonthlySummaryCards`, `MonthlyTrend` | Income/expense/savings summary, monthly trend line chart |
| **Transactions** | `TransactionForm`, `TransactionList`, `TransactionTable`, `TransactionFilters` | Add/edit/delete transactions, sortable table, category badges, date filtering |
| **Budgets** | `BudgetManager`, `BudgetPlanner` | Monthly budgets per category, progress bars, over-budget alerts |
| **Savings** | `SavingsGoals`, `SavingsTrendChart` | Target/current amounts, deadline tracking, trend visualization |
| **Investments** | `InvestmentTracker` | Portfolio tracking (stocks, crypto, real estate), live stock quotes via Yahoo Finance API |
| **Net Worth** | `NetWorthCalculator` | Assets vs liabilities, category breakdown, net worth total |
| **Subscriptions** | `SubscriptionTracker` | Recurring payments (weekly/monthly/yearly), renewal alerts, active/inactive toggle |
| **Analysis** | `AIAnalysis`, `CategoryBreakdown`, `PieChart`, `Recommendations` | AI spending analysis, pie chart breakdown, smart recommendations |
| **Reports** | `MonthlyReportEmail` | Email monthly finance reports via NodeMailer |
| **Categories** | `CategoryManager` | Custom expense category CRUD |

#### Additional Finance Features

- **Multi-Currency:** `CurrencySettings` supports 10 currencies (USD, EUR, GBP, JPY, CAD, AUD, INR, CNY, CHF, SGD) with live exchange rates
- **Export:** `ExcelExport` / `ExportButton` — CSV and Excel (XLSX) transaction export
- **Month Navigation:** `MonthPicker` component

#### Finance localStorage Keys

```
pj-transactions, pj-budgets, pj-savings-goals, pj-investments,
pj-net-worth, pj-subscriptions, pj-custom-categories, pj-display-currency
```

#### Finance Utilities

**File:** `src/lib/finance-utils.ts`

- `generateId()` — `crypto.randomUUID()`
- `getCategoryBreakdown()` — spending per category
- `getMonthlyTrend()` — monthly totals over time
- `getRecommendations()` — smart spending recommendations
- `calculateNetWorth()` — assets minus liabilities
- `convertCurrency()` — currency conversion math
- `exportToCSV()` — transaction CSV generation

---

## 10. Education & Dashboard

### Education Landing

**Route:** `/education`
**Type:** Server Component
**File:** `src/app/education/page.tsx`

- 4 learning principle cards (Learn in Public, Systems Over Goals, First Principles, Compounding Knowledge)
- 6-book recommended reading list
- Knowledge system description (PARA method)
- Course Tracker section with: `CourseCard`, `CourseDetail`, `CourseForm`, `CourseFilters`, `CourseStats`, `ProgressRing`, `MaterialsList`, `UpdatesLog`
- "Education Dashboard" CTA link at bottom

### Education Dashboard App

**Route:** `/education/dashboard`
**Type:** Server Component wrapping Client Orchestrator
**Orchestrator:** `src/components/education/dashboard/EducationDashboardClient.tsx`
**Pattern:** Central "use client" component managing all state via 13 `useLocalStorage` hooks

#### Tabs & Features

##### Tab 1: Overview

**Component:** `OverviewTab`
**Directory:** `src/components/education/dashboard/overview/`

- 8 animated stat cards: study hours this week, current streak, total courses, active projects, courses completed, notes count, all-time sessions, total study hours
- Weekly mini bar chart (7 days, study minutes per day)
- Recent activity feed with color-coded timeline dots (blue=study, purple=note, green=project, cyan=course)

##### Tab 2: Study Planner

**Components:** 7 files in `src/components/education/dashboard/study/`

| Component | Purpose |
|---|---|
| `StudyPlannerTab` | Container with stats, charts, session list |
| `StudySessionForm` | Modal: subject dropdown (14 subjects), duration, date, notes. Edit mode support |
| `StudySessionList` | Session rows with edit/delete on hover |
| `StudyBarChart` | Pure SVG bar chart (daily/weekly modes), subject-colored stacking |
| `StudyStreakCounter` | Large `AnimatedCounter` with streak display |
| `StudyGoalsTracker` | Goal progress bars per subject, add/edit/delete |
| `SubjectBreakdownChart` | SVG donut chart using `stroke-dasharray` technique |

**Subjects (14):** Python, JavaScript, TypeScript, React, Next.js, Data Science, Machine Learning, System Design, DSA, DevOps, Databases, Math, Finance, Other

##### Tab 3: Courses

**Components:** 4 files in `src/components/education/dashboard/courses/`

| Component | Purpose |
|---|---|
| `CourseTrackerTab` | Stats (total/completed/avg progress), course card grid, expandable detail |
| `CourseModuleList` | Checkbox module list with progress bar, inline add, delete on hover |
| `CourseNotesEditor` | Textarea for per-course notes, save button, dirty state tracking |
| `CourseFileUpload` | File list with type badges, file input, `URL.createObjectURL` for local files |

##### Tab 4: Notes

**Components:** 7 files in `src/components/education/dashboard/notes/`

| Component | Purpose |
|---|---|
| `TipTapEditor` | Reusable rich text editor — toolbar: Bold, Italic, H1, H2, Bullet list, Ordered list, Code block, Link. Uses `@tiptap/react`, `StarterKit`, `Link`, `Placeholder`. Custom ProseMirror styling |
| `NotesTab` | Two-column layout (320px sidebar + editor), search, note list, new note button |
| `NoteEditor` | Full editor: title input, dynamically imported TipTapEditor (`next/dynamic` with `ssr: false`), tag management, course/project linking dropdowns, save version button, auto-save (2s debounce) |
| `NoteCard` | Preview card: title, HTML-stripped excerpt (80 chars), date, tag badges, linked entity badges |
| `NoteSearch` | Debounced search input (300ms) with magnifying glass icon, clear button |
| `NoteVersionHistory` | Modal: sorted version list, content preview, restore button per version |
| `NoteFileAttachment` | Inline file chips with type icon, name, size, remove button |

##### Tab 5: Projects

**Components:** 5 files in `src/components/education/dashboard/projects/`

| Component | Purpose |
|---|---|
| `ProjectsTab` | Container: status filter tabs, stat cards, project grid, detail view |
| `ProjectCard` | Glass card: name, status badge, description, milestone progress bar, GitHub icon |
| `ProjectForm` | Create/edit modal: name, description, status dropdown, GitHub URL |
| `ProjectDetail` | Full view: edit/delete actions, TipTap notes, file attachments, milestone list |
| `ProjectMilestoneList` | Checkbox list with due dates (red if overdue), inline add form |

**Statuses (4):** Planned, In Progress, Completed, On Hold — each with distinct color/background

##### Tab 6: GitHub

**Components:** 3 files in `src/components/education/dashboard/github/`

| Component | Purpose |
|---|---|
| `GitHubDashboardTab` | Live API fetch (`/api/github?all=true`), stat cards (repos/stars/forks), repo grid, language chart |
| `LanguageChart` | SVG donut chart for language distribution, uses `GITHUB_LANGUAGE_COLORS` lookup |
| `RepoCard` | Compact card: name, description, stars, forks, language dot, external link |

##### Tab 7: LeetCode

**Components:** 2 files in `src/components/education/dashboard/leetcode/`

| Component | Purpose |
|---|---|
| `LeetCodeDashboardTab` | Live API fetch (`/api/leetcode`), animated stat cards (solved/easy/medium/hard), streak, global ranking |
| `DifficultyBar` | Stacked horizontal bar — green (easy), amber (medium), red (hard) with percentage labels |

##### Tab 8: Files

**Components:** 5 files in `src/components/education/dashboard/files/`

| Component | Purpose |
|---|---|
| `FilesTab` | Container: total files/size stats, uploader, filter tabs (all/course/project/note/standalone), file list, preview modal |
| `FileUploader` | Drag-and-drop zone + click-to-browse, 10MB limit, upload progress spinner, graceful fallback to `URL.createObjectURL` |
| `FileList` | Sorted file rows: type badge, name, size, entity type badge, delete on hover, click to preview |
| `FilePreview` | Modal: image preview for image types, "preview not available" for others, download link, metadata |
| `SupabaseStorageFallback` | "Storage Not Configured" informational message with cloud icon |

#### Education Dashboard localStorage Keys

```
pj-study-sessions, pj-study-goals, pj-courses, pj-course-modules,
pj-course-notes, pj-course-files, pj-edu-notes, pj-note-versions,
pj-edu-files, pj-edu-projects, pj-project-milestones,
pj-project-files, pj-project-notes
```

#### Education Utilities

**File:** `src/lib/education-utils.ts`

| Function | Purpose |
|---|---|
| `getStudyStreak(sessions)` | Consecutive study days count |
| `getDailyStudyData(sessions, days)` | Daily minute totals for bar chart |
| `getWeeklyStudyData(sessions, weeks)` | Weekly totals for chart |
| `getSubjectBreakdown(sessions)` | Time per subject for pie chart |
| `getWeeklyGoalProgress(sessions, goals)` | Goal tracking calculations |
| `calculateModuleProgress(modules)` | Percentage of completed modules |
| `getRecentActivity(sessions, notes, projects)` | Unified activity feed |
| `formatDuration(minutes)` | "Xh Ym" format |
| `getWeekStart(date)` | Monday of current week |
| `searchNotes(notes, query)` | Search by title + stripped HTML content |
| `formatFileSize(bytes)` | "X.X MB" format |

#### Education Constants

**File:** `src/lib/constants.ts` (education section)

| Constant | Description |
|---|---|
| `STUDY_SUBJECTS` | 14 subjects array |
| `SUBJECT_COLORS` | Hex color per subject for charts |
| `PROJECT_STATUS_CONFIG` | Label, text color, background per status |
| `GITHUB_LANGUAGE_COLORS` | Hex color per programming language |
| `FILE_TYPE_ICONS` | MIME type to label mapping (PDF, PNG, JPG, etc.) |
| `DASHBOARD_TABS` | 8 tab definitions (id + label) |
| `DashboardTabId` | TypeScript type union from tab IDs |

---

## 11. API Routes

### Content & Social

| Endpoint | Method | File | Purpose |
|---|---|---|---|
| `/api/github` | GET | `src/app/api/github/route.ts` | GitHub repos. Default: top 6. With `?all=true`: all repos + language aggregation + stats |
| `/api/leetcode` | GET | `src/app/api/leetcode/route.ts` | LeetCode stats via GraphQL (solved, easy, medium, hard) |
| `/api/stats` | GET | `src/app/api/stats/route.ts` | Aggregated GitHub + LeetCode stats |
| `/api/chat` | POST | `src/app/api/chat/route.ts` | AI chat using OpenAI GPT-4o-mini with blog context injection |

### Blog & Comments

| Endpoint | Method | File | Purpose |
|---|---|---|---|
| `/api/admin/blog` | POST | `src/app/api/admin/blog/route.ts` | Create blog post (development only) |
| `/api/comments` | GET | `src/app/api/comments/route.ts` | Get comments for a blog post (`?slug=`) |
| `/api/comments` | POST | `src/app/api/comments/route.ts` | Post new comment (Supabase) |

### Communication

| Endpoint | Method | File | Purpose |
|---|---|---|---|
| `/api/contact` | POST | `src/app/api/contact/route.ts` | Contact form email via NodeMailer (Zod validated) |
| `/api/newsletter` | POST | `src/app/api/newsletter/route.ts` | Newsletter subscription (Supabase) |

### Analytics

| Endpoint | Method | File | Purpose |
|---|---|---|---|
| `/api/analytics` | GET | `src/app/api/analytics/route.ts` | Retrieve page view analytics |
| `/api/analytics` | POST | `src/app/api/analytics/route.ts` | Log a page view (Supabase) |

### Finance

| Endpoint | Method | File | Purpose |
|---|---|---|---|
| `/api/finance/stocks` | GET | `src/app/api/finance/stocks/route.ts` | Stock quotes via Yahoo Finance (`?symbols=`) |
| `/api/finance/currency` | GET | `src/app/api/finance/currency/route.ts` | Exchange rates via ExchangeRate-API |
| `/api/finance/report` | POST | `src/app/api/finance/report/route.ts` | Email monthly finance report (NodeMailer) |

### Education

| Endpoint | Method | File | Purpose |
|---|---|---|---|
| `/api/education/upload` | POST | `src/app/api/education/upload/route.ts` | Upload file to Supabase Storage `education-files` bucket |
| `/api/education/upload/[path]` | DELETE | `src/app/api/education/upload/[path]/route.ts` | Delete file from Supabase Storage |

---

## 12. Database Schema

**Provider:** Supabase (PostgreSQL)
**File:** `supabase-schema.sql`
**All tables have Row Level Security (RLS) enabled.**

### Core Tables (3)

| Table | Columns | Purpose |
|---|---|---|
| `comments` | id, blog_slug, author_name, content, parent_id, created_at | Blog post comments (supports threading) |
| `newsletter_subscribers` | id, email, subscribed_at | Newsletter signups |
| `page_views` | id, path, visited_at, referrer | Analytics tracking |

### Finance Tables (6)

| Table | Key Columns | Purpose |
|---|---|---|
| `transactions` | id, type, amount, category, description, date | Income/expense records |
| `budgets` | id, category, monthly_limit, month | Monthly budget limits |
| `savings_goals` | id, name, target_amount, current_amount, deadline | Savings targets |
| `investments` | id, name, type, ticker, quantity, purchase_price, current_value, currency | Investment portfolio |
| `net_worth_entries` | id, name, type, category, value, currency | Assets and liabilities |
| `subscriptions` | id, name, amount, currency, frequency, category, next_billing_date, active | Recurring payments |

### Education Tables — Original (3)

| Table | Key Columns | Purpose |
|---|---|---|
| `courses` | id, name, platform, url, progress, status, category, total_hours | Course tracking |
| `course_materials` | id, course_id (FK), title, type, content | Course-linked materials |
| `course_updates` | id, course_id (FK), description, date | Course activity log |

### Education Dashboard Tables (9)

| Table | Key Columns | Purpose |
|---|---|---|
| `study_sessions` | id, subject, duration_minutes, date, notes | Study session logs |
| `study_goals` | id, subject, target_hours_per_week | Weekly study targets |
| `course_modules` | id, course_id (FK), title, order, completed | Course module checklists |
| `course_notes` | id, course_id (FK), content_html, updated_at | Rich text per-course notes |
| `notes` | id, title, content_html, linked_course_id, linked_project_id, tags[] | Standalone knowledge base |
| `note_versions` | id, note_id (FK), content_html, saved_at | Note version history |
| `dashboard_projects` | id, name, description, status, github_url | Project workspace |
| `project_milestones` | id, project_id (FK), title, due_date, completed | Project milestone tracking |
| `uploaded_files` | id, file_name, file_url, file_type, file_size, storage_path, linked_entity_type, linked_entity_id | Unified file storage |

### Storage

- **Bucket:** `education-files` (private) in Supabase Storage

---

## 13. File & Directory Structure

```
src/
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home
│   ├── not-found.tsx                       # 404
│   ├── robots.ts                           # SEO
│   ├── sitemap.ts                          # SEO
│   ├── about/page.tsx
│   ├── projects/page.tsx
│   ├── blog/
│   │   ├── page.tsx                        # Blog list
│   │   └── [slug]/page.tsx                 # Blog detail
│   ├── vlogs/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/new/page.tsx
│   │   └── analytics/page.tsx
│   ├── finance/
│   │   ├── page.tsx                        # Finance landing
│   │   └── tracker/page.tsx                # Finance tracker app
│   ├── education/
│   │   ├── page.tsx                        # Education landing
│   │   └── dashboard/page.tsx              # Education dashboard app
│   └── api/
│       ├── admin/blog/route.ts
│       ├── analytics/route.ts
│       ├── chat/route.ts
│       ├── comments/route.ts
│       ├── contact/route.ts
│       ├── newsletter/route.ts
│       ├── github/route.ts
│       ├── leetcode/route.ts
│       ├── stats/route.ts
│       ├── finance/
│       │   ├── stocks/route.ts
│       │   ├── currency/route.ts
│       │   └── report/route.ts
│       └── education/
│           └── upload/
│               ├── route.ts                # POST upload
│               └── [path]/route.ts         # DELETE file
│
├── components/
│   ├── analytics/PageViewTracker.tsx
│   ├── blog/CommentSection.tsx
│   ├── chat/ChatWidget.tsx
│   ├── mdx/MDXContent.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── VlogSection.tsx
│   │   ├── BlogSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── PhilosophySection.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── AnimatedCounter.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CursorGlow.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FadeIn.tsx
│   │   ├── FloatingBackground.tsx
│   │   ├── GrainOverlay.tsx
│   │   ├── Navbar.tsx
│   │   ├── NewsletterForm.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── SmoothScroll.tsx
│   │   ├── StatsClient.tsx
│   │   └── YouTubeEmbed.tsx
│   ├── education/
│   │   ├── CourseCard.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── CourseFilters.tsx
│   │   ├── CourseForm.tsx
│   │   ├── CourseStats.tsx
│   │   ├── CourseTrackerSection.tsx
│   │   ├── MaterialsList.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── UpdatesLog.tsx
│   │   └── dashboard/
│   │       ├── EducationDashboardClient.tsx
│   │       ├── overview/OverviewTab.tsx
│   │       ├── study/
│   │       │   ├── StudyPlannerTab.tsx
│   │       │   ├── StudySessionForm.tsx
│   │       │   ├── StudySessionList.tsx
│   │       │   ├── StudyBarChart.tsx
│   │       │   ├── StudyStreakCounter.tsx
│   │       │   ├── StudyGoalsTracker.tsx
│   │       │   └── SubjectBreakdownChart.tsx
│   │       ├── courses/
│   │       │   ├── CourseTrackerTab.tsx
│   │       │   ├── CourseModuleList.tsx
│   │       │   ├── CourseNotesEditor.tsx
│   │       │   └── CourseFileUpload.tsx
│   │       ├── notes/
│   │       │   ├── TipTapEditor.tsx
│   │       │   ├── NotesTab.tsx
│   │       │   ├── NoteEditor.tsx
│   │       │   ├── NoteCard.tsx
│   │       │   ├── NoteSearch.tsx
│   │       │   ├── NoteVersionHistory.tsx
│   │       │   └── NoteFileAttachment.tsx
│   │       ├── projects/
│   │       │   ├── ProjectsTab.tsx
│   │       │   ├── ProjectCard.tsx
│   │       │   ├── ProjectForm.tsx
│   │       │   ├── ProjectDetail.tsx
│   │       │   └── ProjectMilestoneList.tsx
│   │       ├── github/
│   │       │   ├── GitHubDashboardTab.tsx
│   │       │   ├── LanguageChart.tsx
│   │       │   └── RepoCard.tsx
│   │       ├── leetcode/
│   │       │   ├── LeetCodeDashboardTab.tsx
│   │       │   └── DifficultyBar.tsx
│   │       └── files/
│   │           ├── FilesTab.tsx
│   │           ├── FileUploader.tsx
│   │           ├── FileList.tsx
│   │           ├── FilePreview.tsx
│   │           └── SupabaseStorageFallback.tsx
│   └── finance/
│       ├── FinanceTrackerClient.tsx
│       ├── AIAnalysis.tsx
│       ├── BudgetManager.tsx
│       ├── BudgetPlanner.tsx
│       ├── CategoryBreakdown.tsx
│       ├── CategoryManager.tsx
│       ├── CurrencySettings.tsx
│       ├── ExcelExport.tsx
│       ├── ExportButton.tsx
│       ├── InvestmentTracker.tsx
│       ├── MonthPicker.tsx
│       ├── MonthlyReportEmail.tsx
│       ├── MonthlySummaryCards.tsx
│       ├── MonthlyTrend.tsx
│       ├── NetWorthCalculator.tsx
│       ├── PieChart.tsx
│       ├── Recommendations.tsx
│       ├── SavingsGoals.tsx
│       ├── SavingsTrendChart.tsx
│       ├── SubscriptionTracker.tsx
│       ├── TransactionFilters.tsx
│       ├── TransactionForm.tsx
│       ├── TransactionList.tsx
│       └── TransactionTable.tsx
│
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useSupabaseStorage.ts
│   └── useSupabaseSync.ts
│
├── lib/
│   ├── utils.ts                            # cn() — Tailwind class merge
│   ├── api.ts                              # fetchGitHubRepos, fetchLeetCodeStats
│   ├── constants.ts                        # All app constants
│   ├── data.ts                             # Static blog/project data
│   ├── vlogs.ts                            # Static vlog entries
│   ├── mdx.ts                              # MDX parsing utilities
│   ├── finance-utils.ts                    # Finance calculations
│   ├── education-utils.ts                  # Education calculations
│   └── supabase/
│       ├── client.ts                       # Browser client
│       ├── server.ts                       # Server client
│       └── admin.ts                        # Admin client
│
├── types/
│   └── index.ts                            # 50+ TypeScript interfaces
│
└── middleware.ts                            # Auth protection for /admin/*
```

---

## 14. Dependencies

### Production (38 packages)

| Category | Packages |
|---|---|
| **Framework** | `next@14.2.5`, `react@18`, `react-dom@18` |
| **Styling** | `tailwindcss`, `tailwind-merge`, `tailwindcss-animate`, `clsx`, `class-variance-authority` |
| **Animation** | `framer-motion`, `lenis` |
| **Database** | `@supabase/supabase-js`, `@supabase/ssr` |
| **Rich Text** | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-code-block-lowlight`, `@tiptap/pm`, `lowlight` |
| **UI Primitives** | `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `lucide-react` |
| **MDX/Content** | `next-mdx-remote`, `gray-matter`, `rehype-highlight`, `rehype-autolink-headings`, `rehype-slug`, `remark-gfm` |
| **Forms** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **AI** | `openai` |
| **Email** | `nodemailer` |
| **Export** | `xlsx` |
| **SEO** | `next-sitemap` |

### Dev (9 packages)

`typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/nodemailer`, `eslint`, `eslint-config-next`, `autoprefixer`, `postcss`

---

## 15. Summary Statistics

| Metric | Count |
|---|---|
| Pages/Routes | 31 |
| API Endpoints | 20 |
| Components | 80+ |
| Custom Hooks | 3 |
| Utility Libraries | 11 |
| Type Definitions | 50+ interfaces |
| Database Tables | 18 |
| Storage Buckets | 1 |
| localStorage Keys | 21 |
| Production Dependencies | 38 |
| Dev Dependencies | 9 |
