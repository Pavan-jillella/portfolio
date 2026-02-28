-- =============================================
-- Payroll System Tables
-- =============================================

-- Employers
create table if not exists employers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pay_type text not null default 'hourly' check (pay_type in ('hourly', 'salary', 'commission', 'fixed_weekly', 'per_shift')),
  hourly_rate numeric not null default 0,
  fixed_amount numeric not null default 0,
  commission_rate numeric not null default 0,
  color text not null default '#3b82f6',
  overtime_enabled boolean not null default false,
  overtime_multiplier numeric not null default 1.5,
  overtime_threshold numeric not null default 40,
  holiday_multiplier numeric not null default 1.5,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table employers enable row level security;
create policy "Anyone can manage employers" on employers for all using (true);

-- Schedules
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) on delete set null,
  period_label text not null,
  start_date text not null default '',
  end_date text not null default '',
  total_hours numeric not null default 0,
  gross_amount numeric not null default 0,
  created_at timestamptz default now()
);

alter table schedules enable row level security;
create policy "Anyone can manage schedules" on schedules for all using (true);

-- Shifts
create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references schedules(id) on delete cascade,
  date text not null default '',
  day text not null,
  start_time text not null default '',
  end_time text not null default '',
  hours numeric not null default 0,
  is_holiday boolean not null default false,
  created_at timestamptz default now()
);

alter table shifts enable row level security;
create policy "Anyone can manage shifts" on shifts for all using (true);

-- Pay Stubs
create table if not exists paystubs (
  id uuid primary key default gen_random_uuid(),
  employer_name text not null,
  employer_id uuid references employers(id) on delete set null,
  pay_period_start text not null,
  pay_period_end text not null,
  pay_date text not null,
  regular_hours numeric not null default 0,
  overtime_hours numeric not null default 0,
  hourly_rate numeric not null default 0,
  gross_pay numeric not null default 0,
  federal_tax numeric not null default 0,
  state_tax numeric not null default 0,
  social_security numeric not null default 0,
  medicare numeric not null default 0,
  other_deductions numeric not null default 0,
  other_deductions_label text not null default '',
  net_pay numeric not null default 0,
  source text not null default 'manual' check (source in ('manual', 'google-sheets', 'auto-calculated')),
  created_at timestamptz default now()
);

alter table paystubs enable row level security;
create policy "Anyone can manage paystubs" on paystubs for all using (true);

-- Enable realtime on all payroll tables
alter publication supabase_realtime add table employers;
alter publication supabase_realtime add table schedules;
alter publication supabase_realtime add table shifts;
alter publication supabase_realtime add table paystubs;
