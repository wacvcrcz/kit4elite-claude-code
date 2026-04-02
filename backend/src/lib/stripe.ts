/**
 * Stripe Client
 * Initialized with environment credentials
 */

import Stripe from 'stripe';
import { env } from '@/schema/env.schema';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export default stripe;
