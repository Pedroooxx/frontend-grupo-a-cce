'use client'
import { UniversalSearchBar } from '@/components/common/UniversalSearchBar';
import PublicLayout from '@/components/layout/PublicLayout';
import { SearchConfig, SearchResult } from '@/hooks/useSearch';
import { useGetAllChampionships } from '@/services/championshipService';
import { Championship } from '@/types/championship';
import { useGetAllMatches, type Match } from '@/services/matchService';
import { getSearchResultRoute } from '@/utils/searchNavigation';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetAllParticipants, useGetAllTeams, type Team, type TeamParticipant } from '@/services/teamService';
import { ArrowRight, Calendar, Crown, MapPin, Target, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Search function using real API data (same as home page)
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
  matchesData: Match[] = [],
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

 /**
 * Championships listing page with search and filtering functionality
 */
export default function ChampionshipsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Planejado' | 'Ativo' | 'Finalizado'>('all');
  const router = useRouter();

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

  // Fetch teams data
  const {
    data: teamsData = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
  } = useGetAllTeams();

  // Fetch matches data
  const {
    data: matchesData = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
  } = useGetAllMatches();

  // Fetch participants data
  const {
    data: participantsData = [],
    isLoading: isLoadingParticipants,
    isError: isParticipantsError,
  } = useGetAllParticipants();

  /**
   * Count teams for a specific championship using subscription data
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
  };

  /**
   * Count matches for a specific championship
   */
  const getMatchCountForChampionship = (championshipId: number): number => {
    if (!matchesData.length) {
      return 0;
    }
    return matchesData.filter(match => match.championship_id === championshipId).length;
  };  // Map API status to filter status
  const mapApiStatusToFilter = (apiStatus: string): 'Planejado' | 'Ativo' | 'Finalizado' => {
    switch (apiStatus) {
      case 'planejado':
        return 'Planejado';
      case 'ativo':
        return 'Ativo';
      case 'finalizado':
        return 'Finalizado';
      default:
        return 'Planejado'; // default
    }
  };

  const filteredChampionships = championshipsData.filter(championship => {
    const statusMatch = statusFilter === 'all' || championship.status === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = championship.name.toLowerCase().includes(searchLower) ||
      (championship.description && championship.description.toLowerCase().includes(searchLower)) ||
      (championship.location && championship.location.toLowerCase().includes(searchLower)) ||
      (championship.status && championship.status.toLowerCase().includes(searchLower));
    return statusMatch && searchMatch;
  });

  // Show loading state
  if (isLoadingChampionships || isLoadingSubscriptions || isLoadingTeams || isLoadingMatches || isLoadingParticipants) {
    return (
      <PublicLayout title="Campeonatos">
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-lg">Carregando campeonatos...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Show error state
  if (isChampionshipsError || isSubscriptionsError || isTeamsError || isMatchesError || isParticipantsError) {
    return (
      <PublicLayout title="Campeonatos">
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white text-center">
            <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Erro ao carregar campeonatos</h2>
            <p className="text-slate-400">Tente novamente mais tarde</p>
          </div>
        </div>
      </PublicLayout>);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Configuration for UniversalSearchBar - Add 'player' to search types
  const searchConfig: SearchConfig = {
    searchTypes: ['championship', 'team', 'player', 'match'],
    placeholder: "Buscar campeonatos, equipes, jogadores ou partidas...",
    maxResults: 8,
  };

  // Create search function that uses all the fetched data
  const searchFunction = (query: string, types: string[]) => {
    return searchWithRealData(query, types, championshipsData, teamsData, matchesData, participantsData);
  };

  // Improved result click handler with proper public routes
  const handleResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    let path = '';
    switch (result.type) {
      case 'championship':
        path = `/campeonatos/${result.id}`;
        break; 
      case 'team':
        // For teams from search, we need to find which championship they're in
        // Look for their championship participation
        const teamSubscriptions = subscriptionsData.filter(sub => sub.team_id === result.id);
        if (teamSubscriptions.length > 0) {
          // Use the first championship this team is subscribed to
          const championshipId = teamSubscriptions[0].championship_id;
          path = `/campeonatos/${championshipId}/equipes/${result.id}`;
        } else {
          // Fallback: stay on championships page
          path = `/campeonatos`;
        }
        break;
      case 'player':
        // Navigate to player's team page within their championship
        const playerTeamId = result.metadata?.teamId;
        if (playerTeamId) {
          const playerTeamSubscriptions = subscriptionsData.filter(sub => sub.team_id === playerTeamId);
          if (playerTeamSubscriptions.length > 0) {
            const championshipId = playerTeamSubscriptions[0].championship_id;
            path = `/campeonatos/${championshipId}/equipes/${playerTeamId}`;
          } else {
            path = `/campeonatos`;
          }
        } else {
          path = `/campeonatos`;
        }
        break;
      case 'match':
        const match = matchesData.find((m: any) => m.match_id === result.id);
        if (match) {
          path = `/campeonatos/${match.championship_id}/partidas/${match.match_id}`;
        } else {
          path = `/campeonatos`;
        }
        break;
    }
    if (path) {
      router.push(path);
    }
  };

  return (
    <PublicLayout title="Campeonatos">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Campeonatos de Valorant
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Acompanhe todos os campeonatos, desde torneios locais até competições nacionais
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <UniversalSearchBar
                searchFunction={searchFunction}
                config={searchConfig}
                onQueryChange={setSearchQuery}
                onResultClick={handleResultClick}
                className="w-full"
              />
            </div>            {/* Status Filter */}            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-red-500"
              >
                <option value="all">Todos os Status</option>
                <option value="Planejado">Planejados</option>
                <option value="Ativo">Ativos</option>
                <option value="Finalizado">Finalizados</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-400">
              {filteredChampionships.length} campeonato{filteredChampionships.length !== 1 ? 's' : ''} encontrado{filteredChampionships.length !== 1 ? 's' : ''}
            </p>
          </div>          {/* Championships Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingChampionships || isLoadingSubscriptions || isLoadingTeams || isLoadingMatches ? (
              // Loading state within grid
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-800 border border-slate-700 p-6 rounded-md flex flex-col min-h-[320px] animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-slate-700 rounded mb-6 flex-1"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-700 rounded w-20"></div>
                      <div className="h-4 bg-slate-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              ))
            ) : isChampionshipsError || isSubscriptionsError || isTeamsError || isMatchesError ? (
              // Error state
              <div className="col-span-full text-center py-12">
                <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-400 mb-2">
                  Erro ao carregar campeonatos
                </h3>
                <p className="text-slate-500">
                  Tente novamente mais tarde
                </p>
              </div>
            ) : filteredChampionships.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Nenhum campeonato encontrado
                </h3>
                <p className="text-slate-500">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            ) : (
              // Render championships
              filteredChampionships.map((championship: Championship) => {
                const getStatusDisplay = (status: string) => {
                  const statusMap = {
                    'Ativo': { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
                    'Finalizado': { label: 'Finalizado', color: 'bg-blue-500/20 text-blue-400' },
                    'Planejado': { label: 'Planejado', color: 'bg-yellow-500/20 text-yellow-400' },
                  };
                  return statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
                };

                const statusDisplay = getStatusDisplay(championship.status);
                // Calculate actual team count from subscriptions
                const teamCount = getTeamCountForChampionship(championship.championship_id);
                const matchCount = getMatchCountForChampionship(championship.championship_id);

                // Format championship start date
                const startDate = new Date(championship.start_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });

                const endDate = new Date(championship.end_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });

                return (
                  <div key={championship.championship_id} className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md flex flex-col min-h-[320px]">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex-1 mr-3">
                        {championship.name}
                      </h3>
                      <span className={`px-3 py-1 ${statusDisplay.color} rounded-full text-sm font-medium`}>
                        {statusDisplay.label}
                      </span>
                    </div>

                    <p className="text-slate-400 mb-6 flex-1 text-sm leading-relaxed">
                      {championship.description && championship.description.length > 120
                        ? `${championship.description.substring(0, 120)}...`
                        : championship.description || 'Campeonato emocionante com equipes competitivas'
                      }
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-300 text-sm">
                        <Calendar className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        <span>{startDate} - {endDate}</span>
                      </div>
                      {championship.location && (
                        <div className="flex items-center text-slate-300 text-sm">
                          <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                          <span>{championship.location}</span>
                        </div>
                      )}
                      {championship.prize && (
                        <div className="flex items-center text-yellow-500 text-sm">
                          <Crown className="w-4 h-4 mr-2" />
                          <span>{championship.prize}</span>
                        </div>
                      )}                      <div className="flex items-center justify-between text-slate-300 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-red-500 mr-2" />
                          <span>{teamCount} equipes</span>
                        </div>
                        {matchCount > 0 && (
                          <div className="flex items-center">
                            <Target className="w-4 h-4 text-red-500 mr-2" />
                            <span>{matchCount} partidas</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/campeonatos/${championship.championship_id}`}
                      className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-3 rounded-md flex items-center justify-center mt-auto"
                    >                      {championship.status === 'Finalizado' ? 'Ver Resultados' :
                      championship.status === 'Planejado' ? 'Ver Detalhes' : 'Acompanhe'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>

          {/* No Results */}
          {filteredChampionships.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Nenhum campeonato encontrado
              </h3>
              <p className="text-slate-500">
                Tente ajustar os filtros ou termos de busca
              </p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}