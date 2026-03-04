-- Add new columns to subscriptions table for Smart Subscription Manager
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS card_last4 text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS service_id text;
