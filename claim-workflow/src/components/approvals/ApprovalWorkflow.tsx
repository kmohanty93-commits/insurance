'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight,
  User,
  Calendar,
  MessageSquare,
  FileText,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalStep {
  level: number;
  role: string;
  role_label: string;
  approver: string | null;
  status: ApprovalStatus;
  comments: string | null;
  approved_at: string | null;
}

interface ClaimApproval {
  id: string;
  claim_id: string;
  claim_number: string;
  claim_title: string;
  line_of_business: string;
  estimated_loss: number;
  current_level: number;
  overall_status: ApprovalStatus | 'in_progress';
  steps: ApprovalStep[];
  submitted_by: string;
  submitted_at: string;
}

const mockApprovals: ClaimApproval[] = [
  {
    id: '1',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    claim_title: 'Factory Fire Damage - Building A',
    line_of_business: 'property',
    estimated_loss: 5000000,
    current_level: 2,
    overall_status: 'in_progress',
    steps: [
      { level: 1, role: 'department_head', role_label: 'Department Head', approver: 'Sarah Head', status: 'approved', comments: 'Verified all documentation. Approved.', approved_at: '2024-01-18T14:30:00Z' },
      { level: 2, role: 'finance', role_label: 'Finance', approver: null, status: 'pending', comments: null, approved_at: null },
      { level: 3, role: 'legal', role_label: 'Legal', approver: null, status: 'pending', comments: null, approved_at: null },
      { level: 4, role: 'management', role_label: 'Management', approver: null, status: 'pending', comments: null, approved_at: null },
    ],
    submitted_by: 'John Handler',
    submitted_at: '2024-01-17T10:00:00Z',
  },
  {
    id: '2',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    claim_title: 'Cargo Damage - Shipment to USA',
    line_of_business: 'marine',
    estimated_loss: 1200000,
    current_level: 3,
    overall_status: 'in_progress',
    steps: [
      { level: 1, role: 'department_head', role_label: 'Department Head', approver: 'Sarah Head', status: 'approved', comments: 'Documents verified.', approved_at: '2024-01-14T11:00:00Z' },
      { level: 2, role: 'finance', role_label: 'Finance', approver: 'Jane Finance', status: 'approved', comments: 'Financial assessment completed. Approved.', approved_at: '2024-01-16T15:00:00Z' },
      { level: 3, role: 'legal', role_label: 'Legal', approver: null, status: 'pending', comments: null, approved_at: null },
      { level: 4, role: 'management', role_label: 'Management', approver: null, status: 'pending', comments: null, approved_at: null },
    ],
    submitted_by: 'John Handler',
    submitted_at: '2024-01-13T09:00:00Z',
  },
  {
    id: '3',
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    claim_title: 'Visitor Injury at Manufacturing Plant',
    line_of_business: 'cgl',
    estimated_loss: 500000,
    current_level: 4,
    overall_status: 'approved',
    steps: [
      { level: 1, role: 'department_head', role_label: 'Department Head', approver: 'Sarah Head', status: 'approved', comments: 'Approved.', approved_at: '2024-01-08T10:00:00Z' },
      { level: 2, role: 'finance', role_label: 'Finance', approver: 'Jane Finance', status: 'approved', comments: 'Financial review complete.', approved_at: '2024-01-10T14:00:00Z' },
      { level: 3, role: 'legal', role_label: 'Legal', approver: 'Bob Legal', status: 'approved', comments: 'Legal review complete. Settlement terms acceptable.', approved_at: '2024-01-15T11:30:00Z' },
      { level: 4, role: 'management', role_label: 'Management', approver: 'Admin User', status: 'approved', comments: 'Final approval granted.', approved_at: '2024-01-20T16:00:00Z' },
    ],
    submitted_by: 'John Handler',
    submitted_at: '2024-01-07T09:00:00Z',
  },
  {
    id: '4',
    claim_id: '5',
    claim_number: 'PRC-24-00001',
    claim_title: 'Product Recall - Batch XY2024',
    line_of_business: 'product_recall',
    estimated_loss: 3000000,
    current_level: 2,
    overall_status: 'rejected',
    steps: [
      { level: 1, role: 'department_head', role_label: 'Department Head', approver: 'Sarah Head', status: 'approved', comments: 'Initial assessment approved.', approved_at: '2024-01-05T14:00:00Z' },
      { level: 2, role: 'finance', role_label: 'Finance', approver: 'Jane Finance', status: 'rejected', comments: 'Insufficient documentation for claimed amount. Please provide detailed cost breakdown.', approved_at: '2024-01-08T10:00:00Z' },
      { level: 3, role: 'legal', role_label: 'Legal', approver: null, status: 'pending', comments: null, approved_at: null },
      { level: 4, role: 'management', role_label: 'Management', approver: null, status: 'pending', comments: null, approved_at: null },
    ],
    submitted_by: 'Sarah Head',
    submitted_at: '2024-01-04T11:00:00Z',
  },
];

const statusConfig: Record<ApprovalStatus | 'in_progress', { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
};

export function ApprovalWorkflow() {
  const [approvals, setApprovals] = useState<ClaimApproval[]>(mockApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<ClaimApproval | null>(null);

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      approval.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.claim_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.overall_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingMyApproval = approvals.filter(a => 
    a.overall_status === 'in_progress' && 
    a.steps.some(s => s.status === 'pending' && s.level === a.current_level)
  );

  const handleApprovalAction = (approvalId: string, level: number, action: 'approved' | 'rejected', comments: string) => {
    setApprovals(approvals.map(approval => {
      if (approval.id === approvalId) {
        const updatedSteps = approval.steps.map(step => {
          if (step.level === level) {
            return {
              ...step,
              status: action,
              comments,
              approver: 'Current User',
              approved_at: new Date().toISOString(),
            };
          }
          return step;
        });

        let newStatus: ApprovalStatus | 'in_progress' = 'in_progress';
        let newLevel = level;

        if (action === 'rejected') {
          newStatus = 'rejected';
        } else if (level === approval.steps.length) {
          newStatus = 'approved';
        } else {
          newLevel = level + 1;
        }

        return {
          ...approval,
          steps: updatedSteps,
          current_level: newLevel,
          overall_status: newStatus,
        };
      }
      return approval;
    }));

    if (selectedApproval?.id === approvalId) {
      const updated = approvals.find(a => a.id === approvalId);
      if (updated) {
        setSelectedApproval({
          ...updated,
          steps: updated.steps.map(step => {
            if (step.level === level) {
              return {
                ...step,
                status: action,
                comments,
                approver: 'Current User',
                approved_at: new Date().toISOString(),
              };
            }
            return step;
          }),
          current_level: action === 'rejected' ? level : (level === updated.steps.length ? level : level + 1),
          overall_status: action === 'rejected' ? 'rejected' : (level === updated.steps.length ? 'approved' : 'in_progress'),
        });
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Approval Workflow
          </h1>
          <p className="text-gray-600 mt-1">
            Multi-level approval tracking for claim settlements
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending My Approval</p>
              <p className="text-xl font-bold text-gray-900">{pendingMyApproval.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {approvals.filter(a => a.overall_status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold text-gray-900">
                {approvals.filter(a => a.overall_status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-gray-900">
                {approvals.filter(a => a.overall_status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map(approval => {
          const overallConfig = statusConfig[approval.overall_status];
          const OverallIcon = overallConfig.icon;
          const completedSteps = approval.steps.filter(s => s.status === 'approved').length;
          const progress = (completedSteps / approval.steps.length) * 100;

          return (
            <div
              key={approval.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500">{approval.claim_number}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${overallConfig.color}`}>
                        <OverallIcon className="w-3 h-3" />
                        {overallConfig.label}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                        {approval.line_of_business.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{approval.claim_title}</h3>
                    <p className="text-sm text-gray-500">
                      Estimated Loss: <span className="font-medium text-gray-900">INR {approval.estimated_loss.toLocaleString('en-IN')}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="font-semibold text-gray-900">{completedSteps}/{approval.steps.length} Steps</p>
                    </div>
                    <button
                      onClick={() => setSelectedApproval(approval)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        approval.overall_status === 'rejected' ? 'bg-red-500' :
                        approval.overall_status === 'approved' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Approval Steps Timeline */}
                <div className="mt-4 flex items-center justify-between">
                  {approval.steps.map((step, index) => {
                    const stepConfig = statusConfig[step.status];
                    const StepIcon = stepConfig.icon;
                    const isActive = step.level === approval.current_level && approval.overall_status === 'in_progress';

                    return (
                      <React.Fragment key={step.level}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                            } ${
                              step.status === 'approved' ? 'bg-green-100' :
                              step.status === 'rejected' ? 'bg-red-100' :
                              isActive ? 'bg-blue-100' : 'bg-gray-100'
                            }`}
                          >
                            <StepIcon className={`w-5 h-5 ${
                              step.status === 'approved' ? 'text-green-600' :
                              step.status === 'rejected' ? 'text-red-600' :
                              isActive ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <p className={`text-xs mt-1 ${isActive ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                            {step.role_label}
                          </p>
                        </div>
                        {index < approval.steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${
                            step.status === 'approved' ? 'bg-green-400' : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {filteredApprovals.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No approvals found</p>
          </div>
        )}
      </div>

      {/* Approval Detail Modal */}
      {selectedApproval && (
        <ApprovalDetailModal
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onAction={handleApprovalAction}
        />
      )}
    </div>
  );
}

interface ApprovalDetailModalProps {
  approval: ClaimApproval;
  onClose: () => void;
  onAction: (approvalId: string, level: number, action: 'approved' | 'rejected', comments: string) => void;
}

function ApprovalDetailModal({ approval, onClose, onAction }: ApprovalDetailModalProps) {
  const [actionComments, setActionComments] = useState('');
  const [showActionForm, setShowActionForm] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approved' | 'rejected' | null>(null);

  const overallConfig = statusConfig[approval.overall_status];
  const OverallIcon = overallConfig.icon;

  const currentStep = approval.steps.find(s => s.level === approval.current_level);
  const canTakeAction = approval.overall_status === 'in_progress' && currentStep?.status === 'pending';

  const handleAction = () => {
    if (pendingAction && currentStep) {
      onAction(approval.id, currentStep.level, pendingAction, actionComments);
      setShowActionForm(false);
      setPendingAction(null);
      setActionComments('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500">{approval.claim_number}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${overallConfig.color}`}>
                  <OverallIcon className="w-3 h-3" />
                  {overallConfig.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{approval.claim_title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Claim Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Line of Business</p>
              <p className="font-medium text-gray-900 capitalize">{approval.line_of_business.replace('_', ' ')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Estimated Loss</p>
              <p className="font-medium text-gray-900">INR {approval.estimated_loss.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Submitted By</p>
              <p className="font-medium text-gray-900">{approval.submitted_by}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Submitted On</p>
              <p className="font-medium text-gray-900">
                {new Date(approval.submitted_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {/* Approval Steps */}
          <h3 className="font-semibold text-gray-900 mb-4">Approval Timeline</h3>
          <div className="space-y-4">
            {approval.steps.map((step, index) => {
              const stepConfig = statusConfig[step.status];
              const StepIcon = stepConfig.icon;
              const isActive = step.level === approval.current_level && approval.overall_status === 'in_progress';

              return (
                <div
                  key={step.level}
                  className={`relative pl-8 pb-4 ${
                    index < approval.steps.length - 1 ? 'border-l-2 border-gray-200 ml-4' : 'ml-4'
                  }`}
                >
                  {/* Step Icon */}
                  <div
                    className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    } ${
                      step.status === 'approved' ? 'bg-green-100' :
                      step.status === 'rejected' ? 'bg-red-100' :
                      isActive ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <StepIcon className={`w-4 h-4 ${
                      step.status === 'approved' ? 'text-green-600' :
                      step.status === 'rejected' ? 'text-red-600' :
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>

                  {/* Step Content */}
                  <div className={`bg-white rounded-lg border ${
                    isActive ? 'border-blue-300 shadow-sm' : 'border-gray-200'
                  } p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Level {step.level}: {step.role_label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stepConfig.color}`}>
                          {stepConfig.label}
                        </span>
                      </div>
                      {step.approved_at && (
                        <span className="text-xs text-gray-500">
                          {new Date(step.approved_at).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {step.approver && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>Reviewed by: <strong>{step.approver}</strong></span>
                      </div>
                    )}

                    {step.comments && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-700">{step.comments}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons for Current Level */}
                    {isActive && canTakeAction && !showActionForm && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => {
                            setPendingAction('approved');
                            setShowActionForm(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setPendingAction('rejected');
                            setShowActionForm(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Action Form */}
                    {isActive && showActionForm && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {pendingAction === 'approved' ? 'Approve Claim' : 'Reject Claim'}
                        </h4>
                        <textarea
                          value={actionComments}
                          onChange={(e) => setActionComments(e.target.value)}
                          rows={3}
                          placeholder="Add your comments (required)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleAction}
                            disabled={!actionComments.trim()}
                            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              pendingAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            {pendingAction === 'approved' ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Confirm Approval
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Confirm Rejection
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowActionForm(false);
                              setPendingAction(null);
                              setActionComments('');
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
