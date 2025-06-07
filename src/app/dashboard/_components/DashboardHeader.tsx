'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Session } from 'next-auth';
import { Breadcrumbs } from './Breadcrumbs';
import { UserProfile } from './UserProfile';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  session: Session | null;
  onSignOut: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  breadcrumbs,
  session,
  onSignOut,
  onBack,
  showBackButton = true,
  className
}: DashboardHeaderProps) {
  return (
    <header className={`p-6 border-b dashboard-border bg-gray-900/50 backdrop-blur-sm relative z-40 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Breadcrumbs items={breadcrumbs} />
          <div>
            <h1 className="text-3xl font-light dashboard-text-muted">
              {title}
            </h1>
            <h2 className="text-4xl font-bold text-red-500 mt-1">
              {subtitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative z-50">
          {showBackButton && onBack && (
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm hidden md:inline">Voltar</span>
            </button>
          )}

          {session && (
            <UserProfile session={session} onSignOut={onSignOut} />
          )}
        </div>
      </div>
    </header>
  );
}
