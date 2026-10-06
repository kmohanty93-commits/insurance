import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/master-data/[id] - Get a single master data item
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
      .from('master_data')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Master data item not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching master data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch master data' },
      { status: 500 }
    );
  }
}

// PATCH /api/master-data/[id] - Update a master data item
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
    const { name, description, metadata, active } = body;

    // Update the master data item
    const { data, error } = await supabase
      .from('master_data')
      .update({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(metadata !== undefined && { metadata }),
        ...(active !== undefined && { active }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Master data item not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating master data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update master data' },
      { status: 500 }
    );
  }
}

// DELETE /api/master-data/[id] - Delete (or deactivate) a master data item
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
    const hard_delete = searchParams.get('hard_delete') === 'true';

    if (hard_delete) {
      // Hard delete
      const { error } = await supabase
        .from('master_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } else {
      // Soft delete (deactivate)
      const { error } = await supabase
        .from('master_data')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: hard_delete ? 'Master data item deleted' : 'Master data item deactivated',
    });
  } catch (error) {
    console.error('Error deleting master data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete master data' },
      { status: 500 }
    );
  }
}
