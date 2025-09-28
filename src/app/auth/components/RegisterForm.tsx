"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaUser, FaUserTie, FaCheckCircle, FaHome } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

// Import validation components
import EmailValidationInput from '../../../components/validation/EmailValidationInput';
import MobileValidationInput from '../../../components/validation/MobileValidationInput';
import NameValidationInput from '../../../components/validation/NameValidationInput';
import PasswordValidationInput from '../../../components/validation/PasswordValidationInput';
import GenderValidationInput from '../../../components/validation/GenderValidationInput';
import BusinessTypeValidationInput from '../../../components/validation/BusinessTypeValidationInput';
import OtpInput from '../../../components/validation/OtpInput';
import { authService } from '../../../services/authService';
import { getMaxOtpAttempts, getOtpExpiryTime, getResendTimer, getRoleMessages, getMaxResendAttempts, UserRole } from '../../../utils/otpConfig';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // State management
  const [role] = useState<'user' | 'owner'>(() => {
    // Check pathname first for route-based role detection
    if (pathname.includes('/owner/')) {
      return 'owner';
    }
    if (pathname.includes('/user/')) {
      return 'user';
    }
    // Fallback to URL params, default to 'user'
    const urlRole = searchParams.get('role');
    return urlRole === 'owner' ? 'owner' : 'user';
  });
  
  // Role-based configuration
  const maxAttempts = getMaxOtpAttempts(role as UserRole);
  const otpExpiryTime = getOtpExpiryTime(role as UserRole);
  const resendTimerDuration = getResendTimer(role as UserRole);
  const roleMessages = getRoleMessages(role as UserRole);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ownerName: '',
    businessType: '',
    gender: '' // Only for users
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Animation states
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Enhanced validation states
  const [nameError, setNameError] = useState('');
  const [ownerNameError, setOwnerNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Email suggestions and verification
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [emailVerified, setEmailVerified] = useState(false);
  
  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showOtpError, setShowOtpError] = useState(false);
  const [otpErrorTrigger, setOtpErrorTrigger] = useState(0); // Counter to trigger new errors
  const [otpSuccess, setOtpSuccess] = useState('');
  const [otpVerifySuccess, setOtpVerifySuccess] = useState('');
  const lastVerifiedOtpRef = useRef('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  
  // OTP Timer States
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [otpCreatedAt, setOtpCreatedAt] = useState<number | null>(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpDisabled, setOtpDisabled] = useState(false);
  
  // Resend counter state
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // Configure role-based colors and settings
  const roleConfig = {
    user: {
      name: 'User',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-300',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      loginLink: '/auth/login?role=user'
    },
    owner: {
      name: 'Owner',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-300',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      loginLink: '/auth/login?role=owner'
    }
  }[role];

  // COMPLETE REMOVAL OF PROBLEMATIC useEffect - Manual timer management
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startOtpTimer = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set initial timer value
    setOtpTimer(resendTimerDuration);
    setCanResendOtp(false);
    setOtpCreatedAt(Date.now());
    
    // Start countdown manually
    let currentTime = resendTimerDuration;
    timerRef.current = setInterval(() => {
      currentTime -= 1;
      setOtpTimer(currentTime);
      
      if (currentTime <= 0) {
        setCanResendOtp(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 1000);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    // Set dynamic page title based on role
    document.title = `${role === 'owner' ? 'Owner' : 'User'} Register | PG & Room Rental`;
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [role]);

  // STABLE onChange handlers to prevent infinite re-renders
  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [role === 'owner' ? 'ownerName' : 'name']: value 
    }));
  }, [role]);

  const handleGenderChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  }, []);

  const handleBusinessTypeChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, businessType: value }));
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, confirmPassword: value }));
  }, []);

  // EMERGENCY FIX: Simple boolean calculation - NO useMemo
  const hasRequiredFields = role === 'owner' 
    ? Boolean(formData.ownerName?.trim() && formData.businessType)
    : Boolean(formData.name?.trim() && formData.gender);
  
  const hasValidCredentials = Boolean(
    formData.email && 
    formData.phone && 
    formData.password && 
    formData.confirmPassword && 
    formData.password === formData.confirmPassword
  );
  
  const hasNoErrors = Boolean(
    !nameError && !ownerNameError && !emailError && 
    !phoneError && !passwordError && !confirmPasswordError
  );
  
  const isFormReadyForSubmit = hasRequiredFields && hasValidCredentials && hasNoErrors && emailVerified && acceptTerms;

  const validateForm = () => {
    if (role === 'owner' && !formData.ownerName?.trim()) {
      toast.error('👤 Name required');
      return false;
    }
    if (role === 'user' && !formData.name?.trim()) {
      toast.error('👤 Name required');
      return false;
    }
    if (!formData.email) {
      toast.error('📧 Email required');
      return false;
    }
    if (emailError) {
      toast.error('📧 Enter valid email');
      return false;
    }
    if (!emailVerified) {
      toast.error('📧 Verify email first');
      return false;
    }
    if (!formData.phone) {
      toast.error('📱 Phone required');
      return false;
    }
    if (phoneError) {
      toast.error('📱 Enter valid mobile');
      return false;
    }
    if (!formData.password) {
      toast.error('🔐 Password required');
      return false;
    }
    if (passwordError) {
      toast.error('🔐 Weak password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('🔐 Passwords mismatch');
      return false;
    }
    if (role === 'owner' && !formData.businessType) {
      toast.error('🏢 Business type required');
      return false;
    }
    if (role === 'user' && !formData.gender) {
      toast.error('👤 Gender required');
      return false;
    }
    if (!acceptTerms) {
      toast.error('📋 Accept terms');
      return false;
    }
    return true;
  };

  const sendOtpApi = async (email: string, userRole: string) => {
    const data = await authService.sendOtp(email, userRole);
    if (!data.success) throw new Error(data.message);
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const payload = role === 'owner' ? {
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'owner',
        businessType: formData.businessType,
        otp: verifiedOtp
      } : {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'user',
        gender: formData.gender,
        otp: verifiedOtp
      };

      const data = await authService.register(payload);

      if (data.success) {
        toast.success('🎉 Registration successful!');
        
        setTimeout(() => {
          router.push(roleConfig.loginLink);
        }, 1500);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced OTP verification - NO useCallback to prevent dependency issues
  const handleVerifyOtp = async (e: React.FormEvent | null, otpValue?: string) => {
    if (e) e.preventDefault();
    
    const currentOtp = otpValue || otp;
    if (!currentOtp || currentOtp.length !== 6) {
      setOtpError('Enter valid OTP');
      setShowOtpError(true);
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setShowOtpError(false);
    
    try {
      const result = await authService.verifyOtp(emailForOtp, currentOtp);
      
      if (result.success) {
        setEmailVerified(true);
        setVerifiedOtp(currentOtp);
        setShowOtpModal(false);
        setOtpVerifySuccess('Email verified successfully!');
        toast.success('✅ Email verified successfully!');
        
        // Reset states
        setOtpDisabled(false);
        setOtpAttempts(0);
        // Reset resend states too
        setResendCount(0);
        setResendDisabled(false);
      } else {
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch (error: any) {
      // Increment attempts counter
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      
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
        toast.error(`❌ Invalid OTP. ${remainingAttempts} attempts remaining.`);
      }
      
      setOtpErrorTrigger(prev => prev + 1); // Increment to trigger new error in OtpInput
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    window.location.href = `http://localhost:5000/api/auth/google?role=${role}`;
  };

  // Navigation with flip animation
  const handleNavigateWithFlip = (url: string) => {
    setIsFlipping(true);
    setTimeout(() => {
      router.push(url);
    }, 300); // Half of animation duration
  };

  // COMPLETELY SIMPLE: No useCallback, no dependencies
  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
    // Clear error when user starts typing (but don't reset attempts counter)
    if (showOtpError) {
      setShowOtpError(false);
      setOtpError('');
    }
  };

  const handleOtpVerify = (otpValue: string) => {
    // Real-time verification when all digits entered
    if (
      otpValue.length === 6 &&
      !otpLoading &&
      otpValue !== lastVerifiedOtpRef.current
    ) {
      lastVerifiedOtpRef.current = otpValue;
      handleVerifyOtp(null, otpValue);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      
      {/* Advanced OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-900/5 backdrop-blur-md flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border-t-4 ${
            role === 'owner' ? 'border-green-500' : 'border-blue-500'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  role === 'owner' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {role === 'owner' ? '👨‍💼' : '👤'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Verification</h3>
                  <p className={`text-xs ${role === 'owner' ? 'text-green-600' : 'text-blue-600'}`}>
                    {role === 'owner' ? 'Owner' : 'User'} Registration
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpError('');
                  setOtpVerifySuccess('');
                  setOtp('');
                  setOtpSent(false);
                  setOtpTimer(0);
                  setCanResendOtp(true);
                  setOtpAttempts(0);
                  setOtpDisabled(false);
                  // Reset resend states
                  setResendCount(0);
                  setResendDisabled(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            {!otpSent ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${role === 'owner' ? 'bg-green-50' : 'bg-blue-50'}`}>
                  <p className="text-sm text-gray-700 mb-2">
                    We'll send a verification code to:
                  </p>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${role === 'owner' ? 'text-green-800' : 'text-blue-800'}`}>
                      📧 {formData.email}
                    </p>
                    <button
                      onClick={() => {
                        setShowOtpModal(false);
                        // Reset all OTP and resend states
                        setOtpError('');
                        setOtpVerifySuccess('');
                        setOtp('');
                        setOtpSent(false);
                        setOtpTimer(0);
                        setCanResendOtp(true);
                        setOtpAttempts(0);
                        setOtpDisabled(false);
                        setResendCount(0);
                        setResendDisabled(false);
                      }}
                      className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                        role === 'owner' 
                          ? 'border-green-300 text-green-700 hover:bg-green-100' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Change Email
                    </button>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setOtpLoading(true);
                    try {
                      await sendOtpApi(formData.email, role);
                      setOtpSent(true);
                      setEmailForOtp(formData.email);
                      setOtpCreatedAt(Date.now());
                      toast.success('otpSent' in roleMessages ? roleMessages.otpSent : 'OTP sent successfully');
                      startOtpTimer();
                    } catch (error: any) {
                      toast.error(error.message || 'OTP send failed');
                    } finally {
                      setOtpLoading(false);
                    }
                  }}
                  disabled={otpLoading}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all ${
                    role === 'owner' 
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300' 
                      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'
                  } disabled:cursor-not-allowed`}
                >
                  {otpLoading ? 'Sending OTP...' : 'Send Verification Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success Message */}
                <div className={`p-4 rounded-lg border ${
                  role === 'owner' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📧</span>
                      <div>
                        <p className={`text-sm font-medium ${
                          role === 'owner' ? 'text-green-800' : 'text-blue-800'
                        }`}>
                          Verification code sent successfully!
                        </p>
                        <p className={`text-xs ${
                          role === 'owner' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          Check email <strong>{emailForOtp}</strong> for OTP.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setOtpError('');
                        setShowOtpError(false);
                        setShowOtpModal(false);
                      }}
                      className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                        role === 'owner' 
                          ? 'border-green-300 text-green-700 hover:bg-green-100' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Change Email
                    </button>
                  </div>
                </div>

                {/* OTP Input Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 text-center">
                    Enter Verification Code
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    onVerify={handleOtpVerify}
                    onComplete={(otpValue) => {
                      // OTP completed callback
                    }}
                    length={6}
                    error={!!(showOtpError && otpError)}
                    success={!!otpVerifySuccess}
                    loading={otpLoading}
                    disabled={otpDisabled}
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
                    expirySeconds={otpExpiryTime}
                    autoClearOnError={true}
                    disableOnError={true}
                    hideDigitsOnError={true}
                    autoSubmitOnComplete={false}
                    allowAlphanumeric={false}
                    placeholder="●"
                    direction="ltr"
                    role={role as 'user' | 'owner'}
                    focusOnErrorTrigger={showOtpError}
                    errorTrigger={otpErrorTrigger}
                    hideTimerOnMaxAttempts={otpDisabled}
                  />
                  
                  {/* Resend Section */}
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!canResendOtp || otpLoading || resendDisabled) return;
                        
                        // Check resend limit
                        const maxResends = getMaxResendAttempts(role);
                        if (resendCount >= maxResends) {
                          toast.error(`Maximum ${maxResends} resends allowed. Please refresh the page to start over.`);
                          setResendDisabled(true);
                          return;
                        }
                        
                        setOtpLoading(true);
                        setOtpError('');
                        setOtpVerifySuccess('');
                        setOtp('');
                        
                        try {
                          await sendOtpApi(emailForOtp, role);
                          setOtpCreatedAt(Date.now());
                          setOtpAttempts(0);
                          setOtpDisabled(false);
                          
                          // Increment resend count
                          const newResendCount = resendCount + 1;
                          setResendCount(newResendCount);
                          
                          // Check if this was the last allowed resend
                          if (newResendCount >= maxResends) {
                            setResendDisabled(true);
                            const otpMessage = 'otpSent' in roleMessages ? roleMessages.otpSent : 'OTP sent successfully';
                            toast.success(`${otpMessage} (Last resend - refresh page for more)`);
                          } else {
                            const otpMessage = 'otpSent' in roleMessages ? roleMessages.otpSent : 'OTP sent successfully';
                            toast.success(`${otpMessage} (${maxResends - newResendCount} resends left)`);
                          }
                          
                          startOtpTimer();
                        } catch (error: any) {
                          toast.error(error.message || 'OTP resend failed');
                        } finally {
                          setOtpLoading(false);
                        }
                      }}
                      disabled={!canResendOtp || otpLoading || resendDisabled}
                      className={`text-sm font-medium underline transition-colors ${
                        !canResendOtp || otpLoading || resendDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : role === 'owner'
                          ? 'text-green-600 hover:text-green-700'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {resendDisabled 
                        ? 'Refresh page for more resends'
                        : !canResendOtp 
                        ? `Resend in ${otpTimer}s` 
                        : `Resend Code (${getMaxResendAttempts(role) - resendCount} left)`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <div className={`h-screen flex flex-col justify-center py-2 px-4 sm:px-6 lg:px-8 pt-0.5 -mt-12 ${role === 'owner' ? 'bg-green-50' : 'bg-blue-50'}`}>
        <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
        
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className={`p-6 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl transition-transform duration-600 ${
            isFlipping ? 'animate-flip' : ''
          } ${
            role === 'owner' 
              ? 'bg-gradient-to-br from-green-50 via-white to-green-100' 
              : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
          }`}>
            
            {/* Role Icon - Inside Card */}
            <div className="text-center mb-4">
              <div className={`mx-auto w-16 h-16 ${roleConfig.bgColor} ${roleConfig.borderColor} border-2 rounded-full flex items-center justify-center shadow-lg`}>
                <div className={roleConfig.textColor}>
                  <div className="w-10 h-10 rounded-full bg-current p-2 flex items-center justify-center">
                    {role === 'user' ? (
                      <FaUser className="w-6 h-6 text-white" />
                    ) : (
                      <FaUserTie className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <h3 className="mt-2 text-center text-lg font-medium text-gray-700">
                {roleConfig.name}
              </h3>
              <h2 className="text-center text-2xl font-extrabold text-gray-900">
                {roleConfig.name} Registration
              </h2>
              <p className="text-center text-sm text-gray-600">
                Create your account to get started
              </p>
            </div>
            
            {/* Google OAuth Button */}
            <div className="mb-1 flex justify-center">
              <button
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-2 py-2 px-8 rounded-lg bg-white text-gray-900 font-medium shadow-md border border-gray-300 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm min-w-[200px]"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                ) : (
                  <FcGoogle className="w-4 h-4" />
                )}
                {loading 
                  ? 'Connecting...' 
                  : 'Continue with Google'
                }
              </button>
            </div>

              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Row 1: Name and Gender (User) / Owner Name and Business Type (Owner) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name Field */}
                <div>
                  <label htmlFor={role === 'owner' ? 'ownerName' : 'name'} className="block text-sm font-medium text-gray-700 mb-1">
                    {role === 'owner' ? 'Owner Name' : 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <NameValidationInput
                    value={role === 'owner' ? formData.ownerName : formData.name}
                    onChange={handleNameChange}
                    error={role === 'owner' ? ownerNameError : nameError}
                    setError={role === 'owner' ? setOwnerNameError : setNameError}
                    placeholder={`Enter your ${role === 'owner' ? 'owner' : 'full'} name`}
                    role={role}
                  />
                </div>

                {/* Gender Field for User OR Business Type for Owner */}
                {role === 'user' ? (
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <GenderValidationInput
                      value={formData.gender}
                      onChange={handleGenderChange}
                      role={role}
                      required={true}
                      placeholder="Select gender"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <BusinessTypeValidationInput
                      value={formData.businessType}
                      onChange={handleBusinessTypeChange}
                      role="owner"
                      required={true}
                      placeholder="Select your business type"
                    />
                  </div>
                )}
              </div>

              {/* Row 2: Email Address and Phone Number (Both User and Owner) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <EmailValidationInput
                      value={formData.email}
                      onChange={handleEmailChange}
                      error={emailError}
                      setError={setEmailError}
                      suggestions={emailSuggestions}
                      setSuggestions={setEmailSuggestions}
                      role={role}
                      placeholder="Enter email address"
                      disabled={emailVerified}
                      readOnly={emailVerified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtpModal(true)}
                      disabled={!!emailError || !formData.email || emailVerified}
                      className={`ml-2 px-3 h-9 text-xs rounded-md font-medium transition-colors duration-200 whitespace-nowrap ${
                        emailVerified 
                          ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                          : !!emailError || !formData.email
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : role === 'owner'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {emailVerified ? (
                        <>
                          <FaCheckCircle className="w-3 h-3 mr-1 inline" />
                          Verified
                        </>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  
                  {/* Email Verification Success Message */}
                  {emailVerified && (
                    <div className={`mt-2 p-2 rounded-md flex items-center space-x-2 ${
                      role === 'owner' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <FaCheckCircle className={`w-4 h-4 ${
                        role === 'owner' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                      <span className={`text-xs font-medium ${
                        role === 'owner' ? 'text-green-800' : 'text-blue-800'
                      }`}>
                        Email verified successfully! You can now proceed with registration.
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <MobileValidationInput
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    error={phoneError}
                    setError={setPhoneError}
                    placeholder="Enter mobile number"
                    role={role}
                  />
                </div>
              </div>

              {/* Row 3: Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <PasswordValidationInput
                    id="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    error={passwordError}
                    setError={setPasswordError}
                    placeholder="Create password"
                    role={role}
                    showStrengthIndicator={true}
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <PasswordValidationInput
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={confirmPasswordError}
                    setError={setConfirmPasswordError}
                    placeholder="Confirm your password"
                    role={role}
                    isConfirmField={true}
                    confirmPassword={formData.password}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={`h-4 w-4 focus:ring-2 focus:ring-offset-2 border-gray-300 rounded ${
                    role === 'owner' 
                      ? 'text-green-600 focus:ring-green-500' 
                      : 'text-blue-600 focus:ring-blue-500'
                  }`}
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="/terms" className={`font-medium ${roleConfig.textColor} hover:opacity-80`} target="_blank" rel="noopener noreferrer">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className={`font-medium ${roleConfig.textColor} hover:opacity-80`} target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormReadyForSubmit || loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${roleConfig.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    role === 'owner' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    `Create ${roleConfig.name} Account`
                  )}
                </button>
              </div>

              {/* Footer Links */}
              <div className="flex flex-col items-center justify-center space-y-2 text-sm">
                <div className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => handleNavigateWithFlip(roleConfig.loginLink)}
                    className={`font-medium ${roleConfig.textColor} hover:opacity-80 underline cursor-pointer`}
                  >
                    Login here
                  </button>
                </div>
                <button 
                  onClick={() => handleNavigateWithFlip("/")}
                  className="text-gray-500 hover:text-gray-700 inline-flex items-center cursor-pointer"
                >
                  <FaHome className="w-3 h-3 mr-1" />
                  Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
