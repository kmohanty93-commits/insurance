'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  FileText,
  Building,
  Tag,
  CheckSquare,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Calendar,
  User,
  X,
  Save,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Master Data Types
type MasterDataType = 'claim_type' | 'document_type' | 'sop' | 'department' | 'severity' | 'approval_level';

interface MasterDataItem {
  id: string;
  type: MasterDataType;
  code: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  sort_order: number;
  active: boolean;
  created_at: string;
}

// Lessons Learned Types
interface LessonLearned {
  id: string;
  claim_id: string;
  claim_number: string;
  claim_title: string;
  title: string;
  description: string;
  category: string;
  root_cause: string;
  recommendations: string;
  preventive_actions: string;
  tags: string[];
  created_by: string;
  created_at: string;
}

const mockMasterData: MasterDataItem[] = [
  // Departments
  { id: '1', type: 'department', code: 'production', name: 'Production', description: 'Manufacturing and production department', metadata: {}, sort_order: 1, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', type: 'department', code: 'quality', name: 'Quality', description: 'Quality assurance and control department', metadata: {}, sort_order: 2, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', type: 'department', code: 'finance', name: 'Finance', description: 'Finance and accounting department', metadata: {}, sort_order: 3, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', type: 'department', code: 'legal', name: 'Legal', description: 'Legal and compliance department', metadata: {}, sort_order: 4, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', type: 'department', code: 'hr', name: 'HR', description: 'Human resources department', metadata: {}, sort_order: 5, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '6', type: 'department', code: 'logistics', name: 'Logistics', description: 'Logistics and supply chain department', metadata: {}, sort_order: 6, active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Document Types
  { id: '7', type: 'document_type', code: 'fir', name: 'FIR/Police Report', description: 'First Information Report or Police Report', metadata: { required_for: ['property', 'cgl'] }, sort_order: 1, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '8', type: 'document_type', code: 'survey_report', name: 'Survey Report', description: 'Surveyor assessment report', metadata: { required_for: ['property', 'marine'] }, sort_order: 2, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '9', type: 'document_type', code: 'invoice', name: 'Invoice', description: 'Purchase or repair invoice', metadata: {}, sort_order: 3, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '10', type: 'document_type', code: 'photo', name: 'Photograph', description: 'Photographic evidence', metadata: {}, sort_order: 4, active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // SOPs
  { id: '11', type: 'sop', code: 'sop_property', name: 'Property Claim SOP', description: 'Standard operating procedure for property damage claims', metadata: { version: '2.0', effective_date: '2024-01-01' }, sort_order: 1, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '12', type: 'sop', code: 'sop_marine', name: 'Marine Cargo SOP', description: 'Standard operating procedure for marine cargo claims', metadata: { version: '1.5', effective_date: '2023-07-01' }, sort_order: 2, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '13', type: 'sop', code: 'sop_cyber', name: 'Cyber Incident SOP', description: 'Standard operating procedure for cyber security incidents', metadata: { version: '3.0', effective_date: '2024-01-15' }, sort_order: 3, active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Approval Levels
  { id: '14', type: 'approval_level', code: 'dept_head', name: 'Department Head', description: 'First level approval by department head', metadata: { level: 1 }, sort_order: 1, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '15', type: 'approval_level', code: 'finance', name: 'Finance Approval', description: 'Financial review and approval', metadata: { level: 2 }, sort_order: 2, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '16', type: 'approval_level', code: 'legal', name: 'Legal Approval', description: 'Legal review and approval', metadata: { level: 3 }, sort_order: 3, active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '17', type: 'approval_level', code: 'management', name: 'Management Approval', description: 'Final management approval', metadata: { level: 4 }, sort_order: 4, active: true, created_at: '2024-01-01T00:00:00Z' },
];

const mockLessonsLearned: LessonLearned[] = [
  {
    id: '1',
    claim_id: '5',
    claim_number: 'PRC-24-00001',
    claim_title: 'Product Recall - Batch XY2024',
    title: 'Improved Quality Control for Component Suppliers',
    description: 'During the product recall investigation, it was discovered that the defect originated from a third-party component supplier. The issue went undetected during incoming quality inspection.',
    category: 'Quality Control',
    root_cause: 'Inadequate incoming inspection procedures for critical components from new suppliers',
    recommendations: '1. Implement enhanced incoming inspection for all critical components\n2. Require supplier quality certifications before approval\n3. Conduct periodic supplier audits\n4. Maintain dual-source suppliers for critical parts',
    preventive_actions: 'New supplier qualification process implemented. Incoming inspection checklist updated to include additional tests for component XY.',
    tags: ['quality', 'supplier', 'inspection', 'product-recall'],
    created_by: 'Sarah Head',
    created_at: '2024-01-15T14:00:00Z',
  },
  {
    id: '2',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    claim_title: 'Factory Fire Damage - Building A',
    title: 'Fire Safety Protocol Enhancement',
    description: 'The fire incident highlighted gaps in our emergency response procedures and fire detection systems in the manufacturing area.',
    category: 'Safety',
    root_cause: 'Delayed fire detection due to inadequate sensor coverage in storage area. Emergency response was delayed due to unclear evacuation procedures.',
    recommendations: '1. Install additional fire sensors in all storage areas\n2. Conduct quarterly fire drills\n3. Update emergency response protocols\n4. Install automatic fire suppression in high-risk zones',
    preventive_actions: 'Fire detection system upgrade scheduled for Q2 2024. Emergency response training completed for all staff.',
    tags: ['fire-safety', 'emergency-response', 'property'],
    created_by: 'John Handler',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    claim_id: '3',
    claim_number: 'CYB-24-00001',
    claim_title: 'Ransomware Attack on ERP System',
    title: 'Cybersecurity Defense Strengthening',
    description: 'The ransomware attack exploited vulnerabilities in our network perimeter and outdated endpoint protection software.',
    category: 'IT Security',
    root_cause: 'Phishing email successfully delivered malware due to outdated email filtering. Endpoint protection signatures were 2 weeks behind.',
    recommendations: '1. Implement advanced email threat protection\n2. Enable automatic updates for all security software\n3. Conduct regular penetration testing\n4. Implement network segmentation\n5. Regular security awareness training',
    preventive_actions: 'New EDR solution deployed. Email security gateway upgraded. Security awareness training program launched.',
    tags: ['cybersecurity', 'ransomware', 'it-security', 'phishing'],
    created_by: 'Mike Auditor',
    created_at: '2024-01-22T16:00:00Z',
  },
];

const typeConfig: Record<MasterDataType, { label: string; icon: React.ElementType; color: string }> = {
  claim_type: { label: 'Claim Types', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  document_type: { label: 'Document Types', icon: FileText, color: 'bg-green-100 text-green-700' },
  sop: { label: 'SOPs', icon: BookOpen, color: 'bg-purple-100 text-purple-700' },
  department: { label: 'Departments', icon: Building, color: 'bg-orange-100 text-orange-700' },
  severity: { label: 'Severity Levels', icon: Tag, color: 'bg-red-100 text-red-700' },
  approval_level: { label: 'Approval Levels', icon: CheckSquare, color: 'bg-yellow-100 text-yellow-700' },
};

export function MasterDataLibrary() {
  const [masterData, setMasterData] = useState<MasterDataItem[]>(mockMasterData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);

  const filteredData = masterData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, MasterDataItem[]>);

  const handleSave = (item: MasterDataItem) => {
    if (editingItem) {
      setMasterData(masterData.map(d => d.id === item.id ? item : d));
    } else {
      setMasterData([...masterData, { ...item, id: Date.now().toString(), created_at: new Date().toISOString() }]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMasterData(masterData.filter(d => d.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setMasterData(masterData.map(d => 
      d.id === id ? { ...d, active: !d.active } : d
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-7 h-7 text-blue-600" />
            Master Data Library
          </h1>
          <p className="text-gray-600 mt-1">
            Manage claim types, document types, SOPs, and system configurations
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search master data..."
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
            {Object.entries(typeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Groups */}
      <div className="space-y-6">
        {Object.entries(groupedData).map(([type, items]) => {
          const config = typeConfig[type as MasterDataType];
          const TypeIcon = config?.icon || FileText;

          return (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <TypeIcon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{config?.label || type}</h3>
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                  {items.length}
                </span>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map(item => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                          {item.code}
                        </span>
                        <span className="font-medium text-gray-900">{item.name}</span>
                        {!item.active && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(item.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          item.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(groupedData).length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No master data found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <MasterDataModal
          item={editingItem}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface MasterDataModalProps {
  item: MasterDataItem | null;
  onSave: (item: MasterDataItem) => void;
  onClose: () => void;
}

function MasterDataModal({ item, onSave, onClose }: MasterDataModalProps) {
  const [formData, setFormData] = useState<Partial<MasterDataItem>>(
    item || {
      type: 'department',
      code: '',
      name: '',
      description: '',
      metadata: {},
      sort_order: 0,
      active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as MasterDataItem);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Master Data' : 'Add Master Data'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MasterDataType })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(typeConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., dept_finance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description of this item"
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
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Lessons Learned Repository Component
export function LessonsLearnedRepository() {
  const [lessons, setLessons] = useState<LessonLearned[]>(mockLessonsLearned);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = Array.from(new Set(lessons.map(l => l.category)));

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || lesson.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-yellow-500" />
            Lessons Learned Repository
          </h1>
          <p className="text-gray-600 mt-1">
            Capture and share knowledge from past claims to improve future handling
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Lesson
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Lessons</p>
          <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-900">
            {lessons.filter(l => new Date(l.created_at).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Claims Referenced</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(lessons.map(l => l.claim_id)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons, claims, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.map(lesson => {
          const isExpanded = expandedLesson === lesson.id;

          return (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        {lesson.category}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        {lesson.claim_number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lesson.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right text-sm text-gray-500">
                      <p>{lesson.created_by}</p>
                      <p className="text-xs">{new Date(lesson.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-2">Root Cause</h4>
                      <p className="text-sm text-red-800">{lesson.root_cause}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Preventive Actions</h4>
                      <p className="text-sm text-green-800">{lesson.preventive_actions}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
                    <p className="text-sm text-blue-800 whitespace-pre-line">{lesson.recommendations}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    <p>Related Claim: <span className="font-medium text-gray-900">{lesson.claim_title}</span></p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredLessons.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No lessons found</p>
          </div>
        )}
      </div>

      {/* Add Lesson Modal - simplified */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Lesson Learned</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">
                Lesson creation form would go here with fields for title, description, 
                root cause, recommendations, preventive actions, and tags.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
