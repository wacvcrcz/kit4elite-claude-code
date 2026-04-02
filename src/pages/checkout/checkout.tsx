/**
 * Checkout Page with Stripe Integration
 * Handles payment for digital and physical products
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  Download, 
  Lock,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Package
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import type { PaymentIntent } from '@/types';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize payment intent when page loads
    // This would call your backend API in production
    setLoading(false);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-3xl mx-auto px-4">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="font-display text-3xl font-semibold mb-8">Secure Checkout</h1>
        
        <div className="grid gap-8">
          {/* Payment Form placeholder */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Payment Method</h2>
                <p className="text-sm text-neutral-400">Powered by Stripe</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-primary-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Secure</span>
              </div>
            </div>

            {/* Shipping Form */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-neutral-400 uppercase tracking-wider">
                Shipping Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-400">First Name</label>
                  <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Last Name</label>
                  <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-400">Address</label>
                <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 mt-1" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-lg transition-colors">
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
