/**
 * Express Application
 * Entry point for the backend API
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// Must validate env first — crashes if invalid
import { env } from '@/schema/env.schema';

import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';
import { apiRouter } from '@/routes';

const app = express();

/**
 * Security Middleware
 */
// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", env.FRONTEND_URL],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMITED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again later',
      code: 'AUTH_RATE_LIMITED',
    },
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

/**
 * Body Parsing
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * Health Check
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

/**
 * API Routes
 */
app.use('/api', apiRouter);

// Special handling for Stripe webhook (needs raw body)
// This is mounted before json parser in production, but here we use a workaround
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Re-parse for the webhook handler
    (req as express.Request & { rawBody: Buffer }).rawBody = req.body;
    next();
  }
);

/**
 * Error Handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Frontend: ${env.FRONTEND_URL}\n`);
});

export default app;
