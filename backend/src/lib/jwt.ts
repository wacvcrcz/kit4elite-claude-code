/**
 * JWT Utilities
 * Token generation and verification with typed payloads
 */

import jwt from 'jsonwebtoken';
import { env } from '@/schema/env.schema';
import { AuthenticationError } from '@/utils/errors';

/**
 * JWT Payload for access tokens
 */
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

/**
 * JWT Payload for refresh tokens
 */
export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  } catch {
    throw new AuthenticationError('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
}
