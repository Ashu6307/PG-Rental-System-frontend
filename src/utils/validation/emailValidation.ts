// Email validation utility functions for Next.js

/**
 * Email validation rules and patterns
 */
const EMAIL_RULES = {
  minLength: 5,
  maxLength: 254, // RFC 5321 standard
  localPartMaxLength: 64, // Part before @
  domainMaxLength: 253, // Part after @
  allowedSpecialChars: ['.', '_', '-', '+'], // Allowed special characters in local part
  // Common email domains for suggestions
  commonDomains: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'ymail.com', 'live.com']
};

/**
 * Comprehensive email validation regex
 * Supports most valid email formats according to RFC 5322
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates email format and rules
 * @param email - The email to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const trimmedEmail = email.trim().toLowerCase();
  // Disallow spaces in email
  if (trimmedEmail.includes(' ')) {
    return false;
  }
  
  // Check length constraints
  if (trimmedEmail.length < EMAIL_RULES.minLength || trimmedEmail.length > EMAIL_RULES.maxLength) {
    return false;
  }
  
  // Check basic regex pattern
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return false;
  }
  
  // Split email into local and domain parts
  const emailParts = trimmedEmail.split('@');
  if (emailParts.length !== 2) return false;
  
  const [localPart, domainPart] = emailParts;
  
  // Check local part (before @)
  if (localPart.length === 0 || localPart.length > EMAIL_RULES.localPartMaxLength) {
    return false;
  }
  
  // Check domain part (after @)
  if (domainPart.length === 0 || domainPart.length > EMAIL_RULES.domainMaxLength) {
    return false;
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  // Check if starts or ends with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  // Check domain has at least one dot
  if (!domainPart.includes('.')) {
    return false;
  }
  
  return true;
};

/**
 * Gets detailed email validation error message
 * @param email - The email to validate
 * @returns Error message or empty string if valid
 */
export const getEmailValidationError = (email: string, checkRequired: boolean = false): string => {
  if (!email || !email.trim()) {
    return checkRequired ? 'Email is required' : '';
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  // Disallow spaces in email
  if (trimmedEmail.includes(' ')) {
    return 'Email cannot contain spaces';
  }
  
  // Length validations
  if (trimmedEmail.length < EMAIL_RULES.minLength) {
    return 'Email is too short (minimum 5 characters)';
  }
  
  if (trimmedEmail.length > EMAIL_RULES.maxLength) {
    return 'Email is too long (maximum 254 characters)';
  }
  
  // Check if contains @
  if (!trimmedEmail.includes('@')) {
    return 'Email must contain @ symbol';
  }
  
  // Check multiple @ symbols
  const atCount = (trimmedEmail.match(/@/g) || []).length;
  if (atCount !== 1) {
    return 'Email must contain exactly one @ symbol';
  }
  
  const emailParts = trimmedEmail.split('@');
  const [localPart, domainPart] = emailParts;
  
  // Local part validations
  if (localPart.length === 0) {
    return 'Email must have text before @ symbol';
  }
  
  if (localPart.length > EMAIL_RULES.localPartMaxLength) {
    return 'Text before @ is too long (maximum 64 characters)';
  }
  
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'Email cannot start or end with a dot before @';
  }
  
  // Domain part validations
  if (domainPart.length === 0) {
    return 'Email must have domain after @ symbol';
  }
  
  if (domainPart.length > EMAIL_RULES.domainMaxLength) {
    return 'Domain part is too long (maximum 253 characters)';
  }
  
  if (!domainPart.includes('.')) {
    return 'Domain must contain at least one dot';
  }
  
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return 'Domain cannot start or end with a dot';
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return 'Email cannot contain consecutive dots';
  }
  
  // Check invalid characters
  const validCharsRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validCharsRegex.test(trimmedEmail)) {
    return 'Email contains invalid characters';
  }
  
  // Check domain extension
  const domainParts = domainPart.split('.');
  const extension = domainParts[domainParts.length - 1];
  if (extension.length < 2) {
    return 'Domain extension must be at least 2 characters';
  }
  
  return '';
};

/**
 * Filters and formats email input in real-time
 * Converts to lowercase, removes invalid characters
 * @param input - The email input to filter
 * @returns Filtered and formatted email
 */
export const filterEmailInput = (input: string): string => {
  if (!input) return '';
  
  // Convert to lowercase immediately
  let filtered = input.toLowerCase();

  // Remove all spaces
  filtered = filtered.replace(/\s+/g, '');

  // Remove any characters that are not allowed in email
  // Allow: letters, numbers, dots, underscore, hyphen, plus, @
  filtered = filtered.replace(/[^a-z0-9._%+-@]/g, '');
  
  // Prevent multiple @ symbols
  const atParts = filtered.split('@');
  if (atParts.length > 2) {
    filtered = atParts[0] + '@' + atParts.slice(1).join('');
  }
  
  // Prevent consecutive dots
  filtered = filtered.replace(/\.{2,}/g, '.');
  
  // Prevent starting with dot (except after @)
  if (filtered.startsWith('.')) {
    filtered = filtered.substring(1);
  }
  
  return filtered;
};

/**
 * Generates email domain suggestions
 * @param email - Current email input
 * @returns Array of suggested email addresses
 */
export const generateEmailSuggestions = (email: string): string[] => {
  if (!email || !email.includes('@')) return [];
  
  const emailParts = email.toLowerCase().split('@');
  if (emailParts.length !== 2) return [];
  
  const [localPart, domainInput] = emailParts;
  if (!localPart || !domainInput) return [];
  
  // Find matching domains
  const suggestions = EMAIL_RULES.commonDomains
    .filter(domain => domain.startsWith(domainInput) && domain !== domainInput)
    .slice(0, 3)
    .map(domain => `${localPart}@${domain}`);
  
  return suggestions;
};

/**
 * Handles email input change with real-time validation and formatting
 * @param value - Input value
 * @param setter - State setter function
 * @param errorSetter - Error state setter function
 * @param suggestionSetter - Suggestion setter function (optional)
 * @returns Processed value
 */
export const handleEmailChange = (
  value: string, 
  setter: (value: string) => void, 
  errorSetter?: (error: string) => void, 
  suggestionSetter?: (suggestions: string[]) => void,
  checkRequired: boolean = false
): string => {
  // First filter and format the input
  const filteredValue = filterEmailInput(value);
  
  // Set the filtered value
  setter(filteredValue);
  
  // Validate and set error if needed
  const error = getEmailValidationError(filteredValue, checkRequired);
  if (errorSetter) {
    errorSetter(error);
  }
  
  // Generate suggestions if function provided
  if (suggestionSetter) {
    const suggestions = generateEmailSuggestions(filteredValue);
    suggestionSetter(suggestions);
  }
  
  return filteredValue;
};
