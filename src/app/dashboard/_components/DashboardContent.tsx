import React from "react";
import { Trophy, Users, Calendar, TrendingUp, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  detailedTeamsStats,
  detailedPlayersStats,
  championshipParticipations,
  mapPerformanceStats
} from "@/data/statistics-mock";

export function DashboardContent() {
  // Calculate statistics based on actual data following ERD structure
  const totalTeams = detailedTeamsStats.length;
  const totalParticipants = detailedPlayersStats.length;
  const totalMatches = detailedTeamsStats.reduce((acc, team) => acc + team.total_matches, 0) / 2; // Each match counted twice
  const activeChampionships = championshipParticipations.filter(c => c.status === "Em andamento").length;
  const totalKills = detailedPlayersStats.reduce((acc, player) => acc + player.total_kills, 0);
  const totalMVPs = detailedPlayersStats.reduce((acc, player) => acc + player.total_mvps, 0);  const stats = [
    {
      title: "Campeonatos Ativos",
      value: activeChampionships.toString(),
      icon: Trophy,
    },
    {
      title: "Equipes Registradas",
      value: totalTeams.toString(),
      icon: Users,
    },
    {
      title: "Partidas Jogadas",
      value: Math.floor(totalMatches).toString(),
      icon: Calendar,
    },
    {
      title: "Total de Kills",
      value: totalKills.toString(),
      icon: Target,
    },
    {
      title: "Participantes Ativos",
      value: totalParticipants.toString(),
      icon: TrendingUp,
    },
    {
      title: "MVPs Conquistados",
      value: totalMVPs.toString(),
      icon: Award,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="dashboard-card border-gray-700 p-6">            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-text-muted text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stat.value}
                </p>
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
          </h3>          <div className="space-y-4">
            {championshipParticipations.slice(0, 3).map((championship, index) => (
              <div
                key={championship.championship_id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >                <div>
                  <p className="text-white font-medium">{championship.championship_name}</p>
                  <p className="dashboard-text-muted text-sm">
                    {championship.matches_played} partidas jogadas
                  </p>
                </div>
                <div className="text-right">                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    championship.status === "Em andamento"
                      ? "bg-green-500/20 text-green-400"
                      : championship.status === "Finalizado"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {championship.status}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    ID: {championship.championship_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Performance por Mapa
          </h3>
          <div className="space-y-4">
            {mapPerformanceStats.slice(0, 4).map((map, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >                <div>
                  <p className="text-white font-medium">{map.map_name}</p>
                  <p className="dashboard-text-muted text-sm">
                    Performance geral no mapa
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {map.total_kills} Kills
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {map.total_kills}K / {map.total_deaths}D
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
