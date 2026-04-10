import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate input
    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          subject,
          message,
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    // TODO: Send email confirmation using Resend
    // const emailResult = await resend.emails.send({
    //   from: 'noreply@halima2025.ng',
    //   to: email,
    //   subject: 'Message Received - Halima 2025',
    //   html: `<p>Thank you for contacting us. We will respond shortly.</p>`
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
