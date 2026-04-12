import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/admin/members/[id] - Get member details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const { data, error } = await supabase
      .from('supporters')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/members/[id] - Update member status or information
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const body = await request.json();
    const { supportStatus, firstName, lastName, phone, lga, ward, occupation } = body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (supportStatus) updates.support_status = supportStatus;
    if (firstName) updates.first_name = firstName.trim();
    if (lastName) updates.last_name = lastName.trim();
    if (phone) updates.phone = phone;
    if (lga) updates.lga = lga.trim();
    if (ward) updates.ward = ward.trim();
    if (occupation !== undefined) updates.occupation = occupation;

    const { data, error } = await supabase
      .from('supporters')
      .update(updates)
      .eq('id', params.id)
      .select();

    if (error) {
      return Response.json({ error: 'Failed to update member' }, { status: 500 });
    }

    // Update voter tracking if support status changed
    if (supportStatus) {
      try {
        await supabase
          .from('voter_tracking')
          .update({ support_status: supportStatus })
          .eq('supporter_id', params.id);
      } catch (trackingError) {
        console.error('Voter tracking update failed:', trackingError);
      }
    }

    return Response.json({
      success: true,
      member: data[0],
      message: 'Member updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/members/[id] - Delete a member
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    // Delete from voter_tracking first
    await supabase
      .from('voter_tracking')
      .delete()
      .eq('supporter_id', params.id);

    // Delete the member
    const { error } = await supabase
      .from('supporters')
      .delete()
      .eq('id', params.id);

    if (error) {
      return Response.json({ error: 'Failed to delete member' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Member deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}