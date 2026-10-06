import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Approval level configuration
const APPROVAL_HIERARCHY = [
  { level: 1, role: 'department_head', name: 'Department Head' },
  { level: 2, role: 'finance', name: 'Finance' },
  { level: 3, role: 'legal', name: 'Legal' },
  { level: 4, role: 'admin', name: 'Management' },
];

// GET /api/approvals - List all approvals with filters
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
    const claim_id = searchParams.get('claim_id');
    const status = searchParams.get('status');
    const approver_role = searchParams.get('approver_role');
    const approver_id = searchParams.get('approver_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('approvals')
      .select(`
        *,
        claim:claims(id, claim_number, title, line_of_business, status, estimated_loss, reserve_amount),
        approver:users!approvals_approver_id_fkey(id, full_name, email, role)
      `, { count: 'exact' });

    // Apply filters
    if (claim_id) {
      query = query.eq('claim_id', claim_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (approver_role) {
      query = query.eq('approver_role', approver_role);
    }
    if (approver_id) {
      query = query.eq('approver_id', approver_id);
    }

    // Pagination and ordering
    query = query
      .order('approval_level', { ascending: true })
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
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

// POST /api/approvals - Initiate approval workflow for a claim
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
    const { claim_id, user_id, max_level } = body;

    // Validate required fields
    if (!claim_id || !user_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if claim exists and is in correct status
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claim_id)
      .single();

    if (claimError || !claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    // Check if approval already exists
    const { data: existingApprovals } = await supabase
      .from('approvals')
      .select('*')
      .eq('claim_id', claim_id);

    if (existingApprovals && existingApprovals.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Approval workflow already initiated for this claim' },
        { status: 400 }
      );
    }

    // Create approval entries for each level
    const levels = max_level ? APPROVAL_HIERARCHY.slice(0, max_level) : APPROVAL_HIERARCHY;
    const approvals = levels.map((level) => ({
      id: uuidv4(),
      claim_id,
      approval_level: level.level,
      approver_role: level.role,
      approver_id: null,
      status: 'pending',
      comments: null,
    }));

    const { data, error } = await supabase
      .from('approvals')
      .insert(approvals)
      .select();

    if (error) throw error;

    // Update claim status
    await supabase
      .from('claims')
      .update({
        status: 'pending_approval',
        updated_at: new Date().toISOString(),
      })
      .eq('id', claim_id);

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id,
      user_id,
      action: 'CREATE',
      entity_type: 'approval_workflow',
      entity_id: claim_id,
      old_values: null,
      new_values: { levels: levels.length },
    });

    // Notify first level approvers
    const { data: firstLevelUsers } = await supabase
      .from('users')
      .select('id')
      .eq('role', levels[0].role);

    if (firstLevelUsers) {
      const notifications = firstLevelUsers.map(u => ({
        id: uuidv4(),
        user_id: u.id,
        title: 'Approval Pending',
        message: `Claim ${claim.claim_number} is awaiting your approval at ${levels[0].name} level`,
        type: 'warning' as const,
        read: false,
        claim_id,
      }));

      await supabase.from('notifications').insert(notifications);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating approval workflow:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create approval workflow' },
      { status: 500 }
    );
  }
}
