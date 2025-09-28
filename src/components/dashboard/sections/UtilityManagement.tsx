'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Wifi, 
  Car, 
  Plus,
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Edit,
  Eye,
  FileText,
  Calculator,
  Activity,
  Clock,
  IndianRupee,
  Home
} from 'lucide-react';

interface ElectricityReading {
  roomId: string;
  roomNumber: string;
  currentReading: number;
  previousReading: number;
  unitsConsumed: number;
  billAmount: number;
  perTenantAmount: number;
  tenantCount: number;
  readingDate: string;
  status: 'pending' | 'generated' | 'paid';
  tenants: string[];
}

interface UtilityBill {
  type: 'electricity' | 'water' | 'internet' | 'maintenance';
  amount: number;
  month: string;
  status: 'pending' | 'paid';
  dueDate: string;
}

const UtilityManagement = () => {
  const [activeTab, setActiveTab] = useState('electricity');
  const [showAddReadingModal, setShowAddReadingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');

  // Sample electricity readings data
  const electricityReadings: ElectricityReading[] = [
    {
      roomId: '101',
      roomNumber: '101',
      currentReading: 1250,
      previousReading: 1100,
      unitsConsumed: 150,
      billAmount: 1200,
      perTenantAmount: 600,
      tenantCount: 2,
      readingDate: '1 Feb 2025',
      status: 'generated',
      tenants: ['Rahul Sharma', 'Amit Kumar']
    },
    {
      roomId: '102',
      roomNumber: '102',
      currentReading: 980,
      previousReading: 880,
      unitsConsumed: 100,
      billAmount: 800,
      perTenantAmount: 800,
      tenantCount: 1,
      readingDate: '1 Feb 2025',
      status: 'paid',
      tenants: ['Priya Singh']
    },
    {
      roomId: '103',
      roomNumber: '103',
      currentReading: 1180,
      previousReading: 1050,
      unitsConsumed: 130,
      billAmount: 1040,
      perTenantAmount: 1040,
      tenantCount: 1,
      readingDate: '1 Feb 2025',
      status: 'pending',
      tenants: ['Neha Patel']
    },
    {
      roomId: '201',
      roomNumber: '201',
      currentReading: 1350,
      previousReading: 1200,
      unitsConsumed: 150,
      billAmount: 1200,
      perTenantAmount: 600,
      tenantCount: 2,
      readingDate: '1 Feb 2025',
      status: 'generated',
      tenants: ['Ravi Gupta', 'Suresh Kumar']
    }
  ];

  // Sample utility bills data
  const utilityBills: UtilityBill[] = [
    { type: 'electricity', amount: 8000, month: 'Feb 2025', status: 'pending', dueDate: '15 Feb 2025' },
    { type: 'water', amount: 2000, month: 'Feb 2025', status: 'paid', dueDate: '10 Feb 2025' },
    { type: 'internet', amount: 1500, month: 'Feb 2025', status: 'paid', dueDate: '5 Feb 2025' },
    { type: 'maintenance', amount: 5000, month: 'Feb 2025', status: 'pending', dueDate: '20 Feb 2025' }
  ];

  const totalElectricityRevenue = electricityReadings.reduce((sum, reading) => sum + reading.billAmount, 0);
  const totalUnitsConsumed = electricityReadings.reduce((sum, reading) => sum + reading.unitsConsumed, 0);
  const averagePerRoom = totalUnitsConsumed / electricityReadings.length;
  const pendingReadings = electricityReadings.filter(r => r.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'generated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'generated': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case 'electricity': return <Zap className="h-5 w-5 text-yellow-600" />;
      case 'water': return <Droplets className="h-5 w-5 text-blue-600" />;
      case 'internet': return <Wifi className="h-5 w-5 text-green-600" />;
      case 'maintenance': return <Car className="h-5 w-5 text-purple-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Utility Management</h2>
            <p className="text-gray-500">Track and manage all utility consumption and billing</p>
          </div>
          
          <button 
            onClick={() => setShowAddReadingModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Reading</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'electricity', label: 'Electricity', icon: Zap },
            { id: 'water', label: 'Water', icon: Droplets },
            { id: 'internet', label: 'Internet', icon: Wifi },
            { id: 'other', label: 'Other Bills', icon: FileText }
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

      {/* Electricity Tab Content */}
      {activeTab === 'electricity' && (
        <>
          {/* Electricity Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalElectricityRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Units</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUnitsConsumed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Units consumed</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Average per Room</p>
                  <p className="text-2xl font-bold text-gray-900">{averagePerRoom.toFixed(0)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Units per room</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Readings</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingReadings}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Requires attention</p>
            </div>
          </div>

          {/* Electricity Readings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Room-wise Electricity Consumption</h3>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Calculator className="h-4 w-4" />
                  <span>Generate Bills</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <FileText className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Current Reading</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Previous Reading</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Units Consumed</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Bill Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Per Tenant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {electricityReadings.map((reading, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Home className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Room {reading.roomNumber}</div>
                            <div className="text-sm text-gray-500">{reading.tenantCount} tenant(s)</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{reading.currentReading}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">{reading.previousReading}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-blue-600">{reading.unitsConsumed} units</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">₹{reading.billAmount.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-green-600">₹{reading.perTenantAmount.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(reading.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reading.status)}`}>
                            {reading.status.charAt(0).toUpperCase() + reading.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="View details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Edit reading">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100" title="Generate bill">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Other Utility Bills */}
      {activeTab !== 'electricity' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bills
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {utilityBills
              .filter(bill => activeTab === 'other' ? bill.type !== 'electricity' : bill.type === activeTab)
              .map((bill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getUtilityIcon(bill.type)}
                      <span className="font-medium text-gray-900 capitalize">{bill.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bill.status)}`}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{bill.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{bill.month}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Due Date:</span>
                      <span className="font-medium text-gray-700">{bill.dueDate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                      View Details
                    </button>
                    <button className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm">
                      Mark Paid
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Utility Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Bulk Meter Reading</p>
              <p className="text-sm text-gray-500">Record readings for all rooms</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Generate All Bills</p>
              <p className="text-sm text-gray-500">Auto-generate monthly utility bills</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Usage Analytics</p>
              <p className="text-sm text-gray-500">View consumption trends and insights</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilityManagement;
