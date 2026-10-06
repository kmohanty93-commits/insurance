'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Search,
  Filter,
  Edit2,
  Eye,
  X,
  Save,
  PiggyBank,
  CreditCard,
  RefreshCw,
  BarChart3
} from 'lucide-react';

type TransactionType = 'reserve' | 'payment' | 'recovery' | 'adjustment';

interface FinancialTransaction {
  id: string;
  claim_id: string;
  claim_number: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  reference_number: string;
  transaction_date: string;
  created_by: string;
  approved_by: string | null;
  created_at: string;
}

interface ClaimFinancialSummary {
  claim_id: string;
  claim_number: string;
  claim_title: string;
  line_of_business: string;
  estimated_loss: number;
  total_reserve: number;
  total_payments: number;
  total_recoveries: number;
  net_incurred: number;
  status: string;
}

const mockTransactions: FinancialTransaction[] = [
  {
    id: '1',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    transaction_type: 'reserve',
    amount: 4500000,
    currency: 'INR',
    description: 'Initial reserve based on surveyor assessment',
    reference_number: 'RES-2024-001',
    transaction_date: '2024-01-18',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '2',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    transaction_type: 'payment',
    amount: 1500000,
    currency: 'INR',
    description: 'Partial payment for emergency repairs',
    reference_number: 'PAY-2024-001',
    transaction_date: '2024-01-22',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2024-01-22T14:30:00Z',
  },
  {
    id: '3',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    transaction_type: 'reserve',
    amount: 1000000,
    currency: 'INR',
    description: 'Initial reserve for cargo damage claim',
    reference_number: 'RES-2024-002',
    transaction_date: '2024-01-14',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2024-01-14T11:00:00Z',
  },
  {
    id: '4',
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    transaction_type: 'reserve',
    amount: 450000,
    currency: 'INR',
    description: 'Reserve for third-party liability claim',
    reference_number: 'RES-2024-003',
    transaction_date: '2024-01-08',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2024-01-08T09:00:00Z',
  },
  {
    id: '5',
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    transaction_type: 'payment',
    amount: 400000,
    currency: 'INR',
    description: 'Final settlement payment',
    reference_number: 'PAY-2024-002',
    transaction_date: '2024-01-22',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2024-01-22T16:00:00Z',
  },
  {
    id: '6',
    claim_id: '5',
    claim_number: 'PRC-24-00001',
    transaction_type: 'reserve',
    amount: 2800000,
    currency: 'INR',
    description: 'Reserve for product recall costs',
    reference_number: 'RES-2024-004',
    transaction_date: '2023-12-18',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2023-12-18T10:00:00Z',
  },
  {
    id: '7',
    claim_id: '5',
    claim_number: 'PRC-24-00001',
    transaction_type: 'payment',
    amount: 2500000,
    currency: 'INR',
    description: 'Payment for recall logistics and refunds',
    reference_number: 'PAY-2024-003',
    transaction_date: '2024-01-10',
    created_by: 'Jane Finance',
    approved_by: 'Admin User',
    created_at: '2024-01-10T14:00:00Z',
  },
  {
    id: '8',
    claim_id: '5',
    claim_number: 'PRC-24-00001',
    transaction_type: 'recovery',
    amount: 200000,
    currency: 'INR',
    description: 'Recovery from supplier for defective components',
    reference_number: 'REC-2024-001',
    transaction_date: '2024-01-15',
    created_by: 'Jane Finance',
    approved_by: null,
    created_at: '2024-01-15T11:00:00Z',
  },
];

const mockSummaries: ClaimFinancialSummary[] = [
  {
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    claim_title: 'Factory Fire Damage - Building A',
    line_of_business: 'property',
    estimated_loss: 5000000,
    total_reserve: 4500000,
    total_payments: 1500000,
    total_recoveries: 0,
    net_incurred: 1500000,
    status: 'in_progress',
  },
  {
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    claim_title: 'Cargo Damage - Shipment to USA',
    line_of_business: 'marine',
    estimated_loss: 1200000,
    total_reserve: 1000000,
    total_payments: 0,
    total_recoveries: 0,
    net_incurred: 0,
    status: 'pending_approval',
  },
  {
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    claim_title: 'Visitor Injury at Manufacturing Plant',
    line_of_business: 'cgl',
    estimated_loss: 500000,
    total_reserve: 450000,
    total_payments: 400000,
    total_recoveries: 0,
    net_incurred: 400000,
    status: 'closed',
  },
  {
    claim_id: '5',
    claim_number: 'PRC-24-00001',
    claim_title: 'Product Recall - Batch XY2024',
    line_of_business: 'product_recall',
    estimated_loss: 3000000,
    total_reserve: 2800000,
    total_payments: 2500000,
    total_recoveries: 200000,
    net_incurred: 2300000,
    status: 'closed',
  },
];

const transactionTypeConfig: Record<TransactionType, { label: string; color: string; icon: React.ElementType; direction: 'in' | 'out' }> = {
  reserve: { label: 'Reserve', color: 'bg-blue-100 text-blue-700', icon: PiggyBank, direction: 'out' },
  payment: { label: 'Payment', color: 'bg-red-100 text-red-700', icon: CreditCard, direction: 'out' },
  recovery: { label: 'Recovery', color: 'bg-green-100 text-green-700', icon: RefreshCw, direction: 'in' },
  adjustment: { label: 'Adjustment', color: 'bg-yellow-100 text-yellow-700', icon: Edit2, direction: 'out' },
};

const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function FinancialTracker() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [summaries] = useState<ClaimFinancialSummary[]>(mockSummaries);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [claimFilter, setClaimFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'transactions' | 'summary'>('summary');
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  // Calculate totals
  const totalReserves = transactions
    .filter(t => t.transaction_type === 'reserve')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalPayments = transactions
    .filter(t => t.transaction_type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRecoveries = transactions
    .filter(t => t.transaction_type === 'recovery')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncurred = totalPayments - totalRecoveries;

  const uniqueClaims = Array.from(new Set(transactions.map(t => t.claim_number)));

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.transaction_type === typeFilter;
    const matchesClaim = claimFilter === 'all' || t.claim_number === claimFilter;
    return matchesSearch && matchesType && matchesClaim;
  });

  const handleAddTransaction = (transaction: Omit<FinancialTransaction, 'id' | 'created_at'>) => {
    const newTransaction: FinancialTransaction = {
      ...transaction,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowNewTransactionModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-blue-600" />
            Reserve & Financial Tracking
          </h1>
          <p className="text-gray-600 mt-1">
            Track reserves, payments, and recoveries across all claims
          </p>
        </div>
        <button
          onClick={() => setShowNewTransactionModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PiggyBank className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">Total Reserves</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReserves)}</p>
          <p className="text-xs text-gray-500 mt-1">Across all claims</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <ArrowUpRight className="w-3 h-3" />
              <span className="text-xs font-medium">Payments</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayments)}</p>
          <p className="text-xs text-gray-500 mt-1">Total paid out</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowDownRight className="w-3 h-3" />
              <span className="text-xs font-medium">Recoveries</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRecoveries)}</p>
          <p className="text-xs text-gray-500 mt-1">Total recovered</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">Net Incurred</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(netIncurred)}</p>
          <p className="text-xs text-gray-500 mt-1">Payments - Recoveries</p>
        </div>
      </div>

      {/* View Toggle & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              By Claim
            </button>
            <button
              onClick={() => setViewMode('transactions')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'transactions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Transactions
            </button>
          </div>

          {viewMode === 'transactions' && (
            <>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {Object.entries(transactionTypeConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              <select
                value={claimFilter}
                onChange={(e) => setClaimFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Claims</option>
                {uniqueClaims.map(claim => (
                  <option key={claim} value={claim}>{claim}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'summary' ? (
        <div className="space-y-4">
          {summaries.map(summary => {
            const reserveUtilization = summary.total_reserve > 0 
              ? (summary.total_payments / summary.total_reserve) * 100 
              : 0;

            return (
              <div
                key={summary.claim_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">{summary.claim_number}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                        {summary.line_of_business.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        summary.status === 'closed' ? 'bg-gray-100 text-gray-600' :
                        summary.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {summary.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{summary.claim_title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Estimated Loss</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.estimated_loss)}</p>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 mb-1">Reserve</p>
                    <p className="font-semibold text-blue-900">{formatCurrency(summary.total_reserve)}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 mb-1">Payments</p>
                    <p className="font-semibold text-red-900">{formatCurrency(summary.total_payments)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 mb-1">Recoveries</p>
                    <p className="font-semibold text-green-900">{formatCurrency(summary.total_recoveries)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600 mb-1">Net Incurred</p>
                    <p className="font-semibold text-purple-900">{formatCurrency(summary.net_incurred)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(summary.total_reserve - summary.total_payments)}
                    </p>
                  </div>
                </div>

                {/* Reserve Utilization Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Reserve Utilization</span>
                    <span className="font-medium text-gray-900">{reserveUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        reserveUtilization > 90 ? 'bg-red-500' :
                        reserveUtilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(reserveUtilization, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Transactions List */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
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
              {filteredTransactions.map(transaction => {
                const typeConfig = transactionTypeConfig[transaction.transaction_type];
                const TypeIcon = typeConfig.icon;

                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.reference_number}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{transaction.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{transaction.claim_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${
                        typeConfig.direction === 'in' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {typeConfig.direction === 'in' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(transaction.transaction_date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      )}

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <NewTransactionModal
          onClose={() => setShowNewTransactionModal(false)}
          onSave={handleAddTransaction}
          claims={uniqueClaims}
        />
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

interface NewTransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Omit<FinancialTransaction, 'id' | 'created_at'>) => void;
  claims: string[];
}

function NewTransactionModal({ onClose, onSave, claims }: NewTransactionModalProps) {
  const [formData, setFormData] = useState({
    claim_number: claims[0] || '',
    claim_id: '1',
    transaction_type: 'payment' as TransactionType,
    amount: 0,
    currency: 'INR',
    description: '',
    reference_number: `TXN-${Date.now()}`,
    transaction_date: new Date().toISOString().split('T')[0],
    created_by: 'Current User',
    approved_by: null as string | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">New Financial Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.claim_number}
                onChange={(e) => setFormData({ ...formData, claim_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {claims.map(claim => (
                  <option key={claim} value={claim}>{claim}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as TransactionType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(transactionTypeConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="1000"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <input
              type="text"
              value={formData.reference_number}
              onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter transaction description"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TransactionDetailModalProps {
  transaction: FinancialTransaction;
  onClose: () => void;
}

function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  const typeConfig = transactionTypeConfig[transaction.transaction_type];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-xl ${typeConfig.color}`}>
              <TypeIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{transaction.reference_number}</p>
              <p className={`text-2xl font-bold ${
                typeConfig.direction === 'in' ? 'text-green-600' : 'text-gray-900'
              }`}>
                {typeConfig.direction === 'in' ? '+' : '-'}
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Claim Number</span>
              <span className="font-medium text-gray-900">{transaction.claim_number}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Transaction Date</span>
              <span className="font-medium text-gray-900">
                {new Date(transaction.transaction_date).toLocaleDateString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Created By</span>
              <span className="font-medium text-gray-900">{transaction.created_by}</span>
            </div>
            {transaction.approved_by && (
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Approved By</span>
                <span className="font-medium text-gray-900">{transaction.approved_by}</span>
              </div>
            )}
            <div className="py-2">
              <span className="text-gray-500 block mb-1">Description</span>
              <p className="font-medium text-gray-900">{transaction.description}</p>
            </div>
          </div>
        </div>

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
