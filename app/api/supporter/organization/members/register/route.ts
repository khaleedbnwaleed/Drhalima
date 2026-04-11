import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { generateSupporterID, formatPhoneNumber, validateEmail } from '@/lib/validation'

export async function POST(request: Request) {
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

    const body = await request.json()
    const {
      first_name,
      last_name,
      email,
      phone,
      state,
      lga,
      ward,
      support_status = 'supporter',
    } = body

    // Validate required fields
    if (!first_name || !last_name || !email || !phone || !state || !lga) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email
    if (!validateEmail(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate supporter ID
    const supporterId = generateSupporterID()

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone)

    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('supporters')
      .select('id')
      .eq('email', email)
      .eq('organization_name', organization.organization_name)
      .single()

    if (existingMember) {
      return Response.json(
        { error: 'Member with this email already registered' },
        { status: 409 }
      )
    }

    // Create member record
    const { data: newMember, error: createError } = await supabase
      .from('supporters')
      .insert([
        {
          supporter_id: supporterId,
          first_name,
          last_name,
          email,
          phone: formattedPhone,
          state,
          lga,
          ward: ward || '',
          organization_name: organization.organization_name,
          account_type: 'individual',
          support_status,
          status: 'active',
        },
      ])
      .select()

    if (createError) {
      console.error('Error creating member:', createError)
      return Response.json(
        {
          error: 'Failed to register member',
          details: createError.message,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Member registered successfully',
        member: {
          id: newMember[0].id,
          supporter_id: supporterId,
          first_name,
          last_name,
          email,
          phone: formattedPhone,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : '',
      },
      { status: 500 }
    )
  }
}
