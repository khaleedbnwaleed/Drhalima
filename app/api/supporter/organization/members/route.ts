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
    const organizationId = token.id

    // Fetch the organization
    const { data: organization, error: orgError } = await supabase
      .from('supporters')
      .select('organization_name, supporter_id')
      .eq('id', organizationId)
      .eq('account_type', 'organization')
      .single()

    if (orgError || !organization) {
      return Response.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Fetch all members registered by this organization
    // Members are individual supporters linked to this organization via organization_name
    const { data: members, error: membersError } = await supabase
      .from('supporters')
      .select('*')
      .eq('organization_name', organization.organization_name)
      .eq('account_type', 'individual')
      .order('created_at', { ascending: false })

    if (membersError) {
      console.error('Error fetching members:', membersError)
      return Response.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      )
    }

    return Response.json({ members: members || [] }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
