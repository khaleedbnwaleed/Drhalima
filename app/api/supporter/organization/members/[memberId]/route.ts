import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } }
) {
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
      .select('organization_name')
      .eq('id', organizationId)
      .eq('account_type', 'organization')
      .single()

    if (orgError || !organization) {
      return Response.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const memberId = params.memberId

    // Verify the member belongs to this organization
    const { data: member, error: memberError } = await supabase
      .from('supporters')
      .select('id, organization_name')
      .eq('id', memberId)
      .eq('account_type', 'individual')
      .single()

    if (memberError || !member) {
      return Response.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    if (member.organization_name !== organization.organization_name) {
      return Response.json(
        { error: 'Unauthorized to remove this member' },
        { status: 403 }
      )
    }

    // Remove the member (soft delete by setting status to inactive)
    const { error: deleteError } = await supabase
      .from('supporters')
      .update({ status: 'inactive' })
      .eq('id', memberId)

    if (deleteError) {
      console.error('Error removing member:', deleteError)
      return Response.json(
        { error: 'Failed to remove member' },
        { status: 500 }
      )
    }

    return Response.json(
      { success: true, message: 'Member removed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
