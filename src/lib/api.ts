/**
 * API Client Configuration
 * Axios instance with JWT interceptors for authenticated requests
 * Fixed to avoid circular dependency issues
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// API base URL - will be configured via env in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Create configured axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request interceptor: Attach access token to requests
 * Reads token directly from localStorage to avoid circular dependency
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage directly (Zustand persist format)
    let token: string | null = null;
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Zustand persist stores state in a "state" property
        token = parsed?.state?.accessToken || null;
      }
    } catch {
      token = null;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Flag to prevent multiple refresh attempts
 */
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(callback: (token: string | null) => void): void {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string | null): void {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Response interceptor: Handle token refresh on 401 errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If not 401 or no original request, reject immediately
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // If already retrying, queue the request
    if (originalRequest._retry) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    // Mark as retrying
    originalRequest._retry = true;

    // Try to refresh token
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        // Get refresh token from store
        const refreshToken = localStorage.getItem('auth-storage')
          ? JSON.parse(localStorage.getItem('auth-storage') || '{}').refreshToken
          : null;

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post<{
          success: boolean;
          data: { accessToken: string };
        }>(`${API_BASE_URL}/auth/refresh`, { refreshToken });

        if (response.data.success) {
          const newToken = response.data.data.accessToken;
          onTokenRefreshed(newToken);
          
          // Update header and retry
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        onTokenRefreshed(null);
        // Redirect to login or handle logout
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If already refreshing, wait for new token
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token) => {
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        } else {
          reject(error);
        }
      });
    });
  }
);

/**
 * API request wrappers with typed responses
 */
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),
};

export { apiClient };
