import { supabase } from '@/lib/supabase';
import { formatPhoneNumber } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const { email, phone, supporterId } = await request.json();

    if (!email && !phone && !supporterId) {
      return Response.json(
        { error: 'Provide email, phone number, or supporter ID to verify.' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('supporters')
      .select('supporter_id, first_name, last_name, email, phone, state, lga, ward, profile_photo_url, qr_code_url')
      .maybeSingle();

    if (supporterId) {
      query = query.eq('supporter_id', supporterId.trim());
    } else if (email) {
      query = query.eq('email', email.trim().toLowerCase());
    } else if (phone) {
      query = query.eq('phone', formatPhoneNumber(phone.trim()));
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supporter verify error:', error);
      return Response.json({ error: 'Unable to verify member at this time.' }, { status: 500 });
    }

    if (!data) {
      return Response.json({ found: false }, { status: 200 });
    }

    return Response.json({ found: true, supporter: data }, { status: 200 });
  } catch (error) {
    console.error('Verify route error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
