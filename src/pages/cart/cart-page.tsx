/**
 * Cart Page
 * Persistent cart display with quantity controls and coupon application
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  X,
  Package,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

/**
 * Cart Item Row Component
 */
function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCartStore();
  const product = item.product;
  const variant = item.variant;
  const isDigital = product.type === 'digital';
  const maxStock = isDigital ? 99 : product.stock ?? 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 border-b border-neutral-800 last:border-b-0"
    >
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
        {product.images[0] ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            <Package className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="font-display font-medium hover:text-primary-400 transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" size="sm">
                {isDigital ? (
                  <>
                    <Download className="w-3 h-3 mr-1" />
                    Digital
                  </>
                ) : (
                  <>
                    <Package className="w-3 h-3 mr-1" />
                    Physical
                  </>
                )}
              </Badge>
              {variant && (
                <span className="text-sm text-neutral-400">
                  {variant.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              removeFromCart(item.productId, item.variantId)
            }
            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-neutral-700 rounded-lg">
            {!isDigital ? (
              <>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1, item.variantId)
                  }
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1, item.variantId)
                  }
                  disabled={item.quantity >= maxStock}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            ) : (
              <span className="px-3 py-1 text-sm text-neutral-400">
                Instant delivery
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-display font-semibold">
              {formatPrice(
                (variant?.price ?? product.price) * item.quantity
              )}
            </p>
            <p className="text-sm text-neutral-500">
              {formatPrice(variant?.price ?? product.price)} each
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Coupon Input Component
 */
function CouponInput() {
  const [code, setCode] = useState('');
  const { couponCode, coupon, applyCoupon, removeCoupon } = useCartStore();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    await applyCoupon(code.trim().toUpperCase());
    setCode('');
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span className="text-sm">
            Code: <span className="font-medium text-emerald-400">{coupon.code}</span>
          </span>
        </div>
        <button
          onClick={removeCoupon}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="pl-10"
        />
      </div>
      <Button type="submit" variant="secondary" size="md">
        Apply
      </Button>
    </form>
  );
}

/**
 * Cart Summary Component
 */
function CartSummary({ onCheckout }: { onCheckout: () => void }) {
  const { getSubtotal, getDiscount, getTotal, items } = useCartStore();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6 space-y-6">
        <h3 className="font-display text-xl font-semibold">Order Summary</h3>

        {/* Coupon */}
        <CouponInput />

        {/* Totals */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Discount</span>
              <span className="text-emerald-400">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base pt-3 border-t border-neutral-800">
            <span className="font-medium">Total</span>
            <span className="font-display text-xl font-semibold text-primary-400">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Checkout
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <p className="text-xs text-center text-neutral-500">
          Secure checkout powered by Stripe
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Empty Cart State
 */
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
        <ShoppingCart className="w-12 h-12 text-neutral-600" />
      </div>
      <h2 className="font-display text-2xl font-semibold mb-2">
        Your cart is empty
      </h2>
      <p className="text-neutral-400 mb-6 text-center max-w-md">
        Looks like you haven't added any products yet. Browse our collection to
        find something you'll love.
      </p>
      <Button variant="primary" size="lg" asChild>
        <Link to="/products">Browse Products</Link>
      </Button>
    </div>
  );
}

/**
 * Main Cart Page
 */
export function CartPage() {
  const navigate = useNavigate();
  const { items, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-4xl font-semibold">Shopping Cart</h1>
          <p className="text-neutral-400 mt-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow key={item.productId} item={item} />
                  ))}
                </AnimatePresence>
              </Card>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Button variant="ghost" asChild>
                  <Link to="/products">← Continue Shopping</Link>
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <CartSummary onCheckout={() => navigate('/checkout')} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
