-- Add Organization Support to Supporters Table
-- This allows both individual supporters and organizations to use the same table

ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'individual'; -- 'individual' or 'organization'

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_supporters_email ON supporters(email);
