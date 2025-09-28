import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { UserBooking } from '@/services/userDashboardService';

interface UseBookingsOptions {
  initialPage?: number;
  pageSize?: number;
  autoFetch?: boolean;
  filters?: {
    status?: string;
    dateRange?: { start: string; end: string };
  };
}

interface UseBookingsReturn {
  bookings: UserBooking[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  searchQuery: string;
  searchBookings: (query: string) => void;
  clearSearch: () => void;
  filters: UseBookingsOptions['filters'];
  updateFilters: (newFilters?: UseBookingsOptions['filters']) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  hasMore: boolean;
  isEmpty: boolean;
  isRefreshing: boolean;
}

export const useBookings = (options: UseBookingsOptions = {}): UseBookingsReturn => {
  const {
    initialPage = 1,
    autoFetch = true,
    filters = {}
  } = options;

  const {
    bookings,
    loading,
    error,
    pagination,
    fetchUserBookings,
    cancelBooking,
    setBookingFilters,
    clearError
  } = useDashboard();

  const [localFilters, setLocalFilters] = useState(filters);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bookings based on search query
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    
    const query = searchQuery.toLowerCase();
    return bookings.filter(booking => 
      booking.pgId.pg_name.toLowerCase().includes(query) ||
      booking.pgId.address.toLowerCase().includes(query) ||
      booking.roomId.room_number.toLowerCase().includes(query) ||
      booking.status.toLowerCase().includes(query)
    );
  }, [bookings, searchQuery]);

  // Load more bookings
  const loadMore = useCallback(async () => {
    if (pagination.bookings.currentPage < pagination.bookings.totalPages) {
      await fetchUserBookings(pagination.bookings.currentPage + 1, localFilters);
    }
  }, [fetchUserBookings, pagination.bookings, localFilters]);

  // Refresh bookings
  const refresh = useCallback(async () => {
    await fetchUserBookings(1, localFilters);
  }, [fetchUserBookings, localFilters]);

  // Update filters
  const updateFilters = useCallback((newFilters: UseBookingsOptions['filters'] = {}) => {
    setLocalFilters(newFilters);
    setBookingFilters(newFilters);
  }, [setBookingFilters]);

  // Cancel booking with optimistic update
  const handleCancelBooking = useCallback(async (bookingId: string, reason?: string) => {
    try {
      await cancelBooking(bookingId, reason);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to cancel booking' 
      };
    }
  }, [cancelBooking]);

  // Search bookings
  const searchBookings = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchUserBookings(initialPage, localFilters);
    }
  }, [autoFetch, initialPage, localFilters]);

  return {
    // Data
    bookings: filteredBookings,
    loading: loading.bookings,
    error: error.bookings,
    pagination: pagination.bookings,
    
    // Search
    searchQuery,
    searchBookings,
    clearSearch,
    
    // Filters
    filters: localFilters,
    updateFilters,
    
    // Actions
    loadMore,
    refresh,
    cancelBooking: handleCancelBooking,
    clearError: () => clearError('bookings'),
    
    // State
    hasMore: pagination.bookings.currentPage < pagination.bookings.totalPages,
    isEmpty: filteredBookings.length === 0,
    isRefreshing: loading.bookings && pagination.bookings.currentPage === 1,
  };
};