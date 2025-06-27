'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../_components/DashboardLayout';
import { TopPlayersCard } from '@/components/statistics/TopPlayersCard';
import { TeamRankingCard } from '@/components/statistics/TeamRankingCard';
import { UniversalSearchBar } from '@/components/common/UniversalSearchBar';
import { SearchResult } from '@/hooks/useSearch';
import { 
  useAllPlayersSummary, 
  useAllTeamsSummary
} from '@/hooks/useStatistics';
import { Card } from '@/components/ui/card';
import { useEffect, useState, useMemo } from 'react';
import { useGetAllChampionships } from '@/services/championshipService';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetAllTeams, useGetAllParticipants, type TeamParticipant, type Team } from '@/services/teamService';
import { ArrowRight, Calendar, Crown, MapPin, Target, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useGetAllMatches, type Match as ServiceMatch } from '@/services/matchService';
import type { Championship } from '@/types/championship';
import { Button } from '@/components/ui/button';
import { AddChampionshipStatisticsModal } from '@/components/modals/AddChampionshipStatisticsModal';
import { ChampionshipStatisticInput } from '@/types/statistics';
import { statisticsService } from '@/services';
import { StatCard } from '@/components/statistics/StatCard';

/**
 * Search function using real API data (same as public page)
 * @param query - Search query string
 * @param types - Array of search types to include
 * @param championshipsData - Championships data from API
 * @param teamsData - Teams data from API
 * @param matchesData - Matches data from API
 * @param participantsData - Participants data from API
 * @returns Array of search results
 */
const searchWithRealData = (
  query: string, 
  types: string[], 
  championshipsData: Championship[] = [], 
  teamsData: Team[] = [], 
  matchesData: ServiceMatch[] = [],
  participantsData: TeamParticipant[] = []
): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search championships
  if (types.includes("championship")) {
    const championshipResults = championshipsData
      .filter(championship =>
        championship.name.toLowerCase().includes(searchQuery) ||
        (championship.description && championship.description.toLowerCase().includes(searchQuery))
      )
      .map(championship => ({
        id: championship.championship_id,
        name: championship.name,
        type: "championship",
        subtitle: `${championship.location || "Local não definido"} - ${championship.status}`,
        metadata: {
          status: championship.status,
          location: championship.location,
        },
      }));
    results.push(...championshipResults);
  }

  // Search teams
  if (types.includes("team")) {
    const teamResults = teamsData
      .filter(team =>
        team.name.toLowerCase().includes(searchQuery)
      )
      .map(team => ({
        id: team.team_id,
        name: team.name,
        type: "team",
        subtitle: `${team.participants_count || 0} jogadores`,
        metadata: {
          participantsCount: team.participants_count || 0,
        },
      }));
    results.push(...teamResults);
  }

  // Search players/participants
  if (types.includes("player")) {
    const playerResults = participantsData
      .filter(participant =>
        !participant.is_coach && // Only include players, not coaches
        (participant.name.toLowerCase().includes(searchQuery) ||
         participant.nickname.toLowerCase().includes(searchQuery))
      )
      .map(participant => ({
        id: participant.participant_id,
        name: participant.nickname,
        type: "player",
        subtitle: `${participant.name} - ${teamsData.find(t => t.team_id === participant.team_id)?.name || 'Sem equipe'}`,
        metadata: {
          fullName: participant.name,
          teamId: participant.team_id,
          teamName: teamsData.find(t => t.team_id === participant.team_id)?.name,
          isCoach: participant.is_coach,
        },
      }));
    results.push(...playerResults);
  }

  // Search matches
  if (types.includes("match")) {
    const matchResults = matchesData
      .filter(match =>
        (match.TeamA?.name && match.TeamA.name.toLowerCase().includes(searchQuery)) ||
        (match.TeamB?.name && match.TeamB.name.toLowerCase().includes(searchQuery)) ||
        (match.map && match.map.toLowerCase().includes(searchQuery))
      )
      .map(match => ({
        id: match.match_id,
        name: `${match.TeamA?.name || 'Equipe A'} vs ${match.TeamB?.name || 'Equipe B'}`,
        type: "match",
        subtitle: `${match.stage || 'Fase'} - ${match.map || 'Mapa'}`,
        metadata: {
          championshipId: match.championship_id,
          status: match.status,
        },
      }));
    results.push(...matchResults);
  }

  return results.slice(0, 8);
};

const Estatisticas = () => {
  const router = useRouter();
  const { data: players = [], isLoading: isLoadingPlayers } = useAllPlayersSummary();
  const { data: teams = [], isLoading: isLoadingTeams } = useAllTeamsSummary();
  const [isLoadingMapData, setIsLoadingMapData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativo' | 'Planejado' | 'Finalizado'>('all');
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch championships from API
  const {
    data: championshipsData = [],
    isLoading: isLoadingChampionships,
    isError: isChampionshipsError,
  } = useGetAllChampionships();

  // Fetch subscriptions to count teams per championship
  const {
    data: subscriptionsData = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useGetAllSubscriptions();

  // Fetch matches data
  const {
    data: matchesData = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
  } = useGetAllMatches();

  // Fetch participants data for search
  const {
    data: participantsData = [],
    isLoading: isLoadingParticipants,
    isError: isParticipantsError,
  } = useGetAllParticipants();

  // Fetch teams data for search
  const {
    data: teamsData = [],
    isLoading: isLoadingTeamsData,
    isError: isTeamsDataError,
  } = useGetAllTeams();

  /**
   * Count teams for a specific championship using subscription data
   */
  const getTeamCountForChampionship = (championshipId: number): number => {
    if (!subscriptionsData || !subscriptionsData.length) {
      // If this championship has teams_count already available, use it
      const championship = championshipsData.find(c => c.championship_id === championshipId);
      if (championship && championship.teams_count !== undefined) {
        return championship.teams_count;
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
  };

  /**
   * Count matches for a specific championship
   */
  const getMatchCountForChampionship = (championshipId: number): number => {
    if (!matchesData.length) {
      return 0;
    }
    return matchesData.filter(match => match.championship_id === championshipId).length;
  };

  // Sort by KDA and win rate for ranking, ensuring unique entries
  const topPlayers = [...players]
    .filter((player, index, self) => 
      // Only keep first occurrence of each player
      index === self.findIndex(p => p.participant_id === player.participant_id))
    .sort((a, b) => (Number(b.kda_ratio) || 0) - (Number(a.kda_ratio) || 0))
    .slice(0, 5);
  const topTeams = [...teams].sort((a, b) => (Number(b.win_rate) || 0) - (Number(a.win_rate) || 0)).slice(0, 5);

  // Generate general statistics from API data
  const generalStats = [
    {
      stat: {
        label: "Total de Kills",
        valor: players.reduce((acc, player) => acc + player.total_kills, 0).toString(),
        crescimento: "+15%"
      }
    },
    {
      stat: {
        label: "Partidas Jogadas",
        valor: teams.reduce((acc, team) => acc + team.total_matches, 0).toString(),
        crescimento: "+8%"
      }
    },
    {
      stat: {
        label: "MVPs",
        valor: players.reduce((acc, player) => acc + player.mvp_count, 0).toString(),
        crescimento: "+12%"
      }
    }
  ];


  const handleSearchResultClick = (result: SearchResult) => {
    let basePath = '';
    switch (result.type) {
      case 'player':
        basePath = '/dashboard/estatisticas/jogador';
        break;
      case 'team':
        basePath = '/dashboard/estatisticas/equipe';
        break;
      case 'championship':
        basePath = '/dashboard/estatisticas/campeonato';
        break;
      case 'match':
        // For match results, navigate to the match in its championship context
        if (result.metadata?.championshipId) {
          router.push(`/dashboard/estatisticas/campeonato/${result.metadata.championshipId}`);
          return;
        }
        break;
    }
    if (basePath) {
      router.push(`${basePath}/${result.id}`);
    }
  };

  // Filter championships based on search and status
  const filteredChampionships = championshipsData.filter((championship: any) => {
    const matchesSearch = championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (championship.description && championship.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || championship.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSubmit = async (data: ChampionshipStatisticInput) => {
    try {
      await statisticsService.createChampionshipStatistic(data);
      alert('Estatísticas adicionadas com sucesso!');
      handleModalClose();
    } catch (error) {
      console.error('Erro ao adicionar estatísticas:', error);
    }
  };

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle="E RELATÓRIOS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS" }
      ]}
    >
      <div className="p-8 space-y-8">
        <div className="mb-8">
          <UniversalSearchBar 
            searchFunction={(query, types) => 
              searchWithRealData(query, types, championshipsData, teamsData, matchesData, participantsData)
            }
            config={{
              placeholder: "Busque por jogadores, equipes ou campeonatos...",
              searchTypes: ['player', 'team', 'championship'],
              minQueryLength: 2,
              maxResults: 10,
            }}
            onQueryChange={setSearchQuery}
            onResultClick={handleSearchResultClick}
          />
        </div>

        {/* General Statistics */}
        {isLoadingPlayers || isLoadingTeams ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {generalStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* Top Players and Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoadingPlayers ? (
            <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </Card>
          ) : (
            <TopPlayersCard players={topPlayers} />
          )}
          
          {isLoadingTeams ? (
            <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </Card>
          ) : (
            <TeamRankingCard teams={topTeams} />
          )}
        </div>

        {/* Recent Championships */}
        <div className="mt-8">
          {/* Status filter */}
        <div className="flex justify-end mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-2 px-4 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="Planejado">Planejados</option>
            <option value="Ativo">Ativos</option>
            <option value="Finalizado">Finalizados</option>
          </select>
        </div>
          <h2 className="text-xl font-semibold text-white mb-4">Campeonatos Recentes</h2>
          
          {isLoadingChampionships ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChampionships.slice(0, 6).map((championship: any) => {
                const getStatusDisplay = (status: string) => {
                  const statusMap = {
                    'Ativo': { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
                    'Finalizado': { label: 'Finalizado', color: 'bg-blue-500/20 text-blue-400' },
                    'Planejado': { label: 'Planejado', color: 'bg-yellow-500/20 text-yellow-400' },
                  };
                  return statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
                };

                const statusDisplay = getStatusDisplay(championship.status);
                const teamCount = getTeamCountForChampionship(championship.championship_id);
                const matchCount = getMatchCountForChampionship(championship.championship_id);

                return (
                  <Card key={championship.championship_id} className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex-1 mr-3">
                        {championship.name}
                      </h3>
                      <span className={`px-3 py-1 ${statusDisplay.color} rounded-full text-sm font-medium`}>
                        {statusDisplay.label}
                      </span>
                    </div>

                    <p className="text-slate-400 mb-6 flex-1 text-sm line-clamp-2">
                      {championship.description || 'Sem descrição'}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-300 text-sm">
                        <Calendar className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span>
                          {new Date(championship.start_date).toLocaleDateString('pt-BR')} - {new Date(championship.end_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      {championship.location && (
                        <div className="flex items-center text-slate-300 text-sm">
                          <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span>{championship.location}</span>
                        </div>
                      )}
                      
                      {championship.prize && (
                        <div className="flex items-center text-yellow-500 text-sm">
                          <Crown className="w-4 h-4 mr-2" />
                          <span>{championship.prize}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-slate-300 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-blue-500 mr-2" />
                          <span>{teamCount} equipes</span>
                        </div>
                        {matchCount > 0 && (
                          <div className="flex items-center">
                            <Target className="w-4 h-4 text-blue-500 mr-2" />
                            <span>{matchCount} partidas</span>
                          </div>
                        )}
                      </div>
                    </div>


                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white flex items-center justify-center"
                      onClick={handleModalOpen}
                    >
                     Adicionar Estatísticas 
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Link
                      href={`/dashboard/estatisticas/campeonato/${championship.championship_id}`}
                      className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-2 rounded-md flex items-center justify-center mt-auto text-sm"
                    >
                      Ver estatísticas
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
          
          {filteredChampionships.length === 0 && !isLoadingChampionships && (
            <Card className="p-8 text-center">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Nenhum campeonato encontrado
              </h3>
              <p className="text-slate-500">
                Tente ajustar os filtros ou termos de busca
              </p>
            </Card>
          )}
          
          {filteredChampionships.length > 6 && (
            <div className="flex justify-center mt-6">
              <Link 
                href="/dashboard/campeonatos" 
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
              >
                Ver todos os campeonatos
              </Link>
            </div>
          )}
        </div>
      </div>
      <AddChampionshipStatisticsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
};

export default Estatisticas;
