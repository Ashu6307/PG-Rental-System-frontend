export type UserRole = 'user' | 'owner' | 'admin';

/**
 * Get maximum wrong OTP attempts before disabling input
 */
export function getMaxOtpAttempts(role: UserRole): number {
  switch (role) {
    case 'user': return 4;
    case 'owner': return 5;
    case 'admin': return 6;
    default: return 4;
  }
}

/**
 * Get maximum OTP sends per hour (rate limiting)
 */
export function getMaxOtpSendsPerHour(role: UserRole): number {
  switch (role) {
    case 'user': return 6;
    case 'owner': return 8;
    case 'admin': return 10;
    default: return 6;
  }
}

/**
 * Get maximum resend attempts per session
 */
export function getMaxResendAttempts(role: UserRole): number {
  switch (role) {
    case 'user': return 2;
    case 'owner': return 3;
    case 'admin': return 2;
    default: return 2;
  }
}

/**
 * Get OTP expiry time in seconds
 */
export function getOtpExpiryTime(role: UserRole): number {
  switch (role) {
    case 'user': return 300; // 5 minutes
    case 'owner': return 300; // 5 minutes  
    case 'admin': return 300; // 5 minutes
    default: return 300;
  }
}

/**
 * Get resend timer duration in seconds
 */
export function getResendTimer(role: UserRole): number {
  switch (role) {
    case 'user': return 60; // 1 minute
    case 'owner': return 60; // 1 minute
    case 'admin': return 60; // 1 minute
    default: return 60;
  }
}

/**
 * Get role-specific OTP messages
 */
export function getOtpMessages(role: UserRole) {
  const baseMessages = {
    maxAttemptsReached: `Maximum ${getMaxOtpAttempts(role)} attempts reached. Please request a new OTP.`,
    tooManyRequests: `Too many OTP requests. Maximum ${getMaxOtpSendsPerHour(role)} OTPs per hour allowed.`,
    maxResendsReached: `Maximum ${getMaxResendAttempts(role)} resends allowed. Please refresh the page to start over.`
  };

  switch (role) {
    case 'user':
      return {
        ...baseMessages,
        otpSent: 'User verification OTP sent to your email!',
        otpVerified: 'User email verified successfully!'
      };
    case 'owner':
      return {
        ...baseMessages,
        otpSent: 'Owner verification OTP sent to your email!',
        otpVerified: 'Owner email verified successfully!'
      };
    case 'admin':
      return {
        ...baseMessages,
        otpSent: 'Admin security OTP sent to your email!',
        otpVerified: 'Admin OTP verified successfully!'
      };
    default:
      return baseMessages;
  }
}

/**
 * Get role-specific messages (alias for getOtpMessages for compatibility)
 */
export function getRoleMessages(role: UserRole) {
  return getOtpMessages(role);
}