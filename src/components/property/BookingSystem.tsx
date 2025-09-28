import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaCreditCard,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaHome,
  FaRupeeSign
} from 'react-icons/fa';

interface BookingSystemProps {
  propertyId: string;
  propertyTitle: string;
  propertyType: 'PG' | 'Room' | 'Flat';
  ownerName: string;
  pricing: {
    rent: number;
    deposit: number;
    maintenance?: number;
  };
  availability: {
    available: boolean;
    availableFrom?: string;
    minimumStay?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (bookingId: string) => void;
}

interface BookingFormData {
  visitDate: string;
  visitTime: string;
  moveInDate: string;
  duration: number;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  occupation: string;
  emergencyContact: string;
  specialRequests: string;
  paymentMethod: 'online' | 'offline';
  acceptTerms: boolean;
}

const BookingSystem: React.FC<BookingSystemProps> = ({
  propertyId,
  propertyTitle,
  propertyType,
  ownerName,
  pricing,
  availability,
  isOpen,
  onClose,
  onBookingSuccess
}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    visitDate: '',
    visitTime: '',
    moveInDate: '',
    duration: 6,
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    occupation: '',
    emergencyContact: '',
    specialRequests: '',
    paymentMethod: 'online',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', 
    '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (stepNumber === 1) {
      if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
      if (!formData.visitTime) newErrors.visitTime = 'Visit time is required';
      if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';
    }

    if (stepNumber === 2) {
      if (!formData.tenantName) newErrors.tenantName = 'Name is required';
      if (!formData.tenantPhone) newErrors.tenantPhone = 'Phone number is required';
      if (!formData.tenantEmail) newErrors.tenantEmail = 'Email is required';
      if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    }

    if (stepNumber === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Please accept terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingId = 'BK' + Date.now();
      onBookingSuccess(bookingId);
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const monthlyRent = pricing.rent * formData.duration;
    const deposit = pricing.deposit;
    const maintenance = (pricing.maintenance || 0) * formData.duration;
    return monthlyRent + deposit + maintenance;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Your {propertyType}</h2>
              <p className="text-gray-600">{propertyTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Close booking form"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <FaCheck /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Schedule Visit
            </span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Personal Details
            </span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Payment
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Schedule Visit */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Your Property Visit</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Visit Date
                  </label>
                  <input
                    type="date"
                    min={getTomorrowDate()}
                    value={formData.visitDate}
                    onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Visit date"
                  />
                  {errors.visitDate && <p className="text-red-500 text-sm mt-1">{errors.visitDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline mr-2" />
                    Preferred Time
                  </label>
                  <select
                    value={formData.visitTime}
                    onChange={(e) => setFormData({...formData, visitTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Preferred visit time"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.visitTime && <p className="text-red-500 text-sm mt-1">{errors.visitTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaHome className="inline mr-2" />
                    Preferred Move-in Date
                  </label>
                  <input
                    type="date"
                    min={getTomorrowDate()}
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({...formData, moveInDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Move-in date"
                  />
                  {errors.moveInDate && <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline mr-2" />
                    Duration (Months)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Duration in months"
                  >
                    {[3, 6, 9, 12, 18, 24].map((months) => (
                      <option key={months} value={months}>{months} months</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Your Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.tenantName && <p className="text-red-500 text-sm mt-1">{errors.tenantName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.tenantPhone}
                    onChange={(e) => setFormData({...formData, tenantPhone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                  {errors.tenantPhone && <p className="text-red-500 text-sm mt-1">{errors.tenantPhone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.tenantEmail}
                    onChange={(e) => setFormData({...formData, tenantEmail: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                  {errors.tenantEmail && <p className="text-red-500 text-sm mt-1">{errors.tenantEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your occupation"
                  />
                  {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency contact number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any special requirements or questions..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              
              {/* Pricing Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Rent × {formData.duration} months</span>
                    <span><FaRupeeSign className="inline" />{(pricing.rent * formData.duration).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span><FaRupeeSign className="inline" />{pricing.deposit.toLocaleString()}</span>
                  </div>
                  {pricing.maintenance && (
                    <div className="flex justify-between">
                      <span>Maintenance × {formData.duration} months</span>
                      <span><FaRupeeSign className="inline" />{(pricing.maintenance * formData.duration).toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span><FaRupeeSign className="inline" />{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FaCreditCard className="inline mr-2" />
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'online' | 'offline'})}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-gray-600">Pay securely with card/UPI/net banking</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="offline"
                      checked={formData.paymentMethod === 'offline'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'online' | 'offline'})}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Pay to Owner</div>
                      <div className="text-sm text-gray-600">Pay directly to {ownerName} during visit</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm">
                    I agree to the <button className="text-blue-600 hover:underline">Terms and Conditions</button> and <button className="text-blue-600 hover:underline">Privacy Policy</button>
                  </span>
                </label>
                {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <FaShieldAlt className="text-blue-500 mt-1" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900">Secure Booking</div>
                  <div className="text-blue-800">Your personal and payment information is protected with bank-level security.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 flex justify-between">
          <button
            onClick={step === 1 ? onClose : handlePrevious}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck />
                  Confirm Booking
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;