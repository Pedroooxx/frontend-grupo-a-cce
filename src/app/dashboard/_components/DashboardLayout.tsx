'use client'
import React, { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { ArrowLeft, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

interface UserProfileProps {
  session: any;
  onSignOut: () => void;
}

// Breadcrumbs Component
function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      {items.map((crumb, index) => (
        <React.Fragment key={index}>
          <span
            className={cn(
              index === items.length - 1
                ? "text-red-500 font-medium"
                : "dashboard-text-muted hover:text-white cursor-pointer"
            )}
          >
            {crumb.label}
          </span>
          {index < items.length - 1 && (
            <span className="dashboard-text-muted">{">"}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// User Profile Component
function UserProfile({ session, onSignOut }: UserProfileProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const closeMenu = () => setShowUserMenu(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700 hover:border-gray-600"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {getUserInitials(session.user.name)}
          </span>
        </div>
        <div className="text-left hidden md:block">
          <p className="text-white font-medium text-sm">{session.user.name}</p>
          <p className="text-gray-400 text-xs">{session.user.email}</p>
        </div>
      </button>

      {/* User Dropdown Menu */}
      {showUserMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeMenu}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {getUserInitials(session.user.name)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{session.user.name}</p>
                  <p className="text-gray-400 text-sm">{session.user.email}</p>
                  <span className="inline-block px-2 py-1 mt-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {session.user.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  closeMenu();
                  onSignOut();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Header Component
interface HeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  session: any;
  onSignOut: () => void;
  onBack?: () => void;
}

function Header({ title, subtitle, breadcrumbs, session, onSignOut, onBack }: HeaderProps) {
  return (
    <header className="p-6 border-b dashboard-border bg-gray-900/50 backdrop-blur-sm relative">
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

        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm hidden md:inline">Voltar</span>
          </button>

          {session && (
            <UserProfile session={session} onSignOut={onSignOut} />
          )}
        </div>
      </div>
    </header>
  );
}

// Main Layout Component
export function DashboardLayout({
  children,
  title = "GERENCIE SEUS",
  subtitle = "CAMPEONATOS",
  breadcrumbs = [{ label: "DASHBOARD", href: "/dashboard" }, { label: "HOME" }],
}: DashboardLayoutProps) {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen dashboard-bg flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <Header
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          session={session}
          onSignOut={handleSignOut}
          onBack={handleBack}
        />

        <main className="flex-1 p-6">
          <div className="dashboard-card border dashboard-border rounded-lg min-h-[600px] border-red-500/20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
