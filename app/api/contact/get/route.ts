import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase.from('contact_submissions').select('*')

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return Response.json(data, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
