import { supabase } from '@/lib/supabase';
import { generateSupporterID, validateNigerianPhone, validateEmail, formatPhoneNumber } from '@/lib/validation';
import { generateSupporterQRCode } from '@/lib/qrcode-service';

/**
 * GET /api/admin/members - Get all members with filtering and pagination
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const lga = searchParams.get('lga');
    const ward = searchParams.get('ward');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase.from('supporters').select('*');

    if (status) {
      query = query.eq('support_status', status);
    }
    if (lga) {
      query = query.ilike('lga', `%${lga}%`);
    }
    if (ward) {
      query = query.ilike('ward', `%${ward}%`);
    }
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,supporter_id.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
    }

    return Response.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/members - Add a new member manually (admin only)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      state,
      lga,
      ward,
      address,
      pvcNumber,
      occupation,
      supportStatus,
      profilePhoto,
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (!email || !validateEmail(email)) {
      errors.email = 'Valid email is required';
    }
    if (!phone || !validateNigerianPhone(phone)) {
      errors.phone = 'Valid Nigerian phone number is required';
    }
    if (!state) {
      errors.state = 'State is required';
    }
    if (!lga) {
      errors.lga = 'LGA is required';
    }
    if (!ward) {
      errors.ward = 'Ward is required';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // Check for duplicates
    const { data: existing } = await supabase
      .from('supporters')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Generate supporter ID and QR code
    const supporterId = generateSupporterID();
    let qrCodeUrl = '';
    try {
      qrCodeUrl = await generateSupporterQRCode(supporterId, email);
    } catch (qrError) {
      console.error('QR code generation failed:', qrError);
    }

    // Upload profile photo if provided
    let profilePhotoUrl = '';
    if (profilePhoto) {
      try {
        const base64Data = profilePhoto.split(',')[1] || profilePhoto;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `supporters/${supporterId}-${Date.now()}.jpg`;

        const { data, error: uploadError } = await supabase.storage
          .from('supporter-photos')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && data) {
          const { data: urlData } = supabase.storage
            .from('supporter-photos')
            .getPublicUrl(fileName);
          profilePhotoUrl = urlData.publicUrl;
        }
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
      }
    }

    // Insert member
    const formattedPhone = formatPhoneNumber(phone);
    const { data: newMember, error: insertError } = await supabase
      .from('supporters')
      .insert([
        {
          supporter_id: supporterId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.toLowerCase(),
          phone: formattedPhone,
          state: state.trim(),
          lga: lga.trim(),
          ward: ward.trim(),
          address: address || null,
          pvc_number: pvcNumber || null,
          voter_status: pvcNumber ? 'verified' : 'unverified',
          occupation: occupation || null,
          profile_photo_url: profilePhotoUrl || null,
          qr_code_url: qrCodeUrl || null,
          support_status: supportStatus || 'undecided',
        },
      ])
      .select();

    if (insertError) {
      return Response.json({ error: 'Failed to add member' }, { status: 500 });
    }

    // Create voter tracking entry
    try {
      await supabase.from('voter_tracking').insert([
        {
          supporter_id: newMember[0].id,
          lga: lga.trim(),
          ward: ward.trim(),
          support_status: supportStatus || 'undecided',
        },
      ]);
    } catch (trackingError) {
      console.error('Voter tracking creation failed:', trackingError);
    }

    return Response.json({
      success: true,
      member: newMember[0],
      message: 'Member added successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}