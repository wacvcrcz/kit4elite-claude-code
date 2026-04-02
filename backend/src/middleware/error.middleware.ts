/**
 * Error Handling Middleware
 * Centralized error handling with typed responses
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError, isAppError } from '@/utils/errors';
import { env } from '@/schema/env.schema';

/**
 * API Error Response
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    stack?: string;
  };
}

/**
 * Global error handler
 * Catches all uncaught errors and formats response
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default to 500
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';

  if (isAppError(err)) {
    // Known application error
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err.name === 'SyntaxError' && 'body' in err) {
    // JSON parse error
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Invalid JSON in request body';
  }

  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
    },
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  console.error(`[ERROR] ${code}:`, err.message);
  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 * Catches unmatched routes
 */
export function notFoundHandler(
  req: Request,
  res: Response
): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: 'NOT_FOUND',
    },
  });
}
