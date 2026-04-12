import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Create clients only if URL is available, otherwise throw error in production
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const error = new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
    console.error(error.message)
    throw error
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

function getSupabasePublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    const error = new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY environment variables.')
    console.error(error.message)
    throw error
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()

// For client-side usage (public operations)
export const supabasePublic = getSupabasePublicClient()
