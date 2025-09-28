"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaMapMarkerAlt, FaCrown, FaShieldAlt, 
  FaBed, FaHome, FaUsers, FaWifi, FaCar, FaSnowflake,
  FaSearch 
} from 'react-icons/fa';
import apiService from '@/services/api';
import Modal from '@/components/Modal';

interface Room {
  _id: string;
  name: string;
  propertyType: 'Room' | 'Flat';
  city: string;
  locality: string;
  pricing: {
    rent: number;
    securityDeposit: number;
  };
  roomConfig?: {
    roomType: string;
    area: number;
    furnished: boolean;
  };
  flatConfig?: {
    flatType: string;
    bedrooms: number;
    areas: {
      carpetArea: number;
    };
    furnishingStatus: string;
  };
  propertyStatus: {
    listingStatus: string;
    verified: boolean;
    featured: boolean;
  };
  totalUnits: number;
  availableUnits: number;
  media: {
    images: Array<{ url: string; isPrimary: boolean }>;
  };
  amenities: {
    basic: Record<string, boolean>;
  };
  createdAt: string;
}

const OwnerRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    status: '',
    sort: 'newest'
  });
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/api/rooms/owner');
      if (response.success) {
        setRooms(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = React.useMemo(() => {
    let filtered = [...rooms];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchTerm) ||
        room.city.toLowerCase().includes(searchTerm) ||
        room.locality.toLowerCase().includes(searchTerm)
      );
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(room => room.propertyType === filters.propertyType);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(room => room.propertyStatus.listingStatus === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price_low':
          return a.pricing.rent - b.pricing.rent;
        case 'price_high':
          return b.pricing.rent - a.pricing.rent;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [rooms, filters]);

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      setDeleteLoading(true);
      await apiService.delete(`/api/rooms/${selectedRoom._id}`);
      setRooms(rooms.filter(room => room._id !== selectedRoom._id));
      setShowDeleteModal(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getPropertyTypeIcon = (propertyType: string) => {
    return propertyType === 'Room' ? 
      <FaBed className="text-blue-600" /> : 
      <FaHome className="text-green-600" />;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Rented': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  };

  const getPrimaryImage = (room: Room) => {
    const primaryImage = room.media?.images?.find(img => img.isPrimary);
    return primaryImage?.url || room.media?.images?.[0]?.url || '/placeholder-room.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="mt-2 text-gray-600">Manage your rooms and flats</p>
          </div>
          <button
            onClick={() => router.push('/owner/rooms/add')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            Add Property
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filters.propertyType}
              onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by property type"
              title="Filter by property type"
            >
              <option value="">All Property Types</option>
              <option value="Room">Rooms</option>
              <option value="Flat">Flats</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by status"
              title="Filter by status"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              aria-label="Sort properties"
              title="Sort properties"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            <button
              onClick={() => setFilters({ search: '', propertyType: '', status: '', sort: 'newest' })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaHome className="text-indigo-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{rooms.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaShieldAlt className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {rooms.filter(room => room.propertyStatus.listingStatus === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaCrown className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {rooms.filter(room => room.propertyStatus.featured).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Units</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {rooms.reduce((sum, room) => sum + room.availableUnits, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredRooms.length} of {rooms.length} properties
          </p>
        </div>

        {/* Properties Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <FaHome className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first property</p>
            <button
              onClick={() => router.push('/owner/rooms/add')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={getPrimaryImage(room)}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <div className="bg-white px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      {getPropertyTypeIcon(room.propertyType)}
                      <span className="text-sm font-medium">{room.propertyType}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {room.propertyStatus.verified && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        <FaShieldAlt />
                      </div>
                    )}
                    {room.propertyStatus.featured && (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                        <FaCrown />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{room.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(room.propertyStatus.listingStatus)}`}>
                      {room.propertyStatus.listingStatus}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="text-sm truncate">{room.locality}, {room.city}</span>
                  </div>

                  {/* Property Details */}
                  <div className="text-sm text-gray-600 mb-3">
                    {room.propertyType === 'Room' && room.roomConfig && (
                      <span>
                        {room.roomConfig.roomType} • {room.roomConfig.area} sq ft
                        {room.roomConfig.furnished && ' • Furnished'}
                      </span>
                    )}
                    {room.propertyType === 'Flat' && room.flatConfig && (
                      <span>
                        {room.flatConfig.flatType} • {room.flatConfig.areas?.carpetArea} sq ft
                        {room.flatConfig.furnishingStatus && ` • ${room.flatConfig.furnishingStatus}`}
                      </span>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-2 mb-3">
                    {Object.entries(room.amenities?.basic || {})
                      .filter(([_, value]) => value)
                      .slice(0, 3)
                      .map(([amenity, _]) => (
                        <div key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                          {amenity === 'wifi' && <FaWifi />}
                          {amenity === 'parking' && <FaCar />}
                          {amenity === 'ac' && <FaSnowflake />}
                          <span className="capitalize">{amenity}</span>
                        </div>
                      ))}
                  </div>

                  {/* Pricing and Actions */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-indigo-600">
                        ₹{room.pricing?.rent?.toLocaleString()}
                      </span>
                      <span className="text-gray-600 text-sm">/month</span>
                      <div className="text-xs text-gray-500">
                        {room.availableUnits}/{room.totalUnits} available
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/rooms/${room._id}`)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => router.push(`/owner/rooms/edit/${room._id}`)}
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit Property"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Property"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRoom && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <FaTrash className="text-4xl text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Property</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedRoom.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRoom}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OwnerRooms;
