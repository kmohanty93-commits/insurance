import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/lessons-learned/[id] - Get a single lesson learned
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
      .from('lessons_learned')
      .select(`
        *,
        claim:claims(id, claim_number, title, line_of_business),
        creator:users!lessons_learned_created_by_fkey(id, full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Lesson learned not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching lesson learned:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lesson learned' },
      { status: 500 }
    );
  }
}

// PATCH /api/lessons-learned/[id] - Update a lesson learned
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
    const { user_id, title, description, category, recommendations } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current data for audit log
    const { data: currentData, error: fetchError } = await supabase
      .from('lessons_learned')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Lesson learned not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Update the lesson learned
    const { data, error } = await supabase
      .from('lessons_learned')
      .update({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(recommendations !== undefined && { recommendations }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id: currentData.claim_id,
      user_id,
      action: 'UPDATE',
      entity_type: 'lesson_learned',
      entity_id: id,
      old_values: currentData,
      new_values: data,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating lesson learned:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lesson learned' },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons-learned/[id] - Delete a lesson learned
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

    // Get current data for audit log
    const { data: currentData, error: fetchError } = await supabase
      .from('lessons_learned')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Lesson learned not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Delete the lesson learned
    const { error } = await supabase
      .from('lessons_learned')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id: currentData.claim_id,
      user_id,
      action: 'DELETE',
      entity_type: 'lesson_learned',
      entity_id: id,
      old_values: currentData,
      new_values: null,
    });

    return NextResponse.json({ success: true, message: 'Lesson learned deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson learned:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lesson learned' },
      { status: 500 }
    );
  }
}
