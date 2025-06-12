import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <img src="/images/logo.png" alt="Esports League" className="h-10" />
            </Link>
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
  );
}