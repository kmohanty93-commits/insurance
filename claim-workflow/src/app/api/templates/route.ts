import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/templates - List all claim templates
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
    const search = searchParams.get('search');

    let query = supabase
      .from('claim_templates')
      .select('*');

    // Apply filters
    if (lob) {
      query = query.eq('line_of_business', lob);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Ordering
    query = query.order('line_of_business', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create a new template
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
      name,
      checklist,
      required_documents,
      workflow_steps,
    } = body;

    // Validate required fields
    if (!line_of_business || !name) {
      return NextResponse.json(
        { success: false, error: 'Line of business and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('claim_templates')
      .insert({
        id: uuidv4(),
        line_of_business,
        name,
        checklist: checklist || [],
        required_documents: required_documents || [],
        workflow_steps: workflow_steps || [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
