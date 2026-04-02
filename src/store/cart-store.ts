/**
 * Cart Store using Zustand
 * Persistent cart with coupon support
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { CartState, CartActions, CartItem, Coupon, Product } from '@/types';

/**
 * Combined cart store type
 */
type CartStore = CartState & CartActions;

/**
 * Initial state factory
 */
const initialState: CartState = {
  items: [],
  couponCode: null,
  discountAmount: 0,
  coupon: null,
};

/**
 * Calculate subtotal of cart items
 */
function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.variant?.price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
}

/**
 * Calculate discount amount
 */
function calculateDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || !coupon.isActive) return 0;

  // Check minimum purchase
  if (coupon.minPurchase && subtotal < coupon.minPurchase) return 0;

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    // Apply max discount cap
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    // Fixed amount
    discount = Math.min(coupon.value, subtotal);
  }

  return discount;
}

/**
 * Cart Store
 * Persisted to localStorage for cart persistence
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Add item to cart
       */
      addToCart: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingIndex >= 0) {
          // Update quantity
          const updatedItems = [...items];
          const maxStock = item.variant?.stock ?? item.product.stock ?? Infinity;
          const newQuantity = Math.min(
            updatedItems[existingIndex].quantity + (item.quantity ?? 1),
            maxStock
          );

          if (newQuantity === updatedItems[existingIndex].quantity) {
            toast.error('Maximum available quantity reached');
            return;
          }

          updatedItems[existingIndex].quantity = newQuantity;
          set({ items: updatedItems });
          toast.success('Updated quantity in cart');
        } else {
          // Add new item
          set({
            items: [...items, { ...item, quantity: item.quantity ?? 1 }],
          });
          toast.success('Added to cart');
        }
      },

      /**
       * Remove item from cart
       */
      removeFromCart: (productId, variantId = null) => {
        const { items } = get();
        const filteredItems = items.filter(
          (item) =>
            !(item.productId === productId && item.variantId === variantId)
        );
        set({ items: filteredItems });
        toast.success('Removed from cart');
      },

      /**
       * Update item quantity
       */
      updateQuantity: (productId, quantity, variantId = null) => {
        const { items, coupon } = get();

        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }

        const updatedItems = items.map((item) => {
          if (
            item.productId === productId &&
            item.variantId === variantId
          ) {
            const maxStock = item.variant?.stock ?? item.product.stock ?? Infinity;
            const clampedQuantity = Math.min(quantity, maxStock);
            return { ...item, quantity: clampedQuantity };
          }
          return item;
        });

        const subtotal = calculateSubtotal(updatedItems);
        const discount = calculateDiscount(subtotal, coupon);

        set({ items: updatedItems, discountAmount: discount });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({ ...initialState });
        toast.success('Cart cleared');
      },

      /**
       * Apply coupon code
       */
      applyCoupon: async (code) => {
        try {
          const coupon = await api.get<Coupon>(`/coupons/validate/${code}`);

          if (!coupon.isActive) {
            toast.error('This coupon is not active');
            return false;
          }

          if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            toast.error('This coupon has expired');
            return false;
          }

          if (coupon.usageCount >= coupon.usageLimit) {
            toast.error('This coupon has reached its usage limit');
            return false;
          }

          const subtotal = calculateSubtotal(get().items);

          if (coupon.minPurchase && subtotal < coupon.minPurchase) {
            toast.error(
              `Minimum purchase of $${coupon.minPurchase} required`
            );
            return false;
          }

          const discount = calculateDiscount(subtotal, coupon);

          set({
            couponCode: code,
            coupon,
            discountAmount: discount,
          });

          toast.success(`Coupon applied: ${code}`);
          return true;
        } catch {
          toast.error('Invalid coupon code');
          return false;
        }
      },

      /**
       * Remove coupon
       */
      removeCoupon: () => {
        set({ couponCode: null, coupon: null, discountAmount: 0 });
        toast.success('Coupon removed');
      },

      /**
       * Get cart subtotal (before discount)
       */
      getSubtotal: () => calculateSubtotal(get().items),

      /**
       * Get discount amount
       */
      getDiscount: () => get().discountAmount,

      /**
       * Get cart total after discount
       */
      getTotal: () => {
        const subtotal = calculateSubtotal(get().items);
        return subtotal - get().discountAmount;
      },

      /**
       * Get total number of items in cart
       */
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /**
       * Get cart total (alias for getTotal)
       */
      getCartTotal: () => {
        return get().getTotal();
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook to check if product is in cart
 */
export function useIsInCart(productId: string, variantId?: string | null): boolean {
  return useCartStore((state) =>
    state.items.some(
      (item) =>
        item.productId === productId && item.variantId === (variantId ?? null)
    )
  );
}

/**
 * Hook to get cart item quantity
 */
export function useCartItemQuantity(
  productId: string,
  variantId?: string | null
): number {
  return useCartStore(
    (state) =>
      state.items.find(
        (item) =>
          item.productId === productId && item.variantId === (variantId ?? null)
      )?.quantity ?? 0
  );
}
