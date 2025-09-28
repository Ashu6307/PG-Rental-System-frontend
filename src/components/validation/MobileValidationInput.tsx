'use client';

import React, { useEffect, useCallback } from "react";
import { FaExclamationCircle, FaPhoneAlt } from "react-icons/fa";
import { formatPhoneNumber, isValidIndianMobile, getMobileValidationError } from "../../utils/validation/mobileValidation";
import { getRoleColors, getDefaultRoleColors } from "../../utils/roleColors";

interface MobileValidationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  setError?: (error: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  errorMessages?: Record<string, string>;
  onValidMobile?: (mobile: string) => void;
  role?: string;
}

/**
 * Reusable, industry-level Mobile Number Input component with validation
 *
 * Props:
 * - value: string (controlled value)
 * - onChange: function (update value)
 * - error: string (current error message)
 * - setError: function (update error)
 * - placeholder: string (input placeholder)
 * - readOnly: boolean (optional)
 * - disabled: boolean (optional)
 * - required: boolean (optional)
 * - className: string (extra classes for styling)
 * - errorMessages: object (custom error messages override)
 * - onValidMobile: function (callback when mobile is valid)
 */
const MobileValidationInput: React.FC<MobileValidationInputProps> = ({
  value,
  onChange,
  error = '',
  setError = () => {},
  placeholder = "Enter mobile number",
  readOnly = false,
  disabled = false,
  required = true,
  className = "",
  errorMessages = {},
  onValidMobile = null,
  role = '',
  ...props
}) => {
  const roleColors = role ? getRoleColors(role, !!value && value.trim().length > 0) : getDefaultRoleColors();
  // Debounce validation (better UX)
  const validateInput = useCallback(
    (val: string) => {
      let formatted = formatPhoneNumber(val);
      onChange(formatted);
      
      const validationError = getMobileValidationError(formatted, false); // Don't check required while typing
      setError(validationError);
      
      if (!validationError && onValidMobile) {
        onValidMobile(formatted);
      }
    },
    [onChange, setError, onValidMobile]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  return (
    <div className="w-full relative">
      <input
        type="tel"
        name="mobile"
        id="mobile"
        autoComplete="tel"
        required={required}
        disabled={disabled}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        {...(error ? { 'aria-invalid': true } : { 'aria-invalid': false })}
        {...(error ? { 'aria-describedby': "mobile-error" } : {})}
        onChange={e => {
          validateInput(e.target.value);
        }}
        className={`appearance-none block w-full pl-3 pr-10 py-2 border rounded-md placeholder-gray-400 text-gray-900 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && value.trim().length > 0 && isValidIndianMobile(value)
            ? `border-${role === 'owner' ? 'green' : 'blue'}-500 focus:ring-${role === 'owner' ? 'green' : 'blue'}-500 focus:border-${role === 'owner' ? 'green' : 'blue'}-500`
            : "border-gray-300 focus:ring-gray-500 focus:border-gray-400"
        } ${className}`}
        {...props}
      />
      {/* Error / Icon */}
      {error ? (
        <FaExclamationCircle
          className="absolute right-3 top-2.5 h-6 w-6 text-red-500"
          aria-hidden="true"
        />
      ) : (
        <div className={`absolute right-3 top-2.5 h-6 w-6 ${roleColors.background} rounded-full flex items-center justify-center pointer-events-none`}>
          <FaPhoneAlt className={`h-4 w-4 ${roleColors.icon}`} aria-hidden="true" />
        </div>
      )}
      {/* Error Message */}
      {error && (
        <p id="mobile-error" className="text-red-500 text-xs mt-1">
          {errorMessages[error] || error}
        </p>
      )}
    </div>
  );
};

export default MobileValidationInput;
