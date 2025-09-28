'use client';

import React, { useState } from 'react';
import { Heart, MapPin, Star, Filter, Search, MoreVertical, Download, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { exportToCsv, exportToJson, formatFavoritesForExport } from '@/utils/exportUtils';

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

const FavoritesManagement: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'rent' | 'added'>('added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const {
    favorites,
    loading,
    error,
    searchQuery,
    searchFavorites,
    clearSearch,
    filters,
    updateFilters,
    loadMore,
    refresh,
    removeFavorite,
    hasMore,
    isEmpty,
    isRefreshing
  } = useFavorites();

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleSelectFavorite = (favoriteId: string) => {
    setSelectedFavorites(prev => 
      prev.includes(favoriteId) 
        ? prev.filter(id => id !== favoriteId)
        : [...prev, favoriteId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFavorites.length === favorites.length) {
      setSelectedFavorites([]);
    } else {
      setSelectedFavorites(favorites.map(f => f._id));
    }
  };

  const handleBulkRemove = async () => {
    if (selectedFavorites.length === 0) return;
    
    if (window.confirm(`Remove ${selectedFavorites.length} properties from favorites?`)) {
      try {
        await Promise.all(selectedFavorites.map(id => {
          const favorite = favorites.find(f => f._id === id);
          return favorite ? removeFavorite(favorite.pgId._id) : Promise.resolve();
        }));
        setSelectedFavorites([]);
        refresh();
      } catch (error) {
        alert('Failed to remove some favorites');
      }
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const dataToExport = selectedFavorites.length > 0 
      ? favorites.filter(f => selectedFavorites.includes(f._id))
      : favorites;
    
    const formattedData = formatFavoritesForExport(dataToExport);
    const filename = `favorites_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      exportToCsv(formattedData, filename);
    } else {
      exportToJson(formattedData, filename);
    }
    setShowExportMenu(false);
  };

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ ...(filters || {}), [key]: value });
  };

  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.pgId.pg_name.toLowerCase();
        bValue = b.pgId.pg_name.toLowerCase();
        break;
      case 'rating':
        aValue = a.pgId.rating || 0;
        bValue = b.pgId.rating || 0;
        break;
      case 'rent':
        aValue = a.pgId.rent?.min || 0;
        bValue = b.pgId.rent?.min || 0;
        break;
      case 'added':
        aValue = new Date(a.addedAt).getTime();
        bValue = new Date(b.addedAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Favorites</h3>
        <ErrorAlert message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            My Favorites ({favorites.length})
          </h3>
          <div className="flex items-center space-x-2">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                title="Export data"
              >
                <Download className="w-5 h-5" />
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
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            {isRefreshing && <LoadingSpinner size="sm" />}
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => searchFavorites(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            {['name', 'rating', 'rent', 'added'].map((option) => (
              <button
                key={option}
                onClick={() => handleSort(option as typeof sortBy)}
                className={`flex items-center px-3 py-2 text-sm rounded-lg border ${
                  sortBy === option 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="capitalize">{option}</span>
                {sortBy === option && (
                  sortOrder === 'asc' ? 
                    <SortAsc className="w-3 h-3 ml-1" /> : 
                    <SortDesc className="w-3 h-3 ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters?.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget</label>
                <input
                  type="number"
                  placeholder="Min rent..."
                  value={filters?.budget?.min || ''}
                  onChange={(e) => handleFilterChange('budget', { 
                    ...(filters?.budget || {}), 
                    min: parseInt(e.target.value) || 0 
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget</label>
                <input
                  type="number"
                  placeholder="Max rent..."
                  value={filters?.budget?.max || ''}
                  onChange={(e) => handleFilterChange('budget', { 
                    ...(filters?.budget || {}), 
                    max: parseInt(e.target.value) || 0 
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedFavorites.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedFavorites.length} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkRemove}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove Selected
                </button>
                <button
                  onClick={() => setSelectedFavorites([])}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Favorites List/Grid */}
      <div className="p-6">
        {loading && favorites.length === 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded mb-3"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No favorites found</h4>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding properties to your favorites'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All */}
            {favorites.length > 0 && (
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFavorites.length === favorites.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Select all</span>
                </label>
              </div>
            )}

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {sortedFavorites.map((favorite) => (
                <div
                  key={favorite._id}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                    selectedFavorites.includes(favorite._id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedFavorites.includes(favorite._id)}
                      onChange={() => handleSelectFavorite(favorite._id)}
                      aria-label={`Select ${favorite.pgId.pg_name}`}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeFavorite(favorite.pgId._id)}
                      className="p-1 text-red-400 hover:text-red-600 rounded"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        {favorite.pgId.images?.[0] ? (
                          <img 
                            src={favorite.pgId.images[0]} 
                            alt={favorite.pgId.pg_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{favorite.pgId.pg_name}</h4>
                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {favorite.pgId.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {favorite.pgId.rating || 'N/A'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{favorite.pgId.rent?.min || 0} - ₹{favorite.pgId.rent?.max || 0}
                        </span>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {favorite.pgId.images?.[0] ? (
                          <img 
                            src={favorite.pgId.images[0]} 
                            alt={favorite.pgId.pg_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{favorite.pgId.pg_name}</h4>
                        <p className="text-sm text-gray-600 flex items-center truncate">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          {favorite.pgId.address}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {favorite.pgId.rating || 'N/A'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ₹{favorite.pgId.rent?.min || 0} - ₹{favorite.pgId.rent?.max || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
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
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesManagement;