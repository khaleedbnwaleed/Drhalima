import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Lazy initialization to avoid build-time errors
let supabaseClient: any = null
let supabasePublicClient: any = null

function getSupabaseClient() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
    }
    supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey)
  }
  return supabaseClient
}

function getSupabasePublicClient() {
  if (!supabasePublicClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY environment variables.')
    }
    supabasePublicClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabasePublicClient
}

// Export as proxies to enable lazy initialization
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient()
    return client[prop]
  }
})

export const supabasePublic = new Proxy({}, {
  get(target, prop) {
    const client = getSupabasePublicClient()
    return client[prop]
  }
})
