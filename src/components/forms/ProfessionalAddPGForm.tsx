"use client";
import React, { useState, useRef } from 'react';
import { 
  FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaRupeeSign, 
  FaBed, FaWifi, FaCar, FaUtensils, FaShieldAlt, FaCamera,
  FaPlus, FaMinus, FaStar, FaUsers, FaHome,
  FaDumbbell, FaSwimmingPool, FaTshirt, FaSnowflake,
  FaBolt, FaVideo, FaLeaf, FaBook, FaGamepad, FaMusic,
  FaCoffee, FaMedkit, FaBusinessTime, FaParking, FaCheck,
  FaArrowLeft, FaArrowRight, FaSave,
  FaTrash, FaUpload, FaCheckCircle,
  FaInfoCircle, FaExclamationTriangle, FaTimes
} from 'react-icons/fa';

interface RoomType {
  type: string;
  name: string;
  description: string;
  price: number;
  securityDeposit: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  isActive: boolean;
}

interface NearbyPlace {
  type: string;
  name: string;
  distance: string;
}

interface AddPGFormProps {
  onSubmit: (pgData: any) => void;
  onClose: () => void;
  loading?: boolean;
}

const ProfessionalAddPGForm: React.FC<AddPGFormProps> = ({ onSubmit, onClose, loading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  
  // Basic Information
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    area: '',
    latitude: '',
    longitude: '',
    ownerRef: '',
    isFeatured: false,
    isVerified: false,
    status: 'active',
    gender: 'Unisex'
  });

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    alternatePhone: ''
  });

  // Room Types
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      type: 'single',
      name: 'Single Room',
      description: 'Private single occupancy room',
      price: 0,
      securityDeposit: 0,
      totalRooms: 0,
      availableRooms: 0,
      amenities: [],
      isActive: true
    }
  ]);

  // Images
  const [images, setImages] = useState<File[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<string[]>(['']);

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  // Facilities (Boolean flags)
  const [facilities, setFacilities] = useState({
    wifi: false,
    ac: false,
    laundry: false,
    parking: false,
    meals: false,
    powerBackup: false,
    security: false,
    cctv: false,
    gym: false,
    commonArea: false
  });

  // Enhanced Industry-Standard Property Information
  const [propertyDetails, setPropertyDetails] = useState({
    // Building Information
    buildingType: 'independent', // independent, apartment, villa
    totalFloors: 1,
    propertyAge: '', // new, 1-5, 5-10, 10+ years
    carpetArea: '',
    builtUpArea: '',
    
    // Legal & Documentation
    propertyPapers: false,
    electricityBill: false,
    waterConnection: false,
    approvals: [], // building_approval, fire_safety, pollution_clearance
    
    // Occupancy Details
    currentOccupancy: 0,
    maxOccupancy: 0,
    genderPreference: 'any', // male, female, any
    tenantType: 'students', // students, professionals, family, any
    
    // Rental Terms
    depositTerms: '2-months', // 2-months, 3-months, negotiable
    noticePeriod: '30-days', // 15-days, 30-days, 60-days
    lockInPeriod: '11-months', // 6-months, 11-months, none
    incrementPolicy: '10%', // 5%, 10%, 15%, negotiable
    
    // Furnishing Status
    furnishingLevel: 'semi-furnished', // furnished, semi-furnished, unfurnished
    furnishingDetails: {
      bed: false,
      mattress: false,
      wardrobe: false,
      study_table: false,
      chair: false,
      fan: false,
      light: false,
      curtains: false,
      ac: false
    }
  });

  // Enhanced Facility Categories (Industry Standard)
  const [facilitiesCategories, setFacilitiesCategories] = useState({
    // Basic Utilities
    basic: {
      electricity: true,
      water: true,
      internet: false,
      powerBackup: false,
      elevator: false,
      parking: false
    },
    
    // Food & Kitchen
    food: {
      mealsIncluded: false,
      kitchenAccess: false,
      commonKitchen: false,
      refrigerator: false,
      cookingGas: false,
      waterPurifier: false,
      diningArea: false
    },
    
    // Security & Safety
    security: {
      guard24x7: false,
      cctv: false,
      secureEntry: false,
      fireExtinguisher: false,
      emergencyExit: false,
      womenSafety: false,
      visitorManagement: false
    },
    
    // Cleaning & Maintenance
    housekeeping: {
      roomCleaning: false,
      commonAreaCleaning: false,
      laundryService: false,
      washingMachine: false,
      maintenanceSupport: false,
      pestControl: false
    },
    
    // Recreation & Social
    recreation: {
      commonArea: false,
      tvRoom: false,
      gymnasium: false,
      swimmingPool: false,
      garden: false,
      terrace: false,
      gamingZone: false,
      library: false
    },
    
    // Business & Work
    business: {
      studyRoom: false,
      coWorkingSpace: false,
      conferenceRoom: false,
      printerScanner: false,
      businessCenter: false
    },
    
    // Health & Wellness
    health: {
      medicalRoom: false,
      firstAid: false,
      doctorOnCall: false,
      pharmacy: false,
      yogaStudio: false,
      spa: false
    },
    
    // Convenience Services
    convenience: {
      miniMart: false,
      atm: false,
      salon: false,
      dryClean: false,
      courierService: false,
      travelDesk: false,
      concierge: false
    }
  });

  // Detailed Facility Information
  const [detailedFacilities, setDetailedFacilities] = useState({
    wifiDetails: { 
      speed: '', // 50mbps, 100mbps, 1gbps
      coverage: '', // room, common_areas, full_property
      provider: '', // airtel, jio, bsnl
      cost: 'included' // included, extra, shared
    },
    foodDetails: {
      type: 'both', // veg, non-veg, both
      meals: [], // breakfast, lunch, dinner, snacks
      cuisine: [], // north_indian, south_indian, chinese, continental
      charges: '', // included, 2000/month, 150/meal
      timing: {
        breakfast: '7:00-9:00 AM',
        lunch: '12:00-2:00 PM', 
        dinner: '7:00-9:00 PM'
      }
    },
    parkingDetails: { 
      twoWheeler: { 
        available: false, 
        charges: 0,
        covered: false,
        security: false
      },
      fourWheeler: { 
        available: false, 
        charges: 0,
        covered: false,
        security: false,
        valet: false
      }
    },
    laundryDetails: { 
      charges: '', // included, 5/piece, 200/month
      pickup: '', // daily, weekly, on-demand
      turnaroundTime: '', // same-day, next-day, 2-days
      dryClean: false
    },
    securityDetails: { 
      guard: '', // 24x7, day-time, night-time
      cctv: '', // common-areas, full-property, room-corridors
      access: '', // key, card, biometric, mobile-app
      emergencyContact: '',
      policeVerification: false
    }
  });

  // Access Control
  const [accessControl, setAccessControl] = useState({
    gateCloseTime: '11:00 PM',
    guestPolicy: 'Guests allowed with prior permission',
    smokingAllowed: false,
    alcoholAllowed: false
  });

  // Rules
  const [rules, setRules] = useState<string[]>(['']);

  // Nearby Places
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([
    { type: 'metro', name: '', distance: '' }
  ]);

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(['']);

  // Pricing & Discounts
  const [pricing, setPricing] = useState({
    originalPrice: 0,
    discountPercentage: 0
  });

  // Form Steps
  const steps = [
    { 
      id: 1, 
      title: 'Basic Information', 
      icon: FaHome, 
      color: 'blue', 
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      description: 'Property name, address, and location details' 
    },
    { 
      id: 2, 
      title: 'Contact & Location', 
      icon: FaMapMarkerAlt, 
      color: 'green', 
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      description: 'Contact information and coordinates' 
    },
    { 
      id: 3, 
      title: 'Room Management', 
      icon: FaBed, 
      color: 'purple', 
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      description: 'Room types, pricing, and availability' 
    },
    { 
      id: 4, 
      title: 'Media & Gallery', 
      icon: FaCamera, 
      color: 'orange', 
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      description: 'Photos and visual content' 
    },
    { 
      id: 5, 
      title: 'Amenities & Facilities', 
      icon: FaStar, 
      color: 'indigo', 
      bgColor: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      description: 'Available amenities and services' 
    },
    { 
      id: 6, 
      title: 'Rules & Policies', 
      icon: FaShieldAlt, 
      color: 'red', 
      bgColor: 'bg-red-500',
      lightBg: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      description: 'House rules and access policies' 
    },
    { 
      id: 7, 
      title: 'Final Review', 
      icon: FaCheckCircle, 
      color: 'emerald', 
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      description: 'Review and submit your property' 
    }
  ];

  // Available Amenities List with categories - Industry Standard Comprehensive
  const availableAmenities = [
    // 🏠 Basic Living Amenities
    { name: 'Furnished Rooms', icon: FaBed, category: 'basic', color: 'blue' },
    { name: 'Semi Furnished', icon: FaBed, category: 'basic', color: 'cyan' },
    { name: 'Unfurnished', icon: FaBed, category: 'basic', color: 'gray' },
    { name: 'Balcony/Window', icon: FaHome, category: 'basic', color: 'green' },
    
    // 🌐 Connectivity & Technology
    { name: 'High Speed WiFi', icon: FaWifi, category: 'connectivity', color: 'blue' },
    { name: 'Fiber Internet', icon: FaWifi, category: 'connectivity', color: 'indigo' },
    { name: 'Smart TV', icon: FaVideo, category: 'connectivity', color: 'purple' },
    { name: 'Smart Locks', icon: FaShieldAlt, category: 'connectivity', color: 'blue' },
    
    // ❄️ Climate Control
    { name: 'AC', icon: FaSnowflake, category: 'comfort', color: 'cyan' },
    { name: 'Fan', icon: FaBolt, category: 'comfort', color: 'blue' },
    { name: 'Heater', icon: FaBolt, category: 'comfort', color: 'orange' },
    { name: 'Geyser/Hot Water', icon: FaBolt, category: 'comfort', color: 'red' },
    
    // 🚗 Transport & Parking
    { name: 'Two Wheeler Parking', icon: FaParking, category: 'transport', color: 'gray' },
    { name: 'Four Wheeler Parking', icon: FaCar, category: 'transport', color: 'blue' },
    { name: 'Valet Parking', icon: FaCar, category: 'transport', color: 'purple' },
    { name: 'Metro Connectivity', icon: FaCar, category: 'transport', color: 'green' },
    
    // 🍽️ Food & Kitchen
    { name: 'Meals Included', icon: FaUtensils, category: 'meals', color: 'orange' },
    { name: 'Kitchen Access', icon: FaUtensils, category: 'meals', color: 'red' },
    { name: 'Common Kitchen', icon: FaUtensils, category: 'meals', color: 'yellow' },
    { name: 'Refrigerator', icon: FaSnowflake, category: 'meals', color: 'blue' },
    { name: 'Microwave', icon: FaBolt, category: 'meals', color: 'purple' },
    { name: 'Water Purifier', icon: FaWifi, category: 'meals', color: 'cyan' },
    
    // 🧺 Laundry & Cleaning
    { name: 'Laundry Service', icon: FaTshirt, category: 'services', color: 'purple' },
    { name: 'Washing Machine', icon: FaTshirt, category: 'services', color: 'blue' },
    { name: 'Housekeeping', icon: FaHome, category: 'services', color: 'gray' },
    { name: 'Room Cleaning', icon: FaHome, category: 'services', color: 'green' },
    
    // 🛡️ Security & Safety
    { name: '24/7 Security', icon: FaShieldAlt, category: 'safety', color: 'green' },
    { name: 'CCTV Surveillance', icon: FaVideo, category: 'safety', color: 'red' },
    { name: 'Fire Safety', icon: FaShieldAlt, category: 'safety', color: 'orange' },
    { name: 'Emergency Response', icon: FaShieldAlt, category: 'safety', color: 'red' },
    { name: 'Biometric Access', icon: FaShieldAlt, category: 'safety', color: 'indigo' },
    { name: 'Security Guard', icon: FaUsers, category: 'safety', color: 'blue' },
    
    // ⚡ Utilities & Power
    { name: 'Power Backup', icon: FaBolt, category: 'utilities', color: 'yellow' },
    { name: 'Generator', icon: FaBolt, category: 'utilities', color: 'orange' },
    { name: 'Inverter', icon: FaBolt, category: 'utilities', color: 'green' },
    { name: 'Solar Power', icon: FaBolt, category: 'utilities', color: 'yellow' },
    
    // 💪 Fitness & Recreation
    { name: 'Gym/Fitness Center', icon: FaDumbbell, category: 'fitness', color: 'red' },
    { name: 'Swimming Pool', icon: FaSwimmingPool, category: 'fitness', color: 'blue' },
    { name: 'Yoga Studio', icon: FaDumbbell, category: 'fitness', color: 'purple' },
    { name: 'Sports Court', icon: FaGamepad, category: 'fitness', color: 'green' },
    
    // 🎮 Entertainment & Social
    { name: 'Gaming Zone', icon: FaGamepad, category: 'entertainment', color: 'purple' },
    { name: 'Common Area/Lounge', icon: FaUsers, category: 'social', color: 'indigo' },
    { name: 'TV Room', icon: FaVideo, category: 'entertainment', color: 'blue' },
    { name: 'Music Room', icon: FaMusic, category: 'entertainment', color: 'pink' },
    { name: 'Party Hall', icon: FaUsers, category: 'entertainment', color: 'purple' },
    
    // 📚 Study & Work
    { name: 'Study Room', icon: FaBook, category: 'academic', color: 'green' },
    { name: 'Library', icon: FaBook, category: 'academic', color: 'blue' },
    { name: 'Co-working Space', icon: FaBusinessTime, category: 'academic', color: 'indigo' },
    { name: 'Conference Room', icon: FaBusinessTime, category: 'academic', color: 'gray' },
    { name: 'Business Center', icon: FaBusinessTime, category: 'academic', color: 'blue' },
    
    // 🌿 Outdoor & Nature
    { name: 'Garden/Lawn', icon: FaLeaf, category: 'outdoor', color: 'green' },
    { name: 'Terrace/Rooftop', icon: FaLeaf, category: 'outdoor', color: 'teal' },
    { name: 'Balcony Garden', icon: FaLeaf, category: 'outdoor', color: 'emerald' },
    { name: 'BBQ Area', icon: FaUtensils, category: 'outdoor', color: 'orange' },
    
    // 🏥 Health & Medical
    { name: 'Medical Room', icon: FaMedkit, category: 'health', color: 'red' },
    { name: 'First Aid', icon: FaMedkit, category: 'health', color: 'pink' },
    { name: 'Pharmacy Nearby', icon: FaMedkit, category: 'health', color: 'green' },
    { name: 'Doctor on Call', icon: FaMedkit, category: 'health', color: 'blue' },
    
    // ☕ Food & Beverage
    { name: 'Cafe/Canteen', icon: FaCoffee, category: 'dining', color: 'brown' },
    { name: 'Mess/Dining Hall', icon: FaUtensils, category: 'dining', color: 'orange' },
    { name: 'Tiffin Service', icon: FaUtensils, category: 'dining', color: 'yellow' },
    { name: 'Food Court', icon: FaUtensils, category: 'dining', color: 'red' },
    
    // 💇 Personal Care
    { name: 'Salon/Spa', icon: FaTshirt, category: 'services', color: 'pink' },
    { name: 'Beauty Parlor', icon: FaTshirt, category: 'services', color: 'purple' },
    { name: 'Barber Shop', icon: FaTshirt, category: 'services', color: 'blue' },
    
    // 🏪 Shopping & Convenience
    { name: 'Mini Mart', icon: FaBusinessTime, category: 'convenience', color: 'green' },
    { name: 'ATM/Banking', icon: FaBusinessTime, category: 'convenience', color: 'blue' },
    { name: 'Courier Services', icon: FaBusinessTime, category: 'convenience', color: 'purple' },
    { name: 'Concierge Service', icon: FaUsers, category: 'convenience', color: 'indigo' }
  ];

  // Place Types for Nearby
  const placeTypes = [
    { value: 'metro', label: '🚇 Metro Station', color: 'blue' },
    { value: 'bus_stop', label: '🚌 Bus Stop', color: 'green' },
    { value: 'hospital', label: '🏥 Hospital', color: 'red' },
    { value: 'mall', label: '🏬 Shopping Mall', color: 'purple' },
    { value: 'market', label: '🛒 Market', color: 'orange' },
    { value: 'school', label: '🏫 School', color: 'yellow' },
    { value: 'college', label: '🎓 College', color: 'indigo' },
    { value: 'office', label: '🏢 Office Complex', color: 'gray' },
    { value: 'bank', label: '🏦 Bank', color: 'blue' },
    { value: 'restaurant', label: '🍽️ Restaurant', color: 'red' },
    { value: 'pharmacy', label: '💊 Pharmacy', color: 'green' },
    { value: 'gym', label: '💪 Gym', color: 'orange' }
  ];

  // Room Types Options
  const roomTypeOptions = [
    { value: 'single', label: '🛏️ Single Room', description: 'Private single occupancy', color: 'blue' },
    { value: 'double', label: '👥 Double Sharing', description: 'Two person sharing', color: 'green' },
    { value: 'triple', label: '👨‍👩‍👧 Triple Sharing', description: 'Three person sharing', color: 'purple' },
    { value: 'dormitory', label: '🏠 Dormitory', description: 'Multiple bed dormitory', color: 'orange' }
  ];

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};
    
    switch(step) {
      case 1:
        if (!basicInfo.name.trim()) errors.name = 'PG name is required';
        if (!basicInfo.address.trim()) errors.address = 'Address is required';
        if (!basicInfo.city.trim()) errors.city = 'City is required';
        if (!basicInfo.state.trim()) errors.state = 'State is required';
        if (!basicInfo.pincode.trim()) errors.pincode = 'Pincode is required';
        if (basicInfo.pincode && !/^\d{6}$/.test(basicInfo.pincode)) {
          errors.pincode = 'Pincode must be 6 digits';
        }
        break;
      case 2:
        if (!contactInfo.phone.trim()) errors.phone = 'Phone number is required';
        if (!contactInfo.email.trim()) errors.email = 'Email is required';
        if (contactInfo.email && !/\S+@\S+\.\S+/.test(contactInfo.email)) {
          errors.email = 'Please enter a valid email';
        }
        break;
      case 3:
        roomTypes.forEach((room, index) => {
          if (!room.name.trim()) errors[`room_${index}_name`] = 'Room name is required';
          if (room.price <= 0) errors[`room_${index}_price`] = 'Price must be greater than 0';
          if (room.totalRooms <= 0) errors[`room_${index}_total`] = 'Total rooms must be greater than 0';
          if (room.availableRooms > room.totalRooms) {
            errors[`room_${index}_available`] = 'Available rooms cannot exceed total rooms';
          }
        });
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  // Add Room Type
  const addRoomType = () => {
    setRoomTypes([...roomTypes, {
      type: 'single',
      name: '',
      description: '',
      price: 0,
      securityDeposit: 0,
      totalRooms: 0,
      availableRooms: 0,
      amenities: [],
      isActive: true
    }]);
  };

  // Remove Room Type
  const removeRoomType = (index: number) => {
    if (roomTypes.length > 1) {
      setRoomTypes(roomTypes.filter((_, i) => i !== index));
    }
  };

  // Update Room Type
  const updateRoomType = (index: number, field: string, value: any) => {
    const updated = [...roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate security deposit if not set
    if (field === 'price' && updated[index].securityDeposit === 0) {
      updated[index].securityDeposit = value * 2;
    }
    
    setRoomTypes(updated);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages([...images, ...newImages]);
      setImageDescriptions([...imageDescriptions, ...newImages.map(() => '')]);
    }
  };

  // Remove Image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageDescriptions(imageDescriptions.filter((_, i) => i !== index));
  };

  // Toggle Amenity
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  // Add Custom Amenity
  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  // Add/Remove Dynamic Lists
  const addToList = (list: any[], setter: any, defaultItem: any) => {
    setter([...list, defaultItem]);
  };

  const removeFromList = (list: any[], setter: any, index: number) => {
    if (list.length > 1) {
      setter(list.filter((_: any, i: number) => i !== index));
    }
  };

  const updateListItem = (list: any[], setter: any, index: number, field: string, value: any) => {
    const updated = [...list];
    if (typeof updated[index] === 'string') {
      updated[index] = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);
  };

  // Calculate derived values
  const calculateDerivedValues = () => {
    const totalBeds = roomTypes.reduce((sum, room) => sum + room.totalRooms, 0);
    const availableRooms = roomTypes.reduce((sum, room) => sum + room.availableRooms, 0);
    const minPrice = Math.min(...roomTypes.map(room => room.price).filter(p => p > 0));
    const maxPrice = Math.max(...roomTypes.map(room => room.price).filter(p => p > 0));
    
    return {
      totalBeds,
      availableRooms,
      price: minPrice || 0,
      priceRange: { min: minPrice || 0, max: maxPrice || minPrice || 0 },
      originalPrice: pricing.originalPrice || Math.round(minPrice * (1 + pricing.discountPercentage / 100))
    };
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    const derivedValues = calculateDerivedValues();
    
    const pgData = {
      // Basic Information
      ...basicInfo,
      location: {
        type: "Point",
        coordinates: [parseFloat(basicInfo.longitude), parseFloat(basicInfo.latitude)],
        formattedAddress: `${basicInfo.address}, ${basicInfo.city}, ${basicInfo.state} ${basicInfo.pincode}`,
        landmark: basicInfo.landmark,
        area: basicInfo.area
      },
      
      // Contact
      contact: contactInfo,
      
      // Room Types
      roomTypes: roomTypes.map(room => ({
        ...room,
        securityDeposit: room.securityDeposit || room.price * 2
      })),
      
      // Images (will be handled separately for file upload)
      images: images.map((file, index) => ({
        file,
        description: imageDescriptions[index] || basicInfo.name,
        isPrimary: index === 0
      })),
      
      // Amenities & Facilities
      amenities,
      facilities,
      
      // Detailed Facility Information
      ...detailedFacilities,
      
      // Access Control
      accessControl,
      gateCloseTime: accessControl.gateCloseTime,
      guestPolicy: accessControl.guestPolicy,
      
      // Rules & Guidelines
      rules: rules.filter(rule => rule.trim()),
      
      // Location Details
      nearbyPlaces: nearbyPlaces.filter(place => place.name.trim()),
      nearby: nearbyPlaces.filter(place => place.name.trim()).map(place => ({
        name: place.name,
        distance: place.distance,
        type: place.type
      })),
      
      // Highlights
      highlights: highlights.filter(highlight => highlight.trim()),
      
      // Derived Values
      ...derivedValues,
      
      // Additional Fields
      verification: {
        status: basicInfo.isVerified ? 'verified' : 'pending',
        documents: [],
        verifiedAt: basicInfo.isVerified ? new Date() : null
      },
      
      // Facility Flags
      wifiAvailable: facilities.wifi,
      parkingAvailable: facilities.parking,
      foodIncluded: facilities.meals,
      acAvailable: facilities.ac,
      laundryAvailable: facilities.laundry,
      powerBackup: facilities.powerBackup,
      securityGuard: facilities.security,
      cctv: facilities.cctv,
      
      // SEO & Analytics
      seo: {
        metaTitle: `${basicInfo.name} - ${basicInfo.city}`,
        metaDescription: `${basicInfo.name} in ${basicInfo.area}, ${basicInfo.city}. Starting from ₹${derivedValues.price}/month`,
        keywords: [
          `${basicInfo.name.toLowerCase()}`,
          `pg in ${basicInfo.city.toLowerCase()}`,
          `${basicInfo.area.toLowerCase()} accommodation`
        ],
        slug: basicInfo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      },
      
      analytics: {
        views: 0,
        inquiries: 0,
        bookings: 0
      },
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSubmit(pgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <FaBuilding className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Add New PG Property</h1>
                  <p className="text-blue-100 mt-1 text-lg">Create a comprehensive listing for your property</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10 text-3xl font-bold transition-all duration-200 rounded-full p-3 backdrop-blur-sm"
                title="Close form"
                aria-label="Close add PG form"
              >
                ×
              </button>
            </div>
          </div>

          {/* Progress Steps - Mobile Responsive */}
          <div className="bg-gray-50 px-3 py-4">
            {/* Mobile View - Horizontal Scroll */}
            <div className="block md:hidden">
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex items-center">
                        <button
                          onClick={() => goToStep(step.id)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 min-w-[80px] ${
                            isActive 
                              ? `bg-gradient-to-b from-blue-500 to-indigo-500 text-white shadow-lg` 
                              : isCompleted
                              ? `bg-gradient-to-b from-emerald-500 to-green-500 text-white shadow-md`
                              : `bg-white text-gray-600 shadow-sm border border-gray-200`
                          }`}
                          disabled={step.id > currentStep + 1}
                        >
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                            isCompleted ? 'bg-white/20' : 
                            isActive ? `bg-white/20` : 'bg-blue-100'
                          }`}>
                            {isCompleted ? (
                              <FaCheck className="text-xs text-white" />
                            ) : (
                              <StepIcon className={`text-xs ${isActive ? 'text-white' : 'text-blue-600'}`} />
                            )}
                          </div>
                          <span className={`text-xs font-semibold ${
                            isActive || isCompleted ? 'text-white' : 'text-gray-700'
                          }`}>
                            {step.id}
                          </span>
                        </button>
                        {index < steps.length - 1 && (
                          <div className={`h-1 w-4 mx-1 rounded-full ${
                            isCompleted ? 'bg-emerald-400' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Desktop View - Full Width */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  const StepIcon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <button
                        onClick={() => goToStep(step.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full max-w-xs ${
                          isActive 
                            ? `bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg` 
                            : isCompleted
                            ? `bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md`
                            : `bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200`
                        }`}
                        disabled={step.id > currentStep + 1}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                          isCompleted ? 'bg-white/20 text-white' : 
                          isActive ? `bg-white/20 text-white` : 'bg-blue-100 text-blue-600'
                        }`}>
                          {isCompleted ? <FaCheck className="text-sm" /> : <StepIcon className="text-sm" />}
                        </div>
                        <div className="text-left min-w-0">
                          <div className={`font-semibold text-sm truncate ${
                            isActive || isCompleted ? 'text-white' : 'text-gray-800'
                          }`}>
                            {step.title}
                          </div>
                        </div>
                      </button>
                      {index < steps.length - 1 && (
                        <div className={`h-1 flex-1 mx-3 rounded-full max-w-12 ${
                          isCompleted ? 'bg-gradient-to-r from-emerald-400 to-green-400' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-lg">
                    <FaHome className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Basic Information</h2>
                    <p className="text-gray-700 text-lg mt-1">Essential details about your PG property</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      PG Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm ${
                        validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      value={basicInfo.name}
                      onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                      placeholder="e.g., Green Valley Boys PG"
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <FaExclamationTriangle className="text-xs" /> {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      Gender Preference <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium text-lg shadow-sm border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white"
                      value={basicInfo.gender}
                      onChange={(e) => setBasicInfo({...basicInfo, gender: e.target.value})}
                      title="Select gender preference for the PG"
                    >
                      <option value="Male">👨 Boys Only</option>
                      <option value="Female">👩 Girls Only</option>
                      <option value="Unisex">👫 Co-living (Boys & Girls)</option>
                    </select>
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm ${
                        validationErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      value={basicInfo.address}
                      onChange={(e) => setBasicInfo({...basicInfo, address: e.target.value})}
                      placeholder="e.g., 123, ABC Society, Near XYZ Mall, Main Road"
                    />
                    {validationErrors.address && (
                      <p className="text-red-600 text-lg font-semibold mt-2 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> {validationErrors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm ${
                        validationErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      value={basicInfo.city}
                      onChange={(e) => setBasicInfo({...basicInfo, city: e.target.value})}
                      placeholder="Mumbai"
                    />
                    {validationErrors.city && (
                      <p className="text-red-600 text-lg font-semibold mt-2 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> {validationErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm ${
                        validationErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      value={basicInfo.state}
                      onChange={(e) => setBasicInfo({...basicInfo, state: e.target.value})}
                      placeholder="Maharashtra"
                    />
                    {validationErrors.state && (
                      <p className="text-red-600 text-lg font-semibold mt-2 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> {validationErrors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm ${
                        validationErrors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      value={basicInfo.pincode}
                      onChange={(e) => setBasicInfo({...basicInfo, pincode: e.target.value})}
                      placeholder="400001"
                    />
                    {validationErrors.pincode && (
                      <p className="text-red-600 text-lg font-semibold mt-2 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> {validationErrors.pincode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Landmark</label>
                    <input
                      type="text"
                      className="w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white"
                      value={basicInfo.landmark}
                      onChange={(e) => setBasicInfo({...basicInfo, landmark: e.target.value})}
                      placeholder="Near Metro Station"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Area/Locality</label>
                    <input
                      type="text"
                      className="w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white"
                      value={basicInfo.area}
                      onChange={(e) => setBasicInfo({...basicInfo, area: e.target.value})}
                      placeholder="Andheri West"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Owner Reference</label>
                    <input
                      type="text"
                      className="w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white"
                      value={basicInfo.ownerRef}
                      onChange={(e) => setBasicInfo({...basicInfo, ownerRef: e.target.value})}
                      placeholder="owner_mumbai_01"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-lg font-bold text-gray-800 mb-3">📍 Location Coordinates (Optional)</label>
                    <div className="grid grid-cols-2 gap-6">
                      <input
                        type="number"
                        step="any"
                        className="w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white"
                        value={basicInfo.latitude}
                        onChange={(e) => setBasicInfo({...basicInfo, latitude: e.target.value})}
                        placeholder="Latitude (19.1196)"
                      />
                      <input
                        type="number"
                        step="any"
                        className="w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm border-gray-300 hover:border-blue-300 bg-gray-50 hover:bg-white"
                        value={basicInfo.longitude}
                        onChange={(e) => setBasicInfo({...basicInfo, longitude: e.target.value})}
                        placeholder="Longitude (72.8821)"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block text-lg font-bold text-gray-800 mb-4">⚡ Property Status</label>
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center gap-4 p-6 border-2 rounded-2xl hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105 border-gray-200">
                        <input
                          type="checkbox"
                          checked={basicInfo.isFeatured}
                          onChange={(e) => setBasicInfo({...basicInfo, isFeatured: e.target.checked})}
                          className="w-6 h-6 text-yellow-600 rounded-lg focus:ring-yellow-500 focus:ring-2"
                        />
                        <FaStar className="text-yellow-500 text-2xl" />
                        <div>
                          <div className="font-bold text-gray-800 text-lg">Featured Property</div>
                          <div className="text-gray-600 text-sm">Highlight this property in listings</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-4 p-6 border-2 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105 border-gray-200">
                        <input
                          type="checkbox"
                          checked={basicInfo.isVerified}
                          onChange={(e) => setBasicInfo({...basicInfo, isVerified: e.target.checked})}
                          className="w-6 h-6 text-green-600 rounded-lg focus:ring-green-500 focus:ring-2"
                        />
                        <FaShieldAlt className="text-green-500 text-2xl" />
                        <div>
                          <div className="font-bold text-gray-800 text-lg">Verified Property</div>
                          <div className="text-gray-600 text-sm">Mark as verified and trusted</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                  <FaInfoCircle className="text-blue-500 text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2 text-lg">💡 Pro Tip</h4>
                    <p className="text-blue-700 text-base leading-relaxed">
                      Add clear and attractive property names like "Green Valley Boys PG" or "Sunshine Girls Hostel". 
                      This helps students find and remember your property easily.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Location */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
                    <FaMapMarkerAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Contact & Location</h2>
                    <p className="text-gray-700 text-lg mt-1">How students can reach you and find your property</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      Primary Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="tel"
                        required
                        className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-lg shadow-sm ${
                          validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-green-300 bg-gray-50 hover:bg-white'
                        }`}
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-500 font-medium ${
                          validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder="owner@greenvalleypg.com"
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 text-lg">📱</span>
                      <input
                        type="tel"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-500 font-medium hover:border-gray-400"
                        value={contactInfo.whatsapp}
                        onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Alternate Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-500 font-medium hover:border-gray-400"
                        value={contactInfo.alternatePhone}
                        onChange={(e) => setContactInfo({...contactInfo, alternatePhone: e.target.value})}
                        placeholder="+91 98765 43211"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Preferences */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-green-500" />
                    Contact Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FaPhone className="text-blue-500" />
                        <span className="font-medium text-gray-800">Phone Calls</span>
                      </div>
                      <p className="text-sm text-gray-600">Primary contact for urgent inquiries</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-green-500 text-lg">📱</span>
                        <span className="font-medium text-gray-800">WhatsApp</span>
                      </div>
                      <p className="text-sm text-gray-600">Quick messaging and property updates</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FaEnvelope className="text-purple-500" />
                        <span className="font-medium text-gray-800">Email</span>
                      </div>
                      <p className="text-sm text-gray-600">Formal communications and documents</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Room Management */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <FaBed className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
                      <p className="text-gray-600">Define your room types, pricing, and availability</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <FaPlus /> Add Room Type
                  </button>
                </div>

                <div className="space-y-6">
                  {roomTypes.map((room, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative">
                      {roomTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoomType(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-colors duration-200"
                          title="Remove this room type"
                          aria-label={`Remove room type ${index + 1}`}
                        >
                          <FaTrash />
                        </button>
                      )}

                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Type {index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Room Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium"
                            value={room.type}
                            onChange={(e) => updateRoomType(index, 'type', e.target.value)}
                            title="Select room type"
                            aria-label={`Room type for room ${index + 1}`}
                          >
                            {roomTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Room Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={`w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium ${
                              validationErrors[`room_${index}_name`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            value={room.name}
                            onChange={(e) => updateRoomType(index, 'name', e.target.value)}
                            placeholder="e.g., Deluxe Single Room"
                          />
                          {validationErrors[`room_${index}_name`] && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors[`room_${index}_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Monthly Rent (₹) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              required
                              min="0"
                              className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium ${
                                validationErrors[`room_${index}_price`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                              value={room.price}
                              onChange={(e) => updateRoomType(index, 'price', parseInt(e.target.value))}
                              placeholder="15000"
                            />
                          </div>
                          {validationErrors[`room_${index}_price`] && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors[`room_${index}_price`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Security Deposit (₹)</label>
                          <div className="relative">
                            <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium"
                              value={room.securityDeposit}
                              onChange={(e) => updateRoomType(index, 'securityDeposit', parseInt(e.target.value))}
                              placeholder={`${room.price * 2} (Auto-calculated)`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Total Rooms <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            className={`w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium ${
                              validationErrors[`room_${index}_total`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            value={room.totalRooms}
                            onChange={(e) => updateRoomType(index, 'totalRooms', parseInt(e.target.value))}
                            placeholder="10"
                          />
                          {validationErrors[`room_${index}_total`] && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors[`room_${index}_total`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Available Now</label>
                          <input
                            type="number"
                            min="0"
                            max={room.totalRooms}
                            className={`w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium ${
                              validationErrors[`room_${index}_available`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            value={room.availableRooms}
                            onChange={(e) => updateRoomType(index, 'availableRooms', parseInt(e.target.value))}
                            placeholder="8"
                          />
                          {validationErrors[`room_${index}_available`] && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors[`room_${index}_available`]}</p>
                          )}
                        </div>

                        <div className="lg:col-span-3">
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Room Description</label>
                          <textarea
                            rows={2}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 text-gray-800 font-medium"
                            value={room.description}
                            onChange={(e) => updateRoomType(index, 'description', e.target.value)}
                            placeholder="Describe the room features, size, furnishing, etc."
                          />
                        </div>
                      </div>

                      {/* Room Summary */}
                      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Occupancy: <strong className="text-gray-800">{room.totalRooms - room.availableRooms}/{room.totalRooms}</strong></span>
                            <span className="text-gray-600">Monthly Income: <strong className="text-green-600">₹{(room.totalRooms - room.availableRooms) * room.price}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${room.availableRooms > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium">
                              {room.availableRooms > 0 ? 'Available' : 'Full'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Room Type Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Property Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">{roomTypes.reduce((sum, room) => sum + room.totalRooms, 0)}</div>
                      <div className="text-sm text-gray-600">Total Rooms</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">{roomTypes.reduce((sum, room) => sum + room.availableRooms, 0)}</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-orange-600">₹{Math.min(...roomTypes.map(r => r.price).filter(p => p > 0)) || 0}</div>
                      <div className="text-sm text-gray-600">Starting Price</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-purple-600">₹{roomTypes.reduce((sum, room) => sum + ((room.totalRooms - room.availableRooms) * room.price), 0)}</div>
                      <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Media & Gallery */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <FaCamera className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Media & Gallery</h2>
                    <p className="text-gray-600">Upload photos to showcase your property</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-200">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      title="Upload images for the PG property"
                      aria-label="Upload property images"
                    />
                    <FaCamera className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Property Photos</h3>
                    <p className="text-gray-600 mb-4">Add multiple photos to showcase different areas of your PG</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                    >
                      <FaUpload className="inline mr-2" />
                      Choose Photos
                    </button>
                  </div>

                  {/* Image Gallery */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {images.map((image, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
                          <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                            title="Remove image"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                          <input
                            type="text"
                            placeholder="Image description (optional)"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            value={imageDescriptions[index]}
                            onChange={(e) => {
                              const newDescriptions = [...imageDescriptions];
                              newDescriptions[index] = e.target.value;
                              setImageDescriptions(newDescriptions);
                            }}
                          />
                          {index === 0 && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                              <FaStar />
                              Primary Image
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Photo Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <FaCamera className="text-blue-600" />
                      📸 Photo Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <h4 className="font-semibold mb-2">✅ Recommended Photos:</h4>
                        <ul className="space-y-1">
                          <li>• Building exterior & entrance</li>
                          <li>• Sample furnished rooms</li>
                          <li>• Common areas & facilities</li>
                          <li>• Kitchen & dining area</li>
                          <li>• Bathrooms & washrooms</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">📝 Best Practices:</h4>
                        <ul className="space-y-1">
                          <li>• Use good lighting (natural preferred)</li>
                          <li>• Keep rooms clean and organized</li>
                          <li>• Take wide-angle shots</li>
                          <li>• Include 8-12 quality photos</li>
                          <li>• Highlight unique features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Amenities & Facilities */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <FaStar className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Amenities & Facilities</h2>
                    <p className="text-gray-600">Select the amenities and services you provide</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Basic Facilities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Facilities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {Object.entries(facilities).map(([key, value]) => (
                        <label
                          key={key}
                          className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            value 
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setFacilities({...facilities, [key]: e.target.checked})}
                            className="sr-only"
                          />
                          <div className={`text-2xl mb-2 ${value ? 'text-indigo-600' : 'text-gray-400'}`}>
                            {key === 'wifi' && <FaWifi />}
                            {key === 'ac' && <FaSnowflake />}
                            {key === 'laundry' && <FaTshirt />}
                            {key === 'parking' && <FaParking />}
                            {key === 'meals' && <FaUtensils />}
                            {key === 'powerBackup' && <FaBolt />}
                            {key === 'security' && <FaShieldAlt />}
                            {key === 'cctv' && <FaVideo />}
                            {key === 'gym' && <FaDumbbell />}
                            {key === 'commonArea' && <FaUsers />}
                          </div>
                          <span className="text-sm font-medium text-center">
                            {key === 'wifi' && 'WiFi'}
                            {key === 'ac' && 'AC'}
                            {key === 'laundry' && 'Laundry'}
                            {key === 'parking' && 'Parking'}
                            {key === 'meals' && 'Meals'}
                            {key === 'powerBackup' && 'Power Backup'}
                            {key === 'security' && 'Security'}
                            {key === 'cctv' && 'CCTV'}
                            {key === 'gym' && 'Gym'}
                            {key === 'commonArea' && 'Common Area'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableAmenities.map((amenity) => {
                        const AmenityIcon = amenity.icon;
                        const isSelected = amenities.includes(amenity.name);
                        return (
                          <button
                            key={amenity.name}
                            type="button"
                            onClick={() => toggleAmenity(amenity.name)}
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                              isSelected
                                ? `border-${amenity.color}-500 bg-${amenity.color}-50 text-${amenity.color}-700`
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <AmenityIcon className={`text-lg ${isSelected ? `text-${amenity.color}-600` : 'text-gray-400'}`} />
                            <span className="text-sm font-medium">{amenity.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Amenity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Custom Amenity</h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g., Yoga Studio, Rooftop Garden"
                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 text-gray-800 font-medium"
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={addCustomAmenity}
                        disabled={!customAmenity.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                      >
                        <FaPlus className="inline mr-2" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Selected Amenities */}
                  {amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Amenities ({amenities.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium"
                          >
                            {amenity}
                            <button
                              type="button"
                              onClick={() => toggleAmenity(amenity)}
                              className="text-indigo-600 hover:text-indigo-800"
                              title={`Remove ${amenity} amenity`}
                              aria-label={`Remove ${amenity} amenity`}
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Rules & Policies */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <FaShieldAlt className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Rules & Policies</h2>
                    <p className="text-gray-600">Set guidelines and policies for your property</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Access Control */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🕒 Access Control</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Gate Close Time</label>
                        <input
                          type="time"
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 text-gray-800 font-medium"
                          value={accessControl.gateCloseTime}
                          onChange={(e) => setAccessControl({...accessControl, gateCloseTime: e.target.value})}
                          title="Set gate closing time for the property"
                          placeholder="Select gate close time"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Guest Policy</label>
                        <select
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 text-gray-800 font-medium"
                          value={accessControl.guestPolicy}
                          onChange={(e) => setAccessControl({...accessControl, guestPolicy: e.target.value})}
                          title="Select guest policy for the property"
                        >
                          <option value="No guests allowed">No guests allowed</option>
                          <option value="Guests allowed with prior permission">Guests allowed with prior permission</option>
                          <option value="Guests allowed till gate close time">Guests allowed till gate close time</option>
                          <option value="24/7 guest access">24/7 guest access</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle Policies */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 Lifestyle Policies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessControl.smokingAllowed}
                          onChange={(e) => setAccessControl({...accessControl, smokingAllowed: e.target.checked})}
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">Smoking Allowed</div>
                          <div className="text-sm text-gray-600">Permit smoking in designated areas</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessControl.alcoholAllowed}
                          onChange={(e) => setAccessControl({...accessControl, alcoholAllowed: e.target.checked})}
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">Alcohol Allowed</div>
                          <div className="text-sm text-gray-600">Permit alcohol consumption</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* House Rules */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 House Rules</h3>
                    <div className="space-y-3">
                      {rules.map((rule, index) => (
                        <div key={index} className="flex gap-3">
                          <input
                            type="text"
                            placeholder={`Rule ${index + 1} (e.g., No loud music after 10 PM)`}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 text-gray-800 font-medium"
                            value={rule}
                            onChange={(e) => updateListItem(rules, setRules, index, '', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => addToList(rules, setRules, '')}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            title="Add new rule"
                          >
                            <FaPlus />
                          </button>
                          {rules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFromList(rules, setRules, index)}
                              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                              title="Remove rule"
                            >
                              <FaMinus />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Places */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Nearby Places</h3>
                    <div className="space-y-3">
                      {nearbyPlaces.map((place, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                          <select
                            className="p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 text-gray-800 font-medium"
                            value={place.type}
                            onChange={(e) => updateListItem(nearbyPlaces, setNearbyPlaces, index, 'type', e.target.value)}
                            title={`Select type for nearby place ${index + 1}`}
                          >
                            {placeTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Place name"
                            className="p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 text-gray-800 font-medium"
                            value={place.name}
                            onChange={(e) => updateListItem(nearbyPlaces, setNearbyPlaces, index, 'name', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Distance (e.g., 500m)"
                              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 text-gray-800 font-medium"
                              value={place.distance}
                              onChange={(e) => updateListItem(nearbyPlaces, setNearbyPlaces, index, 'distance', e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => addToList(nearbyPlaces, setNearbyPlaces, { type: 'metro', name: '', distance: '' })}
                              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                              title="Add new place"
                            >
                              <FaPlus />
                            </button>
                            {nearbyPlaces.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFromList(nearbyPlaces, setNearbyPlaces, index)}
                                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                title="Remove place"
                              >
                                <FaMinus />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Highlights */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Property Highlights</h3>
                    <div className="space-y-3">
                      {highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-3">
                          <input
                            type="text"
                            placeholder={`Highlight ${index + 1} (e.g., Prime location near IT hub)`}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 text-gray-800 font-medium"
                            value={highlight}
                            onChange={(e) => updateListItem(highlights, setHighlights, index, '', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => addToList(highlights, setHighlights, '')}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            title="Add new highlight"
                          >
                            <FaPlus />
                          </button>
                          {highlights.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFromList(highlights, setHighlights, index)}
                              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                              title="Remove highlight"
                            >
                              <FaMinus />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Final Review */}
            {currentStep === 7 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <FaCheckCircle className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Final Review</h2>
                    <p className="text-gray-600">Review your property details before submission</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Property Overview */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">🏠 Property Overview</h3>
                    <div className="space-y-3 text-sm">
                      <div><strong>Name:</strong> {basicInfo.name || 'Not specified'}</div>
                      <div><strong>Gender:</strong> {basicInfo.gender}</div>
                      <div><strong>Address:</strong> {basicInfo.address || 'Not specified'}</div>
                      <div><strong>City:</strong> {basicInfo.city || 'Not specified'}</div>
                      <div><strong>Contact:</strong> {contactInfo.phone || 'Not specified'}</div>
                      <div><strong>Email:</strong> {contactInfo.email || 'Not specified'}</div>
                    </div>
                  </div>

                  {/* Room Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">🛏️ Room Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Total Room Types:</strong> {roomTypes.length}</div>
                      <div><strong>Total Rooms:</strong> {roomTypes.reduce((sum, room) => sum + room.totalRooms, 0)}</div>
                      <div><strong>Available Rooms:</strong> {roomTypes.reduce((sum, room) => sum + room.availableRooms, 0)}</div>
                      <div><strong>Price Range:</strong> ₹{Math.min(...roomTypes.map(r => r.price).filter(p => p > 0)) || 0} - ₹{Math.max(...roomTypes.map(r => r.price).filter(p => p > 0)) || 0}</div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {roomTypes.map((room, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border">
                          <div className="font-medium">{room.name} - ₹{room.price}/month</div>
                          <div className="text-xs text-gray-600">{room.totalRooms} total, {room.availableRooms} available</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">⭐ Amenities & Facilities</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Basic Facilities:</strong> {Object.values(facilities).filter(f => f).length} enabled</div>
                      <div><strong>Additional Amenities:</strong> {amenities.length} selected</div>
                    </div>
                    {amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {amenities.slice(0, 6).map((amenity, index) => (
                          <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                        {amenities.length > 6 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                            +{amenities.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Media Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">📸 Media Gallery</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Photos Uploaded:</strong> {images.length}</div>
                      <div><strong>Status:</strong> {images.length > 0 ? '✅ Ready' : '⚠️ No photos uploaded'}</div>
                    </div>
                    {images.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {images.slice(0, 4).map((image, index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save as Template */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAsTemplate}
                      onChange={(e) => setSaveAsTemplate(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">Save as Template</div>
                      <div className="text-sm text-gray-600">Reuse this property configuration for future listings</div>
                    </div>
                  </label>
                </div>

                {/* Final Checklist */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">✅ Pre-submission Checklist</h3>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${basicInfo.name ? 'text-green-600' : 'text-red-600'}`}>
                      {basicInfo.name ? <FaCheckCircle /> : <FaExclamationTriangle />}
                      Property name and basic details
                    </div>
                    <div className={`flex items-center gap-2 ${contactInfo.phone && contactInfo.email ? 'text-green-600' : 'text-red-600'}`}>
                      {contactInfo.phone && contactInfo.email ? <FaCheckCircle /> : <FaExclamationTriangle />}
                      Contact information
                    </div>
                    <div className={`flex items-center gap-2 ${roomTypes.some(r => r.price > 0) ? 'text-green-600' : 'text-red-600'}`}>
                      {roomTypes.some(r => r.price > 0) ? <FaCheckCircle /> : <FaExclamationTriangle />}
                      Room types and pricing
                    </div>
                    <div className={`flex items-center gap-2 ${images.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {images.length > 0 ? <FaCheckCircle /> : <FaInfoCircle />}
                      Property photos ({images.length > 0 ? 'uploaded' : 'recommended'})
                    </div>
                    <div className={`flex items-center gap-2 ${amenities.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {amenities.length > 0 ? <FaCheckCircle /> : <FaInfoCircle />}
                      Amenities selection ({amenities.length > 0 ? 'selected' : 'optional'})
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-8 border-t-2 border-gray-200 mt-10">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
              >
                <FaArrowLeft className="text-lg" /> Previous
              </button>

              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl shadow-sm">
                <span className="text-gray-700 font-bold text-lg">Step {currentStep} of {steps.length}</span>
                <div className="w-16 bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 origin-left"
                    data-progress={`${(currentStep / steps.length) * 100}%`}
                  ></div>
                </div>
              </div>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg transform hover:scale-105"
                >
                  Next <FaArrowRight className="text-lg" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Creating PG...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-lg" /> Create PG Property
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAddPGForm;
