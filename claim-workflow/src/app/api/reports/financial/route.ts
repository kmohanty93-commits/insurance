import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/reports/financial - Financial report data
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
    const lob = searchParams.get('lob');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const group_by = searchParams.get('group_by') || 'lob'; // lob, month, status

    let query = supabase
      .from('claims')
      .select('*');

    // Apply filters
    if (lob) {
      query = query.eq('line_of_business', lob);
    }
    if (date_from) {
      query = query.gte('created_at', date_from);
    }
    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    const { data: claims, error } = await query;

    if (error) throw error;

    // Group and aggregate data
    const grouped: Record<string, {
      count: number;
      estimated_loss: number;
      reserve_amount: number;
      actual_payment: number;
      recovery_amount: number;
      net_incurred: number;
    }> = {};

    claims?.forEach(claim => {
      let key: string;
      
      switch (group_by) {
        case 'month':
          const date = new Date(claim.created_at);
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'status':
          key = claim.status;
          break;
        case 'lob':
        default:
          key = claim.line_of_business;
      }

      if (!grouped[key]) {
        grouped[key] = {
          count: 0,
          estimated_loss: 0,
          reserve_amount: 0,
          actual_payment: 0,
          recovery_amount: 0,
          net_incurred: 0,
        };
      }

      grouped[key].count++;
      grouped[key].estimated_loss += claim.estimated_loss || 0;
      grouped[key].reserve_amount += claim.reserve_amount || 0;
      grouped[key].actual_payment += claim.actual_payment || 0;
      grouped[key].recovery_amount += claim.recovery_amount || 0;
      grouped[key].net_incurred = grouped[key].actual_payment + grouped[key].reserve_amount - grouped[key].recovery_amount;
    });

    // Calculate totals
    const totals = {
      count: claims?.length || 0,
      estimated_loss: claims?.reduce((sum, c) => sum + (c.estimated_loss || 0), 0) || 0,
      reserve_amount: claims?.reduce((sum, c) => sum + (c.reserve_amount || 0), 0) || 0,
      actual_payment: claims?.reduce((sum, c) => sum + (c.actual_payment || 0), 0) || 0,
      recovery_amount: claims?.reduce((sum, c) => sum + (c.recovery_amount || 0), 0) || 0,
      net_incurred: 0,
    };
    totals.net_incurred = totals.actual_payment + totals.reserve_amount - totals.recovery_amount;

    return NextResponse.json({
      success: true,
      data: {
        grouped,
        totals,
        group_by,
      },
    });
  } catch (error) {
    console.error('Error fetching financial report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial report' },
      { status: 500 }
    );
  }
}
