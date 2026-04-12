-- Enhanced Database Schema for Dr. Halima Campaign Management System
-- This script adds tables for supporters, enhanced volunteers, voter tracking, and messaging

-- ==================== SUPPORTERS TABLE ====================
-- Enhanced supporter registration with voter card info and supporter ID
CREATE TABLE IF NOT EXISTS supporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supporter_id TEXT UNIQUE NOT NULL, -- Auto-generated unique ID (e.g., SUP-2025-001234)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  
  -- Location Information
  state TEXT NOT NULL,
  lga TEXT NOT NULL, -- Local Government Area
  ward TEXT NOT NULL,
  address TEXT,
  
  -- Voter Information
  pvc_number TEXT, -- Permanent Voter's Card number
  voter_status TEXT DEFAULT 'unverified', -- unverified, verified, no_pvc
  
  -- Additional Information
  occupation TEXT,
  profile_photo_url TEXT,
  
  -- Support Tracking
  support_status TEXT DEFAULT 'undecided', -- strong_supporter, undecided, opponent
  
  -- QR Code
  qr_code_url TEXT,
  
  -- Metadata
  registered_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active' -- active, inactive, suspended
);

-- ==================== ENHANCED VOLUNTEERS TABLE ====================
-- Updated volunteers table with roles and assignments
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS supporter_id UUID;
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS volunteer_role TEXT; -- Field Agent, Media, Polling Unit Agent
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS assigned_lga TEXT;
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS assigned_ward TEXT;
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS availability TEXT; -- full_time, part_time, weekends_only
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS availability_hours JSONB; -- JSON structure for availability
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE IF EXISTS volunteers ADD COLUMN IF NOT EXISTS passport_photo_url TEXT;

-- ==================== VOTER TRACKING TABLE ====================
-- Track individual voter interactions and support levels by ward/LGA
CREATE TABLE IF NOT EXISTS voter_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supporter_id UUID NOT NULL REFERENCES supporters(id) ON DELETE CASCADE,
  lga TEXT NOT NULL,
  ward TEXT NOT NULL,
  support_status TEXT DEFAULT 'undecided', -- strong_supporter, undecided, opponent, not_contacted
  
  -- Interaction tracking
  last_contact_date TIMESTAMP WITH TIME ZONE,
  contact_method TEXT, -- sms, whatsapp, call, visited
  contact_notes TEXT,
  
  -- Volunteer assigned to this voter
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MESSAGING CAMPAIGNS TABLE ====================
-- Track bulk SMS/WhatsApp messaging campaigns
CREATE TABLE IF NOT EXISTS messaging_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  channel TEXT NOT NULL, -- sms, whatsapp, both
  target_group TEXT, -- all_supporters, by_lga, by_ward, by_support_level
  target_filter JSONB, -- Filter parameters (e.g., {"lga": "Lagos", "support_status": "strong_supporter"})
  
  -- Scheduling
  scheduled_time TIMESTAMP WITH TIME ZONE,
  send_immediately BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, completed, failed
  
  -- Statistics
  total_recipients INTEGER DEFAULT 0,
  successfully_sent INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MESSAGE DELIVERY TABLE ====================
-- Track individual message deliveries
CREATE TABLE IF NOT EXISTS message_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES messaging_campaigns(id) ON DELETE CASCADE,
  supporter_id UUID NOT NULL REFERENCES supporters(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_text TEXT NOT NULL,
  channel TEXT NOT NULL, -- sms, whatsapp
  
  -- Delivery status
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, failed, read
  delivery_timestamp TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== AUDIT LOG TABLE ====================
-- Track all admin actions for security and accountability
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- create, update, delete, export, login, etc.
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB, -- Previous values for updates
  new_values JSONB, -- New values for updates/creates
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== WARD STATISTICS TABLE ====================
-- Cached ward-level statistics for faster dashboard queries
CREATE TABLE IF NOT EXISTS ward_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  ward TEXT NOT NULL,
  
  -- Statistics
  total_supporters INTEGER DEFAULT 0,
  strong_supporters INTEGER DEFAULT 0,
  undecided INTEGER DEFAULT 0,
  opponents INTEGER DEFAULT 0,
  total_volunteers INTEGER DEFAULT 0,
  
  -- Last updated
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(state, lga, ward)
);

-- ==================== ADMIN USERS ENHANCEMENT ====================
-- Add additional fields to users table
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- ==================== INDEXES ====================
-- Indexes for better query performance

-- Supporters
CREATE INDEX IF NOT EXISTS idx_supporters_email ON supporters(email);
CREATE INDEX IF NOT EXISTS idx_supporters_state_lga_ward ON supporters(state, lga, ward);
CREATE INDEX IF NOT EXISTS idx_supporters_support_status ON supporters(support_status);
CREATE INDEX IF NOT EXISTS idx_supporters_pvc_number ON supporters(pvc_number);
CREATE INDEX IF NOT EXISTS idx_supporters_supporter_id ON supporters(supporter_id);

-- Voter Tracking
CREATE INDEX IF NOT EXISTS idx_voter_tracking_supporter_id ON voter_tracking(supporter_id);
CREATE INDEX IF NOT EXISTS idx_voter_tracking_lga_ward ON voter_tracking(lga, ward);
CREATE INDEX IF NOT EXISTS idx_voter_tracking_support_status ON voter_tracking(support_status);
CREATE INDEX IF NOT EXISTS idx_voter_tracking_volunteer_id ON voter_tracking(volunteer_id);

-- Messaging
CREATE INDEX IF NOT EXISTS idx_messaging_campaigns_status ON messaging_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_messaging_campaigns_created_by ON messaging_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_message_delivery_campaign_id ON message_delivery(campaign_id);
CREATE INDEX IF NOT EXISTS idx_message_delivery_status ON message_delivery(status);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Volunteers
CREATE INDEX IF NOT EXISTS idx_volunteers_assigned_lga_ward ON volunteers(assigned_lga, assigned_ward);
CREATE INDEX IF NOT EXISTS idx_volunteers_volunteer_role ON volunteers(volunteer_role);

-- ==================== ROW LEVEL SECURITY (RLS) POLICIES ====================
-- Enable RLS for sensitive tables
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE voter_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS supporters_admin_only ON supporters;
DROP POLICY IF EXISTS voter_tracking_admin_only ON voter_tracking;
DROP POLICY IF EXISTS messaging_campaigns_admin_only ON messaging_campaigns;
DROP POLICY IF EXISTS message_delivery_admin_only ON message_delivery;
DROP POLICY IF EXISTS audit_logs_admin_only ON audit_logs;

-- Policies for admins only
CREATE POLICY supporters_admin_only ON supporters FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY voter_tracking_admin_only ON voter_tracking FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY messaging_campaigns_admin_only ON messaging_campaigns FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY message_delivery_admin_only ON message_delivery FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY audit_logs_admin_only ON audit_logs FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
