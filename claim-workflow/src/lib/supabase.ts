import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');
};

// Create Supabase client only if properly configured
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// For backward compatibility
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as unknown as SupabaseClient;

// Server-side Supabase client with service role key
export const getServerSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, serviceKey);
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'claim_handler' | 'department_head' | 'finance' | 'legal' | 'auditor';
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      claims: {
        Row: {
          id: string;
          claim_number: string;
          line_of_business: 'property' | 'marine' | 'cyber' | 'cgl' | 'product_recall' | 'product_guarantee';
          status: 'draft' | 'open' | 'in_progress' | 'pending_approval' | 'approved' | 'closed' | 'rejected';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          incident_date: string;
          incident_location: string;
          policy_reference: string;
          estimated_loss: number;
          reserve_amount: number;
          actual_payment: number;
          recovery_amount: number;
          created_by: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['claims']['Row'], 'id' | 'claim_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['claims']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          claim_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          category: 'evidence' | 'invoice' | 'photo' | 'correspondence' | 'legal' | 'other';
          version: number;
          uploaded_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          claim_id: string;
          title: string;
          description: string;
          assigned_department: string;
          assigned_to: string | null;
          due_date: string;
          status: 'pending' | 'in_progress' | 'completed' | 'overdue';
          priority: 'low' | 'medium' | 'high';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      approvals: {
        Row: {
          id: string;
          claim_id: string;
          approval_level: number;
          approver_role: string;
          approver_id: string | null;
          status: 'pending' | 'approved' | 'rejected';
          comments: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['approvals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['approvals']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          claim_id: string | null;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          old_values: Record<string, unknown> | null;
          new_values: Record<string, unknown> | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'warning' | 'error' | 'success';
          read: boolean;
          claim_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      claim_templates: {
        Row: {
          id: string;
          line_of_business: string;
          name: string;
          checklist: Record<string, unknown>[];
          required_documents: string[];
          workflow_steps: Record<string, unknown>[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['claim_templates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['claim_templates']['Insert']>;
      };
      lessons_learned: {
        Row: {
          id: string;
          claim_id: string;
          title: string;
          description: string;
          category: string;
          recommendations: string;
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lessons_learned']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lessons_learned']['Insert']>;
      };
      master_data: {
        Row: {
          id: string;
          type: 'claim_type' | 'document_type' | 'sop' | 'department';
          code: string;
          name: string;
          description: string | null;
          metadata: Record<string, unknown> | null;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['master_data']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['master_data']['Insert']>;
      };
    };
  };
};
