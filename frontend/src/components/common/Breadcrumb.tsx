'use client';

import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm text-neutral-600 ${className}`}
    >
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors"
        aria-label="Home"
      >
        <FiHome className="w-4 h-4" />
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <FiChevronRight className="w-4 h-4 text-neutral-400" />
            {isLast || !item.href ? (
              <span className="text-neutral-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
