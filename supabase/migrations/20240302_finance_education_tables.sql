-- =============================================
-- Finance & Education Tables (idempotent)
-- Safe to run multiple times
-- =============================================

-- Transactions
create table if not exists transactions (
  id text primary key,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null default 0,
  category text not null default '',
  description text not null default '',
  date text not null default '',
  created_at text not null default ''
);
alter table transactions enable row level security;
do $$ begin
  create policy "Anyone can manage transactions" on transactions for all using (true);
exception when duplicate_object then null;
end $$;

-- Budgets
create table if not exists budgets (
  id text primary key,
  category text not null default '',
  monthly_limit numeric not null default 0,
  month text not null default ''
);
alter table budgets enable row level security;
do $$ begin
  create policy "Anyone can manage budgets" on budgets for all using (true);
exception when duplicate_object then null;
end $$;

-- Savings Goals
create table if not exists savings_goals (
  id text primary key,
  name text not null default '',
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  deadline text,
  created_at text not null default ''
);
alter table savings_goals enable row level security;
do $$ begin
  create policy "Anyone can manage savings_goals" on savings_goals for all using (true);
exception when duplicate_object then null;
end $$;

-- Investments
create table if not exists investments (
  id text primary key,
  name text not null default '',
  type text not null default 'stock' check (type in ('stock', 'crypto', 'real-estate', 'other')),
  ticker text,
  quantity numeric,
  purchase_price numeric not null default 0,
  current_value numeric not null default 0,
  currency text not null default 'USD',
  last_updated text not null default '',
  created_at text not null default ''
);
alter table investments enable row level security;
do $$ begin
  create policy "Anyone can manage investments" on investments for all using (true);
exception when duplicate_object then null;
end $$;

-- Subscriptions
create table if not exists subscriptions (
  id text primary key,
  name text not null default '',
  amount numeric not null default 0,
  currency text not null default 'USD',
  frequency text not null default 'monthly' check (frequency in ('weekly', 'monthly', 'yearly')),
  category text not null default '',
  next_billing_date text not null default '',
  reminder_days integer not null default 3,
  active boolean not null default true,
  created_at text not null default ''
);
alter table subscriptions enable row level security;
do $$ begin
  create policy "Anyone can manage subscriptions" on subscriptions for all using (true);
exception when duplicate_object then null;
end $$;

-- Net Worth Entries
create table if not exists net_worth_entries (
  id text primary key,
  name text not null default '',
  type text not null default 'asset' check (type in ('asset', 'liability')),
  category text not null default '',
  value numeric not null default 0,
  currency text not null default 'USD',
  created_at text not null default ''
);
alter table net_worth_entries enable row level security;
do $$ begin
  create policy "Anyone can manage net_worth_entries" on net_worth_entries for all using (true);
exception when duplicate_object then null;
end $$;

-- Study Sessions
create table if not exists study_sessions (
  id text primary key,
  subject text not null default '',
  duration_minutes numeric not null default 0,
  date text not null default '',
  notes text not null default '',
  created_at text not null default ''
);
alter table study_sessions enable row level security;
do $$ begin
  create policy "Anyone can manage study_sessions" on study_sessions for all using (true);
exception when duplicate_object then null;
end $$;

-- Education Notes
create table if not exists edu_notes (
  id text primary key,
  title text not null default '',
  content_html text not null default '',
  linked_course_id text,
  linked_project_id text,
  tags jsonb not null default '[]',
  created_at text not null default '',
  updated_at text not null default ''
);
alter table edu_notes enable row level security;
do $$ begin
  create policy "Anyone can manage edu_notes" on edu_notes for all using (true);
exception when duplicate_object then null;
end $$;

-- Courses
create table if not exists courses (
  id text primary key,
  name text not null default '',
  platform text not null default '',
  url text not null default '',
  progress numeric not null default 0,
  status text not null default 'not-started',
  category text not null default '',
  total_hours numeric not null default 0,
  created_at text not null default ''
);
alter table courses enable row level security;
do $$ begin
  create policy "Anyone can manage courses" on courses for all using (true);
exception when duplicate_object then null;
end $$;

-- Education Projects
create table if not exists edu_projects (
  id text primary key,
  name text not null default '',
  description text not null default '',
  status text not null default 'planned',
  github_url text not null default '',
  created_at text not null default '',
  updated_at text not null default ''
);
alter table edu_projects enable row level security;
do $$ begin
  create policy "Anyone can manage edu_projects" on edu_projects for all using (true);
exception when duplicate_object then null;
end $$;

-- Enable realtime (ignore if already added)
do $$ begin
  alter publication supabase_realtime add table transactions;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table budgets;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table savings_goals;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table investments;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table subscriptions;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table net_worth_entries;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table study_sessions;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table edu_notes;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table courses;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table edu_projects;
exception when duplicate_object then null;
end $$;
