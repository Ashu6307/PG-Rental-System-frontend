"use client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaBuilding, FaMapMarkerAlt, FaStar, FaWifi, FaCar, FaSearch, FaHeart, FaEye, 
  FaMale, FaFemale, FaUsers, FaShieldAlt, FaDumbbell, 
  FaSnowflake, FaBed, FaBath, FaHome, FaRupeeSign 
} from 'react-icons/fa';
import apiService from '@/services/api';
import AutoImageCarousel from '@/components/AutoImageCarousel';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    roomType: '',
    genderPreference: '',
    sort: 'price_low'
  });
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = 'Rooms & Flats | PG & Room Rental';
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Get selected city from localStorage
      const savedCity = localStorage.getItem('selectedCity');
      const selectedCity = savedCity ? JSON.parse(savedCity) : null;
      
      // Build API URL with city filter
      let apiUrl = '/api/rooms';
      const params = new URLSearchParams();
      
      // Only add city filter if it's not "All Cities"
      if (selectedCity && selectedCity.name && selectedCity.id !== 'all') {
        params.append('city', selectedCity.name);
      }
      
      if (params.toString()) {
        apiUrl += `?${params.toString()}`;
      }
      
      console.log('Fetching rooms with URL:', apiUrl);
      console.log('Selected city:', selectedCity);
      const response = await apiService.get(apiUrl);
      
      if (response?.success) {
        setRooms(response.data || []);
        console.log(`Loaded ${response.data?.length || 0} rooms for city: ${selectedCity?.name || 'all cities'}`);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(room =>
        room.name?.toLowerCase().includes(searchTerm) ||
        room.city?.toLowerCase().includes(searchTerm) ||
        room.description?.toLowerCase().includes(searchTerm) ||
        room.address?.toLowerCase().includes(searchTerm) ||
        room.locality?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.propertyType) {
      filtered = filtered.filter(room => room.propertyType === filters.propertyType);
    }
    
    if (filters.roomType) {
      filtered = filtered.filter(room => 
        room.roomConfig?.roomType === filters.roomType ||
        room.flatConfig?.flatType === filters.roomType
      );
    }
    
    if (filters.genderPreference) {
      filtered = filtered.filter(room => 
        room.tenantPreferences?.genderPreference === filters.genderPreference ||
        room.tenantPreferences?.genderPreference === 'Any'
      );
    }

    // Sorting
    switch (filters.sort) {
      case 'price_low':
        filtered.sort((a, b) => (a.pricing?.rent || 0) - (b.pricing?.rent || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.pricing?.rent || 0) - (a.pricing?.rent || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));
        break;
      case 'area':
        filtered.sort((a, b) => (b.roomConfig?.area || b.flatConfig?.builtupArea || 0) - (a.roomConfig?.area || a.flatConfig?.builtupArea || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [rooms, filters]);

  const handleRoomClick = async (room: any) => {
    try {
      // Track view analytics
      await apiService.post(`/rooms/${room._id}/view`, {});
      // Navigate to room details page
      router.push(`/rooms/${room._id}`);
    } catch (error) {
      console.error('Error tracking room view:', error);
      // Still navigate even if tracking fails
      router.push(`/rooms/${room._id}`);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FaStar key={i} className="text-yellow-400 text-xs" title={`Rating: ${rating.toFixed(1)}/5 stars`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStar key={i} className="text-yellow-400 text-xs opacity-50" title={`Rating: ${rating.toFixed(1)}/5 stars`} />
        );
      } else {
        stars.push(
          <FaStar key={i} className="text-gray-300 text-xs" title={`Rating: ${rating.toFixed(1)}/5 stars`} />
        );
      }
    }
    return stars;
  };

  const getDiscountBadge = (room: any) => {
    // Check for discount in pricing
    if (room.pricing?.originalPrice && room.pricing.originalPrice > room.pricing.rent) {
      const discount = Math.round(((room.pricing.originalPrice - room.pricing.rent) / room.pricing.originalPrice) * 100);
      return (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {discount}% OFF
        </div>
      );
    }
    return null;
  };

  const getPropertyBadge = (room: any) => {
    // First check for discount
    const discountBadge = getDiscountBadge(room);
    if (discountBadge) {
      return discountBadge;
    }
    
    if (room.featured) {
      return (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          FEATURED
        </div>
      );
    }
    
    if (room.verified) {
      return (
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          VERIFIED
        </div>
      );
    }
    
    return null;
  };

  const getGenderIcon = (genderPreference: string) => {
    switch (genderPreference?.toLowerCase()) {
      case 'male':
        return <FaMale className="text-blue-600 text-xs" title="Boys Only" />;
      case 'female':
        return <FaFemale className="text-pink-600 text-xs" title="Girls Only" />;
      case 'any':
      default:
        return <FaUsers className="text-purple-600 text-xs" title="Boys & Girls" />;
    }
  };

  const formatPrice = (room: any) => {
    const rent = room.pricing?.rent || 0;
    const maintenance = room.pricing?.maintenanceCharges || 0;
    const total = rent + maintenance;
    
    return {
      rent,
      maintenance,
      total,
      formatted: `₹${rent.toLocaleString()}/month`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 mb-8 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-3 w-16 h-16"></div>
                <div className="h-8 w-48 bg-white rounded"></div>
              </div>
              <div className="h-8 w-32 bg-white rounded"></div>
            </div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse h-96">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <FaHome className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Rooms & Flats
                </h1>
                <p className="text-blue-100 text-lg">
                  Discover your perfect accommodation in Bangalore
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{rooms.length}</div>
              <div className="text-blue-100 text-sm">Available Properties</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by location, name, or description..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[180px]"
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                aria-label="Select property type"
              >
                <option value="">🏠 All Property Types</option>
                <option value="Room">🛏️ Rooms</option>
                <option value="Flat">🏢 Flats</option>
              </select>
              
              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[180px]"
                value={filters.roomType}
                onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
                aria-label="Select room type"
              >
                <option value="">🏠 All Room Types</option>
                <option value="Single Occupancy">🛏️ Single Room</option>
                <option value="Double Occupancy">👥 Double Sharing</option>
                <option value="Triple Occupancy">👨‍👩‍👧 Triple Sharing</option>
                <option value="1BHK">🏠 1BHK</option>
                <option value="2BHK">🏡 2BHK</option>
                <option value="3BHK">🏘️ 3BHK</option>
              </select>
              
              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[160px]"
                value={filters.genderPreference}
                onChange={(e) => setFilters(prev => ({ ...prev, genderPreference: e.target.value }))}
                aria-label="Select gender preference"
              >
                <option value="">👤 All Genders</option>
                <option value="Male">👨 Boys Only</option>
                <option value="Female">👩 Girls Only</option>
                <option value="Any">👫 Boys & Girls</option>
              </select>
              
              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[180px]"
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                aria-label="Sort properties"
              >
                <option value="price_low">💰 Price: Low to High</option>
                <option value="price_high">💸 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="area">📐 Largest Area</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count - Hidden as requested */}
        {/* 
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredRooms.length} Properties Found
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredRooms.length} of {rooms.length} properties
          </div>
        </div>
        */}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map(room => {
            const priceInfo = formatPrice(room);
            
            return (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleRoomClick(room)}
              >
                {/* Image Carousel */}
                <div className="relative">
                  <AutoImageCarousel
                    images={room.media?.images || []}
                    alt={room.name}
                    className="h-48"
                    autoSlideInterval={4000}
                    showControls={true}
                    showDots={true}
                    type="pg"
                  />
                  {getPropertyBadge(room)}
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20">
                    <FaEye /> {room.viewCount || 0}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Title & Favorite */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-2" title={room.name}>
                      {room.name}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500 transition ml-2" title="Add to Favorites">
                      <FaHeart className="text-lg" />
                    </button>
                  </div>

                  {/* Location & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-red-500 text-sm" />
                      <span className="text-sm" title={room.address}>
                        {room.locality}, {room.city}
                      </span>
                    </div>
                    {room.rating?.overall > 0 && (
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {renderStars(room.rating.overall)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {room.rating.overall.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaBuilding className="text-blue-500" />
                        {room.propertyType}
                      </span>
                      {room.roomConfig && (
                        <span className="flex items-center gap-1">
                          <FaBed className="text-green-500" />
                          {room.roomConfig.area} sq ft
                        </span>
                      )}
                      {room.flatConfig && (
                        <span className="flex items-center gap-1">
                          <FaBed className="text-green-500" />
                          {room.flatConfig.bedrooms}BR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {getGenderIcon(room.tenantPreferences?.genderPreference)}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    {room.amenities?.basic?.wifi && 
                      <FaWifi className="text-blue-500" title="WiFi Available" />
                    }
                    {room.amenities?.basic?.parking && 
                      <FaCar className="text-green-500" title="Parking Available" />
                    }
                    {room.amenities?.basic?.ac && 
                      <FaSnowflake className="text-cyan-500" title="AC Available" />
                    }
                    {room.amenities?.basic?.security && 
                      <FaShieldAlt className="text-red-500" title="Security Available" />
                    }
                    {room.amenities?.luxury?.gym && 
                      <FaDumbbell className="text-gray-600" title="Gym Available" />
                    }
                    {room.roomConfig?.attachedBathroom && 
                      <FaBath className="text-blue-400" title="Attached Bathroom" />
                    }
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold text-gray-800 flex items-center">
                            <FaRupeeSign className="text-green-600 text-lg" />
                            {priceInfo.rent.toLocaleString()}
                            <span className="text-sm font-normal text-gray-500 ml-1">/month</span>
                          </div>
                          {room.pricing?.originalPrice && room.pricing.originalPrice > room.pricing.rent && (
                            <span className="text-sm text-gray-500 line-through" title={`Original price: ₹${room.pricing.originalPrice?.toLocaleString()}/month`}>
                              ₹{room.pricing.originalPrice?.toLocaleString()}/month
                            </span>
                          )}
                        </div>
                        {priceInfo.maintenance > 0 && (
                          <div className="text-xs text-gray-500">
                            + ₹{priceInfo.maintenance.toLocaleString()} maintenance
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {room.availableUnits || 0} Available
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
