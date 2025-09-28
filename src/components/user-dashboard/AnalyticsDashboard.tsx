'use client';

/* eslint-disable react/forbid-dom-props, @typescript-eslint/no-inline-styles */
// Inline styles are necessary for dynamic chart rendering

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  DollarSign,
  Star,
  ChevronDown,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { exportToCsv, exportToJson, formatAnalyticsForExport } from '@/utils/exportUtils';

// Simple error alert component inline
const ErrorAlert: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <div className="flex-1">
        <p className="text-sm font-medium">Error</p>
        <p className="text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  </div>
);

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  height?: number;
}> = ({ data, title, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Use Tailwind min-height classes based on height value
  const getHeightClass = (h: number) => {
    if (h <= 150) return 'min-h-[150px]';
    if (h <= 200) return 'min-h-[200px]';
    if (h <= 250) return 'min-h-[250px]';
    return 'min-h-[300px]';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="text-sm font-medium text-gray-900 mb-4">{title}</h4>
      <div className={`space-y-3 ${getHeightClass(height)}`}>
        {data.map((item, index) => {
          const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          // Use predefined width classes for common percentages
          const getWidthClass = (width: number) => {
            if (width >= 90) return 'w-[90%]';
            if (width >= 80) return 'w-4/5';
            if (width >= 75) return 'w-3/4';
            if (width >= 60) return 'w-3/5';
            if (width >= 50) return 'w-1/2';
            if (width >= 40) return 'w-2/5';
            if (width >= 33) return 'w-1/3';
            if (width >= 25) return 'w-1/4';
            if (width >= 20) return 'w-1/5';
            if (width >= 10) return 'w-1/12';
            return 'w-[5%]';
          };
          
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-xs text-gray-600 truncate">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                <div
                  className={`h-3 rounded-full ${item.color || 'bg-blue-500'} transition-all duration-300 ${getWidthClass(barWidth)}`}
                />
              </div>
              <div className="w-12 text-xs text-gray-900 text-right">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple Line Chart Component (using CSS gradients)
const SimpleLineChart: React.FC<{
  data: Array<{ label: string; value: number }>;
  title: string;
  height?: number;
}> = ({ data, title, height = 150 }) => {
  if (data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  // Use Tailwind min-height classes based on height value
  const getHeightClass = (h: number) => {
    if (h <= 150) return 'min-h-[150px]';
    if (h <= 200) return 'min-h-[200px]';
    if (h <= 250) return 'min-h-[250px]';
    return 'min-h-[300px]';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="text-sm font-medium text-gray-900 mb-4">{title}</h4>
      <div className={`relative ${getHeightClass(height)}`}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={`${ratio * 100}%`}
                x2="100%"
                y2={`${ratio * 100}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Data line */}
            {data.length > 1 && (
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={data.map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = ((maxValue - point.value) / range) * 100;
                  return `${x}%,${y}%`;
                }).join(' ')}
              />
            )}
            
            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxValue - point.value) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#3b82f6"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
            {data.map((point, index) => (
              <span key={index} className="truncate">{point.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance Score Component (from PerformanceMetricsDashboard)
const PerformanceScore: React.FC<{
  score: number;
  title: string;
  description: string;
  improvement?: number;
}> = ({ score, title, description, improvement }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 ${getScoreBackground(score)} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {improvement !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            improvement >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {improvement >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{Math.abs(improvement).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <div className="flex items-end space-x-4">
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
          <span className="text-lg">/100</span>
        </div>
        
        {/* Progress circle */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getScoreColor(score)}
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-medium ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component (from PerformanceMetricsDashboard)
const KPICard: React.FC<{
  title: string;
  value: string;
  change: number;
  target?: string;
  icon: React.ReactNode;
}> = ({ title, value, change, target, icon }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-sm font-medium ${
        change >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    </div>
    
    <div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
      {target && (
        <p className="text-xs text-gray-500 mt-1">Target: {target}</p>
      )}
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'revenue' | 'performance'>('overview');
  
  const {
    stats,
    analytics,
    loading,
    error,
    computedMetrics,
    refreshAll
  } = useDashboardAnalytics();

  const handleExport = (format: 'csv' | 'json') => {
    const dataToExport = formatAnalyticsForExport(
      { 
        ...stats,
        ...analytics,
        ...computedMetrics
      }, 
      analytics?.bookingPatterns.monthlyBookings || []
    );
    const filename = `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      exportToCsv([dataToExport], filename);
    } else {
      exportToJson([dataToExport], filename);
    }
    setShowExportMenu(false);
  };

  // Generate time series data from analytics
  const generateTimeSeriesData = () => {
    if (!analytics) return { bookings: [], revenue: [] };
    
    const bookings = analytics.bookingPatterns.monthlyBookings.map(item => ({
      label: item.month,
      value: item.count
    }));
    
    const revenue = analytics.financialMetrics.monthlySpending.map(item => ({
      label: item.month,
      value: item.amount
    }));
    
    return { bookings, revenue };
  };

  const timeSeriesData = generateTimeSeriesData();

  if (error.stats || error.analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
        <ErrorAlert 
          message={error.stats || error.analytics || 'Failed to load analytics'} 
          onRetry={refreshAll} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '1y', label: '1 Year' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value as typeof timeRange)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    timeRange === option.value
                      ? 'bg-white shadow-sm text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={refreshAll}
              disabled={loading.stats || loading.analytics}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${(loading.stats || loading.analytics) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'bookings', label: 'Bookings', icon: Calendar },
              { key: 'revenue', label: 'Revenue', icon: DollarSign },
              { key: 'performance', label: 'Performance', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {(loading.stats || loading.analytics) && (!stats || !analytics) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics Overview */}
            {activeTab === 'overview' && stats && analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                      {timeRange.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">{analytics.engagementMetrics.profileCompleteness || 0}%</p>
                  <p className="text-sm opacity-80">Profile Complete</p>
                  {computedMetrics.bookingGrowth !== undefined && (
                    <div className="flex items-center mt-2">
                      {computedMetrics.bookingGrowth >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-xs">
                        {Math.abs(computedMetrics.bookingGrowth).toFixed(1)}% growth
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                      {timeRange.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">{analytics.totalBookings || 0}</p>
                  <p className="text-sm opacity-80">Total Bookings</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs opacity-80">
                      {computedMetrics.completionRate.toFixed(1)}% completion rate
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                      {timeRange.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">₹{analytics.totalSpent || 0}</p>
                  <p className="text-sm opacity-80">Total Spent</p>
                  <div className="flex items-center mt-2">
                    {computedMetrics.spendingTrend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : computedMetrics.spendingTrend === 'down' ? (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    ) : null}
                    <span className="text-xs">
                      Trend: {computedMetrics.spendingTrend}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                      AVG
                    </span>
                  </div>
                  <p className="text-lg font-semibold">₹{computedMetrics.averageBookingValue?.toFixed(0) || '0'}</p>
                  <p className="text-sm opacity-80">Avg Booking Value</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs opacity-80">
                      {analytics.engagementMetrics.favoritesAdded || 0} favorites
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bookings Trend */}
              {activeTab === 'overview' || activeTab === 'bookings' ? (
                <SimpleLineChart
                  data={timeSeriesData?.bookings || []}
                  title="Bookings Trend"
                  height={200}
                />
              ) : null}

              {/* Revenue Trend */}
              {activeTab === 'overview' || activeTab === 'revenue' ? (
                <SimpleLineChart
                  data={timeSeriesData?.revenue || []}
                  title="Revenue Trend"
                  height={200}
                />
              ) : null}

              {/* Enhanced Revenue Analytics for Revenue Tab */}
              {activeTab === 'revenue' ? (
                <>
                  {/* Revenue Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-8 h-8 text-green-100" />
                        <div className="flex items-center space-x-1 text-green-100">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+18.5%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-3xl font-bold mb-1">₹{stats?.totalSpent?.toLocaleString() || '0'}</p>
                        <p className="text-green-100">Total Revenue</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <CreditCard className="w-8 h-8 text-blue-100" />
                        <div className="flex items-center space-x-1 text-blue-100">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+12.3%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-3xl font-bold mb-1">₹{(analytics?.financialMetrics.averageBookingValue || 0).toLocaleString()}</p>
                        <p className="text-blue-100">Avg. Booking Value</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 text-purple-100" />
                        <div className="flex items-center space-x-1 text-purple-100">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+8.7%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-3xl font-bold mb-1">{analytics?.bookingPatterns.repeatBookingRate || 0}%</p>
                        <p className="text-purple-100">Repeat Booking Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Sources */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">Direct Bookings</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{((stats?.totalSpent || 0) * 0.6).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">60%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Platform Referrals</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{((stats?.totalSpent || 0) * 0.3).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">30%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700">Social Media</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{((stats?.totalSpent || 0) * 0.1).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">10%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {/* Booking Status Distribution */}
              {activeTab === 'overview' || activeTab === 'bookings' ? (
                <SimpleBarChart
                  data={[
                    { label: 'Active', value: stats?.activeBookings || 0, color: 'bg-green-500' },
                    { label: 'Total', value: stats?.totalBookings || 0, color: 'bg-blue-500' },
                    { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: 'bg-red-500' },
                    { label: 'Completed', value: stats?.completedBookings || 0, color: 'bg-gray-500' }
                  ]}
                  title="Bookings by Status"
                  height={200}
                />
              ) : null}

              {/* Performance Metrics */}
              {activeTab === 'overview' || activeTab === 'performance' ? (
                <SimpleBarChart
                  data={[
                    { label: 'Profile %', value: analytics?.engagementMetrics.profileCompleteness || 0, color: 'bg-blue-500' },
                    { label: 'Reviews', value: analytics?.engagementMetrics.reviewsGiven || 0, color: 'bg-purple-500' },
                    { label: 'Bookings', value: analytics?.totalBookings || 0, color: 'bg-green-500' },
                    { label: 'Favorites', value: analytics?.engagementMetrics.favoritesAdded || 0, color: 'bg-red-500' }
                  ]}
                  title="Performance Overview"
                  height={200}
                />
              ) : null}

              {/* Enhanced Performance Analytics for Performance Tab */}
              {activeTab === 'performance' ? (
                <>
                  {/* Performance Scores Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <PerformanceScore
                      score={87}
                      title="Overall Performance"
                      description="Your platform performance score"
                      improvement={5.2}
                    />
                    <PerformanceScore
                      score={analytics?.engagementMetrics.profileCompleteness || 0}
                      title="Profile Quality"
                      description="Profile completion & accuracy"
                      improvement={3.4}
                    />
                    <PerformanceScore
                      score={Math.min(100, (analytics?.bookingPatterns.repeatBookingRate || 0) * 4)}
                      title="Booking Success"
                      description="Conversion rate performance"
                      improvement={12.7}
                    />
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                      title="Response Time"
                      value="2.3 hours"
                      change={-15.2}
                      target="2 hours"
                      icon={<Clock className="w-5 h-5 text-blue-600" />}
                    />
                    <KPICard
                      title="Success Rate"
                      value={`${analytics?.bookingPatterns.repeatBookingRate || 0}%`}
                      change={8.7}
                      target="85%"
                      icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                    />
                    <KPICard
                      title="User Satisfaction"
                      value={`${analytics?.bookingPatterns.averageRating || 0}/5`}
                      change={4.2}
                      target="4.9/5"
                      icon={<Star className="w-5 h-5 text-yellow-600" />}
                    />
                    <KPICard
                      title="Platform Activity"
                      value={`${analytics?.engagementMetrics.favoritesAdded || 0} actions`}
                      change={12.3}
                      target="50 actions"
                      icon={<Activity className="w-5 h-5 text-purple-600" />}
                    />
                  </div>

                  {/* Performance Insights */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <span>Performance Insights</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>High booking conversion rate</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Excellent user satisfaction scores</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Strong platform engagement</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Improvement Areas</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Reduce response time further</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Enhance profile completeness</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Increase repeat bookings</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;