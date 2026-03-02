-- Add exchange and market columns to investments
ALTER TABLE investments ADD COLUMN IF NOT EXISTS exchange TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS market TEXT DEFAULT 'other';

-- Update type constraint to include 'sip'
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_type_check;
ALTER TABLE investments ADD CONSTRAINT investments_type_check
  CHECK (type IN ('stock','crypto','commodity','index','forex','sip','real-estate','other'));
