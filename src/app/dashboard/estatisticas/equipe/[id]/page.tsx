'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../../../_components/DashboardLayout';
import { Users, Trophy, Target, TrendingUp, User, Crown, Shield } from 'lucide-react';
import { 
  useTeamStatistics, 
  useAllTeamsSummary, 
  useTeamAgentStatistics, 
  useTeamMapStatistics, 
  useTeamChampionshipHistory 
} from '@/hooks/useStatistics';

const TeamStatistics = () => {
  const params = useParams();
  const teamId = parseInt(params.id as string) || 1;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'players' | 'championships' | 'performance'>('overview');
  
  // Fetch team data from API
  const { data: teamsSummary = [], isLoading: isLoadingTeamSummary } = useAllTeamsSummary();
  const { data: teamStats = [], isLoading: isLoadingTeamStats } = useTeamStatistics(teamId);
  const { data: teamAgentStats = [], isLoading: isLoadingAgentStats } = useTeamAgentStatistics(teamId);
  const { data: teamMapStats = [], isLoading: isLoadingMapStats } = useTeamMapStatistics(teamId);
  const { data: championshipHistory = [], isLoading: isLoadingChampHistory } = useTeamChampionshipHistory(teamId);
  
  // Find the team in the summary data
  const team = teamsSummary.find(t => t.team_id === teamId);

  // Calculate aggregated stats from teamStats
  const aggregatedStats = {
    totalKills: teamStats.reduce((acc, stat) => acc + stat.kills, 0),
    totalDeaths: teamStats.reduce((acc, stat) => acc + stat.deaths, 0),
    totalAssists: teamStats.reduce((acc, stat) => acc + stat.assists, 0),
    totalSpikePlants: teamStats.reduce((acc, stat) => acc + (stat.spike_plants || 0), 0),
    totalSpikeDefuses: teamStats.reduce((acc, stat) => acc + (stat.spike_defuses || 0), 0),
    totalMVPs: teamStats.reduce((acc, stat) => acc + (stat.MVPs || 0), 0),
    avgSpikePlants: teamStats.length > 0 ? teamStats.reduce((acc, stat) => acc + (stat.spike_plants || 0), 0) / teamStats.length : 0,
    avgSpikeDefuses: teamStats.length > 0 ? teamStats.reduce((acc, stat) => acc + (stat.spike_defuses || 0), 0) / teamStats.length : 0,
  };
  
  // Get best and worst maps
  const bestMap = teamMapStats.length > 0 
    ? teamMapStats.reduce((prev, current) => (prev.win_rate > current.win_rate) ? prev : current)
    : null;
    
  const worstMap = teamMapStats.length > 0
    ? teamMapStats.reduce((prev, current) => (prev.win_rate < current.win_rate) ? prev : current)
    : null;
  
  // Group participants by their statistics for the team
  const teamPlayers = teamStats.reduce((acc, stat) => {
    if (!acc[stat.participant_id]) {
      acc[stat.participant_id] = {
        participant_id: stat.participant_id,
        stats: []
      };
    }
    acc[stat.participant_id].stats.push(stat);
    return acc;
  }, {} as Record<number, { participant_id: number, stats: typeof teamStats }>) || {};

  // Calculate team KDA
  const teamKda = team && team.total_deaths > 0 
    ? ((team.total_kills + team.total_assists) / team.total_deaths).toFixed(2)
    : "0";

  const isLoading = isLoadingTeamSummary || isLoadingTeamStats || isLoadingAgentStats || isLoadingMapStats;

  if (isLoadingTeamSummary || !team) {
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
              <p className="text-lg text-blue-400">{Object.keys(teamPlayers).length} jogadores registrados</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {championshipHistory.length > 0 ? 
                  championshipHistory.filter((c: any) => c.placement === 1).length : 
                  0} Títulos
              </Badge>
              <p className="dashboard-text-muted text-sm">
                {team.win_rate}% Taxa de Vitória
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'players', label: 'Jogadores' },
            { key: 'championships', label: 'Campeonatos' },
            { key: 'performance', label: 'Performance' }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Vitórias</p>
                    <p className="text-2xl font-bold text-white">{team.wins}</p>
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
            {isLoadingTeamStats ? (
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
                {Object.values(teamPlayers).map((player) => {
                  const playerStats = player.stats;
                  const kills = playerStats.reduce((acc, stat) => acc + stat.kills, 0);
                  const deaths = playerStats.reduce((acc, stat) => acc + stat.deaths, 0);
                  const assists = playerStats.reduce((acc, stat) => acc + stat.assists, 0);
                  const mvps = playerStats.reduce((acc, stat) => acc + (stat.MVPs || 0), 0);
                  const kda = deaths > 0 ? ((kills + assists) / deaths).toFixed(2) : 'Perfect';
                  
                  // We need additional player data that isn't in teamStats
                  // Would need to fetch from another endpoint to get complete data
                  return (
                    <Card key={player.participant_id} className="dashboard-card border-gray-700 p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <User className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">ID: {player.participant_id}</h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Jogador
                          </Badge>
                        </div>
                      </div>
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
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Championships Tab */}
        {selectedTab === 'championships' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Participações</p>
                    <p className="text-2xl font-bold text-white">{championshipHistory.length || 0}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Títulos</p>
                    <p className="text-2xl font-bold text-white">
                      {championshipHistory.length > 0 ? 
                        championshipHistory.filter((c: any) => c.placement === 1).length : 
                        0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-white">
                      {championshipHistory.length > 0 ? 
                        Math.round((championshipHistory.filter((c: any) => c.placement === 1).length / championshipHistory.length) * 100) :
                        0}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <h2 className="text-2xl font-bold text-white">Histórico de Campeonatos</h2>
            {isLoadingChampHistory ? (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                    <div className="h-16 bg-gray-700 rounded w-full"></div>
                  </Card>
                ))}
              </div>
            ) : championshipHistory.length === 0 ? (
              <Card className="dashboard-card border-gray-700 p-6">
                <p className="text-center text-gray-400">Nenhum campeonato registrado para esta equipe.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {championshipHistory.map((championship: any, index: number) => (
                  <Card key={index} className="dashboard-card border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">{championship.championship_name}</h3>
                        <p className="dashboard-text-muted text-sm">{championship.matches_played} partidas jogadas</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={`${
                          championship.status === 'Finalizado' 
                            ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {championship.status}
                        </Badge>
                        <p className="text-white font-medium">#{championship.placement}º Lugar</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {selectedTab === 'performance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Análise de Performance</h2>
            {isLoadingMapStats ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-40 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-700 rounded w-full"></div>
                    ))}
                  </div>
                </Card>
                <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-40 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-700 rounded w-full"></div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="dashboard-card border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Performance por Mapa</h3>
                  <div className="space-y-4">
                    {teamMapStats.map((mapStat, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="dashboard-text-muted">{mapStat.map_name}</span>
                        <span className={mapStat.win_rate > 50 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                          {mapStat.win_rate}% ({mapStat.wins}W - {mapStat.losses}L)
                        </span>
                      </div>
                    ))}
                    {teamMapStats.length === 0 && (
                      <p className="text-center text-gray-400">Nenhuma estatística de mapa disponível.</p>
                    )}
                  </div>
                </Card>

                <Card className="dashboard-card border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Performance por Agente</h3>
                  <div className="space-y-4">
                    {teamAgentStats.map((agentStat, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="dashboard-text-muted">{agentStat.agent_name || `Agent ${agentStat.agent_id}`}</span>
                        <span className="text-white font-medium">
                          KDA: {agentStat.kda_ratio.toFixed(2)} ({agentStat.win_rate}% Win Rate)
                        </span>
                      </div>
                    ))}
                    {teamAgentStats.length === 0 && (
                      <p className="text-center text-gray-400">Nenhuma estatística de agente disponível.</p>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamStatistics;
