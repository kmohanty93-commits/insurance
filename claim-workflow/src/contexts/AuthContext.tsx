'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'claim_handler' | 'department_head' | 'finance' | 'legal' | 'auditor';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string | null;
  avatar_url?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole, department?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isReadOnly: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data as User);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If profile doesn't exist, user needs to complete registration
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
      return { error: errorMessage };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    department?: string
  ): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          department: department || null,
        });

        if (profileError) throw profileError;

        await fetchUserProfile(data.user.id);
      }

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign up';
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ error: string | null }> => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred updating profile';
      return { error: errorMessage };
    }
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const isReadOnly = (): boolean => {
    return user?.role === 'auditor';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        hasPermission,
        isReadOnly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Role-based permission helper
export const ROLE_PERMISSIONS = {
  admin: {
    canCreateClaim: true,
    canEditClaim: true,
    canDeleteClaim: true,
    canApproveClaim: true,
    canManageUsers: true,
    canManageTemplates: true,
    canViewReports: true,
    canManageFinancials: true,
    canViewAuditLog: true,
  },
  claim_handler: {
    canCreateClaim: true,
    canEditClaim: true,
    canDeleteClaim: false,
    canApproveClaim: false,
    canManageUsers: false,
    canManageTemplates: false,
    canViewReports: true,
    canManageFinancials: false,
    canViewAuditLog: false,
  },
  department_head: {
    canCreateClaim: false,
    canEditClaim: true,
    canDeleteClaim: false,
    canApproveClaim: true,
    canManageUsers: false,
    canManageTemplates: false,
    canViewReports: true,
    canManageFinancials: false,
    canViewAuditLog: true,
  },
  finance: {
    canCreateClaim: false,
    canEditClaim: true,
    canDeleteClaim: false,
    canApproveClaim: true,
    canManageUsers: false,
    canManageTemplates: false,
    canViewReports: true,
    canManageFinancials: true,
    canViewAuditLog: true,
  },
  legal: {
    canCreateClaim: false,
    canEditClaim: true,
    canDeleteClaim: false,
    canApproveClaim: true,
    canManageUsers: false,
    canManageTemplates: false,
    canViewReports: true,
    canManageFinancials: false,
    canViewAuditLog: true,
  },
  auditor: {
    canCreateClaim: false,
    canEditClaim: false,
    canDeleteClaim: false,
    canApproveClaim: false,
    canManageUsers: false,
    canManageTemplates: false,
    canViewReports: true,
    canManageFinancials: false,
    canViewAuditLog: true,
  },
};

export function getUserPermissions(role: UserRole) {
  return ROLE_PERMISSIONS[role];
}
