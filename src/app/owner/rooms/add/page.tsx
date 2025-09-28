"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSave, FaArrowLeft, FaBed, FaHome,
  FaPlus, FaTimes, FaCar,
  FaUtensils, FaBath
} from 'react-icons/fa';
import apiService from '@/services/api';

interface AreaImageSectionProps {
  title: string;
  icon: React.ReactNode;
  images: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
}

const AreaImageSection: React.FC<AreaImageSectionProps> = ({ title, icon, images, onAddImage, onRemoveImage }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onAddImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        {icon}
        <span className="ml-2 font-medium text-gray-700">{title}</span>
        <span className="ml-auto text-sm text-gray-500">({images.length} images)</span>
      </div>
      
      <div className="flex gap-2 mb-3">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={`Add ${title.toLowerCase()} image URL`}
        />
        <button
          type="button"
          onClick={handleAddImage}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          title={`Add ${title.toLowerCase()} image`}
          aria-label={`Add ${title.toLowerCase()} image`}
        >
          <FaPlus />
        </button>
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt={`${title} ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                title={`Remove ${title.toLowerCase()} image`}
                aria-label={`Remove ${title.toLowerCase()} image`}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface RoomFormData {
  name: string;
  description: string;
  propertyType: 'Room' | 'Flat';
  address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  subLocality: string;
  landmarks: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  pricing: {
    rent: number;
    securityDeposit: number;
    maintenanceCharges: number;
    electricityCharges: 'Included' | 'Extra' | 'Per Unit';
    waterCharges: 'Included' | 'Extra';
    internetCharges: number;
    parkingCharges: number;
  };
  totalUnits: number;
  availableUnits: number;
  roomConfig?: {
    roomType: string;
    area: number;
    furnished: boolean;
    attachedBathroom: boolean;
    balcony: boolean;
    floor: number;
    facing: string;
    acType: string;
  };
  flatConfig?: {
    flatType: string;
    bedrooms: number;
    bathrooms: number;
    halls: number;
    kitchens: number;
    balconies: number;
    areas: {
      carpetArea: number;
      builtUpArea: number;
    };
    floor: number;
    totalFloors: number;
    furnishingStatus: string;
    ageOfProperty: string;
  };
  amenities: {
    basic: Record<string, boolean>;
    room: Record<string, boolean>;
    kitchen: Record<string, boolean>;
    society: Record<string, boolean>;
  };
  media: {
    images: Array<{ url: string; category: string; isPrimary: boolean }>;
    areaImages: {
      kitchen: string[];
      bedroom: string[];
      bathroom: string[];
      livingRoom: string[];
      balcony: string[];
      parking: string[];
      entrance: string[];
      others: Array<{ label: string; images: string[] }>;
    };
  };
  contact: {
    primaryPhone: string;
    whatsappNumber: string;
    email: string;
  };
  tenantPreferences: {
    genderPreference: string;
    occupationType: string;
    foodHabits: string;
    smokingAllowed: boolean;
    drinkingAllowed: boolean;
    petsAllowed: boolean;
  };
}

const AddRoom: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newLandmark, setNewLandmark] = useState('');
  const [newImage, setNewImage] = useState('');
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    propertyType: 'Room',
    address: '',
    city: '',
    state: '',
    pincode: '',
    locality: '',
    subLocality: '',
    landmarks: [],
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    pricing: {
      rent: 0,
      securityDeposit: 0,
      maintenanceCharges: 0,
      electricityCharges: 'Extra',
      waterCharges: 'Included',
      internetCharges: 0,
      parkingCharges: 0,
    },
    totalUnits: 1,
    availableUnits: 1,
    roomConfig: {
      roomType: 'Single',
      area: 0,
      furnished: false,
      attachedBathroom: false,
      balcony: false,
      floor: 0,
      facing: 'North',
      acType: 'None'
    },
    flatConfig: {
      flatType: '1BHK',
      bedrooms: 1,
      bathrooms: 1,
      halls: 1,
      kitchens: 1,
      balconies: 0,
      areas: {
        carpetArea: 0,
        builtUpArea: 0,
      },
      floor: 0,
      totalFloors: 1,
      furnishingStatus: 'Unfurnished',
      ageOfProperty: '1-5 years'
    },
    amenities: {
      basic: {
        wifi: false,
        parking: false,
        powerBackup: false,
        waterSupply: false,
        security: false,
        lift: false,
        cctv: false,
      },
      room: {
        ac: false,
        geyser: false,
        bed: false,
        wardrobe: false,
        studyTable: false,
        fan: false,
      },
      kitchen: {
        modularKitchen: false,
        refrigerator: false,
        microwave: false,
        gasConnection: false,
        waterPurifier: false,
        washingMachine: false,
      },
      society: {
        gym: false,
        swimming: false,
        garden: false,
        playground: false,
        clubhouse: false,
        commonArea: false,
      }
    },
    media: {
      images: [],
      areaImages: {
        kitchen: [],
        bedroom: [],
        bathroom: [],
        livingRoom: [],
        balcony: [],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: '',
      whatsappNumber: '',
      email: '',
    },
    tenantPreferences: {
      genderPreference: 'Any',
      occupationType: 'Any',
      foodHabits: 'Any',
      smokingAllowed: false,
      drinkingAllowed: false,
      petsAllowed: false,
    }
  });

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addLandmark = () => {
    if (newLandmark.trim() && formData.landmarks.length < 5) {
      setFormData(prev => ({
        ...prev,
        landmarks: [...prev.landmarks, newLandmark.trim()]
      }));
      setNewLandmark('');
    }
  };

  const removeLandmark = (index: number) => {
    setFormData(prev => ({
      ...prev,
      landmarks: prev.landmarks.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && formData.media.images.length < 20) {
      setFormData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          images: [...prev.media.images, {
            url: newImage.trim(),
            category: 'Room',
            isPrimary: prev.media.images.length === 0
          }]
        }
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        images: prev.media.images.filter((_, i) => i !== index)
      }
    }));
  };

  const addAreaImage = (area: keyof typeof formData.media.areaImages, url: string) => {
    if (url.trim()) {
      setFormData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          areaImages: {
            ...prev.media.areaImages,
            [area]: [...prev.media.areaImages[area], url]
          }
        }
      }));
    }
  };

  const removeAreaImage = (area: keyof typeof formData.media.areaImages, index: number) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        areaImages: {
          ...prev.media.areaImages,
          [area]: prev.media.areaImages[area].filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Remove unnecessary config based on property type
      const submitData = { ...formData };
      if (formData.propertyType === 'Room') {
        delete submitData.flatConfig;
      } else {
        delete submitData.roomConfig;
      }

      const response = await apiService.post('/api/rooms', submitData);
      
      if (response.success) {
        router.push('/owner/rooms');
      } else {
        alert('Failed to add property. Please try again.');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title="Go back to previous page"
              aria-label="Go back to previous page"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
              <p className="mt-2 text-gray-600">Fill in the details to list your property</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter property name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value as 'Room' | 'Flat')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  aria-label="Property type"
                  title="Select property type"
                >
                  <option value="Room">Room</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your property"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="6-digit pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locality *
                </label>
                <input
                  type="text"
                  required
                  value={formData.locality}
                  onChange={(e) => handleInputChange('locality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Area/Locality"
                />
              </div>

              {/* Landmarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmarks (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add a landmark"
                  />
                  <button
                    type="button"
                    onClick={addLandmark}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    title="Add landmark"
                    aria-label="Add landmark"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.landmarks.map((landmark, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {landmark}
                      <button
                        type="button"
                        onClick={() => removeLandmark(index)}
                        className="text-gray-500 hover:text-red-500"
                        title={`Remove landmark: ${landmark}`}
                        aria-label={`Remove landmark: ${landmark}`}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Property Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {formData.propertyType} Configuration
            </h2>
            
            {formData.propertyType === 'Room' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    required
                    value={formData.roomConfig?.roomType}
                    onChange={(e) => handleInputChange('roomConfig.roomType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    aria-label="Room type"
                    title="Select room type"
                  >
                    <option value="Single">Single Occupancy</option>
                    <option value="Double">Double Occupancy</option>
                    <option value="Triple">Triple Occupancy</option>
                    <option value="Shared">Shared</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={formData.roomConfig?.area}
                    onChange={(e) => handleInputChange('roomConfig.area', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter room area in square feet"
                    placeholder="Enter area (sq ft)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.roomConfig?.floor}
                    onChange={(e) => handleInputChange('roomConfig.floor', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter floor number"
                    placeholder="Floor number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facing Direction
                  </label>
                  <select
                    value={formData.roomConfig?.facing}
                    onChange={(e) => handleInputChange('roomConfig.facing', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    aria-label="Facing direction"
                    title="Select facing direction"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Room Features</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.roomConfig?.furnished}
                        onChange={(e) => handleInputChange('roomConfig.furnished', e.target.checked)}
                        className="mr-2"
                      />
                      Furnished
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.roomConfig?.attachedBathroom}
                        onChange={(e) => handleInputChange('roomConfig.attachedBathroom', e.target.checked)}
                        className="mr-2"
                      />
                      Attached Bathroom
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.roomConfig?.balcony}
                        onChange={(e) => handleInputChange('roomConfig.balcony', e.target.checked)}
                        className="mr-2"
                      />
                      Balcony
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flat Type *
                  </label>
                  <select
                    required
                    value={formData.flatConfig?.flatType}
                    onChange={(e) => handleInputChange('flatConfig.flatType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    aria-label="Flat type"
                    title="Select flat type"
                  >
                    <option value="1RK">1RK</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="5BHK+">5BHK+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.flatConfig?.bedrooms}
                    onChange={(e) => handleInputChange('flatConfig.bedrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter number of bedrooms"
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.flatConfig?.bathrooms}
                    onChange={(e) => handleInputChange('flatConfig.bathrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter number of bathrooms"
                    placeholder="Number of bathrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carpet Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.flatConfig?.areas.carpetArea}
                    onChange={(e) => handleInputChange('flatConfig.areas.carpetArea', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter carpet area in square feet"
                    placeholder="Carpet area (sq ft)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.flatConfig?.floor}
                    onChange={(e) => handleInputChange('flatConfig.floor', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter floor number"
                    placeholder="Floor number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Floors *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.flatConfig?.totalFloors}
                    onChange={(e) => handleInputChange('flatConfig.totalFloors', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    title="Enter total number of floors in building"
                    placeholder="Total floors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing Status *
                  </label>
                  <select
                    required
                    value={formData.flatConfig?.furnishingStatus}
                    onChange={(e) => handleInputChange('flatConfig.furnishingStatus', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    aria-label="Furnishing status"
                    title="Select furnishing status"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully-Furnished">Fully-Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age of Property *
                  </label>
                  <select
                    required
                    value={formData.flatConfig?.ageOfProperty}
                    onChange={(e) => handleInputChange('flatConfig.ageOfProperty', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    aria-label="Age of property"
                    title="Select age of property"
                  >
                    <option value="Under Construction">Under Construction</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-5 years">1-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10-15 years">10-15 years</option>
                    <option value="15+ years">15+ years</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  value={formData.pricing.rent}
                  onChange={(e) => handleInputChange('pricing.rent', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  title="Enter monthly rent amount in rupees"
                  placeholder="Monthly rent (₹)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pricing.securityDeposit}
                  onChange={(e) => handleInputChange('pricing.securityDeposit', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  title="Enter security deposit amount in rupees"
                  placeholder="Security deposit (₹)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Charges (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pricing.maintenanceCharges}
                  onChange={(e) => handleInputChange('pricing.maintenanceCharges', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  title="Enter maintenance charges in rupees"
                  placeholder="Maintenance charges (₹)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity Charges
                </label>
                <select
                  value={formData.pricing.electricityCharges}
                  onChange={(e) => handleInputChange('pricing.electricityCharges', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  aria-label="Electricity charges"
                  title="Select electricity charges type"
                >
                  <option value="Included">Included in Rent</option>
                  <option value="Extra">Extra</option>
                  <option value="Per Unit">Per Unit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Units Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Units & Availability</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalUnits}
                  onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  title="Enter total number of units"
                  placeholder="Enter total units"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Units *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={formData.totalUnits}
                  value={formData.availableUnits}
                  onChange={(e) => handleInputChange('availableUnits', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  title="Enter number of available units"
                  placeholder="Enter available units"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Basic Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(formData.amenities.basic).map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.basic[amenity]}
                        onChange={(e) => handleInputChange(`amenities.basic.${amenity}`, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Room Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(formData.amenities.room).map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.room[amenity]}
                        onChange={(e) => handleInputChange(`amenities.room.${amenity}`, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Images</h2>
            
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  title="Add property image"
                  aria-label="Add property image"
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.media.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {image.isPrimary && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      title="Remove property image"
                      aria-label="Remove property image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Area Specific Images</h2>
            <p className="text-gray-600 mb-6">Add images for specific areas of your property to help tenants understand the layout better.</p>
            
            <div className="space-y-6">
              {/* Kitchen Images */}
              <AreaImageSection 
                title="Kitchen" 
                icon={<FaUtensils className="text-orange-500" />}
                images={formData.media.areaImages.kitchen}
                onAddImage={(url: string) => addAreaImage('kitchen', url)}
                onRemoveImage={(index: number) => removeAreaImage('kitchen', index)}
              />
              
              {/* Bedroom Images */}
              <AreaImageSection 
                title="Bedroom" 
                icon={<FaBed className="text-blue-500" />}
                images={formData.media.areaImages.bedroom}
                onAddImage={(url: string) => addAreaImage('bedroom', url)}
                onRemoveImage={(index: number) => removeAreaImage('bedroom', index)}
              />
              
              {/* Bathroom Images */}
              <AreaImageSection 
                title="Bathroom" 
                icon={<FaBath className="text-blue-400" />}
                images={formData.media.areaImages.bathroom}
                onAddImage={(url: string) => addAreaImage('bathroom', url)}
                onRemoveImage={(index: number) => removeAreaImage('bathroom', index)}
              />
              
              {/* Living Room Images */}
              <AreaImageSection 
                title="Living Room" 
                icon={<FaHome className="text-purple-500" />}
                images={formData.media.areaImages.livingRoom}
                onAddImage={(url: string) => addAreaImage('livingRoom', url)}
                onRemoveImage={(index: number) => removeAreaImage('livingRoom', index)}
              />
              
              {/* Balcony Images */}
              <AreaImageSection 
                title="Balcony" 
                icon={<FaHome className="text-green-500" />}
                images={formData.media.areaImages.balcony}
                onAddImage={(url: string) => addAreaImage('balcony', url)}
                onRemoveImage={(index: number) => removeAreaImage('balcony', index)}
              />
              
              {/* Parking Images */}
              <AreaImageSection 
                title="Parking" 
                icon={<FaCar className="text-gray-600" />}
                images={formData.media.areaImages.parking}
                onAddImage={(url: string) => addAreaImage('parking', url)}
                onRemoveImage={(index: number) => removeAreaImage('parking', index)}
              />
              
              {/* Entrance Images */}
              <AreaImageSection 
                title="Entrance" 
                icon={<FaHome className="text-brown-500" />}
                images={formData.media.areaImages.entrance}
                onAddImage={(url: string) => addAreaImage('entrance', url)}
                onRemoveImage={(index: number) => removeAreaImage('entrance', index)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  value={formData.contact.primaryPhone}
                  onChange={(e) => handleInputChange('contact.primaryPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  value={formData.contact.whatsappNumber}
                  onChange={(e) => handleInputChange('contact.whatsappNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email address"
                />
              </div>
            </div>
          </div>

          {/* Tenant Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tenant Preferences</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference
                </label>
                <select
                  value={formData.tenantPreferences.genderPreference}
                  onChange={(e) => handleInputChange('tenantPreferences.genderPreference', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  aria-label="Gender preference for tenants"
                  title="Select gender preference for tenants"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation Type
                </label>
                <select
                  value={formData.tenantPreferences.occupationType}
                  onChange={(e) => handleInputChange('tenantPreferences.occupationType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  aria-label="Occupation type preference for tenants"
                  title="Select occupation type preference for tenants"
                >
                  <option value="Any">Any</option>
                  <option value="Students">Students</option>
                  <option value="Working Professionals">Working Professionals</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-4">Restrictions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tenantPreferences.smokingAllowed}
                      onChange={(e) => handleInputChange('tenantPreferences.smokingAllowed', e.target.checked)}
                      className="mr-2"
                    />
                    Smoking Allowed
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tenantPreferences.drinkingAllowed}
                      onChange={(e) => handleInputChange('tenantPreferences.drinkingAllowed', e.target.checked)}
                      className="mr-2"
                    />
                    Drinking Allowed
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tenantPreferences.petsAllowed}
                      onChange={(e) => handleInputChange('tenantPreferences.petsAllowed', e.target.checked)}
                      className="mr-2"
                    />
                    Pets Allowed
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Property...
                </>
              ) : (
                <>
                  <FaSave />
                  Add Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
