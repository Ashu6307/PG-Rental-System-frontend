'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ChatWidget from '@/components/property/ChatWidget';
import BookingSystem from '@/components/property/BookingSystem';
import PaymentGateway from '@/components/property/PaymentGateway';
import { 
  FaArrowLeft, 
  FaShare, 
  FaHeart, 
  FaRegHeart,
  FaMapMarkerAlt,
  FaBed,
  FaWifi,
  FaParking,
  FaUtensils,
  FaTv,
  FaSnowflake,
  FaDumbbell,
  FaShieldAlt,
  FaUsers,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHome,
  FaCheckCircle,
  FaClock,
  FaRupeeSign,
  FaBolt,
  FaWater,
  FaTrash,
  FaLeaf,
  FaCouch,
  FaImages,
  FaCamera,
  FaMapPin,
  FaDirections,
  FaComments,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaCopy,
  FaCheck,
  FaEye,
  FaCertificate,
  FaLocationArrow,
  FaCalendar
} from 'react-icons/fa';
import apiService from '@/services/api';

interface PG {
  _id: string;
  name: string;
  description: string;
  type: 'Boys' | 'Girls' | 'Co-living';
  price: number;
  securityDeposit: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  amenities: string[];
  images: Array<{
    url: string;
    description?: string;
    isPrimary?: boolean;
    _id?: string;
  }>;
  roomTypes: Array<{
    type: 'Single' | 'Double' | 'Triple';
    price: number;
    available: number;
    total: number;
    amenities: string[];
  }>;
  rules: string[];
  timing: {
    checkIn: string;
    checkOut: string;
    visitingHours: string;
  };
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    price: number;
  };
  owner: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profileImage?: string;
    verificationStatus: string;
    rating: number;
    totalProperties: number;
  };
  reviews: Array<{
    _id: string;
    user: {
      name: string;
      profileImage?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  analytics: {
    views: number;
    inquiries: number;
    bookings: number;
  };
  rating: {
    overall: number;
    cleanliness: number;
    safety: number;
    location: number;
    food: number;
    facilities: number;
  };
  totalReviews: number;
  verificationStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'WiFi': <FaWifi className="text-blue-500" />,
  'Parking': <FaParking className="text-green-500" />,
  'Kitchen': <FaUtensils className="text-orange-500" />,
  'TV': <FaTv className="text-purple-500" />,
  'AC': <FaSnowflake className="text-blue-400" />,
  'Gym': <FaDumbbell className="text-red-500" />,
  'Security': <FaShieldAlt className="text-gray-600" />,
  'Laundry': <FaLeaf className="text-green-400" />,
  'Power Backup': <FaBolt className="text-yellow-500" />,
  'Water Supply': <FaWater className="text-blue-600" />,
  'Waste Management': <FaTrash className="text-gray-500" />,
  'CCTV': <FaCamera className="text-gray-700" />,
  'Cleaning Service': <FaLeaf className="text-green-500" />,
  'Common Area': <FaCouch className="text-brown-500" />,
};

const PGDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [pg, setPG] = useState<PG | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Advanced feature states
  const [showBookingSystem, setShowBookingSystem] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [bookingOrderId, setBookingOrderId] = useState('');

  // Helper function to extract image URL from image object or string
  const getImageUrl = (image: any): string => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image.url) return image.url;
    return '';
  };

  useEffect(() => {
    const fetchPGDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/api/pgs/public/${params.id}`);
        if (response.success) {
          setPG(response.data);
          document.title = `${response.data.name} - PG in ${response.data.location.city}`;
        } else {
          setError('PG not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load PG details');
        console.error('Error fetching PG details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPGDetails();
    }
  }, [params.id]);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = `${pg?.name} - PG in ${pg?.location.city}`;
    const text = `Check out this amazing PG: ${title}`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL');
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const renderStars = (rating: number, size: string = 'text-sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={`text-yellow-400 ${size}`} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />);
    }

    return stars;
  };

  // Advanced feature handlers
  const handleBookNow = () => {
    setBookingOrderId('ORD' + Date.now());
    setShowBookingSystem(true);
  };

  const handleBookingSuccess = (bookingId: string) => {
    setShowBookingSystem(false);
    // You can add success notification here
    console.log('Booking successful:', bookingId);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setShowPaymentGateway(false);
    // You can add success notification here
    console.log('Payment successful:', transactionId);
  };

  const handlePaymentFailure = (error: string) => {
    setShowPaymentGateway(false);
    // You can add error notification here
    console.error('Payment failed:', error);
  };

  const ImageGallery = () => (
    <div className="relative">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group">
        <Image
          src={getImageUrl(pg?.images[selectedImageIndex]) || '/placeholder-pg.jpg'}
          alt={pg?.name || 'PG Image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-gray-800" />
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleShare()}
                className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                aria-label="Share this PG"
              >
                <FaShare className="text-gray-800" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-800" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {pg?.name}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <FaMapMarkerAlt />
                  <span className="text-lg">{pg?.location.city}, {pg?.location.state}</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowImageModal(true)}
                className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-2"
                title="View all photos"
                aria-label="View all photos"
              >
                <FaImages className="text-gray-800" />
                <span className="text-gray-800 font-medium">
                  {pg?.images?.length || 0} Photos
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Navigation */}
        {pg && (pg.images?.length || 0) > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex(prev => 
                prev === 0 ? (pg.images?.length || 1) - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
              aria-label="Previous image"
            >
              <FaArrowLeft className="text-gray-800" />
            </button>
            <button
              onClick={() => setSelectedImageIndex(prev => 
                prev === (pg.images?.length || 1) - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
              aria-label="Next image"
            >
              <FaArrowLeft className="text-gray-800 rotate-180" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {pg && pg.images && pg.images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {pg.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={`View image ${index + 1}`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={getImageUrl(image) || '/placeholder-pg.jpg'}
                alt={`PG Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const QuickInfo = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <FaUsers className="text-blue-600 text-2xl mx-auto mb-2" />
          <div className="text-sm text-gray-600">Type</div>
          <div className="font-semibold text-gray-800">{pg?.type}</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <FaRupeeSign className="text-green-600 text-2xl mx-auto mb-2" />
          <div className="text-sm text-gray-600">Starting From</div>
          <div className="font-semibold text-gray-800">₹{pg?.price?.toLocaleString()}</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-xl">
          <FaStar className="text-yellow-600 text-2xl mx-auto mb-2" />
          <div className="text-sm text-gray-600">Rating</div>
          <div className="font-semibold text-gray-800">{pg?.rating?.overall?.toFixed(1)}</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <FaEye className="text-purple-600 text-2xl mx-auto mb-2" />
          <div className="text-sm text-gray-600">Views</div>
          <div className="font-semibold text-gray-800">{pg?.analytics?.views}</div>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
      <div className="flex overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FaHome },
          { id: 'rooms', label: 'Room Types', icon: FaBed },
          { id: 'amenities', label: 'Amenities', icon: FaWifi },
          { id: 'reviews', label: 'Reviews', icon: FaStar },
          { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
          { id: 'contact', label: 'Contact', icon: FaPhoneAlt }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="text-lg" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PG details...</p>
        </div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">PG Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The PG you are looking for does not exist.'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Image Gallery */}
        <ImageGallery />

        {/* Quick Info Cards */}
        <QuickInfo />

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This PG</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {pg.description}
                </p>

                {/* Timing Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-blue-500" />
                      <span className="font-medium">Check-in</span>
                    </div>
                    <span className="text-gray-600">{pg.timing?.checkIn || 'Flexible'}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-red-500" />
                      <span className="font-medium">Check-out</span>
                    </div>
                    <span className="text-gray-600">{pg.timing?.checkOut || 'Flexible'}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUsers className="text-green-500" />
                      <span className="font-medium">Visiting Hours</span>
                    </div>
                    <span className="text-gray-600">{pg.timing?.visitingHours || 'Flexible'}</span>
                  </div>
                </div>

                {/* Meals Information */}
                {pg.meals && (
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUtensils className="text-orange-500" />
                      Meals Available
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className={`text-center p-3 rounded-lg ${pg.meals.breakfast ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        <div className="font-medium">Breakfast</div>
                        <div className="text-sm">{pg.meals.breakfast ? '✓ Available' : '✗ Not Available'}</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${pg.meals.lunch ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        <div className="font-medium">Lunch</div>
                        <div className="text-sm">{pg.meals.lunch ? '✓ Available' : '✗ Not Available'}</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${pg.meals.dinner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        <div className="font-medium">Dinner</div>
                        <div className="text-sm">{pg.meals.dinner ? '✓ Available' : '✗ Not Available'}</div>
                      </div>
                    </div>
                    {pg.meals.price && (
                      <div className="text-center font-semibold text-gray-800">
                        Meal Plan: ₹{pg.meals.price.toLocaleString()}/month
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Room Types & Pricing</h2>
                <div className="space-y-4">
                  {pg.roomTypes?.map((room, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {room.type} Occupancy
                          </h3>
                          <div className="text-2xl font-bold text-green-600">
                            ₹{room.price.toLocaleString()}/month
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Availability</div>
                          <div className={`text-lg font-semibold ${room.available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {room.available}/{room.total} rooms
                          </div>
                        </div>
                      </div>
                      
                      {room.amenities && room.amenities.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">Room Amenities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.map((amenity, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pg.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      {amenityIcons[amenity] || <FaCheckCircle className="text-green-500" />}
                      <span className="font-medium text-gray-800">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews & Ratings</h2>
                
                {/* Rating Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        {pg.rating?.overall?.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(pg.rating?.overall || 0, 'text-lg')}
                      </div>
                      <div className="text-gray-600">
                        Based on {pg.totalReviews} reviews
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <button 
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        title="Write a review for this property"
                        aria-label="Write a review for this property"
                      >
                        Write a Review
                      </button>
                    </div>
                  </div>

                  {/* Detailed Ratings */}
                  {pg.rating && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: 'Cleanliness', value: pg.rating.cleanliness },
                        { label: 'Safety', value: pg.rating.safety },
                        { label: 'Location', value: pg.rating.location },
                        { label: 'Food', value: pg.rating.food },
                        { label: 'Facilities', value: pg.rating.facilities }
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-semibold text-gray-800">
                            {item.value?.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">{item.label}</div>
                          <div className="flex justify-center mt-1">
                            {renderStars(item.value || 0, 'text-xs')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {pg.reviews?.map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Location & Nearby</h2>
                
                {/* Address */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <FaMapPin className="text-red-500 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {pg.location.address}<br />
                        {pg.location.city}, {pg.location.state} - {pg.location.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-6">
                  <div className="text-center text-gray-500">
                    <FaMapMarkerAlt className="text-4xl mx-auto mb-2" />
                    <p>Interactive Map View</p>
                    <p className="text-sm">Map integration coming soon</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors"
                    title="Get directions to this location"
                    aria-label="Get directions to this location"
                  >
                    <FaDirections />
                    Get Directions
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors"
                    title="Share this location"
                    aria-label="Share this location"
                  >
                    <FaLocationArrow />
                    Share Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                  {pg.owner?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{pg.owner?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Property Owner</span>
                    {pg.owner?.verificationStatus === 'verified' && (
                      <FaCertificate className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(pg.owner?.rating || 0, 'text-xs')}
                    <span className="text-xs text-gray-500 ml-1">
                      ({pg.owner?.totalProperties} properties)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  title="Contact property owner"
                  aria-label="Contact property owner"
                >
                  <FaPhoneAlt />
                  Contact Owner
                </button>
                
                <button 
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  title="Contact via WhatsApp"
                  aria-label="Contact via WhatsApp"
                >
                  <FaWhatsapp />
                  WhatsApp
                </button>
                
                <button 
                  className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  title="Send message to owner"
                  aria-label="Send message to owner"
                >
                  <FaEnvelope />
                  Send Message
                </button>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Starting from</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{pg.price?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-semibold text-gray-800">
                    ₹{pg.securityDeposit?.toLocaleString()}
                  </span>
                </div>
                
                {pg.meals?.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Meal Plan (Optional)</span>
                    <span className="font-semibold text-gray-800">
                      ₹{pg.meals.price.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="space-y-2">
                  <button 
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                    title="Book this property now"
                    aria-label="Book this property now"
                  >
                    <FaCalendar />
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaEye className="text-blue-500" />
                    Total Views
                  </span>
                  <span className="font-semibold text-gray-800">
                    {pg.analytics?.views?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaComments className="text-green-500" />
                    Inquiries
                  </span>
                  <span className="font-semibold text-gray-800">
                    {pg.analytics?.inquiries?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaCheckCircle className="text-purple-500" />
                    Bookings
                  </span>
                  <span className="font-semibold text-gray-800">
                    {pg.analytics?.bookings?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Contact Owner</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700"
                title="Close contact modal"
                aria-label="Close contact modal"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FaPhoneAlt className="text-blue-500" />
                <div>
                  <div className="font-medium text-gray-800">Phone</div>
                  <div className="text-gray-600">{pg.owner?.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FaEnvelope className="text-green-500" />
                <div>
                  <div className="font-medium text-gray-800">Email</div>
                  <div className="text-gray-600">{pg.owner?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Share this PG</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
                title="Close share modal"
                aria-label="Close share modal"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors"
                title="Share via WhatsApp"
                aria-label="Share via WhatsApp"
              >
                <FaWhatsapp />
                WhatsApp
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                title="Share on Facebook"
                aria-label="Share on Facebook"
              >
                <FaFacebook />
                Facebook
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 bg-blue-400 text-white py-3 px-4 rounded-xl hover:bg-blue-500 transition-colors"
                title="Share on Twitter"
                aria-label="Share on Twitter"
              >
                <FaTwitter />
                Twitter
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-2 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors"
                title={copied ? "Link copied!" : "Copy link to clipboard"}
                aria-label={copied ? "Link copied!" : "Copy link to clipboard"}
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              title="Close image gallery"
              aria-label="Close image gallery"
            >
              ✕
            </button>
            
            <Image
              src={getImageUrl(pg.images?.[selectedImageIndex]) || '/placeholder-pg.jpg'}
              alt="PG Image"
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            
            {(pg.images?.length || 0) > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? (pg.images?.length || 1) - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300"
                  title="Previous image"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === (pg.images?.length || 1) - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300"
                  title="Next image"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
              {selectedImageIndex + 1} / {pg.images?.length || 0}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Feature Components */}
      
      {/* Chat Widget */}
      <ChatWidget
        propertyId={pg._id}
        ownerName={pg.owner?.name || 'Property Owner'}
        ownerPhone={pg.owner?.phone || ''}
        propertyTitle={pg.name}
        propertyType="PG"
      />

      {/* Booking System Modal */}
      <BookingSystem
        propertyId={pg._id}
        propertyTitle={pg.name}
        propertyType="PG"
        ownerName={pg.owner?.name || 'Property Owner'}
        pricing={{
          rent: pg.price,
          deposit: pg.securityDeposit,
          maintenance: pg.meals?.price
        }}
        availability={{
          available: true,
          availableFrom: new Date().toISOString().split('T')[0],
          minimumStay: 1
        }}
        isOpen={showBookingSystem}
        onClose={() => setShowBookingSystem(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Payment Gateway Modal */}
      <PaymentGateway
        amount={pg.price + pg.securityDeposit}
        orderId={bookingOrderId}
        propertyTitle={pg.name}
        propertyType="PG"
        customerDetails={{
          name: '',
          email: '',
          phone: ''
        }}
        isOpen={showPaymentGateway}
        onClose={() => setShowPaymentGateway(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </div>
  );
};

export default PGDetailsPage;