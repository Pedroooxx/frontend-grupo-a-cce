'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../../../_components/DashboardLayout';
import { Users, Trophy, Target, TrendingUp, User, Crown, Shield } from 'lucide-react';
import { 
  useTeamStatistics, 
  useTeamAgentStatistics, 
  useTeamMapStatistics, 
  useTeamChampionshipHistory,
  useTeamParticipantStatistics
} from '@/hooks/useStatistics';
import { AgentStatistic, MapStatistic, TeamSummaryStatistic, ParticipantStatistic } from '@/types/statistics';
import { useGetAllParticipants, TeamParticipant } from '@/services/teamService';

// Fallback data to use when API calls fail
const fallbackTeamData: TeamSummaryStatistic = {
  team_id: 0,
  team_name: "Equipe não encontrada",
  total_kills: 0,
  total_deaths: 0,
  total_assists: 0,
  total_matches: 0,
  wins: 0,
  losses: 0,
  win_rate: 0,
  mvp_count: 0,
  avg_match_score: 0,
};

const fallbackMapStats: MapStatistic[] = [];
const fallbackAgentStats: AgentStatistic[] = [];

interface ChampionshipHistoryEntry {
  championship_name: string;
  start_date: string;
  end_date: string;
  placement: number;
  status: string;
  matches_played: number;
}

const TeamStatistics = () => {
  const params = useParams();
  const teamId = parseInt(params?.id as string) || 1;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'players'>('overview');
  // Remove 'championships' and 'performance' tabs from the navigation
  const tabs = [
    { key: 'overview', label: 'Visão Geral' },
    { key: 'players', label: 'Jogadores' }
  ];  
  // Fetch team data from API
  const { data: teamData, isLoading: isLoadingTeamSummary } = useTeamStatistics(teamId);
  const { data: teamParticipantStats = [], isLoading: isLoadingParticipantStats } = useTeamParticipantStatistics(teamId);
  const { data: teamAgentStats = [], isLoading: isLoadingAgentStats } = useTeamAgentStatistics(teamId);
  const { data: teamMapStats = [], isLoading: isLoadingMapStats } = useTeamMapStatistics(teamId);
  const { data: championshipHistory = [], isLoading: isLoadingChampHistory } = useTeamChampionshipHistory(teamId);
  const { data: teamParticipants = [], isLoading: isLoadingParticipants } = useGetAllParticipants();
  
  // Use fallback data if the API call fails or returns null
  const team: TeamSummaryStatistic = (teamData && teamData.team_id > 0) ? teamData : fallbackTeamData;
  
  // Use fallback data if the API calls fail
  const mapStatsData = Array.isArray(teamMapStats) && teamMapStats.length > 0 ? teamMapStats : fallbackMapStats;
  const agentStatsData = Array.isArray(teamAgentStats) && teamAgentStats.length > 0 ? teamAgentStats : fallbackAgentStats;

  // Calculate aggregated stats from teamParticipantStats safely
  const aggregatedStats = {
    totalKills: Array.isArray(teamParticipantStats) ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.kills || 0), 0) : 0,
    totalDeaths: Array.isArray(teamParticipantStats) ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.deaths || 0), 0) : 0,
    totalAssists: Array.isArray(teamParticipantStats) ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.assists || 0), 0) : 0,
    totalSpikePlants: Array.isArray(teamParticipantStats) ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.spike_plants || 0), 0) : 0,
    totalSpikeDefuses: Array.isArray(teamParticipantStats) ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.spike_defuses || 0), 0) : 0,
    totalMVPs: Array.isArray(teamParticipantStats) ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.MVP || 0), 0) : 0,
    avgSpikePlants: Array.isArray(teamParticipantStats) && teamParticipantStats.length > 0 
      ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.spike_plants || 0), 0) / teamParticipantStats.length 
      : 0,
    avgSpikeDefuses: Array.isArray(teamParticipantStats) && teamParticipantStats.length > 0 
      ? teamParticipantStats.reduce((acc, stat) => acc + (stat?.spike_defuses || 0), 0) / teamParticipantStats.length 
      : 0,
  };
  
  // Get best and worst maps safely
  const bestMap = Array.isArray(mapStatsData) && mapStatsData.length > 0 
    ? mapStatsData.reduce((prev, current) => 
        ((prev?.win_rate || 0) > (current?.win_rate || 0)) ? prev : current, mapStatsData[0])
    : null;
    
  const worstMap = Array.isArray(mapStatsData) && mapStatsData.length > 0
    ? mapStatsData.reduce((prev, current) => 
        ((prev?.win_rate || 0) < (current?.win_rate || 0)) ? prev : current, mapStatsData[0])
    : null;
  
  // Filter participants for this team - use participant stats to find team members
  const teamPlayers = teamParticipants.filter((participant: TeamParticipant) => {
    // Check if this participant has stats for the current team
    return Array.isArray(teamParticipantStats) && 
           teamParticipantStats.some((stat: ParticipantStatistic) => 
             stat.participant_id === participant.participant_id && stat.team_id === team.team_id
           );
  });

  // Calculate team KDA
  const teamKda = team && team.total_deaths > 0 
    ? ((team.total_kills + team.total_assists) / team.total_deaths).toFixed(2)
    : "0";

  const isLoading = isLoadingTeamSummary || isLoadingParticipantStats || isLoadingAgentStats || isLoadingMapStats || isLoadingChampHistory;

  // Check if the team exists or if we have an error state
  if (!isLoading && (!team || !team.team_id || team.team_name === "Equipe não encontrada")) {
    return (
      <DashboardLayout
        title="ESTATÍSTICAS"
        subtitle="EQUIPE NÃO ENCONTRADA"
        breadcrumbs={[
          { label: "DASHBOARD", href: "/dashboard" },
          { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
          { label: "EQUIPE NÃO ENCONTRADA" }
        ]}
      >
        <div className="p-8 space-y-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="text-center space-y-4">
              <Users className="w-16 h-16 text-gray-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Equipe não encontrada</h2>
              <p className="text-gray-400">A equipe com ID {teamId} não foi encontrada no sistema.</p>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="ESTATÍSTICAS"
        subtitle="CARREGANDO..."
        breadcrumbs={[
          { label: "DASHBOARD", href: "/dashboard" },
          { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
          { label: "CARREGANDO..." }
        ]}
      >
        <div className="p-8 space-y-8">
          <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
            <div className="h-20 bg-gray-700 rounded w-full"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`EQUIPE - ${team.team_name.toUpperCase()}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: team.team_name.toUpperCase() }
      ]}
    >
      <div className="p-8 space-y-8">
        {/* Team Header */}
        <Card className="dashboard-card border-gray-700 p-6">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{team.team_name}</h1>
              <p className="text-lg text-blue-400">{teamPlayers.length} jogadores registrados</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {championshipHistory.length > 0 ? 
                  championshipHistory.filter((c: ChampionshipHistoryEntry) => c.placement === 1).length : 
                  0} Títulos
              </Badge>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'players', label: 'Jogadores' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                selectedTab === tab.key
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <>
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">KDA da Equipe</p>
                    <p className="text-2xl font-bold text-white">{teamKda}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Total MVPs</p>
                    <p className="text-2xl font-bold text-white">{aggregatedStats.totalMVPs}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Score Médio</p>
                    <p className="text-2xl font-bold text-white">{Math.round(team.avg_match_score)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Estatísticas de Combate</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Kills</span>
                    <span className="text-white font-medium">{team.total_kills}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Deaths</span>
                    <span className="text-white font-medium">{team.total_deaths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Assists</span>
                    <span className="text-white font-medium">{team.total_assists}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Partidas Jogadas</span>
                    <span className="text-white font-medium">{team.total_matches}</span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Performance Especial</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Spike Plants (Média)</span>
                    <span className="text-white font-medium">{aggregatedStats.avgSpikePlants.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Spike Defuses (Média)</span>
                    <span className="text-white font-medium">{aggregatedStats.avgSpikeDefuses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Melhor Mapa</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {bestMap ? bestMap.map_name : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Pior Mapa</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {worstMap ? worstMap.map_name : 'N/A'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Players Tab */}
        {selectedTab === 'players' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Elenco da Equipe</h2>
            {isLoadingParticipantStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                    <div className="h-24 bg-gray-700 rounded w-full mb-3"></div>
                    <div className="h-16 bg-gray-700 rounded w-full"></div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamPlayers.length === 0 ? (
                  <Card className="dashboard-card border-gray-700 p-6 col-span-full">
                    <p className="text-center text-gray-400">Nenhum jogador encontrado para esta equipe.</p>
                  </Card>
                ) : (
                  teamPlayers.map((player: TeamParticipant) => {
                    // Find statistics for this participant
                    const playerStats = Array.isArray(teamParticipantStats) 
                      ? teamParticipantStats.filter((stat: ParticipantStatistic) => stat.participant_id === player.participant_id)
                      : [];
                    
                    const kills = playerStats.reduce((acc: number, stat: ParticipantStatistic) => acc + (stat.kills || 0), 0);
                    const deaths = playerStats.reduce((acc: number, stat: ParticipantStatistic) => acc + (stat.deaths || 0), 0);
                    const assists = playerStats.reduce((acc: number, stat: ParticipantStatistic) => acc + (stat.assists || 0), 0);
                    const mvps = playerStats.reduce((acc: number, stat: ParticipantStatistic) => acc + (stat.MVP || 0), 0);
                    const kda = deaths > 0 ? ((kills + assists) / deaths).toFixed(2) : 'Perfect';
                    
                    return (
                      <Card key={player.participant_id} className="dashboard-card border-gray-700 p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <User className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{player.nickname}</h3>
                            <p className="dashboard-text-muted text-sm">{player.name}</p>
                            <Badge className={player.is_coach 
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                            }>
                              {player.is_coach ? 'Técnico' : 'Jogador'}
                            </Badge>
                          </div>
                        </div>
                        {!player.is_coach && (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="dashboard-text-muted text-sm">KDA</span>
                              <span className="text-white font-medium">{kda}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="dashboard-text-muted text-sm">Kills/Deaths/Assists</span>
                              <span className="text-white font-medium">{kills}/{deaths}/{assists}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="dashboard-text-muted text-sm">MVPs</span>
                              <span className="text-yellow-400 font-medium">{mvps}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="dashboard-text-muted text-sm">Partidas</span>
                              <span className="text-white font-medium">{playerStats.length}</span>
                            </div>
                          </div>
                        )}
                        {player.is_coach && (
                          <div className="text-center text-gray-400 text-sm">
                            Responsável técnico da equipe
                          </div>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamStatistics;
