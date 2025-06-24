'use client'
import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, Target, Crown, ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useState } from 'react';
import { UniversalSearchBar } from '@/components/common/UniversalSearchBar';
import { searchPublicCatalog } from '@/data/search-functions';
import { SearchConfig, SearchResult } from '@/hooks/useSearch';
import { useRouter } from 'next/navigation';
import { useGetAllChampionships, type Championship } from '@/services/championshipService';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetAllTeams } from '@/services/teamService';
import { useGetAllMatches } from '@/services/matchService';
import { Match } from '@/types/match';

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

  const filteredChampionships = championshipsData.filter((championship: Championship) => {
    const matchesSearch = championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      championship.description.toLowerCase().includes(searchQuery.toLowerCase());
    const mappedStatus = mapApiStatusToFilter(championship.status);
    const matchesStatus = statusFilter === 'all' || mappedStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Show loading state
  if (isLoadingChampionships || isLoadingSubscriptions || isLoadingTeams || isLoadingMatches) {
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
  if (isChampionshipsError || isSubscriptionsError || isTeamsError || isMatchesError) {
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

  // Configuration for UniversalSearchBar
  const searchConfig: SearchConfig = {
    searchTypes: ['championship', 'team', 'match'],
    placeholder: "Buscar campeonatos, equipes ou partidas...",
    maxResults: 8,
  };
  const handleResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    let path = '';
    switch (result.type) {
      case 'championship':
        path = `/campeonatos/${result.id}`;
        break;
      case 'team':
        const teamMatch = matchesData.find((match: Match) =>
          match.teamA_id === result.id || match.teamB_id === result.id
        );
        if (teamMatch) {
          path = `/campeonatos/${teamMatch.championship_id}/equipes/${result.id}`;
        } else {
          path = `/campeonatos/1/equipes/${result.id}`; // Fallback
        }
        break;
      case 'match':
        const match = matchesData.find((m: Match) => m.match_id === result.id);
        if (match) {
          path = `/campeonatos/${match.championship_id}/partidas/${result.id}`;
        }
        break;
      default:
        console.log('Unhandled search result type:', result.type);
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
                searchFunction={searchPublicCatalog}
                config={searchConfig}
                onQueryChange={setSearchQuery}
                onResultClick={handleResultClick} // Optional: handle click on search results
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