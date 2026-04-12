import { supabase } from '@/lib/supabase';
import {
  generateSupporterID,
  validateNigerianPhone,
  validateEmail,
  validatePVCNumber,
  formatPhoneNumber,
} from '@/lib/validation';
import { generateSupporterQRCode } from '@/lib/qrcode-service';

/**
 * POST /api/supporters - Register a new supporter
 * Includes: QR code generation, profile photo upload
 */
export async function POST(request: Request) {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') ||
        supabaseKey.includes('placeholder')) {
      console.error('Supabase configuration missing:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
      return Response.json(
        {
          error: 'Database not configured',
          details: 'Supabase environment variables are not set up. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your deployment environment.'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      state,
      lga,
      ward,
      address,
      pvcNumber,
      occupation,
      profilePhoto, // Base64 encoded photo
    } = body;

    // ========== VALIDATION ==========
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

    if (!state || state.trim().length === 0) {
      errors.state = 'State is required';
    }

    if (!lga || lga.trim().length === 0) {
      errors.lga = 'LGA is required';
    }

    if (!ward || ward.trim().length === 0) {
      errors.ward = 'Ward is required';
    }

    if (pvcNumber && !validatePVCNumber(pvcNumber)) {
      errors.pvcNumber = 'Invalid PVC number format (should be 14 digits)';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // ========== CHECK FOR DUPLICATES ==========
    const { data: existing } = await supabase
      .from('supporters')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return Response.json(
        { error: 'Email already registered as a supporter' },
        { status: 409 }
      );
    }

    // ========== GENERATE SUPPORTER ID ==========
    const supporterId = generateSupporterID();

    // ========== GENERATE QR CODE ==========
    let qrCodeUrl = '';
    try {
      qrCodeUrl = await generateSupporterQRCode(supporterId, email);
    } catch (qrError) {
      console.error('QR code generation failed:', qrError);
      // Continue without QR code - don't block registration
    }

    // ========== UPLOAD PROFILE PHOTO IF PROVIDED ==========
    let profilePhotoUrl = '';
    const photoBucket = process.env.STORAGE_BUCKET_SUPPORTER_PHOTOS || 'supporter-photos';

    if (profilePhoto) {
      try {
        const base64Data = profilePhoto.split(',')[1] || profilePhoto;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `supporters/${supporterId}-${Date.now()}.jpg`;

        const { data, error: uploadError } = await supabase.storage
          .from(photoBucket)
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && data) {
          const { data: urlData, error: publicUrlError } = supabase.storage
            .from(photoBucket)
            .getPublicUrl(fileName);

          if (urlData?.publicUrl) {
            profilePhotoUrl = urlData.publicUrl;
          } else {
            console.warn('Public URL not available; attempting signed URL', publicUrlError);
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from(photoBucket)
              .createSignedUrl(fileName, 60 * 60);

            if (signedUrlData?.signedUrl) {
              profilePhotoUrl = signedUrlData.signedUrl;
            } else {
              console.error('Signed URL creation failed:', signedUrlError);
            }
          }
        } else if (uploadError) {
          console.error('Photo upload error:', uploadError.message || uploadError);
        }
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
        // Continue without photo
      }
    }

    // ========== INSERT INTO DATABASE ==========
    const formattedPhone = formatPhoneNumber(phone);

    const { data: newSupporter, error: insertError } = await supabase
      .from('supporters')
      .insert([
        {
          supporter_id: supporterId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.toLowerCase(),
          phone: formattedPhone,
          date_of_birth: dateOfBirth || null,
          state: state.trim(),
          lga: lga.trim(),
          ward: ward.trim(),
          address: address || null,
          pvc_number: pvcNumber || null,
          voter_status: pvcNumber ? 'verified' : 'unverified',
          occupation: occupation || null,
          profile_photo_url: profilePhotoUrl || null,
          qr_code_url: qrCodeUrl || null,
          support_status: 'undecided',
        },
      ])
      .select('id, supporter_id, email, phone, first_name, last_name, lga, ward');

    if (insertError) {
      console.error('Database insert error:', insertError);
      return Response.json(
        { error: 'Failed to register supporter', details: insertError.message || insertError },
        { status: 500 }
      );
    }

    if (!newSupporter || newSupporter.length === 0) {
      console.error('Database insert returned no new supporter');
      return Response.json(
        { error: 'Failed to register supporter', details: 'No supporter returned after insert' },
        { status: 500 }
      );
    }

    const supporter = newSupporter[0];

    // ========== CREATE VOTER TRACKING ENTRY ==========
    try {
      await supabase.from('voter_tracking').insert([
        {
          supporter_id: supporter.id,
          lga: lga.trim(),
          ward: ward.trim(),
          support_status: 'undecided',
        },
      ]);
    } catch (trackingError) {
      console.error('Voter tracking creation failed:', trackingError);
      // Don't fail registration if tracking fails
    }

    return Response.json(
      {
        success: true,
        supporter: {
          id: supporter.id,
          supporterId: supporter.supporter_id,
          firstName: supporter.first_name,
          lastName: supporter.last_name,
          email: supporter.email,
          phone: supporter.phone,
          lga: supporter.lga,
          ward: supporter.ward,
          photoUrl: profilePhotoUrl || null,
      },
        qrCodeUrl: qrCodeUrl || null,
        message: 'Supporter registered successfully!',
      },
    { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/supporters - Get all supporters (admin only)
 * Supports filtering by LGA, Ward, Support Status, and pagination
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lga = searchParams.get('lga');
    const ward = searchParams.get('ward');
    const supportStatus = searchParams.get('support_status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase.from('supporters').select('*');

    if (lga) {
      query = query.eq('lga', lga);
    }
    if (ward) {
      query = query.eq('ward', ward);
    }
    if (supportStatus) {
      query = query.eq('support_status', supportStatus);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: 'Failed to fetch supporters' }, { status: 500 });
    }

    return Response.json({ data, page, limit }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
