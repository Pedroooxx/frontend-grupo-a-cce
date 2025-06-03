
import React from 'react';
// TODO implement missing card component by adding shadcn/ui to project
import { Card } from '@/components/ui/card';
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';

export function DashboardContent() {
  const stats = [
    {
      title: 'Campeonatos Ativos',
      value: '12',
      icon: Trophy,
      change: '+2 este mês'
    },
    {
      title: 'Equipes Registradas',
      value: '148',
      icon: Users,
      change: '+24 esta semana'
    },
    {
      title: 'Partidas Agendadas',
      value: '36',
      icon: Calendar,
      change: '+8 hoje'
    },
    {
      title: 'Taxa de Participação',
      value: '94%',
      icon: TrendingUp,
      change: '+5% vs. mês anterior'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-text-muted text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-green-400 text-sm mt-1">{stat.change}</p>
              </div>
              <div className="dashboard-card p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Campeonatos Recentes</h3>
          <div className="space-y-4">
            {[
              { name: 'Liga de Verão 2024', status: 'Em andamento', teams: 16 },
              { name: 'Torneio Nacional', status: 'Inscriçõesabertas', teams: 8 },
              { name: 'Copa Regional', status: 'Finalizado', teams: 24 }
            ].map((tournament, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{tournament.name}</p>
                  <p className="dashboard-text-muted text-sm">{tournament.teams} equipes</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tournament.status === 'Em andamento' 
                    ? 'bg-green-500/20 text-green-400'
                    : tournament.status === 'Inscriçõesabertas'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {tournament.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Próximas Partidas</h3>
          <div className="space-y-4">
            {[
              { match: 'Time A vs Time B', date: 'Hoje, 14:00', tournament: 'Liga de Verão' },
              { match: 'Time C vs Time D', date: 'Amanhã, 16:30', tournament: 'Copa Regional' },
              { match: 'Time E vs Time F', date: '15/12, 18:00', tournament: 'Torneio Nacional' }
            ].map((match, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{match.match}</p>
                  <p className="dashboard-text-muted text-sm">{match.tournament}</p>
                </div>
                <p className="text-red-400 text-sm font-medium">{match.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
