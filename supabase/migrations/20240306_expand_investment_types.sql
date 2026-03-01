-- Expand the investments type CHECK constraint to include new asset types
-- (commodity, index, forex) added in the live prices feature
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_type_check;
ALTER TABLE investments ADD CONSTRAINT investments_type_check
  CHECK (type IN ('stock', 'crypto', 'commodity', 'index', 'forex', 'real-estate', 'other'));
