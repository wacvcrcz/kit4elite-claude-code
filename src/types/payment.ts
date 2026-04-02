/**
 * Payment Type Definitions
 * Stripe integration types
 */

/**
 * Payment intent status
 */
export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

/**
 * Payment intent from Stripe
 */
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: PaymentIntentStatus;
  amount: number;
  currency: string;
}

/**
 * Checkout session
 */
export interface CheckoutSession {
  id: string;
  url: string;
  status: 'open' | 'complete' | 'expired';
}

/**
 * Payment method
 */
export interface PaymentMethod {
  id: string;
  type: 'card';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

/**
 * Shipping address
 */
export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Order status from server
 */
export type ServerOrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
