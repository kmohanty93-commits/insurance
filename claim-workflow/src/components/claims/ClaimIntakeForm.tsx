'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Building2,
  DollarSign,
  User,
  Save,
  Send,
  ArrowLeft,
  CheckCircle,
  Info,
  Building,
  Ship,
  Monitor,
  Scale,
  Package,
  Shield
} from 'lucide-react';

export type LineOfBusiness = 'property' | 'marine' | 'cyber' | 'cgl' | 'product_recall' | 'product_guarantee';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ClaimStatus = 'draft' | 'open' | 'in_progress' | 'pending_approval' | 'approved' | 'closed' | 'rejected';

export interface ClaimFormData {
  title: string;
  description: string;
  line_of_business: LineOfBusiness;
  severity: Severity;
  incident_date: string;
  incident_location: string;
  policy_reference: string;
  estimated_loss: number;
}

interface ClaimIntakeFormProps {
  onSubmit: (data: ClaimFormData, saveAsDraft: boolean) => void;
  onCancel: () => void;
  initialData?: Partial<ClaimFormData>;
  isEditing?: boolean;
}

const lineOfBusinessOptions: { value: LineOfBusiness; label: string; description: string; Icon: React.ElementType }[] = [
  { value: 'property', label: 'Property', description: 'Building, equipment, and asset damage', Icon: Building },
  { value: 'marine', label: 'Marine', description: 'Cargo and shipping related claims', Icon: Ship },
  { value: 'cyber', label: 'Cyber', description: 'Cybersecurity incidents and data breaches', Icon: Monitor },
  { value: 'cgl', label: 'CGL', description: 'Commercial General Liability claims', Icon: Scale },
  { value: 'product_recall', label: 'Product Recall', description: 'Product defects requiring recall', Icon: Package },
  { value: 'product_guarantee', label: 'Product Guarantee', description: 'Warranty and guarantee claims', Icon: Shield },
];

const severityOptions: { value: Severity; label: string; color: string; description: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-300', description: 'Minor impact, routine handling' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', description: 'Moderate impact, priority attention' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300', description: 'Significant impact, urgent attention' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-300', description: 'Severe impact, immediate action required' },
];

const initialFormState: ClaimFormData = {
  title: '',
  description: '',
  line_of_business: 'property',
  severity: 'medium',
  incident_date: new Date().toISOString().split('T')[0],
  incident_location: '',
  policy_reference: '',
  estimated_loss: 0,
};

export function ClaimIntakeForm({ onSubmit, onCancel, initialData, isEditing = false }: ClaimIntakeFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ClaimFormData>({ ...initialFormState, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof ClaimFormData, string>>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialFormState, ...initialData });
    }
  }, [initialData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ClaimFormData, string>> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Claim title is required';
      }
      if (!formData.line_of_business) {
        newErrors.line_of_business = 'Line of business is required';
      }
    }

    if (step === 2) {
      if (!formData.incident_date) {
        newErrors.incident_date = 'Incident date is required';
      }
      if (!formData.incident_location.trim()) {
        newErrors.incident_location = 'Incident location is required';
      }
      if (!formData.policy_reference.trim()) {
        newErrors.policy_reference = 'Policy reference is required';
      }
    }

    if (step === 3) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (formData.estimated_loss < 0) {
        newErrors.estimated_loss = 'Estimated loss cannot be negative';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (saveAsDraft: boolean) => {
    if (!saveAsDraft && !validateStep(currentStep)) {
      return;
    }
    onSubmit(formData, saveAsDraft);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <div 
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
              currentStep >= step 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {index < 2 && (
            <div 
              className={`w-16 h-1 mx-2 rounded transition-all ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Claim Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a descriptive title for the claim"
          />
        </div>
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Line of Business <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {lineOfBusinessOptions.map((option) => {
            const IconComponent = option.Icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, line_of_business: option.value })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.line_of_business === option.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-semibold text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </button>
            );
          })}
        </div>
        {errors.line_of_business && <p className="text-red-500 text-sm mt-1">{errors.line_of_business}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Severity Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {severityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, severity: option.value })}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                formData.severity === option.value
                  ? `${option.color} border-current`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="text-xs mt-1 opacity-75">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Incident Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={formData.incident_date}
              onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.incident_date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.incident_date && <p className="text-red-500 text-sm mt-1">{errors.incident_date}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Policy Reference <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.policy_reference}
              onChange={(e) => setFormData({ ...formData, policy_reference: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.policy_reference ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., POL-2024-001234"
            />
          </div>
          {errors.policy_reference && <p className="text-red-500 text-sm mt-1">{errors.policy_reference}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Incident Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={formData.incident_location}
            onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
            rows={3}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.incident_location ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter the full address or location details where the incident occurred"
          />
        </div>
        {errors.incident_location && <p className="text-red-500 text-sm mt-1">{errors.incident_location}</p>}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Location Tips</p>
            <p className="text-sm text-blue-700 mt-1">
              Include building name, floor, area code, or GPS coordinates if available. 
              Accurate location helps in claim investigation and documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Provide a detailed description of the incident including:
- What happened
- How it was discovered
- Initial assessment of damage
- Any immediate actions taken"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Estimated Loss (INR)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={formData.estimated_loss}
            onChange={(e) => setFormData({ ...formData, estimated_loss: parseFloat(e.target.value) || 0 })}
            min="0"
            step="1000"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.estimated_loss ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
        </div>
        {errors.estimated_loss && <p className="text-red-500 text-sm mt-1">{errors.estimated_loss}</p>}
        <p className="text-gray-500 text-sm mt-1">
          Provide your best estimate. This can be updated as more information becomes available.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Claim Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Line of Business</p>
            <p className="font-medium text-gray-900 capitalize">{formData.line_of_business.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-gray-500">Severity</p>
            <p className="font-medium text-gray-900 capitalize">{formData.severity}</p>
          </div>
          <div>
            <p className="text-gray-500">Incident Date</p>
            <p className="font-medium text-gray-900">{formData.incident_date}</p>
          </div>
          <div>
            <p className="text-gray-500">Policy Reference</p>
            <p className="font-medium text-gray-900">{formData.policy_reference || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Estimated Loss</p>
            <p className="font-medium text-gray-900">INR {formData.estimated_loss.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Submitting as: <strong className="text-gray-700">{user.full_name}</strong></span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Claims
          </button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Claim' : 'Register New Claim'}
          </h1>
          <p className="text-blue-100 mt-1">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Basic Information' :
              currentStep === 2 ? 'Incident Details' :
              'Description & Summary'
            }
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {renderStepIndicator()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Submit Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
