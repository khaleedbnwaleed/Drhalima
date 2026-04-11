import { supabase } from '@/lib/supabase';

/**
 * POST /api/admin/voter-tracking - Create or update voter tracking record
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      supporterId,
      supportStatus,
      lastContactDate,
      contactMethod,
      contactNotes,
      volunteerId,
    } = body;

    // Check if tracking record already exists
    const { data: existing } = await supabase
      .from('voter_tracking')
      .select('id')
      .eq('supporter_id', supporterId)
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('voter_tracking')
        .update({
          support_status: supportStatus,
          last_contact_date: lastContactDate,
          contact_method: contactMethod,
          contact_notes: contactNotes,
          volunteer_id: volunteerId,
          updated_at: new Date().toISOString(),
        })
        .eq('supporter_id', supporterId)
        .select();

      if (error) {
        return Response.json(
          { error: 'Failed to update tracking record' },
          { status: 500 }
        );
      }

      return Response.json(
        { success: true, tracking: data[0], isUpdate: true },
        { status: 200 }
      );
    } else {
      // Get supporter to get LGA/Ward
      const { data: supporter } = await supabase
        .from('supporters')
        .select('lga, ward')
        .eq('id', supporterId)
        .single();

      if (!supporter) {
        return Response.json(
          { error: 'Supporter not found' },
          { status: 404 }
        );
      }

      // Create new tracking record
      const { data, error } = await supabase
        .from('voter_tracking')
        .insert([
          {
            supporter_id: supporterId,
            lga: supporter.lga,
            ward: supporter.ward,
            support_status: supportStatus || 'undecided',
            last_contact_date: lastContactDate,
            contact_method: contactMethod,
            contact_notes: contactNotes,
            volunteer_id: volunteerId,
          },
        ])
        .select();

      if (error) {
        return Response.json(
          { error: 'Failed to create tracking record' },
          { status: 500 }
        );
      }

      return Response.json(
        { success: true, tracking: data[0], isUpdate: false },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/voter-tracking - Get voter tracking records with filtering
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lga = searchParams.get('lga');
    const ward = searchParams.get('ward');
    const supportStatus = searchParams.get('support_status');
    const volunteerId = searchParams.get('volunteer_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('voter_tracking')
      .select(`
        *,
        supporter:supporters(first_name, last_name, email, phone, state, lga, ward, occupation),
        volunteer:volunteers(first_name, last_name, volunteer_role)
      `);

    if (lga) query = query.eq('lga', lga);
    if (ward) query = query.eq('ward', ward);
    if (supportStatus) query = query.eq('support_status', supportStatus);
    if (volunteerId) query = query.eq('volunteer_id', volunteerId);

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('updated_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return Response.json(
        { error: 'Failed to fetch tracking records' },
        { status: 500 }
      );
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

/**
 * GET /api/admin/voter-tracking/stats - Get ward-level statistics
 */
export async function statsHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lga = searchParams.get('lga');
    const ward = searchParams.get('ward');

    let query = supabase
      .from('voter_tracking')
      .select('support_status', { count: 'exact' });

    if (lga) query = query.eq('lga', lga);
    if (ward) query = query.eq('ward', ward);

    const { data: allRecords, error } = await query;

    if (error) {
      return Response.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const stats = {
      total: allRecords?.length || 0,
      strong_supporters: allRecords?.filter((r: any) => r.support_status === 'strong_supporter').length || 0,
      undecided: allRecords?.filter((r: any) => r.support_status === 'undecided').length || 0,
      opponents: allRecords?.filter((r: any) => r.support_status === 'opponent').length || 0,
      not_contacted: allRecords?.filter((r: any) => r.support_status === 'not_contacted').length || 0,
    };

    return Response.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
