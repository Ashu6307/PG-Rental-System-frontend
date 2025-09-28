// Centralized API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
  : 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available (check both sessionStorage and localStorage for backward compatibility)
    const token = typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token')) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Only show API errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`API Error for ${endpoint}:`, error);
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint: string, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint: string, data: any, options: RequestOptions = {}): Promise<any> {
    // Handle FormData (for file uploads)
    const isFormData = data instanceof FormData;
    
    const config: RequestOptions = {
      method: 'POST',
      ...options,
    };

    if (isFormData) {
      config.body = data;
      // Remove content-type for FormData, browser sets it automatically
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    } else {
      config.body = JSON.stringify(data);
    }
    return this.request(endpoint, config);
  }

  // PUT request
  async put(endpoint: string, data: any, options: RequestOptions = {}): Promise<any> {
    const config: RequestOptions = {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    };
    return this.request(endpoint, config);
  }

  // DELETE request
  async delete(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const config: RequestOptions = {
      method: 'DELETE',
      ...options,
    };
    return this.request(endpoint, config);
  }

  // Area Images Management
  async addAreaImage(roomId: string | number, area: string, imageUrl: string, label: string | null = null): Promise<any> {
    const body: any = { area, imageUrl };
    if (area === 'others' && label) {
      body.label = label;
    }
    
    return this.post(`/api/rooms/${roomId}/area-images`, { body: JSON.stringify(body) });
  }

  async removeAreaImage(roomId: string | number, area: string, imageIndex: number, label: string | null = null): Promise<any> {
    const body: any = { area, imageIndex };
    if (area === 'others' && label) {
      body.label = label;
    }
    
    return this.delete(`/api/rooms/${roomId}/area-images`, { body: JSON.stringify(body) });
  }
}

const apiService = new ApiService();
export default apiService;
