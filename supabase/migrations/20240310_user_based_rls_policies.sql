-- =============================================
-- User-scoped RLS Policies
-- Each user can only SELECT their own data
-- Writes go through /api/sync with service role key (bypasses RLS)
-- =============================================

-- transactions
DROP POLICY IF EXISTS "Select only for anon" ON transactions;
DROP POLICY IF EXISTS "Anyone can manage transactions" ON transactions;
CREATE POLICY "Users view own data" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- budgets
DROP POLICY IF EXISTS "Select only for anon" ON budgets;
DROP POLICY IF EXISTS "Anyone can manage budgets" ON budgets;
CREATE POLICY "Users view own data" ON budgets FOR SELECT USING (auth.uid() = user_id);

-- savings_goals
DROP POLICY IF EXISTS "Select only for anon" ON savings_goals;
DROP POLICY IF EXISTS "Anyone can manage savings_goals" ON savings_goals;
CREATE POLICY "Users view own data" ON savings_goals FOR SELECT USING (auth.uid() = user_id);

-- investments
DROP POLICY IF EXISTS "Select only for anon" ON investments;
DROP POLICY IF EXISTS "Anyone can manage investments" ON investments;
CREATE POLICY "Users view own data" ON investments FOR SELECT USING (auth.uid() = user_id);

-- subscriptions
DROP POLICY IF EXISTS "Select only for anon" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can manage subscriptions" ON subscriptions;
CREATE POLICY "Users view own data" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- net_worth_entries
DROP POLICY IF EXISTS "Select only for anon" ON net_worth_entries;
DROP POLICY IF EXISTS "Anyone can manage net_worth_entries" ON net_worth_entries;
CREATE POLICY "Users view own data" ON net_worth_entries FOR SELECT USING (auth.uid() = user_id);

-- study_sessions
DROP POLICY IF EXISTS "Select only for anon" ON study_sessions;
DROP POLICY IF EXISTS "Anyone can manage study_sessions" ON study_sessions;
CREATE POLICY "Users view own data" ON study_sessions FOR SELECT USING (auth.uid() = user_id);

-- edu_notes
DROP POLICY IF EXISTS "Select only for anon" ON edu_notes;
DROP POLICY IF EXISTS "Anyone can manage edu_notes" ON edu_notes;
CREATE POLICY "Users view own data" ON edu_notes FOR SELECT USING (auth.uid() = user_id);

-- courses
DROP POLICY IF EXISTS "Select only for anon" ON courses;
DROP POLICY IF EXISTS "Anyone can manage courses" ON courses;
CREATE POLICY "Users view own data" ON courses FOR SELECT USING (auth.uid() = user_id);

-- edu_projects
DROP POLICY IF EXISTS "Select only for anon" ON edu_projects;
DROP POLICY IF EXISTS "Anyone can manage edu_projects" ON edu_projects;
CREATE POLICY "Users view own data" ON edu_projects FOR SELECT USING (auth.uid() = user_id);

-- pay_stubs
DROP POLICY IF EXISTS "Select only for anon" ON pay_stubs;
DROP POLICY IF EXISTS "Anyone can manage pay_stubs" ON pay_stubs;
CREATE POLICY "Users view own data" ON pay_stubs FOR SELECT USING (auth.uid() = user_id);

-- part_time_jobs
DROP POLICY IF EXISTS "Select only for anon" ON part_time_jobs;
DROP POLICY IF EXISTS "Anyone can manage part_time_jobs" ON part_time_jobs;
CREATE POLICY "Users view own data" ON part_time_jobs FOR SELECT USING (auth.uid() = user_id);

-- part_time_hours
DROP POLICY IF EXISTS "Select only for anon" ON part_time_hours;
DROP POLICY IF EXISTS "Anyone can manage part_time_hours" ON part_time_hours;
CREATE POLICY "Users view own data" ON part_time_hours FOR SELECT USING (auth.uid() = user_id);

-- employers
DROP POLICY IF EXISTS "Select only for anon" ON employers;
DROP POLICY IF EXISTS "Anyone can manage employers" ON employers;
CREATE POLICY "Users view own data" ON employers FOR SELECT USING (auth.uid() = user_id);

-- work_schedules
DROP POLICY IF EXISTS "Select only for anon" ON work_schedules;
DROP POLICY IF EXISTS "Anyone can manage work_schedules" ON work_schedules;
CREATE POLICY "Users view own data" ON work_schedules FOR SELECT USING (auth.uid() = user_id);

-- enhanced_work_schedules
DROP POLICY IF EXISTS "Select only for anon" ON enhanced_work_schedules;
DROP POLICY IF EXISTS "Anyone can manage enhanced_work_schedules" ON enhanced_work_schedules;
CREATE POLICY "Users view own data" ON enhanced_work_schedules FOR SELECT USING (auth.uid() = user_id);
