'use client';

import React from "react";
import { Trophy, Users, Calendar, TrendingUp, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { 
  detailedTeamsStats,
  detailedPlayersStats,
  championshipParticipations,
  mapPerformanceStats,
  recentMatches,
  topPerformers
} from "@/data/statistics-mock";

export function DashboardContent() {
  const { data: session } = useSession();
  
  // Calculate statistics based on actual data following ERD structure
  const totalTeams = detailedTeamsStats.length;
  const totalParticipants = detailedPlayersStats.length;
  const totalMatches = detailedTeamsStats.reduce((acc, team) => acc + (team.total_matches || 0), 0) / 2;
  const activeChampionships = championshipParticipations.filter(c => c.status === "Em andamento").length;
  const totalKills = detailedPlayersStats.reduce((acc, player) => acc + (player.total_kills || 0), 0);
  const totalMVPs = detailedPlayersStats.reduce((acc, player) => acc + (player.total_mvps || 0), 0);

  const stats = [
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

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid with integrated Welcome Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Welcome Card - spans 2 columns */}
        {session && (
          <Card className="dashboard-card border-gray-700 p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 md:col-span-2">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {getUserInitials(session.user.name)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {getTimeOfDay()}, {session.user.name.split(' ')[0]}!
                </h2>
                <p className="text-gray-400">
                  Aqui está um resumo das suas atividades de hoje
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
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
        {/* Recent Championships */}
        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Campeonatos Recentes
          </h3>
          <div className="space-y-4">
            {championshipParticipations.slice(0, 4).map((championship, index) => (
              <div
                key={championship.championship_id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{championship.championship_name}</p>
                  <p className="dashboard-text-muted text-sm">
                    {championship.matches_played} partidas jogadas
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Map Performance */}
        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Performance por Mapa
          </h3>
          <div className="space-y-4">
            {mapPerformanceStats.slice(0, 4).map((map, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{map.map_name}</p>
                  <p className="dashboard-text-muted text-sm">
                    {map.matches_played} partidas jogadas
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {Math.round(map.win_rate * 100)}% WR
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

      {/* Additional Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Partidas Recentes
          </h3>
          <div className="space-y-4">
            {recentMatches.slice(0, 3).map((match) => (
              <div
                key={match.match_id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">
                    {match.team_a} vs {match.team_b}
                  </p>
                  <p className="dashboard-text-muted text-sm">
                    {match.map} • {match.tournament}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    {match.score_a}-{match.score_b}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {match.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="dashboard-card border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Top Performers
          </h3>
          <div className="space-y-4">
            {topPerformers.slice(0, 3).map((performer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{performer.player_name}</p>
                  <p className="dashboard-text-muted text-sm">
                    {performer.team_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                    {performer.kd_ratio} K/D
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {performer.mvp_count} MVPs
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
