-- =============================================
-- RLS Policy Tightening
-- Restricts anon key to SELECT-only.
-- Service role key bypasses RLS entirely,
-- so server-side writes via /api/sync still work.
-- =============================================

-- Helper: drop old permissive policy, create select-only policy
-- Each block is idempotent.

-- transactions
do $$ begin
  drop policy if exists "Anyone can manage transactions" on transactions;
  create policy "Select only for anon" on transactions for select using (true);
exception when undefined_table then null;
end $$;

-- budgets
do $$ begin
  drop policy if exists "Anyone can manage budgets" on budgets;
  create policy "Select only for anon" on budgets for select using (true);
exception when undefined_table then null;
end $$;

-- savings_goals
do $$ begin
  drop policy if exists "Anyone can manage savings_goals" on savings_goals;
  create policy "Select only for anon" on savings_goals for select using (true);
exception when undefined_table then null;
end $$;

-- investments
do $$ begin
  drop policy if exists "Anyone can manage investments" on investments;
  create policy "Select only for anon" on investments for select using (true);
exception when undefined_table then null;
end $$;

-- subscriptions
do $$ begin
  drop policy if exists "Anyone can manage subscriptions" on subscriptions;
  create policy "Select only for anon" on subscriptions for select using (true);
exception when undefined_table then null;
end $$;

-- net_worth_entries
do $$ begin
  drop policy if exists "Anyone can manage net_worth_entries" on net_worth_entries;
  create policy "Select only for anon" on net_worth_entries for select using (true);
exception when undefined_table then null;
end $$;

-- study_sessions
do $$ begin
  drop policy if exists "Anyone can manage study_sessions" on study_sessions;
  create policy "Select only for anon" on study_sessions for select using (true);
exception when undefined_table then null;
end $$;

-- edu_notes
do $$ begin
  drop policy if exists "Anyone can manage edu_notes" on edu_notes;
  create policy "Select only for anon" on edu_notes for select using (true);
exception when undefined_table then null;
end $$;

-- courses
do $$ begin
  drop policy if exists "Anyone can manage courses" on courses;
  create policy "Select only for anon" on courses for select using (true);
exception when undefined_table then null;
end $$;

-- edu_projects
do $$ begin
  drop policy if exists "Anyone can manage edu_projects" on edu_projects;
  create policy "Select only for anon" on edu_projects for select using (true);
exception when undefined_table then null;
end $$;

-- employers (payroll)
do $$ begin
  drop policy if exists "Anyone can manage employers" on employers;
  create policy "Select only for anon" on employers for select using (true);
exception when undefined_table then null;
end $$;

-- schedules (payroll)
do $$ begin
  drop policy if exists "Anyone can manage schedules" on schedules;
  create policy "Select only for anon" on schedules for select using (true);
exception when undefined_table then null;
end $$;

-- shifts (payroll)
do $$ begin
  drop policy if exists "Anyone can manage shifts" on shifts;
  create policy "Select only for anon" on shifts for select using (true);
exception when undefined_table then null;
end $$;

-- paystubs (payroll)
do $$ begin
  drop policy if exists "Anyone can manage paystubs" on paystubs;
  create policy "Select only for anon" on paystubs for select using (true);
exception when undefined_table then null;
end $$;
