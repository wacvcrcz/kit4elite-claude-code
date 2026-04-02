/**
 * Environment Variables Schema
 * Zod validation for environment variables — server crashes if invalid
 */

import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  API_URL: z.string().url().default('http://localhost:3001'),

  // Database
  DATABASE_URL: z.string().startsWith('postgresql://', {
    message: 'DATABASE_URL must be a PostgreSQL connection string',
  }),

  // JWT
  JWT_SECRET: z.string().min(32, {
    message: 'JWT_SECRET must be at least 32 characters',
  }),
  JWT_REFRESH_SECRET: z.string().min(32, {
    message: 'JWT_REFRESH_SECRET must be at least 32 characters',
  }),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', {
    message: 'STRIPE_SECRET_KEY must start with sk_',
  }),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', {
    message: 'STRIPE_WEBHOOK_SECRET must start with whsec_',
  }),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', {
    message: 'STRIPE_PUBLISHABLE_KEY must start with pk_',
  }),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_REGION: z.string().default('us-east-1'),

  // Email
  RESEND_API_KEY: z.string().startsWith('re_', {
    message: 'RESEND_API_KEY must start with re_',
  }),
  FROM_EMAIL: z.string().email().default('noreply@luxe.com'),

  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

/**
 * Parse and validate environment variables
 * Throws error if missing or invalid — server refuses to start
 */
function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => `  ❌ ${err.path.join('.')}: ${err.message}`)
      .join('\n');

    console.error('\n🛑 Environment validation failed:\n');
    console.error(formattedErrors);
    console.error('\n📝 Copy .env.example to .env and configure all variables.\n');
    process.exit(1);
  }

  return result.data;
}

// Parse once — crash on invalid
export const env = parseEnv();

export type Env = typeof env;
