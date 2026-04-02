import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Button variants using class-variance-authority
 * Three main variants: primary, secondary, ghost
 * Each with size variants and states
 */
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        /**
         * Primary: Filled brand color, main CTA
         */
        primary: 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-md hover:shadow-lg',
        /**
         * Secondary: Outlined, secondary actions
         */
        secondary: 'border-2 border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
        /**
         * Ghost: Minimal, subtle actions
         */
        ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100',
        /**
         * Danger: Destructive actions
         */
        danger: 'bg-error text-white hover:bg-red-600 shadow-md hover:shadow-lg',
        /**
         * Link: Text only, looks like a link
         */
        link: 'text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-8 px-3 text-xs gap-1.5',
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Button component props interface
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

/**
 * Button Component
 *
 * A flexible button component with three main variants (primary, secondary, ghost)
 * Supports icons via children, loading state, and full width option
 *
 * @example
 * <Button variant="primary" size="lg">Get Started</Button>
 * <Button variant="secondary" size="md" loading>Loading...</Button>
 * <Button variant="ghost" size="sm">Cancel</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {loading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {children}
        </Comp>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
