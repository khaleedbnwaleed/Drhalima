import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const tokenStr = cookieStore.get('supporterToken')?.value

    if (!tokenStr) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = JSON.parse(tokenStr)
    const supporterId = token.id

    // Fetch organization details
    const { data: organization, error: fetchError } = await supabase
      .from('supporters')
      .select('*')
      .eq('id', supporterId)
      .eq('account_type', 'organization')
      .single()

    if (fetchError || !organization) {
      return Response.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    return Response.json({ organization }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
