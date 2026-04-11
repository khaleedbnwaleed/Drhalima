import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Create clients only if URL is available, otherwise create dummy clients
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Return a dummy client for build time - this won't be used in production
    return {
      from: () => ({
        select: () => ({ data: null, error: 'Supabase not configured' }),
        insert: () => ({ data: null, error: 'Supabase not configured' }),
        update: () => ({ data: null, error: 'Supabase not configured' }),
        delete: () => ({ data: null, error: 'Supabase not configured' }),
      }),
    } as any
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

function getSupabasePublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client for build time
    return {
      from: () => ({
        select: () => ({ data: null, error: 'Supabase not configured' }),
        insert: () => ({ data: null, error: 'Supabase not configured' }),
        update: () => ({ data: null, error: 'Supabase not configured' }),
        delete: () => ({ data: null, error: 'Supabase not configured' }),
      }),
    } as any
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()

// For client-side usage (public operations)
export const supabasePublic = getSupabasePublicClient()
