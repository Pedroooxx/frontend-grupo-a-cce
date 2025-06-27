'use client'
import React, { useEffect, useState } from "react";
import { Search, Trophy, Users, Calendar, Target, ArrowRight, UserPlus, LogIn, User } from "lucide-react";
import Link from "next/link";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SearchConfig, SearchResult } from "@/hooks/useSearch";
import { useGetAllChampionships } from "@/services/championshipService";
import { Championship } from "@/types/championship";
import { useGetAllSubscriptions } from "@/services/subscriptionService";
import { useGetAllTeams, useGetAllParticipants, type TeamParticipant, type Team } from "@/services/teamService";
import { useGetAllMatches, type Match } from "@/services/matchService";

// Create a simple search function using the API data
/**
 * Search function that filters through real API data
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
        team.name.toLowerCase().includes(searchQuery) ||
        team.Participants?.some((participant: TeamParticipant) =>
          participant.name.toLowerCase().includes(searchQuery) ||
          participant.nickname.toLowerCase().includes(searchQuery)
        )
      )
      .map(team => ({
        id: team.team_id,
        name: team.name,
        type: "team",
        subtitle: `${team.Participants?.length || 0} jogadores`,
        metadata: {
          participantsCount: team.Participants?.length || 0,
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
 * Home page component with championship search and display functionality
 */
export default function HomePage() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch data from API
  const {
    data: championshipsData = [],
    isLoading: isLoadingChampionships,
    isError: isChampionshipsError,
  } = useGetAllChampionships();

  const {
    data: subscriptionsData = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useGetAllSubscriptions();

  const {
    data: teamsData = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
  } = useGetAllTeams();

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

  useEffect(() => {
    if (status !== 'loading') {
      setIsInitialLoad(false);
    }
  }, [status]);

  /**
   * Count teams for a specific championship using subscription data
   */
  const getTeamCountForChampionship = (championshipId: number): number => {
    if (!subscriptionsData.length) {
      return 0;
    }

    const championshipSubscriptions = subscriptionsData.filter(
      subscription => subscription.championship_id === championshipId
    );

    const uniqueTeamIds = new Set(championshipSubscriptions.map(sub => sub.team_id));
    return uniqueTeamIds.size;
  };

  const handleAuthAction = (action: 'signin' | 'signup' | 'dashboard') => {
    if (action === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/auth/${action}`);
    }
  };

  // Show loading on initial load when there's no session data
  const shouldShowLoading = status === "loading" && isInitialLoad && !session;

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Configuration for UniversalSearchBar - Add 'player' to search types
  const searchConfig: SearchConfig = {
    searchTypes: ['championship', 'team', 'player', 'match'],
    placeholder: "Buscar campeonatos, equipes, jogadores ou partidas...",
    maxResults: 8,
  };

  // Create search function that uses real data - Add participants data
  const searchFunction = (query: string, types: string[]) => {
    return searchWithRealData(query, types, championshipsData, teamsData, matchesData, participantsData);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    let path = '';
    switch (result.type) {
      case 'championship':
        path = `/campeonatos/${result.id}`;
        break; 
      case 'team':
        // Navigate to team detail page in dashboard
        path = `/dashboard/equipes/${result.id}`;
        break;
      case 'player':
        // Navigate to player's team page
        const playerTeamId = result.metadata?.teamId;
        if (playerTeamId) {
          const playerTeamMatch = matchesData.find((match: Match) =>
            match.teamA_id === playerTeamId || match.teamB_id === playerTeamId
          );
          if (playerTeamMatch) {
            path = `/campeonatos/${playerTeamMatch.championship_id}/equipes/${playerTeamId}`;
          } else {
            path = `/campeonatos/1/equipes/${playerTeamId}`;
          }
        }
        break;
      case 'match':
        const match = matchesData.find((m: Match) => m.match_id === result.id);
        if (match) {
          path = `/campeonatos/${match.championship_id}/partidas/${result.id}`;
        }
        break;
    }
    if (path) {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header onAuthAction={handleAuthAction} />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-b from-slate-800 to-slate-900 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/videos/homeBGvideo.mp4" type="video/mp4" />
            <source src="/videos/homeBGvideo.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {session && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Bem-vindo de volta!</h3>
                </div>
                <p className="text-green-300">
                  Olá, <span className="font-bold">{session.user.name}</span>! Pronto para gerenciar seus campeonatos?
                </p>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Gerencie Campeonatos de
              <span className="text-red-500"> Valorant</span>
            </h1>
            <p className="text-base md:text-xl text-slate-300 mb-6 md:mb-8 leading-relaxed px-4">
              A plataforma completa para criar, gerenciar e acompanhar campeonatos de Valorant.
              Controle estatísticas, organize equipes e monitore o desempenho dos jogadores em tempo real.
            </p>            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4">
              {!session ? (
                <>
                  <button
                    onClick={() => handleAuthAction('signup')}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-base md:text-lg"
                  >
                    <Trophy className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    Criar Meu Campeonato
                  </button>
                  <button
                    onClick={() => router.push('/campeonatos')}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md text-base md:text-lg"
                  >
                    Ver Campeonatos
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthAction('dashboard')}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-base md:text-lg"
                  >
                    <Trophy className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    Ir para Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/campeonatos')}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md text-base md:text-lg"
                  >
                    Ver Campeonatos
                  </button>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">15+</div>
                <div className="text-slate-400 text-xs md:text-sm">Campeonatos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">120+</div>
                <div className="text-slate-400 text-xs md:text-sm">Equipes Registradas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">500+</div>
                <div className="text-slate-400 text-xs md:text-sm">Jogadores Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">1.2K+</div>
                <div className="text-slate-400 text-xs md:text-sm">Partidas Jogadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="campeonatos" className="py-12 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Encontre Campeonatos, Equipes e Partidas
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base px-4">
              Busque por campeonatos ativos, equipes participantes ou partidas específicas.
              Acompanhe estatísticas em tempo real e veja os melhores desempenhos.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8 md:mb-12 px-4">
            <UniversalSearchBar
              searchFunction={searchFunction}
              config={searchConfig}
              onResultClick={handleResultClick}
              className="w-full"
            />
          </div>

          {/* Featured Championships */}          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingChampionships || isLoadingSubscriptions || isLoadingTeams || isLoadingMatches || isLoadingParticipants ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-800 border border-slate-700 p-6 rounded-md flex flex-col min-h-[280px] animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-slate-700 rounded mb-6 flex-1"></div>
                  <div className="flex items-center justify-between text-sm mb-6">
                    <div className="h-4 bg-slate-700 rounded w-20"></div>
                    <div className="h-4 bg-slate-700 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              ))) : isChampionshipsError || isSubscriptionsError || isTeamsError || isParticipantsError ? (
                // Error state
                <div className="col-span-full text-center py-12">
                  <p className="text-red-400 text-lg">Erro ao carregar dados</p>
                </div>
              ) : championshipsData.length === 0 ? (
                // Empty state
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400 text-lg">Nenhum campeonato encontrado</p>
                </div>) : (
              // Render championships from API
              championshipsData.slice(0, 3).map((championship: Championship) => {
                const getStatusDisplay = (status: string) => {
                  const statusMap = {
                    'Ativo': { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
                    'Finalizado': { label: 'Finalizado', color: 'bg-blue-500/20 text-blue-400' },
                    'Planejado': { label: 'Planejado', color: 'bg-yellow-500/20 text-yellow-400' }
                  };
                  return statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
                }; const statusDisplay = getStatusDisplay(championship.status);
                // Calculate actual team count from subscriptions
                const teamCount = getTeamCountForChampionship(championship.championship_id);
                const matchCount = championship.matches_count;
                // Format championship start date
                const startDate = new Date(championship.start_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });

                return (
                  <div key={championship.championship_id} className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md flex flex-col min-h-[280px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{championship.name}</h3>
                      <span className={`px-3 py-1 ml-8 ${statusDisplay.color} rounded-full text-sm`}>
                        {statusDisplay.label}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-6 flex-1">
                      {championship.description || 'Campeonato emocionante com equipes competitivas'}
                    </p>                    <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                      <span><Users className="w-4 h-4 inline mr-1" />{teamCount} equipes</span>
                      <span><Calendar className="w-4 h-4 inline mr-1" />Início: {startDate}</span>
                    </div>
                    <Link
                      href={`/campeonatos/${championship.championship_id}`}
                      className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-3 rounded-md flex items-center justify-center mt-auto"
                    >
                      {championship.status === 'Finalizado' ? 'Ver Resultados' :
                        championship.status === 'Planejado' ? 'Ver Detalhes' : 'Acompanhe'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>

          {/* View All Link */}
          <div className="text-center mt-8">
            <Link
              href="/campeonatos"
              className="inline-flex items-center px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md"
            >
              Ver Todos os Campeonatos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>{/* Features Section */}
      <section className="py-12 md:py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Recursos da Plataforma
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base px-4">
              Tudo que você precisa para organizar campeonatos profissionais de Valorant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Gestão de Campeonatos</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Crie e gerencie campeonatos completos com chaveamentos automáticos,
                controle de inscrições e acompanhamento de resultados.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Estatísticas Detalhadas</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Acompanhe KDA, MVPs, performance por mapa e agente.
                Análises completas para jogadores e equipes.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Gestão de Equipes</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Organize equipes, gerencie jogadores e coaches.
                Controle completo sobre participantes e permissões.
              </p>
            </div>
          </div>
        </div>
      </section>{/* CTA Section */}
      <section className="py-16 bg-gradient-to-t from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {!session ? 'Pronto para Começar?' : 'Continue Organizando'}
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            {!session
              ? 'Crie sua conta gratuitamente e comece a organizar seus próprios campeonatos de Valorant hoje mesmo.'
              : 'Acesse seu dashboard para continuar gerenciando seus campeonatos e equipes.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!session ? (
              <>
                <button
                  onClick={() => handleAuthAction('signup')}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Criar Conta Gratuita
                </button>
                <button
                  onClick={() => handleAuthAction('signin')}
                  className="px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center justify-center text-lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Fazer Login
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAuthAction('dashboard')}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Ir para Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Live Matches - Single Container */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                Partidas em Destaque
              </h3>              <div className="space-y-4">
                {isLoadingMatches ? (
                  // Loading state
                  Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="bg-slate-700 rounded-md p-4 animate-pulse">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-slate-600 rounded w-1/3"></div>
                        <div className="h-6 bg-slate-600 rounded w-16"></div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-6 bg-slate-600 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-600 rounded w-8"></div>
                        <div className="h-6 bg-slate-600 rounded w-1/4"></div>
                      </div>
                      <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                    </div>
                  ))
                ) : isMatchesError ? (
                  <div className="text-center text-slate-400 py-4">
                    Erro ao carregar partidas
                  </div>
                ) : matchesData.length === 0 ? (
                  <div className="text-center text-slate-400 py-4">
                    Nenhuma partida encontrada
                  </div>
                ) : (                  // Render first 2 matches from API
                  matchesData.slice(0, 2).map((match: Match) => {
                    const getStatusDisplay = (status: string) => {
                      const statusMap: Record<string, { label: string; color: string }> = {
                        'Planejada': { label: 'À Agendar', color: 'bg-orange-500/20 text-orange-400' },
                        'Agendada': { label: 'Agendada', color: 'bg-yellow-500/20 text-yellow-400' },
                        'Finalizada': { label: 'Finalizada', color: 'bg-green-500/20 text-green-400' },
                      };
                      return statusMap[status] || { label: status, color: 'bg-blue-500/20 text-blue-400' };
                    };

                    const statusDisplay = getStatusDisplay(match.status);                    // Only format date/time if not Planejada
                    let dateTimeDisplay = "Sem data definida";
                    if (match.status !== "Planejada") {
                      const matchDate = new Date(match.date);
                      const formattedDate = matchDate.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      });
                      const formattedTime = matchDate.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      dateTimeDisplay = `${formattedDate} ${formattedTime}`;
                    }

                    return (
                      <Link
                        key={match.match_id}
                        href={`/campeonatos/${match.championship_id}/partidas/${match.match_id}`}
                        className="block bg-slate-700 rounded-md p-4 hover:bg-slate-600 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">{match.stage}</span>
                          <span className={`px-2 py-1 rounded text-xs ${statusDisplay.color}`}>
                            {statusDisplay.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-white">
                            <span>{match.TeamA.name}</span>
                            {match.score && (
                              <span className="ml-2 text-red-500 font-semibold">
                                {match.score.teamA}
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-sm">VS</div>
                          <div className="text-white text-right">
                            {match.score && (
                              <span className="mr-2 text-red-500 font-semibold">
                                {match.score.teamB}
                              </span>
                            )}
                            <span>{match.TeamB.name}</span>
                          </div>
                        </div>                        <div className="text-slate-400 text-sm mt-2">
                          {match.map} • {dateTimeDisplay}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              <Link
                href="/campeonatos"
                className="inline-flex items-center mt-6 text-red-500 hover:text-red-400 transition-colors"
              >
                Ver todos os campeonatos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/**
 * A Search Bar is implemented in the HomePage component to allow users to search for championships, teams, and matches. It utilizes the UniversalSearchBar component, which takes in a search function, configuration, and a click handler for results. The search bar is styled to be responsive and is placed within a container that centers it on the page. This enhances user experience by providing a straightforward way to access relevant data quickly.
 */
