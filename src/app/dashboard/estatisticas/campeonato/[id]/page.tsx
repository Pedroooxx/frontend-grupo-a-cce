'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../../../_components/DashboardLayout';
import { Trophy, Users, Target, Calendar, MapPin, Crown, Zap, TrendingUp, Award, Timer, DollarSign } from 'lucide-react';
import { detailedChampionshipsStats, championshipTeamRankings, championshipPlayerRankings } from '@/data/data-mock';

const ChampionshipStatistics = () => {
  const params = useParams();
  const championshipId = parseInt(params.id as string) || 1;
  
  const championship = detailedChampionshipsStats.find(c => c.championship_id === championshipId) || detailedChampionshipsStats[0];
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

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`CAMPEONATO - ${championship.name.toUpperCase()}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: championship.name.toUpperCase() }
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
              <h1 className="text-3xl font-bold text-white">{championship.name}</h1>
              <p className="text-xl dashboard-text-muted mt-1">{championship.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{championship.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    {new Date(championship.start_date).toLocaleDateString('pt-BR')} - {new Date(championship.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(championship.status)}>
                {getStatusText(championship.status)}
              </Badge>
              <p className="dashboard-text-muted text-sm">
                Organizado por {championship.organizer_name}
              </p>
              {championship.prize_pool && (
                <p className="text-yellow-400 font-medium">{championship.prize_pool}</p>
              )}
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
                    <p className="text-2xl font-bold text-white">{championship.total_teams}</p>
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
                    <p className="text-2xl font-bold text-white">{championship.total_players}</p>
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
                    <p className="text-2xl font-bold text-white">{championship.matches_completed}/{championship.total_matches}</p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Timer className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Duração Média</p>
                    <p className="text-2xl font-bold text-white">{championship.avg_match_duration}min</p>
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
                    <span className="dashboard-text-muted">Formato</span>
                    <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                      {championship.format.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Progresso</span>
                    <span className="text-white font-medium">
                      {Math.round((championship.matches_completed / championship.total_matches) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Kills</span>
                    <span className="text-white font-medium">{championship.total_kills.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">KDA Médio do Torneio</span>
                    <span className="text-green-400 font-medium">
                      {(championship.total_kills / championship.total_deaths).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Destaques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Maior Killer</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {championship.most_kills_player}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Mais MVPs</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {championship.most_mvps_player}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Melhor Equipe</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {championship.best_team}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Agente Mais Usado</span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {championship.most_popular_agent}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Teams Tab */}
        {selectedTab === 'teams' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Ranking de Equipes</h2>
            <div className="grid grid-cols-1 gap-4">
              {championshipTeamRankings.map((team, index) => (
                <Card key={index} className="dashboard-card border-gray-700 p-6 hover:border-blue-500/50 hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl ${
                      team.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      team.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                      team.rank === 3 ? 'bg-amber-600/20 text-amber-600' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      #{team.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{team.team_name}</h3>
                      <p className="dashboard-text-muted text-sm">{team.matches_played} partidas jogadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">{team.wins}W - {team.losses}L</p>
                      <p className="dashboard-text-muted text-sm">Win Rate: {Math.round(team.win_rate * 100)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{team.points}</p>
                      <p className="dashboard-text-muted text-sm">pontos</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Players Tab */}
        {selectedTab === 'players' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Ranking de Jogadores</h2>
            <div className="grid grid-cols-1 gap-4">
              {championshipPlayerRankings.map((player, index) => (
                <Card key={index} className="dashboard-card border-gray-700 p-6 hover:border-green-500/50 hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl ${
                      player.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      player.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                      player.rank === 3 ? 'bg-amber-600/20 text-amber-600' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      #{player.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{player.player_name}</h3>
                      <p className="dashboard-text-muted text-sm">{player.team_name}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">KDA: {player.kda_ratio}</p>
                      <p className="dashboard-text-muted text-sm">{player.kills}K / {player.deaths}D / {player.assists}A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-400">{player.mvps}</p>
                      <p className="dashboard-text-muted text-sm">MVPs</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                <h3 className="text-xl font-bold text-white mb-6">Meta do Campeonato</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Mapa Mais Jogado</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {championship.most_played_map}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Agente Mais Popular</span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {championship.most_popular_agent}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Kills Totais</span>
                    <span className="text-white font-medium">{championship.total_kills.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Deaths Totais</span>
                    <span className="text-white font-medium">{championship.total_deaths.toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Recordes</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Maior Kills em Partida</span>
                    <span className="text-red-400 font-medium">35 kills</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Melhor KDA em Partida</span>
                    <span className="text-green-400 font-medium">4.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Partida Mais Longa</span>
                    <span className="text-white font-medium">42 rounds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Maior Comeback</span>
                    <span className="text-yellow-400 font-medium">0-9 → 13-11</span>
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
