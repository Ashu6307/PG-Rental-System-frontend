'use client';

import React from 'react';
import { Calendar, Home, CreditCard, TrendingUp, Star, Heart, Activity, Users } from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';

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

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description, 
  loading = false 
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
        </div>
      </div>
      {trend !== undefined && !loading && (
        <div className={`flex items-center space-x-1 ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
    {description && !loading && (
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    )}
  </div>
);

const DashboardStatsCards: React.FC = () => {
  const { stats, loading, error, computedMetrics } = useDashboardAnalytics();

  if (error.stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full">
          <ErrorAlert 
            message={error.stats} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </div>
    );
  }

  const isLoading = loading.stats;

  const statsData = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      trend: computedMetrics.bookingGrowth,
      description: 'All time bookings'
    },
    {
      title: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: <Home className="w-5 h-5 text-green-600" />,
      description: 'Currently active'
    },
    {
      title: 'Total Spent',
      value: stats?.totalSpent ? `₹${stats.totalSpent.toLocaleString()}` : '₹0',
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      description: 'Total expenditure'
    },
    {
      title: 'Completion Rate',
      value: `${computedMetrics.completionRate.toFixed(1)}%`,
      icon: <Activity className="w-5 h-5 text-orange-600" />,
      description: 'Successful bookings'
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0',
      icon: <Star className="w-5 h-5 text-yellow-600" />,
      description: 'Your ratings'
    },
    {
      title: 'Favorites',
      value: stats?.favoritesCount || 0,
      icon: <Heart className="w-5 h-5 text-red-600" />,
      description: 'Saved properties'
    },
    {
      title: 'Reviews Given',
      value: stats?.reviewsCount || 0,
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      description: 'Your reviews'
    },
    {
      title: 'Upcoming Check-ins',
      value: stats?.upcomingCheckIns || 0,
      icon: <Calendar className="w-5 h-5 text-teal-600" />,
      description: 'Next 30 days'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          description={stat.description}
          loading={isLoading}
        />
      ))}
    </div>
  );
};

export default DashboardStatsCards;