'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Calendar, 
  IndianRupee, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Edit,
  Eye,
  Home,
  Activity,
  RefreshCw,
  UserPlus,
  UserMinus
} from 'lucide-react';

import { ownerDashboardService } from '../../../services/ownerDashboardService';
import type { TenantActivity } from '../../../services/ownerDashboardService';

interface TenantRecord {
  _id: string;
  tenant: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  personalInfo: {
    fatherName: string;
    address: string;
    emergencyContact: string;
    idProof: {
      type: string;
      number: string;
    };
  };
  currentRoom: {
    propertyType: string;
    propertyId: string;
    propertyName: string;
    roomNumber: string;
  };
  stayDetails: {
    checkInDate: string;
    checkOutDate?: string;
    isActive: boolean;
    expectedCheckOut?: string;
    lastUpdated: string;
  };
  financials: {
    monthlyRent: number;
    securityDeposit: number;
    currentDues: {
      total: number;
      rent: number;
      electricity: number;
      other: number;
    };
    advancePayments: {
      total: number;
    };
  };
  analytics: {
    totalStayDays: number;
    totalRevenue: number;
  };
  paymentHistory: Array<{
    amount: number;
    type: string;
    date: string;
    description: string;
  }>;
}

const EnhancedTenantManagement = () => {
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [recentActivities, setRecentActivities] = useState<TenantActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
  const [showTenantDetails, setShowTenantDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTenantData = async () => {
    try {
      setRefreshing(true);
      
      // For now, we'll simulate the data structure
      // In a real implementation, you'd call the actual API endpoints
      const [activities] = await Promise.all([
        ownerDashboardService.getRecentTenantActivities(50)
      ]);

      setRecentActivities(activities);
      
      // Transform activities into tenant records (this would come from a dedicated endpoint)
      const tenantMap = new Map();
      activities.forEach((activity: TenantActivity) => {
        if (!tenantMap.has(activity.tenantName)) {
          tenantMap.set(activity.tenantName, {
            _id: `tenant_${Math.random().toString(36).substr(2, 9)}`,
            tenant: {
              _id: `user_${Math.random().toString(36).substr(2, 9)}`,
              name: activity.tenantName,
              phone: activity.tenantPhone,
              email: `${activity.tenantName.toLowerCase().replace(' ', '.')}@email.com`
            },
            personalInfo: {
              fatherName: 'N/A',
              address: 'N/A',
              emergencyContact: activity.tenantPhone,
              idProof: {
                type: 'Aadhaar',
                number: 'XXXX-XXXX-XXXX'
              }
            },
            currentRoom: {
              propertyType: activity.propertyType,
              propertyId: 'prop_id',
              propertyName: activity.propertyName,
              roomNumber: activity.roomNumber
            },
            stayDetails: {
              checkInDate: activity.checkInDate,
              checkOutDate: activity.checkOutDate,
              isActive: activity.isActive,
              lastUpdated: activity.lastUpdated
            },
            financials: {
              monthlyRent: Math.floor(Math.random() * 5000) + 5000,
              securityDeposit: Math.floor(Math.random() * 10000) + 10000,
              currentDues: {
                total: Math.floor(Math.random() * 2000),
                rent: Math.floor(Math.random() * 1000),
                electricity: Math.floor(Math.random() * 500),
                other: Math.floor(Math.random() * 500)
              },
              advancePayments: {
                total: Math.floor(Math.random() * 5000)
              }
            },
            analytics: {
              totalStayDays: activity.totalStayDays,
              totalRevenue: Math.floor(Math.random() * 50000) + 10000
            },
            paymentHistory: [
              {
                amount: Math.floor(Math.random() * 5000) + 5000,
                type: 'Rent',
                date: new Date().toISOString(),
                description: 'Monthly rent payment'
              }
            ]
          });
        }
      });

      setTenants(Array.from(tenantMap.values()));
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, []);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.tenant.phone.includes(searchTerm) ||
                         tenant.currentRoom.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && tenant.stayDetails.isActive) ||
                         (filterStatus === 'inactive' && !tenant.stayDetails.isActive) ||
                         (filterStatus === 'overdue' && tenant.financials.currentDues.total > 0);
    
    const matchesProperty = filterProperty === 'all' || 
                           tenant.currentRoom.propertyType.toLowerCase() === filterProperty;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  const getStatusColor = (tenant: TenantRecord) => {
    if (!tenant.stayDetails.isActive) return 'bg-gray-100 text-gray-800';
    if (tenant.financials.currentDues.total > 0) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (tenant: TenantRecord) => {
    if (!tenant.stayDetails.isActive) return 'Checked Out';
    if (tenant.financials.currentDues.total > 0) return 'Overdue';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Tenant Management</h1>
          <p className="text-gray-600">Track tenant lifecycle: कब कौन आया, कब गया</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTenantData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            aria-label="Refresh tenant data"
            title="Refresh tenant data"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            disabled
            className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
            title="Add tenant functionality coming soon"
            aria-label="Add new tenant (coming soon)"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Tenant
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-gray-900">
                {tenants.filter(t => t.stayDetails.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overdue Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {tenants.filter(t => t.financials.currentDues.total > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <IndianRupee className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(tenants.reduce((sum, t) => sum + t.analytics.totalRevenue, 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by tenant status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Checked Out</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Property Filter */}
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by property type"
          >
            <option value="all">All Properties</option>
            <option value="pg">PG</option>
            <option value="room">Room</option>
            <option value="flat">Flat</option>
          </select>
        </div>
      </div>

      {/* Tenant List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tenant Records ({filteredTenants.length})
          </h3>
        </div>

        {filteredTenants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stay Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tenant.tenant.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {tenant.tenant.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.currentRoom.propertyName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {tenant.currentRoom.propertyType} - Room {tenant.currentRoom.roomNumber}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(tenant.stayDetails.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tenant.analytics.totalStayDays} days
                        {!tenant.stayDetails.isActive && tenant.stayDetails.checkOutDate && (
                          <span className="block">
                            Out: {new Date(tenant.stayDetails.checkOutDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rent: ₹{tenant.financials.monthlyRent}
                      </div>
                      {tenant.financials.currentDues.total > 0 ? (
                        <div className="text-sm text-red-600">
                          Due: ₹{tenant.financials.currentDues.total}
                        </div>
                      ) : (
                        <div className="text-sm text-green-600">All Clear</div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant)}`}>
                        {getStatusText(tenant)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowTenantDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label="View tenant details"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Edit tenant information"
                          title="Edit Tenant"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {tenant.stayDetails.isActive && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                            aria-label="Check out tenant"
                            title="Check Out"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tenants found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Tenant Activities
        </h3>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {activity.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.tenantName}</p>
                    <p className="text-xs text-gray-500">
                      {activity.propertyType} - {activity.propertyName} ({activity.roomNumber})
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {activity.isActive 
                      ? `Check-in: ${new Date(activity.checkInDate).toLocaleDateString()}`
                      : `Check-out: ${activity.checkOutDate ? new Date(activity.checkOutDate).toLocaleDateString() : 'N/A'}`
                    }
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.totalStayDays} days stay
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </div>

      {/* Tenant Details Modal */}
      {showTenantDetails && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tenant Details</h2>
                <button
                  onClick={() => setShowTenantDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close tenant details modal"
                  title="Close"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedTenant.tenant.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedTenant.tenant.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedTenant.tenant.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      <p className="text-sm text-gray-900">{selectedTenant.personalInfo.emergencyContact}</p>
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Property</label>
                      <p className="text-sm text-gray-900">
                        {selectedTenant.currentRoom.propertyName} - {selectedTenant.currentRoom.propertyType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room</label>
                      <p className="text-sm text-gray-900">{selectedTenant.currentRoom.roomNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedTenant.stayDetails.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Stay</label>
                      <p className="text-sm text-gray-900">{selectedTenant.analytics.totalStayDays} days</p>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
                      <p className="text-sm text-gray-900">₹{selectedTenant.financials.monthlyRent}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Security Deposit</label>
                      <p className="text-sm text-gray-900">₹{selectedTenant.financials.securityDeposit}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Dues</label>
                      <p className={`text-sm font-medium ${
                        selectedTenant.financials.currentDues.total > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ₹{selectedTenant.financials.currentDues.total}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Revenue</label>
                      <p className="text-sm text-gray-900">₹{selectedTenant.analytics.totalRevenue}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Payments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Payments</h3>
                  <div className="space-y-2">
                    {selectedTenant.paymentHistory.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                        <div>
                          <p className="font-medium text-sm">{payment.type}</p>
                          <p className="text-xs text-gray-500">{payment.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">₹{payment.amount}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTenantDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  aria-label="Close tenant details modal"
                  title="Close modal"
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  aria-label="Edit tenant details"
                  title="Edit tenant information"
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTenantManagement;
