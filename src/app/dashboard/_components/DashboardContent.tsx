import React from "react";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DashboardContent() {
  const stats = [
    {
      title: "Campeonatos Ativos",
      value: "12",
      icon: Trophy,
      change: "+2 este mês",
    },
    {
      title: "Equipes Registradas",
      value: "148",
      icon: Users,
      change: "+24 esta semana",
    },
    {
      title: "Partidas Agendadas",
      value: "36",
      icon: Calendar,
      change: "+8 hoje",
    },
    {
      title: "Partidas jogadas",
      value: "73",
      icon: TrendingUp,
      change: "+ 12 este mês",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-text-muted text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stat.value}
                </p>
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
          <h3 className="text-xl font-semibold text-white mb-4">
            Campeonatos Recentes
          </h3>
          <div className="space-y-4">
            {[
              { name: "Liga de Verão 2024", teams: 16 },
              {
                name: "Torneio Nacional",
                teams: 8,
              },
              { name: "Copa Regional", teams: 24 },
            ].map((tournament, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{tournament.name}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                  {tournament.teams} equipes
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Partidas do Momento
          </h3>
          <div className="space-y-4">
            {[
              {
                match: "Time A vs Time B",
                status: "A Definir",
                tournament: "Liga de Verão",
              },
              {
                match: "Time C vs Time D",
                status: "Agendada",
                tournament: "Copa Regional",
              },
              {
                match: "Time E vs Time F",
                status: "Concluída",
                tournament: "Torneio Nacional",
              },
            ].map((match, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{match.match}</p>
                  <p className="dashboard-text-muted text-sm">
                    {match.tournament}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === "Agendada"
                      ? "bg-green-500/20 text-green-400"
                      : match.status === "Concluída"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {match.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
