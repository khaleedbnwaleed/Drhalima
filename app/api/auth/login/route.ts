import { authenticateUser } from '@/lib/auth'
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

    console.log('Login attempt for:', email)
    
    const user = await authenticateUser(email, password)

    if (!user) {
      console.log('Authentication failed for:', email)
      return Response.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      )
    }

    console.log('Authentication successful for:', email)

    // Create session (simplified - in production use proper session management)
    const cookieStore = await cookies()
    cookieStore.set('adminToken', JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 7, // 7 days
    })

    return Response.json(
      { success: true, user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role } },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
