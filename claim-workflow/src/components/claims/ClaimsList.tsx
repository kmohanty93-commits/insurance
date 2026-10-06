'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
  Ship,
  Monitor,
  Scale,
  Package,
  Shield
} from 'lucide-react';
import { ClaimIntakeForm, ClaimFormData, LineOfBusiness, Severity, ClaimStatus } from './ClaimIntakeForm';

export interface Claim {
  id: string;
  claim_number: string;
  title: string;
  description: string;
  line_of_business: LineOfBusiness;
  status: ClaimStatus;
  severity: Severity;
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
}

// Mock claims data for demo
const mockClaims: Claim[] = [
  {
    id: '1',
    claim_number: 'PRO-24-00001',
    title: 'Factory Fire Damage - Building A',
    description: 'Fire broke out in the manufacturing unit causing significant damage to equipment.',
    line_of_business: 'property',
    status: 'in_progress',
    severity: 'high',
    incident_date: '2024-01-15',
    incident_location: 'Plant A, Industrial Area, Mumbai',
    policy_reference: 'POL-PROP-2024-001',
    estimated_loss: 5000000,
    reserve_amount: 4500000,
    actual_payment: 0,
    recovery_amount: 0,
    created_by: 'John Handler',
    assigned_to: 'Jane Finance',
    created_at: '2024-01-16T10:30:00Z',
    updated_at: '2024-01-20T14:00:00Z',
  },
  {
    id: '2',
    claim_number: 'MAR-24-00001',
    title: 'Cargo Damage - Shipment to USA',
    description: 'Container cargo damaged during transit due to rough sea conditions.',
    line_of_business: 'marine',
    status: 'pending_approval',
    severity: 'medium',
    incident_date: '2024-01-10',
    incident_location: 'Port of Mumbai to Port of Los Angeles',
    policy_reference: 'POL-MAR-2024-005',
    estimated_loss: 1200000,
    reserve_amount: 1000000,
    actual_payment: 0,
    recovery_amount: 0,
    created_by: 'Sarah Head',
    assigned_to: 'Bob Legal',
    created_at: '2024-01-12T08:00:00Z',
    updated_at: '2024-01-18T11:30:00Z',
  },
  {
    id: '3',
    claim_number: 'CYB-24-00001',
    title: 'Ransomware Attack on ERP System',
    description: 'Cybersecurity breach resulting in ransomware encryption of critical systems.',
    line_of_business: 'cyber',
    status: 'open',
    severity: 'critical',
    incident_date: '2024-01-20',
    incident_location: 'Corporate IT Infrastructure',
    policy_reference: 'POL-CYB-2024-002',
    estimated_loss: 8000000,
    reserve_amount: 7500000,
    actual_payment: 0,
    recovery_amount: 0,
    created_by: 'Mike Auditor',
    assigned_to: null,
    created_at: '2024-01-20T16:00:00Z',
    updated_at: '2024-01-20T16:00:00Z',
  },
  {
    id: '4',
    claim_number: 'CGL-24-00001',
    title: 'Visitor Injury at Manufacturing Plant',
    description: 'Third-party visitor injured due to equipment malfunction.',
    line_of_business: 'cgl',
    status: 'approved',
    severity: 'medium',
    incident_date: '2024-01-05',
    incident_location: 'Visitor Lounge, Plant B, Delhi',
    policy_reference: 'POL-CGL-2024-010',
    estimated_loss: 500000,
    reserve_amount: 450000,
    actual_payment: 400000,
    recovery_amount: 0,
    created_by: 'John Handler',
    assigned_to: 'Jane Finance',
    created_at: '2024-01-06T09:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
  },
  {
    id: '5',
    claim_number: 'PRC-24-00001',
    title: 'Product Recall - Batch XY2024',
    description: 'Recall of defective products from batch XY2024 due to quality issues.',
    line_of_business: 'product_recall',
    status: 'closed',
    severity: 'high',
    incident_date: '2023-12-15',
    incident_location: 'All Distribution Centers',
    policy_reference: 'POL-PRC-2023-008',
    estimated_loss: 3000000,
    reserve_amount: 2800000,
    actual_payment: 2500000,
    recovery_amount: 200000,
    created_by: 'Sarah Head',
    assigned_to: 'Jane Finance',
    created_at: '2023-12-16T11:00:00Z',
    updated_at: '2024-01-15T16:00:00Z',
  },
];

const getStatusConfig = (status: ClaimStatus) => {
  const configs: Record<ClaimStatus, { label: string; color: string; icon: React.ElementType }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
    open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp },
    pending_approval: { label: 'Pending Approval', color: 'bg-purple-100 text-purple-700', icon: Clock },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  };
  return configs[status];
};

const getSeverityConfig = (severity: Severity) => {
  const configs: Record<Severity, { label: string; color: string }> = {
    low: { label: 'Low', color: 'bg-green-100 text-green-700' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
    critical: { label: 'Critical', color: 'bg-red-100 text-red-700' },
  };
  return configs[severity];
};

const getLOBIcon = (lob: LineOfBusiness) => {
  const icons: Record<LineOfBusiness, React.ElementType> = {
    property: Building,
    marine: Ship,
    cyber: Monitor,
    cgl: Scale,
    product_recall: Package,
    product_guarantee: Shield,
  };
  return icons[lob];
};

export function ClaimsList() {
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lobFilter, setLobFilter] = useState<string>('all');
  const [showNewClaimForm, setShowNewClaimForm] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policy_reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesLOB = lobFilter === 'all' || claim.line_of_business === lobFilter;
    return matchesSearch && matchesStatus && matchesLOB;
  });

  const handleNewClaim = (data: ClaimFormData, saveAsDraft: boolean) => {
    const newClaim: Claim = {
      id: Date.now().toString(),
      claim_number: `NEW-24-${String(claims.length + 1).padStart(5, '0')}`,
      ...data,
      status: saveAsDraft ? 'draft' : 'open',
      reserve_amount: 0,
      actual_payment: 0,
      recovery_amount: 0,
      created_by: 'Current User',
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setClaims([newClaim, ...claims]);
    setShowNewClaimForm(false);
  };

  if (showNewClaimForm) {
    return (
      <div className="p-6">
        <ClaimIntakeForm
          onSubmit={handleNewClaim}
          onCancel={() => setShowNewClaimForm(false)}
        />
      </div>
    );
  }

  if (selectedClaim) {
    return (
      <ClaimDetail 
        claim={selectedClaim} 
        onBack={() => setSelectedClaim(null)}
        onUpdate={(updatedClaim) => {
          setClaims(claims.map(c => c.id === updatedClaim.id ? updatedClaim : c));
          setSelectedClaim(updatedClaim);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Claims Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage insurance claims across all lines of business</p>
        </div>
        <button
          onClick={() => setShowNewClaimForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Claim
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Claims</p>
              <p className="text-xl font-bold text-gray-900">{claims.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {claims.filter(c => ['open', 'in_progress', 'pending_approval'].includes(c.status)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-xl font-bold text-gray-900">
                {claims.filter(c => c.severity === 'critical' && c.status !== 'closed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reserves</p>
              <p className="text-xl font-bold text-gray-900">
                {(claims.reduce((sum, c) => sum + c.reserve_amount, 0) / 10000000).toFixed(1)}Cr
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
              placeholder="Search claims by number, title, or policy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <select
              value={lobFilter}
              onChange={(e) => setLobFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All LOB</option>
              <option value="property">Property</option>
              <option value="marine">Marine</option>
              <option value="cyber">Cyber</option>
              <option value="cgl">CGL</option>
              <option value="product_recall">Product Recall</option>
              <option value="product_guarantee">Product Guarantee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  LOB
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estimated Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => {
                const statusConfig = getStatusConfig(claim.status);
                const severityConfig = getSeverityConfig(claim.severity);
                const LOBIcon = getLOBIcon(claim.line_of_business);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{claim.claim_number}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{claim.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <LOBIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 capitalize">
                          {claim.line_of_business.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityConfig.color}`}>
                        {severityConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        INR {claim.estimated_loss.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(claim.incident_date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit claim"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No claims found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ClaimDetailProps {
  claim: Claim;
  onBack: () => void;
  onUpdate: (claim: Claim) => void;
}

function ClaimDetail({ claim, onBack, onUpdate }: ClaimDetailProps) {
  const statusConfig = getStatusConfig(claim.status);
  const severityConfig = getSeverityConfig(claim.severity);
  const LOBIcon = getLOBIcon(claim.line_of_business);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Claims
        </button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-500">{claim.claim_number}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityConfig.color}`}>
                {severityConfig.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{claim.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Edit Claim
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Submit for Approval
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Line of Business</p>
                <div className="flex items-center gap-2">
                  <LOBIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">
                    {claim.line_of_business.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Policy Reference</p>
                <p className="font-medium text-gray-900">{claim.policy_reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Incident Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(claim.incident_date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Incident Location</p>
                <p className="font-medium text-gray-900">{claim.incident_location}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-700">{claim.description}</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-1">Estimated Loss</p>
                <p className="text-xl font-bold text-blue-900">
                  INR {claim.estimated_loss.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-600 mb-1">Reserve Amount</p>
                <p className="text-xl font-bold text-yellow-900">
                  INR {claim.reserve_amount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-1">Actual Payment</p>
                <p className="text-xl font-bold text-green-900">
                  INR {claim.actual_payment.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 mb-1">Recovery</p>
                <p className="text-xl font-bold text-purple-900">
                  INR {claim.recovery_amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Claim created</p>
                  <p className="text-xs text-gray-500">
                    {new Date(claim.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Last updated</p>
                  <p className="text-xs text-gray-500">
                    {new Date(claim.updated_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created By</p>
                <p className="font-medium text-gray-900">{claim.created_by}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                <p className="font-medium text-gray-900">{claim.assigned_to || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
