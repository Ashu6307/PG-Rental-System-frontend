'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Calendar,
  User,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Share,
  Copy,
  File,
  Image,
  Archive,
  Home,
  UserCheck,
  CreditCard,
  Building,
  Scale
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'rental-agreement' | 'id-proof' | 'address-proof' | 'payment-receipt' | 'police-verification' | 'photo' | 'other';
  category: 'tenant-documents' | 'legal-documents' | 'property-documents' | 'financial-documents';
  roomNumber?: string;
  tenantName?: string;
  uploadedBy: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'pending-review' | 'verified' | 'rejected' | 'expired';
  fileSize: string;
  fileFormat: string;
  isRequired: boolean;
  description?: string;
  verifiedBy?: string;
  verificationDate?: string;
  rejectionReason?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  format: string;
  lastUpdated: string;
  downloadCount: number;
  isActive: boolean;
}

const DocumentManagement = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Rental Agreement - Room 101',
      type: 'rental-agreement',
      category: 'legal-documents',
      roomNumber: '101',
      tenantName: 'Rahul Sharma',
      uploadedBy: 'Owner',
      uploadDate: '1 Feb 2025',
      expiryDate: '1 Feb 2026',
      status: 'verified',
      fileSize: '2.5 MB',
      fileFormat: 'PDF',
      isRequired: true,
      description: 'Annual rental agreement for Room 101',
      verifiedBy: 'Legal Team',
      verificationDate: '2 Feb 2025'
    },
    {
      id: '2',
      name: 'Aadhar Card - Rahul Sharma',
      type: 'id-proof',
      category: 'tenant-documents',
      roomNumber: '101',
      tenantName: 'Rahul Sharma',
      uploadedBy: 'Rahul Sharma',
      uploadDate: '15 Jan 2025',
      status: 'verified',
      fileSize: '1.2 MB',
      fileFormat: 'JPG',
      isRequired: true,
      description: 'Government issued ID proof',
      verifiedBy: 'Admin',
      verificationDate: '16 Jan 2025'
    },
    {
      id: '3',
      name: 'Electricity Bill - January 2025',
      type: 'payment-receipt',
      category: 'financial-documents',
      uploadedBy: 'Owner',
      uploadDate: '2 Feb 2025',
      status: 'verified',
      fileSize: '800 KB',
      fileFormat: 'PDF',
      isRequired: false,
      description: 'Monthly electricity bill and payment proof'
    },
    {
      id: '4',
      name: 'Police Verification - Priya Singh',
      type: 'police-verification',
      category: 'tenant-documents',
      roomNumber: '203',
      tenantName: 'Priya Singh',
      uploadedBy: 'Priya Singh',
      uploadDate: '3 Feb 2025',
      status: 'pending-review',
      fileSize: '1.5 MB',
      fileFormat: 'PDF',
      isRequired: true,
      description: 'Police verification certificate'
    },
    {
      id: '5',
      name: 'Property Registration Certificate',
      type: 'other',
      category: 'property-documents',
      uploadedBy: 'Owner',
      uploadDate: '1 Jan 2025',
      expiryDate: '1 Jan 2030',
      status: 'verified',
      fileSize: '3.2 MB',
      fileFormat: 'PDF',
      isRequired: true,
      description: 'Official property ownership document'
    }
  ];

  // Sample document templates
  const documentTemplates: DocumentTemplate[] = [
    {
      id: '1',
      name: 'Standard Rental Agreement',
      description: 'Standard 11-month rental agreement template with all legal clauses',
      category: 'Legal Templates',
      format: 'PDF',
      lastUpdated: '15 Jan 2025',
      downloadCount: 45,
      isActive: true
    },
    {
      id: '2',
      name: 'Security Deposit Receipt',
      description: 'Receipt format for security deposit collection',
      category: 'Financial Templates',
      format: 'PDF',
      lastUpdated: '10 Jan 2025',
      downloadCount: 32,
      isActive: true
    },
    {
      id: '3',
      name: 'Tenant Information Form',
      description: 'Form to collect tenant personal and professional details',
      category: 'Administrative',
      format: 'PDF',
      lastUpdated: '5 Jan 2025',
      downloadCount: 28,
      isActive: true
    },
    {
      id: '4',
      name: 'House Rules and Regulations',
      description: 'Comprehensive list of PG rules and policies',
      category: 'Policy Documents',
      format: 'PDF',
      lastUpdated: '1 Jan 2025',
      downloadCount: 51,
      isActive: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending-review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'expired': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'rental-agreement': return <Scale className="h-5 w-5 text-blue-600" />;
      case 'id-proof': return <CreditCard className="h-5 w-5 text-green-600" />;
      case 'address-proof': return <Building className="h-5 w-5 text-purple-600" />;
      case 'payment-receipt': return <CreditCard className="h-5 w-5 text-yellow-600" />;
      case 'police-verification': return <Shield className="h-5 w-5 text-red-600" />;
      case 'photo': return <Image className="h-5 w-5 text-pink-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const categoryMatch = selectedCategory === 'all' || doc.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || doc.status === selectedStatus;
    const searchMatch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.roomNumber?.includes(searchTerm);
    
    return categoryMatch && statusMatch && searchMatch;
  });

  const totalDocuments = documents.length;
  const pendingReview = documents.filter(d => d.status === 'pending-review').length;
  const verifiedDocuments = documents.filter(d => d.status === 'verified').length;
  const expiredDocuments = documents.filter(d => d.status === 'expired').length;

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
            <p className="text-gray-500">Manage all property and tenant documents securely</p>
          </div>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'documents', label: 'All Documents', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Copy },
            { id: 'compliance', label: 'Compliance', icon: Shield },
            { id: 'archives', label: 'Archives', icon: Archive }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <>
          {/* Document Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">All files</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingReview}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Requires attention</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">{verifiedDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Approved documents</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{expiredDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Need renewal</p>
            </div>
          </div>

          {/* Document Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search documents, tenants, or rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by document category"
              >
                <option value="all">All Categories</option>
                <option value="tenant-documents">Tenant Documents</option>
                <option value="legal-documents">Legal Documents</option>
                <option value="property-documents">Property Documents</option>
                <option value="financial-documents">Financial Documents</option>
              </select>

              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by document status"
              >
                <option value="all">All Status</option>
                <option value="pending-review">Pending Review</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Library</h3>
            
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getDocumentTypeIcon(document.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{document.name}</h4>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(document.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                              {document.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          {document.isRequired && (
                            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                              REQUIRED
                            </span>
                          )}
                        </div>
                        
                        {document.description && (
                          <p className="text-gray-600 mb-3">{document.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          {document.tenantName && document.roomNumber && (
                            <div className="flex items-center space-x-2">
                              <Home className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{document.tenantName} - Room {document.roomNumber}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{document.uploadedBy}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{document.uploadDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{document.fileFormat} - {document.fileSize}</span>
                          </div>
                          {document.expiryDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Expires: {document.expiryDate}</span>
                            </div>
                          )}
                        </div>
                        
                        {document.verifiedBy && document.verificationDate && (
                          <div className="mt-3 flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Verified by {document.verifiedBy} on {document.verificationDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="View document">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100" title="Share">
                        <Share className="h-4 w-4" />
                      </button>
                      {document.status === 'pending-review' && (
                        <button className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100" title="Review">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Templates</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="h-4 w-4" />
              <span>Create Template</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Format:</span>
                    <span className="font-medium text-gray-700">{template.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Downloads:</span>
                    <span className="font-medium text-gray-700">{template.downloadCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Updated:</span>
                    <span className="font-medium text-gray-700">{template.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                    Download
                  </button>
                  <button className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Document Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Bulk Upload</p>
              <p className="text-sm text-gray-500">Upload multiple documents</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Generate Agreement</p>
              <p className="text-sm text-gray-500">Create rental agreements</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Expiry Alerts</p>
              <p className="text-sm text-gray-500">Track document expiry</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Archive className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Archive Old Documents</p>
              <p className="text-sm text-gray-500">Organize document storage</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
