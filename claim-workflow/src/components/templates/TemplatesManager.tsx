'use client';

import React, { useState } from 'react';
import { 
  FileCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  FileText,
  Users,
  Building,
  Ship,
  Monitor,
  Scale,
  Package,
  Shield,
  X,
  Save,
  Copy
} from 'lucide-react';
import { LineOfBusiness } from '../claims/ClaimIntakeForm';

interface ChecklistItem {
  id: string;
  title: string;
  required: boolean;
}

interface WorkflowStep {
  step: number;
  title: string;
  department: string;
}

interface ClaimTemplate {
  id: string;
  line_of_business: LineOfBusiness;
  name: string;
  description: string;
  checklist: ChecklistItem[];
  required_documents: string[];
  workflow_steps: WorkflowStep[];
  department_assignees: string[];
  active: boolean;
  created_at: string;
}

const mockTemplates: ClaimTemplate[] = [
  {
    id: '1',
    line_of_business: 'property',
    name: 'Property Damage Claim Template',
    description: 'Standard template for property damage claims including fire, flood, and structural damage.',
    checklist: [
      { id: '1', title: 'Incident report filed', required: true },
      { id: '2', title: 'Photos of damage collected', required: true },
      { id: '3', title: 'Police/FIR report obtained', required: false },
      { id: '4', title: 'Surveyor appointed', required: true },
      { id: '5', title: 'Repair quotations collected', required: true },
      { id: '6', title: 'Asset verification completed', required: true },
    ],
    required_documents: ['FIR/Police Report', 'Survey Report', 'Photographs', 'Repair Quotations', 'Asset Register Extract', 'Policy Document'],
    workflow_steps: [
      { step: 1, title: 'Initial Assessment', department: 'production' },
      { step: 2, title: 'Damage Documentation', department: 'quality' },
      { step: 3, title: 'Financial Assessment', department: 'finance' },
      { step: 4, title: 'Legal Review', department: 'legal' },
    ],
    department_assignees: ['production', 'quality', 'finance', 'legal'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    line_of_business: 'marine',
    name: 'Marine Cargo Claim Template',
    description: 'Standard template for marine cargo damage and loss claims.',
    checklist: [
      { id: '1', title: 'Bill of Lading obtained', required: true },
      { id: '2', title: 'Survey report completed', required: true },
      { id: '3', title: 'Cargo manifest verified', required: true },
      { id: '4', title: 'Shortage/damage certificate obtained', required: true },
      { id: '5', title: 'Customs documentation collected', required: true },
    ],
    required_documents: ['Bill of Lading', 'Survey Report', 'Cargo Manifest', 'Shortage/Damage Certificate', 'Commercial Invoice', 'Packing List', 'Customs Documents'],
    workflow_steps: [
      { step: 1, title: 'Logistics Assessment', department: 'logistics' },
      { step: 2, title: 'Quality Inspection', department: 'quality' },
      { step: 3, title: 'Financial Assessment', department: 'finance' },
      { step: 4, title: 'Legal Review', department: 'legal' },
    ],
    department_assignees: ['logistics', 'quality', 'finance', 'legal'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    line_of_business: 'cyber',
    name: 'Cyber Incident Claim Template',
    description: 'Standard template for cybersecurity incidents and data breach claims.',
    checklist: [
      { id: '1', title: 'Incident detected and logged', required: true },
      { id: '2', title: 'IT forensics initiated', required: true },
      { id: '3', title: 'Data breach assessment completed', required: true },
      { id: '4', title: 'Regulatory notifications sent', required: false },
      { id: '5', title: 'Recovery actions documented', required: true },
    ],
    required_documents: ['Incident Log', 'Forensics Report', 'Data Breach Assessment', 'System Logs', 'Recovery Documentation', 'Third-party Vendor Reports'],
    workflow_steps: [
      { step: 1, title: 'IT Assessment', department: 'it' },
      { step: 2, title: 'Legal/Compliance Review', department: 'legal' },
      { step: 3, title: 'Financial Impact Assessment', department: 'finance' },
      { step: 4, title: 'Management Review', department: 'management' },
    ],
    department_assignees: ['it', 'legal', 'finance', 'management'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    line_of_business: 'cgl',
    name: 'CGL Claim Template',
    description: 'Standard template for Commercial General Liability claims.',
    checklist: [
      { id: '1', title: 'Incident report filed', required: true },
      { id: '2', title: 'Witness statements collected', required: true },
      { id: '3', title: 'Third-party claim documented', required: true },
      { id: '4', title: 'Legal liability assessment', required: true },
      { id: '5', title: 'Settlement negotiations documented', required: false },
    ],
    required_documents: ['Incident Report', 'Witness Statements', 'Third-party Claim Notice', 'Medical Reports', 'Legal Opinion', 'Settlement Documentation'],
    workflow_steps: [
      { step: 1, title: 'Incident Investigation', department: 'production' },
      { step: 2, title: 'HR Assessment', department: 'hr' },
      { step: 3, title: 'Legal Review', department: 'legal' },
      { step: 4, title: 'Financial Assessment', department: 'finance' },
    ],
    department_assignees: ['production', 'hr', 'legal', 'finance'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    line_of_business: 'product_recall',
    name: 'Product Recall Claim Template',
    description: 'Standard template for product recall claims.',
    checklist: [
      { id: '1', title: 'Product defect identified', required: true },
      { id: '2', title: 'Batch/lot tracking completed', required: true },
      { id: '3', title: 'Customer notifications sent', required: true },
      { id: '4', title: 'Recall logistics arranged', required: true },
      { id: '5', title: 'Replacement/refund process initiated', required: true },
    ],
    required_documents: ['Defect Analysis Report', 'Batch/Lot Records', 'Customer Communication', 'Recall Plan', 'Logistics Documentation', 'Financial Impact Assessment'],
    workflow_steps: [
      { step: 1, title: 'Quality Investigation', department: 'quality' },
      { step: 2, title: 'Production Review', department: 'production' },
      { step: 3, title: 'Logistics Coordination', department: 'logistics' },
      { step: 4, title: 'Legal Review', department: 'legal' },
      { step: 5, title: 'Financial Assessment', department: 'finance' },
    ],
    department_assignees: ['quality', 'production', 'logistics', 'legal', 'finance'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    line_of_business: 'product_guarantee',
    name: 'Product Guarantee Claim Template',
    description: 'Standard template for product warranty and guarantee claims.',
    checklist: [
      { id: '1', title: 'Warranty verification completed', required: true },
      { id: '2', title: 'Product defect confirmed', required: true },
      { id: '3', title: 'Repair/replacement assessment', required: true },
      { id: '4', title: 'Customer communication completed', required: true },
    ],
    required_documents: ['Warranty Certificate', 'Defect Report', 'Product Photos', 'Purchase Invoice', 'Repair/Replacement Quotation'],
    workflow_steps: [
      { step: 1, title: 'Quality Assessment', department: 'quality' },
      { step: 2, title: 'Production Review', department: 'production' },
      { step: 3, title: 'Financial Assessment', department: 'finance' },
    ],
    department_assignees: ['quality', 'production', 'finance'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

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

const getLOBColor = (lob: LineOfBusiness) => {
  const colors: Record<LineOfBusiness, string> = {
    property: 'bg-blue-100 text-blue-700',
    marine: 'bg-cyan-100 text-cyan-700',
    cyber: 'bg-purple-100 text-purple-700',
    cgl: 'bg-orange-100 text-orange-700',
    product_recall: 'bg-red-100 text-red-700',
    product_guarantee: 'bg-green-100 text-green-700',
  };
  return colors[lob];
};

export function TemplatesManager() {
  const [templates, setTemplates] = useState<ClaimTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [lobFilter, setLobFilter] = useState<string>('all');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ClaimTemplate | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLOB = lobFilter === 'all' || template.line_of_business === lobFilter;
    return matchesSearch && matchesLOB;
  });

  const handleEditTemplate = (template: ClaimTemplate) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleDuplicateTemplate = (template: ClaimTemplate) => {
    const newTemplate: ClaimTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, active: !t.active } : t
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-blue-600" />
            Line of Business Templates
          </h1>
          <p className="text-gray-600 mt-1">
            Manage predefined templates for each line of business with checklists, documents, and workflows
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={lobFilter}
            onChange={(e) => setLobFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Lines of Business</option>
            <option value="property">Property</option>
            <option value="marine">Marine</option>
            <option value="cyber">Cyber</option>
            <option value="cgl">CGL</option>
            <option value="product_recall">Product Recall</option>
            <option value="product_guarantee">Product Guarantee</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => {
          const LOBIcon = getLOBIcon(template.line_of_business);
          const isExpanded = expandedTemplate === template.id;

          return (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Template Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getLOBColor(template.line_of_business)}`}>
                      <LOBIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        {!template.active && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3" />
                          {template.checklist.length} checklist items
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {template.required_documents.length} documents
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {template.workflow_steps.length} workflow steps
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTemplate(template);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateTemplate(template);
                      }}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Checklist */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                        Checklist Items
                      </h4>
                      <ul className="space-y-2">
                        {template.checklist.map((item) => (
                          <li key={item.id} className="flex items-start gap-2 text-sm">
                            <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 ${
                              item.required ? 'border-red-400 bg-red-50' : 'border-gray-300'
                            }`} />
                            <span className="text-gray-700">
                              {item.title}
                              {item.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        Required Documents
                      </h4>
                      <ul className="space-y-2">
                        {template.required_documents.map((doc, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Workflow Steps */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Workflow Steps
                      </h4>
                      <div className="space-y-2">
                        {template.workflow_steps.map((step) => (
                          <div key={step.step} className="flex items-center gap-3 text-sm">
                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium text-xs">
                              {step.step}
                            </span>
                            <div>
                              <p className="text-gray-900">{step.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{step.department}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Department Assignees */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Auto-Assigned Departments</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.department_assignees.map((dept) => (
                        <span
                          key={dept}
                          className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 capitalize"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Active */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => handleToggleActive(template.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        template.active
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {template.active ? 'Deactivate Template' : 'Activate Template'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No templates found</p>
          </div>
        )}
      </div>

      {/* Template Editor Modal */}
      {showModal && (
        <TemplateEditorModal
          template={editingTemplate}
          onSave={(template) => {
            if (editingTemplate) {
              setTemplates(templates.map(t => t.id === template.id ? template : t));
            } else {
              setTemplates([...templates, { ...template, id: Date.now().toString(), created_at: new Date().toISOString() }]);
            }
            setShowModal(false);
            setEditingTemplate(null);
          }}
          onClose={() => {
            setShowModal(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
}

interface TemplateEditorModalProps {
  template: ClaimTemplate | null;
  onSave: (template: ClaimTemplate) => void;
  onClose: () => void;
}

function TemplateEditorModal({ template, onSave, onClose }: TemplateEditorModalProps) {
  const [formData, setFormData] = useState<Partial<ClaimTemplate>>(
    template || {
      line_of_business: 'property',
      name: '',
      description: '',
      checklist: [],
      required_documents: [],
      workflow_steps: [],
      department_assignees: [],
      active: true,
    }
  );
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newDocument, setNewDocument] = useState('');
  const [newWorkflowStep, setNewWorkflowStep] = useState({ title: '', department: '' });

  const departments = ['production', 'quality', 'finance', 'legal', 'hr', 'logistics', 'it', 'management'];

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklist: [
          ...(formData.checklist || []),
          { id: Date.now().toString(), title: newChecklistItem.trim(), required: false }
        ]
      });
      setNewChecklistItem('');
    }
  };

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setFormData({
        ...formData,
        required_documents: [...(formData.required_documents || []), newDocument.trim()]
      });
      setNewDocument('');
    }
  };

  const handleAddWorkflowStep = () => {
    if (newWorkflowStep.title.trim() && newWorkflowStep.department) {
      const steps = formData.workflow_steps || [];
      setFormData({
        ...formData,
        workflow_steps: [
          ...steps,
          { step: steps.length + 1, title: newWorkflowStep.title.trim(), department: newWorkflowStep.department }
        ]
      });
      setNewWorkflowStep({ title: '', department: '' });
    }
  };

  const handleSave = () => {
    if (formData.name && formData.line_of_business) {
      onSave(formData as ClaimTemplate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Line of Business <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.line_of_business || 'property'}
                  onChange={(e) => setFormData({ ...formData, line_of_business: e.target.value as LineOfBusiness })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="property">Property</option>
                  <option value="marine">Marine</option>
                  <option value="cyber">Cyber</option>
                  <option value="cgl">CGL</option>
                  <option value="product_recall">Product Recall</option>
                  <option value="product_guarantee">Product Guarantee</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template description"
              />
            </div>

            {/* Checklist Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Checklist Items
              </h3>
              <div className="space-y-2 mb-3">
                {(formData.checklist || []).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={item.required}
                      onChange={() => {
                        const newChecklist = [...(formData.checklist || [])];
                        newChecklist[index] = { ...item, required: !item.required };
                        setFormData({ ...formData, checklist: newChecklist });
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="flex-1 text-sm">{item.title}</span>
                    <span className="text-xs text-gray-500">{item.required ? 'Required' : 'Optional'}</span>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          checklist: formData.checklist?.filter((_, i) => i !== index)
                        });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Required Documents Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                Required Documents
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {(formData.required_documents || []).map((doc, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {doc}
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          required_documents: formData.required_documents?.filter((_, i) => i !== index)
                        });
                      }}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  placeholder="Add required document"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDocument()}
                />
                <button
                  onClick={handleAddDocument}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Workflow Steps Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Workflow Steps
              </h3>
              <div className="space-y-2 mb-3">
                {(formData.workflow_steps || []).map((step, index) => (
                  <div key={index} className="flex items-center gap-3 bg-purple-50 p-2 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </span>
                    <span className="flex-1 text-sm">{step.title}</span>
                    <span className="text-xs text-purple-600 capitalize">{step.department}</span>
                    <button
                      onClick={() => {
                        const newSteps = formData.workflow_steps?.filter((_, i) => i !== index)
                          .map((s, i) => ({ ...s, step: i + 1 }));
                        setFormData({ ...formData, workflow_steps: newSteps });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWorkflowStep.title}
                  onChange={(e) => setNewWorkflowStep({ ...newWorkflowStep, title: e.target.value })}
                  placeholder="Step title"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select
                  value={newWorkflowStep.department}
                  onChange={(e) => setNewWorkflowStep({ ...newWorkflowStep, department: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept} className="capitalize">{dept}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddWorkflowStep}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
}
