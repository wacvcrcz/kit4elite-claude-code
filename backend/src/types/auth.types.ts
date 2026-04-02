/**
 * Authentication Type Definitions
 */

import type { Role } from '@prisma/client';

/**
 * Authenticated user attached to request
 */
export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}

/**
 * Register request body
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
    accessToken: string;
  };
}

/**
 * JWT token pair
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  success: true;
  data: {
    accessToken: string;
  };
}

/**
 * Extended Express Request with user
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
