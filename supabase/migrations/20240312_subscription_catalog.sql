-- =====================================================
-- Subscription Catalog: 3-Table Normalized Architecture
-- =====================================================
-- subscription_services  → Global service catalog
-- subscription_plans     → Pricing tiers per service
-- user_subscriptions     → Per-user subscription records
-- =====================================================

-- 1. Global Subscription Services Catalog
CREATE TABLE IF NOT EXISTS subscription_services (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  domain text NOT NULL,
  category text NOT NULL,
  website text,
  logo_url text,
  created_at text NOT NULL DEFAULT ''
);

ALTER TABLE subscription_services ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read the global catalog
CREATE POLICY "subscription_services_select" ON subscription_services
  FOR SELECT TO authenticated USING (true);

-- 2. Subscription Plans (pricing tiers per service)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  service_id text NOT NULL REFERENCES subscription_services(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly')),
  description text,
  created_at text NOT NULL DEFAULT ''
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscription_plans_select" ON subscription_plans
  FOR SELECT TO authenticated USING (true);

-- 3. User Subscriptions (links users to services + plans)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  service_id text NOT NULL REFERENCES subscription_services(id),
  plan_id text REFERENCES subscription_plans(id),
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly')),
  next_billing_date text NOT NULL DEFAULT '',
  card_last4 text,
  reminder_days integer NOT NULL DEFAULT 3,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at text NOT NULL DEFAULT '',
  updated_at text NOT NULL DEFAULT ''
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_subscriptions_select" ON user_subscriptions
  FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "user_subscriptions_insert" ON user_subscriptions
  FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "user_subscriptions_update" ON user_subscriptions
  FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "user_subscriptions_delete" ON user_subscriptions
  FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- =====================================================
-- SEED DATA: 100+ Services across 15 categories
-- =====================================================

INSERT INTO subscription_services (id, name, slug, domain, category, website, logo_url, created_at) VALUES
-- Streaming (12)
('netflix', 'Netflix', 'netflix', 'netflix.com', 'Streaming', 'https://netflix.com', 'https://logo.clearbit.com/netflix.com', '2024-03-12'),
('hulu', 'Hulu', 'hulu', 'hulu.com', 'Streaming', 'https://hulu.com', 'https://logo.clearbit.com/hulu.com', '2024-03-12'),
('disney-plus', 'Disney+', 'disney-plus', 'disneyplus.com', 'Streaming', 'https://disneyplus.com', 'https://logo.clearbit.com/disneyplus.com', '2024-03-12'),
('hbo-max', 'Max', 'max', 'max.com', 'Streaming', 'https://max.com', 'https://logo.clearbit.com/max.com', '2024-03-12'),
('prime-video', 'Prime Video', 'prime-video', 'primevideo.com', 'Streaming', 'https://primevideo.com', 'https://logo.clearbit.com/primevideo.com', '2024-03-12'),
('apple-tv', 'Apple TV+', 'apple-tv', 'tv.apple.com', 'Streaming', 'https://tv.apple.com', 'https://logo.clearbit.com/tv.apple.com', '2024-03-12'),
('peacock', 'Peacock', 'peacock', 'peacocktv.com', 'Streaming', 'https://peacocktv.com', 'https://logo.clearbit.com/peacocktv.com', '2024-03-12'),
('paramount-plus', 'Paramount+', 'paramount-plus', 'paramountplus.com', 'Streaming', 'https://paramountplus.com', 'https://logo.clearbit.com/paramountplus.com', '2024-03-12'),
('crunchyroll', 'Crunchyroll', 'crunchyroll', 'crunchyroll.com', 'Streaming', 'https://crunchyroll.com', 'https://logo.clearbit.com/crunchyroll.com', '2024-03-12'),
('discovery-plus', 'Discovery+', 'discovery-plus', 'discoveryplus.com', 'Streaming', 'https://discoveryplus.com', 'https://logo.clearbit.com/discoveryplus.com', '2024-03-12'),
('mubi', 'MUBI', 'mubi', 'mubi.com', 'Streaming', 'https://mubi.com', 'https://logo.clearbit.com/mubi.com', '2024-03-12'),
('curiosity-stream', 'CuriosityStream', 'curiosity-stream', 'curiositystream.com', 'Streaming', 'https://curiositystream.com', 'https://logo.clearbit.com/curiositystream.com', '2024-03-12'),

-- Music (5)
('spotify', 'Spotify', 'spotify', 'spotify.com', 'Music', 'https://spotify.com', 'https://logo.clearbit.com/spotify.com', '2024-03-12'),
('apple-music', 'Apple Music', 'apple-music', 'music.apple.com', 'Music', 'https://music.apple.com', 'https://logo.clearbit.com/music.apple.com', '2024-03-12'),
('youtube-premium', 'YouTube Premium', 'youtube-premium', 'youtube.com', 'Music', 'https://youtube.com/premium', 'https://logo.clearbit.com/youtube.com', '2024-03-12'),
('tidal', 'TIDAL', 'tidal', 'tidal.com', 'Music', 'https://tidal.com', 'https://logo.clearbit.com/tidal.com', '2024-03-12'),
('amazon-music', 'Amazon Music', 'amazon-music', 'music.amazon.com', 'Music', 'https://music.amazon.com', 'https://logo.clearbit.com/music.amazon.com', '2024-03-12'),

-- Gaming (6)
('xbox-game-pass', 'Xbox Game Pass', 'xbox-game-pass', 'xbox.com', 'Gaming', 'https://xbox.com/game-pass', 'https://logo.clearbit.com/xbox.com', '2024-03-12'),
('ps-plus', 'PlayStation Plus', 'ps-plus', 'playstation.com', 'Gaming', 'https://playstation.com', 'https://logo.clearbit.com/playstation.com', '2024-03-12'),
('nintendo-online', 'Nintendo Switch Online', 'nintendo-online', 'nintendo.com', 'Gaming', 'https://nintendo.com', 'https://logo.clearbit.com/nintendo.com', '2024-03-12'),
('ea-play', 'EA Play', 'ea-play', 'ea.com', 'Gaming', 'https://ea.com/ea-play', 'https://logo.clearbit.com/ea.com', '2024-03-12'),
('ubisoft-plus', 'Ubisoft+', 'ubisoft-plus', 'ubisoft.com', 'Gaming', 'https://ubisoft.com', 'https://logo.clearbit.com/ubisoft.com', '2024-03-12'),
('humble-bundle', 'Humble Choice', 'humble-choice', 'humblebundle.com', 'Gaming', 'https://humblebundle.com', 'https://logo.clearbit.com/humblebundle.com', '2024-03-12'),

-- Software / Productivity (10)
('microsoft-365', 'Microsoft 365', 'microsoft-365', 'microsoft.com', 'Software', 'https://microsoft.com/microsoft-365', 'https://logo.clearbit.com/microsoft.com', '2024-03-12'),
('notion', 'Notion', 'notion', 'notion.so', 'Productivity', 'https://notion.so', 'https://logo.clearbit.com/notion.so', '2024-03-12'),
('slack', 'Slack', 'slack', 'slack.com', 'Productivity', 'https://slack.com', 'https://logo.clearbit.com/slack.com', '2024-03-12'),
('zoom', 'Zoom', 'zoom', 'zoom.us', 'Productivity', 'https://zoom.us', 'https://logo.clearbit.com/zoom.us', '2024-03-12'),
('evernote', 'Evernote', 'evernote', 'evernote.com', 'Productivity', 'https://evernote.com', 'https://logo.clearbit.com/evernote.com', '2024-03-12'),
('todoist', 'Todoist', 'todoist', 'todoist.com', 'Productivity', 'https://todoist.com', 'https://logo.clearbit.com/todoist.com', '2024-03-12'),
('1password', '1Password', '1password', '1password.com', 'Software', 'https://1password.com', 'https://logo.clearbit.com/1password.com', '2024-03-12'),
('lastpass', 'LastPass', 'lastpass', 'lastpass.com', 'Software', 'https://lastpass.com', 'https://logo.clearbit.com/lastpass.com', '2024-03-12'),
('grammarly', 'Grammarly', 'grammarly', 'grammarly.com', 'Software', 'https://grammarly.com', 'https://logo.clearbit.com/grammarly.com', '2024-03-12'),
('dashlane', 'Dashlane', 'dashlane', 'dashlane.com', 'Software', 'https://dashlane.com', 'https://logo.clearbit.com/dashlane.com', '2024-03-12'),

-- AI Tools (8)
('chatgpt', 'ChatGPT', 'chatgpt', 'openai.com', 'AI Tools', 'https://chat.openai.com', 'https://logo.clearbit.com/openai.com', '2024-03-12'),
('claude', 'Claude', 'claude', 'claude.ai', 'AI Tools', 'https://claude.ai', 'https://logo.clearbit.com/anthropic.com', '2024-03-12'),
('midjourney', 'Midjourney', 'midjourney', 'midjourney.com', 'AI Tools', 'https://midjourney.com', 'https://logo.clearbit.com/midjourney.com', '2024-03-12'),
('copilot', 'GitHub Copilot', 'github-copilot', 'github.com', 'AI Tools', 'https://github.com/features/copilot', 'https://logo.clearbit.com/github.com', '2024-03-12'),
('jasper', 'Jasper AI', 'jasper', 'jasper.ai', 'AI Tools', 'https://jasper.ai', 'https://logo.clearbit.com/jasper.ai', '2024-03-12'),
('perplexity', 'Perplexity', 'perplexity', 'perplexity.ai', 'AI Tools', 'https://perplexity.ai', 'https://logo.clearbit.com/perplexity.ai', '2024-03-12'),
('runway', 'Runway', 'runway', 'runwayml.com', 'AI Tools', 'https://runwayml.com', 'https://logo.clearbit.com/runwayml.com', '2024-03-12'),
('cursor', 'Cursor', 'cursor', 'cursor.com', 'AI Tools', 'https://cursor.com', 'https://logo.clearbit.com/cursor.com', '2024-03-12'),

-- Cloud / Storage (6)
('icloud', 'iCloud+', 'icloud', 'apple.com', 'Cloud', 'https://apple.com/icloud', 'https://logo.clearbit.com/apple.com', '2024-03-12'),
('google-one', 'Google One', 'google-one', 'one.google.com', 'Cloud', 'https://one.google.com', 'https://logo.clearbit.com/google.com', '2024-03-12'),
('dropbox', 'Dropbox', 'dropbox', 'dropbox.com', 'Storage', 'https://dropbox.com', 'https://logo.clearbit.com/dropbox.com', '2024-03-12'),
('onedrive', 'OneDrive', 'onedrive', 'onedrive.com', 'Storage', 'https://onedrive.com', 'https://logo.clearbit.com/onedrive.com', '2024-03-12'),
('box', 'Box', 'box', 'box.com', 'Storage', 'https://box.com', 'https://logo.clearbit.com/box.com', '2024-03-12'),
('backblaze', 'Backblaze', 'backblaze', 'backblaze.com', 'Storage', 'https://backblaze.com', 'https://logo.clearbit.com/backblaze.com', '2024-03-12'),

-- Education (7)
('coursera', 'Coursera Plus', 'coursera', 'coursera.org', 'Education', 'https://coursera.org', 'https://logo.clearbit.com/coursera.org', '2024-03-12'),
('udemy', 'Udemy', 'udemy', 'udemy.com', 'Education', 'https://udemy.com', 'https://logo.clearbit.com/udemy.com', '2024-03-12'),
('skillshare', 'Skillshare', 'skillshare', 'skillshare.com', 'Education', 'https://skillshare.com', 'https://logo.clearbit.com/skillshare.com', '2024-03-12'),
('masterclass', 'MasterClass', 'masterclass', 'masterclass.com', 'Education', 'https://masterclass.com', 'https://logo.clearbit.com/masterclass.com', '2024-03-12'),
('linkedin-learning', 'LinkedIn Learning', 'linkedin-learning', 'linkedin.com', 'Education', 'https://linkedin.com/learning', 'https://logo.clearbit.com/linkedin.com', '2024-03-12'),
('brilliant', 'Brilliant', 'brilliant', 'brilliant.org', 'Education', 'https://brilliant.org', 'https://logo.clearbit.com/brilliant.org', '2024-03-12'),
('duolingo', 'Duolingo Plus', 'duolingo', 'duolingo.com', 'Education', 'https://duolingo.com', 'https://logo.clearbit.com/duolingo.com', '2024-03-12'),

-- Fitness (6)
('peloton', 'Peloton', 'peloton', 'onepeloton.com', 'Fitness', 'https://onepeloton.com', 'https://logo.clearbit.com/onepeloton.com', '2024-03-12'),
('strava', 'Strava', 'strava', 'strava.com', 'Fitness', 'https://strava.com', 'https://logo.clearbit.com/strava.com', '2024-03-12'),
('fitbit', 'Fitbit Premium', 'fitbit', 'fitbit.com', 'Fitness', 'https://fitbit.com', 'https://logo.clearbit.com/fitbit.com', '2024-03-12'),
('myfitnesspal', 'MyFitnessPal', 'myfitnesspal', 'myfitnesspal.com', 'Fitness', 'https://myfitnesspal.com', 'https://logo.clearbit.com/myfitnesspal.com', '2024-03-12'),
('apple-fitness', 'Apple Fitness+', 'apple-fitness', 'apple.com', 'Fitness', 'https://apple.com/apple-fitness-plus', 'https://logo.clearbit.com/apple.com', '2024-03-12'),
('headspace', 'Headspace', 'headspace', 'headspace.com', 'Fitness', 'https://headspace.com', 'https://logo.clearbit.com/headspace.com', '2024-03-12'),

-- News (5)
('nyt', 'The New York Times', 'nyt', 'nytimes.com', 'News', 'https://nytimes.com', 'https://logo.clearbit.com/nytimes.com', '2024-03-12'),
('wsj', 'The Wall Street Journal', 'wsj', 'wsj.com', 'News', 'https://wsj.com', 'https://logo.clearbit.com/wsj.com', '2024-03-12'),
('medium', 'Medium', 'medium', 'medium.com', 'News', 'https://medium.com', 'https://logo.clearbit.com/medium.com', '2024-03-12'),
('substack', 'Substack', 'substack', 'substack.com', 'News', 'https://substack.com', 'https://logo.clearbit.com/substack.com', '2024-03-12'),
('washington-post', 'The Washington Post', 'washington-post', 'washingtonpost.com', 'News', 'https://washingtonpost.com', 'https://logo.clearbit.com/washingtonpost.com', '2024-03-12'),

-- VPN (4)
('nordvpn', 'NordVPN', 'nordvpn', 'nordvpn.com', 'VPN', 'https://nordvpn.com', 'https://logo.clearbit.com/nordvpn.com', '2024-03-12'),
('expressvpn', 'ExpressVPN', 'expressvpn', 'expressvpn.com', 'VPN', 'https://expressvpn.com', 'https://logo.clearbit.com/expressvpn.com', '2024-03-12'),
('surfshark', 'Surfshark', 'surfshark', 'surfshark.com', 'VPN', 'https://surfshark.com', 'https://logo.clearbit.com/surfshark.com', '2024-03-12'),
('protonvpn', 'Proton VPN', 'protonvpn', 'protonvpn.com', 'VPN', 'https://protonvpn.com', 'https://logo.clearbit.com/protonvpn.com', '2024-03-12'),

-- Developer Tools (8)
('github', 'GitHub Pro', 'github', 'github.com', 'Developer Tools', 'https://github.com', 'https://logo.clearbit.com/github.com', '2024-03-12'),
('vercel', 'Vercel Pro', 'vercel', 'vercel.com', 'Developer Tools', 'https://vercel.com', 'https://logo.clearbit.com/vercel.com', '2024-03-12'),
('netlify', 'Netlify Pro', 'netlify', 'netlify.com', 'Developer Tools', 'https://netlify.com', 'https://logo.clearbit.com/netlify.com', '2024-03-12'),
('aws', 'AWS', 'aws', 'aws.amazon.com', 'Developer Tools', 'https://aws.amazon.com', 'https://logo.clearbit.com/aws.amazon.com', '2024-03-12'),
('gcp', 'Google Cloud', 'gcp', 'cloud.google.com', 'Developer Tools', 'https://cloud.google.com', 'https://logo.clearbit.com/cloud.google.com', '2024-03-12'),
('azure', 'Microsoft Azure', 'azure', 'azure.microsoft.com', 'Developer Tools', 'https://azure.microsoft.com', 'https://logo.clearbit.com/azure.microsoft.com', '2024-03-12'),
('docker', 'Docker Pro', 'docker', 'docker.com', 'Developer Tools', 'https://docker.com', 'https://logo.clearbit.com/docker.com', '2024-03-12'),
('digitalocean', 'DigitalOcean', 'digitalocean', 'digitalocean.com', 'Developer Tools', 'https://digitalocean.com', 'https://logo.clearbit.com/digitalocean.com', '2024-03-12'),

-- Design Tools (6)
('figma', 'Figma', 'figma', 'figma.com', 'Design Tools', 'https://figma.com', 'https://logo.clearbit.com/figma.com', '2024-03-12'),
('canva', 'Canva Pro', 'canva', 'canva.com', 'Design Tools', 'https://canva.com', 'https://logo.clearbit.com/canva.com', '2024-03-12'),
('adobe', 'Adobe Creative Cloud', 'adobe', 'adobe.com', 'Design Tools', 'https://adobe.com', 'https://logo.clearbit.com/adobe.com', '2024-03-12'),
('sketch', 'Sketch', 'sketch', 'sketch.com', 'Design Tools', 'https://sketch.com', 'https://logo.clearbit.com/sketch.com', '2024-03-12'),
('invision', 'InVision', 'invision', 'invisionapp.com', 'Design Tools', 'https://invisionapp.com', 'https://logo.clearbit.com/invisionapp.com', '2024-03-12'),
('framer', 'Framer', 'framer', 'framer.com', 'Design Tools', 'https://framer.com', 'https://logo.clearbit.com/framer.com', '2024-03-12'),

-- Business SaaS (10)
('salesforce', 'Salesforce', 'salesforce', 'salesforce.com', 'Business SaaS', 'https://salesforce.com', 'https://logo.clearbit.com/salesforce.com', '2024-03-12'),
('hubspot', 'HubSpot', 'hubspot', 'hubspot.com', 'Business SaaS', 'https://hubspot.com', 'https://logo.clearbit.com/hubspot.com', '2024-03-12'),
('jira', 'Jira', 'jira', 'atlassian.com', 'Business SaaS', 'https://atlassian.com/software/jira', 'https://logo.clearbit.com/atlassian.com', '2024-03-12'),
('asana', 'Asana', 'asana', 'asana.com', 'Business SaaS', 'https://asana.com', 'https://logo.clearbit.com/asana.com', '2024-03-12'),
('monday', 'Monday.com', 'monday', 'monday.com', 'Business SaaS', 'https://monday.com', 'https://logo.clearbit.com/monday.com', '2024-03-12'),
('linear', 'Linear', 'linear', 'linear.app', 'Business SaaS', 'https://linear.app', 'https://logo.clearbit.com/linear.app', '2024-03-12'),
('intercom', 'Intercom', 'intercom', 'intercom.com', 'Business SaaS', 'https://intercom.com', 'https://logo.clearbit.com/intercom.com', '2024-03-12'),
('zendesk', 'Zendesk', 'zendesk', 'zendesk.com', 'Business SaaS', 'https://zendesk.com', 'https://logo.clearbit.com/zendesk.com', '2024-03-12'),
('mailchimp', 'Mailchimp', 'mailchimp', 'mailchimp.com', 'Business SaaS', 'https://mailchimp.com', 'https://logo.clearbit.com/mailchimp.com', '2024-03-12'),
('freshdesk', 'Freshdesk', 'freshdesk', 'freshdesk.com', 'Business SaaS', 'https://freshdesk.com', 'https://logo.clearbit.com/freshdesk.com', '2024-03-12'),

-- Food & Delivery (8)
('doordash', 'DoorDash DashPass', 'doordash', 'doordash.com', 'Food & Delivery', 'https://doordash.com', 'https://logo.clearbit.com/doordash.com', '2024-03-12'),
('uber-one', 'Uber One', 'uber-one', 'uber.com', 'Food & Delivery', 'https://uber.com/one', 'https://logo.clearbit.com/uber.com', '2024-03-12'),
('grubhub', 'Grubhub+', 'grubhub', 'grubhub.com', 'Food & Delivery', 'https://grubhub.com', 'https://logo.clearbit.com/grubhub.com', '2024-03-12'),
('instacart', 'Instacart+', 'instacart', 'instacart.com', 'Food & Delivery', 'https://instacart.com', 'https://logo.clearbit.com/instacart.com', '2024-03-12'),
('postmates', 'Postmates', 'postmates', 'postmates.com', 'Food & Delivery', 'https://postmates.com', 'https://logo.clearbit.com/postmates.com', '2024-03-12'),
('gopuff', 'GoPuff Fam', 'gopuff', 'gopuff.com', 'Food & Delivery', 'https://gopuff.com', 'https://logo.clearbit.com/gopuff.com', '2024-03-12'),
('hellofresh', 'HelloFresh', 'hellofresh', 'hellofresh.com', 'Food & Delivery', 'https://hellofresh.com', 'https://logo.clearbit.com/hellofresh.com', '2024-03-12'),
('blue-apron', 'Blue Apron', 'blue-apron', 'blueapron.com', 'Food & Delivery', 'https://blueapron.com', 'https://logo.clearbit.com/blueapron.com', '2024-03-12'),

-- Transportation (3)
('lyft-pink', 'Lyft Pink', 'lyft-pink', 'lyft.com', 'Transportation', 'https://lyft.com', 'https://logo.clearbit.com/lyft.com', '2024-03-12'),
('uber-pass', 'Uber Pass', 'uber-pass', 'uber.com', 'Transportation', 'https://uber.com', 'https://logo.clearbit.com/uber.com', '2024-03-12'),
('citibike', 'Citi Bike', 'citibike', 'citibikenyc.com', 'Transportation', 'https://citibikenyc.com', 'https://logo.clearbit.com/citibikenyc.com', '2024-03-12'),

-- Shopping (6)
('walmart-plus', 'Walmart+', 'walmart-plus', 'walmart.com', 'Shopping', 'https://walmart.com/plus', 'https://logo.clearbit.com/walmart.com', '2024-03-12'),
('costco', 'Costco Membership', 'costco', 'costco.com', 'Shopping', 'https://costco.com', 'https://logo.clearbit.com/costco.com', '2024-03-12'),
('sams-club', 'Sam''s Club', 'sams-club', 'samsclub.com', 'Shopping', 'https://samsclub.com', 'https://logo.clearbit.com/samsclub.com', '2024-03-12'),
('target-circle', 'Target Circle 360', 'target-circle', 'target.com', 'Shopping', 'https://target.com', 'https://logo.clearbit.com/target.com', '2024-03-12'),
('ebay-plus', 'eBay Plus', 'ebay-plus', 'ebay.com', 'Shopping', 'https://ebay.com', 'https://logo.clearbit.com/ebay.com', '2024-03-12'),
('bestbuy-totaltech', 'Best Buy Totaltech', 'bestbuy-totaltech', 'bestbuy.com', 'Shopping', 'https://bestbuy.com', 'https://logo.clearbit.com/bestbuy.com', '2024-03-12'),

-- Dating (4)
('tinder', 'Tinder', 'tinder', 'tinder.com', 'Dating', 'https://tinder.com', 'https://logo.clearbit.com/tinder.com', '2024-03-12'),
('bumble', 'Bumble Premium', 'bumble', 'bumble.com', 'Dating', 'https://bumble.com', 'https://logo.clearbit.com/bumble.com', '2024-03-12'),
('hinge', 'Hinge', 'hinge', 'hinge.co', 'Dating', 'https://hinge.co', 'https://logo.clearbit.com/hinge.co', '2024-03-12'),
('match', 'Match.com', 'match', 'match.com', 'Dating', 'https://match.com', 'https://logo.clearbit.com/match.com', '2024-03-12'),

-- Social Media (6)
('x-premium', 'X Premium', 'x-premium', 'x.com', 'Social Media', 'https://x.com', 'https://logo.clearbit.com/x.com', '2024-03-12'),
('snapchat-plus', 'Snapchat+', 'snapchat-plus', 'snapchat.com', 'Social Media', 'https://snapchat.com', 'https://logo.clearbit.com/snapchat.com', '2024-03-12'),
('reddit-premium', 'Reddit Premium', 'reddit-premium', 'reddit.com', 'Social Media', 'https://reddit.com', 'https://logo.clearbit.com/reddit.com', '2024-03-12'),
('discord-nitro', 'Discord Nitro', 'discord-nitro', 'discord.com', 'Social Media', 'https://discord.com', 'https://logo.clearbit.com/discord.com', '2024-03-12'),
('telegram-premium', 'Telegram Premium', 'telegram-premium', 'telegram.org', 'Social Media', 'https://telegram.org', 'https://logo.clearbit.com/telegram.org', '2024-03-12'),
('youtube-tv', 'YouTube TV', 'youtube-tv', 'tv.youtube.com', 'Streaming', 'https://tv.youtube.com', 'https://logo.clearbit.com/tv.youtube.com', '2024-03-12'),

-- Health & Wellness (4)
('betterhelp', 'BetterHelp', 'betterhelp', 'betterhelp.com', 'Health & Wellness', 'https://betterhelp.com', 'https://logo.clearbit.com/betterhelp.com', '2024-03-12'),
('calm', 'Calm', 'calm', 'calm.com', 'Health & Wellness', 'https://calm.com', 'https://logo.clearbit.com/calm.com', '2024-03-12'),
('noom', 'Noom', 'noom', 'noom.com', 'Health & Wellness', 'https://noom.com', 'https://logo.clearbit.com/noom.com', '2024-03-12'),
('talkspace', 'Talkspace', 'talkspace', 'talkspace.com', 'Health & Wellness', 'https://talkspace.com', 'https://logo.clearbit.com/talkspace.com', '2024-03-12'),

-- Finance (4)
('robinhood-gold', 'Robinhood Gold', 'robinhood-gold', 'robinhood.com', 'Finance', 'https://robinhood.com', 'https://logo.clearbit.com/robinhood.com', '2024-03-12'),
('ynab', 'YNAB', 'ynab', 'ynab.com', 'Finance', 'https://ynab.com', 'https://logo.clearbit.com/ynab.com', '2024-03-12'),
('credit-karma', 'Credit Karma', 'credit-karma', 'creditkarma.com', 'Finance', 'https://creditkarma.com', 'https://logo.clearbit.com/creditkarma.com', '2024-03-12'),
('turbotax', 'TurboTax Live', 'turbotax', 'turbotax.com', 'Finance', 'https://turbotax.com', 'https://logo.clearbit.com/turbotax.com', '2024-03-12'),

-- Job Search (5)
('jobright', 'Jobright', 'jobright', 'jobright.ai', 'Job Search', 'https://jobright.ai', 'https://logo.clearbit.com/jobright.ai', '2024-03-12'),
('indeed', 'Indeed Resume', 'indeed', 'indeed.com', 'Job Search', 'https://indeed.com', 'https://logo.clearbit.com/indeed.com', '2024-03-12'),
('ziprecruiter', 'ZipRecruiter', 'ziprecruiter', 'ziprecruiter.com', 'Job Search', 'https://ziprecruiter.com', 'https://logo.clearbit.com/ziprecruiter.com', '2024-03-12'),
('glassdoor', 'Glassdoor Premium', 'glassdoor', 'glassdoor.com', 'Job Search', 'https://glassdoor.com', 'https://logo.clearbit.com/glassdoor.com', '2024-03-12'),
('handshake', 'Handshake Premium', 'handshake', 'joinhandshake.com', 'Job Search', 'https://joinhandshake.com', 'https://logo.clearbit.com/joinhandshake.com', '2024-03-12'),

-- Home & Security (4)
('ring', 'Ring Protect', 'ring', 'ring.com', 'Home & Security', 'https://ring.com', 'https://logo.clearbit.com/ring.com', '2024-03-12'),
('simplisafe', 'SimpliSafe', 'simplisafe', 'simplisafe.com', 'Home & Security', 'https://simplisafe.com', 'https://logo.clearbit.com/simplisafe.com', '2024-03-12'),
('adt', 'ADT', 'adt', 'adt.com', 'Home & Security', 'https://adt.com', 'https://logo.clearbit.com/adt.com', '2024-03-12'),
('nest-aware', 'Nest Aware', 'nest-aware', 'store.google.com', 'Home & Security', 'https://store.google.com/category/nest_aware', 'https://logo.clearbit.com/store.google.com', '2024-03-12')
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- SEED: Subscription Plans
-- =====================================================

INSERT INTO subscription_plans (id, service_id, name, price, currency, billing_cycle, description, created_at) VALUES
-- Netflix Plans
('netflix-standard-ads', 'netflix', 'Standard with Ads', 6.99, 'USD', 'monthly', '1080p with ads', '2024-03-12'),
('netflix-standard', 'netflix', 'Standard', 15.49, 'USD', 'monthly', '1080p, 2 screens, no ads', '2024-03-12'),
('netflix-premium', 'netflix', 'Premium', 22.99, 'USD', 'monthly', '4K+HDR, 4 screens', '2024-03-12'),

-- Hulu Plans
('hulu-basic', 'hulu', 'Basic (with Ads)', 7.99, 'USD', 'monthly', 'Streaming with ads', '2024-03-12'),
('hulu-no-ads', 'hulu', 'No Ads', 17.99, 'USD', 'monthly', 'Ad-free streaming', '2024-03-12'),
('hulu-live-tv', 'hulu', 'Live TV', 76.99, 'USD', 'monthly', 'Live TV + on-demand', '2024-03-12'),

-- Disney+ Plans
('disney-basic', 'disney-plus', 'Basic (with Ads)', 7.99, 'USD', 'monthly', 'HD with ads', '2024-03-12'),
('disney-premium', 'disney-plus', 'Premium', 13.99, 'USD', 'monthly', '4K, no ads, downloads', '2024-03-12'),
('disney-premium-yearly', 'disney-plus', 'Premium Annual', 139.99, 'USD', 'yearly', '4K, no ads, yearly', '2024-03-12'),

-- Max Plans
('max-with-ads', 'hbo-max', 'With Ads', 9.99, 'USD', 'monthly', 'HD with ads', '2024-03-12'),
('max-ad-free', 'hbo-max', 'Ad-Free', 15.99, 'USD', 'monthly', '4K, no ads', '2024-03-12'),
('max-ultimate', 'hbo-max', 'Ultimate Ad-Free', 19.99, 'USD', 'monthly', '4K, Dolby Atmos, 4 streams', '2024-03-12'),

-- Prime Video
('prime-monthly', 'prime-video', 'Monthly', 8.99, 'USD', 'monthly', 'Prime Video only', '2024-03-12'),
('prime-annual', 'prime-video', 'Annual (Prime)', 139.00, 'USD', 'yearly', 'Full Amazon Prime', '2024-03-12'),

-- Apple TV+
('apple-tv-monthly', 'apple-tv', 'Monthly', 9.99, 'USD', 'monthly', 'Apple TV+ originals', '2024-03-12'),
('apple-tv-yearly', 'apple-tv', 'Annual', 99.00, 'USD', 'yearly', 'Apple TV+ yearly', '2024-03-12'),

-- Peacock
('peacock-plus', 'peacock', 'Peacock Plus', 7.99, 'USD', 'monthly', 'With ads', '2024-03-12'),
('peacock-plus-premium', 'peacock', 'Peacock Premium', 13.99, 'USD', 'monthly', 'No ads, downloads', '2024-03-12'),

-- Paramount+
('paramount-essential', 'paramount-plus', 'Essential', 5.99, 'USD', 'monthly', 'With ads', '2024-03-12'),
('paramount-with-showtime', 'paramount-plus', 'With Showtime', 11.99, 'USD', 'monthly', 'No ads + Showtime', '2024-03-12'),

-- Crunchyroll
('crunchyroll-fan', 'crunchyroll', 'Fan', 7.99, 'USD', 'monthly', 'Ad-free, 1 stream', '2024-03-12'),
('crunchyroll-mega', 'crunchyroll', 'Mega Fan', 9.99, 'USD', 'monthly', '4 streams, offline', '2024-03-12'),
('crunchyroll-ultimate', 'crunchyroll', 'Ultimate Fan', 14.99, 'USD', 'monthly', '6 streams, merch discount', '2024-03-12'),

-- Discovery+
('discovery-with-ads', 'discovery-plus', 'With Ads', 4.99, 'USD', 'monthly', 'Ad-supported', '2024-03-12'),
('discovery-no-ads', 'discovery-plus', 'Ad-Free', 8.99, 'USD', 'monthly', 'No ads', '2024-03-12'),

-- MUBI
('mubi-monthly', 'mubi', 'Monthly', 14.99, 'USD', 'monthly', 'Curated cinema', '2024-03-12'),
('mubi-yearly', 'mubi', 'Annual', 107.88, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- CuriosityStream
('curiosity-standard', 'curiosity-stream', 'Standard', 2.99, 'USD', 'monthly', 'HD documentaries', '2024-03-12'),
('curiosity-smart', 'curiosity-stream', 'Smart Bundle', 19.99, 'USD', 'yearly', 'HD + Nebula access', '2024-03-12'),

-- Spotify Plans
('spotify-individual', 'spotify', 'Individual', 10.99, 'USD', 'monthly', 'Ad-free, 1 account', '2024-03-12'),
('spotify-duo', 'spotify', 'Duo', 14.99, 'USD', 'monthly', '2 accounts', '2024-03-12'),
('spotify-family', 'spotify', 'Family', 16.99, 'USD', 'monthly', 'Up to 6 accounts', '2024-03-12'),
('spotify-student', 'spotify', 'Student', 5.99, 'USD', 'monthly', 'Verified students', '2024-03-12'),

-- Apple Music Plans
('apple-music-individual', 'apple-music', 'Individual', 10.99, 'USD', 'monthly', 'Lossless audio', '2024-03-12'),
('apple-music-family', 'apple-music', 'Family', 16.99, 'USD', 'monthly', 'Up to 6 people', '2024-03-12'),
('apple-music-student', 'apple-music', 'Student', 5.99, 'USD', 'monthly', 'Verified students', '2024-03-12'),

-- YouTube Premium
('yt-premium-individual', 'youtube-premium', 'Individual', 13.99, 'USD', 'monthly', 'Ad-free, background play', '2024-03-12'),
('yt-premium-family', 'youtube-premium', 'Family', 22.99, 'USD', 'monthly', 'Up to 5 members', '2024-03-12'),
('yt-premium-student', 'youtube-premium', 'Student', 7.99, 'USD', 'monthly', 'Student discount', '2024-03-12'),

-- TIDAL
('tidal-hifi', 'tidal', 'HiFi', 10.99, 'USD', 'monthly', 'Lossless audio', '2024-03-12'),
('tidal-hifi-plus', 'tidal', 'HiFi Plus', 19.99, 'USD', 'monthly', 'Master quality + Dolby Atmos', '2024-03-12'),

-- Amazon Music
('amazon-music-individual', 'amazon-music', 'Individual', 9.99, 'USD', 'monthly', 'Unlimited streaming', '2024-03-12'),
('amazon-music-family', 'amazon-music', 'Family', 16.99, 'USD', 'monthly', 'Up to 6 accounts', '2024-03-12'),

-- Xbox Game Pass
('xbox-core', 'xbox-game-pass', 'Core', 9.99, 'USD', 'monthly', 'Online multiplayer + deals', '2024-03-12'),
('xbox-standard', 'xbox-game-pass', 'Standard', 14.99, 'USD', 'monthly', 'Hundreds of games', '2024-03-12'),
('xbox-ultimate', 'xbox-game-pass', 'Ultimate', 19.99, 'USD', 'monthly', 'PC + Console + EA Play', '2024-03-12'),

-- PlayStation Plus
('ps-essential', 'ps-plus', 'Essential', 59.99, 'USD', 'yearly', 'Online + monthly games', '2024-03-12'),
('ps-extra', 'ps-plus', 'Extra', 99.99, 'USD', 'yearly', 'Essential + game catalog', '2024-03-12'),
('ps-premium', 'ps-plus', 'Premium', 159.99, 'USD', 'yearly', 'Extra + classics + streaming', '2024-03-12'),

-- Nintendo Switch Online
('nintendo-individual', 'nintendo-online', 'Individual', 19.99, 'USD', 'yearly', 'Online play', '2024-03-12'),
('nintendo-family', 'nintendo-online', 'Family', 34.99, 'USD', 'yearly', 'Up to 8 accounts', '2024-03-12'),
('nintendo-expansion', 'nintendo-online', 'Expansion Pack', 49.99, 'USD', 'yearly', 'N64 + Genesis games', '2024-03-12'),

-- EA Play
('ea-play-monthly', 'ea-play', 'EA Play', 5.99, 'USD', 'monthly', 'EA game vault', '2024-03-12'),
('ea-play-pro', 'ea-play', 'EA Play Pro', 16.99, 'USD', 'monthly', 'Pro editions + day-one access', '2024-03-12'),

-- Ubisoft+
('ubisoft-classics', 'ubisoft-plus', 'Classics', 7.99, 'USD', 'monthly', 'Classic Ubisoft library', '2024-03-12'),
('ubisoft-premium', 'ubisoft-plus', 'Premium', 17.99, 'USD', 'monthly', 'Day-one access to all games', '2024-03-12'),

-- Humble Choice
('humble-monthly', 'humble-bundle', 'Monthly', 11.99, 'USD', 'monthly', '8+ games per month', '2024-03-12'),

-- Microsoft 365
('m365-personal', 'microsoft-365', 'Personal', 6.99, 'USD', 'monthly', '1 user, 1TB OneDrive', '2024-03-12'),
('m365-family', 'microsoft-365', 'Family', 9.99, 'USD', 'monthly', 'Up to 6 users', '2024-03-12'),
('m365-personal-yearly', 'microsoft-365', 'Personal Annual', 69.99, 'USD', 'yearly', '1 user, yearly', '2024-03-12'),
('m365-family-yearly', 'microsoft-365', 'Family Annual', 99.99, 'USD', 'yearly', 'Up to 6 users, yearly', '2024-03-12'),

-- Notion
('notion-plus', 'notion', 'Plus', 10.00, 'USD', 'monthly', 'Unlimited blocks', '2024-03-12'),
('notion-business', 'notion', 'Business', 18.00, 'USD', 'monthly', 'Advanced features', '2024-03-12'),

-- Slack
('slack-pro', 'slack', 'Pro', 8.75, 'USD', 'monthly', 'Per user/month', '2024-03-12'),
('slack-business', 'slack', 'Business+', 12.50, 'USD', 'monthly', 'Advanced admin tools', '2024-03-12'),

-- Zoom
('zoom-pro', 'zoom', 'Pro', 13.33, 'USD', 'monthly', '30h meetings, 100 attendees', '2024-03-12'),
('zoom-business', 'zoom', 'Business', 21.99, 'USD', 'monthly', '300 attendees, recording', '2024-03-12'),

-- Evernote
('evernote-personal', 'evernote', 'Personal', 14.99, 'USD', 'monthly', 'Advanced features', '2024-03-12'),
('evernote-professional', 'evernote', 'Professional', 17.99, 'USD', 'monthly', 'All features', '2024-03-12'),

-- Todoist
('todoist-pro', 'todoist', 'Pro', 4.00, 'USD', 'monthly', 'Reminders, filters', '2024-03-12'),
('todoist-business', 'todoist', 'Business', 6.00, 'USD', 'monthly', 'Team features', '2024-03-12'),

-- 1Password
('1password-individual', '1password', 'Individual', 2.99, 'USD', 'monthly', 'Password manager', '2024-03-12'),
('1password-family', '1password', 'Families', 4.99, 'USD', 'monthly', 'Up to 5 members', '2024-03-12'),

-- LastPass
('lastpass-premium', 'lastpass', 'Premium', 3.00, 'USD', 'monthly', 'Cross-device sync', '2024-03-12'),
('lastpass-families', 'lastpass', 'Families', 4.00, 'USD', 'monthly', 'Up to 6 users', '2024-03-12'),

-- Grammarly
('grammarly-premium', 'grammarly', 'Premium', 12.00, 'USD', 'monthly', 'Advanced writing checks', '2024-03-12'),
('grammarly-business', 'grammarly', 'Business', 15.00, 'USD', 'monthly', 'Team analytics', '2024-03-12'),

-- Dashlane
('dashlane-premium', 'dashlane', 'Premium', 4.99, 'USD', 'monthly', 'Password manager + VPN', '2024-03-12'),
('dashlane-family', 'dashlane', 'Family', 7.49, 'USD', 'monthly', 'Up to 10 members', '2024-03-12'),

-- ChatGPT
('chatgpt-plus', 'chatgpt', 'Plus', 20.00, 'USD', 'monthly', 'GPT-4o, DALL-E', '2024-03-12'),
('chatgpt-pro', 'chatgpt', 'Pro', 200.00, 'USD', 'monthly', 'Unlimited access, o1 pro', '2024-03-12'),

-- Claude
('claude-pro', 'claude', 'Pro', 20.00, 'USD', 'monthly', 'Extended usage, priority', '2024-03-12'),
('claude-team', 'claude', 'Team', 30.00, 'USD', 'monthly', 'Team features per user', '2024-03-12'),

-- Midjourney
('midjourney-basic', 'midjourney', 'Basic', 10.00, 'USD', 'monthly', '200 images/month', '2024-03-12'),
('midjourney-standard', 'midjourney', 'Standard', 30.00, 'USD', 'monthly', '15h fast GPU', '2024-03-12'),
('midjourney-pro', 'midjourney', 'Pro', 60.00, 'USD', 'monthly', '30h fast GPU, stealth', '2024-03-12'),

-- GitHub Copilot
('copilot-individual', 'copilot', 'Individual', 10.00, 'USD', 'monthly', 'AI code suggestions', '2024-03-12'),
('copilot-business', 'copilot', 'Business', 19.00, 'USD', 'monthly', 'Organization features', '2024-03-12'),

-- Jasper AI
('jasper-creator', 'jasper', 'Creator', 49.00, 'USD', 'monthly', 'AI writing for 1 user', '2024-03-12'),
('jasper-pro', 'jasper', 'Pro', 69.00, 'USD', 'monthly', 'Brand voice, collaboration', '2024-03-12'),

-- Perplexity
('perplexity-pro', 'perplexity', 'Pro', 20.00, 'USD', 'monthly', 'Unlimited Pro searches', '2024-03-12'),
('perplexity-yearly', 'perplexity', 'Pro Annual', 200.00, 'USD', 'yearly', 'Pro yearly discount', '2024-03-12'),

-- Runway
('runway-standard', 'runway', 'Standard', 12.00, 'USD', 'monthly', '625 credits/month', '2024-03-12'),
('runway-pro', 'runway', 'Pro', 28.00, 'USD', 'monthly', '2250 credits/month', '2024-03-12'),

-- Cursor
('cursor-pro', 'cursor', 'Pro', 20.00, 'USD', 'monthly', '500 fast requests', '2024-03-12'),
('cursor-business', 'cursor', 'Business', 40.00, 'USD', 'monthly', 'Admin, SSO', '2024-03-12'),

-- iCloud+
('icloud-50gb', 'icloud', '50GB', 0.99, 'USD', 'monthly', '50GB iCloud storage', '2024-03-12'),
('icloud-200gb', 'icloud', '200GB', 2.99, 'USD', 'monthly', '200GB, Family Sharing', '2024-03-12'),
('icloud-2tb', 'icloud', '2TB', 9.99, 'USD', 'monthly', '2TB, Private Relay', '2024-03-12'),

-- Google One
('google-100gb', 'google-one', '100GB', 1.99, 'USD', 'monthly', '100GB Google storage', '2024-03-12'),
('google-200gb', 'google-one', '200GB', 2.99, 'USD', 'monthly', '200GB + VPN', '2024-03-12'),
('google-2tb', 'google-one', '2TB', 9.99, 'USD', 'monthly', '2TB premium storage', '2024-03-12'),

-- Dropbox
('dropbox-plus', 'dropbox', 'Plus', 11.99, 'USD', 'monthly', '2TB storage', '2024-03-12'),
('dropbox-professional', 'dropbox', 'Professional', 22.00, 'USD', 'monthly', '3TB, smart sync', '2024-03-12'),

-- Coursera
('coursera-plus-monthly', 'coursera', 'Plus Monthly', 59.00, 'USD', 'monthly', '3000+ courses', '2024-03-12'),
('coursera-plus-yearly', 'coursera', 'Plus Annual', 399.00, 'USD', 'yearly', '3000+ courses, yearly', '2024-03-12'),

-- Skillshare
('skillshare-monthly', 'skillshare', 'Monthly', 13.99, 'USD', 'monthly', 'Unlimited classes', '2024-03-12'),
('skillshare-yearly', 'skillshare', 'Annual', 167.88, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- MasterClass
('masterclass-individual', 'masterclass', 'Individual', 10.00, 'USD', 'monthly', '1 device', '2024-03-12'),
('masterclass-duo', 'masterclass', 'Duo', 15.00, 'USD', 'monthly', '2 devices', '2024-03-12'),
('masterclass-family', 'masterclass', 'Family', 20.00, 'USD', 'monthly', '6 devices', '2024-03-12'),

-- LinkedIn Learning
('linkedin-learning', 'linkedin-learning', 'Monthly', 29.99, 'USD', 'monthly', 'Expert-led courses', '2024-03-12'),
('linkedin-learning-yearly', 'linkedin-learning', 'Annual', 239.88, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Brilliant
('brilliant-monthly', 'brilliant', 'Monthly', 24.99, 'USD', 'monthly', 'Math & science courses', '2024-03-12'),
('brilliant-yearly', 'brilliant', 'Annual', 149.88, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- Duolingo
('duolingo-monthly', 'duolingo', 'Monthly', 12.99, 'USD', 'monthly', 'No ads, unlimited hearts', '2024-03-12'),
('duolingo-yearly', 'duolingo', 'Annual', 83.99, 'USD', 'yearly', 'Annual savings', '2024-03-12'),
('duolingo-family', 'duolingo', 'Family', 119.99, 'USD', 'yearly', 'Up to 6 members', '2024-03-12'),

-- Peloton
('peloton-app-one', 'peloton', 'App One', 12.99, 'USD', 'monthly', 'App-only access', '2024-03-12'),
('peloton-app-plus', 'peloton', 'App+', 24.00, 'USD', 'monthly', 'Equipment + app', '2024-03-12'),

-- Strava
('strava-monthly', 'strava', 'Monthly', 11.99, 'USD', 'monthly', 'Training analysis', '2024-03-12'),
('strava-yearly', 'strava', 'Annual', 79.99, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Fitbit
('fitbit-monthly', 'fitbit', 'Monthly', 9.99, 'USD', 'monthly', 'Advanced health metrics', '2024-03-12'),
('fitbit-yearly', 'fitbit', 'Annual', 79.99, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- MyFitnessPal
('mfp-monthly', 'myfitnesspal', 'Monthly', 19.99, 'USD', 'monthly', 'Premium features', '2024-03-12'),
('mfp-yearly', 'myfitnesspal', 'Annual', 79.99, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- Apple Fitness+
('apple-fitness-monthly', 'apple-fitness', 'Monthly', 9.99, 'USD', 'monthly', 'Workouts + meditations', '2024-03-12'),
('apple-fitness-yearly', 'apple-fitness', 'Annual', 79.99, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Headspace
('headspace-monthly', 'headspace', 'Monthly', 12.99, 'USD', 'monthly', 'Meditation & mindfulness', '2024-03-12'),
('headspace-yearly', 'headspace', 'Annual', 69.99, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- NY Times
('nyt-basic', 'nyt', 'Basic Digital', 4.00, 'USD', 'monthly', 'News articles', '2024-03-12'),
('nyt-all-access', 'nyt', 'All Access', 25.00, 'USD', 'monthly', 'Games, Cooking, Wirecutter', '2024-03-12'),

-- WSJ
('wsj-monthly', 'wsj', 'Monthly', 38.99, 'USD', 'monthly', 'Digital access', '2024-03-12'),

-- Medium
('medium-monthly', 'medium', 'Monthly', 5.00, 'USD', 'monthly', 'Unlimited reading', '2024-03-12'),
('medium-yearly', 'medium', 'Annual', 50.00, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- NordVPN
('nordvpn-monthly', 'nordvpn', 'Monthly', 12.99, 'USD', 'monthly', 'VPN protection', '2024-03-12'),
('nordvpn-yearly', 'nordvpn', 'Annual', 59.88, 'USD', 'yearly', 'Best value yearly', '2024-03-12'),

-- ExpressVPN
('expressvpn-monthly', 'expressvpn', 'Monthly', 12.95, 'USD', 'monthly', 'Premium VPN', '2024-03-12'),
('expressvpn-yearly', 'expressvpn', 'Annual', 99.95, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- Surfshark
('surfshark-monthly', 'surfshark', 'Monthly', 12.95, 'USD', 'monthly', 'Unlimited devices', '2024-03-12'),
('surfshark-yearly', 'surfshark', 'Annual', 47.88, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- Proton VPN
('protonvpn-plus', 'protonvpn', 'Plus', 9.99, 'USD', 'monthly', 'Secure VPN', '2024-03-12'),
('protonvpn-yearly', 'protonvpn', 'Plus Annual', 71.88, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- GitHub Pro
('github-pro', 'github', 'Pro', 4.00, 'USD', 'monthly', 'Advanced tools, CI/CD', '2024-03-12'),
('github-team', 'github', 'Team', 4.00, 'USD', 'monthly', 'Per user, org features', '2024-03-12'),

-- Vercel Pro
('vercel-pro-plan', 'vercel', 'Pro', 20.00, 'USD', 'monthly', 'Production deployments', '2024-03-12'),

-- Netlify Pro
('netlify-pro-plan', 'netlify', 'Pro', 19.00, 'USD', 'monthly', 'Team features, bandwidth', '2024-03-12'),

-- Docker Pro
('docker-pro', 'docker', 'Pro', 5.00, 'USD', 'monthly', 'Unlimited pulls', '2024-03-12'),
('docker-team', 'docker', 'Team', 9.00, 'USD', 'monthly', 'Team management', '2024-03-12'),

-- Figma
('figma-professional', 'figma', 'Professional', 12.00, 'USD', 'monthly', 'Unlimited projects', '2024-03-12'),
('figma-organization', 'figma', 'Organization', 45.00, 'USD', 'monthly', 'Org-wide libraries', '2024-03-12'),

-- Canva Pro
('canva-pro-monthly', 'canva', 'Pro', 12.99, 'USD', 'monthly', 'Premium templates', '2024-03-12'),
('canva-pro-yearly', 'canva', 'Pro Annual', 119.99, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Adobe Creative Cloud
('adobe-photography', 'adobe', 'Photography', 9.99, 'USD', 'monthly', 'Photoshop + Lightroom', '2024-03-12'),
('adobe-single-app', 'adobe', 'Single App', 22.99, 'USD', 'monthly', 'Any one app', '2024-03-12'),
('adobe-all-apps', 'adobe', 'All Apps', 59.99, 'USD', 'monthly', 'Full Creative Cloud', '2024-03-12'),

-- Sketch
('sketch-monthly', 'sketch', 'Standard', 10.00, 'USD', 'monthly', 'Mac design tool', '2024-03-12'),

-- Framer
('framer-mini', 'framer', 'Mini', 5.00, 'USD', 'monthly', '1 published site', '2024-03-12'),
('framer-basic', 'framer', 'Basic', 15.00, 'USD', 'monthly', '2 published sites', '2024-03-12'),
('framer-pro', 'framer', 'Pro', 25.00, 'USD', 'monthly', 'Unlimited sites', '2024-03-12'),

-- Salesforce
('salesforce-starter', 'salesforce', 'Starter', 25.00, 'USD', 'monthly', 'CRM essentials', '2024-03-12'),
('salesforce-professional', 'salesforce', 'Professional', 80.00, 'USD', 'monthly', 'Full CRM', '2024-03-12'),

-- HubSpot
('hubspot-starter', 'hubspot', 'Starter', 20.00, 'USD', 'monthly', 'Marketing starter', '2024-03-12'),
('hubspot-professional', 'hubspot', 'Professional', 890.00, 'USD', 'monthly', 'Full marketing suite', '2024-03-12'),

-- Jira
('jira-standard', 'jira', 'Standard', 8.15, 'USD', 'monthly', 'Per user, project tracking', '2024-03-12'),
('jira-premium', 'jira', 'Premium', 16.00, 'USD', 'monthly', 'Advanced features', '2024-03-12'),

-- Asana
('asana-premium', 'asana', 'Premium', 10.99, 'USD', 'monthly', 'Timelines, workflows', '2024-03-12'),
('asana-business', 'asana', 'Business', 24.99, 'USD', 'monthly', 'Portfolios, goals', '2024-03-12'),

-- Monday.com
('monday-basic', 'monday', 'Basic', 9.00, 'USD', 'monthly', 'Essential features', '2024-03-12'),
('monday-standard', 'monday', 'Standard', 12.00, 'USD', 'monthly', 'Collaboration tools', '2024-03-12'),
('monday-pro', 'monday', 'Pro', 19.00, 'USD', 'monthly', 'Time tracking, charts', '2024-03-12'),

-- Linear
('linear-standard', 'linear', 'Standard', 8.00, 'USD', 'monthly', 'Per member', '2024-03-12'),
('linear-plus', 'linear', 'Plus', 14.00, 'USD', 'monthly', 'Advanced features', '2024-03-12'),

-- Zendesk
('zendesk-team', 'zendesk', 'Suite Team', 55.00, 'USD', 'monthly', 'Per agent', '2024-03-12'),
('zendesk-professional', 'zendesk', 'Suite Professional', 115.00, 'USD', 'monthly', 'Advanced analytics', '2024-03-12'),

-- Mailchimp
('mailchimp-essentials', 'mailchimp', 'Essentials', 13.00, 'USD', 'monthly', 'Email campaigns', '2024-03-12'),
('mailchimp-standard', 'mailchimp', 'Standard', 20.00, 'USD', 'monthly', 'Automation, optimization', '2024-03-12'),

-- DoorDash DashPass
('doordash-monthly', 'doordash', 'DashPass', 9.99, 'USD', 'monthly', '$0 delivery on $12+ orders', '2024-03-12'),
('doordash-yearly', 'doordash', 'DashPass Annual', 96.00, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Uber One
('uber-one-monthly', 'uber-one', 'Monthly', 9.99, 'USD', 'monthly', 'Free delivery, ride discounts', '2024-03-12'),
('uber-one-yearly', 'uber-one', 'Annual', 99.99, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Grubhub+
('grubhub-monthly', 'grubhub', 'Monthly', 9.99, 'USD', 'monthly', 'Free delivery on $12+', '2024-03-12'),

-- Instacart+
('instacart-monthly', 'instacart', 'Monthly', 9.99, 'USD', 'monthly', 'Free delivery on $35+', '2024-03-12'),
('instacart-yearly', 'instacart', 'Annual', 99.00, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- HelloFresh
('hellofresh-2person', 'hellofresh', '2 Person Plan', 60.00, 'USD', 'weekly', '3 recipes, 2 servings', '2024-03-12'),
('hellofresh-4person', 'hellofresh', '4 Person Plan', 96.00, 'USD', 'weekly', '3 recipes, 4 servings', '2024-03-12'),

-- Blue Apron
('blue-apron-2', 'blue-apron', '2 Servings', 48.00, 'USD', 'weekly', '3 recipes, 2 servings', '2024-03-12'),

-- Lyft Pink
('lyft-pink-monthly', 'lyft-pink', 'Lyft Pink', 9.99, 'USD', 'monthly', '5% off rides, priority pickup', '2024-03-12'),
('lyft-pink-yearly', 'lyft-pink', 'All Access', 199.00, 'USD', 'yearly', 'Annual all-access plan', '2024-03-12'),

-- Walmart+
('walmart-monthly', 'walmart-plus', 'Monthly', 12.95, 'USD', 'monthly', 'Free delivery, fuel discounts', '2024-03-12'),
('walmart-yearly', 'walmart-plus', 'Annual', 98.00, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Costco
('costco-gold', 'costco', 'Gold Star', 65.00, 'USD', 'yearly', 'Warehouse access', '2024-03-12'),
('costco-executive', 'costco', 'Executive', 130.00, 'USD', 'yearly', '2% rewards on purchases', '2024-03-12'),

-- Sam's Club
('sams-club-basic', 'sams-club', 'Club', 50.00, 'USD', 'yearly', 'Warehouse access', '2024-03-12'),
('sams-club-plus', 'sams-club', 'Plus', 110.00, 'USD', 'yearly', '2% cashback, free shipping', '2024-03-12'),

-- Target Circle 360
('target-circle-yearly', 'target-circle', 'Annual', 99.00, 'USD', 'yearly', 'Same-day delivery', '2024-03-12'),

-- Best Buy Totaltech
('bestbuy-totaltech', 'bestbuy-totaltech', 'Totaltech', 179.99, 'USD', 'yearly', 'Extended protection, support', '2024-03-12'),

-- Tinder
('tinder-plus', 'tinder', 'Plus', 9.99, 'USD', 'monthly', 'Unlimited likes', '2024-03-12'),
('tinder-gold', 'tinder', 'Gold', 29.99, 'USD', 'monthly', 'See who likes you', '2024-03-12'),
('tinder-platinum', 'tinder', 'Platinum', 39.99, 'USD', 'monthly', 'Priority likes, message before match', '2024-03-12'),

-- Bumble
('bumble-boost', 'bumble', 'Boost', 16.99, 'USD', 'monthly', 'Extend matches, backtrack', '2024-03-12'),
('bumble-premium', 'bumble', 'Premium', 39.99, 'USD', 'monthly', 'Boost + advanced filters', '2024-03-12'),

-- Hinge
('hinge-plus', 'hinge', 'Plus', 19.99, 'USD', 'monthly', 'Unlimited likes, preferences', '2024-03-12'),
('hinge-preferred', 'hinge', 'Preferred', 34.99, 'USD', 'monthly', 'Plus + enhanced discovery', '2024-03-12'),

-- Match.com
('match-standard', 'match', 'Standard', 21.99, 'USD', 'monthly', 'Messaging, likes', '2024-03-12'),
('match-premium', 'match', 'Premium', 34.99, 'USD', 'monthly', 'Read receipts, boost', '2024-03-12'),

-- X Premium
('x-basic', 'x-premium', 'Basic', 3.00, 'USD', 'monthly', 'Edit posts, longer posts', '2024-03-12'),
('x-premium-tier', 'x-premium', 'Premium', 8.00, 'USD', 'monthly', 'Blue check, half ads', '2024-03-12'),
('x-premium-plus', 'x-premium', 'Premium+', 16.00, 'USD', 'monthly', 'No ads, largest boost', '2024-03-12'),

-- Snapchat+
('snapchat-plus-monthly', 'snapchat-plus', 'Monthly', 3.99, 'USD', 'monthly', 'Exclusive features', '2024-03-12'),

-- Reddit Premium
('reddit-premium-monthly', 'reddit-premium', 'Monthly', 5.99, 'USD', 'monthly', 'Ad-free, Reddit coins', '2024-03-12'),

-- Discord Nitro
('discord-nitro-basic', 'discord-nitro', 'Nitro Basic', 2.99, 'USD', 'monthly', 'Emojis, stickers, uploads', '2024-03-12'),
('discord-nitro-full', 'discord-nitro', 'Nitro', 9.99, 'USD', 'monthly', 'HD streaming, 500MB uploads', '2024-03-12'),

-- Telegram Premium
('telegram-premium-monthly', 'telegram-premium', 'Monthly', 4.99, 'USD', 'monthly', 'No ads, 4GB uploads', '2024-03-12'),

-- YouTube TV
('youtube-tv-base', 'youtube-tv', 'Base Plan', 72.99, 'USD', 'monthly', '100+ live channels', '2024-03-12'),

-- BetterHelp
('betterhelp-weekly', 'betterhelp', 'Weekly', 65.00, 'USD', 'weekly', 'Unlimited messaging, 1 live session', '2024-03-12'),

-- Calm
('calm-monthly', 'calm', 'Monthly', 14.99, 'USD', 'monthly', 'Meditation, sleep stories', '2024-03-12'),
('calm-yearly', 'calm', 'Annual', 69.99, 'USD', 'yearly', 'Annual plan', '2024-03-12'),

-- Noom
('noom-monthly', 'noom', 'Monthly', 70.00, 'USD', 'monthly', 'Weight management program', '2024-03-12'),

-- Talkspace
('talkspace-messaging', 'talkspace', 'Messaging Therapy', 69.00, 'USD', 'weekly', 'Unlimited messaging, 1 live session', '2024-03-12'),

-- Robinhood Gold
('robinhood-gold-monthly', 'robinhood-gold', 'Gold', 5.00, 'USD', 'monthly', 'Research, margin lending', '2024-03-12'),

-- YNAB
('ynab-monthly', 'ynab', 'Monthly', 14.99, 'USD', 'monthly', 'Budgeting software', '2024-03-12'),
('ynab-yearly', 'ynab', 'Annual', 109.00, 'USD', 'yearly', 'Annual savings', '2024-03-12'),

-- Jobright
('jobright-pro', 'jobright', 'Pro', 29.00, 'USD', 'monthly', 'AI job matching', '2024-03-12'),

-- Ring Protect
('ring-basic', 'ring', 'Basic', 3.99, 'USD', 'monthly', '1 device, 180-day history', '2024-03-12'),
('ring-plus', 'ring', 'Plus', 10.00, 'USD', 'monthly', 'All devices, extended warranty', '2024-03-12'),

-- SimpliSafe
('simplisafe-standard', 'simplisafe', 'Standard', 17.99, 'USD', 'monthly', '24/7 monitoring', '2024-03-12'),
('simplisafe-fast', 'simplisafe', 'Fast Protect', 27.99, 'USD', 'monthly', 'Priority dispatch, camera recording', '2024-03-12'),

-- Nest Aware
('nest-aware-monthly', 'nest-aware', 'Nest Aware', 8.00, 'USD', 'monthly', '30-day event history', '2024-03-12'),
('nest-aware-plus', 'nest-aware', 'Nest Aware Plus', 15.00, 'USD', 'monthly', '60-day 24/7 video history', '2024-03-12')
ON CONFLICT (id) DO NOTHING;
