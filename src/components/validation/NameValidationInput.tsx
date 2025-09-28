'use client';

import React, { useEffect, useCallback } from "react";
import { FaExclamationCircle, FaUser } from "react-icons/fa";
import {
  handleNameChange,
  isValidName
} from "../../utils/validation/nameValidation";
import { getRoleColors, getDefaultRoleColors } from "../../utils/roleColors";

interface NameValidationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  setError?: (error: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  role?: string;
  errorMessages?: Record<string, string>;
}

/**
 * Reusable Name Input component with validation and formatting
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
 * - errorMessages: object (custom error messages override)
 */
const NameValidationInput: React.FC<NameValidationInputProps> = ({
  value,
  onChange,
  error = '',
  setError = () => {},
  placeholder = "Enter your full name",
  required = true,
  disabled = false,
  className = "",
  errorMessages = {},
  role = '',
  ...props
}) => {
  const roleColors = role ? getRoleColors(role, !!value && value.trim().length > 0) : getDefaultRoleColors();
  // Debounced validation for better UX
  const validateInput = useCallback(
    (val: string) => {
      handleNameChange(val, onChange, setError);
    },
    [onChange, setError]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  return (
    <div className="w-full relative">
      <input
        type="text"
        name="name"
        id="name"
        autoComplete="name"
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        {...(error ? { 'aria-invalid': true } : { 'aria-invalid': false })}
        {...(error ? { 'aria-describedby': "name-error" } : {})}
        onChange={e => validateInput(e.target.value)}
        onInput={e => {
          // Remove numbers and special chars in real-time
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/[^a-zA-Z\s]/g, "");
        }}
        className={`appearance-none block w-full pl-3 pr-10 py-2 border rounded-md placeholder-gray-400 text-gray-900 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && value.trim().length > 0 && isValidName(value)
            ? `border-${role === 'owner' ? 'green' : 'blue'}-500 focus:ring-${role === 'owner' ? 'green' : 'blue'}-500 focus:border-${role === 'owner' ? 'green' : 'blue'}-500`
            : "border-gray-300 focus:ring-gray-500 focus:border-gray-400"
        } ${className}`}
        {...props}
      />
      {/* Error / Icon */}
      {error ? (
        <FaExclamationCircle
          className="absolute right-3 top-2 h-6 w-6 text-red-500"
          aria-hidden="true"
        />
      ) : (
        <div className={`absolute right-3 top-2 h-6 w-6 ${roleColors.background} rounded-full flex items-center justify-center pointer-events-none`}>
          <FaUser className={`h-4 w-4 ${roleColors.icon}`} aria-hidden="true" />
        </div>
      )}
      {/* Error Message */}
      {error && (
        <p id="name-error" className="text-red-500 text-xs mt-1">
          {errorMessages[error] || error}
        </p>
      )}
    </div>
  );
};

export default NameValidationInput;
