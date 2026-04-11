#!/bin/bash

# Database Setup Script
# Run this to set up the organizations support in the supporters table

echo "Setting up organization support in supporters table..."
echo ""
echo "You need to run the following SQL commands in your Supabase SQL Editor:"
echo "1. Go to https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql"
echo "2. Click 'New query'"
echo "3. Paste the following SQL and click 'Run':"
echo ""
echo "========================================"
echo "-- Add Organization Support to Supporters Table"
echo "ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS organization_name TEXT;"
echo "ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS contact_person TEXT;"
echo "ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS password_hash TEXT;"
echo "ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'individual';"
echo ""
echo "CREATE INDEX IF NOT EXISTS idx_supporters_email ON supporters(email);"
echo "========================================"
echo ""
echo "After running the SQL, supporter signup will be enabled!"
