import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/reports/aging - Aging report data
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
    const status = searchParams.get('status');

    let query = supabase
      .from('claims')
      .select('*')
      .in('status', ['open', 'in_progress', 'pending_approval']);

    // Apply filters
    if (lob) {
      query = query.eq('line_of_business', lob);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: claims, error } = await query;

    if (error) throw error;

    const today = new Date();
    
    // Define aging buckets
    const agingBuckets = {
      '0-30 days': { count: 0, reserve: 0, claims: [] as typeof claims },
      '31-60 days': { count: 0, reserve: 0, claims: [] as typeof claims },
      '61-90 days': { count: 0, reserve: 0, claims: [] as typeof claims },
      '91-180 days': { count: 0, reserve: 0, claims: [] as typeof claims },
      '180+ days': { count: 0, reserve: 0, claims: [] as typeof claims },
    };

    claims?.forEach(claim => {
      const createdDate = new Date(claim.created_at);
      const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let bucket: keyof typeof agingBuckets;
      if (daysDiff <= 30) bucket = '0-30 days';
      else if (daysDiff <= 60) bucket = '31-60 days';
      else if (daysDiff <= 90) bucket = '61-90 days';
      else if (daysDiff <= 180) bucket = '91-180 days';
      else bucket = '180+ days';

      agingBuckets[bucket].count++;
      agingBuckets[bucket].reserve += claim.reserve_amount || 0;
      agingBuckets[bucket].claims!.push({
        ...claim,
        days_open: daysDiff,
      });
    });

    // Calculate summary
    const summary = {
      total_claims: claims?.length || 0,
      total_reserve: claims?.reduce((sum, c) => sum + (c.reserve_amount || 0), 0) || 0,
      avg_age: claims && claims.length > 0
        ? Math.round(claims.reduce((sum, c) => {
            const days = Math.floor((today.getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / claims.length)
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        buckets: Object.entries(agingBuckets).map(([range, data]) => ({
          range,
          count: data.count,
          reserve: data.reserve,
          claims: data.claims,
        })),
        summary,
      },
    });
  } catch (error) {
    console.error('Error fetching aging report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch aging report' },
      { status: 500 }
    );
  }
}
