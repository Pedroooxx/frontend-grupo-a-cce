'use client'
import React, { useState } from "react";
import { Trophy, UserPlus, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onAuthAction?: (action: 'signin' | 'signup' | 'dashboard') => void;
}

export default function Header({ onAuthAction }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuthAction = (action: 'signin' | 'signup' | 'dashboard') => {
    if (onAuthAction) {
      onAuthAction(action);
    } else {
      if (action === 'dashboard') {
        router.push('/dashboard');
      } else {
        router.push(`/auth/${action}`);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Esports League" className="h-10" />
            </Link>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {!session ? (
                <>
                  <button 
                    onClick={() => handleAuthAction('signin')}
                    className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </button>
                  <button 
                    onClick={() => handleAuthAction('signup')}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleAuthAction('dashboard')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className={`absolute right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4 mb-8">
              <Link 
                href="/campeonatos" 
                className="block text-slate-300 hover:text-white text-lg py-2 border-b border-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Campeonatos
              </Link>
              <Link 
                href="/#sobre" 
                className="block text-slate-300 hover:text-white text-lg py-2 border-b border-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                href="/#contato" 
                className="block text-slate-300 hover:text-white text-lg py-2 border-b border-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {!session ? (
                <>
                  <button 
                    onClick={() => { setIsMenuOpen(false); handleAuthAction('signin'); }}
                    className="w-full px-4 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center justify-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </button>
                  <button 
                    onClick={() => { setIsMenuOpen(false); handleAuthAction('signup'); }}
                    className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { setIsMenuOpen(false); handleAuthAction('dashboard'); }}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}