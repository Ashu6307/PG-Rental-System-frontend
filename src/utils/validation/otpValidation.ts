// OTP Validation Utility
// Usage: import { isValidOtp, isOtpExpired, isOtpUsed, getOtpValidationError } from './otpValidation';

/**
 * Check if OTP is valid (digits or alphanumeric, correct length)
 * @param otp - OTP string to validate
 * @param length - Expected OTP length (default: 6)
 * @param options - Validation options
 * @returns True if valid OTP format
 */
export function isValidOtp(otp: string, length: number = 6, { alphanumeric = false } = {}): boolean {
  if (typeof otp !== 'string' || otp.length !== length) return false;
  return alphanumeric ? /^[a-zA-Z0-9]+$/.test(otp) : /^\d+$/.test(otp);
}

/**
 * Check if OTP is expired (createdAt: Date or timestamp, expirySeconds: number)
 * @param createdAt - When OTP was created (Date or timestamp)
 * @param expirySeconds - OTP validity duration in seconds (default: 300 = 5 minutes)
 * @returns True if OTP is expired
 */
export function isOtpExpired(createdAt: Date | number, expirySeconds: number = 300): boolean {
  if (!createdAt) return true;
  const created = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
  const now = Date.now();
  return now - created > expirySeconds * 1000;
}

/**
 * Get time remaining before OTP expires (in seconds)
 * @param createdAt - When OTP was created
 * @param expirySeconds - OTP validity duration in seconds
 * @returns Remaining time in seconds
 */
export function getOtpTimeRemaining(createdAt: Date | number, expirySeconds: number = 300): number {
  if (!createdAt) return 0;
  const created = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
  const now = Date.now();
  const remaining = expirySeconds - Math.floor((now - created) / 1000);
  return Math.max(0, remaining);
}

/**
 * Check if OTP is already used
 * @param used - OTP usage status
 * @returns True if OTP is already used
 */
export function isOtpUsed(used: boolean | string): boolean {
  return used === true || used === 'used';
}

interface OtpValidationOptions {
  createdAt?: Date | number;
  expirySeconds?: number;
  used?: boolean | string;
  length?: number;
  alphanumeric?: boolean;
  attempts?: number;
  maxAttempts?: number;
  customMessages?: {
    attempts?: string;
    format?: string;
    expired?: string;
    used?: string;
  };
}

/**
 * Get OTP validation error message
 * @param otp - OTP to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 */
export function getOtpValidationError(
  otp: string,
  {
    createdAt,
    expirySeconds = 300,
    used = false,
    length = 6,
    alphanumeric = false,
    attempts = 0,
    maxAttempts = 6, // Updated default to be more user-friendly
    customMessages = {}
  }: OtpValidationOptions = {}
): string | null {
  if (attempts >= maxAttempts) return customMessages.attempts || `Too many invalid attempts. Please request a new OTP.`;
  if (!isValidOtp(otp, length, { alphanumeric }))
    return customMessages.format || `OTP must be a ${length}-digit${alphanumeric ? ' (alphanumeric)' : ''} code`;
  if (createdAt && isOtpExpired(createdAt, expirySeconds))
    return customMessages.expired || 'OTP has expired';
  if (isOtpUsed(used))
    return customMessages.used || 'OTP has already been used';
  return null;
}

/**
 * Helper: Format seconds to mm:ss for UI
 * @param seconds - Seconds to format
 * @returns Formatted time string (mm:ss)
 */
export function formatOtpTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
