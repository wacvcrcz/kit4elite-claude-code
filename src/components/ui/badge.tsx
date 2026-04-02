import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge variants using class-variance-authority
 * Multiple variants for different semantic meanings
 */
const badgeVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        /**
         * Default: Subtle background for general use
         */
        default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
        /**
         * Primary: Brand color emphasis
         */
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
        /**
         * Secondary: Outline style
         */
        secondary: 'border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300',
        /**
         * Success: Positive status
         */
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        /**
         * Warning: Caution status
         */
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        /**
         * Error: Negative/critical status
         */
        error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        /**
         * Info: Neutral information
         */
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        /**
         * Outline: Bordered badge
         */
        outline: 'border border-current text-neutral-700 dark:text-neutral-300',
        /**
         * Ghost: Minimal badge
         */
        ghost: 'text-neutral-600 dark:text-neutral-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Badge component props interface
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Optional dot indicator for status badges
   */
  dot?: boolean;
  /**
   * Dot color - only used when dot is true
   */
  dotColor?: string;
}

/**
 * Badge Component
 *
 * A compact element for displaying status, labels, or counts
 * Supports dot indicators and multiple semantic variants
 *
 * @example
 * <Badge variant="primary" size="md">New</Badge>
 * <Badge variant="success" dot dotColor="bg-emerald-500">Active</Badge>
 * <Badge variant="secondary" size="sm">5 items</Badge>
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot = false, dotColor, children, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              dotColor || 'bg-current'
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
