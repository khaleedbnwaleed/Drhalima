-- Migration Script: Update supporters table from organization schema to individual supporter schema
-- Run this if you have an existing supporters table with organization fields

-- First, backup existing data (if any)
CREATE TABLE IF NOT EXISTS supporters_backup AS
SELECT * FROM supporters;

-- Drop existing policies and disable RLS temporarily
DROP POLICY IF EXISTS "Allow public insert for signup" ON supporters;
DROP POLICY IF EXISTS "Allow authenticated read own data" ON supporters;
ALTER TABLE supporters DISABLE ROW LEVEL SECURITY;

-- Rename old columns to avoid conflicts
ALTER TABLE supporters RENAME COLUMN organization_name TO old_organization_name;
ALTER TABLE supporters RENAME COLUMN password_hash TO old_password_hash;
ALTER TABLE supporters RENAME COLUMN contact_person TO old_contact_person;
ALTER TABLE supporters RENAME COLUMN created_at TO old_created_at;
ALTER TABLE supporters RENAME COLUMN updated_at TO old_updated_at;

-- Add new columns for individual supporters
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS supporter_id TEXT UNIQUE;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Jigawa';
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS lga TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS ward TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS pvc_number TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS voter_status TEXT DEFAULT 'unverified';
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS support_status TEXT DEFAULT 'undecided';
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS registered_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update existing records (if any) - set default values
UPDATE supporters SET
  supporter_id = 'MIGRATED-' || id::text,
  first_name = COALESCE(old_contact_person, 'Unknown'),
  last_name = COALESCE(old_organization_name, 'Unknown'),
  state = 'Jigawa',
  lga = 'Unknown',
  ward = 'Unknown',
  registered_date = COALESCE(old_created_at, CURRENT_TIMESTAMP),
  last_updated = COALESCE(old_updated_at, CURRENT_TIMESTAMP)
WHERE supporter_id IS NULL;

-- Make required columns NOT NULL (after setting defaults)
ALTER TABLE supporters ALTER COLUMN supporter_id SET NOT NULL;
ALTER TABLE supporters ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE supporters ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE supporters ALTER COLUMN state SET NOT NULL;

-- Drop old columns
ALTER TABLE supporters DROP COLUMN IF EXISTS old_organization_name;
ALTER TABLE supporters DROP COLUMN IF EXISTS old_password_hash;
ALTER TABLE supporters DROP COLUMN IF EXISTS old_contact_person;
ALTER TABLE supporters DROP COLUMN IF EXISTS old_created_at;
ALTER TABLE supporters DROP COLUMN IF EXISTS old_updated_at;

-- Re-enable RLS and create new policies
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS supporters_admin_only ON supporters;

-- Create new admin-only policy
CREATE POLICY supporters_admin_only ON supporters FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Create indexes for the new schema
CREATE INDEX IF NOT EXISTS idx_supporters_state_lga_ward ON supporters(state, lga, ward);
CREATE INDEX IF NOT EXISTS idx_supporters_support_status ON supporters(support_status);
CREATE INDEX IF NOT EXISTS idx_supporters_pvc_number ON supporters(pvc_number);
CREATE INDEX IF NOT EXISTS idx_supporters_supporter_id ON supporters(supporter_id);

-- Verify the migration
SELECT 'Migration completed' as status,
       (SELECT COUNT(*) FROM supporters) as total_supporters,
       (SELECT COUNT(*) FROM supporters WHERE supporter_id LIKE 'MIGRATED-%') as migrated_records;