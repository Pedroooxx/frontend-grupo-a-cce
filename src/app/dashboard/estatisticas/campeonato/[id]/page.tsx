'use client'

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../../../_components/DashboardLayout';
import { Trophy, Users, Target, Calendar, MapPin, Crown, Zap, TrendingUp, Award, Timer, DollarSign } from 'lucide-react';
import { 
  useChampionshipOverview, 
  useChampionshipTeamStatistics, 
  useChampionshipPlayerStatistics,
  useTopPlayersByChampionship
} from '@/hooks/useStatistics';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetChampionshipMatches } from '@/services/matchService';

const ChampionshipStatistics = () => {
  const params = useParams();
  const championshipId = parseInt(params.id as string) || 1;
  
  // Fetch championship statistics
  const { data: championshipOverview = {
    name: 'Campeonato não encontrado',
    status: 'unknown',
    teams_count: 0,
    matches_count: 0,
    championship_id: championshipId
  }, isLoading: isLoadingOverview } = useChampionshipOverview(championshipId);
  
  const { data: teamStats = [], isLoading: isLoadingTeamStats } = useChampionshipTeamStatistics(championshipId);
  const { data: playerStats = Array.isArray([]) ? [] : [], isLoading: isLoadingPlayerStats } = useChampionshipPlayerStatistics(championshipId);
  const { data: topPlayers = [], isLoading: isLoadingTopPlayers } = useTopPlayersByChampionship(championshipId);
  
  // Get subscriptions to calculate team counts
  const { data: subscriptionsData = [], isLoading: isLoadingSubscriptions } = useGetAllSubscriptions();
  
  // Get championship matches
  const { data: matchesData = [], isLoading: isLoadingMatches } = useGetChampionshipMatches(championshipId);
  
  // Calculate team count for this championship
  const teamCount = useMemo(() => {
    if (!subscriptionsData || !subscriptionsData.length) {
      // If championship overview has teams_count, use it
      if (championshipOverview && championshipOverview.teams_count !== undefined) {
        return championshipOverview.teams_count;
      }
      return 0;
    }
    
    // Filter subscriptions by championship_id to get unique teams
    const championshipSubscriptions = subscriptionsData.filter(
      subscription => subscription.championship_id === championshipId
    );
    // Get unique team IDs for this championship
    const uniqueTeamIds = new Set(championshipSubscriptions.map(sub => sub.team_id));
    return uniqueTeamIds.size;
  }, [subscriptionsData, championshipId, championshipOverview]);
  
  const matchCount = useMemo(() => {
    return matchesData.length;
  }, [matchesData]);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'teams' | 'players' | 'matches' | 'stats'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'Em Andamento';
      case 'completed': return 'Finalizado';
      case 'upcoming': return 'Próximo';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoadingOverview) {
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

  // Calculate additional stats from the player statistics - safely handle empty arrays or non-arrays
  const totalKills = Array.isArray(playerStats) 
    ? playerStats.reduce((acc: number, player: any) => acc + (player?.total_kills || 0), 0) 
    : 0;
    
  const totalDeaths = Array.isArray(playerStats)
    ? playerStats.reduce((acc: number, player: any) => acc + (player?.total_deaths || 0), 0) 
    : 0;
    
  const kdaRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '0';
  
  // Sort teams and players for rankings - safely handle empty arrays or non-arrays
  const sortedTeams = Array.isArray(teamStats) && teamStats.length > 0
    ? [...teamStats].sort((a: any, b: any) => (b?.points || 0) - (a?.points || 0)) 
    : [];
    
  const sortedPlayers = Array.isArray(playerStats) && playerStats.length > 0
    ? [...playerStats].sort((a: any, b: any) => (b?.kda_ratio || 0) - (a?.kda_ratio || 0)) 
    : [];

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`CAMPEONATO - ${championshipOverview?.name?.toUpperCase() || 'SEM NOME'}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: championshipOverview?.name?.toUpperCase() || 'SEM NOME' }
      ]}
    >
      <div className="p-8 space-y-8">
        {/* Championship Header */}
        <Card className="dashboard-card border-gray-700 p-6 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-purple-500/20 rounded-lg">
              <Trophy className="w-12 h-12 text-purple-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{championshipOverview.name}</h1>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    {championshipOverview?.start_date ? new Date(championshipOverview.start_date).toLocaleDateString('pt-BR') : 'Data não definida'} - 
                    {championshipOverview?.end_date ? new Date(championshipOverview.end_date).toLocaleDateString('pt-BR') : 'Data não definida'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(championshipOverview.status)}>
                {getStatusText(championshipOverview.status)}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'teams', label: 'Equipes' },
            { key: 'players', label: 'Jogadores' },
            { key: 'matches', label: 'Partidas' },
            { key: 'stats', label: 'Estatísticas' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-700 ${
                selectedTab === tab.key
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
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
              <Card className="dashboard-card border-gray-700 p-6 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Total de Equipes</p>
                    <p className="text-2xl font-bold text-white">{championshipOverview.total_teams}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Total de Jogadores</p>
                    <p className="text-2xl font-bold text-white">{championshipOverview.total_participants}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6 hover:border-green-500/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Partidas</p>
                    <p className="text-2xl font-bold text-white">{championshipOverview.total_matches}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">KDA Médio</p>
                    <p className="text-2xl font-bold text-white">{championshipOverview.highest_kda}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tournament Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Informações do Torneio</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Status</span>
                    <Badge className={getStatusColor(championshipOverview.status)}>
                      {getStatusText(championshipOverview.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Times</span>
                    <span className="text-white font-medium">{teamCount || championshipOverview.total_teams || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Partidas</span>
                    <span className="text-white font-medium">{matchCount || championshipOverview.total_matches || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">KDA Médio do Torneio</span>
                    <span className="text-green-400 font-medium">
                      {kdaRatio}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Destaques</h3>
                {isLoadingTopPlayers ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-24"></div>
                        <div className="h-5 bg-gray-700 rounded w-32"></div>
                      </div>
                    ))}
                  </div>
                ) : topPlayers.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted">Maior Killer</span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        ID: {topPlayers[0].participant_id} ({topPlayers[0].kills} kills)
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted">Mais MVPs</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        ID: {topPlayers.reduce((prev: any, current: any) => ((prev.MVPs || 0) > (current.MVPs || 0)) ? prev : current).participant_id}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted">Melhor KDA</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        ID: {topPlayers.reduce((prev: any, current: any) => 
                          ((current.kills + current.assists) / Math.max(1, current.deaths) > 
                           (prev.kills + prev.assists) / Math.max(1, prev.deaths)) 
                            ? current : prev).participant_id}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted">Maior Pontuação</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        ID: {topPlayers.reduce((prev: any, current: any) => 
                          ((current.total_score || 0) > (prev.total_score || 0)) ? current : prev).participant_id}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-400">Nenhum destaque disponível</p>
                )}
              </Card>
            </div>
          </>
        )}

        {/* Teams Tab */}
        {selectedTab === 'teams' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Ranking de Equipes</h2>
            {isLoadingTeamStats ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                    <div className="h-16 bg-gray-700 rounded w-full"></div>
                  </Card>
                ))}
              </div>
            ) : sortedTeams.length === 0 ? (
              <Card className="dashboard-card border-gray-700 p-6">
                <p className="text-center text-gray-400">Nenhuma equipe registrada para este campeonato.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sortedTeams.map((team: any, index: number) => (
                  <Card key={index} className="dashboard-card border-gray-700 p-6 hover:border-blue-500/50 hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-6">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-300/20 text-gray-300' :
                        index === 2 ? 'bg-amber-600/20 text-amber-600' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{team.team_name}</h3>
                        <p className="dashboard-text-muted text-sm">{team.matches_played || team.total_matches || 0} partidas jogadas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">{team.wins || 0}W - {team.losses || 0}L</p>
                        <p className="dashboard-text-muted text-sm">Win Rate: {team.win_rate || 0}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{team.points || 0}</p>
                        <p className="dashboard-text-muted text-sm">pontos</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Players Tab */}
        {selectedTab === 'players' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Ranking de Jogadores</h2>
            {isLoadingPlayerStats ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                    <div className="h-16 bg-gray-700 rounded w-full"></div>
                  </Card>
                ))}
              </div>
            ) : sortedPlayers.length === 0 ? (
              <Card className="dashboard-card border-gray-700 p-6">
                <p className="text-center text-gray-400">Nenhum jogador registrado para este campeonato.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sortedPlayers.map((player: any, index: number) => (
                  <Card key={index} className="dashboard-card border-gray-700 p-6 hover:border-green-500/50 hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-6">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-300/20 text-gray-300' :
                        index === 2 ? 'bg-amber-600/20 text-amber-600' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">ID: {player.participant_id}</h3>
                        <p className="dashboard-text-muted text-sm">{player.team_name || "Time não informado"}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">KDA: {player.kda_ratio?.toFixed(2) || "0.00"}</p>
                        <p className="dashboard-text-muted text-sm">
                          {player.kills || 0}K / {player.deaths || 0}D / {player.assists || 0}A
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-400">{player.MVPs || 0}</p>
                        <p className="dashboard-text-muted text-sm">MVPs</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Matches Tab */}
        {selectedTab === 'matches' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Partidas do Campeonato</h2>
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">Funcionalidade em Desenvolvimento</h3>
                <p className="text-gray-500">As informações detalhadas das partidas estarão disponíveis em breve.</p>
              </div>
            </Card>
          </div>
        )}

        {/* Stats Tab */}
        {selectedTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Estatísticas Detalhadas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Estatísticas Gerais</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Kills</span>
                    <span className="text-white font-medium">{totalKills}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Deaths</span>
                    <span className="text-white font-medium">{totalDeaths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">KDA Médio</span>
                    <span className="text-green-400 font-medium">{kdaRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Maior Kill</span>
                    <span className="text-white font-medium">{championshipOverview.highest_kills}</span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Registros do Campeonato</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Início do Campeonato</span>
                    <span className="text-white font-medium">
                      {new Date(championshipOverview.start_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Término do Campeonato</span>
                    <span className="text-white font-medium">
                      {new Date(championshipOverview.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Status</span>
                    <Badge className={getStatusColor(championshipOverview.status)}>
                      {getStatusText(championshipOverview.status)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChampionshipStatistics;
