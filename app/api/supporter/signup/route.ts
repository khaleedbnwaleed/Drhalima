import { supabase } from '@/lib/supabase'
import * as bcrypt from 'bcryptjs'
import { generateSupporterID } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      organizationName, 
      email, 
      password, 
      contactPerson, 
      phone, 
      address 
    } = body

    // Validation
    if (!organizationName || !email || !password) {
      return Response.json(
        { error: 'Organization name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingSupporter } = await supabase
      .from('supporters')
      .select('id')
      .eq('email', email)
      .single()

    if (existingSupporter) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate unique supporter ID
    const supporterId = generateSupporterID()

    // Create organization supporter record
    const { data: newSupporter, error: createError } = await supabase
      .from('supporters')
      .insert([
        {
          supporter_id: supporterId,
          first_name: contactPerson?.split(' ')[0] || organizationName,
          last_name: contactPerson?.split(' ').slice(1).join(' ') || 'Organization',
          email,
          phone: phone || '',
          state: 'National', // Organizations can be national
          lga: 'Supporter Organization',
          ward: 'Organization',
          organization_name: organizationName,
          password_hash: passwordHash,
          contact_person: contactPerson || null,
          address: address || null,
          account_type: 'organization',
          support_status: 'strong_supporter',
          status: 'active',
        }
      ])
      .select()

    if (createError) {
      console.error('Database error:', JSON.stringify(createError, null, 2))
      return Response.json(
        { 
          error: 'Failed to create account. Please try again.',
          details: createError.message,
          code: createError.code
        },
        { status: 500 }
      )
    }

    return Response.json(
      { 
        success: true, 
        message: 'Account created successfully. Please sign in.',
        organization: {
          id: newSupporter[0].id,
          email: newSupporter[0].email,
          organizationName: newSupporter[0].organization_name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
