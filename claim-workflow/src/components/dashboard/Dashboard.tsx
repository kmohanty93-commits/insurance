'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  Ship,
  Monitor,
  Scale,
  Package,
  Shield,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// Dashboard data
const claimsByStatus = [
  { name: 'Open', value: 3, color: '#3B82F6' },
  { name: 'In Progress', value: 5, color: '#F59E0B' },
  { name: 'Pending Approval', value: 4, color: '#8B5CF6' },
  { name: 'Approved', value: 8, color: '#10B981' },
  { name: 'Closed', value: 15, color: '#6B7280' },
  { name: 'Rejected', value: 2, color: '#EF4444' },
];

const claimsByLOB = [
  { name: 'Property', claims: 12, amount: 45000000, color: '#3B82F6' },
  { name: 'Marine', claims: 8, amount: 28000000, color: '#06B6D4' },
  { name: 'Cyber', claims: 5, amount: 35000000, color: '#8B5CF6' },
  { name: 'CGL', claims: 6, amount: 15000000, color: '#F59E0B' },
  { name: 'Product Recall', claims: 4, amount: 22000000, color: '#EF4444' },
  { name: 'Product Guarantee', claims: 2, amount: 5000000, color: '#10B981' },
];

const monthlyTrend = [
  { month: 'Jul', claims: 5, amount: 8500000 },
  { month: 'Aug', claims: 7, amount: 12000000 },
  { month: 'Sep', claims: 4, amount: 6500000 },
  { month: 'Oct', claims: 8, amount: 15000000 },
  { month: 'Nov', claims: 6, amount: 11000000 },
  { month: 'Dec', claims: 9, amount: 18500000 },
  { month: 'Jan', claims: 11, amount: 22000000 },
];

const agingAnalysis = [
  { range: '0-30 days', count: 8, amount: 25000000 },
  { range: '31-60 days', count: 5, amount: 18000000 },
  { range: '61-90 days', count: 4, amount: 22000000 },
  { range: '91-180 days', count: 3, amount: 15000000 },
  { range: '180+ days', count: 2, amount: 12000000 },
];

const departmentPerformance = [
  { department: 'Production', tasksCompleted: 45, avgDays: 3.2 },
  { department: 'Quality', tasksCompleted: 38, avgDays: 4.1 },
  { department: 'Finance', tasksCompleted: 52, avgDays: 2.8 },
  { department: 'Legal', tasksCompleted: 28, avgDays: 5.5 },
  { department: 'HR', tasksCompleted: 15, avgDays: 2.1 },
  { department: 'Logistics', tasksCompleted: 32, avgDays: 3.8 },
];

const recentClaims = [
  { id: 'CYB-24-00001', title: 'Ransomware Attack on ERP System', lob: 'cyber', status: 'open', amount: 8000000, days: 2 },
  { id: 'PRO-24-00001', title: 'Factory Fire Damage - Building A', lob: 'property', status: 'in_progress', amount: 5000000, days: 8 },
  { id: 'MAR-24-00001', title: 'Cargo Damage - Shipment to USA', lob: 'marine', status: 'pending_approval', amount: 1200000, days: 12 },
  { id: 'CGL-24-00001', title: 'Visitor Injury at Manufacturing Plant', lob: 'cgl', status: 'approved', amount: 500000, days: 18 },
  { id: 'PRC-24-00001', title: 'Product Recall - Batch XY2024', lob: 'product_recall', status: 'closed', amount: 3000000, days: 35 },
];

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }
  return value.toLocaleString('en-IN');
};

const getLOBIcon = (lob: string) => {
  const icons: Record<string, React.ElementType> = {
    property: Building,
    marine: Ship,
    cyber: Monitor,
    cgl: Scale,
    product_recall: Package,
    product_guarantee: Shield,
  };
  return icons[lob] || FileText;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    pending_approval: 'bg-purple-100 text-purple-700',
    approved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export function Dashboard() {
  const [dateRange, setDateRange] = useState('30');

  const totalClaims = claimsByStatus.reduce((sum, s) => sum + s.value, 0);
  const openClaims = claimsByStatus.filter(s => ['Open', 'In Progress', 'Pending Approval'].includes(s.name))
    .reduce((sum, s) => sum + s.value, 0);
  const totalReserves = claimsByLOB.reduce((sum, l) => sum + l.amount, 0);
  const avgClaimValue = totalReserves / totalClaims;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Dashboard & Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time overview of claims performance and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalClaims}</p>
          <p className="text-sm text-gray-500">Total Claims</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+3</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{openClaims}</p>
          <p className="text-sm text-gray-500">Open Claims</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <ArrowDownRight className="w-3 h-3" />
              <span>-5%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">INR {formatCurrency(totalReserves)}</p>
          <p className="text-sm text-gray-500">Total Reserves</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">INR {formatCurrency(avgClaimValue)}</p>
          <p className="text-sm text-gray-500">Avg. Claim Value</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Claims by Status - Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Claims by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={claimsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claims by LOB - Bar Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Claims by Line of Business</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsByLOB}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                <Bar dataKey="claims" fill="#3B82F6" name="Claims" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend - Area Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Claims Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => {
                  if (typeof value === 'number') {
                    return name === 'amount' ? `INR ${formatCurrency(value)}` : value;
                  }
                  return value;
                }} />
                <Legend />
                <Area type="monotone" dataKey="claims" stroke="#3B82F6" fill="#3B82F680" name="Claims" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aging Analysis - Bar Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Aging Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingAnalysis} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                <Bar dataKey="count" fill="#F59E0B" name="Claims" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Claims */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Claims</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-3">
            {recentClaims.map(claim => {
              const LOBIcon = getLOBIcon(claim.lob);
              return (
                <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <LOBIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{claim.id}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{claim.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">INR {formatCurrency(claim.amount)}</p>
                      <p className="text-xs text-gray-500">{claim.days} days</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Department Performance</h3>
          <div className="space-y-3">
            {departmentPerformance.map(dept => (
              <div key={dept.department} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{dept.department}</p>
                  <p className="text-xs text-gray-500">{dept.tasksCompleted} tasks completed</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    dept.avgDays <= 3 ? 'text-green-600' :
                    dept.avgDays <= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {dept.avgDays} days
                  </p>
                  <p className="text-xs text-gray-500">avg. completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const [reportType, setReportType] = useState('claims');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [lobFilter, setLobFilter] = useState('all');

  const reportTypes = [
    { id: 'claims', name: 'Claims Summary Report', description: 'Overview of all claims with status and financials' },
    { id: 'financial', name: 'Financial Report', description: 'Reserves, payments, and recoveries breakdown' },
    { id: 'aging', name: 'Aging Report', description: 'Claims aged by days outstanding' },
    { id: 'department', name: 'Department Performance', description: 'Task completion metrics by department' },
    { id: 'lob', name: 'Line of Business Analysis', description: 'Claims analysis by insurance line' },
    { id: 'audit', name: 'Audit Trail Report', description: 'Complete activity log for compliance' },
  ];

  const handleGenerateReport = () => {
    alert(`Generating ${reportType} report...`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Generate and export detailed reports for analysis and compliance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map(report => (
                <button
                  key={report.id}
                  onClick={() => setReportType(report.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    reportType === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line of Business</label>
                <select
                  value={lobFilter}
                  onChange={(e) => setLobFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Lines</option>
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
        </div>

        {/* Generate Report */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Generate Report</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Selected Report</p>
              <p className="font-medium text-gray-900">
                {reportTypes.find(r => r.id === reportType)?.name}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Export Format</p>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm">
                  Excel
                </button>
                <button className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm">
                  PDF
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm">
                  CSV
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Generate & Download
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Recent Reports</h4>
            <div className="space-y-2">
              {[
                { name: 'Claims Summary - Jan 2024', date: '2024-01-20', type: 'PDF' },
                { name: 'Financial Report Q4 2023', date: '2024-01-15', type: 'Excel' },
                { name: 'Aging Report - Dec 2023', date: '2024-01-01', type: 'PDF' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {report.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
