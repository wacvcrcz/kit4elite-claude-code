/**
 * Auth Controller
 * HTTP request handlers for authentication
 */

import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import * as authService from '@/services/auth.service';
import { registerSchema, loginSchema, refreshSchema } from '@/schema/auth.schema';
import { ValidationError } from '@/utils/errors';

/**
 * POST /api/auth/register
 * Register a new user with email/password
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const { user, accessToken, refreshToken } = await authService.register(result.data);

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, authService.REFRESH_COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    },
  });
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const { user, accessToken, refreshToken } = await authService.login(result.data);

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, authService.REFRESH_COOKIE_OPTIONS);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    },
  });
});

/**
 * POST /api/auth/refresh
 * Get new access token using refresh token
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  // Get refresh token from cookie or body
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ValidationError('Refresh token required');
  }

  const { accessToken } = await authService.refreshToken(refreshToken);

  res.json({
    success: true,
    data: { accessToken },
  });
});

/**
 * POST /api/auth/logout
 * Clear refresh token and logout user
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (userId) {
    await authService.logout(userId);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ValidationError('Not authenticated');
  }

  res.json({
    success: true,
    data: { user },
  });
});
