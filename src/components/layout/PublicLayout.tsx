'use client'
import React, { useState } from "react";
import { Trophy, UserPlus, LogIn, Menu, X, Home } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

interface PublicLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackToHome?: boolean;
}

export default function PublicLayout({ title, children, showBackToHome = true }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title} - Esports League</title>
      </Head>
      
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">ESPORTS</div>
                  <div className="text-red-500 font-bold text-lg leading-none">LEAGUE</div>
                </div>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/campeonatos" className="text-slate-300 hover:text-white transition-colors">
                  Campeonatos
                </Link>
                <Link href="/#sobre" className="text-slate-300 hover:text-white transition-colors">
                  Sobre
                </Link>
                <Link href="/#contato" className="text-slate-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </nav>

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </button>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </button>
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
                <button className="w-full px-4 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center justify-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </button>
                <button className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Title */}
        {title && (
          <div className="bg-slate-800 py-2">
            <div className="container mx-auto px-4">
              <h1 className="text-lg text-white font-medium">{title}</h1>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">ESPORTS</div>
                    <div className="text-red-500 font-bold text-lg leading-none">LEAGUE</div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs">
                  A plataforma definitiva para campeonatos de Valorant profissionais e organizados.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 md:mb-4">Plataforma</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="/campeonatos" className="hover:text-white transition-colors">Campeonatos</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Equipes</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Estatísticas</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Ranking</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 md:mb-4">Suporte</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Regras</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 md:mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Privacidade</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
              <p className="text-slate-400 text-xs md:text-sm">
                © 2024 Esports League. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}