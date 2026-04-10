import { supabase } from '@/lib/supabase';

/**
 * POST /api/admin/messaging/campaigns - Messaging campaigns discontinued
 */
export async function POST(request: Request) {
  return Response.json(
    { error: 'SMS/WhatsApp messaging campaigns have been discontinued. Use email notifications instead.' },
    { status: 410 }
  );
}

/**
 * GET /api/admin/messaging/campaigns - Messaging campaigns discontinued
 */
export async function GET(request: Request) {
  return Response.json(
    { message: 'Messaging campaigns have been discontinued. Use email notifications instead.' },
    { status: 410 }
  );
}
