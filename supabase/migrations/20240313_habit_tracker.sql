-- Habit Tracker tables

-- Habit chains (routines) - must come before habits due to FK
CREATE TABLE IF NOT EXISTS habit_chains (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  time_of_day text NOT NULL DEFAULT 'morning' CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'anytime')),
  bonus_xp integer NOT NULL DEFAULT 25,
  created_at text NOT NULL DEFAULT ''
);

ALTER TABLE habit_chains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habit_chains_select" ON habit_chains FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "habit_chains_insert" ON habit_chains FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "habit_chains_update" ON habit_chains FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "habit_chains_delete" ON habit_chains FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- Habits
CREATE TABLE IF NOT EXISTS habits (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'Personal',
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  frequency_per_week integer NOT NULL DEFAULT 7,
  chain_id text REFERENCES habit_chains(id) ON DELETE SET NULL,
  life_index_domain text CHECK (life_index_domain IN ('finance', 'learning', 'technical', 'growth')),
  icon text DEFAULT '',
  color text DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at text NOT NULL DEFAULT '',
  updated_at text NOT NULL DEFAULT ''
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habits_select" ON habits FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "habits_insert" ON habits FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "habits_update" ON habits FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "habits_delete" ON habits FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- Habit logs
CREATE TABLE IF NOT EXISTS habit_logs (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  habit_id text NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date text NOT NULL,
  completed boolean NOT NULL DEFAULT true,
  xp_earned integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at text NOT NULL DEFAULT ''
);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habit_logs_select" ON habit_logs FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "habit_logs_insert" ON habit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "habit_logs_update" ON habit_logs FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "habit_logs_delete" ON habit_logs FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, date);
