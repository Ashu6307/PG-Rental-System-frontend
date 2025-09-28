import api from './api';

// User Dashboard Interfaces
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dateJoined: string;
  preferences: {
    location: string;
    budget: {
      min: number;
      max: number;
    };
    roomType: string;
    amenities: string[];
  };
  verificationStatus: {
    email: boolean;
    phone: boolean;
    documents: boolean;
  };
}

export interface UserBooking {
  _id: string;
  pgId: {
    _id: string;
    pg_name: string;
    address: string;
    images: string[];
    rating: number;
  };
  roomId: {
    _id: string;
    room_number: string;
    type: string;
    rent: number;
  };
  status: 'pending' | 'confirmed' | 'checkedin' | 'cancelled' | 'completed';
  checkInDate: string;
  checkOutDate?: string;
  duration: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  bookingDate: string;
  lastUpdate: string;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  averageRating: number;
  favoritesCount: number;
  reviewsCount: number;
  recentActivity: number;
  upcomingCheckIns: number;
  pendingPayments: number;
  monthlySpending: {
    month: string;
    amount: number;
  }[];
}

export interface UserFavorite {
  _id: string;
  pgId: {
    _id: string;
    pg_name: string;
    address: string;
    images: string[];
    rating: number;
    rent: {
      min: number;
      max: number;
    };
    amenities: string[];
    verified: boolean;
  };
  addedAt: string;
}

export interface UserReview {
  _id: string;
  pgId: {
    _id: string;
    pg_name: string;
    images: string[];
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
  images?: string[];
}

export interface UserNotification {
  _id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system' | 'promotion';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface RecentActivity {
  _id: string;
  type: 'booking' | 'payment' | 'review' | 'favorite';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface UserInvoice {
  _id: string;
  invoiceNumber: string;
  bookingId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'rent' | 'deposit' | 'maintenance';
  description: string;
  createdAt: string;
}

export interface PaymentHistory {
  _id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'card' | 'upi' | 'bank_transfer' | 'wallet';
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  description: string;
}

export interface UserAnalytics {
  totalBookings: number;
  totalSpent: number;
  averageBookingDuration: number;
  favoriteLocations: string[];
  bookingPatterns: {
    monthlyBookings: { month: string; count: number; }[];
    averageRating: number;
    repeatBookingRate: number;
  };
  financialMetrics: {
    monthlySpending: { month: string; amount: number; }[];
    averageBookingValue: number;
    totalSavings: number;
  };
  engagementMetrics: {
    profileCompleteness: number;
    reviewsGiven: number;
    favoritesAdded: number;
    lastActivity: string;
  };
}

class UserDashboardService {
  // Get user profile
  async getUserProfile(): Promise<UserProfile> {
    return api.request('/api/user-dashboard/profile');
  }

  // Update user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return api.request('/api/user-dashboard/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    return api.request('/api/user-dashboard/stats');
  }

  // Get user bookings
  async getUserBookings(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    bookings: UserBooking[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return api.request(`/api/user-dashboard/bookings?${queryParams.toString()}`);
  }

  // Get user analytics
  async getUserAnalytics(): Promise<UserAnalytics> {
    return api.request('/api/user-dashboard/analytics');
  }

  // Get favorite PGs
  async getFavoritePGs(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    favorites: UserFavorite[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return api.request(`/api/user-dashboard/favorites?${queryParams.toString()}`);
  }

  // Add/Remove favorite
  async toggleFavorite(pgId: string): Promise<{ isFavorite: boolean }> {
    return api.request('/api/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ pgId }),
    });
  }

  // Check if PG is favorite
  async checkFavorite(pgId: string): Promise<{ isFavorite: boolean }> {
    return api.request(`/api/favorites/check/${pgId}`);
  }

  // Remove favorite
  async removeFavorite(pgId: string): Promise<{ success: boolean }> {
    return api.request(`/api/favorites/${pgId}`, {
      method: 'DELETE',
    });
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    return api.request(`/api/user-dashboard/activity?limit=${limit}`);
  }

  // Get user reviews
  async getUserReviews(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    reviews: UserReview[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return api.request(`/api/users/reviews?${queryParams.toString()}`);
  }

  // Get notifications
  async getNotifications(params?: {
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    notifications: UserNotification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
    unreadCount: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return api.request(`/api/users/notifications?${queryParams.toString()}`);
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    return api.request(`/api/users/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(): Promise<void> {
    return api.request('/api/users/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  // Get user invoices
  async getUserInvoices(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    invoices: UserInvoice[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return api.request(`/api/users/invoices?${queryParams.toString()}`);
  }

  // Get payment history
  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  }): Promise<{
    payments: PaymentHistory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);
    
    return api.request(`/api/users/payments/history?${queryParams.toString()}`);
  }

  // Make payment
  async makePayment(invoiceId: string, paymentMethod: string): Promise<{
    paymentUrl?: string;
    transactionId: string;
    status: string;
  }> {
    return api.request('/api/users/payments/pay', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, paymentMethod }),
    });
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<{ success: boolean }> {
    return api.request(`/api/users/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  // Update booking
  async updateBooking(bookingId: string, updates: Partial<UserBooking>): Promise<UserBooking> {
    return api.request(`/api/users/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Download invoice PDF
  async downloadInvoicePDF(invoiceId: string): Promise<Blob> {
    const baseURL = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
      : 'http://localhost:5000';
      
    const response = await fetch(`${baseURL}/api/users/invoices/${invoiceId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? sessionStorage.getItem('token') : ''}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
    
    return response.blob();
  }

  // Submit review
  async submitReview(pgId: string, reviewData: {
    rating: number;
    title: string;
    comment: string;
    images?: File[];
  }): Promise<UserReview> {
    const formData = new FormData();
    formData.append('pgId', pgId);
    formData.append('rating', reviewData.rating.toString());
    formData.append('title', reviewData.title);
    formData.append('comment', reviewData.comment);
    
    if (reviewData.images) {
      reviewData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    return api.request('/api/users/reviews', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  // Update preferences
  async updatePreferences(preferences: UserProfile['preferences']): Promise<UserProfile> {
    return api.request('/api/users/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return api.request('/api/users/profile/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  // Verify phone number
  async verifyPhone(phone: string, otp: string): Promise<{ verified: boolean }> {
    return api.request('/api/users/verify/phone', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  }

  // Request phone verification
  async requestPhoneVerification(phone: string): Promise<{ otpSent: boolean }> {
    return api.request('/api/users/verify/phone/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }
}

export const userDashboardService = new UserDashboardService();
export default userDashboardService;