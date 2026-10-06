'use client';

import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Folder, 
  File, 
  Image, 
  FileText, 
  Film, 
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Upload,
  X,
  Clock,
  User,
  ChevronRight,
  FolderOpen,
  FileArchive,
  MoreVertical
} from 'lucide-react';

type DocumentCategory = 'evidence' | 'invoice' | 'photo' | 'correspondence' | 'legal' | 'other';

interface Document {
  id: string;
  claim_id: string;
  claim_number: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  version: number;
  description: string;
  uploaded_by: string;
  created_at: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    file_name: 'fire_damage_photos.zip',
    file_path: '/documents/1/fire_damage_photos.zip',
    file_type: 'application/zip',
    file_size: 15728640,
    category: 'photo',
    version: 1,
    description: 'Collection of photographs documenting fire damage at Plant A',
    uploaded_by: 'John Handler',
    created_at: '2024-01-16T11:00:00Z',
  },
  {
    id: '2',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    file_name: 'surveyor_report.pdf',
    file_path: '/documents/1/surveyor_report.pdf',
    file_type: 'application/pdf',
    file_size: 2097152,
    category: 'evidence',
    version: 2,
    description: 'Final surveyor assessment report',
    uploaded_by: 'Sarah Head',
    created_at: '2024-01-18T14:30:00Z',
  },
  {
    id: '3',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    file_name: 'repair_quotation_vendor1.pdf',
    file_path: '/documents/1/repair_quotation_vendor1.pdf',
    file_type: 'application/pdf',
    file_size: 524288,
    category: 'invoice',
    version: 1,
    description: 'Repair quotation from ABC Construction',
    uploaded_by: 'Jane Finance',
    created_at: '2024-01-19T09:15:00Z',
  },
  {
    id: '4',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    file_name: 'bill_of_lading.pdf',
    file_path: '/documents/2/bill_of_lading.pdf',
    file_type: 'application/pdf',
    file_size: 1048576,
    category: 'evidence',
    version: 1,
    description: 'Original Bill of Lading for shipment',
    uploaded_by: 'John Handler',
    created_at: '2024-01-12T10:00:00Z',
  },
  {
    id: '5',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    file_name: 'cargo_damage_assessment.pdf',
    file_path: '/documents/2/cargo_damage_assessment.pdf',
    file_type: 'application/pdf',
    file_size: 3145728,
    category: 'evidence',
    version: 1,
    description: 'Marine surveyor cargo damage assessment',
    uploaded_by: 'Sarah Head',
    created_at: '2024-01-14T16:45:00Z',
  },
  {
    id: '6',
    claim_id: '3',
    claim_number: 'CYB-24-00001',
    file_name: 'incident_log.xlsx',
    file_path: '/documents/3/incident_log.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 262144,
    category: 'evidence',
    version: 1,
    description: 'IT security incident log',
    uploaded_by: 'Mike Auditor',
    created_at: '2024-01-20T17:00:00Z',
  },
  {
    id: '7',
    claim_id: '3',
    claim_number: 'CYB-24-00001',
    file_name: 'forensics_preliminary.pdf',
    file_path: '/documents/3/forensics_preliminary.pdf',
    file_type: 'application/pdf',
    file_size: 4194304,
    category: 'legal',
    version: 1,
    description: 'Preliminary forensics analysis report',
    uploaded_by: 'Bob Legal',
    created_at: '2024-01-21T11:30:00Z',
  },
  {
    id: '8',
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    file_name: 'medical_report.pdf',
    file_path: '/documents/4/medical_report.pdf',
    file_type: 'application/pdf',
    file_size: 786432,
    category: 'evidence',
    version: 1,
    description: 'Third-party medical examination report',
    uploaded_by: 'John Handler',
    created_at: '2024-01-07T13:20:00Z',
  },
  {
    id: '9',
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    file_name: 'legal_correspondence.pdf',
    file_path: '/documents/4/legal_correspondence.pdf',
    file_type: 'application/pdf',
    file_size: 1572864,
    category: 'correspondence',
    version: 3,
    description: 'Legal correspondence with claimant',
    uploaded_by: 'Bob Legal',
    created_at: '2024-01-20T10:00:00Z',
  },
];

const categoryConfig: Record<DocumentCategory, { label: string; color: string; icon: React.ElementType }> = {
  evidence: { label: 'Evidence', color: 'bg-blue-100 text-blue-700', icon: FileText },
  invoice: { label: 'Invoice', color: 'bg-green-100 text-green-700', icon: FileText },
  photo: { label: 'Photo', color: 'bg-purple-100 text-purple-700', icon: Image },
  correspondence: { label: 'Correspondence', color: 'bg-yellow-100 text-yellow-700', icon: FileText },
  legal: { label: 'Legal', color: 'bg-red-100 text-red-700', icon: FileText },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700', icon: File },
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.startsWith('video/')) return Film;
  if (fileType.includes('zip') || fileType.includes('archive')) return FileArchive;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [claimFilter, setClaimFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [contextMenu, setContextMenu] = useState<{ doc: Document; x: number; y: number } | null>(null);

  const uniqueClaims = Array.from(new Set(documents.map(d => d.claim_number)));

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesClaim = claimFilter === 'all' || doc.claim_number === claimFilter;
    return matchesSearch && matchesCategory && matchesClaim;
  });

  const groupedByCategory = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== docId));
      setContextMenu(null);
    }
  };

  const handleDownload = (doc: Document) => {
    // In production, this would trigger actual download
    alert(`Downloading ${doc.file_name}`);
    setContextMenu(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Folder className="w-7 h-7 text-blue-600" />
            Document Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload, organize, and manage claim-related documents with version control
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload Documents
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <File className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Evidence Files</p>
              <p className="text-xl font-bold text-gray-900">
                {documents.filter(d => d.category === 'evidence').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Image className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Photos/Media</p>
              <p className="text-xl font-bold text-gray-900">
                {documents.filter(d => d.category === 'photo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FolderOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-xl font-bold text-gray-900">
                {formatFileSize(documents.reduce((sum, d) => sum + d.file_size, 0))}
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            <select
              value={claimFilter}
              onChange={(e) => setClaimFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Claims</option>
              {uniqueClaims.map(claim => (
                <option key={claim} value={claim}>{claim}</option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Folder className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.file_type);
                const catConfig = categoryConfig[doc.category];

                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.file_name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{doc.description}</p>
                        </div>
                        {doc.version > 1 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            v{doc.version}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{doc.claim_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${catConfig.color}`}>
                        {catConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatFileSize(doc.file_size)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-700">{doc.uploaded_by}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(doc.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([category, docs]) => {
            const catConfig = categoryConfig[category as DocumentCategory];
            const CategoryIcon = catConfig.icon;

            return (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{catConfig.label}</h3>
                  <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {docs.length}
                  </span>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {docs.map((doc) => {
                    const FileIcon = getFileIcon(doc.file_type);

                    return (
                      <div
                        key={doc.id}
                        className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenu({ doc, x: e.clientX, y: e.clientY });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <div className="p-3 bg-white rounded-lg shadow-sm mb-2">
                            <FileIcon className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate w-full">
                            {doc.file_name}
                          </p>
                          <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                          {doc.version > 1 && (
                            <span className="mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              v{doc.version}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredDocuments.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          )}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-40"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                setSelectedDocument(contextMenu.doc);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> View Details
            </button>
            <button
              onClick={() => handleDownload(contextMenu.doc)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </button>
            <hr className="my-1" />
            <button
              onClick={() => handleDelete(contextMenu.doc.id)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={(newDocs) => {
            setDocuments([...newDocs, ...documents]);
            setShowUploadModal(false);
          }}
          existingClaims={uniqueClaims}
        />
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <DocumentDetailsModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

interface UploadModalProps {
  onClose: () => void;
  onUpload: (documents: Document[]) => void;
  existingClaims: string[];
}

function UploadModal({ onClose, onUpload, existingClaims }: UploadModalProps) {
  const [selectedClaim, setSelectedClaim] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('evidence');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!selectedClaim || files.length === 0) {
      alert('Please select a claim and at least one file');
      return;
    }

    const newDocs: Document[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      claim_id: selectedClaim,
      claim_number: selectedClaim,
      file_name: file.name,
      file_path: `/documents/${selectedClaim}/${file.name}`,
      file_type: file.type,
      file_size: file.size,
      category,
      version: 1,
      description,
      uploaded_by: 'Current User',
      created_at: new Date().toISOString(),
    }));

    onUpload(newDocs);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Claim <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClaim}
              onChange={(e) => setSelectedClaim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a claim...</option>
              {existingClaims.map(claim => (
                <option key={claim} value={claim}>{claim}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the document(s)"
            />
          </div>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-400 mt-1">Supports PDF, images, spreadsheets, and archives</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected Files ({files.length})</p>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedClaim || files.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Upload {files.length > 0 && `(${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DocumentDetailsModalProps {
  document: Document;
  onClose: () => void;
  onDownload: (doc: Document) => void;
  onDelete: (docId: string) => void;
}

function DocumentDetailsModal({ document, onClose, onDownload, onDelete }: DocumentDetailsModalProps) {
  const FileIcon = getFileIcon(document.file_type);
  const catConfig = categoryConfig[document.category];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Document Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-gray-100 rounded-xl">
              <FileIcon className="w-12 h-12 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{document.file_name}</h3>
              <p className="text-gray-500 text-sm mt-1">{document.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${catConfig.color}`}>
                  {catConfig.label}
                </span>
                {document.version > 1 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Version {document.version}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Claim Number</span>
              <span className="font-medium text-gray-900">{document.claim_number}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">File Size</span>
              <span className="font-medium text-gray-900">{formatFileSize(document.file_size)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">File Type</span>
              <span className="font-medium text-gray-900">{document.file_type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Uploaded By
              </span>
              <span className="font-medium text-gray-900">{document.uploaded_by}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Upload Date
              </span>
              <span className="font-medium text-gray-900">
                {new Date(document.created_at).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => {
              onDelete(document.id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => onDownload(document)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
