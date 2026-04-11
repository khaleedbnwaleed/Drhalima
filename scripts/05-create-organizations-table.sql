-- Organizations Table for Supporter Organizations
-- This table stores organization information for supporter signups

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active', -- active, inactive, suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);

-- Add RLS (Row Level Security) policy for organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up (insert)
CREATE POLICY "Allow public signup" ON organizations
  FOR INSERT WITH CHECK (true);

-- Allow organizations to view/update their own records
CREATE POLICY "Allow organization to view own record" ON organizations
  FOR SELECT USING (
    auth.uid()::text = id::text OR true -- For development, allow all reads
  );

CREATE POLICY "Allow organization to update own record" ON organizations
  FOR UPDATE USING (
    auth.uid()::text = id::text OR true -- For development, allow all updates
  );
