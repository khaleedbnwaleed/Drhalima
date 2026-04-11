// Audit logging service for tracking admin actions
import { supabase } from './supabase';

interface AuditLogEntry {
  userId: string;
  action: string;
  tableNam: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an admin action for audit trail
 */
export async function logAuditTrail(entry: AuditLogEntry): Promise<void> {
  try {
    await supabase.from('audit_logs').insert([
      {
        user_id: entry.userId,
        action: entry.action,
        table_name: entry.tableNam,
        record_id: entry.recordId,
        old_values: entry.oldValues,
        new_values: entry.newValues,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
      },
    ]);
  } catch (error) {
    console.error('Failed to log audit trail:', error);
  }
}

/**
 * Log supporter registration
 */
export async function logSupporterRegistration(
  supporterId: string,
  userId: string,
  supporterData: Record<string, any>
): Promise<void> {
  await logAuditTrail({
    userId,
    action: 'supporter_registration',
    tableNam: 'supporters',
    recordId: supporterId,
    newValues: {
      ...supporterData,
      password_hash: '[REDACTED]',
    },
  });
}

/**
 * Log volunteer registration
 */
export async function logVolunteerRegistration(
  volunteerId: string,
  userId: string,
  volunteerData: Record<string, any>
): Promise<void> {
  await logAuditTrail({
    userId,
    action: 'volunteer_registration',
    tableNam: 'volunteers',
    recordId: volunteerId,
    newValues: volunteerData,
  });
}

/**
 * Log volunteer approval/rejection
 */
export async function logVolunteerStatusChange(
  volunteerId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  reason?: string
): Promise<void> {
  await logAuditTrail({
    userId,
    action: `volunteer_${newStatus}`,
    tableNam: 'volunteers',
    recordId: volunteerId,
    oldValues: { status: oldStatus },
    newValues: { status: newStatus, reason },
  });
}

/**
 * Log messaging campaign creation
 */
export async function logMessagingCampaign(
  campaignId: string,
  userId: string,
  campaignData: Record<string, any>,
  recipientCount: number
): Promise<void> {
  await logAuditTrail({
    userId,
    action: 'messaging_campaign_created',
    tableNam: 'messaging_campaigns',
    recordId: campaignId,
    newValues: {
      ...campaignData,
      recipient_count: recipientCount,
    },
  });
}

/**
 * Log data export
 */
export async function logDataExport(
  userId: string,
  exportType: string,
  filters?: Record<string, any>,
  recordCount?: number
): Promise<void> {
  await logAuditTrail({
    userId,
    action: `data_export_${exportType}`,
    tableNam: 'exports',
    newValues: {
      export_type: exportType,
      filters,
      record_count: recordCount,
    },
  });
}

/**
 * Log user login
 */
export async function logUserLogin(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditTrail({
    userId,
    action: 'user_login',
    tableNam: 'users',
    ipAddress,
    userAgent,
  });
}

/**
 * Log user logout
 */
export async function logUserLogout(
  userId: string,
  ipAddress?: string
): Promise<void> {
  await logAuditTrail({
    userId,
    action: 'user_logout',
    tableNam: 'users',
    ipAddress,
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLoginAttempt(
  email: string,
  ipAddress?: string
): Promise<void> {
  await logAuditTrail({
    userId: 'unknown',
    action: 'failed_login_attempt',
    tableNam: 'users',
    newValues: { email },
    ipAddress,
  });
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(userId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}

/**
 * Get all audit logs with filtering
 */
export async function getAuditLogs(
  filters?: {
    action?: string;
    tableName?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }
) {
  try {
    let query = supabase.from('audit_logs').select('*');

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.tableName) {
      query = query.eq('table_name', filters.tableName);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString());
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString());
    }

    const limit = filters?.limit || 1000;
    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}

/**
 * Generate audit report
 */
export async function generateAuditReport(dateRange: {
  from: Date;
  to: Date;
}) {
  try {
    const logs = await getAuditLogs({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      limit: 10000,
    });

    // Group by action
    const byAction = logs?.reduce(
      (acc: Record<string, number>, log: any) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      {}
    );

    // Group by user
    const byUser = logs?.reduce(
      (acc: Record<string, number>, log: any) => {
        acc[log.user_id] = (acc[log.user_id] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      period: {
        from: dateRange.from,
        to: dateRange.to,
      },
      totalActions: logs?.length || 0,
      byAction,
      byUser,
      logs: logs?.slice(0, 100), // Latest 100 logs
    };
  } catch (error) {
    console.error('Failed to generate audit report:', error);
    return null;
  }
}
