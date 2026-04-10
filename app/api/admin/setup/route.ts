import { supabase } from '@/lib/supabase'
import * as bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'setup-admin') {
      // Hash password "admin123"
      const passwordHash = await bcrypt.hash('admin123', 12)
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@drhalimasulaiman.ng')
        .single()

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            password_hash: passwordHash,
            full_name: 'System Administrator',
            role: 'admin'
          })
          .eq('email', 'admin@drhalimasulaiman.ng')
          .select()

        if (error) {
          return Response.json({ error: error.message }, { status: 500 })
        }

        return Response.json({
          success: true,
          message: 'Admin user updated',
          user: data[0]
        })
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert([{
            email: 'admin@drhalimasulaiman.ng',
            password_hash: passwordHash,
            full_name: 'System Administrator',
            role: 'admin'
          }])
          .select()

        if (error) {
          return Response.json({ error: error.message }, { status: 500 })
        }

        return Response.json({
          success: true,
          message: 'Admin user created',
          user: data[0]
        })
      }
    }

    if (action === 'check-admin') {
      // Check if admin user exists
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@drhalimasulaiman.ng')
        .single()

      if (error) {
        return Response.json({
          exists: false,
          message: 'Admin user not found',
          error: error.message
        })
      }

      return Response.json({
        exists: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          created_at: user.created_at
        }
      })
    }

    if (action === 'test-password') {
      const { password, hash } = body

      if (!password || !hash) {
        return Response.json({
          error: 'Password and hash are required'
        }, { status: 400 })
      }

      const isMatch = await bcrypt.compare(password, hash)

      return Response.json({
        passwordMatches: isMatch,
        testPassword: password,
        testHash: hash.substring(0, 20) + '...'
      })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Debug API error:', error)
    return Response.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
