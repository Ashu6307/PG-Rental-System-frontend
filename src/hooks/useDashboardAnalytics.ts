import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { DashboardStats, UserAnalytics } from '@/services/userDashboardService';

interface UseDashboardAnalyticsReturn {
  stats: DashboardStats | null;
  analytics: UserAnalytics | null;
  loading: {
    stats: boolean;
    analytics: boolean;
  };
  error: {
    stats: string | null;
    analytics: string | null;
  };
  // Computed metrics
  computedMetrics: {
    bookingGrowth: number;
    spendingTrend: 'up' | 'down' | 'stable';
    completionRate: number;
    averageBookingValue: number;
    topLocations: string[];
    monthlyGrowth: { month: string; growth: number }[];
  };
  // Actions
  refreshStats: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearErrors: () => void;
}

export const useDashboardAnalytics = (): UseDashboardAnalyticsReturn => {
  const {
    stats,
    analytics,
    loading,
    error,
    fetchDashboardStats,
    fetchUserAnalytics,
    clearError
  } = useDashboard();

  // Computed metrics based on stats and analytics
  const computedMetrics = useMemo(() => {
    if (!stats || !analytics) {
      return {
        bookingGrowth: 0,
        spendingTrend: 'stable' as const,
        completionRate: 0,
        averageBookingValue: 0,
        topLocations: [],
        monthlyGrowth: []
      };
    }

    // Calculate booking growth (last 2 months comparison)
    const monthlyBookings = analytics.bookingPatterns.monthlyBookings;
    const bookingGrowth = monthlyBookings.length >= 2 
      ? ((monthlyBookings[monthlyBookings.length - 1]?.count || 0) - 
         (monthlyBookings[monthlyBookings.length - 2]?.count || 0)) / 
        Math.max(monthlyBookings[monthlyBookings.length - 2]?.count || 1, 1) * 100
      : 0;

    // Calculate spending trend
    const monthlySpending = analytics.financialMetrics.monthlySpending;
    let spendingTrend: 'up' | 'down' | 'stable' = 'stable';
    if (monthlySpending.length >= 2) {
      const lastMonth = monthlySpending[monthlySpending.length - 1]?.amount || 0;
      const previousMonth = monthlySpending[monthlySpending.length - 2]?.amount || 0;
      const threshold = 0.05; // 5% threshold for stability
      const change = (lastMonth - previousMonth) / Math.max(previousMonth, 1);
      
      if (change > threshold) spendingTrend = 'up';
      else if (change < -threshold) spendingTrend = 'down';
    }

    // Calculate completion rate
    const completionRate = stats.totalBookings > 0 
      ? (stats.completedBookings / stats.totalBookings) * 100 
      : 0;

    // Average booking value
    const averageBookingValue = analytics.financialMetrics.averageBookingValue;

    // Top locations from favorites
    const topLocations = analytics.favoriteLocations.slice(0, 5);

    // Monthly growth calculation
    const monthlyGrowth = monthlySpending.map((current, index) => {
      if (index === 0) return { month: current.month, growth: 0 };
      
      const previous = monthlySpending[index - 1];
      const growth = previous.amount > 0 
        ? ((current.amount - previous.amount) / previous.amount) * 100
        : 0;
      
      return { month: current.month, growth };
    }).slice(1); // Remove first month (no growth data)

    return {
      bookingGrowth,
      spendingTrend,
      completionRate,
      averageBookingValue,
      topLocations,
      monthlyGrowth
    };
  }, [stats, analytics]);

  // Refresh functions
  const refreshStats = useCallback(async () => {
    await fetchDashboardStats();
  }, [fetchDashboardStats]);

  const refreshAnalytics = useCallback(async () => {
    await fetchUserAnalytics();
  }, [fetchUserAnalytics]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchDashboardStats(), fetchUserAnalytics()]);
  }, [fetchDashboardStats, fetchUserAnalytics]);

  const clearErrors = useCallback(() => {
    clearError('stats');
    clearError('analytics');
  }, [clearError]);

  return {
    stats,
    analytics,
    loading: {
      stats: loading.stats,
      analytics: loading.analytics,
    },
    error: {
      stats: error.stats,
      analytics: error.analytics,
    },
    computedMetrics,
    refreshStats,
    refreshAnalytics,
    refreshAll,
    clearErrors,
  };
};