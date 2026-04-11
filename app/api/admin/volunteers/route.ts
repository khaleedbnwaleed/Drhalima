import { supabase } from '@/lib/supabase';
import {
  validateNigerianPhone,
  validateEmail,
  formatPhoneNumber,
} from '@/lib/validation';

/**
 * POST /api/admin/volunteers - Register a volunteer with enhanced role and assignment features
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      volunteerRole, // Field Agent, Media, Polling Unit Agent
      assignedLga,
      assignedWard,
      availability, // full_time, part_time, weekends_only
      availabilityHours, // JSON with detailed hours
      emergencyContact,
      passportPhoto, // Base64
      skills,
    } = body;

    // ========== VALIDATION ==========
    const errors: Record<string, string> = {};

    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = 'First name is required';
    }
    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = 'Last name is required';
    }
    if (!email || !validateEmail(email)) {
      errors.email = 'Valid email is required';
    }
    if (!phone || !validateNigerianPhone(phone)) {
      errors.phone = 'Valid phone number is required';
    }
    if (!volunteerRole) {
      errors.volunteerRole = 'Volunteer role is required';
    }
    if (!assignedLga) {
      errors.assignedLga = 'Assigned LGA is required';
    }
    if (!assignedWard) {
      errors.assignedWard = 'Assigned Ward is required';
    }
    if (!availability) {
      errors.availability = 'Availability is required';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // Check for duplicates
    const { data: existing } = await supabase
      .from('volunteers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return Response.json(
        { error: 'Email already registered as a volunteer' },
        { status: 409 }
      );
    }

    // ========== UPLOAD PASSPORT PHOTO ==========
    let passportPhotoUrl = '';
    if (passportPhoto) {
      try {
        const base64Data = passportPhoto.split(',')[1] || passportPhoto;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `volunteers/${email}-${Date.now()}.jpg`;

        const { data, error: uploadError } = await supabase.storage
          .from('volunteer-photos')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && data) {
          const { data: urlData } = supabase.storage
            .from('volunteer-photos')
            .getPublicUrl(fileName);
          passportPhotoUrl = urlData.publicUrl;
        }
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
      }
    }

    // ========== INSERT VOLUNTEER ==========
    const formattedPhone = formatPhoneNumber(phone);

    const { data: newVolunteer, error: insertError } = await supabase
      .from('volunteers')
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.toLowerCase(),
          phone: formattedPhone,
          location: assignedWard,
          volunteer_type: volunteerRole, // Keep for backward compatibility
          volunteer_role: volunteerRole,
          assigned_lga: assignedLga,
          assigned_ward: assignedWard,
          availability,
          availability_hours: availabilityHours,
          emergency_contact: emergencyContact,
          passport_photo_url: passportPhotoUrl,
          skills: skills || null,
          status: 'pending',
        },
      ])
      .select();

    if (insertError) {
      return Response.json(
        { error: 'Failed to register volunteer' },
        { status: 500 }
      );
    }

    const volunteer = newVolunteer[0];

    return Response.json(
      {
        success: true,
        volunteer: {
          id: volunteer.id,
          email: volunteer.email,
          role: volunteer.volunteer_role,
          status: volunteer.status,
        },
        message: 'Volunteer registered successfully. Awaiting admin approval.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/volunteers - Fetch volunteers with filtering and pagination
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const lga = searchParams.get('lga');
    const ward = searchParams.get('ward');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase.from('volunteers').select('*');

    if (role) query = query.eq('volunteer_role', role);
    if (lga) query = query.eq('assigned_lga', lga);
    if (ward) query = query.eq('assigned_ward', ward);
    if (status) query = query.eq('status', status);

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
    }

    return Response.json({ data, page, limit }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
