'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  FaBed, FaBath, FaRulerCombined, FaPhone, 
  FaHeart, FaShare, FaStar, FaWifi, FaCar, FaShieldAlt, FaLeaf,
  FaSwimmingPool, FaDumbbell, FaUsers, FaCheck,
  FaCalendarAlt, FaArrowLeft, FaEye, FaChevronLeft,
  FaChevronRight, FaTimes, FaExpand, FaCamera,
  FaComments, FaCreditCard, FaBookmark, FaWhatsapp
} from 'react-icons/fa';
import { MdLocationOn, MdVerified, MdApartment, MdElevator } from 'react-icons/md';
import ChatWidget from '@/components/property/ChatWidget';
import BookingSystem from '@/components/property/BookingSystem';
import PaymentGateway from '@/components/property/PaymentGateway';
import apiService from '@/services/api';

interface Nearby {
  name: string;
  distance: string;
  type: string;
}

interface RoomData {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  locality?: string;
  subLocality?: string;
  state: string;
  pincode: string;
  location?: {
    type: string;
    coordinates: number[];
    lat?: number;
    lng?: number;
  };
  owner: string; // Owner ID as string
  propertyType: string; // "Room" or "Flat"
  totalUnits: number;
  availableUnits: number;
  pricing?: {
    rent?: number;
    originalPrice?: number;
    securityDeposit?: number;
    maintenanceCharges?: number;
    brokerageCharges?: number;
    electricityCharges?: string;
    electricityRate?: number;
    waterCharges?: string;
    waterChargesAmount?: number;
    internetCharges?: string;
    internetChargesAmount?: number;
    parkingCharges?: number;
    priceType?: string;
    priceNegotiable?: boolean;
    offerPrice?: number;
    discountPercent?: number;
    offerValidTill?: string;
    tokenAmount?: number;
  };
  amenities?: string[] | {
    basic?: {
      powerBackup?: boolean;
      lift?: boolean;
      parking?: boolean;
      security?: boolean;
    };
    kitchen?: {
      modularKitchen?: boolean;
      gasConnection?: boolean;
      waterPurifier?: boolean;
      refrigerator?: boolean;
    };
    society?: {
      gym?: boolean;
      swimmingPool?: boolean;
      clubhouse?: boolean;
      cctv?: boolean;
      gatedSecurity?: boolean;
    };
  };
  tenantPreferences?: {
    genderPreference?: string;
    occupationType?: string[];
  };
  rules?: {
    smokingAllowed?: boolean;
    drinkingAllowed?: boolean;
    noticePeriod?: number;
  };
  contact?: {
    primaryPhone?: string;
    whatsappNumber?: string;
    email?: string;
  };
  propertyStatus?: {
    listingStatus?: string;
    verified?: boolean;
    featured?: boolean;
  };
  flatConfig?: {
    flatType?: string;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    kitchen?: {
      type: string;
      size: string;
    };
    builtupArea?: number;
    carpetArea?: number;
    floorNumber?: number;
    totalFloors?: number;
    facing?: string;
    furnishingStatus?: string;
    propertyAge?: string;
    parking?: {
      covered: number;
      open: number;
    };
  };
  analytics?: {
    views?: {
      total?: number;
      thisMonth?: number;
      thisWeek?: number;
    };
    inquiries?: {
      total?: number;
      thisMonth?: number;
    };
    shortlisted?: number;
    responseRate?: number;
    averageResponseTime?: number;
    searchRanking?: number;
    popularityScore?: number;
  };
  rating?: {
    overall?: number;
    cleanliness?: number;
    location?: number;
    facilities?: number;
    staff?: number;
    valueForMoney?: number;
  };
  reviewSummary?: {
    totalReviews?: number;
    averageRating?: number;
    ratingDistribution?: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  reviews?: Array<{
    user: string;
    rating: number;
    review: string;
    categoryRatings?: any;
    helpful?: string;
    reported?: boolean;
    approved?: boolean;
    createdAt: string;
    _id: string;
  }>;
  media?: {
    images?: Array<{
      url: string;
      caption?: string;
      category?: string;
      order?: number;
      isMain?: boolean;
      _id?: string;
    }>;
  };
  status: string;
  verified: boolean;
  averageRating: number;
  viewCount: number;
  displayPrice: number;
  priceFormatted: string;
  mainImage: string;
  price: number;
  originalPrice?: number;
  title: string;
  updatedAt?: string;
  // Additional properties for compatibility
  rent?: number;
  deposit?: number;
  maintenanceCharges?: number;
  brokerage?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnished?: string;
  floor?: number;
  totalFloors?: number;
  available?: boolean;
  availableFrom?: string;
  images?: string[];
  preferredTenants?: string;
  petAllowed?: boolean;
  smokingAllowed?: boolean;
  contactNumber?: string;
  alternateNumber?: string;
  nearby?: Nearby[];
  featured?: boolean;
  views?: number;
  inquiries?: number;
  bookings?: number;
  totalReviews?: number;
  createdAt?: string;
  type?: string;
}

interface ApiResponse {
  success: boolean;
  data: RoomData;
}

export default function RoomDetailsPage() {
  const params = useParams();
  const roomId = params.id as string;
  
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch room details from backend
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.get(`/api/rooms/${roomId}`);
        
        if (response.success && response.data) {
          setRoomData(response.data);
        } else {
          throw new Error('Failed to fetch room details');
        }
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching room details');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !roomData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Room Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The room you are looking for does not exist or has been removed.'}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    const images = roomData?.media?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = roomData?.media?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Helper function to extract image URL from image object or string
  const getImageUrl = (image: any): string => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image.url) return image.url;
    return '';
  };

  // Helper function to render amenities
  const renderAmenities = () => {
    if (!roomData?.amenities) {
      return <p className="text-gray-500">No specific amenities listed for this property.</p>;
    }

    // If amenities is an array
    if (Array.isArray(roomData.amenities)) {
      return roomData.amenities.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roomData.amenities.map((amenity: string, index: number) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-blue-600">
                {getAmenityIcon(amenity)}
              </div>
              <span className="font-medium">{amenity}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No specific amenities listed for this property.</p>
      );
    }

    // If amenities is an object (structured amenities)
    const amenitiesList: string[] = [];
    const amenitiesObj = roomData.amenities as any;
    
    if (amenitiesObj.basic) {
      if (amenitiesObj.basic.powerBackup) amenitiesList.push('Power Backup');
      if (amenitiesObj.basic.lift) amenitiesList.push('Lift');
      if (amenitiesObj.basic.parking) amenitiesList.push('Parking');
      if (amenitiesObj.basic.security) amenitiesList.push('Security');
    }
    
    if (amenitiesObj.kitchen) {
      if (amenitiesObj.kitchen.modularKitchen) amenitiesList.push('Modular Kitchen');
      if (amenitiesObj.kitchen.gasConnection) amenitiesList.push('Gas Connection');
      if (amenitiesObj.kitchen.waterPurifier) amenitiesList.push('Water Purifier');
      if (amenitiesObj.kitchen.refrigerator) amenitiesList.push('Refrigerator');
    }
    
    if (amenitiesObj.society) {
      if (amenitiesObj.society.gym) amenitiesList.push('Gym');
      if (amenitiesObj.society.swimmingPool) amenitiesList.push('Swimming Pool');
      if (amenitiesObj.society.clubhouse) amenitiesList.push('Clubhouse');
      if (amenitiesObj.society.cctv) amenitiesList.push('CCTV');
      if (amenitiesObj.society.gatedSecurity) amenitiesList.push('Gated Security');
    }

    return amenitiesList.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenitiesList.map((amenity: string, index: number) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-blue-600">
              {getAmenityIcon(amenity)}
            </div>
            <span className="font-medium">{amenity}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No specific amenities listed for this property.</p>
    );
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Parking': <FaCar />,
      'Power Backup': <FaShieldAlt />,
      'Lift': <MdElevator />,
      'Security': <FaShieldAlt />,
      'Garden': <FaLeaf />,
      'Gym': <FaDumbbell />,
      'Swimming Pool': <FaSwimmingPool />,
      'Internet': <FaWifi />,
      'AC': <span className="text-sm">❄️</span>,
      'Balcony': <span className="text-sm">🏡</span>,
    };
    return iconMap[amenity] || <FaCheck />;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              title="Go back to search results"
              aria-label="Go back to search results"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Search</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <FaHeart className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                title="Share property"
                aria-label="Share property"
              >
                <FaShare className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-full text-gray-400 hover:text-green-500 transition-colors"
                title="Bookmark property"
                aria-label="Bookmark property"
              >
                <FaBookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-1 h-96 lg:h-[500px]">
          <div className="col-span-3 relative">
            <Image
              src={getImageUrl(roomData.media?.images?.[currentImageIndex]) || roomData.mainImage || '/placeholder-room.jpg'}
              alt={roomData.name}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
            
            {/* Image Navigation */}
            {(roomData.media?.images?.length || 0) > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  title="Previous image"
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  title="Next image"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {roomData.media?.images?.length || 1}
            </div>
          </div>
          
          {/* Thumbnail Grid */}
          <div className="space-y-1">
            {(roomData.media?.images || []).slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative h-24 cursor-pointer group"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <Image
                  src={getImageUrl(image) || '/placeholder-room.jpg'}
                  alt={`${roomData.name} ${index + 2}`}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded" />
              </div>
            ))}
            
            {/* Show All Photos Button */}
            {(roomData.media?.images?.length || 0) > 5 && (
              <button
                onClick={() => setShowImageModal(true)}
                className="relative h-24 w-full bg-gray-800 bg-opacity-80 text-white flex items-center justify-center rounded hover:bg-opacity-90 transition-opacity"
                title="View all photos"
                aria-label="View all photos"
              >
                <FaCamera className="mr-2" />
                <span className="text-sm">+{(roomData.media?.images?.length || 0) - 4} photos</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <button
            onClick={() => setShowImageModal(true)}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
            title="View all photos"
            aria-label="View all photos"
          >
            <FaExpand className="mr-2" />
            View All Photos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{roomData.name}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MdLocationOn className="mr-1" />
                    <span>{roomData.address || 'Address not available'}</span>
                    {roomData.verified && (
                      <MdVerified className="ml-2 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {roomData.viewCount || roomData.analytics?.views?.total || 0} views
                    </span>
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      Posted {roomData.updatedAt ? new Date(roomData.updatedAt).toLocaleDateString() : 'Recently'}
                    </span>
                    {roomData.propertyStatus?.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ₹{roomData.displayPrice || roomData.pricing?.rent || 'Price not available'}/month
                  </div>
                  {roomData.pricing?.securityDeposit && (
                    <div className="text-sm text-gray-500">
                      Deposit: ₹{roomData.pricing.securityDeposit}
                    </div>
                  )}
                  {(roomData.averageRating || roomData.rating?.overall || 0) > 0 && (
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < (roomData.averageRating || roomData.rating?.overall || 0) ? '' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({roomData.reviewSummary?.totalReviews || 0} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
                {roomData.flatConfig?.bedrooms && (
                  <div className="text-center">
                    <FaBed className="text-blue-600 text-xl mb-2 mx-auto" />
                    <div className="font-semibold">{roomData.flatConfig.bedrooms}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                )}
                {roomData.flatConfig?.bathrooms && (
                  <div className="text-center">
                    <FaBath className="text-blue-600 text-xl mb-2 mx-auto" />
                    <div className="font-semibold">{roomData.flatConfig.bathrooms}</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                )}
                <div className="text-center">
                  <FaRulerCombined className="text-blue-600 text-xl mb-2 mx-auto" />
                  <div className="font-semibold">{roomData.area || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Sq. Ft.</div>
                </div>
                <div className="text-center">
                  <MdApartment className="text-blue-600 text-xl mb-2 mx-auto" />
                  <div className="font-semibold">{roomData.type}</div>
                  <div className="text-sm text-gray-500">Type</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'amenities', label: 'Amenities' },
                    { id: 'location', label: 'Location' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {roomData.description || 'No description available for this property.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Property Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-500">Furnished:</span>
                          <span className="ml-2 font-medium">{roomData.furnished}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Floor:</span>
                          <span className="ml-2 font-medium">{roomData.floor} of {roomData.totalFloors}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Preferred Tenants:</span>
                          <span className="ml-2 font-medium">{roomData.preferredTenants}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Pet Allowed:</span>
                          <span className="ml-2 font-medium">{roomData.petAllowed ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Smoking Allowed:</span>
                          <span className="ml-2 font-medium">{roomData.smokingAllowed ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Available From:</span>
                          <span className="ml-2 font-medium">
                            {roomData.availableFrom ? new Date(roomData.availableFrom).toLocaleDateString() : 'Immediate'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Pricing Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Rent:</span>
                            <span className="font-semibold">{formatPrice(roomData.rent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Security Deposit:</span>
                            <span className="font-semibold">₹{roomData.deposit || 0}</span>
                          </div>
                          {(roomData.maintenanceCharges || 0) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Maintenance:</span>
                              <span className="font-semibold">₹{roomData.maintenanceCharges}</span>
                            </div>
                          )}
                          {(roomData.brokerage || 0) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Brokerage:</span>
                              <span className="font-semibold">₹{roomData.brokerage}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Available Amenities</h3>
                    {renderAmenities()}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Address</h3>
                      <p className="text-gray-600">{roomData.address || 'Address not available'}</p>
                    </div>

                    {(roomData.nearby?.length || 0) > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Nearby Places</h3>
                        <div className="space-y-2">
                          {roomData.nearby?.map((place, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <span className="font-medium">{place.name}</span>
                                <span className="text-sm text-gray-500 ml-2">({place.type})</span>
                              </div>
                              <span className="text-blue-600 font-medium">{place.distance}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Map placeholder */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Map</h3>
                      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                        <span className="text-gray-500">Map integration would be displayed here</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {(roomData.totalReviews || 0) > 0 ? (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-400 text-xl">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < roomData.averageRating ? '' : 'text-gray-300'} />
                            ))}
                          </div>
                          <span className="ml-3 text-lg font-semibold">{roomData.averageRating.toFixed(1)}</span>
                          <span className="ml-2 text-gray-500">({roomData.totalReviews} reviews)</span>
                        </div>
                        {/* Review list would be displayed here */}
                        <p className="text-gray-500">Review details would be loaded from a separate API endpoint.</p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaStar className="text-gray-300 text-4xl mx-auto mb-4" />
                        <p className="text-gray-500">No reviews yet for this property.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold">{typeof roomData.owner === 'string' ? roomData.owner : 'Property Owner'}</h3>
                <p className="text-gray-500">Property Owner</p>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${roomData.contactNumber}`}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <FaPhone className="mr-2" />
                  Call Now
                </a>
                
                <a
                  href={`https://wa.me/${roomData.contactNumber?.replace(/\D/g, '') || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <FaWhatsapp className="mr-2" />
                  WhatsApp
                </a>

                <button
                  onClick={() => setShowChatWidget(true)}
                  className="flex items-center justify-center w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  title="Start live chat"
                  aria-label="Start live chat"
                >
                  <FaComments className="mr-2" />
                  Live Chat
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  title="Book this property"
                  aria-label="Book this property"
                >
                  Book Now
                </button>
                
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  title="Make secure payment"
                  aria-label="Make secure payment"
                >
                  <FaCreditCard className="mr-2 inline" />
                  Pay Securely
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Contact details: {roomData.contactNumber}
                  {roomData.alternateNumber && ` | ${roomData.alternateNumber}`}
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Property ID:</span>
                  <span className="font-medium">{roomData._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Property Type:</span>
                  <span className="font-medium">{roomData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium capitalize text-green-600">{roomData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Views:</span>
                  <span className="font-medium">{roomData.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inquiries:</span>
                  <span className="font-medium">{roomData.inquiries}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl"
              title="Close image gallery"
              aria-label="Close image gallery"
            >
              <FaTimes />
            </button>
            
            <div className="relative">
              <Image
                src={getImageUrl(roomData.media?.images?.[currentImageIndex]) || roomData.mainImage || '/placeholder-room.jpg'}
                alt={roomData.name}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {(roomData.media?.images?.length || 0) > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                    title="Previous image"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                    title="Next image"
                    aria-label="Next image"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
            
            <div className="text-center mt-4 text-white">
              {currentImageIndex + 1} / {roomData.media?.images?.length || 1}
            </div>
          </div>
        </div>
      )}

      {showBookingModal && (
        <BookingSystem
          propertyId={roomData._id}
          propertyTitle={roomData.name}
          propertyType="Room"
          ownerName={typeof roomData.owner === 'string' ? roomData.owner : 'Property Owner'}
          pricing={{
            rent: roomData.displayPrice || roomData.rent || 0,
            deposit: roomData.deposit || 0,
            maintenance: roomData.maintenanceCharges || 0
          }}
          availability={{
            available: roomData.available || true,
            availableFrom: roomData.availableFrom,
            minimumStay: 1
          }}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={(bookingId: string) => {
            console.log('Booking completed:', bookingId);
            setShowBookingModal(false);
          }}
        />
      )}

      {showPaymentModal && (
        <PaymentGateway
          amount={roomData.displayPrice || roomData.rent || 0}
          orderId={`ORD_${roomData._id}_${Date.now()}`}
          propertyTitle={roomData.name}
          propertyType="Room"
          customerDetails={{
            name: '',
            email: '',
            phone: ''
          }}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={(transactionId: string) => {
            console.log('Payment completed:', transactionId);
            setShowPaymentModal(false);
          }}
          onPaymentFailure={(error: string) => {
            console.error('Payment failed:', error);
          }}
        />
      )}

      {showChatWidget && (
        <ChatWidget
          propertyId={roomData._id}
          ownerName={typeof roomData.owner === 'string' ? roomData.owner : 'Property Owner'}
          ownerPhone={roomData.contactNumber || ''}
          propertyTitle={roomData.name}
          propertyType="Room"
        />
      )}
    </div>
  );
}
