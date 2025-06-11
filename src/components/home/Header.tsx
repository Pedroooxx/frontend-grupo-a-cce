import React from 'react';
import Link from 'next/link';
import { Trophy, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">          {/* Logo */}          <Link href="/" className="flex items-center">
            <img src="/images/logo.png" alt="Esports League" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#campeonatos" className="text-gray-300 hover:text-white transition-colors">
              Campeonatos
            </Link>
            <Link href="#sobre" className="text-gray-300 hover:text-white transition-colors">
              Sobre
            </Link>
            <Link href="#recursos" className="text-gray-300 hover:text-white transition-colors">
              Recursos
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Entrar
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Criar Conta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link href="#campeonatos" className="text-gray-300 hover:text-white transition-colors">
                Campeonatos
              </Link>
              <Link href="#sobre" className="text-gray-300 hover:text-white transition-colors">
                Sobre
              </Link>
              <Link href="#recursos" className="text-gray-300 hover:text-white transition-colors">
                Recursos
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" className="text-gray-300 hover:text-white justify-start">
                  Entrar
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white justify-start">
                  Criar Conta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}