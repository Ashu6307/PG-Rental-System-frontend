import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { UserFavorite } from '@/services/userDashboardService';

interface UseFavoritesOptions {
  initialPage?: number;
  pageSize?: number;
  autoFetch?: boolean;
  filters?: {
    location?: string;
    budget?: { min: number; max: number };
    sortBy?: string;
  };
}

interface UseFavoritesReturn {
  favorites: UserFavorite[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  searchQuery: string;
  searchFavorites: (query: string) => void;
  clearSearch: () => void;
  filters: UseFavoritesOptions['filters'];
  updateFilters: (newFilters: UseFavoritesOptions['filters']) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleFavorite: (pgId: string) => Promise<{ success: boolean; error?: string }>;
  removeFavorite: (pgId: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  hasMore: boolean;
  isEmpty: boolean;
  isRefreshing: boolean;
}

export const useFavorites = (options: UseFavoritesOptions = {}): UseFavoritesReturn => {
  const {
    initialPage = 1,
    pageSize = 12,
    autoFetch = true,
    filters = {}
  } = options;

  const {
    favorites,
    loading,
    error,
    pagination,
    fetchUserFavorites,
    toggleFavorite,
    removeFavorite,
    setFavoriteFilters,
    clearError
  } = useDashboard();

  const [localFilters, setLocalFilters] = useState(filters);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter favorites based on search query
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    
    const query = searchQuery.toLowerCase();
    return favorites.filter(favorite => 
      favorite.pgId.pg_name.toLowerCase().includes(query) ||
      favorite.pgId.address.toLowerCase().includes(query) ||
      favorite.pgId.amenities.some(amenity => amenity.toLowerCase().includes(query))
    );
  }, [favorites, searchQuery]);

  // Load more favorites
  const loadMore = useCallback(async () => {
    if (pagination.favorites.currentPage < pagination.favorites.totalPages) {
      await fetchUserFavorites(pagination.favorites.currentPage + 1, localFilters);
    }
  }, [fetchUserFavorites, pagination.favorites, localFilters]);

  // Refresh favorites
  const refresh = useCallback(async () => {
    await fetchUserFavorites(1, localFilters);
  }, [fetchUserFavorites, localFilters]);

  // Update filters
  const updateFilters = useCallback((newFilters: UseFavoritesOptions['filters'] = {}) => {
    setLocalFilters(newFilters);
    setFavoriteFilters(newFilters);
  }, [setFavoriteFilters]);

  // Toggle favorite with error handling
  const handleToggleFavorite = useCallback(async (pgId: string) => {
    try {
      const isFavorite = await toggleFavorite(pgId);
      return { success: true, isFavorite };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to toggle favorite' 
      };
    }
  }, [toggleFavorite]);

  // Remove favorite with error handling
  const handleRemoveFavorite = useCallback(async (pgId: string) => {
    try {
      await removeFavorite(pgId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove favorite' 
      };
    }
  }, [removeFavorite]);

  // Search favorites
  const searchFavorites = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchUserFavorites(initialPage, localFilters);
    }
  }, [autoFetch, initialPage, localFilters]);

  return {
    // Data
    favorites: filteredFavorites,
    loading: loading.favorites,
    error: error.favorites,
    pagination: pagination.favorites,
    
    // Search
    searchQuery,
    searchFavorites,
    clearSearch,
    
    // Filters
    filters: localFilters,
    updateFilters,
    
    // Actions
    loadMore,
    refresh,
    toggleFavorite: handleToggleFavorite,
    removeFavorite: handleRemoveFavorite,
    clearError: () => clearError('favorites'),
    
    // State
    hasMore: pagination.favorites.currentPage < pagination.favorites.totalPages,
    isEmpty: filteredFavorites.length === 0,
    isRefreshing: loading.favorites && pagination.favorites.currentPage === 1,
  };
};