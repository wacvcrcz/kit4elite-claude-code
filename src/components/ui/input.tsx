import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Input variants for different visual styles
 */
const inputVariants = cva(
  // Base styles
  'flex w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: '',
        error: 'border-error focus-visible:ring-error/20 focus-visible:border-error',
        success: 'border-emerald-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * Input component props
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message displayed below the input
   */
  error?: string;
  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  /**
   * Ref for direct access to the input element
   */
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * Input Component
 *
 * A flexible text input with support for labels, icons, error states, and sizing
 * Fully controlled component with no plain HTML form dependencies
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={errors.email}
 * />
 */
const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({
    className,
    size,
    state,
    fullWidth,
    label,
    helperText,
    error,
    startIcon,
    endIcon,
    inputRef,
    id,
    ...props
  }, ref) => {
    const inputId = id || React.useId();
    const hasError = !!error || state === 'error';
    const currentState = hasError ? 'error' : state;

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={inputRef}
            className={cn(
              inputVariants({ size, state: currentState }),
              startIcon && 'pl-10',
              endIcon && 'pr-10'
            )}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-neutral-500 dark:text-neutral-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
