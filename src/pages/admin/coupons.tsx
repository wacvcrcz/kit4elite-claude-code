/**
 * Admin Coupons Page
 * CRUD for discount codes
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Percent, DollarSign, Calendar, Tag, Copy } from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Coupon } from '@/types';

interface CouponFormData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  usageLimit: number;
  expiresAt: string | null;
  eligibleCategories: string[];
}

const initialFormData: CouponFormData = {
  code: '',
  type: 'percentage',
  value: 10,
  minPurchase: null,
  maxDiscount: null,
  usageLimit: 100,
  expiresAt: null,
  eligibleCategories: [],
};

// Mock data
const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minPurchase: 50,
    maxDiscount: null,
    eligibleCategories: [],
    eligibleProducts: [],
    usageLimit: 500,
    usageCount: 234,
    expiresAt: '2024-12-31',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    code: 'FLASH50',
    type: 'fixed',
    value: 50,
    minPurchase: 200,
    maxDiscount: null,
    eligibleCategories: [],
    eligibleProducts: [],
    usageLimit: 100,
    usageCount: 89,
    expiresAt: '2024-03-31',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    code: 'SUMMER2024',
    type: 'percentage',
    value: 15,
    minPurchase: null,
    maxDiscount: 100,
    eligibleCategories: [],
    eligibleProducts: [],
    usageLimit: 1000,
    usageCount: 0,
    expiresAt: '2024-08-31',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    code: 'EXPIRED50',
    type: 'percentage',
    value: 50,
    minPurchase: null,
    maxDiscount: null,
    eligibleCategories: [],
    eligibleProducts: [],
    usageLimit: 500,
    usageCount: 500,
    expiresAt: '2023-12-31',
    isActive: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
];

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      expiresAt: coupon.expiresAt,
      eligibleCategories: coupon.eligibleCategories || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCoupon) {
      const updated: Coupon = {
        ...editingCoupon,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? updated : c)));
      toast.success('Coupon updated');
    } else {
      const newCoupon: Coupon = {
        id: Math.random().toString(36).substring(2),
        ...formData,
        usageCount: 0,
        isActive: true,
        eligibleProducts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success('Coupon created');
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success('Coupon deleted');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  };

  const isExpired = (expiresAt: string | null) => {
    return expiresAt ? new Date(expiresAt) < new Date() : false;
  };

  const isDepleted = (coupon: Coupon) => {
    return coupon.usageCount >= coupon.usageLimit;
  };

  return (
    <AdminLayout title="Coupons">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Discount Codes</h2>
            <p className="text-neutral-400 text-sm">
              Create and manage promotional codes
            </p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-xl border p-4 ${
                  coupon.isActive && !isExpired(coupon.expiresAt) && !isDepleted(coupon)
                    ? 'border-primary-500/30 bg-primary-500/5'
                    : 'border-neutral-800 bg-neutral-900'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {coupon.type === 'percentage' ? (
                      <Percent className="w-5 h-5 text-primary-400" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-primary-400" />
                    )}
                    <span className="font-display font-semibold text-lg">
                      {coupon.type === 'percentage'
                        ? `${coupon.value}% off`
                        : `$${coupon.value} off`}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4 text-neutral-400" />
                    </button>
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-neutral-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Code */}
                <div className="bg-neutral-800/50 rounded-lg p-3 mb-4">
                  <code className="font-mono text-lg tracking-wider">
                    {coupon.code}
                  </code>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-neutral-400">
                  {coupon.minPurchase && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Min purchase: ${coupon.minPurchase}</span>
                    </div>
                  )}
                  {coupon.maxDiscount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Max discount: ${coupon.maxDiscount}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {coupon.expiresAt
                        ? `Expires ${formatDate(coupon.expiresAt)}`
                        : 'No expiration'}
                    </span>
                  </div>
                </div>

                {/* Usage */}
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-neutral-400">Usage</span>
                    <span className="font-medium">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (coupon.usageCount / coupon.usageLimit) >= 0.9
                          ? 'bg-red-500'
                          : 'bg-primary-500'
                      }`}
                      style={{
                        width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 flex gap-2">
                  {isExpired(coupon.expiresAt) ? (
                    <Badge variant="ghost" className="text-neutral-500">
                      Expired
                    </Badge>
                  ) : isDepleted(coupon) ? (
                    <Badge variant="error">Fully Used</Badge>
                  ) : coupon.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No coupons found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Code */}
              <Input
                label="Coupon Code *"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="SUMMER2024"
                required
              />

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'percentage' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      formData.type === 'percentage'
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'fixed' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      formData.type === 'fixed'
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    Fixed Amount
                  </button>
                </div>
              </div>

              {/* Value */}
              <Input
                label={`${formData.type === 'percentage' ? 'Percentage' : 'Amount'} *`}
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                }
                placeholder={formData.type === 'percentage' ? '20' : '50'}
                required
              />

              {/* Min Purchase */}
              <Input
                label="Minimum Purchase (optional)"
                type="number"
                value={formData.minPurchase || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minPurchase: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                placeholder="50"
              />

              {/* Max Discount (for percentage) */}
              {formData.type === 'percentage' && (
                <Input
                  label="Max Discount (optional)"
                  type="number"
                  value={formData.maxDiscount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscount: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="100"
                />
              )}

              {/* Usage Limit */}
              <Input
                label="Usage Limit *"
                type="number"
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: parseInt(e.target.value) || 1,
                  })
                }
                required
              />

              {/* Expiration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiration Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiresAt: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
