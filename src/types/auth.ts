/**
 * Authentication Type Definitions
 * Strict typing for auth state, API responses, and user roles
 */

/**
 * User roles in the system
 */
export type UserRole = 'admin' | 'customer';

/**
 * User data returned from API
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * JWT Token payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Login request body
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration request body
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * Auth tokens returned from API
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * API response for successful auth operations
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Auth state in Zustand store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth store actions
 */
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  clearError: () => void;
  setUser: (user: User) => void;
}

/**
 * Route guard props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

/**
 * Form validation errors
 */
export interface AuthValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}
