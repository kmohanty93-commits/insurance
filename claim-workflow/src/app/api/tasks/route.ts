import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-server';

// GET /api/tasks - List all tasks with filters
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
    const assigned_to = searchParams.get('assigned_to');
    const assigned_department = searchParams.get('department');
    const priority = searchParams.get('priority');
    const overdue = searchParams.get('overdue');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('tasks')
      .select(`
        *,
        claim:claims(id, claim_number, title, line_of_business, status),
        assignee:users!tasks_assigned_to_fkey(id, full_name, email, department)
      `, { count: 'exact' });

    // Apply filters
    if (claim_id) {
      query = query.eq('claim_id', claim_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    if (assigned_department) {
      query = query.eq('assigned_department', assigned_department);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (overdue === 'true') {
      query = query.eq('status', 'overdue');
    }

    // Pagination and ordering
    query = query
      .order('due_date', { ascending: true })
      .order('priority', { ascending: false })
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
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
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
      assigned_department,
      assigned_to,
      due_date,
      priority,
      created_by,
    } = body;

    // Validate required fields
    if (!claim_id || !title || !assigned_department || !due_date || !created_by) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const taskId = uuidv4();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id: taskId,
        claim_id,
        title,
        description: description || '',
        assigned_department,
        assigned_to: assigned_to || null,
        due_date,
        status: 'pending',
        priority: priority || 'medium',
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
      entity_type: 'task',
      entity_id: taskId,
      old_values: null,
      new_values: data,
    });

    // Create notification for assignee if assigned
    if (assigned_to) {
      await supabase.from('notifications').insert({
        id: uuidv4(),
        user_id: assigned_to,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${title}`,
        type: 'info',
        read: false,
        claim_id,
      });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks - Bulk update tasks (for status updates)
export async function PATCH(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();
    const body = await request.json();
    const { task_ids, updates, user_id } = body;

    if (!task_ids || !Array.isArray(task_ids) || task_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task IDs are required' },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in('id', task_ids)
      .select();

    if (error) throw error;

    // Create audit log entries
    for (const task of data) {
      await supabase.from('audit_logs').insert({
        id: uuidv4(),
        claim_id: task.claim_id,
        user_id,
        action: 'UPDATE',
        entity_type: 'task',
        entity_id: task.id,
        old_values: null,
        new_values: updates,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tasks' },
      { status: 500 }
    );
  }
}
