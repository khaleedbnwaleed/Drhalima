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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read CSV content
    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return Response.json(
        { error: 'CSV file must contain at least a header row and one data row' },
        { status: 400 }
      )
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const expectedHeaders = ['first_name', 'last_name', 'email', 'phone', 'state', 'lga', 'ward', 'support_status']

    // Check if headers match expected format
    const headerMatch = expectedHeaders.every(header => headers.includes(header))
    if (!headerMatch) {
      return Response.json(
        {
          error: 'Invalid CSV format. Expected headers: first_name,last_name,email,phone,state,lga,ward,support_status'
        },
        { status: 400 }
      )
    }

    const members = []
    const errors = []

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())

      if (values.length !== 8) {
        errors.push(`Row ${i + 1}: Invalid number of columns`)
        continue
      }

      const [first_name, last_name, email, phone, state, lga, ward, support_status] = values

      // Validate required fields
      if (!first_name || !last_name || !email || !phone || !state || !lga) {
        errors.push(`Row ${i + 1}: Missing required fields`)
        continue
      }

      // Validate email
      if (!validateEmail(email)) {
        errors.push(`Row ${i + 1}: Invalid email format`)
        continue
      }

      // Check if member already exists
      const { data: existingMember } = await supabase
        .from('supporters')
        .select('id')
        .eq('email', email)
        .eq('organization_name', organization.organization_name)
        .single()

      if (existingMember) {
        errors.push(`Row ${i + 1}: Member with email ${email} already exists`)
        continue
      }

      members.push({
        supporter_id: generateSupporterID(),
        first_name,
        last_name,
        email,
        phone: formatPhoneNumber(phone),
        state,
        lga,
        ward: ward || '',
        organization_name: organization.organization_name,
        account_type: 'individual',
        support_status: support_status || 'supporter',
        status: 'active',
      })
    }

    if (members.length === 0) {
      return Response.json(
        { error: 'No valid members to upload', details: errors },
        { status: 400 }
      )
    }

    // Insert members in batches
    const batchSize = 10
    let successful = 0
    let failed = 0

    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize)

      const { error: insertError } = await supabase
        .from('supporters')
        .insert(batch)

      if (insertError) {
        console.error('Batch insert error:', insertError)
        failed += batch.length
      } else {
        successful += batch.length
      }
    }

    return Response.json(
      {
        success: true,
        message: `Bulk upload completed`,
        successful,
        failed: failed + errors.length,
        total: members.length + errors.length,
        errors: errors.length > 0 ? errors : undefined
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Bulk upload error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
