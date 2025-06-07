import React from 'react';
import { Trophy, Target, Users, BarChart3 } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                A Plataforma Completa para
                <span className="block text-red-500">Esports Profissional</span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Nossa plataforma foi desenvolvida especificamente para organizadores de torneios de Valorant, 
                oferecendo todas as ferramentas necessárias para criar experiências profissionais.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Desde o cadastro de equipes até a geração de relatórios estatísticos, 
                centralizamos tudo em uma interface intuitiva e poderosa.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">100%</div>
                <div className="text-gray-400">Focado em Valorant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
                <div className="text-gray-400">Disponibilidade</div>
              </div>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-6">
                <Trophy className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-white font-semibold mb-2">Campeonatos</h3>
                <p className="text-gray-400 text-sm">
                  Organize torneios com diferentes formatos e estruturas
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                <BarChart3 className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-white font-semibold mb-2">Analytics</h3>
                <p className="text-gray-400 text-sm">
                  Relatórios detalhados e estatísticas em tempo real
                </p>
              </div>
            </div>
            
            <div className="space-y-6 mt-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                <Users className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-white font-semibold mb-2">Equipes</h3>
                <p className="text-gray-400 text-sm">
                  Gerencie times, jogadores e participações
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
                <Target className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-white font-semibold mb-2">Performance</h3>
                <p className="text-gray-400 text-sm">
                  Acompanhe KDA, winrate e rankings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}