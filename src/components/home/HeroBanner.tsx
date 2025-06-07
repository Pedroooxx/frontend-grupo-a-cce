import React from 'react';
import Link from 'next/link';
import { Trophy, Users, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                GERENCIE
                <span className="block text-red-500">CAMPEONATOS</span>
                <span className="text-3xl lg:text-4xl text-gray-300 font-normal">
                  de Valorant
                </span>
              </h1>
            </div>

            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Plataforma completa para organizar torneios profissionais de Valorant. 
              Crie campeonatos, gerencie equipes, agende partidas e acompanhe estatísticas detalhadas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Criar Campeonato
              </Button>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg w-full sm:w-auto"
                >
                  Ver Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-gray-400 text-sm">Campeonatos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-gray-400 text-sm">Equipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-gray-400 text-sm">Jogadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-gray-400 text-sm">Partidas</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-red-500/20 to-gray-800/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <Trophy className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-white font-semibold">Campeonatos</div>
                  <div className="text-gray-400 text-sm">Organize torneios</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-white font-semibold">Equipes</div>
                  <div className="text-gray-400 text-sm">Gerencie times</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-white font-semibold">Partidas</div>
                  <div className="text-gray-400 text-sm">Agende jogos</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-white font-semibold">Estatísticas</div>
                  <div className="text-gray-400 text-sm">Acompanhe dados</div>
                </div>
              </div>
            </div>            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}