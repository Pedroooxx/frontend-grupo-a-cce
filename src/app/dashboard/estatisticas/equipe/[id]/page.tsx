'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../../../_components/DashboardLayout';
import { Users, Trophy, Target, TrendingUp, User, Crown, Shield } from 'lucide-react';
import { detailedTeamsStats, championshipParticipations, detailedPlayersStats } from '@/data/statistics-mock';

const TeamStatistics = () => {
  const params = useParams();
  const teamId = parseInt(params.id as string) || 1;
  
  const team = detailedTeamsStats.find(t => t.team_id === teamId) || detailedTeamsStats[0];
  const teamPlayers = detailedPlayersStats.filter(p => p.team_name === team.name);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'players' | 'championships' | 'performance'>('overview');

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`EQUIPE - ${team.name.toUpperCase()}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: team.name.toUpperCase() }
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
              <h1 className="text-3xl font-bold text-white">{team.name}</h1>
              <p className="text-xl dashboard-text-muted">Gerenciado por {team.manager_name}</p>
              <p className="text-lg text-blue-400">{team.active_players} jogadores ativos</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {team.championships_won} Títulos
              </Badge>
              <p className="dashboard-text-muted text-sm">
                {Math.round(team.win_rate * 100)}% Taxa de Vitória
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
                    <p className="text-2xl font-bold text-white">{team.team_kda}</p>
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
                    <p className="text-2xl font-bold text-white">{team.total_mvps}</p>
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
                    <span className="text-white font-medium">{team.avg_spike_plants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Spike Defuses (Média)</span>
                    <span className="text-white font-medium">{team.avg_spike_defuses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Melhor Mapa</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {team.best_map}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Pior Mapa</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {team.worst_map}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamPlayers.map((player, index) => (
                <Card key={index} className="dashboard-card border-gray-700 p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{player.nickname}</h3>
                      <p className="dashboard-text-muted text-sm">{player.name}</p>
                      <Badge className={`${player.is_coach ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                        {player.is_coach ? 'Técnico' : 'Jogador'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">KDA</span>
                      <span className="text-white font-medium">{player.kda_ratio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">Win Rate</span>
                      <span className="text-green-400 font-medium">{Math.round(player.win_rate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">MVPs</span>
                      <span className="text-yellow-400 font-medium">{player.total_mvps}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                    <p className="text-2xl font-bold text-white">{team.championships_participated}</p>
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
                    <p className="text-2xl font-bold text-white">{team.championships_won}</p>
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
                    <p className="text-2xl font-bold text-white">{Math.round((team.championships_won / team.championships_participated) * 100)}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <h2 className="text-2xl font-bold text-white">Histórico de Campeonatos</h2>
            <div className="grid grid-cols-1 gap-6">
              {championshipParticipations.map((championship, index) => (
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
                      <p className="dashboard-text-muted text-sm">{championship.score} pontos</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {selectedTab === 'performance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Análise de Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recordes da Equipe</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Maior Sequência de Vitórias</span>
                    <span className="text-green-400 font-medium">8 jogos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Maior Pontuação em Partida</span>
                    <span className="text-white font-medium">425 pontos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Melhor KDA em Partida</span>
                    <span className="text-white font-medium">3.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Partida Mais Longa</span>
                    <span className="text-white font-medium">28 rounds</span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Tendências</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Performance Últimos 10 Jogos</span>
                    <span className="text-green-400 font-medium">+15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Evolução KDA</span>
                    <span className="text-green-400 font-medium">+0.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Melhoria Win Rate</span>
                    <span className="text-green-400 font-medium">+8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Consistência</span>
                    <span className="text-blue-400 font-medium">85%</span>
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

export default TeamStatistics;
