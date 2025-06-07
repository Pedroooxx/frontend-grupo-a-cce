import React from 'react';
import { Trophy, Users, Calendar, BarChart3, Target, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function FeaturesSection() {
  const features = [
    {
      icon: Trophy,
      title: "Gestão de Campeonatos",
      description: "Crie e organize campeonatos com diferentes formatos: Single Elimination, Double Elimination e Round Robin.",
      color: "text-red-500",
      bgColor: "bg-red-500/20"
    },
    {
      icon: Users,
      title: "Gerenciamento de Equipes",
      description: "Registre equipes, gerencie jogadores e coaches. Controle inscrições e participações.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Calendar,
      title: "Agendamento de Partidas",
      description: "Organize partidas com data, horário e mapa definidos. Acompanhe o progresso do torneio.",
      color: "text-green-500",
      bgColor: "bg-green-500/20"
    },
    {
      icon: BarChart3,
      title: "Estatísticas Detalhadas",
      description: "Visualize KDA, winrate, performance por mapa e estatísticas completas de jogadores e equipes.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20"
    },
    {
      icon: Target,
      title: "Sistema de Pontuação",
      description: "Acompanhe rankings, scores e colocações dos times ao longo dos campeonatos.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/20"
    },
    {
      icon: Shield,
      title: "Controle de Usuários",
      description: "Sistema seguro de contas para organizadores, com controle de permissões e gerenciamento.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/20"
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Recursos da <span className="text-red-500">Plataforma</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tudo que você precisa para organizar campeonatos profissionais de Valorant, 
            desde o planejamento até a análise de resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 p-8 hover:border-gray-600 transition-colors">
              <div className="space-y-4">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}