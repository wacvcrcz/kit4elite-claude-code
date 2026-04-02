/**
 * Authentication Middleware
 * Verifies JWT access token, attaches user to request
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/lib/jwt';
import { AuthenticationError } from '@/utils/errors';
import type { AuthUser } from '@/types/auth.types';

/**
 * Require authentication middleware
 * Validates access token from Authorization header
 */
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Authentication required');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    } as AuthUser;

    next();
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}
