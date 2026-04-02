/**
 * Admin Authorization Middleware
 * Requires both authentication and ADMIN role
 */

import type { Request, Response, NextFunction } from 'express';
import { requireAuth } from './requireAuth.middleware';
import { AuthorizationError } from '@/utils/errors';

/**
 * Require admin middleware
 * Must be used AFTER requireAuth
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // First ensure user is authenticated
  requireAuth(req, res, (err?: Error) => {
    if (err) {
      next(err);
      return;
    }

    // Check for admin role
    if (req.user?.role !== 'ADMIN') {
      next(new AuthorizationError('Admin access required'));
      return;
    }

    next();
  });
}
