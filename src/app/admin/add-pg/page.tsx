"use client";
import React, { useState } from 'react';
import ProfessionalAddPGForm from '@/components/forms/ProfessionalAddPGForm';
import { FaBuilding, FaPlus } from 'react-icons/fa';

const AddPGPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddPG = async (pgData: any) => {
    setLoading(true);
    setMessage(null);
    
    try {
      console.log('PG Data to submit:', pgData);
      
      // Here you would typically make API call to submit the PG data
      // For now, we'll just simulate a successful submission
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      setMessage({ type: 'success', text: 'PG property added successfully!' });
      setShowForm(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error adding PG:', error);
      setMessage({ type: 'error', text: 'Failed to add PG property. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <FaBuilding className="text-blue-600" />
            PG Property Management
          </h1>
          <p className="text-lg text-gray-600">
            Add and manage your PG properties with detailed information
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <div className="flex items-center justify-between">
              <span>{message.text}</span>
              <button 
                onClick={() => setMessage(null)}
                className="text-lg font-bold ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Add PG Button */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-3 mx-auto text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Add New PG Property
            </button>
          </div>
        )}

        {/* Add PG Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-2">
            <ProfessionalAddPGForm
              onSubmit={handleAddPG}
              onClose={() => setShowForm(false)}
              loading={loading}
            />
          </div>
        )}

        {/* Sample Data Preview */}
        {!showForm && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Form Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">📋 Basic Information</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PG Name & Address</li>
                    <li>• Location Coordinates</li>
                    <li>• Gender Preferences</li>
                    <li>• Owner Details</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">📞 Contact & Communication</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Phone & WhatsApp</li>
                    <li>• Email Address</li>
                    <li>• Alternate Contacts</li>
                    <li>• Emergency Numbers</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🏠 Room Management</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multiple Room Types</li>
                    <li>• Pricing & Deposits</li>
                    <li>• Availability Tracking</li>
                    <li>• Room-specific Amenities</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-700 mb-2">📷 Media & Gallery</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multiple Image Upload</li>
                    <li>• Image Descriptions</li>
                    <li>• Primary Image Selection</li>
                    <li>• Preview Functionality</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">⭐ Amenities & Facilities</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 25+ Standard Amenities</li>
                    <li>• Custom Amenity Addition</li>
                    <li>• Detailed Facility Info</li>
                    <li>• WiFi, Parking, Food Details</li>
                  </ul>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-cyan-700 mb-2">🔧 Advanced Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Security & Access Control</li>
                    <li>• Nearby Places Mapping</li>
                    <li>• Rules & Policies</li>
                    <li>• Pricing & Discounts</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-700 mb-2">📍 Location Details</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Nearby Metro/Bus Stops</li>
                    <li>• Hospitals & Malls</li>
                    <li>• Educational Institutes</li>
                    <li>• Distance Mapping</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-pink-700 mb-2">🌟 Marketing Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Key Highlights</li>
                    <li>• Featured Property Option</li>
                    <li>• SEO Optimization</li>
                    <li>• Analytics Tracking</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-700 mb-2">💰 Pricing & Business</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Original Price Setup</li>
                    <li>• Discount Configuration</li>
                    <li>• Security Deposits</li>
                    <li>• Monthly Rent Structure</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">🎯 Complete PG Management Solution</h3>
                <p className="text-gray-600 leading-relaxed">
                  This comprehensive form captures all essential information needed to create a complete PG listing. 
                  It includes detailed amenity specifications (WiFi speeds, parking charges, food types), 
                  location mapping, media management, and business rules. The form automatically calculates 
                  derived values like total beds, price ranges, and generates SEO-friendly content.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPGPage;
