'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Users,
  Home,
  IndianRupee,
  Star,
  Target,
  FileText
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  revenue: number;
  occupancy: number;
  newTenants: number;
  maintenance: number;
  satisfaction: number;
  electricity: number;
}

interface PropertyMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  occupancyRate: number;
  averageStay: number;
  tenantSatisfaction: number;
  maintenanceCost: number;
  electricityRevenue: number;
  profitMargin: number;
}

interface TenantAnalytics {
  totalTenants: number;
  activeTenants: number;
  newThisMonth: number;
  leftThisMonth: number;
  averageStayDuration: number;
  retentionRate: number;
  averageRent: number;
  paymentDelayRate: number;
}

interface RevenueBreakdown {
  roomRent: number;
  electricity: number;
  maintenance: number;
  parking: number;
  laundry: number;
  other: number;
}

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Sample analytics data
  const analyticsData: AnalyticsData[] = [
    { period: 'Jan 2025', revenue: 85000, occupancy: 92, newTenants: 8, maintenance: 5000, satisfaction: 4.5, electricity: 12000 },
    { period: 'Feb 2025', revenue: 88000, occupancy: 95, newTenants: 6, maintenance: 3500, satisfaction: 4.7, electricity: 13500 },
    { period: 'Mar 2025', revenue: 92000, occupancy: 98, newTenants: 4, maintenance: 4000, satisfaction: 4.6, electricity: 14000 },
    { period: 'Apr 2025', revenue: 89000, occupancy: 94, newTenants: 7, maintenance: 6000, satisfaction: 4.4, electricity: 12800 },
    { period: 'May 2025', revenue: 95000, occupancy: 96, newTenants: 9, maintenance: 3000, satisfaction: 4.8, electricity: 15000 },
    { period: 'Jun 2025', revenue: 98000, occupancy: 100, newTenants: 5, maintenance: 4500, satisfaction: 4.9, electricity: 16000 }
  ];

  const propertyMetrics: PropertyMetrics = {
    totalRevenue: 547000,
    monthlyGrowth: 8.5,
    occupancyRate: 96,
    averageStay: 8.5,
    tenantSatisfaction: 4.7,
    maintenanceCost: 26000,
    electricityRevenue: 83300,
    profitMargin: 65
  };

  const tenantAnalytics: TenantAnalytics = {
    totalTenants: 48,
    activeTenants: 46,
    newThisMonth: 5,
    leftThisMonth: 2,
    averageStayDuration: 8.5,
    retentionRate: 85,
    averageRent: 12500,
    paymentDelayRate: 8
  };

  const revenueBreakdown: RevenueBreakdown = {
    roomRent: 420000,
    electricity: 83300,
    maintenance: 15000,
    parking: 18000,
    laundry: 8000,
    other: 2700
  };

  const currentMonth = analyticsData[analyticsData.length - 1];
  const previousMonth = analyticsData[analyticsData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const occupancyGrowth = (currentMonth.occupancy - previousMonth.occupancy).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            <p className="text-gray-500">Comprehensive business insights and performance analytics</p>
          </div>
          
          <div className="flex space-x-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              aria-label="Select time period"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'revenue', label: 'Revenue', icon: IndianRupee },
            { id: 'tenants', label: 'Tenants', icon: Users },
            { id: 'performance', label: 'Performance', icon: Target },
            { id: 'reports', label: 'Reports', icon: FileText }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{propertyMetrics.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{revenueGrowth}% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{propertyMetrics.occupancyRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{occupancyGrowth}% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Tenants</p>
                  <p className="text-2xl font-bold text-gray-900">{tenantAnalytics.activeTenants}</p>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">{tenantAnalytics.newThisMonth} new this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-gray-900">{propertyMetrics.tenantSatisfaction}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-yellow-600">Based on reviews</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend (Last 6 Months)</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">Revenue</button>
                <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm">Occupancy</button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.map((data, index) => {
                const heightPercentage = (data.revenue / 100000) * 100;
                const heightClass = heightPercentage > 90 ? 'h-56' : 
                                   heightPercentage > 80 ? 'h-48' : 
                                   heightPercentage > 70 ? 'h-40' : 
                                   heightPercentage > 60 ? 'h-32' : 
                                   heightPercentage > 50 ? 'h-24' : 'h-16';
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className={`w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative ${heightClass}`}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                        ₹{(data.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">{data.period.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Stay Duration</span>
                  <span className="font-medium text-gray-900">{propertyMetrics.averageStay} months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tenant Retention Rate</span>
                  <span className="font-medium text-gray-900">{tenantAnalytics.retentionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profit Margin</span>
                  <span className="font-medium text-gray-900">{propertyMetrics.profitMargin}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Delay Rate</span>
                  <span className="font-medium text-gray-900">{tenantAnalytics.paymentDelayRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
              <div className="space-y-3">
                {Object.entries(revenueBreakdown).map(([source, amount]) => {
                  const percentage = (amount / Object.values(revenueBreakdown).reduce((a, b) => a + b, 0) * 100).toFixed(1);
                  return (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600 capitalize">{source.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">₹{amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
            <div className="space-y-4">
              {analyticsData.slice(-3).map((data, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{data.period}</span>
                    <span className="text-lg font-bold text-green-600">₹{data.revenue.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Occupancy:</span>
                      <span className="ml-2 font-medium">{data.occupancy}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Electricity:</span>
                      <span className="ml-2 font-medium">₹{data.electricity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-medium">Total Revenue</span>
                  <span className="text-xl font-bold text-green-700">₹{propertyMetrics.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-red-700 font-medium">Total Expenses</span>
                  <span className="text-xl font-bold text-red-700">₹{(propertyMetrics.totalRevenue * (100 - propertyMetrics.profitMargin) / 100).toLocaleString()}</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">Net Profit</span>
                  <span className="text-xl font-bold text-blue-700">₹{(propertyMetrics.totalRevenue * propertyMetrics.profitMargin / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Analytics Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Generate Report</p>
              <p className="text-sm text-gray-500">Create custom reports</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Trend Analysis</p>
              <p className="text-sm text-gray-500">Analyze performance trends</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Set Targets</p>
              <p className="text-sm text-gray-500">Define business goals</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-500">Download analytics data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
