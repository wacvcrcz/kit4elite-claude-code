/**
 * Product Type Definitions
 * Supports both digital and physical products
 */

/**
 * Product types
 */
export type ProductType = 'digital' | 'physical';

/**
 * Product status
 */
export type ProductStatus = 'active' | 'draft' | 'archived';

/**
 * Core product data
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  price: number;
  compareAtPrice?: number | null;
  images: ProductImage[];
  category: Category;
  categoryId: string;
  status: ProductStatus;
  tags: string[];
  metadata: ProductMetadata;
  stock: number | null; // null for digital products
  downloadUrl: string | null; // null for physical products
  fileSize: string | null; // e.g., "2.4 MB" for digital
  fileFormat: string | null; // e.g., "PDF, ZIP" for digital
  weight: number | null; // grams, for physical
  dimensions: ProductDimensions | null; // for physical
  shippingProfile: ShippingProfile | null; // for physical
  createdAt: string;
  updatedAt: string;
}

/**
 * Product image
 */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

/**
 * Product dimensions (physical only)
 */
export interface ProductDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

/**
 * Shipping profile (physical only)
 */
export interface ShippingProfile {
  id: string;
  name: string;
  baseRate: number;
  freeShippingThreshold?: number;
}

/**
 * Product metadata for extended attributes
 */
export interface ProductMetadata {
  features?: string[];
  requirements?: string[]; // for digital products
  includedItems?: string[]; // for physical products
  warranty?: string;
  [key: string]: unknown;
}

/**
 * Category data
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product variant (for products with options like size/color)
 */
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number | null; // null uses product base price
  stock: number;
  options: Record<string, string>; // { size: "L", color: "Blue" }
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cart item (stored in Zustand)
 */
export interface CartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

/**
 * Cart state
 */
export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  coupon: Coupon | null;
}

/**
 * Cart actions
 */
export interface CartActions {
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

/**
 * Coupon/Discount code
 */
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount
  minPurchase?: number | null;
  maxDiscount?: number | null; // for percentage coupons
  eligibleCategories?: string[]; // category IDs
  eligibleProducts?: string[]; // product IDs
  usageLimit: number;
  usageCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product filter options
 */
export interface ProductFilter {
  category?: string;
  type?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  search?: string;
}

/**
 * Product listing response
 */
export interface ProductListResponse {
  products: Product[];
  pagination: PaginationInfo;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Product review
 */
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}
