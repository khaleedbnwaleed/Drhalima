import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * PUT /api/admin/volunteers/[id] - Update volunteer status or assignment
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const body = await request.json();
    const { status, assignedLga, assignedWard, volunteerRole } = body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (status) updates.status = status;
    if (assignedLga) updates.assigned_lga = assignedLga;
    if (assignedWard) updates.assigned_ward = assignedWard;
    if (volunteerRole) updates.volunteer_role = volunteerRole;

    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .eq('id', params.id)
      .select();

    if (error) {
      return Response.json({ error: 'Failed to update volunteer' }, { status: 500 });
    }

    return Response.json({ success: true, volunteer: data[0] }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/volunteers/[id] - Get single volunteer details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return Response.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}