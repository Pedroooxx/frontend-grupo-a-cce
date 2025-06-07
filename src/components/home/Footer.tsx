import React from 'react';
import Link from 'next/link';
import { Trophy, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">ESPORTS</div>
                <div className="text-red-500 font-bold text-lg leading-none">LEAGUE</div>
              </div>
            </Link>
            <p className="text-slate-400 max-w-md">
              Plataforma completa para criação e gerenciamento de campeonatos de Valorant. 
              Organize torneios, gerencie equipes e acompanhe estatísticas detalhadas.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#campeonatos" className="text-slate-400 hover:text-white transition-colors">
                  Campeonatos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#recursos" className="text-slate-400 hover:text-white transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="text-slate-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2024 Esports League. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}