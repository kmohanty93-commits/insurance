import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// GET /api/approvals/[id] - Get a single approval
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('approvals')
      .select(`
        *,
        claim:claims(id, claim_number, title, line_of_business, status, estimated_loss, reserve_amount, description),
        approver:users!approvals_approver_id_fkey(id, full_name, email, role)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Approval not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approval' },
      { status: 500 }
    );
  }
}

// PATCH /api/approvals/[id] - Approve or reject
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();
    const { id } = await params;
    const body = await request.json();
    const { user_id, status, comments } = body;

    if (!user_id || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either approved or rejected' },
        { status: 400 }
      );
    }

    // Get current approval data
    const { data: currentApproval, error: fetchError } = await supabase
      .from('approvals')
      .select('*, claim:claims(*)')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Approval not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Check if user has the correct role for this approval level
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== currentApproval.approver_role && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to approve/reject at this level' },
        { status: 403 }
      );
    }

    // Update the approval
    const { data, error } = await supabase
      .from('approvals')
      .update({
        status,
        approver_id: user_id,
        comments: comments || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id: currentApproval.claim_id,
      user_id,
      action: status === 'approved' ? 'APPROVE' : 'REJECT',
      entity_type: 'approval',
      entity_id: id,
      old_values: { status: currentApproval.status },
      new_values: { status, comments },
    });

    // Handle approval workflow logic
    if (status === 'approved') {
      // Check if there's a next approval level
      const { data: nextApproval } = await supabase
        .from('approvals')
        .select('*')
        .eq('claim_id', currentApproval.claim_id)
        .eq('approval_level', currentApproval.approval_level + 1)
        .single();

      if (nextApproval) {
        // Notify next level approvers
        const { data: nextLevelUsers } = await supabase
          .from('users')
          .select('id')
          .eq('role', nextApproval.approver_role);

        if (nextLevelUsers) {
          const notifications = nextLevelUsers.map(u => ({
            id: uuidv4(),
            user_id: u.id,
            title: 'Approval Pending',
            message: `Claim ${currentApproval.claim.claim_number} is awaiting your approval`,
            type: 'warning' as const,
            read: false,
            claim_id: currentApproval.claim_id,
          }));

          await supabase.from('notifications').insert(notifications);
        }
      } else {
        // All levels approved - update claim status
        await supabase
          .from('claims')
          .update({
            status: 'approved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentApproval.claim_id);

        // Notify claim creator
        await supabase.from('notifications').insert({
          id: uuidv4(),
          user_id: currentApproval.claim.created_by,
          title: 'Claim Approved',
          message: `Claim ${currentApproval.claim.claim_number} has been fully approved`,
          type: 'success',
          read: false,
          claim_id: currentApproval.claim_id,
        });
      }
    } else {
      // Rejected - update claim status
      await supabase
        .from('claims')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentApproval.claim_id);

      // Notify claim creator
      await supabase.from('notifications').insert({
        id: uuidv4(),
        user_id: currentApproval.claim.created_by,
        title: 'Claim Rejected',
        message: `Claim ${currentApproval.claim.claim_number} has been rejected at ${currentApproval.approver_role} level`,
        type: 'error',
        read: false,
        claim_id: currentApproval.claim_id,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update approval' },
      { status: 500 }
    );
  }
}
