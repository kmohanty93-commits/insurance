import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/master-data - List all master data items
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
    const type = searchParams.get('type');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    let query = supabase
      .from('master_data')
      .select('*');

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }
    if (active !== null && active !== undefined) {
      query = query.eq('active', active === 'true');
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
    }

    // Ordering
    query = query.order('type', { ascending: true }).order('name', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching master data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch master data' },
      { status: 500 }
    );
  }
}

// POST /api/master-data - Create a new master data item
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
    const { type, code, name, description, metadata } = body;

    // Validate required fields
    if (!type || !code || !name) {
      return NextResponse.json(
        { success: false, error: 'Type, code, and name are required' },
        { status: 400 }
      );
    }

    // Check for duplicate code
    const { data: existing } = await supabase
      .from('master_data')
      .select('id')
      .eq('type', type)
      .eq('code', code)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A master data item with this type and code already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('master_data')
      .insert({
        id: uuidv4(),
        type,
        code,
        name,
        description: description || null,
        metadata: metadata || null,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating master data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create master data' },
      { status: 500 }
    );
  }
}
