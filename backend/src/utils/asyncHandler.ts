/**
 * Async Handler
 * Wrapper to catch async errors in Express handlers
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wrap async Express handlers to catch errors
 * Automatically passes errors to next() for error middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
