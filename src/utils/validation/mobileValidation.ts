// Simple Indian Mobile Number Validation Utility (10 digits only)

/**
 * Validates Indian mobile number format
 * @param mobile - Mobile number to validate
 * @returns True if valid Indian mobile, false otherwise
 */
export const validateIndianMobile = (mobile: string): boolean => {
  if (!mobile) return false;
  
  // Simple 10-digit validation starting with 6-9
  return /^[6-9]\d{9}$/.test(mobile);
};

/**
 * Format phone number for display (only digits, max 10)
 * @param value - Input value to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  // If more than 10 digits, take last 10 (to handle country code, etc)
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
};

/**
 * Get normalized mobile number (same as input for 10-digit)
 * @param mobile - Mobile number to normalize
 * @returns Normalized mobile number
 */
export const getNormalizedMobile = (mobile: string): string => {
  if (!mobile) return '';
  
  // Return only digits, max 10
  const digits = mobile.replace(/\D/g, '');
  return digits.slice(0, 10);
};

/**
 * Check if mobile number is valid Indian format (10 digits, starts with 6-9)
 * @param mobile - Mobile number to validate
 * @returns True if valid Indian mobile format
 */
export const isValidIndianMobile = (mobile: string): boolean => {
  if (!mobile) return false;
  const cleaned = mobile.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
};

/**
 * Get mobile validation error message
 * @param mobile - Mobile number to validate
 * @returns Error message or empty string if valid
 */
export const getMobileValidationError = (mobile: string, checkRequired: boolean = false): string => {
  if (!mobile || !mobile.trim()) {
    return checkRequired ? 'Mobile number is required' : '';
  }
  
  const digits = mobile.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return 'Please enter a valid mobile number';
  }
  
  if (digits.length < 10) {
    return 'Mobile number must be 10 digits';
  }
  
  if (digits.length > 10) {
    return 'Mobile number cannot exceed 10 digits';
  }
  
  if (!/^[6-9]/.test(digits)) {
    return 'Mobile number must start with 6, 7, 8, or 9';
  }
  
  return '';
};
