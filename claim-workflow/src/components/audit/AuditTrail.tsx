'use client';

import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AuditLog {
  id: string;
  claim_id: string | null;
  claim_number: string | null;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string;
  created_at: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    user_id: '1',
    user_name: 'John Handler',
    user_role: 'claim_handler',
    action: 'CREATE',
    entity_type: 'claim',
    entity_id: '1',
    description: 'Created new claim: Factory Fire Damage - Building A',
    old_values: null,
    new_values: { status: 'draft', severity: 'high', estimated_loss: 5000000 },
    ip_address: '192.168.1.100',
    created_at: '2024-01-16T10:30:00Z',
  },
  {
    id: '2',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    user_id: '1',
    user_name: 'John Handler',
    user_role: 'claim_handler',
    action: 'UPDATE',
    entity_type: 'claim',
    entity_id: '1',
    description: 'Updated claim status from draft to open',
    old_values: { status: 'draft' },
    new_values: { status: 'open' },
    ip_address: '192.168.1.100',
    created_at: '2024-01-16T11:00:00Z',
  },
  {
    id: '3',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    user_id: '1',
    user_name: 'John Handler',
    user_role: 'claim_handler',
    action: 'CREATE',
    entity_type: 'document',
    entity_id: 'doc-1',
    description: 'Uploaded document: fire_damage_photos.zip',
    old_values: null,
    new_values: { file_name: 'fire_damage_photos.zip', category: 'photo' },
    ip_address: '192.168.1.100',
    created_at: '2024-01-16T11:30:00Z',
  },
  {
    id: '4',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    user_id: '2',
    user_name: 'Sarah Head',
    user_role: 'department_head',
    action: 'CREATE',
    entity_type: 'task',
    entity_id: 'task-1',
    description: 'Created task: Collect fire damage photographs',
    old_values: null,
    new_values: { title: 'Collect fire damage photographs', assigned_department: 'production' },
    ip_address: '192.168.1.101',
    created_at: '2024-01-16T14:00:00Z',
  },
  {
    id: '5',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    user_id: '3',
    user_name: 'Jane Finance',
    user_role: 'finance',
    action: 'CREATE',
    entity_type: 'financial_transaction',
    entity_id: 'txn-1',
    description: 'Created reserve transaction: INR 4,500,000',
    old_values: null,
    new_values: { transaction_type: 'reserve', amount: 4500000 },
    ip_address: '192.168.1.102',
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '6',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    user_id: '2',
    user_name: 'Sarah Head',
    user_role: 'department_head',
    action: 'APPROVE',
    entity_type: 'approval',
    entity_id: 'appr-1',
    description: 'Approved claim at Level 1 (Department Head)',
    old_values: { status: 'pending' },
    new_values: { status: 'approved', comments: 'Verified all documentation' },
    ip_address: '192.168.1.101',
    created_at: '2024-01-18T14:30:00Z',
  },
  {
    id: '7',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    user_id: '1',
    user_name: 'John Handler',
    user_role: 'claim_handler',
    action: 'CREATE',
    entity_type: 'claim',
    entity_id: '2',
    description: 'Created new claim: Cargo Damage - Shipment to USA',
    old_values: null,
    new_values: { status: 'draft', severity: 'medium', estimated_loss: 1200000 },
    ip_address: '192.168.1.100',
    created_at: '2024-01-12T08:00:00Z',
  },
  {
    id: '8',
    claim_id: null,
    claim_number: null,
    user_id: '4',
    user_name: 'Admin User',
    user_role: 'admin',
    action: 'CREATE',
    entity_type: 'user',
    entity_id: 'user-5',
    description: 'Created new user: Mike Auditor (auditor)',
    old_values: null,
    new_values: { email: 'auditor@company.com', role: 'auditor' },
    ip_address: '192.168.1.1',
    created_at: '2024-01-10T09:00:00Z',
  },
  {
    id: '9',
    claim_id: null,
    claim_number: null,
    user_id: '4',
    user_name: 'Admin User',
    user_role: 'admin',
    action: 'UPDATE',
    entity_type: 'template',
    entity_id: 'tmpl-1',
    description: 'Updated template: Property Damage Claim Template',
    old_values: { checklist_count: 5 },
    new_values: { checklist_count: 6 },
    ip_address: '192.168.1.1',
    created_at: '2024-01-08T15:00:00Z',
  },
  {
    id: '10',
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    user_id: '5',
    user_name: 'Bob Legal',
    user_role: 'legal',
    action: 'APPROVE',
    entity_type: 'approval',
    entity_id: 'appr-3',
    description: 'Approved claim at Level 3 (Legal)',
    old_values: { status: 'pending' },
    new_values: { status: 'approved', comments: 'Settlement terms acceptable' },
    ip_address: '192.168.1.103',
    created_at: '2024-01-15T11:30:00Z',
  },
];

const actionConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  CREATE: { label: 'Created', color: 'bg-green-100 text-green-700', icon: Plus },
  UPDATE: { label: 'Updated', color: 'bg-blue-100 text-blue-700', icon: Edit },
  DELETE: { label: 'Deleted', color: 'bg-red-100 text-red-700', icon: Trash2 },
  APPROVE: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECT: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  VIEW: { label: 'Viewed', color: 'bg-gray-100 text-gray-700', icon: Eye },
  DOWNLOAD: { label: 'Downloaded', color: 'bg-purple-100 text-purple-700', icon: Download },
};

const entityTypeLabels: Record<string, string> = {
  claim: 'Claim',
  document: 'Document',
  task: 'Task',
  approval: 'Approval',
  financial_transaction: 'Transaction',
  user: 'User',
  template: 'Template',
  comment: 'Comment',
};

export function AuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.claim_number?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter;
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(log.created_at) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchesDate = matchesDate && new Date(log.created_at) <= new Date(dateTo + 'T23:59:59');
    }
    
    return matchesSearch && matchesAction && matchesEntity && matchesDate;
  });

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));
  const uniqueEntities = Array.from(new Set(logs.map(l => l.entity_type)));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-7 h-7 text-blue-600" />
            Audit Trail
          </h1>
          <p className="text-gray-600 mt-1">
            Complete activity log for compliance and post-claim review
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5" />
          Export Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Actions</p>
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-2xl font-bold text-gray-900">
            {logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Unique Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(logs.map(l => l.user_id)).size}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Claims Affected</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(logs.filter(l => l.claim_id).map(l => l.claim_id)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{actionConfig[action]?.label || action}</option>
            ))}
          </select>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Entities</option>
            {uniqueEntities.map(entity => (
              <option key={entity} value={entity}>{entityTypeLabels[entity] || entity}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Audit Log List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredLogs.map(log => {
            const config = actionConfig[log.action] || actionConfig.VIEW;
            const ActionIcon = config.icon;
            const isExpanded = expandedLog === log.id;

            return (
              <div key={log.id} className="hover:bg-gray-50 transition-colors">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Action Icon */}
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {entityTypeLabels[log.entity_type] || log.entity_type}
                        </span>
                        {log.claim_number && (
                          <span className="text-xs text-blue-600 font-medium">
                            {log.claim_number}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium">{log.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {log.user_name}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs capitalize">
                          {log.user_role.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(log.created_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 ml-14">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {log.old_values && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Previous Values:</p>
                          <pre className="text-xs bg-red-50 text-red-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.old_values, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_values && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">New Values:</p>
                          <pre className="text-xs bg-green-50 text-green-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
                        <span>Entity ID: {log.entity_id}</span>
                        <span>IP: {log.ip_address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
