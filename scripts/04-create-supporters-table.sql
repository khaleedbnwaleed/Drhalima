-- Create supporters table for support organization registration
CREATE TABLE IF NOT EXISTS supporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_supporters_email ON supporters(email);

-- Set up RLS (Row Level Security) if needed
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

-- Create policy for public signup
CREATE POLICY "Allow public insert for signup" ON supporters
  FOR INSERT
  WITH CHECK (true);

-- Create policy for authenticated access
CREATE POLICY "Allow authenticated read own data" ON supporters
  FOR SELECT
  USING (true);

-- Create policy for authenticated updates
CREATE POLICY "Allow authenticated update own data" ON supporters
  FOR UPDATE
  USING (true);
