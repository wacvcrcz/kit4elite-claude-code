/**
 * Product Skeleton Loaders
 * Using react-content-loader for product loading states
 */

import type { ReactNode } from 'react';
import ContentLoader from 'react-content-loader';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  className?: string;
}

/**
 * Single product card skeleton
 */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn('rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800', className)}>
      <ContentLoader
        speed={2}
        width="100%"
        height={320}
        backgroundColor="#262626"
        foregroundColor="#404040"
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Image */}
        <rect x="0" y="0" rx="0" ry="0" width="100%" height="180" />
        {/* Category badge */}
        <rect x="12" y="196" rx="4" ry="4" width="60" height="16" />
        {/* Title */}
        <rect x="12" y="220" rx="4" ry="4" width="75%" height="20" />
        {/* Description line 1 */}
        <rect x="12" y="248" rx="4" ry="4" width="90%" height="12" />
        {/* Description line 2 */}
        <rect x="12" y="266" rx="4" ry="4" width="60%" height="12" />
        {/* Price */}
        <rect x="12" y="294" rx="4" ry="4" width="80" height="16" />
        {/* Button */}
        <rect x="75%" y="288" rx="4" ry="4" width="20%" height="28" />
      </ContentLoader>
    </div>
  );
}

/**
 * Product detail page skeleton
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <ContentLoader
        speed={2}
        width="100%"
        height={600}
        backgroundColor="#262626"
        foregroundColor="#404040"
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Back button */}
        <rect x="0" y="0" rx="4" ry="4" width="80" height="20" />

        {/* Main image */}
        <rect x="0" y="40" rx="8" ry="8" width="100%" height="400" />

        {/* Thumbnail images */}
        <rect x="0" y="460" rx="4" ry="4" width="60" height="60" />
        <rect x="72" y="460" rx="4" ry="4" width="60" height="60" />
        <rect x="144" y="460" rx="4" ry="4" width="60" height="60" />

        {/* Title */}
        <rect x="0" y="540" rx="4" ry="4" width="80%" height="32" />

        {/* Category */}
        <rect x="0" y="580" rx="4" ry="4" width="120" height="20" />

        {/* Price */}
        <rect x="0" y="620" rx="4" ry="4" width="100" height="28" />

        {/* Description */}
        <rect x="0" y="680" rx="4" ry="4" width="100%" height="12" />
        <rect x="0" y="700" rx="4" ry="4" width="90%" height="12" />
        <rect x="0" y="720" rx="4" ry="4" width="70%" height="12" />

        {/* Add to cart button */}
        <rect x="0" y="760" rx="4" ry="4" width="100%" height="48" />
      </ContentLoader>
    </div>
  );
}

/**
 * Grid of product card skeletons
 */
interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Category filter skeleton
 */
export function CategoryFilterSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
      <ContentLoader
        speed={2}
        width="100%"
        height={200}
        backgroundColor="#262626"
        foregroundColor="#404040"
      >
        {/* Title */}
        <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />

        {/* Filter items */}
        <rect x="0" y="40" rx="4" ry="4" width="100%" height="16" />
        <rect x="0" y="68" rx="4" ry="4" width="90%" height="16" />
        <rect x="0" y="96" rx="4" ry="4" width="95%" height="16" />
        <rect x="0" y="124" rx="4" ry="4" width="85%" height="16" />
        <rect x="0" y="152" rx="4" ry="4" width="70%" height="16" />
      </ContentLoader>
    </div>
  );
}

/**
 * Search/results header skeleton
 */
export function ResultsHeaderSkeleton() {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={60}
      backgroundColor="#262626"
      foregroundColor="#404040"
    >
      {/* Title */}
      <rect x="0" y="0" rx="4" ry="4" width="200" height="24" />
      {/* Sort dropdown */}
      <rect x="85%" y="0" rx="4" ry="4" width="15%" height="32" />
    </ContentLoader>
  );
}
