'use client';

import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Users,
  Building2
} from 'lucide-react';

import { ownerDashboardService } from '../../../services/ownerDashboardService';
import type { 
  EnhancedDashboardOverview, 
  PaymentOverview 
} from '../../../services/ownerDashboardService';

interface FinancialStats {
  totalRevenue: number;
  monthlyGrowth: number;
  pendingDues: number;
  overdueCount: number;
  collectionRate: number;
}

const EnhancedFinancialManagement = () => {
  const [financialData, setFinancialData] = useState<EnhancedDashboardOverview | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFinancialData = async () => {
    try {
      setRefreshing(true);
      
      const [overview, payments] = await Promise.all([
        ownerDashboardService.getEnhancedDashboardOverview(),
        ownerDashboardService.getPaymentOverview()
      ]);

      setFinancialData(overview);
      setPaymentData(payments);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const financialStats: FinancialStats = {
    totalRevenue: financialData?.tenants.enhanced?.totalRevenue || 0,
    monthlyGrowth: financialData?.financial.revenueGrowth || 0,
    pendingDues: financialData?.tenants.enhanced?.totalDues || 0,
    overdueCount: financialData?.tenants.enhanced?.overdueCount || 0,
    collectionRate: paymentData ? 
      ((paymentData.overview.totalExpectedRevenue - paymentData.overview.totalDues) / paymentData.overview.totalExpectedRevenue * 100) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Financial Management</h1>
          <p className="text-gray-600">Complete revenue tracking with tenant analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFinancialData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(financialStats.totalRevenue / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {financialStats.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              financialStats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(financialStats.monthlyGrowth).toFixed(1)}% from last month
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(financialData?.financial.currentMonthRevenue || 0 / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Last month: ₹{(financialData?.financial.lastMonthRevenue || 0 / 1000).toFixed(0)}K
            </p>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Dues</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{(financialStats.pendingDues / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {financialStats.overdueCount} overdue tenants
            </p>
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Collection Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {financialStats.collectionRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-green-600 h-2 rounded-full transition-all duration-300 ${
                  financialStats.collectionRate >= 90 ? 'w-full' :
                  financialStats.collectionRate >= 80 ? 'w-5/6' :
                  financialStats.collectionRate >= 70 ? 'w-3/4' :
                  financialStats.collectionRate >= 60 ? 'w-2/3' :
                  financialStats.collectionRate >= 50 ? 'w-1/2' :
                  financialStats.collectionRate >= 40 ? 'w-2/5' :
                  financialStats.collectionRate >= 30 ? 'w-1/3' :
                  financialStats.collectionRate >= 20 ? 'w-1/4' :
                  financialStats.collectionRate >= 10 ? 'w-1/6' : 'w-1/12'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Monthly Rent</span>
              </div>
              <span className="font-semibold text-gray-900">
                ₹{((financialData?.financial.currentMonthRevenue || 0) * 0.8 / 1000).toFixed(0)}K
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Electricity Bills</span>
              </div>
              <span className="font-semibold text-gray-900">
                ₹{(financialData?.financial.pendingElectricityAmount || 0 / 1000).toFixed(1)}K
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Security Deposits</span>
              </div>
              <span className="font-semibold text-gray-900">
                ₹{(paymentData?.overview.totalAdvance || 0 / 1000).toFixed(1)}K
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Other Charges</span>
              </div>
              <span className="font-semibold text-gray-900">
                ₹{((financialData?.financial.currentMonthRevenue || 0) * 0.1 / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>

        {/* Outstanding Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Payments</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-red-800">Overdue Rent</span>
                <span className="text-sm font-bold text-red-900">
                  ₹{(financialStats.pendingDues * 0.7 / 1000).toFixed(1)}K
                </span>
              </div>
              <p className="text-xs text-red-600">{financialStats.overdueCount} tenants</p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-yellow-800">Pending Electricity</span>
                <span className="text-sm font-bold text-yellow-900">
                  ₹{(financialData?.financial.pendingElectricityAmount || 0 / 1000).toFixed(1)}K
                </span>
              </div>
              <p className="text-xs text-yellow-600">
                {financialData?.financial.pendingElectricityBills} bills pending
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-800">Other Dues</span>
                <span className="text-sm font-bold text-blue-900">
                  ₹{(financialStats.pendingDues * 0.3 / 1000).toFixed(1)}K
                </span>
              </div>
              <p className="text-xs text-blue-600">Maintenance, utilities, etc.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      {paymentData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentData.recentPayments.slice(0, 8).map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.tenantName}</div>
                        <div className="text-sm text-gray-500">{payment.tenantPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.propertyType} - {payment.roomNumber}
                      </div>
                      <div className="text-sm text-gray-500">{payment.propertyName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        ₹{payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {paymentData?.overview.activeTenants || 0}
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <Users className="h-4 w-4 mr-1" />
              Active Tenants
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {financialData?.overview.totalProperties || 0}
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <Building2 className="h-4 w-4 mr-1" />
              Total Properties
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ₹{((paymentData?.overview.totalExpectedRevenue || 0) / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              Expected Revenue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFinancialManagement;
