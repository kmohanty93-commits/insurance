import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/claims/[id] - Get a single claim with all details
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
      .from('claims')
      .select(`
        *,
        creator:users!claims_created_by_fkey(id, full_name, email, role, department),
        assignee:users!claims_assigned_to_fkey(id, full_name, email, role, department),
        documents(*),
        tasks(*),
        approvals(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Claim not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claim' },
      { status: 500 }
    );
  }
}

// PATCH /api/claims/[id] - Update a claim
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
    const { user_id, ...updates } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current claim data for audit log
    const { data: currentClaim, error: fetchError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Claim not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Update the claim
    const { data, error } = await supabase
      .from('claims')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id: id,
      user_id,
      action: 'UPDATE',
      entity_type: 'claim',
      entity_id: id,
      old_values: currentClaim,
      new_values: data,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

// DELETE /api/claims/[id] - Delete a claim (soft delete by setting status)
export async function DELETE(
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
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current claim data for audit log
    const { data: currentClaim, error: fetchError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Claim not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Soft delete - mark as deleted/archived
    const { error } = await supabase
      .from('claims')
      .update({
        status: 'closed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id: id,
      user_id,
      action: 'DELETE',
      entity_type: 'claim',
      entity_id: id,
      old_values: currentClaim,
      new_values: { status: 'closed' },
    });

    return NextResponse.json({ success: true, message: 'Claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete claim' },
      { status: 500 }
    );
  }
}
