import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, location, volunteerType, skills } = body

    // Validate input
    if (!firstName || !lastName || !email || !phone || !location || !volunteerType) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('volunteers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('volunteers')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          location,
          volunteer_type: volunteerType,
          skills: skills || null,
          status: 'pending',
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to register volunteer' },
        { status: 500 }
      )
    }

    // TODO: Send email confirmation using Resend
    // const emailResult = await resend.emails.send({
    //   from: 'noreply@halima2025.ng',
    //   to: email,
    //   subject: 'Volunteer Registration Confirmed - Halima 2025',
    //   html: `<p>Thank you for volunteering with us! Your application is being reviewed.</p>`
    // })

    return Response.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase.from('volunteers').select('*')

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return Response.json(
        { error: 'Failed to fetch volunteers' },
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
