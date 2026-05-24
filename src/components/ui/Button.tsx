import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from './Badge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80': variant === 'default',
            'bg-danger-red text-white hover:bg-danger-red/90': variant === 'destructive',
            'border border-border-subtle bg-bg-card hover:bg-bg-secondary hover:text-text-primary': variant === 'outline',
            'bg-accent-gold text-bg-primary hover:bg-accent-gold/80': variant === 'secondary',
            'hover:bg-bg-secondary hover:text-text-primary': variant === 'ghost',
            'text-text-primary underline-offset-4 hover:underline': variant === 'link',
            
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-10 rounded-md px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
