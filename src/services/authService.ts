// Auth service for handling authentication API calls - Matching old frontend pattern
import { apiService, API_CONFIG } from '../config/api';

export const authService = {
  // Login
  async login(credentials: any) {
    // Check both 'role' and 'userType' fields
    const userRole = credentials.role || credentials.userType;
    const endpoint = userRole === 'admin' ? API_CONFIG.ENDPOINTS.ADMIN_LOGIN : API_CONFIG.ENDPOINTS.LOGIN;
    const response = await apiService.post(endpoint, credentials);
    return response;
  },

  // Register
  async register(userData: any) {
    const endpoint = userData.role === 'admin' ? API_CONFIG.ENDPOINTS.ADMIN_REGISTER : API_CONFIG.ENDPOINTS.REGISTER;
    return await apiService.post(endpoint, userData);
  },

  // OTP Operations
  async sendOtp(email: string, role: string = 'user', password?: string) {
    const endpoint = role === 'admin' ? API_CONFIG.ENDPOINTS.ADMIN_SEND_OTP : API_CONFIG.ENDPOINTS.SEND_OTP;
    const payload = role === 'admin' && password ? { email, role, password } : { email, role };
    return await apiService.post(endpoint, payload);
  },

  async verifyOtp(email: string, otp: string, role: string = 'user') {
    // For regular registration OTP verification
    const endpoint = role === 'admin' ? API_CONFIG.ENDPOINTS.ADMIN_VERIFY_OTP : API_CONFIG.ENDPOINTS.VERIFY_REGISTER_OTP;
    return await apiService.post(endpoint, { email, otp, role });
  },

  // Verify OTP for forgot password flow - using dedicated OTP verification endpoint
  async verifyForgotPasswordOtp(data: { email: string; otp: string; role?: string }) {
    return await apiService.post('/api/otp/verify-otp', { 
      email: data.email, 
      otp: data.otp,
      role: data.role || 'user'
    });
  },

  // Password Reset - OTP verification happens in reset step
  async forgotPassword(email: string, role: string = 'user') {
    return await apiService.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email, role });
  },

  // For forgot password, this verifies OTP and resets password in one step
  async resetPassword(email: string, otp: string, newPassword: string, role: string = 'user') {
    return await apiService.post(API_CONFIG.ENDPOINTS.RESET_PASSWORD, { 
      email, 
      otp, 
      newPassword, 
      role 
    });
  },

  // Check authentication
  async checkAuth() {
    return await apiService.get('/api/auth/me');
  }
};
