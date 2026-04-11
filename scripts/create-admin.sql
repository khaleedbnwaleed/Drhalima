-- Create Admin User for Dr. Halima Campaign
-- Run this script to create a working admin account
-- Password: "admin123" (change immediately after first login!)

-- Insert admin user (this works with base schema only)
INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('admin@drhalimasulaiman.ng', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uCdcA/2GjRMS', 'System Administrator', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Verify the admin user was created
SELECT id, email, full_name, role, created_at FROM users WHERE email = 'admin@drhalimasulaiman.ng';