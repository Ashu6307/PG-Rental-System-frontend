"use client";
import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaUserCircle, FaUserTie, FaHome } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import EmailValidationInput from '../../../components/validation/EmailValidationInput';
import PasswordValidationInput from '../../../components/validation/PasswordValidationInput';
import { authService } from '../../../services/authService';
import { AuthContext } from '../../../context/AuthContext';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Auth context
  const authContext = useContext(AuthContext);
  const { login } = authContext || {};
  
  // Role detection similar to RegisterForm
  const role = (() => {
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
  })();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState('');

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(`rememberedEmail_${role}`);
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
    
    // Set dynamic page title based on role
    document.title = `${role === 'owner' ? 'Owner' : 'User'} Login | PG & Room Rental`;
  }, [role]);

  const getRoleConfig = () => {
    switch (role) {
      case 'owner':
        return {
          name: 'Owner',
          icon: <FaUserTie className="w-12 h-12" />,
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-600',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          registerLink: '/auth/register?role=owner',
          forgotLink: '/auth/forgot-password?role=owner'
        };
      default:
        return {
          name: 'User',
          icon: <FaUserCircle className="w-12 h-12" />,
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          registerLink: '/auth/register?role=user',
          forgotLink: '/auth/forgot-password?role=user'
        };
    }
  };

  const roleConfig = getRoleConfig();

  const validateForm = () => {
    if (!formData.email?.trim()) {
      toast.error('📧 Email address is required');
      return false;
    }
    
    if (emailError) {
      toast.error('📧 Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      toast.error('🔐 Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('🔐 Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setLoading(true);

    try {
      const data = await authService.login({
        email: formData.email,
        password: formData.password,
        userType: role === 'owner' ? 'owner' : 'user'
      });

      if (data.success) {
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem(`rememberedEmail_${role}`, formData.email);
        } else {
          localStorage.removeItem(`rememberedEmail_${role}`);
        }

        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', role);
        
        // Update context if available
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', data.token);
        }
        
        // Update auth context with await to ensure it completes
        if (login) {
          await login(data.token, data.user, role);
        }
        
        toast.success('🎉 Login successful!');
        
        // Small delay to ensure auth context is fully updated
        setTimeout(() => {
          // Check for redirect parameter
          const redirectUrl = searchParams.get('redirect');
          
          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            // Default redirect based on role
            if (role === 'owner') {
              router.push('/dashboard/owner');
            } else {
              router.push('/user/dashboard');
            }
          }
        }, 100);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    toast('🚀 Google OAuth will be implemented soon!', {
      icon: 'ℹ️'
    });
  };

  const isFormValid = formData.email && formData.password && !emailError && !passwordError;

  return (
    <>
      <Toaster position="top-center" />
      <div className={`min-h-screen flex flex-col justify-start pt-8 py-2 px-4 sm:px-6 lg:px-8 ${role === 'owner' ? 'bg-green-50' : 'bg-blue-50'}`}>
        <div className="flex-1 flex flex-col justify-start max-w-md mx-auto w-full">
        
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className={`p-6 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl ${
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
                {roleConfig.name} Login
              </h2>
              <p className="text-center text-sm text-gray-600">
                Login your account
              </p>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Google OAuth Button */}
              <div className="mb-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="flex items-center justify-center gap-2 py-2 px-8 rounded-lg bg-white text-gray-900 font-medium shadow-md border border-gray-300 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm min-w-[200px]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  ) : (
                    <FcGoogle className="w-4 h-4" />
                  )}
                  {loading ? 'Connecting...' : 'Continue with Google'}
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <EmailValidationInput
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  error={emailError}
                  setError={setEmailError}
                  suggestions={emailSuggestions}
                  setSuggestions={setEmailSuggestions}
                  placeholder="Enter email address"
                  role={role}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <PasswordValidationInput
                  value={formData.password}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                  error={passwordError}
                  setError={setPasswordError}
                  placeholder="Enter your password"
                  minLength={6}
                  showStrengthIndicator={false}
                  role={role}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`h-4 w-4 border-gray-300 rounded ${
                      role === 'owner' 
                        ? 'text-green-600 focus:ring-green-500' 
                        : 'text-blue-600 focus:ring-blue-500'
                    }`}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${roleConfig.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    role === 'owner' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Sign In</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="flex flex-col items-center justify-center space-y-2 text-sm mt-3">
              <div className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={roleConfig.registerLink}
                  className={`${roleConfig.textColor} hover:opacity-80 font-medium underline`}
                >
                  Register here
                </Link>
              </div>
              <Link
                href={roleConfig.forgotLink}
                className={`${roleConfig.textColor} hover:opacity-80 font-medium underline`}
              >
                Forgot your password?
              </Link>
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
      </div>
    </>
  );
}

export default LoginForm;
