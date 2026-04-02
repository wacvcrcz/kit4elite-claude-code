/**
 * Auth Service
 * Business logic for authentication
 */

import { env } from '@/schema/env.schema';
import { prisma } from '@/config/database';
import { hashPassword, comparePassword } from '@/lib/bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/lib/jwt';
import {
  AppError,
  ConflictError,
  AuthenticationError,
} from '@/utils/errors';
import type { RegisterInput, LoginInput, AuthResponse } from '@/types';
import type { User } from '@prisma/client';

// Cookie options for refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register a new user
 */
export async function register(
  input: RegisterInput
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const { email, password, name } = input;

  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: 'CUSTOMER',
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    tokenVersion: 0,
  });

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
}

/**
 * Login user
 */
export async function login(
  input: LoginInput
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Verify password
  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    tokenVersion: 0,
  });

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
}

/**
 * Refresh access token
 */
export async function refreshToken(
  token: string
): Promise<{ accessToken: string }> {
  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Find user and check if refresh token matches
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.refreshToken !== token) {
    throw new AuthenticationError('Invalid refresh token');
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
}

/**
 * Logout user
 */
export async function logout(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

export { REFRESH_COOKIE_OPTIONS };
