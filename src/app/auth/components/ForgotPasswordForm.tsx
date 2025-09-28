"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { FaUser, FaLock, FaUserTie, FaUserShield, FaCheckCircle, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import PasswordValidationInput from '../../../components/validation/PasswordValidationInput';
import EmailValidationInput from '../../../components/validation/EmailValidationInput';
import OtpInput from '../../../components/validation/OtpInput';
import { authService } from '../../../services/authService';
import { isValidEmail } from '../../../utils/validation/emailValidation';
import { isValidOtp, getOtpValidationError } from '../../../utils/validation/otpValidation';
import { getMaxResendAttempts, getMaxOtpAttempts, getRoleMessages } from '../../../utils/otpConfig';

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Role detection state
  const [detectedRole, setDetectedRole] = useState<string>('');
  
  // Function to detect role from email domain
  const detectRoleFromEmail = (email: string): string => {
    if (!email || email.length < 3) return '';
    
    const emailLower = email.toLowerCase();
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Admin detection - check both email content and domain
    if (emailLower.includes('admin') || (domain && domain.includes('admin'))) {
      return 'admin';
    }
    
    // Owner detection - check for business/owner keywords
    if (emailLower.includes('owner') || emailLower.includes('business') || 
        emailLower.includes('company') || emailLower.includes('manager') ||
        (domain && (domain.includes('owner') || domain.includes('business') || domain.includes('company')))) {
      return 'owner';
    }
    
    // If it's a common user domain or no specific keywords, treat as user
    return 'user';
  };

  // Initial role detection from URL
  const urlRole = (() => {
    // Check pathname first for route-based role detection
    if (pathname.includes('/owner/')) {
      return 'owner';
    }
    if (pathname.includes('/user/')) {
      return 'user';
    }
    if (pathname.includes('/admin/')) {
      return 'admin';
    }
    // Fallback to URL params, default to 'user'
    const urlRoleParam = searchParams.get('role');
    return urlRoleParam || 'user';
  })();

  // Final role - use detected role from email if available, otherwise URL role
  // But don't change role if we're on a URL with role parameter
  const role = (() => {
    // If URL has role parameter, stick to that role regardless of email
    const urlRoleParam = searchParams.get('role');
    if (urlRoleParam || pathname.includes('/owner/') || pathname.includes('/user/') || pathname.includes('/admin/')) {
      return urlRole;
    }
    // Otherwise, allow email-based detection for generic pages
    return detectedRole || urlRole;
  })();

  // Form states exactly like old frontend
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showOtpError, setShowOtpError] = useState(false); // Controls error/timer display
  const [otpSuccess, setOtpSuccess] = useState(''); // For OTP send success message
  const [otpVerifySuccess, setOtpVerifySuccess] = useState(''); // For OTP verification success
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [otpCreatedAt, setOtpCreatedAt] = useState<number | null>(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [otpErrorTrigger, setOtpErrorTrigger] = useState(0);
  // Resend count tracking
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [emailError, setEmailError] = useState(''); // Email validation error
  
  // Password validation errors - exactly like register form
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Email suggestions
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);

  // OTP Timer countdown - exactly like old frontend
  useEffect(() => {
    // Set dynamic page title based on role
    document.title = `${role === 'owner' ? 'Owner' : role === 'admin' ? 'Admin' : 'User'} Forgot Password | PG & Room Rental`;
    
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => {
          if (timer <= 1) {
            setCanResend(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Hide body scrollbar on component mount
  useEffect(() => {
    // Hide body overflow
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  // Step 1: Send OTP - using authService
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !isValidEmail(formData.email)) {
      // Toast removed - user will see inline validation
      return;
    }

    setLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setFormData(prev => ({ ...prev, otp: '' }));
    try {
      await authService.forgotPassword(formData.email, role);
      
      setOtpSuccess('OTP sent successfully to your email!');
      // Toast removed - success message shown in UI
      setCurrentStep(2);
      setResendTimer(60);
      setCanResend(false);
      setOtpCreatedAt(Date.now());
      setOtpAttempts(0);
    } catch (error: any) {
      setOtpError(error.message || 'Failed to send OTP');
      // Toast removed - error shown in UI
    } finally {
      setLoading(false);
    }
  };

  // OTP Error Handling Functions - exactly like old frontend
  const getOtpErrorMessage = (errorMessage: string) => {
    if (!errorMessage) return '';
    
    const message = errorMessage.toLowerCase();
    
    if (message.includes('invalid')) {
      return 'Invalid OTP - Please check and enter the correct OTP';
    } else if (message.includes('expired')) {
      return 'OTP Expired - Please request a new OTP to continue';
    } else if (message.includes('used') || message.includes('already')) {
      return 'OTP Already Used - Please request a new OTP';
    } else if (message.includes('network')) {
      return 'Network Error - Please check your connection and try again';
    } else {
      return errorMessage;
    }
  };

  const handleOtpError = (errorMessage: string, showToast = true) => {
    const formattedMessage = getOtpErrorMessage(errorMessage);
    setOtpError(formattedMessage);
    setShowOtpError(true);
    if (showToast) {
      // Toast removed - error shown in OTP component
    }
    // Hide error after 1.2s for input box red, but error message box will show 5s in OtpInput
    setTimeout(() => {
      setShowOtpError(false);
    }, 1200);
  };

  // Step 2: Verify OTP - Enhanced with proper attempt tracking
  const handleVerifyOtp = async (e: React.FormEvent | null, otpOverride?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const otpToCheck = otpOverride || formData.otp;
    
    // Check if OTP is disabled due to max attempts
    if (otpDisabled) {
      const roleMessages = getRoleMessages(role as 'user' | 'owner' | 'admin');
      setOtpError(roleMessages.maxAttemptsReached);
      setShowOtpError(true);
      return;
    }
    
    // Basic format validation
    if (!isValidOtp(otpToCheck, 6)) {
      const error = getOtpValidationError(otpToCheck, { length: 6 });
      setOtpError(error || 'Please enter a valid 6-digit OTP');
      setShowOtpError(true);
      setOtpErrorTrigger(prev => prev + 1); // Increment to trigger new error in OtpInput
      return;
    }

    setLoading(true);
    setOtpError('');
    setShowOtpError(false);
    
    try {
      const cleanOtp = otpToCheck.replace(/\s/g, '');
      
      // Use the same endpoint as old frontend - /api/otp/verify-otp
      const response = await authService.verifyForgotPasswordOtp({
        email: formData.email,
        otp: cleanOtp,
        role: role
      });

      if (response.success) {
        setOtpVerifySuccess('OTP verified successfully!');
        // Reset all OTP states on successful verification
        setOtpAttempts(0);
        setOtpDisabled(false);
        setResendCount(0);
        setResendDisabled(false);
        setTimeout(() => {
          setCurrentStep(3);
        }, 1000);
      } else {
        // Enhanced attempt tracking
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        
        // Check max attempts using otpConfig
        const maxAttempts = getMaxOtpAttempts(role as 'user' | 'owner' | 'admin');
        const remainingAttempts = maxAttempts - newAttempts;
        
        if (newAttempts >= maxAttempts) {
          // Max attempts reached
          setOtpDisabled(true);
          setOtpError(`Maximum ${maxAttempts} attempts reached. Please request a new OTP.`);
          setShowOtpError(true);
          // Toast removed - message already shown in OTP component
        } else {
          // Still have attempts left
          setOtpError(`Invalid OTP. ${remainingAttempts} attempts remaining.`);
          setShowOtpError(true);
        }
        
        setOtpErrorTrigger(prev => prev + 1); // Increment to trigger new error in OtpInput
      }
    } catch (error: any) {
      // Enhanced attempt tracking for network errors
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      
      // Check max attempts using otpConfig
      const maxAttempts = getMaxOtpAttempts(role as 'user' | 'owner' | 'admin');
      const remainingAttempts = maxAttempts - newAttempts;
      
      console.error('OTP verification error:', error);
      
      let errorMsg = 'Network error. Please try again.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      if (newAttempts >= maxAttempts) {
        // Max attempts reached
        setOtpDisabled(true);
        setOtpError(`Maximum ${maxAttempts} attempts reached. Please request a new OTP.`);
        setShowOtpError(true);
        // Toast removed - message already shown in OTP component
      } else {
        // Still have attempts left
        setOtpError(`${errorMsg} ${remainingAttempts} attempts remaining.`);
        setShowOtpError(true);
      }
      
      setOtpErrorTrigger(prev => prev + 1); // Increment to trigger new error in OtpInput
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password - using authService
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password fields using the same logic as register form
    if (!formData.newPassword || formData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    if (!formData.confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    // Check if there are any validation errors
    if (passwordError || confirmPasswordError) {
      // Toast removed - validation errors shown inline
      return;
    }

    setLoading(true);
    
    try {
      const cleanOtp = formData.otp.replace(/\s/g, '');
      const data = await authService.resetPassword(formData.email, cleanOtp, formData.newPassword, role);
      
      if (data.success) {
        // Toast removed - success message will be shown via UI feedback
        
        // Role-based redirect after password reset
        setTimeout(() => {
          const redirectUrl = role === 'admin'
            ? '/admin/login'
            : role === 'owner' 
            ? '/auth/login?role=owner' 
            : '/auth/login?role=user';
          router.push(redirectUrl);
        }, 2000);
      } else {
        // Handle specific error cases
        if (data.message?.includes('Invalid OTP')) {
          setOtpError('Invalid OTP. Please check and try again.');
          setShowOtpError(true);
          setCurrentStep(2); // Go back to OTP step
        } else if (data.message?.includes('OTP expired')) {
          setOtpError('OTP expired. Please resend.');
          setShowOtpError(true);
          setCurrentStep(2); // Go back to OTP step
        } else {
          // Toast removed - error will be shown in UI
        }
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to reset password';
      
      // Handle specific error cases
      if (errorMsg.includes('Invalid OTP')) {
        setOtpError('Invalid OTP. Please check and try again.');
        setShowOtpError(true);
        setCurrentStep(2); // Go back to OTP step
      } else if (errorMsg.includes('OTP expired')) {
        setOtpError('OTP expired. Please resend.');
        setShowOtpError(true);
        setCurrentStep(2); // Go back to OTP step
      } else {
        // Toast removed - error will be shown in UI
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP - using authService
  const handleResendOtp = async () => {
    if (!canResend || resendDisabled) return;
    
    // Check resend limit
    const maxResends = getMaxResendAttempts(role as 'user' | 'owner' | 'admin');
    if (resendCount >= maxResends) {
      // Toast removed - limit message will be shown in UI
      setResendDisabled(true);
      return;
    }
    
    setLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setFormData(prev => ({ ...prev, otp: '' }));
    try {
      await authService.forgotPassword(formData.email, role);
      
      // Increment resend count
      const newResendCount = resendCount + 1;
      setResendCount(newResendCount);
      
      // Check if this was the last allowed resend
      if (newResendCount >= maxResends) {
        setResendDisabled(true);
        setOtpSuccess('OTP resent successfully! (Last resend - refresh page for more)');
        // Toast removed - success message shown in UI
      } else {
        setOtpSuccess(`OTP resent successfully! (${maxResends - newResendCount} resends left)`);
        // Toast removed - success message shown in UI
      }
      
      setResendTimer(60);
      setCanResend(false);
      setOtpCreatedAt(Date.now());
      setOtpAttempts(0);
      setOtpDisabled(false);
    } catch (error: any) {
      handleOtpError(error.message || 'Failed to resend OTP', false); // No toast for forgot password
    } finally {
      setLoading(false);
    }
  };

  // Step indicator exactly like old frontend
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Email' },
      { number: 2, label: 'OTP' },
      { number: 3, label: 'Password' }
    ];

    const themeColor = role === 'admin' ? 'red' : role === 'owner' ? 'green' : 'blue';

    return (
      <div className="flex items-center justify-center space-x-2 mb-4 w-full">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step.number 
                    ? `bg-${themeColor}-600 text-white` 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-xs font-medium ${
                  currentStep === step.number 
                    ? `text-${themeColor}-600 font-bold` 
                    : currentStep > step.number 
                    ? 'text-gray-700' 
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center">
                  <span className={`text-lg font-bold ${
                    currentStep > step.number ? `text-${themeColor}-600` : 'text-gray-400'
                  }`}>
                    →
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Helper for role-based color and icon - exactly like old frontend
  const bgColor = role === 'admin' 
    ? 'bg-red-50' 
    : role === 'owner' 
    ? 'bg-green-50' 
    : 'bg-blue-50';

  return (
    <>
      {/* Fixed scroll lock and centered layout */}
      {/* Toaster removed - no toast messages needed */}
      <div className={`h-screen w-screen fixed inset-0 flex items-center justify-center overflow-hidden pt-16 ${bgColor}`}>
        <div className="w-full max-w-md mx-auto px-4">
          <div className={`p-6 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl overflow-visible ${
            role === 'admin'
              ? 'bg-gradient-to-br from-red-50 via-white to-red-100'
              : role === 'owner'
              ? 'bg-gradient-to-br from-green-50 via-white to-green-100'
              : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
          }`}>
            
            {/* Role Icon - Inside Card */}
            <div className="text-center mb-4">
              <div className={`mx-auto w-16 h-16 ${
                role === 'admin' 
                  ? 'bg-red-50 border-red-200' 
                  : role === 'owner' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              } border-2 rounded-full flex items-center justify-center shadow-lg`}>
                <div className={`${
                  role === 'admin' ? 'text-red-600' : role === 'owner' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  <div className="w-10 h-10 rounded-full bg-current p-2 flex items-center justify-center">
                    {role === 'admin' ? (
                      <FaUserShield className="w-6 h-6 text-white" />
                    ) : role === 'user' ? (
                      <FaUser className="w-6 h-6 text-white" />
                    ) : (
                      <FaUserTie className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <h3 className="mt-2 text-center text-lg font-medium text-gray-700">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </h3>
              <h2 className="text-center text-2xl font-extrabold text-gray-900">
                Reset Password
              </h2>
              <p className="text-center text-sm text-gray-600">
                {currentStep === 1 && 'Enter your email to receive reset instructions'}
                {currentStep === 2 && 'Verify your identity with OTP'}
                {currentStep === 3 && 'Create your new secure password'}
              </p>
            </div>
            
            {/* Step Indicator */}
            {renderStepIndicator()}
            
            {/* Step 1: Email Input */}
            {currentStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4 overflow-visible">
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Email Address <span className="text-red-500">*</span>
                  </label>
                  <EmailValidationInput
                    value={formData.email}
                    onChange={val => {
                      setFormData(prev => ({ ...prev, email: val }));
                      // Only detect role from email if there's no URL role parameter
                      // This prevents role changes when URL explicitly specifies a role
                      const urlRoleParam = searchParams.get('role');
                      if (!urlRoleParam && !pathname.includes('/owner/') && !pathname.includes('/user/') && !pathname.includes('/admin/')) {
                        const emailRole = detectRoleFromEmail(val);
                        setDetectedRole(emailRole);
                      }
                    }}
                    error={emailError}
                    setError={setEmailError}
                    suggestions={emailSuggestions}
                    setSuggestions={setEmailSuggestions}
                    required
                    disabled={loading}
                    className={emailError ? 'border-red-500' : ''}
                    placeholder={`Enter your ${role} email address`}
                  />
                  {/* Error message is now handled only by EmailValidationInput */}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || !formData.email || !isValidEmail(formData.email) || !!emailError}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                      role === 'admin' 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                        : role === 'owner' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                    } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Reset OTP...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaLock className="h-4 w-4" />
                        <span>Send OTP</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {/* OTP Sent Success Message */}
                <div className={`p-2 ${
                  role === 'admin' 
                    ? 'bg-red-50 border-red-200' 
                    : role === 'owner' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                } border rounded-lg`}>
                  <div className="flex items-center">
                    <FaCheckCircle className={`h-4 w-4 ${
                      role === 'admin' ? 'text-red-500' : role === 'owner' ? 'text-green-500' : 'text-blue-500'
                    } mr-2 flex-shrink-0`} />
                    <div>
                      <p className={`text-xs font-medium ${
                        role === 'admin' ? 'text-red-800' : role === 'owner' ? 'text-green-800' : 'text-blue-800'
                      }`}>
                        Password reset OTP sent successfully!
                      </p>
                      <p className={`text-xs ${
                        role === 'admin' ? 'text-red-600' : role === 'owner' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        Check email <strong>{formData.email}</strong> for OTP.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={(e) => handleVerifyOtp(e)} className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 text-center">Enter Reset OTP</label>
                    <OtpInput
                      value={formData.otp}
                      onChange={otp => {
                        setOtpVerifySuccess(''); // Clear verify success on change
                        setFormData(prev => ({ ...prev, otp }));
                        if (showOtpError) setShowOtpError(false);
                      }}
                      onVerify={(otpValue) => {
                        // Real-time verification when all digits entered
                        if (
                          otpValue.length === 6 &&
                          !loading &&
                          otpValue !== lastVerifiedOtp
                        ) {
                          setLastVerifiedOtp(otpValue);
                          setOtpVerifySuccess(''); // Clear verify success before new verification
                          handleVerifyOtp(null, otpValue);
                        }
                      }}
                      onComplete={otpValue => {
                        // Called when all digits filled (before onVerify)
                        console.log('OTP completed:', otpValue);
                      }}
                      length={6}
                      error={!!(showOtpError && otpError)}
                      success={!!otpVerifySuccess} // Use otpVerifySuccess instead of otpSuccess
                      loading={loading}
                      statusMessage={
                        showOtpError && otpError
                          ? otpError
                          : otpVerifySuccess
                          ? otpVerifySuccess
                          : ''
                      }
                      statusType={
                        showOtpError && otpError
                          ? 'error'
                          : otpVerifySuccess
                          ? 'success'
                          : ''
                      }
                      statusBoxColor={{
                        bg: showOtpError && otpError 
                          ? 'bg-red-50' 
                          : otpVerifySuccess 
                          ? 'bg-green-50' 
                          : '',
                        border: showOtpError && otpError 
                          ? 'border border-red-200' 
                          : otpVerifySuccess 
                          ? 'border border-green-200' 
                          : '',
                        text: showOtpError && otpError 
                          ? 'text-red-600' 
                          : otpVerifySuccess 
                          ? 'text-green-600' 
                          : ''
                      }}
                      errorHighlightDuration={1200}
                      errorMessageDuration={5000}
                      otpCreatedAt={otpCreatedAt}
                      expirySeconds={300} // 5 minutes
                      autoClearOnError={true}
                      disableOnError={true}
                      hideDigitsOnError={true}
                      autoSubmitOnComplete={false}
                      allowAlphanumeric={false}
                      placeholder="●"
                      direction="ltr"
                      role={role as 'user' | 'owner' | 'admin'}
                      focusOnErrorTrigger={showOtpError}
                      errorTrigger={otpErrorTrigger}
                      disabled={otpDisabled}
                      hideTimerOnMaxAttempts={otpDisabled}
                    />
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">
                        Didn't receive the reset code?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend || loading || resendDisabled}
                        className={`text-sm font-medium underline ${
                          canResend && !resendDisabled
                            ? `${
                                role === 'admin' ? 'text-red-600 hover:text-red-800' : 
                                role === 'owner' ? 'text-green-600 hover:text-green-800' : 
                                'text-blue-600 hover:text-blue-800'
                              } cursor-pointer` 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {resendDisabled 
                          ? 'Refresh page for more resends'
                          : canResend 
                          ? `Resend Reset OTP (${getMaxResendAttempts(role as 'user' | 'owner' | 'admin') - resendCount} left)` 
                          : `Resend in ${resendTimer}s`}
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading || formData.otp.length !== 6}
                      className={`w-full flex justify-center py-3 px-5 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-colors duration-200 ${
                        role === 'admin' 
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                          : role === 'owner' 
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                      } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Verifying OTP...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-4 w-4" />
                          <span>Verify OTP</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: New Password - Using reusable PasswordValidationInput */}
            {currentStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordValidationInput
                      value={formData.newPassword}
                      onChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
                      error={passwordError}
                      setError={setPasswordError}
                      role={role}
                      showStrengthIndicator={true}
                      tooltipPosition="right"
                      required
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordValidationInput
                      value={formData.confirmPassword}
                      onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                      error={confirmPasswordError}
                      setError={setConfirmPasswordError}
                      role={role}
                      isConfirmField={true}
                      confirmPassword={formData.newPassword}
                      required
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || !!passwordError || !!confirmPasswordError}
                    className={`w-full flex justify-center py-3 px-5 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-colors duration-200 ${
                      role === 'admin' 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                        : role === 'owner' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                    } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaLock className="h-4 w-4" />
                        <span>Reset Password</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Links */}
            <div className="flex flex-col items-center justify-center space-y-2 text-sm mt-3">
              <div className="text-gray-600">
                Remember your password?{' '}
                <button
                  onClick={() => {
                    const loginUrl = role === 'admin'
                      ? '/admin/login'
                      : role === 'owner' 
                      ? '/auth/login?role=owner' 
                      : '/auth/login?role=user';
                    router.push(loginUrl);
                  }}
                  className={`${
                    role === 'admin' ? 'text-red-600' : role === 'owner' ? 'text-green-600' : 'text-blue-600'
                  } hover:opacity-80 font-medium underline`}
                >
                  Back to Login
                </button>
              </div>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 inline-flex items-center cursor-pointer"
              >
                <FaHome className="w-3 h-3 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
