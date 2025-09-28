'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CreditCard, Filter, Search, MoreVertical, Clock, CheckCircle, XCircle, AlertCircle, Wifi } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useRealTimeBookings } from '@/contexts/WebSocketContext';

// Simple loading spinner component inline
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
    </div>
  );
};

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

const BookingsManagement: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);
  
  const {
    bookings,
    loading,
    error,
    searchQuery,
    searchBookings,
    clearSearch,
    filters,
    updateFilters,
    loadMore,
    refresh,
    cancelBooking,
    hasMore,
    isEmpty,
    isRefreshing
  } = useBookings();

  // Real-time updates
  const { updates: realtimeBookingUpdates, isConnected } = useRealTimeBookings();

  // Handle real-time updates
  useEffect(() => {
    if (realtimeBookingUpdates.length > 0) {
      setRealtimeUpdates(prev => [
        ...realtimeBookingUpdates.slice(0, 5), // Keep only last 5 updates
        ...prev.slice(0, 5)
      ]);
      
      // Auto-refresh booking list when updates come in
      refresh();
    }
  }, [realtimeBookingUpdates, refresh]);

  // Clear old updates after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setRealtimeUpdates(prev => prev.slice(0, 3));
    }, 30000); // Clear after 30 seconds

    return () => clearTimeout(timer);
  }, [realtimeUpdates]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      checkedin: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await cancelBooking(bookingId, 'Cancelled by user');
      if (result.success) {
        // Refresh the list
        refresh();
      } else {
        alert(result.error || 'Failed to cancel booking');
      }
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ ...(filters || {}), [key]: value });
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Bookings</h3>
        <ErrorAlert message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
            {/* Real-time status indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Real-time updates indicator */}
            {realtimeUpdates.length > 0 && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                <Wifi className="w-3 h-3" />
                <span>{realtimeUpdates.length} live updates</span>
              </div>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            {isRefreshing && <LoadingSpinner size="sm" />}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => searchBookings(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
              aria-label="Clear search"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters?.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Filter by booking status"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checkedin">Checked In</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters?.dateRange?.start || ''}
                  onChange={(e) => handleFilterChange('dateRange', { 
                    ...(filters?.dateRange || {}), 
                    start: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select start date"
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters?.dateRange?.end || ''}
                  onChange={(e) => handleFilterChange('dateRange', { 
                    ...(filters?.dateRange || {}), 
                    end: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select end date"
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bookings List */}
      <div className="p-6">
        {loading && bookings.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h4>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search or filters' : 'Start by booking your first property'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {booking.pgId.pg_name}
                    </h4>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.pgId.address}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(booking.status)}
                    <button
                      onClick={() => setSelectedBooking(selectedBooking === booking._id ? null : booking._id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Room {booking.roomId.room_number}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {booking.duration} days
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    ₹{booking.totalAmount.toLocaleString()}
                  </div>
                </div>

                {/* Action Menu */}
                {selectedBooking === booking._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        View Details
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManagement;