"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaExclamationCircle, FaBuilding, FaHome, FaHotel, FaCity, FaBed, FaKey } from "react-icons/fa";

interface BusinessTypeValidationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  role: "admin" | "owner" | "user";
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const BusinessTypeValidationInput: React.FC<BusinessTypeValidationInputProps> = ({
  value,
  onChange,
  error,
  role,
  required = false,
  disabled = false,
  className = "",
  placeholder = "Select Business Type"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const businessTypeOptions = [
    { value: "PG", label: "PG (Paying Guest)", symbol: FaHome },
    { value: "Room", label: "Room & Flat Rental", symbol: FaKey },
    { value: "Hostel", label: "Hostel", symbol: FaBed },
    { value: "Rental", label: "Rental Property", symbol: FaCity },
    { value: "Hotel", label: "Hotel/Lodge", symbol: FaHotel }
  ];

  const selectedBusinessType = businessTypeOptions.find(option => option.value === value);

  const getBusinessTypeColor = (businessValue: string) => {
    switch (businessValue) {
      case "PG":
        return "bg-blue-500 text-white";
      case "Room":
        return "bg-indigo-500 text-white";
      case "Hostel":
        return "bg-green-500 text-white";
      case "Rental":
        return "bg-orange-500 text-white";
      case "Hotel":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Custom Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full text-left pl-3 pr-10 py-2 border rounded-md text-gray-900 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && value.trim().length > 0
            ? `border-${role === 'owner' ? 'green' : 'blue'}-500 focus:ring-${role === 'owner' ? 'green' : 'blue'}-500 focus:border-${role === 'owner' ? 'green' : 'blue'}-500`
            : "border-gray-300 focus:ring-gray-500 focus:border-gray-400"
        } ${className}`}
        {...(isOpen ? { 'aria-expanded': true } : { 'aria-expanded': false })}
        aria-haspopup="listbox"
        {...(error ? { 'aria-invalid': true } : { 'aria-invalid': false })}
        {...(error ? { 'aria-describedby': "business-type-error" } : {})}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value ? businessTypeOptions.find(opt => opt.value === value)?.label : placeholder}
        </span>
      </button>

      {/* Business Type Icon - Right Side */}
      {!error && (
        <div className={`absolute right-10 top-2.5 h-6 w-6 ${
          selectedBusinessType ? getBusinessTypeColor(value) : 'bg-gray-200'
        } rounded-full flex items-center justify-center pointer-events-none`}>
          {selectedBusinessType ? (
            <selectedBusinessType.symbol className="text-sm" aria-hidden="true" />
          ) : (
            <FaBuilding className="text-xs text-gray-400" aria-hidden="true" />
          )}
        </div>
      )}

      {/* Custom Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0.5 right-0.5 bg-gray-900/5 backdrop-blur-md border border-gray-300/5 rounded-lg shadow-lg z-50 max-h-40 overflow-auto transition-all duration-200">
          {businessTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-900 hover:bg-gray-200/20 focus:bg-gray-200/20 focus:outline-none transition-colors duration-150 border-b border-gray-300/10 last:border-b-0"
            >
              {/* Option Icon */}
              <div className={`h-5 w-5 ${getBusinessTypeColor(option.value)} rounded-full flex items-center justify-center flex-shrink-0`}>
                <option.symbol className="text-xs" aria-hidden="true" />
              </div>
              {/* Option Label */}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Custom Dropdown Arrow (hidden when error) */}
      {!error && (
        <div className="absolute right-3 top-2.5 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Error Icon */}
      {error && (
        <FaExclamationCircle
          className="absolute right-3 top-2.5 h-6 w-6 text-red-500"
          aria-hidden="true"
        />
      )}

      {/* Error Message */}
      {error && (
        <p id="business-type-error" className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default BusinessTypeValidationInput;
