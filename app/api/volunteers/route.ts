import { supabase } from '@/lib/supabase'
import { validateNigerianPhone, validateEmail } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, location, volunteerType, skills } = body

    // ========== VALIDATION ==========
    const errors: Record<string, string> = {}

    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters'
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters'
    }

    if (!email || !validateEmail(email)) {
      errors.email = 'Valid email is required'
    }

    if (!phone || !validateNigerianPhone(phone)) {
      errors.phone = 'Valid Nigerian phone number is required'
    }

    if (!location || location.trim().length < 2) {
      errors.location = 'Location is required'
    }

    if (!volunteerType || volunteerType.trim().length === 0) {
      errors.volunteerType = 'Please select a volunteer type'
    }

    if (Object.keys(errors).length > 0) {
      return Response.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // ========== CHECK FOR DUPLICATES ==========
    const { data: existing } = await supabase
      .from('volunteers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return Response.json(
        { error: 'Email already registered as a volunteer' },
        { status: 409 }
      )
    }

    // ========== INSERT INTO DATABASE ==========
    const { data, error } = await supabase
      .from('volunteers')
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.toLowerCase(),
          phone: phone,
          location: location.trim(),
          volunteer_type: volunteerType,
          skills: skills || null,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to register volunteer. Please try again.' },
        { status: 500 }
      )
    }

    // TODO: Send email confirmation using Resend
    // const emailResult = await resend.emails.send({...})

    return Response.json(
      {
        success: true,
        message: 'Volunteer registered successfully! We will contact you shortly.',
        data: data
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error. Please try again.' },
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
