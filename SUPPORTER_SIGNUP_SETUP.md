# Supporter Signup Setup Guide

## Problem
The supporter signup feature requires additional columns in the `supporters` table that don't exist yet in your Supabase database.

## Solution
Run the SQL migration script in your Supabase SQL Editor to add organization support to the supporters table.

## Step-by-Step Setup

### 1. Open Supabase SQL Editor
- Go to your Supabase project dashboard
- Click on "SQL Editor" in the left sidebar
- Click "New Query"

### 2. Copy and Run the SQL Migration

Copy the following SQL command and paste it into the SQL Editor:

```sql
-- Add Organization Support to Supporters Table
-- This allows both individual supporters and organizations to use the same table

ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE IF EXISTS supporters ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'individual';

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_supporters_email ON supporters(email);
```

### 3. Execute the Query
- Click the "Run" button (or press `Ctrl+Enter`)
- You should see a success message

### 4. Verify the Changes
In Supabase, navigate to the `supporters` table and you should see the new columns:
- `organization_name`
- `contact_person`
- `password_hash`
- `account_type`

## What These Columns Do

- **organization_name**: Stores the name of the organization registering
- **contact_person**: Stores the contact person's name for the organization
- **password_hash**: Stores the hashed password for organization login
- **account_type**: Distinguishes between 'individual' supporters and 'organization' supporters

## After Setup

Once you've run the SQL migration, the supporter signup feature will work normally:

1. Users can go to `/supporter-signup`
2. Fill in organization details
3. Submit the form
4. Account will be created in the database
5. They can login at `/supporter-login`

## Troubleshooting

### "Column already exists" error
This is normal - it means the column was already added from a previous attempt. This is safe to ignore.

### "Failed to create account" still appears
1. Verify all four columns were added successfully
2. Check that indexes were created
3. Try signup again with a new email address

### "Invalid email or password" on login
Make sure you're using the same email and password you used during signup.

## Files Modified
- `app/api/supporter/signup/route.ts` - Updated to support organization accounts
- `app/api/supporter/login/route.ts` - Updated to authenticate organization accounts
- `app/supporter-signup/page.tsx` - Signup form (no changes needed)
- `app/supporter-login/page.tsx` - Login form (no changes needed)

## Contact Support
If you continue experiencing issues, please check:
1. Network tab in browser developer tools (F12) to see API responses
2. Supabase logs for any database errors
3. Environment variables in `.env.local` are correctly set
