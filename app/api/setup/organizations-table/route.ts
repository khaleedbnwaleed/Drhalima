import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // Create organizations table
    const { error: tableError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS organizations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          contact_person TEXT,
          phone TEXT,
          address TEXT,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
      `
    })

    if (tableError) {
      // Try direct approach using SQL
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)

      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, we need to create it differently
        return Response.json(
          { 
            error: 'Organizations table not found. Please run: scripts/05-create-organizations-table.sql in Supabase SQL Editor',
            details: error.message
          },
          { status: 500 }
        )
      }
    }

    return Response.json(
      { success: true, message: 'Organizations table is ready' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return Response.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    )
  }
}
