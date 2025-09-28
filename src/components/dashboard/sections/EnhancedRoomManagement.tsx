'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Plus,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Home,
  User,
  RefreshCw,
  Activity
} from 'lucide-react';

import { ownerDashboardService } from '../../../services/ownerDashboardService';
import type { 
  OccupancyStatus,
  TenantActivity 
} from '../../../services/ownerDashboardService';

interface EnhancedRoom {
  _id: string;
  name: string;
  propertyType: 'PG' | 'Room' | 'Flat';
  totalBeds?: number;
  occupiedBeds?: number;
  availableBeds?: number;
  occupancyRate?: number;
  isOccupied?: boolean;
  currentTenant?: {
    name: string;
    phone: string;
    checkInDate: string;
  };
  maxOccupancy?: number;
  currentOccupancy?: number;
  isAvailable?: boolean;
  monthlyRent?: number;
  electricityReading?: number;
  lastBillAmount?: number;
  amenities?: string[];
  area?: number;
  furnished?: boolean;
}

interface RoomTenant {
  tenantName: string;
  tenantPhone: string;
  checkInDate: string;
  isActive: boolean;
  totalStayDays: number;
}

const EnhancedRoomManagement = () => {
  const [occupancyData, setOccupancyData] = useState<OccupancyStatus | null>(null);
  const [recentActivities, setRecentActivities] = useState<TenantActivity[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<EnhancedRoom | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoomData = async () => {
    try {
      setRefreshing(true);
      
      const [occupancy, activities] = await Promise.all([
        ownerDashboardService.getOccupancyStatus(),
        ownerDashboardService.getRecentTenantActivities(30)
      ]);

      setOccupancyData(occupancy);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching room data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Combine all rooms from different property types
  const allRooms: EnhancedRoom[] = [];
  
  if (occupancyData) {
    // Add PG rooms
    occupancyData.pg.forEach(pg => {
      allRooms.push({
        ...pg,
        propertyType: 'PG' as const,
        monthlyRent: Math.floor(Math.random() * 3000) + 6000, // Demo data
        amenities: ['AC', 'WiFi', 'Shared Kitchen'],
        area: 120,
        furnished: true
      });
    });

    // Add individual rooms
    occupancyData.rooms.forEach(room => {
      allRooms.push({
        ...room,
        propertyType: 'Room' as const,
        totalBeds: 1,
        occupiedBeds: room.isOccupied ? 1 : 0,
        availableBeds: room.isOccupied ? 0 : 1,
        occupancyRate: room.isOccupied ? 100 : 0,
        monthlyRent: Math.floor(Math.random() * 2000) + 7000,
        amenities: ['AC', 'WiFi', 'Attached Bathroom'],
        area: 100,
        furnished: true
      });
    });

    // Add flats
    occupancyData.flats.forEach(flat => {
      allRooms.push({
        ...flat,
        propertyType: 'Flat' as const,
        totalBeds: flat.maxOccupancy,
        occupiedBeds: flat.currentOccupancy,
        availableBeds: flat.maxOccupancy - flat.currentOccupancy,
        occupancyRate: (flat.currentOccupancy / flat.maxOccupancy) * 100,
        monthlyRent: Math.floor(Math.random() * 5000) + 10000,
        amenities: ['AC', 'WiFi', 'Kitchen', 'Parking'],
        area: 800,
        furnished: true
      });
    });
  }

  // Filter rooms based on search and property type
  const filteredRooms = allRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPropertyType = selectedPropertyType === 'all' || 
                               room.propertyType.toLowerCase() === selectedPropertyType;
    return matchesSearch && matchesPropertyType;
  });

  const getStatusColor = (room: EnhancedRoom) => {
    if (room.propertyType === 'PG') {
      if (room.occupancyRate === 100) return 'bg-red-100 text-red-800';
      if (room.occupancyRate === 0) return 'bg-green-100 text-green-800';
      return 'bg-yellow-100 text-yellow-800';
    } else if (room.propertyType === 'Room') {
      return room.isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
    } else { // Flat
      if (!room.isAvailable) return 'bg-red-100 text-red-800';
      return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (room: EnhancedRoom) => {
    if (room.propertyType === 'PG') {
      if (room.occupancyRate === 100) return 'Full';
      if (room.occupancyRate === 0) return 'Empty';
      return 'Partial';
    } else if (room.propertyType === 'Room') {
      return room.isOccupied ? 'Occupied' : 'Available';
    } else { // Flat
      return room.isAvailable ? 'Available' : 'Full';
    }
  };

  const getRoomTenants = (roomName: string): RoomTenant[] => {
    return recentActivities
      .filter(activity => activity.propertyName === roomName)
      .map(activity => ({
        tenantName: activity.tenantName,
        tenantPhone: activity.tenantPhone,
        checkInDate: activity.checkInDate,
        isActive: activity.isActive,
        totalStayDays: activity.totalStayDays
      }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Room Management</h1>
          <p className="text-gray-600">Real-time property and occupancy tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoomData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">
                {occupancyData?.summary.totalProperties || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-gray-900">
                {occupancyData?.summary.totalOccupied || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Home className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {(occupancyData?.summary.totalCapacity || 0) - (occupancyData?.summary.totalOccupied || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {occupancyData ? 
                  ((occupancyData.summary.totalOccupied / occupancyData.summary.totalCapacity) * 100).toFixed(1) : 0
                }%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedPropertyType}
            onChange={(e) => setSelectedPropertyType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by property type"
          >
            <option value="all">All Properties</option>
            <option value="pg">PG</option>
            <option value="room">Room</option>
            <option value="flat">Flat</option>
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Room Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-500">{room.propertyType}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room)}`}>
                  {getStatusText(room)}
                </span>
              </div>

              {/* Occupancy Info */}
              <div className="mb-4">
                {room.propertyType === 'PG' ? (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Occupancy</span>
                      <span className="font-medium">{room.occupiedBeds}/{room.totalBeds} beds</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${
                          (room.occupancyRate || 0) >= 90 ? 'w-full' :
                          (room.occupancyRate || 0) >= 80 ? 'w-5/6' :
                          (room.occupancyRate || 0) >= 70 ? 'w-3/4' :
                          (room.occupancyRate || 0) >= 60 ? 'w-3/5' :
                          (room.occupancyRate || 0) >= 50 ? 'w-1/2' :
                          (room.occupancyRate || 0) >= 40 ? 'w-2/5' :
                          (room.occupancyRate || 0) >= 30 ? 'w-1/3' :
                          (room.occupancyRate || 0) >= 20 ? 'w-1/4' :
                          (room.occupancyRate || 0) >= 10 ? 'w-1/6' : 'w-1/12'
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{room.occupancyRate?.toFixed(1)}% occupied</p>
                  </div>
                ) : room.propertyType === 'Room' ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center">
                      {room.isOccupied ? (
                        <CheckCircle className="h-4 w-4 text-red-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {room.isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Occupancy</span>
                      <span className="font-medium">{room.currentOccupancy}/{room.maxOccupancy} people</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-green-600 h-2 rounded-full transition-all duration-300 ${
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 90 ? 'w-full' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 80 ? 'w-5/6' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 70 ? 'w-3/4' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 60 ? 'w-3/5' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 50 ? 'w-1/2' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 40 ? 'w-2/5' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 30 ? 'w-1/3' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 20 ? 'w-1/4' :
                          ((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100 >= 10 ? 'w-1/6' : 'w-1/12'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-semibold text-green-600">₹{room.monthlyRent?.toLocaleString()}</span>
                </div>
                {room.area && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Area</span>
                    <span className="text-gray-900">{room.area} sq ft</span>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Current Tenants */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Tenants</p>
                {getRoomTenants(room.name).filter(t => t.isActive).length > 0 ? (
                  <div className="space-y-1">
                    {getRoomTenants(room.name).filter(t => t.isActive).slice(0, 2).map((tenant, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <User className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-gray-700">{tenant.tenantName}</span>
                        <span className="ml-auto text-gray-500">
                          {tenant.totalStayDays} days
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No active tenants</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowRoomModal(true);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No properties found matching your criteria</p>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Room Activities
        </h3>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {activity.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.tenantName}</p>
                    <p className="text-xs text-gray-500">
                      {activity.propertyType} - {activity.propertyName} ({activity.roomNumber})
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {activity.isActive 
                      ? `Checked in: ${new Date(activity.checkInDate).toLocaleDateString()}`
                      : `Checked out: ${activity.checkOutDate ? new Date(activity.checkOutDate).toLocaleDateString() : 'N/A'}`
                    }
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.totalStayDays} days stay
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </div>

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close property details modal"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Property Name</label>
                      <p className="text-sm text-gray-900">{selectedRoom.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedRoom.propertyType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
                      <p className="text-sm text-gray-900">₹{selectedRoom.monthlyRent?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Area</label>
                      <p className="text-sm text-gray-900">{selectedRoom.area} sq ft</p>
                    </div>
                  </div>
                </div>

                {/* Occupancy Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Occupancy Details</h3>
                  {selectedRoom.propertyType === 'PG' ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Beds</label>
                        <p className="text-sm text-gray-900">{selectedRoom.totalBeds}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Occupied</label>
                        <p className="text-sm text-gray-900">{selectedRoom.occupiedBeds}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Available</label>
                        <p className="text-sm text-gray-900">{selectedRoom.availableBeds}</p>
                      </div>
                    </div>
                  ) : selectedRoom.propertyType === 'Flat' ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Occupancy</label>
                        <p className="text-sm text-gray-900">{selectedRoom.maxOccupancy}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current</label>
                        <p className="text-sm text-gray-900">{selectedRoom.currentOccupancy}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Available</label>
                        <p className="text-sm text-gray-900">
                          {(selectedRoom.maxOccupancy || 0) - (selectedRoom.currentOccupancy || 0)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">
                      Status: {selectedRoom.isOccupied ? 'Occupied' : 'Available'}
                    </p>
                  )}
                </div>

                {/* Current Tenants */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Tenants</h3>
                  <div className="space-y-2">
                    {getRoomTenants(selectedRoom.name).filter(t => t.isActive).map((tenant, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                        <div>
                          <p className="font-medium text-sm">{tenant.tenantName}</p>
                          <p className="text-xs text-gray-500">{tenant.tenantPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">
                            {new Date(tenant.checkInDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">{tenant.totalStayDays} days</p>
                        </div>
                      </div>
                    ))}
                    {getRoomTenants(selectedRoom.name).filter(t => t.isActive).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No active tenants</p>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.amenities.map((amenity, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedRoomManagement;
