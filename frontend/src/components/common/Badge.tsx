import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rental' | 'sale' | 'new' | 'featured' | 'outofstock' | 'lowstock';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'sale', size = 'md', className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 font-semibold rounded-full';
  
  const variants = {
    rental: 'text-white bg-primary-600',
    sale: 'text-white bg-success',
    new: 'text-white bg-info',
    featured: 'text-neutral-900 bg-secondary-400',
    outofstock: 'text-white bg-error',
    lowstock: 'text-neutral-900 bg-warning',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };
  
  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
