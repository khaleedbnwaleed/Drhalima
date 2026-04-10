import { supabase } from '@/lib/supabase';

/**
 * GET /api/admin/dashboard/stats - Get real-time dashboard statistics
 */
export async function GET(request: Request) {
  try {
    // Fetch all statistics in parallel
    const [
      supportersResult,
      volunteersResult,
      donationsResult,
      trackingByStatusResult,
      trackingByLgaResult,
      campaignsResult,
    ] = await Promise.all([
      // Total supporters
      supabase.from('supporters').select('*', { count: 'exact', head: true }),

      // Total volunteers
      supabase
        .from('volunteers')
        .select(
          'volunteer_role, status',
          { count: 'exact' }
        ),

      // Total donations
      supabase.from('donations').select('amount', { count: 'exact' }),

      // Voter tracking by support status
      supabase.from('voter_tracking').select('support_status', { count: 'exact' }),

      // Get LGA statistics (either from ward_statistics or computed on the fly)
      supabase.from('ward_statistics').select('*'),

      // Recent messaging campaigns
      supabase
        .from('messaging_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    // Calculate supporter statistics
    const totalSupporters = supportersResult.count || 0;

    // Get supporter breakdown by support status
    const { data: supportersByStatus } = await supabase
      .from('supporters')
      .select('support_status', { count: 'exact' });

    const supporterStats = {
      strong_supporters: supportersByStatus?.filter((s: any) => s.support_status === 'strong_supporter').length || 0,
      undecided: supportersByStatus?.filter((s: any) => s.support_status === 'undecided').length || 0,
      opponents: supportersByStatus?.filter((s: any) => s.support_status === 'opponent').length || 0,
    };

    // Get volunteer breakdown by role
    const { data: allVolunteers } = await supabase
      .from('volunteers')
      .select('volunteer_role, status');

    const volunteerStats = {
      total: allVolunteers?.length || 0,
      roles: {
        field_agent: allVolunteers?.filter((v: any) => v.volunteer_role === 'Field Agent').length || 0,
        media: allVolunteers?.filter((v: any) => v.volunteer_role === 'Media').length || 0,
        polling_agent: allVolunteers?.filter((v: any) => v.volunteer_role === 'Polling Unit Agent').length || 0,
      },
      by_status: {
        pending: allVolunteers?.filter((v: any) => v.status === 'pending').length || 0,
        approved: allVolunteers?.filter((v: any) => v.status === 'approved').length || 0,
        active: allVolunteers?.filter((v: any) => v.status === 'active').length || 0,
        rejected: allVolunteers?.filter((v: any) => v.status === 'rejected').length || 0,
      },
    };

    // Donations statistics
    const { data: allDonations } = await supabase
      .from('donations')
      .select('amount, currency, payment_status');

    const totalDonated = allDonations?.reduce((sum: number, d: any) => {
      return sum + (d.payment_status === 'completed' ? parseFloat(d.amount) : 0);
    }, 0) || 0;

    const donationStats = {
      total_amount: totalDonated,
      total_transactions: allDonations?.length || 0,
      completed: allDonations?.filter((d: any) => d.payment_status === 'completed').length || 0,
      pending: allDonations?.filter((d: any) => d.payment_status === 'pending').length || 0,
    };

    // Voter tracking statistics
    const { data: allTracking } = await supabase
      .from('voter_tracking')
      .select('support_status, lga, ward');

    const trackingStats = {
      total_tracked: allTracking?.length || 0,
      strong_supporters: allTracking?.filter((t: any) => t.support_status === 'strong_supporter').length || 0,
      undecided: allTracking?.filter((t: any) => t.support_status === 'undecided').length || 0,
      opponents: allTracking?.filter((t: any) => t.support_status === 'opponent').length || 0,
      not_contacted: allTracking?.filter((t: any) => t.support_status === 'not_contacted').length || 0,
    };

    // Get top performing LGAs
    const lgaStats: Record<string, any> = {};
    allTracking?.forEach((record: any) => {
      const key = record.lga;
      if (!lgaStats[key]) {
        lgaStats[key] = {
          lga: key,
          total: 0,
          strong_supporters: 0,
          undecided: 0,
          opponents: 0,
        };
      }
      lgaStats[key].total++;
      if (record.support_status === 'strong_supporter') {
        lgaStats[key].strong_supporters++;
      } else if (record.support_status === 'undecided') {
        lgaStats[key].undecided++;
      } else if (record.support_status === 'opponent') {
        lgaStats[key].opponents++;
      }
    });

    const topLGAs = Object.values(lgaStats)
      .sort((a: any, b: any) => b.strong_supporters - a.strong_supporters)
      .slice(0, 5);

    // Recent campaigns
    const campaignStats = campaignsResult.data?.map((c: any) => ({
      id: c.id,
      name: c.campaign_name,
      status: c.status,
      sent: c.successfully_sent || 0,
      failed: c.failed_count || 0,
      created_at: c.created_at,
    })) || [];

    return Response.json(
      {
        timestamp: new Date().toISOString(),
        summary: {
          total_supporters: totalSupporters,
          total_volunteers: volunteerStats.total,
          total_donations: totalDonated,
          active_campaigns: campaignStats.filter((c: any) => c.status === 'sending').length,
        },
        supporters: supporterStats,
        supporters_total: totalSupporters,
        volunteers: volunteerStats,
        donations: donationStats,
        voter_tracking: trackingStats,
        top_lgas: topLGAs,
        recent_campaigns: campaignStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
