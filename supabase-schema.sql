-- Supabase Schema for Portfolio Website
-- Run this in your Supabase SQL editor

-- Comments table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  blog_slug text not null,
  author_name text not null,
  content text not null,
  parent_id uuid references comments(id),
  created_at timestamptz default now()
);

-- Newsletter subscribers
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamptz default now()
);

-- Page views
create table if not exists page_views (
  id uuid default gen_random_uuid() primary key,
  path text not null,
  visited_at timestamptz default now(),
  referrer text
);

-- Row Level Security
alter table comments enable row level security;
create policy "Anyone can read comments" on comments for select using (true);
create policy "Anyone can insert comments" on comments for insert with check (true);

alter table newsletter_subscribers enable row level security;
create policy "Service role manages newsletter" on newsletter_subscribers for all using (true);

alter table page_views enable row level security;
create policy "Service role manages analytics" on page_views for all using (true);

-- =============================================
-- Finance Tracker Tables
-- =============================================

-- Transactions
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount > 0),
  category text not null,
  description text default '',
  date text not null,
  created_at timestamptz default now()
);

alter table transactions enable row level security;
create policy "Anyone can manage transactions" on transactions for all using (true);

-- Budgets
create table if not exists budgets (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  monthly_limit numeric not null check (monthly_limit > 0),
  month text not null,
  unique(category, month)
);

alter table budgets enable row level security;
create policy "Anyone can manage budgets" on budgets for all using (true);

-- Savings Goals
create table if not exists savings_goals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  target_amount numeric not null check (target_amount > 0),
  current_amount numeric not null default 0,
  deadline text,
  created_at timestamptz default now()
);

alter table savings_goals enable row level security;
create policy "Anyone can manage savings_goals" on savings_goals for all using (true);

-- =============================================
-- Education Course Tracker Tables
-- =============================================

-- Courses
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  platform text not null,
  url text default '',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null default 'planned' check (status in ('planned', 'in-progress', 'completed')),
  category text not null,
  total_hours numeric not null default 0,
  created_at timestamptz default now()
);

alter table courses enable row level security;
create policy "Anyone can manage courses" on courses for all using (true);

-- Course Materials
create table if not exists course_materials (
  id uuid default gen_random_uuid() primary key,
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  type text not null check (type in ('note', 'link', 'file')),
  content text default '',
  created_at timestamptz default now()
);

alter table course_materials enable row level security;
create policy "Anyone can manage course_materials" on course_materials for all using (true);

-- Course Updates
create table if not exists course_updates (
  id uuid default gen_random_uuid() primary key,
  course_id uuid not null references courses(id) on delete cascade,
  description text not null,
  date text not null,
  created_at timestamptz default now()
);

alter table course_updates enable row level security;
create policy "Anyone can manage course_updates" on course_updates for all using (true);

-- ===== Investments =====

create table if not exists investments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('stock', 'crypto', 'real-estate', 'other')),
  ticker text,
  quantity numeric,
  purchase_price numeric not null,
  current_value numeric not null,
  currency text not null default 'USD',
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

alter table investments enable row level security;
create policy "Anyone can manage investments" on investments for all using (true);

-- ===== Net Worth Entries =====

create table if not exists net_worth_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('asset', 'liability')),
  category text not null,
  value numeric not null,
  currency text not null default 'USD',
  created_at timestamptz default now()
);

alter table net_worth_entries enable row level security;
create policy "Anyone can manage net_worth_entries" on net_worth_entries for all using (true);

-- ===== Subscriptions =====

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric not null,
  currency text not null default 'USD',
  frequency text not null check (frequency in ('weekly', 'monthly', 'yearly')),
  category text not null,
  next_billing_date text not null,
  reminder_days integer not null default 3,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "Anyone can manage subscriptions" on subscriptions for all using (true);

-- =============================================
-- Education Dashboard Tables
-- =============================================

-- Study Sessions
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  date text not null,
  notes text default '',
  created_at timestamptz default now()
);

alter table study_sessions enable row level security;
create policy "Anyone can manage study_sessions" on study_sessions for all using (true);

-- Study Goals
create table if not exists study_goals (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  target_hours_per_week numeric not null check (target_hours_per_week > 0),
  created_at timestamptz default now()
);

alter table study_goals enable row level security;
create policy "Anyone can manage study_goals" on study_goals for all using (true);

-- Course Modules
create table if not exists course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  "order" integer not null default 0,
  completed boolean not null default false,
  created_at timestamptz default now()
);

alter table course_modules enable row level security;
create policy "Anyone can manage course_modules" on course_modules for all using (true);

-- Course Notes (rich text per course)
create table if not exists course_notes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  content_html text default '',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table course_notes enable row level security;
create policy "Anyone can manage course_notes" on course_notes for all using (true);

-- Notes (standalone knowledge base)
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_html text default '',
  linked_course_id uuid references courses(id) on delete set null,
  linked_project_id uuid,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table notes enable row level security;
create policy "Anyone can manage notes" on notes for all using (true);

-- Note Versions (version history)
create table if not exists note_versions (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references notes(id) on delete cascade,
  content_html text not null,
  saved_at timestamptz default now()
);

alter table note_versions enable row level security;
create policy "Anyone can manage note_versions" on note_versions for all using (true);

-- Dashboard Projects
create table if not exists dashboard_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  status text not null default 'planned' check (status in ('planned', 'in-progress', 'completed', 'on-hold')),
  github_url text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table dashboard_projects enable row level security;
create policy "Anyone can manage dashboard_projects" on dashboard_projects for all using (true);

-- Project Milestones
create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references dashboard_projects(id) on delete cascade,
  title text not null,
  due_date text,
  completed boolean not null default false,
  created_at timestamptz default now()
);

alter table project_milestones enable row level security;
create policy "Anyone can manage project_milestones" on project_milestones for all using (true);

-- Uploaded Files (unified file storage)
create table if not exists uploaded_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size bigint not null,
  storage_path text not null,
  linked_entity_type text not null check (linked_entity_type in ('course', 'project', 'note', 'standalone')),
  linked_entity_id uuid,
  created_at timestamptz default now()
);

alter table uploaded_files enable row level security;
create policy "Anyone can manage uploaded_files" on uploaded_files for all using (true);

-- Add foreign key for notes.linked_project_id after dashboard_projects table exists
alter table notes add constraint notes_linked_project_id_fkey
  foreign key (linked_project_id) references dashboard_projects(id) on delete set null;

-- Storage bucket for education files (run in Supabase Dashboard > Storage)
-- insert into storage.buckets (id, name, public) values ('education-files', 'education-files', false);

-- =============================================
-- Vector Embeddings (Knowledge Graph)
-- =============================================

-- Enable pgvector extension (run once in Supabase SQL editor)
create extension if not exists vector;

-- Embeddings table
create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  content_summary text not null default '',
  embedding vector(1536),
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(entity_type, entity_id)
);

-- IVFFlat index for fast similarity search
create index if not exists embeddings_embedding_idx on embeddings
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table embeddings enable row level security;
create policy "Anyone can manage embeddings" on embeddings for all using (true);

-- RPC function for cosine similarity search
create or replace function match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  entity_type text,
  entity_id text,
  content_summary text,
  tags text[],
  similarity float
)
language sql stable
as $$
  select
    e.id,
    e.entity_type,
    e.entity_id,
    e.content_summary,
    e.tags,
    1 - (e.embedding <=> query_embedding) as similarity
  from embeddings e
  where 1 - (e.embedding <=> query_embedding) > match_threshold
  order by e.embedding <=> query_embedding
  limit match_count;
$$;
