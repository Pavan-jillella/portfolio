-- About page CMS content table
-- Stores bio, skills, timeline, experience, education, and meta sections as JSONB

CREATE TABLE IF NOT EXISTS about_content (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  section text NOT NULL CHECK (section IN ('bio', 'skills', 'timeline', 'experience', 'education', 'meta')),
  data jsonb NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at text NOT NULL DEFAULT '',
  updated_at text NOT NULL DEFAULT ''
);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Authenticated users can manage their own rows
CREATE POLICY "about_content_select" ON about_content
  FOR SELECT TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "about_content_insert" ON about_content
  FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "about_content_update" ON about_content
  FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "about_content_delete" ON about_content
  FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- Public read access (so the About page can fetch without auth)
CREATE POLICY "about_content_public_read" ON about_content
  FOR SELECT TO anon USING (true);
