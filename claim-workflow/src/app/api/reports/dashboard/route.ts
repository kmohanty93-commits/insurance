import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/reports/dashboard - Dashboard summary data
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Get claims count by status
    const { data: claimsByStatus } = await supabase
      .from('claims')
      .select('status')
      .gte('created_at', dateFrom.toISOString());

    const statusCounts: Record<string, number> = {};
    claimsByStatus?.forEach(claim => {
      statusCounts[claim.status] = (statusCounts[claim.status] || 0) + 1;
    });

    // Get claims count by LOB
    const { data: claimsByLOB } = await supabase
      .from('claims')
      .select('line_of_business, estimated_loss, reserve_amount')
      .gte('created_at', dateFrom.toISOString());

    const lobStats: Record<string, { count: number; estimated_loss: number; reserve_amount: number }> = {};
    claimsByLOB?.forEach(claim => {
      if (!lobStats[claim.line_of_business]) {
        lobStats[claim.line_of_business] = { count: 0, estimated_loss: 0, reserve_amount: 0 };
      }
      lobStats[claim.line_of_business].count++;
      lobStats[claim.line_of_business].estimated_loss += claim.estimated_loss || 0;
      lobStats[claim.line_of_business].reserve_amount += claim.reserve_amount || 0;
    });

    // Get total financial summary
    const { data: financialSummary } = await supabase
      .from('claims')
      .select('estimated_loss, reserve_amount, actual_payment, recovery_amount');

    let totalEstimatedLoss = 0;
    let totalReserve = 0;
    let totalPayment = 0;
    let totalRecovery = 0;

    financialSummary?.forEach(claim => {
      totalEstimatedLoss += claim.estimated_loss || 0;
      totalReserve += claim.reserve_amount || 0;
      totalPayment += claim.actual_payment || 0;
      totalRecovery += claim.recovery_amount || 0;
    });

    // Get overdue tasks count
    const today = new Date().toISOString().split('T')[0];
    const { count: overdueTasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .lt('due_date', today)
      .neq('status', 'completed');

    // Get pending approvals count
    const { count: pendingApprovalsCount } = await supabase
      .from('approvals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:users!audit_logs_user_id_fkey(full_name),
        claim:claims(claim_number)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get total claims count
    const { count: totalClaims } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true });

    // Get open claims count
    const { count: openClaims } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress', 'pending_approval']);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total_claims: totalClaims || 0,
          open_claims: openClaims || 0,
          overdue_tasks: overdueTasksCount || 0,
          pending_approvals: pendingApprovalsCount || 0,
        },
        financials: {
          total_estimated_loss: totalEstimatedLoss,
          total_reserve: totalReserve,
          total_payment: totalPayment,
          total_recovery: totalRecovery,
          net_incurred: totalPayment + totalReserve - totalRecovery,
        },
        claims_by_status: statusCounts,
        claims_by_lob: lobStats,
        recent_activity: recentActivity,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
