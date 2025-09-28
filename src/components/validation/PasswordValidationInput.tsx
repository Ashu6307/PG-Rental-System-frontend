'use client';

import React, { useState, useEffect, useCallback } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import { getRoleColors, getDefaultRoleColors } from "../../utils/roleColors";

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

interface PasswordValidationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  setError?: (error: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showStrengthIndicator?: boolean;
  minLength?: number;
  confirmPassword?: string;
  isConfirmField?: boolean;
  onStrengthChange?: (strength: PasswordStrength) => void;
  role?: string;
  tooltipPosition?: 'left' | 'right'; // New prop for tooltip position
  id?: string; // Add unique id prop
}

/**
 * Reusable Password Input component with validation and strength indicator
 *
 * Props:
 * - value: string (controlled value)
 * - onChange: function (update value)
 * - error: string (current error message)
 * - setError: function (update error)
 * - placeholder: string (input placeholder)
 * - required: boolean (optional)
 * - disabled: boolean (optional)
 * - className: string (extra classes for styling)
 * - showStrengthIndicator: boolean (show password strength)
 * - minLength: number (minimum password length)
 * - confirmPassword: string (for confirm password validation)
 * - isConfirmField: boolean (if this is confirm password field)
 * - onStrengthChange: function (callback when strength changes)
 */
const PasswordValidationInput: React.FC<PasswordValidationInputProps> = ({
  value,
  onChange,
  error = '',
  setError = () => {},
  placeholder = "Enter your password",
  required = true,
  disabled = false,
  className = "",
  showStrengthIndicator = false,
  minLength = 8,
  confirmPassword = '',
  isConfirmField = false,
  onStrengthChange,
  role = '',
  tooltipPosition = 'left', // Default to left
  id = 'password', // Default id
  ...props
}) => {
  // Check if password is valid and complete
  const isPasswordComplete = useCallback((password: string): boolean => {
    if (!password || password.length < minLength) return false;
    
    const requirements = {
      length: password.length >= minLength,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // For a complete password, require at least 4 out of 5 requirements including length
    const score = Object.values(requirements).filter(Boolean).length;
    return requirements.length && score >= 4;
  }, [minLength]);

  const roleColors = role ? getRoleColors(role, !!value && isPasswordComplete(value)) : getDefaultRoleColors();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: '',
    color: '',
    requirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false
    }
  });

  // Password strength checker
  const checkPasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0;
    let message = '';
    let color = '';
    
    const requirements = {
      length: password.length >= minLength,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate score
    Object.values(requirements).forEach(req => {
      if (req) score++;
    });
    
    if (score <= 2) {
      message = 'Weak password';
      color = 'text-red-600';
    } else if (score <= 3) {
      message = 'Fair password';
      color = 'text-yellow-600';
    } else if (score <= 4) {
      message = 'Good password';
      color = 'text-blue-600';
    } else {
      message = 'Strong password';
      color = 'text-green-600';
    }

    return { score, message, color, requirements };
  }, [minLength]);

  // Get password validation error
  const getPasswordValidationError = useCallback((password: string, checkRequired: boolean = false): string => {
    if (!password && required && checkRequired) {
      return 'Password is required';
    }
    
    if (password && password.length < minLength) {
      return `Password must be at least ${minLength} characters`;
    }
    
    if (isConfirmField && confirmPassword && password !== confirmPassword) {
      return 'Password does not match';
    }
    
    return '';
  }, [required, minLength, isConfirmField, confirmPassword]);

  // Debounced validation for better UX
  const validateInput = useCallback(
    (val: string) => {
      onChange(val);
      
      const validationError = getPasswordValidationError(val, false); // Don't check required while typing
      setError(validationError);
      
      if (showStrengthIndicator && !isConfirmField) {
        const strength = checkPasswordStrength(val);
        setPasswordStrength(strength);
        if (onStrengthChange) {
          onStrengthChange(strength);
        }
      }
    },
    [onChange, setError, showStrengthIndicator, isConfirmField, getPasswordValidationError, checkPasswordStrength, onStrengthChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  // Get progress bar classes based on strength
  const getStrengthBarClasses = () => {
    const baseClasses = "h-2 rounded-full transition-all duration-300";
    const colorClass = getStrengthBarColor();
    const widthClass = passwordStrength.score === 0 ? 'w-0' :
                      passwordStrength.score === 1 ? 'w-1/5' :
                      passwordStrength.score === 2 ? 'w-2/5' :
                      passwordStrength.score === 3 ? 'w-3/5' :
                      passwordStrength.score === 4 ? 'w-4/5' : 'w-full';
    
    return `${baseClasses} ${colorClass} ${widthClass}`;
  };

  // Get progress bar color
  const getStrengthBarColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id={id}
          autoComplete="off"
          autoSave="off"
          data-form-type="other"
          required={required}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={e => validateInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`appearance-none block w-full pl-3 pr-10 py-2 border rounded-md placeholder-gray-400 text-gray-900 focus:outline-none sm:text-sm transition-all duration-200 ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : value && isPasswordComplete(value)
              ? `border-${role === 'owner' ? 'green' : 'blue'}-500 focus:ring-${role === 'owner' ? 'green' : 'blue'}-500 focus:border-${role === 'owner' ? 'green' : 'blue'}-500`
              : "border-gray-300 focus:ring-gray-500 focus:border-gray-400"
          } ${className}`}
          {...props}
        />
        
        {/* Progress Bar attached to input bottom border */}
        {showStrengthIndicator && !isConfirmField && value && (
          <div className="w-full bg-transparent rounded-b-md h-0.5 -mt-0.5 overflow-hidden">
            <div className={getStrengthBarClasses()}></div>
          </div>
        )}
        
        {/* Password Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-2.5 h-6 w-6 ${
            // For confirm field with error, keep gray background and icon
            isConfirmField && error 
              ? 'bg-gray-100 hover:bg-gray-200'
              : roleColors.background
          } rounded-full flex items-center justify-center ${
            isConfirmField && error 
              ? ''
              : roleColors.hover
          } focus:outline-none transition-colors duration-200`}
        >
          {showPassword ? (
            <FaEyeSlash className={`h-4 w-4 ${
              isConfirmField && error 
                ? 'text-gray-400'
                : roleColors.icon
            }`} />
          ) : (
            <FaEye className={`h-4 w-4 ${
              isConfirmField && error 
                ? 'text-gray-400'
                : roleColors.icon
            }`} />
          )}
        </button>

        {/* Floating Password Requirements Tooltip - Dynamic Position with Arrow */}
        {showStrengthIndicator && !isConfirmField && isFocused && value && (
          <div className={`absolute top-1/2 -translate-y-1/2 w-80 bg-gray-900/10 backdrop-blur-sm border border-gray-300/10 rounded-lg shadow-lg p-4 z-50 transition-all duration-200 ${
            tooltipPosition === 'right' 
              ? 'left-full ml-[70px]' 
              : 'right-full mr-[70px]'
          }`}>
            {/* Arrow Pointer - Dynamic Direction */}
            {tooltipPosition === 'right' ? (
              <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-6 h-6 rotate-180">
                <HiArrowNarrowRight className="w-6 h-6 text-gray-900/30" />
              </div>
            ) : (
              <HiArrowNarrowRight className="absolute top-1/2 -translate-y-1/2 -right-6 w-6 h-6 text-gray-900/30" />
            )}
            
            {/* Strength Message */}
            <p className={`text-sm font-medium mb-3 ${passwordStrength.color}`}>
              {passwordStrength.message}
            </p>
            
            {/* Requirements Checklist - 2 Columns Layout */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div className="flex items-center text-xs">
                {passwordStrength.requirements.length ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 border border-gray-400 rounded-full mr-1.5 flex-shrink-0"></div>
                )}
                <span className={passwordStrength.requirements.length ? 'text-green-600' : 'text-red-600'}>
                  {minLength}+ characters
                </span>
              </div>
              <div className="flex items-center text-xs">
                {passwordStrength.requirements.lowercase ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 border border-gray-400 rounded-full mr-1.5 flex-shrink-0"></div>
                )}
                <span className={passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-red-600'}>
                  Lowercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                {passwordStrength.requirements.uppercase ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 border border-gray-400 rounded-full mr-1.5 flex-shrink-0"></div>
                )}
                <span className={passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-red-600'}>
                  Uppercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                {passwordStrength.requirements.number ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 border border-gray-400 rounded-full mr-1.5 flex-shrink-0"></div>
                )}
                <span className={passwordStrength.requirements.number ? 'text-green-600' : 'text-red-600'}>
                  One number
                </span>
              </div>
              <div className="flex items-center text-xs col-span-2 justify-center">
                {passwordStrength.requirements.special ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 border border-gray-400 rounded-full mr-1.5 flex-shrink-0"></div>
                )}
                <span className={passwordStrength.requirements.special ? 'text-green-600' : 'text-red-600'}>
                  Special character
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordValidationInput;
