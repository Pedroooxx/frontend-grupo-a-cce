'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Session } from 'next-auth';

interface UserProfileProps {
  session: Session;
  onSignOut: () => void;
  className?: string;
}

export function UserProfile({ session, onSignOut, className }: UserProfileProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getUserInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const closeMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  const handleSignOut = useCallback(() => {
    closeMenu();
    onSignOut();
  }, [closeMenu, onSignOut]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu, closeMenu]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    if (showUserMenu) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [showUserMenu, closeMenu]);

  return (
    <div className={`relative z-50 ${className}`}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700 hover:border-gray-600 relative z-50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        aria-expanded={showUserMenu}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {getUserInitials(session.user?.name || '')}
          </span>
        </div>
        <div className="text-left hidden md:block">
          <p className="text-white font-medium text-sm">{session.user?.name}</p>
          <p className="text-gray-400 text-xs">{session.user?.email}</p>
        </div>
      </button>

      {/* User Dropdown Menu */}
      {showUserMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[110] animate-in fade-in-0 zoom-in-95 duration-100"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {getUserInitials(session.user?.name || '')}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{session.user?.name}</p>
                <p className="text-gray-400 text-sm">{session.user?.email}</p>
                {session.user?.role && (
                  <span className="inline-block px-2 py-1 mt-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {session.user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors focus:outline-none focus:bg-red-500/10"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
