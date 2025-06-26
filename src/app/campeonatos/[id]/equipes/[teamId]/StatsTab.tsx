'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Users, TrendingUp, Crosshair, Award } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { KDATooltipContent } from '@/components/statistics/KDATooltipContent';
import { KillsTooltipContent } from '@/components/statistics/KillsTooltipContent';
import { useAllPlayersSummary } from '@/hooks/useStatistics';

interface StatsTabProps {
  teamId: number;
  championshipId: number;
  teamName: string;
  players: any[];
}

export const StatsTab: React.FC<StatsTabProps> = ({ 
  teamId, 
  championshipId, 
  teamName, 
  players 
}) => {
  const { data: allPlayers = [], isLoading: isLoadingPlayers } = useAllPlayersSummary();

  // Filter players for this specific team (coaches should have 0 stats anyway)
  const teamPlayers = allPlayers.filter(player => 
    player.team_id === teamId && 
    (player.total_kills > 0 || player.total_deaths > 0 || player.total_assists > 0)
  );

  // Calculate team aggregated statistics
  const teamStats = teamPlayers.reduce((acc, player) => ({
    totalKills: acc.totalKills + (player.total_kills || 0),
    totalDeaths: acc.totalDeaths + (player.total_deaths || 0),
    totalAssists: acc.totalAssists + (player.total_assists || 0),
    totalMatches: acc.totalMatches + (player.total_matches || 0),
    totalMVPs: acc.totalMVPs + (player.mvp_count || 0),
    totalWins: acc.totalWins + (player.wins || 0),
  }), {
    totalKills: 0,
    totalDeaths: 0,
    totalAssists: 0,
    totalMatches: 0,
    totalMVPs: 0,
    totalWins: 0,
  });

  // Calculate team KDA
  const teamKDA = teamStats.totalDeaths > 0 
    ? ((teamStats.totalKills + teamStats.totalAssists) / teamStats.totalDeaths).toFixed(2)
    : ((teamStats.totalKills + teamStats.totalAssists)).toFixed(2);

  // Calculate team win rate
  const teamWinRate = teamStats.totalMatches > 0
    ? Math.round((teamStats.totalWins / teamStats.totalMatches) * 100)
    : 0;

  // Sort players by KDA for ranking
  const sortedPlayers = [...teamPlayers].sort((a, b) => {
    const aKDA = typeof a.kda_ratio === 'number' ? a.kda_ratio : parseFloat(a.kda_ratio || '0');
    const bKDA = typeof b.kda_ratio === 'number' ? b.kda_ratio : parseFloat(b.kda_ratio || '0');
    return bKDA - aKDA;
  });

  if (isLoadingPlayers) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 p-6 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-20"></div>
                  <div className="h-6 bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Overall Statistics */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          Estatísticas Gerais da Equipe
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-red-500/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total de Kills</p>
                <p className="text-2xl font-bold text-white">{teamStats.totalKills}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Crosshair className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">KDA da Equipe</p>
                <Tooltip content={<KDATooltipContent />}>
                  <p className="text-2xl font-bold text-white cursor-help">{teamKDA}</p>
                </Tooltip>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Taxa de Vitória</p>
                <p className="text-2xl font-bold text-white">{teamWinRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total MVPs</p>
                <p className="text-2xl font-bold text-white">{teamStats.totalMVPs}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Individual Player Statistics */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users className="w-5 h-5 text-blue-500 mr-2" />
          Estatísticas dos Jogadores
        </h3>
        
        {sortedPlayers.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-8">
            <div className="text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma estatística encontrada para os jogadores desta equipe.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => {
              const kda = typeof player.kda_ratio === 'number' 
                ? player.kda_ratio.toFixed(2) 
                : parseFloat(player.kda_ratio || '0').toFixed(2);
              
              const winRate = player.total_matches > 0
                ? Math.round((player.wins / player.total_matches) * 100)
                : 0;

              return (
                <Card key={player.participant_id} className="bg-slate-800 border-slate-700 p-6 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' : 'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{player.nickname}</p>
                        <p className="text-slate-400">{player.name}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-slate-400 text-xs">K/D/A</p>
                        <p className="text-white font-medium">
                          <span className="text-green-400">{player.total_kills}</span>/
                          <span className="text-red-400">{player.total_deaths}</span>/
                          <span className="text-blue-400">{player.total_assists}</span>
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-xs">KDA</p>
                        <Tooltip content={<KDATooltipContent />}>
                          <p className="text-white font-medium cursor-help">{kda}</p>
                        </Tooltip>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-xs">Taxa de Vitória</p>
                        <p className="text-green-400 font-medium">{winRate}%</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-xs">MVPs</p>
                        <p className="text-yellow-400 font-medium">{player.mvp_count || 0}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Distribuição de Kills</h4>
          <div className="space-y-3">
            {sortedPlayers.slice(0, 5).map((player) => {
              const percentage = teamStats.totalKills > 0 
                ? Math.round((player.total_kills / teamStats.totalKills) * 100)
                : 0;
              
              return (
                <div key={player.participant_id} className="flex items-center justify-between">
                  <span className="text-slate-300">{player.nickname}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm font-medium">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Performance Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Partidas Jogadas:</span>
              <span className="text-white font-medium">{Math.round(teamStats.totalMatches / Math.max(1, teamPlayers.length))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Média de Kills por Jogo:</span>
              <span className="text-white font-medium">
                {teamStats.totalMatches > 0 
                  ? (teamStats.totalKills / teamStats.totalMatches).toFixed(1)
                  : '0.0'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Melhor Jogador (KDA):</span>
              <span className="text-white font-medium">
                {sortedPlayers[0]?.nickname || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total de Assists:</span>
              <span className="text-white font-medium">{teamStats.totalAssists}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};