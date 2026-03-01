-- =============================================
-- Payroll Tables (idempotent)
-- Migrates pay stubs, part-time jobs, hours,
-- employers, and work schedules to cloud DB.
-- =============================================

-- Pay Stubs
create table if not exists pay_stubs (
  id text primary key,
  employer_name text not null default '',
  employer_id text,
  pay_period_start text not null default '',
  pay_period_end text not null default '',
  pay_date text not null default '',
  regular_hours numeric not null default 0,
  overtime_hours numeric not null default 0,
  hourly_rate numeric not null default 0,
  gross_pay numeric not null default 0,
  deductions jsonb not null default '{}',
  net_pay numeric not null default 0,
  source text not null default 'manual',
  created_at text not null default ''
);
alter table pay_stubs enable row level security;
do $$ begin
  create policy "Anyone can manage pay_stubs" on pay_stubs for all using (true);
exception when duplicate_object then null;
end $$;

-- Part-Time Jobs
create table if not exists part_time_jobs (
  id text primary key,
  name text not null default '',
  hourly_rate numeric not null default 0,
  color text not null default '#3b82f6',
  active boolean not null default true,
  created_at text not null default ''
);
alter table part_time_jobs enable row level security;
do $$ begin
  create policy "Anyone can manage part_time_jobs" on part_time_jobs for all using (true);
exception when duplicate_object then null;
end $$;

-- Part-Time Hour Entries
create table if not exists part_time_hours (
  id text primary key,
  job_id text not null default '',
  date text not null default '',
  hours numeric not null default 0,
  notes text not null default '',
  created_at text not null default ''
);
alter table part_time_hours enable row level security;
do $$ begin
  create policy "Anyone can manage part_time_hours" on part_time_hours for all using (true);
exception when duplicate_object then null;
end $$;

-- Employers
create table if not exists employers (
  id text primary key,
  name text not null default '',
  pay_type text not null default 'hourly',
  hourly_rate numeric not null default 0,
  fixed_amount numeric not null default 0,
  commission_rate numeric not null default 0,
  color text not null default '#3b82f6',
  overtime_enabled boolean not null default false,
  overtime_multiplier numeric not null default 1.5,
  overtime_threshold numeric not null default 40,
  holiday_multiplier numeric not null default 1.5,
  active boolean not null default true,
  created_at text not null default ''
);
alter table employers enable row level security;
do $$ begin
  create policy "Anyone can manage employers" on employers for all using (true);
exception when duplicate_object then null;
end $$;

-- Work Schedules
create table if not exists work_schedules (
  id text primary key,
  period_label text not null default '',
  period_start text not null default '',
  period_end text not null default '',
  shifts jsonb not null default '[]',
  total_hours numeric not null default 0,
  hourly_rate numeric not null default 0,
  created_at text not null default ''
);
alter table work_schedules enable row level security;
do $$ begin
  create policy "Anyone can manage work_schedules" on work_schedules for all using (true);
exception when duplicate_object then null;
end $$;

-- Enhanced Work Schedules
create table if not exists enhanced_work_schedules (
  id text primary key,
  employer_id text not null default '',
  period_label text not null default '',
  start_date text not null default '',
  end_date text not null default '',
  shifts jsonb not null default '[]',
  total_hours numeric not null default 0,
  gross_amount numeric not null default 0,
  created_at text not null default ''
);
alter table enhanced_work_schedules enable row level security;
do $$ begin
  create policy "Anyone can manage enhanced_work_schedules" on enhanced_work_schedules for all using (true);
exception when duplicate_object then null;
end $$;

-- Enable realtime for payroll tables
do $$ begin
  alter publication supabase_realtime add table pay_stubs;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table part_time_jobs;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table part_time_hours;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table employers;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table work_schedules;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table enhanced_work_schedules;
exception when duplicate_object then null;
end $$;
