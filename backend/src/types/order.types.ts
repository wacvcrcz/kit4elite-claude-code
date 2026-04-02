/**
 * Order Type Definitions
 */

import type { OrderStatus, ProductType } from '@prisma/client';

/**
 * Cart item for checkout
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

/**
 * Checkout session request
 */
export interface CreateCheckoutSessionRequest {
  items: CartItem[];
  couponCode?: string;
}

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
  success: true;
  data: {
    sessionId: string;
    sessionUrl: string;
  };
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

/**
 * Order item in response
 */
export interface OrderItemResponse {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
  productId: string;
  productType: ProductType;
  images: string[];
}

/**
 * Order in response
 */
export interface OrderResponse {
  id: string;
  status: OrderStatus;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  couponCode?: string;
  items: OrderItemResponse[];
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Download token response
 */
export interface DownloadTokenResponse {
  success: true;
  data: {
    token: string;
    expiresAt: string;
  };
}

/**
 * Admin stats response
 */
export interface AdminStatsResponse {
  success: true;
  data: {
    totalRevenue: number;
    ordersCount: {
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
    topProducts: Array<{
      id: string;
      name: string;
      totalSold: number;
      totalRevenue: number;
    }>;
    recentOrders: OrderResponse[];
  };
}
