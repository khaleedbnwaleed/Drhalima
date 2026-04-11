import { supabase } from '@/lib/supabase'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Fetch organization supporter from database
    const { data: supporter, error: fetchError } = await supabase
      .from('supporters')
      .select('*')
      .eq('email', email)
      .eq('account_type', 'organization')
      .single()

    if (fetchError || !supporter) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password (handle both old supporters without password_hash and new ones)
    if (!supporter.password_hash) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const passwordValid = await bcrypt.compare(password, supporter.password_hash)

    if (!passwordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set('supporterToken', JSON.stringify({
      id: supporter.id,
      email: supporter.email,
      organizationName: supporter.organization_name,
      role: 'supporter',
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 7, // 7 days
    })

    return Response.json(
      { 
        success: true, 
        supporter: { 
          id: supporter.id, 
          email: supporter.email, 
          organizationName: supporter.organization_name,
          role: 'supporter' 
        } 
      },
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
