'use client';

import React from 'react';
import { Calendar, Heart, Star, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorAlert from '@/components/ui/ErrorAlert';

const RecentActivityCard: React.FC = () => {
  const { recentActivity, loading, error, fetchRecentActivity } = useDashboard();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'favorite':
        return <Heart className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-50 border-blue-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      case 'review':
        return 'bg-yellow-50 border-yellow-200';
      case 'favorite':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return activityTime.toLocaleDateString();
  };

  if (error.activity) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <ErrorAlert 
          message={error.activity} 
          onRetry={() => fetchRecentActivity()} 
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        {loading.activity && (
          <LoadingSpinner size="sm" />
        )}
      </div>

      {loading.activity && recentActivity.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : recentActivity.length > 0 ? (
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity._id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${getActivityColor(activity.type)} hover:shadow-sm transition-shadow`}
            >
              <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {activity.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500">
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          ))}
          
          {recentActivity.length >= 5 && (
            <button className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center space-x-1 hover:bg-blue-50 rounded-lg transition-colors">
              <span>View all activity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No recent activity</p>
          <p className="text-xs text-gray-400 mt-1">
            Your activities will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityCard;