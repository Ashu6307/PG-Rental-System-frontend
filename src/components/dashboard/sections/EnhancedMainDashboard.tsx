'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  IndianRupee, 
  AlertTriangle,
  Plus,
  FileText,
  BarChart3,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  RefreshCw
} from 'lucide-react';

import { ownerDashboardService } from '../../../services/ownerDashboardService';
import type { 
  EnhancedDashboardOverview, 
  TenantActivity, 
  OccupancyStatus,
  PaymentOverview 
} from '../../../services/ownerDashboardService';

const EnhancedMainDashboard = () => {
  const [dashboardData, setDashboardData] = useState<EnhancedDashboardOverview | null>(null);
  const [recentActivities, setRecentActivities] = useState<TenantActivity[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyStatus | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      const [overview, activities, occupancy, payments] = await Promise.all([
        ownerDashboardService.getEnhancedDashboardOverview(),
        ownerDashboardService.getRecentTenantActivities(10),
        ownerDashboardService.getOccupancyStatus(),
        ownerDashboardService.getPaymentOverview()
      ]);

      setDashboardData(overview);
      setRecentActivities(activities);
      setOccupancyData(occupancy);
      setPaymentData(payments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load dashboard data</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const quickActions = [
    { 
      id: 'add-tenant', 
      label: 'Add New Tenant', 
      icon: Plus, 
      color: 'bg-blue-500', 
      count: dashboardData.tenants.enhanced?.active || 0
    },
    { 
      id: 'generate-bills', 
      label: 'Generate Bills', 
      icon: FileText, 
      color: 'bg-green-500',
      count: dashboardData.financial.pendingElectricityBills
    },
    { 
      id: 'view-analytics', 
      label: 'View Analytics', 
      icon: BarChart3, 
      color: 'bg-indigo-500',
      count: dashboardData.overview.totalProperties
    },
    { 
      id: 'track-tenants', 
      label: 'Track Tenants', 
      icon: Activity, 
      color: 'bg-purple-500',
      count: dashboardData.tenants.checkInsToday
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Owner Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(dashboardData.financial.currentMonthRevenue / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {dashboardData.financial.revenueGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              dashboardData.financial.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(dashboardData.financial.revenueGrowth).toFixed(1)}% from last month
            </span>
          </div>
        </div>

        {/* Total Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalProperties}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                PG: {dashboardData.properties.pgs?.total || 0}
              </span>
              <span className="text-gray-500">
                Rooms: {dashboardData.properties.rooms?.total || 0}
              </span>
              <span className="text-gray-500">
                Flats: {dashboardData.properties.flats?.total || 0}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${
                  dashboardData.overview.occupancyRate >= 90 ? 'w-full' :
                  dashboardData.overview.occupancyRate >= 80 ? 'w-4/5' :
                  dashboardData.overview.occupancyRate >= 70 ? 'w-3/4' :
                  dashboardData.overview.occupancyRate >= 60 ? 'w-3/5' :
                  dashboardData.overview.occupancyRate >= 50 ? 'w-1/2' :
                  dashboardData.overview.occupancyRate >= 40 ? 'w-2/5' :
                  dashboardData.overview.occupancyRate >= 30 ? 'w-1/3' :
                  dashboardData.overview.occupancyRate >= 20 ? 'w-1/4' :
                  dashboardData.overview.occupancyRate >= 10 ? 'w-1/6' : 'w-1/12'
                }`}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {dashboardData.overview.occupancyRate.toFixed(1)}% occupancy rate
            </p>
          </div>
        </div>

        {/* Active Tenants */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Tenants</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.tenants.enhanced?.active || dashboardData.tenants.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Check-ins today</span>
              <span className="font-medium text-green-600">+{dashboardData.tenants.checkInsToday}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">New this month</span>
              <span className="font-medium text-blue-600">+{dashboardData.tenants.newThisMonth}</span>
            </div>
            {dashboardData.tenants.enhanced && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Avg stay</span>
                <span className="font-medium text-gray-900">
                  {dashboardData.tenants.enhanced.averageStayDays} days
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Financial Health</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{((dashboardData.tenants.enhanced?.totalRevenue || 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total dues</span>
              <span className="font-medium text-red-600">
                ₹{((dashboardData.tenants.enhanced?.totalDues || 0) / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Overdue tenants</span>
              <span className="font-medium text-yellow-600">
                {dashboardData.tenants.enhanced?.overdueCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Pending bills</span>
              <span className="font-medium text-orange-600">
                {dashboardData.financial.pendingElectricityBills}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Occupancy Status */}
      {occupancyData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Real-time Occupancy Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PG Occupancy */}
            {occupancyData.pg.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">PG Properties</h4>
                <div className="space-y-3">
                  {occupancyData.pg.slice(0, 3).map((pg) => (
                    <div key={pg._id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{pg.name}</span>
                        <span className="text-xs text-gray-500">
                          {pg.occupancyRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-blue-600 h-2 rounded-full ${
                            pg.occupancyRate >= 90 ? 'w-full' :
                            pg.occupancyRate >= 80 ? 'w-4/5' :
                            pg.occupancyRate >= 70 ? 'w-3/4' :
                            pg.occupancyRate >= 60 ? 'w-3/5' :
                            pg.occupancyRate >= 50 ? 'w-1/2' :
                            pg.occupancyRate >= 40 ? 'w-2/5' :
                            pg.occupancyRate >= 30 ? 'w-1/3' :
                            pg.occupancyRate >= 20 ? 'w-1/4' :
                            pg.occupancyRate >= 10 ? 'w-1/6' : 'w-1/12'
                          }`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{pg.occupiedBeds}/{pg.totalBeds} beds</span>
                        <span>{pg.availableBeds} available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Occupancy */}
            {occupancyData.rooms.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Individual Rooms</h4>
                <div className="space-y-2">
                  {occupancyData.rooms.slice(0, 5).map((room) => (
                    <div key={room._id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <span className="text-sm">{room.name}</span>
                      <div className="flex items-center">
                        {room.isOccupied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                          {room.isOccupied ? 'Occupied' : 'Available'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flat Occupancy */}
            {occupancyData.flats.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Flat Properties</h4>
                <div className="space-y-3">
                  {occupancyData.flats.slice(0, 3).map((flat) => (
                    <div key={flat._id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{flat.name}</span>
                        <span className="text-xs text-gray-500">
                          {((flat.currentOccupancy / flat.maxOccupancy) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-green-600 h-2 rounded-full ${
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 90 ? 'w-full' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 80 ? 'w-4/5' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 70 ? 'w-3/4' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 60 ? 'w-3/5' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 50 ? 'w-1/2' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 40 ? 'w-2/5' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 30 ? 'w-1/3' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 20 ? 'w-1/4' :
                            ((flat.currentOccupancy / flat.maxOccupancy) * 100) >= 10 ? 'w-1/6' : 'w-1/12'
                          }`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{flat.currentOccupancy}/{flat.maxOccupancy} occupants</span>
                        <span className={flat.isAvailable ? 'text-green-600' : 'text-red-600'}>
                          {flat.isAvailable ? 'Available' : 'Full'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{occupancyData.summary.totalProperties}</p>
                <p className="text-sm text-gray-500">Total Properties</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{occupancyData.summary.totalOccupied}</p>
                <p className="text-sm text-gray-500">Occupied</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {occupancyData.summary.totalCapacity - occupancyData.summary.totalOccupied}
                </p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tenant Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Tenant Activities (कब कौन आया, कब गया)
        </h3>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {activity.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.tenantName}</p>
                    <p className="text-sm text-gray-500">
                      {activity.propertyType} - {activity.propertyName} ({activity.roomNumber})
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {activity.isActive 
                        ? `Checked in: ${new Date(activity.checkInDate).toLocaleDateString()}`
                        : `Checked out: ${activity.checkOutDate ? new Date(activity.checkOutDate).toLocaleDateString() : 'N/A'}`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Stay: {activity.totalStayDays} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent tenant activities</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
              onClick={() => {
                // Handle quick action clicks
                console.log(`Quick action: ${action.id}`);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <action.icon className="h-6 w-6" />
                {action.count > 0 && (
                  <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                    {action.count}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Overview */}
      {paymentData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <IndianRupee className="h-5 w-5 mr-2" />
            Payment Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Summary */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Financial Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Expected Revenue</span>
                  <span className="font-semibold text-green-600">
                    ₹{(paymentData.overview.totalExpectedRevenue / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Dues</span>
                  <span className="font-semibold text-red-600">
                    ₹{(paymentData.overview.totalDues / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Advance</span>
                  <span className="font-semibold text-blue-600">
                    ₹{(paymentData.overview.totalAdvance / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overdue Tenants</span>
                  <span className="font-semibold text-yellow-600">
                    {paymentData.overview.overdueTenantsCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Recent Payments</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {paymentData.recentPayments.slice(0, 5).map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-sm">{payment.tenantName}</p>
                      <p className="text-xs text-gray-500">
                        {payment.propertyType} - {payment.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{payment.amount}</p>
                      <p className="text-xs text-gray-500">{payment.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMainDashboard;
