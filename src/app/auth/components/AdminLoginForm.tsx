"use client";
import React, { useState, useEffect } from 'react';
import { FaUserShield, FaCheckCircle, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import EmailValidationInput from '../../../components/validation/EmailValidationInput';
import PasswordValidationInput from '../../../components/validation/PasswordValidationInput';
import OtpInput from '../../../components/validation/OtpInput';
import { authService } from '../../../services/authService';
import { isValidOtp, getOtpValidationError } from '../../../utils/validation/otpValidation';
import { getMaxResendAttempts, getMaxOtpAttempts, getRoleMessages } from '../../../utils/otpConfig';

const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showOtpError, setShowOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [otpCreatedAt, setOtpCreatedAt] = useState<number | null>(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [otpErrorTrigger, setOtpErrorTrigger] = useState(0);
  
  // Resend count tracking
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  
  // Email validation
  const [emailError, setEmailError] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  
  // Password validation
  const [passwordError, setPasswordError] = useState('');

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => {
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

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || emailError || passwordError) {
      toast.error('Please enter valid email and password');
      return;
    }

    setLoading(true);
    setOtpError('');
    
    try {
      const result = await authService.sendOtp(formData.email, 'admin', formData.password);
      
      if (result.success) {
        setOtpSent(true);
        setCanResend(false);
        setResendTimer(60);
        setOtpCreatedAt(Date.now());
        setOtpAttempts(0);
        setOtp('');
        setOtpError('');
        setOtpSuccess('');
        toast.success('🔐 Admin OTP sent to your email!');
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (error: unknown) {
      console.error('OTP send error:', error);
      toast.error('Failed to send OTP. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP - Enhanced with proper attempt tracking
  const handleVerifyOtp = async (e: React.FormEvent | null, otpOverride?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const otpToCheck = otpOverride || otp;
    
    // Check if OTP is disabled due to max attempts
    if (otpDisabled) {
      const roleMessages = getRoleMessages('admin');
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
      const loginResult = await authService.verifyOtp(formData.email, cleanOtp, 'admin');
      
      if (loginResult.success && loginResult.token && loginResult.user) {
        // Store admin auth data
        localStorage.setItem('token', loginResult.token);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('user', JSON.stringify(loginResult.user));
        
        setOtpSuccess('✅ Admin login successful!');
        // Reset all OTP states on successful verification
        setOtpAttempts(0);
        setOtpDisabled(false);
        setResendCount(0);
        setResendDisabled(false);
        
        toast.success('🎉 Admin login successful! Welcome back.', {
          duration: 3000,
          icon: '👑'
        });
        
        setTimeout(() => {
          router.push('/sys-mgmt/ctrl-panel');
        }, 1000);
      } else {
        // Enhanced attempt tracking
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        
        // Check max attempts using otpConfig
        const maxAttempts = getMaxOtpAttempts('admin');
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
    } catch (error: unknown) {
      // Enhanced attempt tracking for network errors
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      
      // Check max attempts using otpConfig
      const maxAttempts = getMaxOtpAttempts('admin');
      const remainingAttempts = maxAttempts - newAttempts;
      
      let errorMsg = error instanceof Error ? error.message : 'Failed to verify OTP';
      
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

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || resendDisabled) return;
    
    // Check resend limit
    const maxResends = getMaxResendAttempts('admin');
    if (resendCount >= maxResends) {
      toast.error(`Maximum ${maxResends} resends allowed. Please refresh the page to start over.`);
      setResendDisabled(true);
      return;
    }
    
    setLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setOtp('');
    
    try {
      const result = await authService.sendOtp(formData.email, 'admin', formData.password);
      
      if (result.success) {
        // Increment resend count
        const newResendCount = resendCount + 1;
        setResendCount(newResendCount);
        
        // Check if this was the last allowed resend
        if (newResendCount >= maxResends) {
          setResendDisabled(true);
          setOtpSuccess('OTP resent successfully! (Last resend - refresh page for more)');
          toast.success('Admin OTP resent successfully! (Last resend - refresh page for more)');
        } else {
          setOtpSuccess(`OTP resent successfully! (${maxResends - newResendCount} resends left)`);
          toast.success(`Admin OTP resent successfully! (${maxResends - newResendCount} resends left)`);
        }
        
        setResendTimer(60);
        setCanResend(false);
        setOtpCreatedAt(Date.now());
        setOtpAttempts(0);
        setOtpDisabled(false);
      } else {
        toast.error('Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fixed scroll lock and centered layout */}
      <Toaster position="top-center" />
      <div className="h-screen w-screen fixed inset-0 flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-br from-red-50 via-white to-red-100">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="p-6 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl bg-gradient-to-br from-red-50 via-white to-red-100">
            
            {/* Role Icon - Inside Card */}
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-red-50 border-red-200 border-2 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-red-600">
                  <div className="w-10 h-10 rounded-full bg-current p-2 flex items-center justify-center">
                    <FaUserShield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="mt-2 text-center text-lg font-medium text-gray-700">
                Admin
              </h3>
              <h2 className="text-center text-2xl font-extrabold text-gray-900">
                Secure Login
              </h2>
              <p className="text-center text-sm text-gray-600">
                Two-factor authentication required
              </p>
            </div>

            {/* Step 1: Email & Password */}
            {!otpSent && (
              <div className="flex flex-col">
                {/* Step Indicator */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span className="ml-2 text-sm font-bold text-red-600">
                      Credentials
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      OTP
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Admin Email <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative">
                        <EmailValidationInput
                          value={formData.email}
                          onChange={(email) => setFormData(prev => ({ ...prev, email }))}
                          error={emailError}
                          setError={setEmailError}
                          suggestions={emailSuggestions}
                          setSuggestions={setEmailSuggestions}
                          placeholder="Enter admin email address"
                          role="admin"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative">
                        <PasswordValidationInput
                          value={formData.password}
                          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                          error={passwordError}
                          setError={setPasswordError}
                          role="admin"
                          showStrengthIndicator={false}
                          placeholder="Enter admin password"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading || !formData.email || !formData.password || !!emailError || !!passwordError}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending OTP...
                        </div>
                      ) : (
                        "Send OTP"
                      )}
                    </button>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                      <Link
                        href="/auth/forgot-password?role=admin"
                        className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                      >
                        Forgot Admin Password?
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {otpSent && (
              <div className="flex flex-col">
                {/* Admin OTP Step Indicator */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Credentials
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-red-300"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="ml-2 text-sm font-bold text-red-600">
                      OTP
                    </span>
                  </div>
                </div>

                <form onSubmit={(e) => handleVerifyOtp(e)} className="space-y-4">
                  <div className="space-y-2">
                    {/* OTP Sent Success Message */}
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <FaCheckCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-red-800">
                            Admin Login OTP sent successfully!
                          </p>
                          <p className="text-xs text-red-600">
                            Check email <strong>{formData.email}</strong> for OTP.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 text-center">Enter Admin OTP</label>
                      <OtpInput
                        value={otp}
                        onChange={(otpValue) => {
                          setOtpSuccess('');
                          setOtp(otpValue);
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
                            setOtpSuccess('');
                            handleVerifyOtp(null, otpValue);
                          }
                        }}
                        onComplete={(otpValue) => {
                          console.log('OTP completed:', otpValue);
                        }}
                        length={6}
                        error={!!(showOtpError && otpError)}
                        success={!!otpSuccess}
                        loading={loading}
                        statusMessage={
                          showOtpError && otpError
                            ? otpError
                            : otpSuccess
                            ? otpSuccess
                            : ''
                        }
                        statusType={
                          showOtpError && otpError
                            ? 'error'
                            : otpSuccess
                            ? 'success'
                            : ''
                        }
                        statusBoxColor={{
                          bg: showOtpError && otpError 
                            ? 'bg-red-50' 
                            : otpSuccess 
                            ? 'bg-green-50' 
                            : '',
                          border: showOtpError && otpError 
                            ? 'border border-red-200' 
                            : otpSuccess 
                            ? 'border border-green-200' 
                            : '',
                          text: showOtpError && otpError 
                            ? 'text-red-600' 
                            : otpSuccess 
                            ? 'text-green-600' 
                            : ''
                        }}
                        errorHighlightDuration={1200}
                        errorMessageDuration={5000}
                        otpCreatedAt={otpCreatedAt}
                        expirySeconds={300}
                        autoClearOnError={true}
                        disableOnError={true}
                        hideDigitsOnError={true}
                        autoSubmitOnComplete={false}
                        allowAlphanumeric={false}
                        placeholder="●"
                        direction="ltr"
                        role="admin"
                        focusOnErrorTrigger={showOtpError}
                        errorTrigger={otpErrorTrigger}
                        disabled={otpDisabled}
                        hideTimerOnMaxAttempts={otpDisabled}
                      />
                      
                      <div className="text-center space-y-1">
                        <p className="text-sm text-gray-600">
                          Didn't receive the code?
                        </p>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={!canResend || loading || resendDisabled}
                          className={`text-sm font-medium underline ${
                            canResend && !resendDisabled
                              ? 'text-red-600 hover:text-red-800 cursor-pointer' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {resendDisabled 
                            ? 'Refresh page for more resends'
                            : canResend 
                            ? `Resend Admin OTP (${getMaxResendAttempts('admin') - resendCount} left)` 
                            : `Resend in ${resendTimer}s`}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-3">
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify & Login"
                      )}
                    </button>

                    {/* Navigation Options */}
                    <div className="space-y-2">
                      {/* Back to Credentials */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                            setOtpError('');
                            setOtpSuccess('');
                          }}
                          className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                        >
                          ← Back to Credentials
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Footer Links */}
            <div className="flex flex-col items-center justify-center space-y-2 text-sm mt-3">
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

export default AdminLoginForm;
