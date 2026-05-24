import type { HTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          'bg-bg-secondary text-text-primary': variant === 'default',
          'bg-success-green/20 text-success-green border border-success-green/30': variant === 'success',
          'bg-warning-amber/20 text-warning-amber border border-warning-amber/30': variant === 'warning',
          'bg-danger-red/20 text-danger-red border border-danger-red/30': variant === 'danger',
          'bg-info-blue/20 text-info-blue border border-info-blue/30': variant === 'info',
          'text-text-primary border border-border-subtle': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
