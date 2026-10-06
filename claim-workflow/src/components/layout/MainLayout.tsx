'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationCenter';
import {
  LayoutDashboard,
  FileText,
  Folder,
  Users,
  CheckSquare,
  ShieldCheck,
  DollarSign,
  BarChart3,
  History,
  Bell,
  Database,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Building
} from 'lucide-react';

// Import all modules
import { Dashboard, Reports } from '@/components/dashboard/Dashboard';
import { ClaimsList } from '@/components/claims/ClaimsList';
import { DocumentManager } from '@/components/documents/DocumentManager';
import { UserManagement } from '@/components/users/UserManagement';
import { TemplatesManager } from '@/components/templates/TemplatesManager';
import { WorkflowManager } from '@/components/workflow/WorkflowManager';
import { ApprovalWorkflow } from '@/components/approvals/ApprovalWorkflow';
import { FinancialTracker } from '@/components/financial/FinancialTracker';
import { AuditTrail } from '@/components/audit/AuditTrail';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { MasterDataLibrary, LessonsLearnedRepository } from '@/components/masterdata/MasterDataLibrary';

type ActiveModule = 
  | 'dashboard' 
  | 'claims' 
  | 'documents' 
  | 'workflow' 
  | 'approvals' 
  | 'financial' 
  | 'reports'
  | 'audit'
  | 'notifications'
  | 'templates'
  | 'masterdata'
  | 'lessons'
  | 'users'
  | 'settings';

interface NavItem {
  id: ActiveModule;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'claims', label: 'Claims', icon: FileText, badge: 3 },
  { id: 'documents', label: 'Documents', icon: Folder },
  { id: 'workflow', label: 'Workflow', icon: CheckSquare, badge: 2 },
  { id: 'approvals', label: 'Approvals', icon: ShieldCheck, badge: 1 },
  { id: 'financial', label: 'Financial', icon: DollarSign, roles: ['admin', 'finance'] },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'audit', label: 'Audit Trail', icon: History, roles: ['admin', 'auditor', 'legal'] },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'templates', label: 'Templates', icon: FileText, roles: ['admin'] },
  { id: 'masterdata', label: 'Master Data', icon: Database, roles: ['admin'] },
  { id: 'lessons', label: 'Lessons Learned', icon: Lightbulb },
  { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
];

export function MainLayout() {
  const { user, signOut, hasPermission } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => user?.role === role);
  });

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'claims':
        return <ClaimsList />;
      case 'documents':
        return <DocumentManager />;
      case 'workflow':
        return <WorkflowManager />;
      case 'approvals':
        return <ApprovalWorkflow />;
      case 'financial':
        return <FinancialTracker />;
      case 'reports':
        return <Reports />;
      case 'audit':
        return <AuditTrail />;
      case 'notifications':
        return <NotificationCenter />;
      case 'templates':
        return <TemplatesManager />;
      case 'masterdata':
        return <MasterDataLibrary />;
      case 'lessons':
        return <LessonsLearnedRepository />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">ClaimFlow</span>
        </div>
        <NotificationBell onClick={() => setActiveModule('notifications')} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">ClaimFlow</span>
                  <p className="text-xs text-gray-500">Insurance Claims</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {filteredNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeModule === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-gray-900">ClaimFlow</h1>
                  <p className="text-xs text-gray-500">Insurance Claims</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  activeModule === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={signOut}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredNavItems.find(item => item.id === activeModule)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell onClick={() => setActiveModule('notifications')} />
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </header>

          {/* Module Content */}
          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
}
