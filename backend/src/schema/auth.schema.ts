/**
 * Auth Validation Schemas
 * Zod schemas for auth request bodies
 */

import { z } from 'zod';
import { Role } from '@prisma/client';

/**
 * Register request schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email required')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Refresh token request (from cookie, no body needed)
 * But we might have a body for mobile clients
 */
export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshInput = z.infer<typeof refreshSchema>;

/**
 * User response (safe to return to client)
 */
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum([Role.ADMIN, Role.CUSTOMER]),
  createdAt: z.date().or(z.string()),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
