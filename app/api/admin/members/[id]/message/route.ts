import { supabase } from '@/lib/supabase';

/**
 * POST /api/admin/members/[id]/message - Send a message to a specific member
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { subject, message, messageType = 'direct' } = body;

    if (!subject || !message) {
      return Response.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Get member details
    const { data: member, error: memberError } = await supabase
      .from('supporters')
      .select('id, first_name, last_name, email, phone')
      .eq('id', params.id)
      .single();

    if (memberError || !member) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    // Create message record
    const { data: messageRecord, error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          recipient_id: member.id,
          recipient_type: 'member',
          subject: subject.trim(),
          message: message.trim(),
          message_type: messageType,
          status: 'sent',
          sent_at: new Date().toISOString(),
        },
      ])
      .select();

    if (messageError) {
      return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Here you could integrate with an email service or SMS service
    // For now, we'll just log the message as sent

    return Response.json({
      success: true,
      message: 'Message sent successfully',
      messageId: messageRecord[0].id,
      recipient: `${member.first_name} ${member.last_name}`
    }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}