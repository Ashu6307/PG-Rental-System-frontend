'use client';

import React, { useState, useEffect, useCallback } from "react";
import { FaExclamationCircle, FaEnvelope } from "react-icons/fa";
import {
  handleEmailChange,
  isValidEmail
} from "../../utils/validation/emailValidation";
import { getRoleColors, getDefaultRoleColors } from "../../utils/roleColors";

interface EmailValidationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  setError?: (error: string) => void;
  suggestions?: string[];
  setSuggestions?: (suggestions: string[]) => void;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  domains?: string[];
  className?: string;
  errorMessages?: Record<string, string>;
  onValidEmail?: (email: string) => void;
  role?: string;
}

/**
 * Reusable, industry-level Email Input component with validation & suggestions
 *
 * Props:
 * - value: string (controlled value)
 * - onChange: function (update value)
 * - error: string (current error message)
 * - setError: function (update error)
 * - suggestions: array (email suggestions)
 * - setSuggestions: function (update suggestions)
 * - placeholder: string (input placeholder)
 * - readOnly: boolean (optional)
 * - disabled: boolean (optional)
 * - required: boolean (optional)
 * - domains: array (custom domains for suggestions)
 * - className: string (extra classes for styling)
 * - errorMessages: object (custom error messages override)
 * - onValidEmail: function (callback when email is valid)
 */
const EmailValidationInput: React.FC<EmailValidationInputProps> = ({
  value,
  onChange,
  error = '',
  setError = () => {},
  suggestions = [],
  setSuggestions = null,
  placeholder = "Enter email address",
  readOnly = false,
  disabled = false,
  required = true,
  domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"],
  className = "",
  errorMessages = {},
  onValidEmail = null,
  role = '',
  ...props
}) => {
  const roleColors = role ? getRoleColors(role, !!value && value.trim().length > 0) : getDefaultRoleColors();
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Debounce validation (better UX)
  const validateInput = useCallback(
    (val: string) => {
      handleEmailChange(val, onChange, setError, setSuggestions || undefined);
      if (onValidEmail && isValidEmail(val)) {
        onValidEmail(val);
      }
    },
    [onChange, setError, setSuggestions, onValidEmail]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const chosen = suggestions[highlightIndex];
      handleEmailChange(chosen, onChange, setError, setSuggestions || undefined);
      setHighlightIndex(-1);
    }
    if (e.key === "Escape") {
      if (setSuggestions) setSuggestions([]);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        name="email"
        id="email"
        autoComplete="email"
        required={required}
        disabled={disabled}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        {...(error ? { 'aria-invalid': true } : { 'aria-invalid': false })}
        {...(error ? { 'aria-describedby': "email-error" } : {})}
        onChange={(e) => validateInput(e.target.value)}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          if (target.value.includes(" ")) {
            target.value = target.value.replace(/\s+/g, "");
          }
        }}
        onKeyDown={handleKeyDown}
        className={`appearance-none block w-full pl-3 pr-10 py-2 border rounded-md placeholder-gray-400 text-gray-900 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && value.trim().length > 0 && isValidEmail(value)
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
          <FaEnvelope className={`h-4 w-4 ${roleColors.icon}`} aria-hidden="true" />
        </div>
      )}

      {/* Suggestions Dropdown */}
      {setSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                highlightIndex === idx
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900 hover:bg-blue-50 hover:text-blue-700"
              }`}
              onClick={() => {
                handleEmailChange(
                  suggestion,
                  onChange,
                  setError,
                  setSuggestions || undefined
                );
                setHighlightIndex(-1);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p id="email-error" className="text-red-500 text-xs mt-1">
          {errorMessages[error] || error}
        </p>
      )}
    </div>
  );
};

export default EmailValidationInput;
