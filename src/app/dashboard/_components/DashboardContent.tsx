'use client';

import React from "react";
import { Trophy, Users, Calendar, TrendingUp, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useAllPlayersSummary, useAllTeamsSummary } from "@/hooks/useStatistics";
import { championshipParticipations } from "@/data/data-mock";
import { CardHeader } from "@/components/ui/CardHeader";

export function DashboardContent() {
  const { data: session } = useSession();
  const { data: players = [], isLoading: isLoadingPlayers } = useAllPlayersSummary();
  const { data: teams = [], isLoading: isLoadingTeams } = useAllTeamsSummary();
  
  // Calculate statistics based on data from API
  const totalTeams = teams.length;
  const totalParticipants = players.length;
  
  // Match count calculation needs to be updated when matches API is available
  const totalMatches = teams.reduce((acc, team) => acc + (team.total_matches || 0), 0) / 2;
  
  // Will be replaced with data from Championship API
  const activeChampionships = championshipParticipations.filter(c => c.status === "Em andamento").length;
  
  const totalKills = players.reduce((acc, player) => acc + (player.total_kills || 0), 0);
  const totalMVPs = players.reduce((acc, player) => acc + (player.mvp_count || 0), 0);

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


  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      {isLoadingPlayers || isLoadingTeams ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="dashboard-text-muted text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers Card */}
        <Card className="dashboard-card border-gray-700 p-6">
          <CardHeader 
            icon={<Trophy />}
            title="Top Performers"
            iconBgClass="bg-yellow-500/20"
            iconColorClass="text-yellow-500"
          />
          {isLoadingPlayers ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                        <div className="h-3 bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                      <div className="h-3 bg-gray-700 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {players.slice(0, 5).map((player, index) => (
                <div key={player.participant_id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-gray-600'
                      }`}>
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium">{player.nickname}</p>
                      <p className="dashboard-text-muted text-sm">{player.team_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {typeof player.kda_ratio === 'number' ? player.kda_ratio.toFixed(2) : '0.00'} KDA
                    </p>
                    <p className="dashboard-text-muted text-sm">{player.total_kills || 0} kills</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Matches Card */}
        <Card className="dashboard-card border-gray-700 p-6">
          <CardHeader 
            icon={<Calendar />}
            title="Partidas Recentes"
            iconBgClass="bg-blue-500/20"
            iconColorClass="text-blue-500"
          />
          <div className="space-y-4">
            <div className="text-center text-gray-500">
              Carregando dados de partidas recentes...
            </div>
            {/* Will be populated when Match API is available */}
          </div>
        </Card>
      </div>
    </div>
  );
}
