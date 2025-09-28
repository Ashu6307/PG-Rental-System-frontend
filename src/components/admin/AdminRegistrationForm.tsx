'use client';
import React, { useState, useContext } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserShield, FaBuilding, FaTimes, FaPlus } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Import validation components
import NameValidationInput from '@/components/validation/NameValidationInput';
import EmailValidationInput from '@/components/validation/EmailValidationInput';
import MobileValidationInput from '@/components/validation/MobileValidationInput';
import PasswordValidationInput from '@/components/validation/PasswordValidationInput';
interface AdminRegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({ onSuccess, onCancel }) => {
  const { user, token } = useContext(AuthContext) || {};
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'city_admin', // Default to city_admin
    assignedCities: [{ city: '', state: '', isActive: true }],
    permissions: {
      ownerVerification: true,
      propertyApproval: true,
      userManagement: true,
      cityManagement: false,
      adminManagement: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Super Admin check
  const isSuperAdmin = user?.role === 'admin'; // Assuming super admin has role 'admin'

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation (validation components will handle detailed validation)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate assigned cities for city_admin
    if (formData.role === 'city_admin') {
      const validCities = formData.assignedCities.filter(city => city.city.trim() && city.state.trim());
      if (validCities.length === 0) {
        newErrors.assignedCities = 'At least one city assignment is required for City Admin';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCityChange = (index: number, field: 'city' | 'state', value: string) => {
    const updatedCities = [...formData.assignedCities];
    updatedCities[index] = {
      ...updatedCities[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      assignedCities: updatedCities
    }));
  };

  const addCityField = () => {
    setFormData(prev => ({
      ...prev,
      assignedCities: [...prev.assignedCities, { city: '', state: '', isActive: true }]
    }));
  };

  const removeCityField = (index: number) => {
    if (formData.assignedCities.length > 1) {
      const updatedCities = formData.assignedCities.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        assignedCities: updatedCities
      }));
    }
  };

  const handleRoleChange = (newRole: string) => {
    const updatedPermissions = {
      ownerVerification: true,
      propertyApproval: true,
      userManagement: true,
      cityManagement: newRole === 'super_admin',
      adminManagement: newRole === 'super_admin'
    };

    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: updatedPermissions
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isSuperAdmin) {
      toast.error('Only Super Admin can create new admins');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          assignedCities: formData.role === 'city_admin' 
            ? formData.assignedCities.filter(city => city.city.trim() && city.state.trim())
            : []
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Admin created successfully!');
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Admin creation error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center p-8">
        <FaUserShield className="mx-auto text-6xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only Super Admin can create new administrators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaUserShield className="text-3xl mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Create New Admin</h2>
              <p className="text-red-100">Super Admin Panel</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-white hover:text-red-200 transition-colors"
              title="Cancel admin creation"
              aria-label="Cancel admin creation"
            >
              <FaTimes className="text-xl" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2" />
              Full Name
            </label>
            <NameValidationInput
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              placeholder="Enter admin's full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2" />
              Email Address
            </label>
            <EmailValidationInput
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2" />
              Phone Number
            </label>
            <MobileValidationInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="1234567890"
              required
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Security</h3>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <PasswordValidationInput
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={errors.password}
              placeholder="Enter secure password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2" />
              Confirm Password
            </label>
            <PasswordValidationInput
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Role & Permissions</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUserShield className="inline mr-2" />
              Admin Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              title="Select admin role"
              aria-label="Admin role selection"
            >
              <option value="city_admin">City Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">General Admin</option>
            </select>
          </div>
        </div>

        {/* City Assignment for City Admin */}
        {formData.role === 'city_admin' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex-1">
                <FaBuilding className="inline mr-2" />
                Assigned Cities
              </h3>
              <button
                type="button"
                onClick={addCityField}
                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                title="Add new city"
                aria-label="Add new city assignment"
              >
                <FaPlus />
              </button>
            </div>
            
            {formData.assignedCities.map((cityData, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={cityData.city}
                  onChange={(e) => handleCityChange(index, 'city', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="City name"
                />
                <input
                  type="text"
                  value={cityData.state}
                  onChange={(e) => handleCityChange(index, 'state', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="State name"
                />
                {formData.assignedCities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCityField(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove city"
                    aria-label="Remove city assignment"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            {errors.assignedCities && <p className="text-red-500 text-sm">{errors.assignedCities}</p>}
          </div>
        )}

        {/* Permissions Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Permissions</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  disabled={key === 'cityManagement' || key === 'adminManagement'}
                  onChange={(e) => handleInputChange('permissions', {
                    ...formData.permissions,
                    [key]: e.target.checked
                  })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  title={`Toggle ${key.replace(/([A-Z])/g, ' $1').trim()} permission`}
                  aria-label={`${key.replace(/([A-Z])/g, ' $1').trim()} permission`}
                />
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Admin...' : 'Create Admin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRegistrationForm;
