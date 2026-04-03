import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

/**
 * Shopify-Style Button
 * Clean, minimal buttons with sharp corners
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-200';

    const variants = {
      primary:
        'bg-foreground text-background hover:opacity-90 active:opacity-100',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-muted',
      outline:
        'border border-border bg-transparent hover:bg-muted text-foreground',
      ghost:
        'bg-transparent hover:bg-muted text-foreground',
      link:
        'bg-transparent underline-offset-4 hover:underline text-foreground',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm h-9',
      md: 'px-6 py-3 text-sm h-11',
      lg: 'px-8 py-4 text-base h-14',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variant !== 'link' && 'active:scale-[0.98]',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
