'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Calendar,
  User,
  Phone,
  Star,
  Eye,
  Edit,
  Trash2,
  Home,
  Droplets,
  Zap,
  Wifi,
  Shield,
  Bug,
  Settings,
  DollarSign,
  UserCheck
} from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'cleaning' | 'ac' | 'wifi' | 'security' | 'pest-control' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  roomNumber: string;
  tenantName: string;
  requestDate: string;
  completedDate?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  rating?: number;
  feedback?: string;
  images?: string[];
}

interface ServiceProvider {
  id: string;
  name: string;
  profession: string;
  phone: string;
  email: string;
  rating: number;
  completedJobs: number;
  specialization: string[];
  hourlyRate: number;
  isAvailable: boolean;
}

const MaintenanceManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample maintenance requests data
  const maintenanceRequests: MaintenanceRequest[] = [
    {
      id: '1',
      title: 'Leaking Tap in Room 101',
      description: 'The bathroom tap is leaking continuously. Water is wasting and making noise.',
      category: 'plumbing',
      priority: 'high',
      status: 'in-progress',
      roomNumber: '101',
      tenantName: 'Rahul Sharma',
      requestDate: '2 Feb 2025',
      assignedTo: 'Ravi Plumber',
      estimatedCost: 800
    },
    {
      id: '2',
      title: 'AC Not Cooling - Room 203',
      description: 'AC is running but not cooling properly. Room temperature is very high.',
      category: 'ac',
      priority: 'urgent',
      status: 'pending',
      roomNumber: '203',
      tenantName: 'Priya Singh',
      requestDate: '3 Feb 2025',
      estimatedCost: 1500
    },
    {
      id: '3',
      title: 'WiFi Connection Issues',
      description: 'Internet speed is very slow and frequently disconnecting.',
      category: 'wifi',
      priority: 'medium',
      status: 'completed',
      roomNumber: '102',
      tenantName: 'Amit Kumar',
      requestDate: '1 Feb 2025',
      completedDate: '2 Feb 2025',
      assignedTo: 'Network Tech',
      actualCost: 500,
      rating: 4
    },
    {
      id: '4',
      title: 'Electrical Socket Not Working',
      description: 'Power socket near study table is not working. Need urgent repair.',
      category: 'electrical',
      priority: 'high',
      status: 'in-progress',
      roomNumber: '105',
      tenantName: 'Neha Patel',
      requestDate: '3 Feb 2025',
      assignedTo: 'Suresh Electrician',
      estimatedCost: 600
    },
    {
      id: '5',
      title: 'Room Deep Cleaning',
      description: 'Monthly deep cleaning service required for room and bathroom.',
      category: 'cleaning',
      priority: 'low',
      status: 'completed',
      roomNumber: '201',
      tenantName: 'Ravi Gupta',
      requestDate: '30 Jan 2025',
      completedDate: '31 Jan 2025',
      actualCost: 300,
      rating: 5
    }
  ];

  // Sample service providers data
  const serviceProviders: ServiceProvider[] = [
    {
      id: '1',
      name: 'Ravi Kumar',
      profession: 'Plumber',
      phone: '+91 98765 43210',
      email: 'ravi.plumber@email.com',
      rating: 4.8,
      completedJobs: 150,
      specialization: ['Pipe Repair', 'Tap Installation', 'Bathroom Fitting'],
      hourlyRate: 300,
      isAvailable: true
    },
    {
      id: '2',
      name: 'Suresh Sharma',
      profession: 'Electrician',
      phone: '+91 98765 43211',
      email: 'suresh.electric@email.com',
      rating: 4.6,
      completedJobs: 120,
      specialization: ['Wiring', 'Socket Repair', 'Fan Installation'],
      hourlyRate: 400,
      isAvailable: true
    },
    {
      id: '3',
      name: 'Cleaning Solutions',
      profession: 'Cleaning Service',
      phone: '+91 98765 43212',
      email: 'info@cleaningsolutions.com',
      rating: 4.7,
      completedJobs: 200,
      specialization: ['Deep Cleaning', 'Regular Maintenance', 'Sanitization'],
      hourlyRate: 250,
      isAvailable: false
    },
    {
      id: '4',
      name: 'Cool Air AC Service',
      profession: 'AC Technician',
      phone: '+91 98765 43213',
      email: 'coolairservice@email.com',
      rating: 4.9,
      completedJobs: 180,
      specialization: ['AC Repair', 'Installation', 'Maintenance'],
      hourlyRate: 500,
      isAvailable: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <Trash2 className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing': return <Droplets className="h-5 w-5 text-blue-600" />;
      case 'electrical': return <Zap className="h-5 w-5 text-yellow-600" />;
      case 'cleaning': return <Settings className="h-5 w-5 text-green-600" />;
      case 'ac': return <Wrench className="h-5 w-5 text-purple-600" />;
      case 'wifi': return <Wifi className="h-5 w-5 text-indigo-600" />;
      case 'security': return <Shield className="h-5 w-5 text-red-600" />;
      case 'pest-control': return <Bug className="h-5 w-5 text-orange-600" />;
      default: return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
    const priorityMatch = selectedPriority === 'all' || request.priority === selectedPriority;
    const searchMatch = searchTerm === '' || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomNumber.includes(searchTerm) ||
      request.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const totalRequests = maintenanceRequests.length;
  const pendingRequests = maintenanceRequests.filter(r => r.status === 'pending').length;
  const inProgressRequests = maintenanceRequests.filter(r => r.status === 'in-progress').length;
  const averageRating = maintenanceRequests
    .filter(r => r.rating)
    .reduce((sum, r) => sum + (r.rating || 0), 0) / maintenanceRequests.filter(r => r.rating).length || 0;

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
            <p className="text-gray-500">Track and manage all maintenance requests and service providers</p>
          </div>
          
          <button 
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'requests', label: 'Requests', icon: Wrench },
            { id: 'providers', label: 'Service Providers', icon: UserCheck },
            { id: 'analytics', label: 'Analytics', icon: Settings }
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

      {/* Maintenance Requests Tab */}
      {activeTab === 'requests' && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
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
                  <p className="text-gray-500 text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressRequests}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Currently active</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Service quality</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by title, room, or tenant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select 
                value={selectedPriority} 
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by priority"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Maintenance Requests</h3>
            
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(request.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {request.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Room {request.roomNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{request.tenantName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{request.requestDate}</span>
                          </div>
                          {request.estimatedCost && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">₹{request.estimatedCost}</span>
                            </div>
                          )}
                        </div>
                        
                        {request.assignedTo && (
                          <div className="mt-3 flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Assigned to: {request.assignedTo}</span>
                          </div>
                        )}
                        
                        {request.rating && (
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= request.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">Service Rating</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="View details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Edit request">
                        <Edit className="h-4 w-4" />
                      </button>
                      {request.status === 'pending' && (
                        <button className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100" title="Assign worker">
                          <UserCheck className="h-4 w-4" />
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

      {/* Service Providers Tab */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Service Providers</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="h-4 w-4" />
              <span>Add Provider</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceProviders.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-500">{provider.profession}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    provider.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{provider.completedJobs} jobs completed</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{provider.phone}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Specialization:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.specialization.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate: ₹{provider.hourlyRate}/hr</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                    View Profile
                  </button>
                  <button className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm">
                    Assign Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Maintenance Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Schedule Maintenance</p>
              <p className="text-sm text-gray-500">Plan preventive maintenance</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Find Service Provider</p>
              <p className="text-sm text-gray-500">Search and hire professionals</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Maintenance Reports</p>
              <p className="text-sm text-gray-500">Generate detailed reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;
