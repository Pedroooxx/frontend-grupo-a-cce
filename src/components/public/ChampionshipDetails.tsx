'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetChampionshipTeamHistory } from '@/services/matchService';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  Clock, 
  MapPin, 
  Crown, 
  Target, 
  Zap, 
  Star 
} from 'lucide-react';
import { 
  useGetChampionshipById, 
  useGetChampionshipMatches
} from '@/services/championshipService';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetAllTeams } from '@/services/teamService';

interface LocalTeam {
  team_id: number;
  name: string;
  manager_name: string;
  wins: number;
  losses: number;
  win_rate: number;
  participants_count: number;
}

interface ChampionshipDetailsProps {
  championshipId: number;
  championshipName: string;
}

export function ChampionshipDetails({
  championshipId
}: ChampionshipDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'matches' | 'teams'>('overview');
  const router = useRouter();
  // Fetch championship data using React Query (API)
  const {
    data: championshipData,
    isLoading: isLoadingChampionship,
    isError: isChampionshipError,
  } = useGetChampionshipById(championshipId);

  // Fetch subscriptions to count teams for this championship
  const {
    data: subscriptionsData = [],
    isLoading: isLoadingSubscriptions,
  } = useGetAllSubscriptions();

  // Fetch matches for this championship to count them
  const {
    data: championshipMatches = [],
    isLoading: isLoadingMatches,
  } = useGetChampionshipMatches(championshipId);

  // Fetch all teams to get details for teams in this championship
  const {
    data: allTeams = [],
    isLoading: isLoadingTeams,
  } = useGetAllTeams();

  // Fetch match statistics for teams in this championship
  const {
    data: teamStatistics = {},
    isLoading: isLoadingTeamStats,
  } = useGetChampionshipTeamHistory(championshipId);

  /**
   * Get teams for this championship using subscription data
   */
  const championshipTeams = useMemo(() => {
    if (!subscriptionsData.length || !allTeams.length) {
      return [];
    }

    // Filter subscriptions by championship_id to get team IDs
    const championshipSubscriptions = subscriptionsData.filter(
      subscription => subscription.championship_id === championshipId
    );

    // Get unique team IDs for this championship
    const teamIds = new Set(championshipSubscriptions.map(sub => sub.team_id));

    // Find teams that are subscribed to this championship
    const teamsInChampionship = allTeams.filter(team => teamIds.has(team.team_id));

    // Map to LocalTeam interface with calculated win rate from actual matches
    const teamsWithStats = teamsInChampionship.map(team => {
      // Get real statistics from matches or default to 0
      const stats = teamStatistics[team.team_id] || {
        team_id: team.team_id,
        wins: 0,
        losses: 0,
        total_matches: 0,
        win_rate: 0
      };

      // Get manager name from participants
      const coach = team.Participants?.find(p => p.is_coach);
      const manager_name = coach?.name || 'Sem técnico';

      return {
        team_id: team.team_id,
        name: team.name,
        manager_name,
        wins: stats.wins,
        losses: stats.losses,
        win_rate: stats.win_rate,
        total_matches: stats.total_matches,
        participants_count: team.Participants?.length || 0,
      };
    });

    // Sort teams by win rate (descending), then by total wins, then by name
    return teamsWithStats.sort((a, b) => {
      if (a.win_rate !== b.win_rate) {
        return b.win_rate - a.win_rate; // Higher win rate first
      }
      if (a.wins !== b.wins) {
        return b.wins - a.wins; // More wins first
      }
      return a.name.localeCompare(b.name); // Alphabetical by name
    });
  }, [subscriptionsData, allTeams, championshipId, teamStatistics]);

  /**
   * Count teams for this championship using subscription data
   */
  const getTeamCountForChampionship = (championshipId: number): number => {
    if (!subscriptionsData.length) {
      return 0;
    }

    // Filter subscriptions by championship_id to get unique teams
    const championshipSubscriptions = subscriptionsData.filter(
      subscription => subscription.championship_id === championshipId
    );

    // Get unique team IDs for this championship
    const uniqueTeamIds = new Set(championshipSubscriptions.map(sub => sub.team_id));

    return uniqueTeamIds.size;
  }; const teamsCount = getTeamCountForChampionship(championshipId);
  const matchesCount = championshipMatches.length; const completedMatches = championshipMatches.filter(m => m.status === 'Finalizada').length;
  const futureMatches = championshipMatches.filter(m => m.status === 'Agendada' || m.status === 'Planejada').length;
  /**
   * Get bracket structure based on number of teams and format
   * Based on backend double elimination logic from doubleEliminationService.js
   */
  const getBracketStructure = (teamCount: number, format: string) => {
    if (format === 'single-elimination' || format === 'single' || format === 'simple') {
      const rounds = [];
      let teamsInRound = teamCount;
      let roundNumber = 1;

      // Build single elimination bracket
      while (teamsInRound > 1) {
        const matchesInRound = teamsInRound / 2;
        let roundName = '';

        switch (teamsInRound) {
          case 16:
            roundName = 'Oitavas de final';
            break;
          case 8:
            roundName = 'Quartas de final';
            break;
          case 4:
            roundName = 'Semifinal';
            break;
          case 2:
            roundName = 'Final';
            break;
          default:
            roundName = `Rodada ${roundNumber}`;
        }

        rounds.push({
          name: roundName,
          matches: matchesInRound,
          teams: teamsInRound,
          isWinners: true
        });

        teamsInRound = teamsInRound / 2;
        roundNumber++;
      }

      return { winners: rounds, losers: [] };
    } else if (format === 'double-elimination') {
      // Upper bracket structure (matches backend exact stage names)
      const winnersRounds = [];
      let teamsInRound = teamCount;
      let upperRound = 1;

      while (teamsInRound > 1) {
        const matchesInRound = teamsInRound / 2;
        let roundName = '';

        if (upperRound === 1) {
          roundName = 'Upper Round 1';
        } else if (upperRound === 2) {
          roundName = 'Upper Round 2';
        } else if (upperRound === 3) {
          roundName = 'Upper Semifinal';
        } else if (teamsInRound === 2) {
          roundName = 'Upper Final';
        } else {
          roundName = `Upper Round ${upperRound}`;
        }

        winnersRounds.push({
          name: roundName,
          matches: matchesInRound,
          teams: teamsInRound,
          isWinners: true,
          upperRound
        });

        teamsInRound = teamsInRound / 2;
        upperRound++;
      }

      // Lower bracket structure (matches backend double elimination logic exactly)
      const losersRounds = [];

      if (teamCount === 16) {
        // For 16 teams: Upper flows are 16→8→4→2→1
        // Lower bracket receives losers at specific stages and has internal progression

        // Lower Round 1: Only Upper Round 1 losers (8 teams → 4 matches)
        losersRounds.push({
          name: 'Lower Round 1',
          matches: 4,
          teams: 8,
          isWinners: false,
          receivesFrom: ['Upper Round 1'],
          description: 'Upper Round 1 losers only'
        });

        // Lower Round 2: Lower Round 1 winners + Upper Round 2 losers
        // Backend uses alternating pairing logic here
        losersRounds.push({
          name: 'Lower Round 2',
          matches: 4,
          teams: 8,
          isWinners: false,
          receivesFrom: ['Lower Round 1', 'Upper Round 2'],
          description: 'LR1 winners paired with Upper Round 2 losers'
        });

        // Lower Round 3: Only Lower Round 2 winners (4 teams → 2 matches)
        losersRounds.push({
          name: 'Lower Round 3',
          matches: 2,
          teams: 4,
          isWinners: false,
          receivesFrom: ['Lower Round 2'],
          description: 'Lower Round 2 winners only'
        });

        // Lower Semifinal: Lower Round 3 winners + Upper Semifinal loser
        // Special handling when Upper champion exists
        losersRounds.push({
          name: 'Lower Semifinal',
          matches: 1,
          teams: 3,
          isWinners: false,
          receivesFrom: ['Lower Round 3', 'Upper Semifinal'],
          description: 'Lower Round 3 winners + Upper Semifinal loser'
        });

        // Lower Final: Lower Semifinal winner vs Upper champion (if needed)
        losersRounds.push({
          name: 'Lower Final',
          matches: 1,
          teams: 2,
          isWinners: false,
          receivesFrom: ['Lower Semifinal'],
          description: 'Lower Semifinal winner'
        });
      } else if (teamCount === 8) {
        // For 8 teams: Upper flows are 8→4→2→1
        losersRounds.push({
          name: 'Lower Round 1',
          matches: 2,
          teams: 4,
          isWinners: false,
          receivesFrom: ['Upper Round 1'],
          description: 'Upper Round 1 losers'
        });

        losersRounds.push({
          name: 'Lower Round 2',
          matches: 2,
          teams: 4,
          isWinners: false,
          receivesFrom: ['Lower Round 1', 'Upper Round 2'],
          description: 'LR1 winners + Upper Round 2 losers'
        });

        losersRounds.push({
          name: 'Lower Final',
          matches: 1,
          teams: 3,
          isWinners: false,
          receivesFrom: ['Lower Round 2', 'Upper Semifinal'],
          description: 'LR2 winners + Upper Semifinal loser'
        });
      } else if (teamCount === 4) {
        // For 4 teams: Upper flows are 4→2→1
        losersRounds.push({
          name: 'Lower Round 1',
          matches: 1,
          teams: 2,
          isWinners: false,
          receivesFrom: ['Upper Round 1'],
          description: 'Upper Round 1 losers'
        });

        losersRounds.push({
          name: 'Lower Final',
          matches: 1,
          teams: 2,
          isWinners: false,
          receivesFrom: ['Lower Round 1', 'Upper Semifinal'],
          description: 'LR1 winner + Upper Semifinal loser'
        });
      }

      return { winners: winnersRounds, losers: losersRounds };
    }

    return { winners: [], losers: [] };
  };

  const bracketStructure = getBracketStructure(teamsCount, championshipData?.format || 'simple');

  // Debug: Log bracket structure for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🏆 Bracket Structure Debug:');
    console.log('Format:', championshipData?.format);
    console.log('Teams:', teamsCount);
    console.log('Winners Rounds:', bracketStructure.winners.map(r => `${r.name}: ${r.matches} matches`));
    if (championshipData?.format === 'double-elimination') {
      console.log('Losers Rounds:', bracketStructure.losers.map(r => `${r.name}: ${r.matches} matches (${r.description || ''})`));
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Agendada': { color: 'bg-yellow-500/20 text-yellow-400', label: 'Agendada' },
      'Planejada': { color: 'bg-orange-500/20 text-orange-400', label: 'Planejada' },
      'Finalizada': { color: 'bg-green-500/20 text-green-400', label: 'Finalizada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500/20 text-gray-400', label: status };
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (isLoadingChampionship || isLoadingSubscriptions || isLoadingMatches || isLoadingTeams || isLoadingTeamStats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-slate-700 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-700 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-700 rounded"></div>
      </div>
    );
  }

  // Show error state
  if (isChampionshipError || !championshipData) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Erro ao carregar dados do campeonato.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">          {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'bracket', label: 'Chaveamento' },
          { id: 'matches', label: 'Partidas', count: matchesCount },
          { id: 'teams', label: 'Equipes', count: championshipTeams.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 px-2 border-b-2 transition-colors ${activeTab === tab.id
              ? 'border-red-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
              }`}
          >
            {tab.label} {tab.count ? `(${tab.count})` : ''}
          </button>
        ))}
        </nav>
      </div>      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">          {/* Championship Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {isLoadingSubscriptions ? '...' : teamsCount}
              </div>
              <div className="text-slate-400 text-sm">Equipes Participantes</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {isLoadingMatches ? '...' : matchesCount}
              </div>
              <div className="text-slate-400 text-sm">Partidas Totais</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {isLoadingMatches ? '...' : completedMatches}
              </div>
              <div className="text-slate-400 text-sm">Partidas Finalizadas</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {isLoadingMatches ? '...' : futureMatches}
              </div>
              <div className="text-slate-400 text-sm">Partidas a seguir</div>
            </Card>
          </div>          {championshipData && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Championship Information */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  Informações do Campeonato
                </h3>
                <div className="space-y-4">                  <div>
                  <label className="text-slate-400 text-sm">Formato</label>
                  <p className="text-white font-medium">
                    {championshipData.format === 'double-elimination' ? 'Eliminação Dupla' :
                      championshipData.format === 'single-elimination' ? 'Eliminação Simples' :
                        championshipData.format || 'Formato não definido'}
                  </p>
                </div>
                  <div>
                    <label className="text-slate-400 text-sm">Período</label>
                    <p className="text-white">
                      {new Date(championshipData.start_date).toLocaleDateString('pt-BR')} - {new Date(championshipData.end_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Local</label>
                    <p className="text-white flex items-center">
                      <MapPin className="w-4 h-4 text-red-500 mr-1" />
                      {championshipData.location}
                    </p>
                  </div>
                  {championshipData.prize && (
                    <div>
                      <label className="text-slate-400 text-sm">Premiação</label>
                      <p className="text-yellow-500 font-semibold flex items-center">
                        <Crown className="w-4 h-4 mr-1" />
                        {championshipData.prize}
                      </p>
                    </div>
                  )}
                  <div>
                  </div>
                </div>
              </Card>              {/* Current Standings */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 text-green-500 mr-2" />
                  Classificação Atual
                </h3>
                {isLoadingTeams || isLoadingSubscriptions ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-md animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
                          <div className="h-4 bg-slate-600 rounded w-32"></div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="h-4 bg-slate-600 rounded w-16"></div>
                          <div className="h-4 bg-slate-600 rounded w-12"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : championshipTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhuma equipe inscrita para classificação ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {championshipTeams.slice(0, 5).map((team, index) => (
                      <div key={team.team_id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                              index === 2 ? 'bg-amber-600 text-black' :
                                'bg-slate-600 text-white'
                            }`}>
                            {index + 1}
                          </div>
                          <span className="text-white font-medium">{team.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-400 text-sm">
                            {team.wins}V - {team.losses}D
                          </span>
                          <span className="text-green-400 font-semibold">
                            {team.total_matches > 0 ? Math.round(team.win_rate * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {championshipTeams.length > 5 && (
                      <div className="text-center pt-2">
                        <span className="text-slate-500 text-sm">
                          +{championshipTeams.length - 5} equipes adicionais
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}          {/* Upcoming Matches */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 text-red-500 mr-2" />
              Próximas Partidas
            </h3>
            {isLoadingMatches ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="bg-slate-700 border-slate-600 p-6 animate-pulse">
                    <div className="h-20 bg-slate-600 rounded"></div>
                  </Card>
                ))}
              </div>
            ) : (() => {
              const upcomingMatches = championshipMatches.filter(m =>
                m.status === 'Planejada' || m.status === 'Agendada'
              );

              if (upcomingMatches.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhuma partida próxima agendada.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {upcomingMatches.slice(0, 3).map((match) => (
                    <Card key={match.match_id} className="bg-slate-700 border-slate-600 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-8">
                            {/* Team A */}
                            <div className="text-center min-w-[120px]">
                              <h3 className="font-semibold text-white">{match.TeamA.name}</h3>
                            </div>

                            {/* VS */}
                            <div className="text-center">
                              <span className="text-lg font-bold text-slate-400">VS</span>
                            </div>

                            {/* Team B */}
                            <div className="text-center min-w-[120px]">
                              <h3 className="font-semibold text-white">{match.TeamB.name}</h3>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="flex items-center text-slate-300 mb-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{match.map}</span>
                            </div>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {match.stage}
                            </Badge>
                          </div>                          <div className="text-center">
                            <div className="flex items-center text-slate-300 mb-1">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {match.status === 'Planejada' ? 'À Agendar' : formatDateTime(match.date)}
                              </span>
                            </div>
                            <Badge
                              className={`${match.status === 'Agendada'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }`}
                            >
                              {match.status}
                            </Badge>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${match.match_id}`)}
                            className="border-slate-600 text-slate-300 hover:text-white"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })()}
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                onClick={() => setActiveTab('matches')}
              >
                Ver Todas as Partidas ({championshipMatches.length})
              </Button>
            </div>
          </Card>{/* Top Teams Preview */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Principais Equipes
            </h3>
            {isLoadingTeams || isLoadingSubscriptions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-slate-700 rounded-md p-4 animate-pulse">
                    <div className="h-6 bg-slate-600 rounded mb-2"></div>
                    <div className="h-4 bg-slate-600 rounded mb-3"></div>
                    <div className="h-4 bg-slate-600 rounded mb-3"></div>
                    <div className="h-8 bg-slate-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : championshipTeams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Nenhuma equipe inscrita neste campeonato ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {championshipTeams.slice(0, 3).map((team) => (
                  <div key={team.team_id} className="bg-slate-700 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{team.name}</h4>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {Math.round(team.win_rate * 100)}% WR
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{team.manager_name}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">{team.wins} vitórias</span>
                      <span className="text-red-400">{team.losses} derrotas</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white"
                      onClick={async () => {
                        try {
                          await router.push(`/campeonatos/${championshipId}/equipes/${team.team_id}`);
                          // Optionally, you can add a delay to ensure the route is fully loaded
                          await new Promise(resolve => setTimeout(resolve, 100));
                        } catch (error) {
                          console.error('Navigation error:', error);
                        }
                      }}
                    >
                      Ver Equipe
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setActiveTab('teams')}
              >
                Ver Todas as Equipes ({championshipTeams.length})
              </Button>
            </div>
          </Card></div>
      )}      {activeTab === 'bracket' && (
        <div className="space-y-8">
          {/* Tournament Bracket */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 overflow-x-auto">
            <div className="text-center mb-2">              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {championshipData?.format === 'double-elimination' ? 'Eliminação Dupla' :
                championshipData?.format === 'single-elimination' ? 'Eliminação Simples' :
                  'Formato do Torneio'}
            </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              Chaveamento do Torneio
            </h3>            {/* Dynamic Bracket Container */}
            {bracketStructure.winners.length > 0 ? (
              <div className="mx-auto relative min-w-fit">
                {championshipData?.format === 'double-elimination' ? (
                /* Double Elimination Bracket - Winners Left, Losers Right, Grand Final Center */
                <div className="flex justify-center items-start space-x-6">
                  {/* Winners Bracket - Left Side */}
                  <div className="flex-shrink-0 flex flex-col items-start">
                    <h4 className="text-lg font-semibold text-green-400 mb-6 text-center w-full">Chave dos Vencedores</h4>

                    {/* Winners Round Labels - All rounds including winners final */}
                    <div className="flex space-x-3 mb-8 text-center w-full justify-start">
                      {bracketStructure.winners.map((round, index) => (
                        <div key={index} className="w-32 text-slate-400 font-semibold text-xs">
                          {round.name}
                        </div>
                      ))}
                    </div>


                    {/* Winners Bracket Structure - All rounds */}
                    <div className="flex items-start space-x-3 relative">
                      {bracketStructure.winners.map((round, roundIndex) => (
                        <div key={roundIndex} className="flex flex-col justify-start space-y-6">
                          {roundIndex === bracketStructure.winners.length - 1 ? (
                            /* Winners Final - Aligned at top */
                            <div className="w-36 bg-gradient-to-r from-green-900 to-green-800 rounded-lg border-2 border-green-500 p-4 relative shadow-lg shadow-green-500/20">
                              <div className="text-center mb-3">
                                <Trophy className="w-5 h-5 text-green-400 mx-auto mb-2" />
                                <span className="text-green-400 font-bold text-xs">{round.name.toUpperCase()}</span>
                              </div>
                              <div className="space-y-2">
                                {(() => {
                                  const winnersFinaltMatch = championshipMatches.find(m =>
                                    m.stage?.toLowerCase().includes('final') &&
                                    !m.stage?.toLowerCase().includes('grand') &&
                                    !m.stage?.toLowerCase().includes('losers')
                                  );

                                  if (winnersFinaltMatch) {
                                    return (
                                      <div
                                        className="cursor-pointer hover:bg-slate-700/50 rounded transition-colors"
                                        onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${winnersFinaltMatch.match_id}`)}
                                      >
                                        <div className={`flex items-center justify-between p-2 ${winnersFinaltMatch.winner_team_id === winnersFinaltMatch.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded text-xs`}>
                                          <span className="text-white font-medium truncate pr-1">{winnersFinaltMatch.TeamA?.name || 'TBD'}</span>
                                          <span className="text-green-400 font-bold">{winnersFinaltMatch.status === 'Finalizada' ? (winnersFinaltMatch.score?.teamA || '0') : 'vs'}</span>
                                        </div>
                                        <div className={`flex items-center justify-between p-2 ${winnersFinaltMatch.winner_team_id === winnersFinaltMatch.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded text-xs`}>
                                          <span className="text-white font-medium truncate pr-1">{winnersFinaltMatch.TeamB?.name || 'TBD'}</span>
                                          <span className="text-green-400 font-bold">{winnersFinaltMatch.status === 'Finalizada' ? (winnersFinaltMatch.score?.teamB || '0') : 'TBD'}</span>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-green-500 text-xs">
                                          <span className="text-white font-medium">Semi 1</span>
                                          <span className="text-green-400">vs</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-green-500 text-xs">
                                          <span className="text-white font-medium">Semi 2</span>
                                          <span className="text-green-400">TBD</span>
                                        </div>
                                      </>
                                    );
                                  }
                                })()}
                              </div>
                              {/* Connection line to Grand Final */}
                              <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-green-500"></div>
                            </div>
                          ) : (
                            /* Regular Winners Bracket Rounds */
                            Array.from({ length: round.matches }).map((_, matchIndex) => {
                              // Filter matches by exact stage name (matches backend stage names)
                              const roundMatches = championshipMatches.filter(m => {
                                return m.stage === round.name && (m.bracket === 'upper' || !m.bracket);
                              });

                              const match = roundMatches[matchIndex];
                              return (
                                <div key={matchIndex} className={`w-32 bg-slate-700 rounded-lg border border-green-600 p-3 relative ${match ? 'cursor-pointer hover:bg-slate-600/50 transition-colors' : ''}`}
                                  onClick={match ? () => router.push(`/campeonatos/${championshipId}/partidas/${match.match_id}`) : undefined}
                                >
                                  <div className="space-y-2">
                                    {match ? (
                                      <>
                                        <div className={`flex items-center justify-between p-2 ${match.winner_team_id === match.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${match.status !== 'Finalizada' ? 'border-2 border-green-500' : ''}`}>
                                          <span className="text-white font-medium text-sm truncate pr-2">{match.TeamA?.name || `Team ${match.teamA_id}`}</span>
                                          <span className={match.status === 'Finalizada' ? (match.winner_team_id === match.teamA_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400'}>
                                            {match.status === 'Finalizada' ? (match.score?.teamA || '0') : 'vs'}
                                          </span>
                                        </div>
                                        <div className={`flex items-center justify-between p-2 ${match.winner_team_id === match.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${match.status !== 'Finalizada' ? 'border-2 border-green-500' : ''}`}>
                                          <span className="text-white font-medium text-sm truncate pr-2">{match.TeamB?.name || `Team ${match.teamB_id}`}</span>
                                          <span className={match.status === 'Finalizada' ? (match.winner_team_id === match.teamB_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400 text-xs'}>
                                            {match.status === 'Finalizada' ? (match.score?.teamB || '0') : (match.date ? formatDateTime(match.date) : 'TBD')}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-500">
                                          <span className="text-slate-400 text-sm">TBD</span>
                                          <span className="text-slate-500">vs</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-500">
                                          <span className="text-slate-400 text-sm">TBD</span>
                                          <span className="text-slate-500 text-xs">-</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grand Final - Center - Aligned at top */}
                  <div className="flex flex-col items-center justify-start">
                    <div className="w-44 bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-lg border-2 border-yellow-500 p-4 relative shadow-lg shadow-yellow-500/20 mt-16">
                      <div className="text-center mb-3">
                        <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <span className="text-yellow-400 font-bold text-sm">GRANDE FINAL</span>
                      </div>
                      <div className="space-y-3">
                        {(() => {
                          const grandFinalMatch = championshipMatches.find(m =>
                            m.stage === 'Grand Final' && m.bracket === 'final'
                          );

                          if (grandFinalMatch) {
                            return (
                              <div
                                className="cursor-pointer hover:bg-slate-700/50 rounded transition-colors"
                                onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${grandFinalMatch.match_id}`)}
                              >
                                <div className={`flex items-center justify-between p-2 ${grandFinalMatch.winner_team_id === grandFinalMatch.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${grandFinalMatch.status !== 'Finalizada' ? 'border border-yellow-500' : ''}`}>
                                  <span className="text-white font-medium text-sm">{grandFinalMatch.TeamA?.name || 'Vencedor Chave'}</span>
                                  <span className={grandFinalMatch.status === 'Finalizada' ? (grandFinalMatch.winner_team_id === grandFinalMatch.teamA_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400'}>
                                    {grandFinalMatch.status === 'Finalizada' ? (grandFinalMatch.score?.teamA || '0') : 'vs'}
                                  </span>
                                </div>
                                <div className={`flex items-center justify-between p-2 ${grandFinalMatch.winner_team_id === grandFinalMatch.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${grandFinalMatch.status !== 'Finalizada' ? 'border border-yellow-500' : ''}`}>
                                  <span className="text-white font-medium text-sm">{grandFinalMatch.TeamB?.name || 'Vencedor Eliminados'}</span>
                                  <span className={grandFinalMatch.status === 'Finalizada' ? (grandFinalMatch.winner_team_id === grandFinalMatch.teamB_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400 text-xs'}>
                                    {grandFinalMatch.status === 'Finalizada' ? (grandFinalMatch.score?.teamB || '0') : (grandFinalMatch.date ? formatDateTime(grandFinalMatch.date) : 'TBD')}
                                  </span>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <>
                                <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                                  <span className="text-white font-medium text-sm">Vencedor Chave</span>
                                  <span className="text-yellow-400">vs</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                                  <span className="text-white font-medium text-sm">Vencedor Eliminados</span>
                                  <span className="text-yellow-400 text-xs">A definir</span>
                                </div>
                              </>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Losers Bracket - Right Side */}
                  <div className="flex-shrink-0 flex flex-col items-start">
                    <h4 className="text-lg font-semibold text-red-400 mb-6 text-center w-full">Chave dos Eliminados</h4>

                    {/* Losers Round Labels - Right to Left (reversed) */}
                    <div className="flex space-x-3 mb-8 text-center w-full justify-start">
                      {bracketStructure.losers.slice().reverse().map((round, index) => (
                        <div key={index} className="w-32 text-slate-400 font-semibold text-xs">
                          {round.name}
                        </div>
                      ))}
                    </div>

                    {/* Losers Bracket Structure - Right to Left (reversed) */}
                    <div className="flex items-start space-x-3 relative">
                      {bracketStructure.losers.slice().reverse().map((round, roundIndex) => (
                        <div key={roundIndex} className="flex flex-col justify-start space-y-6">
                          {round.name === 'Lower Final' ? (
                            /* Lower Final - Aligned at top */
                            <div className="w-36 bg-gradient-to-r from-red-900 to-red-800 rounded-lg border-2 border-red-500 p-4 relative shadow-lg shadow-red-500/20">
                              <div className="text-center mb-3">
                                <Trophy className="w-5 h-5 text-red-400 mx-auto mb-2" />
                                <span className="text-red-400 font-bold text-xs">{round.name.toUpperCase()}</span>
                              </div>
                              <div className="space-y-2">
                                {(() => {
                                  const lowerFinalMatch = championshipMatches.find(m =>
                                    m.stage === 'Lower Final' && m.bracket === 'lower'
                                  );

                                  if (lowerFinalMatch) {
                                    return (
                                      <div
                                        className="cursor-pointer hover:bg-slate-700/50 rounded transition-colors"
                                        onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${lowerFinalMatch.match_id}`)}
                                      >
                                        <div className={`flex items-center justify-between p-2 ${lowerFinalMatch.winner_team_id === lowerFinalMatch.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded text-xs`}>
                                          <span className="text-white font-medium truncate pr-1">{lowerFinalMatch.TeamA?.name || 'TBD'}</span>
                                          <span className="text-red-400 font-bold">{lowerFinalMatch.status === 'Finalizada' ? (lowerFinalMatch.score?.teamA || '0') : 'vs'}</span>
                                        </div>
                                        <div className={`flex items-center justify-between p-2 ${lowerFinalMatch.winner_team_id === lowerFinalMatch.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded text-xs`}>
                                          <span className="text-white font-medium truncate pr-1">{lowerFinalMatch.TeamB?.name || 'TBD'}</span>
                                          <span className="text-red-400 font-bold">{lowerFinalMatch.status === 'Finalizada' ? (lowerFinalMatch.score?.teamB || '0') : 'TBD'}</span>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-red-500 text-xs">
                                          <span className="text-white font-medium">Sobrevivente</span>
                                          <span className="text-red-400">vs</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-red-500 text-xs">
                                          <span className="text-white font-medium">Perdedor WF</span>
                                          <span className="text-red-400">TBD</span>
                                        </div>
                                      </>
                                    );
                                  }
                                })()}
                              </div>                                {/* Connection line to Grand Final */}
                              <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-red-500"></div>
                            </div>
                          ) : (
                            /* Regular Losers Bracket Rounds */
                            Array.from({ length: round.matches }).map((_, matchIndex) => {
                              // Filter matches by exact stage name (matches backend stage names)
                              const roundMatches = championshipMatches.filter(m => {
                                return m.stage === round.name && m.bracket === 'lower';
                              });

                              const match = roundMatches[matchIndex];
                              return (
                                <div key={matchIndex} className={`w-32 bg-slate-700 rounded-lg border border-red-600 p-3 relative ${match ? 'cursor-pointer hover:bg-slate-600/50 transition-colors' : ''}`}
                                  onClick={match ? () => router.push(`/campeonatos/${championshipId}/partidas/${match.match_id}`) : undefined}
                                >
                                  <div className="space-y-2">
                                    {match ? (
                                      <>
                                        <div className={`flex items-center justify-between p-2 ${match.winner_team_id === match.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${match.status !== 'Finalizada' ? 'border-2 border-red-500' : ''}`}>
                                          <span className="text-white font-medium text-sm truncate pr-2">{match.TeamA?.name || `Team ${match.teamA_id}`}</span>
                                          <span className={match.status === 'Finalizada' ? (match.winner_team_id === match.teamA_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400'}>
                                            {match.status === 'Finalizada' ? (match.score?.teamA || '0') : 'vs'}
                                          </span>
                                        </div>
                                        <div className={`flex items-center justify-between p-2 ${match.winner_team_id === match.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${match.status !== 'Finalizada' ? 'border-2 border-red-500' : ''}`}>
                                          <span className="text-white font-medium text-sm truncate pr-2">{match.TeamB?.name || `Team ${match.teamB_id}`}</span>
                                          <span className={match.status === 'Finalizada' ? (match.winner_team_id === match.teamB_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400 text-xs'}>
                                            {match.status === 'Finalizada' ? (match.score?.teamB || '0') : (match.date ? formatDateTime(match.date) : 'TBD')}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-red-500">
                                          <span className="text-slate-400 text-sm">TBD</span>
                                          <span className="text-slate-500">vs</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-red-500">
                                          <span className="text-slate-400 text-sm">TBD</span>
                                          <span className="text-slate-500 text-xs">-</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (                  /* Single Elimination Bracket */
                <div className={`mx-auto relative ${bracketStructure.winners.length === 1 ? 'max-w-md' : bracketStructure.winners.length === 2 ? 'max-w-lg' : bracketStructure.winners.length === 3 ? 'max-w-2xl' : 'max-w-4xl'}`}>
                  {/* Round Labels */}
                  <div className={`flex ${bracketStructure.winners.length === 1 ? 'justify-center' : 'justify-between'} mb-8 text-center`}>
                    {bracketStructure.winners.map((round, index) => (
                      <div key={index} className={`${bracketStructure.winners.length === 1 ? 'w-64' : bracketStructure.winners.length === 2 ? 'w-40' : bracketStructure.winners.length === 3 ? 'w-32' : 'w-28'} text-slate-400 font-semibold text-sm`}>
                        {round.name}
                      </div>
                    ))}
                  </div>

                  {/* Bracket Structure */}
                  <div className={`flex items-center ${bracketStructure.winners.length === 1 ? 'justify-center' : 'justify-between'} relative space-x-4`}>
                    {bracketStructure.winners.map((round, roundIndex) => (
                      <div key={roundIndex} className={`${roundIndex === bracketStructure.winners.length - 1 ? 'flex items-center' : 'space-y-6'}`}>                          {/* Final round special styling */}
                        {roundIndex === bracketStructure.winners.length - 1 ? (
                          <div className={`${bracketStructure.winners.length === 1 ? 'w-64' : 'w-40'} bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-lg border-2 border-yellow-500 p-4 relative shadow-lg shadow-yellow-500/20`}>
                            <div className="text-center mb-3">
                              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                              <span className="text-yellow-400 font-bold text-sm">{round.name.toUpperCase()}</span>
                            </div>
                            <div className="space-y-2">
                              {(() => {
                                const finalMatch = championshipMatches.find(m =>
                                  m.stage?.toLowerCase().includes('final') ||
                                  m.stage === 'Final'
                                );

                                if (finalMatch) {
                                  return (
                                    <div
                                      className="cursor-pointer hover:bg-slate-700/50 rounded transition-colors"
                                      onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${finalMatch.match_id}`)}
                                    >
                                      <div className={`flex items-center justify-between p-2 ${finalMatch.winner_team_id === finalMatch.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${finalMatch.status !== 'Finalizada' ? 'border border-yellow-500' : ''}`}>
                                        <span className="text-white font-medium text-sm">{finalMatch.TeamA?.name || 'TBD'}</span>
                                        <span className={finalMatch.status === 'Finalizada' ? (finalMatch.winner_team_id === finalMatch.teamA_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400'}>
                                          {finalMatch.status === 'Finalizada' ? (finalMatch.score?.teamA || '0') : 'vs'}
                                        </span>
                                      </div>
                                      <div className={`flex items-center justify-between p-2 ${finalMatch.winner_team_id === finalMatch.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${finalMatch.status !== 'Finalizada' ? 'border border-yellow-500' : ''}`}>
                                        <span className="text-white font-medium text-sm">{finalMatch.TeamB?.name || 'TBD'}</span>
                                        <span className={finalMatch.status === 'Finalizada' ? (finalMatch.winner_team_id === finalMatch.teamB_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400 text-xs'}>
                                          {finalMatch.status === 'Finalizada' ? (finalMatch.score?.teamB || '0') : formatDateTime(finalMatch.date || '')}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <>
                                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                                        <span className="text-white font-medium text-sm">TBD</span>
                                        <span className="text-yellow-400">vs</span>
                                      </div>
                                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                                        <span className="text-white font-medium text-sm">TBD</span>
                                        <span className="text-yellow-400 text-xs">A definir</span>
                                      </div>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        ) : (
                          /* Regular rounds */
                          <div className="space-y-6">
                            {Array.from({ length: round.matches }).map((_, matchIndex) => {
                              // Filter matches by exact stage name for single elimination
                              const roundMatches = championshipMatches.filter(m => {
                                return m.stage === round.name;
                              });

                              const match = roundMatches[matchIndex];
                              return (
                                <div key={matchIndex} className={`${bracketStructure.winners.length === 2 ? 'w-40' : bracketStructure.winners.length === 3 ? 'w-32' : 'w-28'} bg-slate-700 rounded-lg border border-slate-600 p-3 relative ${match ? 'cursor-pointer hover:bg-slate-600/50 transition-colors' : ''}`}
                                  onClick={match ? () => router.push(`/campeonatos/${championshipId}/partidas/${match.match_id}`) : undefined}
                                >
                                  <div className="space-y-2">
                                    {match ? (
                                      <>
                                        <div className={`flex items-center justify-between p-2 ${match.winner_team_id === match.teamA_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${match.status !== 'Finalizada' ? 'border-2 border-yellow-500' : ''}`}>
                                          <span className="text-white font-medium text-sm truncate pr-2">{match.TeamA?.name || `Team ${match.teamA_id}`}</span>
                                          <span className={match.status === 'Finalizada' ? (match.winner_team_id === match.teamA_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400'}>
                                            {match.status === 'Finalizada' ? (match.score?.teamA || '0') : 'vs'}
                                          </span>
                                        </div>
                                        <div className={`flex items-center justify-between p-2 ${match.winner_team_id === match.teamB_id ? 'bg-slate-600' : 'bg-slate-800'} rounded ${match.status !== 'Finalizada' ? 'border-2 border-yellow-500' : ''}`}>
                                          <span className="text-white font-medium text-sm truncate pr-2">{match.TeamB?.name || `Team ${match.teamB_id}`}</span>
                                          <span className={match.status === 'Finalizada' ? (match.winner_team_id === match.teamB_id ? 'text-green-400 font-bold' : 'text-slate-400') : 'text-yellow-400 text-xs'}>
                                            {match.status === 'Finalizada' ? (match.score?.teamB || '0') : (match.date ? formatDateTime(match.date) : 'TBD')}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-500">
                                          <span className="text-slate-400 text-sm">TBD</span>
                                          <span className="text-slate-500">vs</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-500">
                                          <span className="text-slate-400 text-sm">TBD</span>
                                          <span className="text-slate-500 text-xs">-</span>
                                        </div>
                                      </>
                                    )}
                                  </div>                                    {/* Connection lines */}
                                  {roundIndex < bracketStructure.winners.length - 1 && (
                                    <div className={`absolute top-1/2 -right-3 w-3 h-0.5 ${match?.status === 'Finalizada' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : match ? 'bg-yellow-500' : 'bg-slate-600'}`}></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tournament Info */}
                  <div className="mt-12 text-center">
                    <div className="flex justify-center space-x-8 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <span className="text-slate-400">Partida Finalizada</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-yellow-500"></div>
                        <span className="text-slate-400">Partida Agendada</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-slate-600"></div>
                        <span className="text-slate-400">Partida Não Definida</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-400">Final do Torneio</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            ) : (
              /* No teams message */
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-400 mb-2">Chaveamento não disponível</h4>
                <p className="text-slate-500">
                  {teamsCount === 0 ? 'Nenhuma equipe inscrita ainda.' :
                    teamsCount === 1 ? 'É necessário pelo menos 2 equipes para gerar o chaveamento.' :
                      `${teamsCount} equipes inscritas. O chaveamento será gerado quando as partidas forem criadas.`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}{activeTab === 'matches' && (
        <div className="space-y-6">
          {isLoadingMatches ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700 p-6 animate-pulse">
                  <div className="h-20 bg-slate-700 rounded"></div>
                </Card>
              ))}
            </div>
          ) : championshipMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Nenhuma partida encontrada neste campeonato.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {championshipMatches.map((match) => (
                <Card key={match.match_id} className="bg-slate-800 border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-8">
                        {/* Team A */}
                        <div className="text-center min-w-[120px]">
                          <h3 className="font-semibold text-white">{match.TeamA.name}</h3>
                          {match.score && (
                            <div className="text-2xl font-bold text-red-500 mt-1">
                              {match.score.teamA}
                            </div>
                          )}
                        </div>

                        {/* VS */}
                        <div className="text-center">
                          <span className="text-lg font-bold text-slate-400">VS</span>
                          {match.score && (
                            <div className="text-sm text-slate-400 mt-1">
                              {match.score.teamA} - {match.score.teamB}
                            </div>
                          )}
                        </div>

                        {/* Team B */}
                        <div className="text-center min-w-[120px]">
                          <h3 className="font-semibold text-white">{match.TeamB.name}</h3>
                          {match.score && (
                            <div className="text-2xl font-bold text-red-500 mt-1">
                              {match.score.teamB}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>                  <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center text-slate-300 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{match.map}</span>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {match.stage}
                        </Badge>
                      </div>                      <div className="text-center">
                        <div className="flex items-center text-slate-300 mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {match.status === 'Planejada' ? 'À Agendar' : formatDateTime(match.date)}
                          </span>
                        </div>
                        {getStatusBadge(match.status)}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${match.match_id}`)}
                        className="border-slate-600 text-slate-300 hover:text-white"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}{activeTab === 'teams' && (
        <div className="space-y-6">
          {isLoadingTeams || isLoadingSubscriptions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700 p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700 rounded"></div>
                      <div className="h-4 bg-slate-700 rounded"></div>
                      <div className="h-4 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-8 bg-slate-700 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : championshipTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Nenhuma equipe encontrada neste campeonato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {championshipTeams.map((team) => (
                <Card key={team.team_id} className="bg-slate-800 border-slate-700 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{team.name}</h3>
                        <p className="text-slate-400">Gerenciado por {team.manager_name}</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {Math.round(team.win_rate * 100)}% WR
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vitórias</span>
                        <span className="text-green-400 font-semibold">{team.wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Derrotas</span>
                        <span className="text-red-400 font-semibold">{team.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Jogadores</span>
                        <span className="text-white font-semibold">{team.participants_count}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => router.push(`/campeonatos/${championshipId}/equipes/${team.team_id}`)}
                    >
                      Ver Equipe
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}