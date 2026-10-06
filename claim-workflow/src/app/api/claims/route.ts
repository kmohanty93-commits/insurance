import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

type LineOfBusiness = 'property' | 'marine' | 'cyber' | 'cgl' | 'product_recall' | 'product_guarantee';

const LOB_PREFIXES: Record<LineOfBusiness, string> = {
  property: 'PRO',
  marine: 'MAR',
  cyber: 'CYB',
  cgl: 'CGL',
  product_recall: 'PRC',
  product_guarantee: 'PGT',
};

async function generateClaimNumber(lob: LineOfBusiness): Promise<string> {
  const supabase = getSupabaseClient();
  const prefix = LOB_PREFIXES[lob];
  const year = new Date().getFullYear().toString().slice(-2);
  
  // Get the count of claims for this LOB this year
  const { count } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true })
    .like('claim_number', `${prefix}-${year}-%`);
  
  const sequence = String((count || 0) + 1).padStart(5, '0');
  return `${prefix}-${year}-${sequence}`;
}

// GET /api/claims - List all claims with filters
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
    const status = searchParams.get('status');
    const lob = searchParams.get('lob');
    const search = searchParams.get('search');
    const assigned_to = searchParams.get('assigned_to');
    const created_by = searchParams.get('created_by');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('claims')
      .select('*, users!claims_created_by_fkey(full_name, email), assigned_user:users!claims_assigned_to_fkey(full_name, email)', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (lob) {
      query = query.eq('line_of_business', lob);
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    if (created_by) {
      query = query.eq('created_by', created_by);
    }
    if (search) {
      query = query.or(`claim_number.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

// POST /api/claims - Create a new claim
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();
    const body = await request.json();
    const {
      line_of_business,
      title,
      description,
      incident_date,
      incident_location,
      policy_reference,
      estimated_loss,
      severity,
      created_by,
      assigned_to,
    } = body;

    // Validate required fields
    if (!line_of_business || !title || !incident_date || !created_by) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const claim_number = await generateClaimNumber(line_of_business);

    const { data, error } = await supabase
      .from('claims')
      .insert({
        id: uuidv4(),
        claim_number,
        line_of_business,
        status: 'draft',
        severity: severity || 'medium',
        title,
        description: description || '',
        incident_date,
        incident_location: incident_location || '',
        policy_reference: policy_reference || '',
        estimated_loss: estimated_loss || 0,
        reserve_amount: 0,
        actual_payment: 0,
        recovery_amount: 0,
        created_by,
        assigned_to: assigned_to || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id: data.id,
      user_id: created_by,
      action: 'CREATE',
      entity_type: 'claim',
      entity_id: data.id,
      old_values: null,
      new_values: data,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}
