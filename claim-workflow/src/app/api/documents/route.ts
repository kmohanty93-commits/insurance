import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/documents - List all documents with filters
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
    const uploaded_by = searchParams.get('uploaded_by');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('documents')
      .select(`
        *,
        claim:claims(id, claim_number, title),
        uploader:users!documents_uploaded_by_fkey(id, full_name, email)
      `, { count: 'exact' });

    // Apply filters
    if (claim_id) {
      query = query.eq('claim_id', claim_id);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (uploaded_by) {
      query = query.eq('uploaded_by', uploaded_by);
    }
    if (search) {
      query = query.ilike('file_name', `%${search}%`);
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
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Upload a new document (metadata only, file upload handled separately)
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
      file_name,
      file_path,
      file_type,
      file_size,
      category,
      uploaded_by,
    } = body;

    // Validate required fields
    if (!claim_id || !file_name || !file_path || !file_type || !uploaded_by) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for existing document with same name to determine version
    const { data: existingDocs } = await supabase
      .from('documents')
      .select('version')
      .eq('claim_id', claim_id)
      .eq('file_name', file_name)
      .order('version', { ascending: false })
      .limit(1);

    const version = existingDocs && existingDocs.length > 0 ? existingDocs[0].version + 1 : 1;

    const documentId = uuidv4();

    const { data, error } = await supabase
      .from('documents')
      .insert({
        id: documentId,
        claim_id,
        file_name,
        file_path,
        file_type,
        file_size: file_size || 0,
        category: category || 'other',
        version,
        uploaded_by,
      })
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      claim_id,
      user_id: uploaded_by,
      action: 'CREATE',
      entity_type: 'document',
      entity_id: documentId,
      old_values: null,
      new_values: { file_name, category, version },
    });

    // Create notification for claim owner
    const { data: claim } = await supabase
      .from('claims')
      .select('created_by, claim_number')
      .eq('id', claim_id)
      .single();

    if (claim && claim.created_by !== uploaded_by) {
      await supabase.from('notifications').insert({
        id: uuidv4(),
        user_id: claim.created_by,
        title: 'Document Uploaded',
        message: `New document "${file_name}" has been uploaded to claim ${claim.claim_number}`,
        type: 'info',
        read: false,
        claim_id,
      });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
