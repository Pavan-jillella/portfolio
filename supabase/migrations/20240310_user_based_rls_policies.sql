-- =============================================
-- User-scoped RLS Policies
-- Each user can only SELECT their own data
-- Writes go through /api/sync with service role key (bypasses RLS)
-- =============================================

-- transactions
DROP POLICY IF EXISTS "Select only for anon" ON transactions;
DROP POLICY IF EXISTS "Anyone can manage transactions" ON transactions;
DROP POLICY IF EXISTS "Users view own data" ON transactions;
CREATE POLICY "Users view own data" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- budgets
DROP POLICY IF EXISTS "Select only for anon" ON budgets;
DROP POLICY IF EXISTS "Anyone can manage budgets" ON budgets;
DROP POLICY IF EXISTS "Users view own data" ON budgets;
CREATE POLICY "Users view own data" ON budgets FOR SELECT USING (auth.uid() = user_id);

-- savings_goals
DROP POLICY IF EXISTS "Select only for anon" ON savings_goals;
DROP POLICY IF EXISTS "Anyone can manage savings_goals" ON savings_goals;
DROP POLICY IF EXISTS "Users view own data" ON savings_goals;
CREATE POLICY "Users view own data" ON savings_goals FOR SELECT USING (auth.uid() = user_id);

-- investments
DROP POLICY IF EXISTS "Select only for anon" ON investments;
DROP POLICY IF EXISTS "Anyone can manage investments" ON investments;
DROP POLICY IF EXISTS "Users view own data" ON investments;
CREATE POLICY "Users view own data" ON investments FOR SELECT USING (auth.uid() = user_id);

-- subscriptions
DROP POLICY IF EXISTS "Select only for anon" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can manage subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users view own data" ON subscriptions;
CREATE POLICY "Users view own data" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- net_worth_entries
DROP POLICY IF EXISTS "Select only for anon" ON net_worth_entries;
DROP POLICY IF EXISTS "Anyone can manage net_worth_entries" ON net_worth_entries;
DROP POLICY IF EXISTS "Users view own data" ON net_worth_entries;
CREATE POLICY "Users view own data" ON net_worth_entries FOR SELECT USING (auth.uid() = user_id);

-- study_sessions
DROP POLICY IF EXISTS "Select only for anon" ON study_sessions;
DROP POLICY IF EXISTS "Anyone can manage study_sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users view own data" ON study_sessions;
CREATE POLICY "Users view own data" ON study_sessions FOR SELECT USING (auth.uid() = user_id);

-- edu_notes
DROP POLICY IF EXISTS "Select only for anon" ON edu_notes;
DROP POLICY IF EXISTS "Anyone can manage edu_notes" ON edu_notes;
DROP POLICY IF EXISTS "Users view own data" ON edu_notes;
CREATE POLICY "Users view own data" ON edu_notes FOR SELECT USING (auth.uid() = user_id);

-- courses
DROP POLICY IF EXISTS "Select only for anon" ON courses;
DROP POLICY IF EXISTS "Anyone can manage courses" ON courses;
DROP POLICY IF EXISTS "Users view own data" ON courses;
CREATE POLICY "Users view own data" ON courses FOR SELECT USING (auth.uid() = user_id);

-- edu_projects
DROP POLICY IF EXISTS "Select only for anon" ON edu_projects;
DROP POLICY IF EXISTS "Anyone can manage edu_projects" ON edu_projects;
DROP POLICY IF EXISTS "Users view own data" ON edu_projects;
CREATE POLICY "Users view own data" ON edu_projects FOR SELECT USING (auth.uid() = user_id);

-- pay_stubs
DROP POLICY IF EXISTS "Select only for anon" ON pay_stubs;
DROP POLICY IF EXISTS "Anyone can manage pay_stubs" ON pay_stubs;
DROP POLICY IF EXISTS "Users view own data" ON pay_stubs;
CREATE POLICY "Users view own data" ON pay_stubs FOR SELECT USING (auth.uid() = user_id);

-- part_time_jobs
DROP POLICY IF EXISTS "Select only for anon" ON part_time_jobs;
DROP POLICY IF EXISTS "Anyone can manage part_time_jobs" ON part_time_jobs;
DROP POLICY IF EXISTS "Users view own data" ON part_time_jobs;
CREATE POLICY "Users view own data" ON part_time_jobs FOR SELECT USING (auth.uid() = user_id);

-- part_time_hours
DROP POLICY IF EXISTS "Select only for anon" ON part_time_hours;
DROP POLICY IF EXISTS "Anyone can manage part_time_hours" ON part_time_hours;
DROP POLICY IF EXISTS "Users view own data" ON part_time_hours;
CREATE POLICY "Users view own data" ON part_time_hours FOR SELECT USING (auth.uid() = user_id);

-- employers
DROP POLICY IF EXISTS "Select only for anon" ON employers;
DROP POLICY IF EXISTS "Anyone can manage employers" ON employers;
DROP POLICY IF EXISTS "Users view own data" ON employers;
CREATE POLICY "Users view own data" ON employers FOR SELECT USING (auth.uid() = user_id);

-- work_schedules
DROP POLICY IF EXISTS "Select only for anon" ON work_schedules;
DROP POLICY IF EXISTS "Anyone can manage work_schedules" ON work_schedules;
DROP POLICY IF EXISTS "Users view own data" ON work_schedules;
CREATE POLICY "Users view own data" ON work_schedules FOR SELECT USING (auth.uid() = user_id);

-- enhanced_work_schedules
DROP POLICY IF EXISTS "Select only for anon" ON enhanced_work_schedules;
DROP POLICY IF EXISTS "Anyone can manage enhanced_work_schedules" ON enhanced_work_schedules;
DROP POLICY IF EXISTS "Users view own data" ON enhanced_work_schedules;
CREATE POLICY "Users view own data" ON enhanced_work_schedules FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- New tables: vlogs, blog_posts, user_projects
-- =============================================

-- vlogs
CREATE TABLE IF NOT EXISTS vlogs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL DEFAULT '',
  youtube_id TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  published_at TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT ''
);
ALTER TABLE vlogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own data" ON vlogs;
CREATE POLICY "Users view own data" ON vlogs FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_vlogs_user_id ON vlogs(user_id);

-- blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Technology',
  read_time TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  tags JSONB NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT ''
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own data" ON blog_posts;
CREATE POLICY "Users view own data" ON blog_posts FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);

-- user_projects
CREATE TABLE IF NOT EXISTS user_projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  stars INTEGER NOT NULL DEFAULT 0,
  forks INTEGER NOT NULL DEFAULT 0,
  topics JSONB NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT ''
);
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own data" ON user_projects;
CREATE POLICY "Users view own data" ON user_projects FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE vlogs;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE user_projects;
