import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/lessons-learned - List all lessons learned
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
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('lessons_learned')
      .select(`
        *,
        claim:claims(id, claim_number, title, line_of_business),
        creator:users!lessons_learned_created_by_fkey(id, full_name, email)
      `, { count: 'exact' });

    // Apply filters
    if (claim_id) {
      query = query.eq('claim_id', claim_id);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
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
    console.error('Error fetching lessons learned:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lessons learned' },
      { status: 500 }
    );
  }
}

// POST /api/lessons-learned - Create a new lesson learned
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
      claim_id,
      title,
      description,
      category,
      recommendations,
      created_by,
    } = body;

    // Validate required fields
    if (!claim_id || !title || !description || !created_by) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('lessons_learned')
      .insert({
        id: uuidv4(),
        claim_id,
        title,
        description,
        category: category || 'general',
        recommendations: recommendations || '',
        created_by,
      })
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id,
      user_id: created_by,
      action: 'CREATE',
      entity_type: 'lesson_learned',
      entity_id: data.id,
      old_values: null,
      new_values: { title, category },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson learned:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lesson learned' },
      { status: 500 }
    );
  }
}
