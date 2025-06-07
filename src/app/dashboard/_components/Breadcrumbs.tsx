'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm mb-4", className)}>
      {items.map((crumb, index) => (
        <React.Fragment key={index}>
          {crumb.href ? (
            <Link
              href={crumb.href}
              className={cn(
                "dashboard-text-muted hover:text-white transition-colors cursor-pointer",
                index === items.length - 1 && "text-red-500 font-medium"
              )}
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              className={cn(
                index === items.length - 1
                  ? "text-red-500 font-medium"
                  : "dashboard-text-muted"
              )}
            >
              {crumb.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="dashboard-text-muted">{">"}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
