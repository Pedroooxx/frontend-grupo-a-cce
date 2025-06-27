"use client";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Trophy, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { SearchResult } from "@/hooks/useSearch";
import { toast } from "react-hot-toast";
import { 
  useGetAllMatches, 
  useUpdateMatchResult,
  Match 
} from "@/services/matchService";
import { useGetAllTeams, Team } from "@/services/teamService";
import { useGetAllChampionships, Championship } from "@/services/championshipService";
import { AddMatchModal } from "@/components/modals/AddMatchModal";
import { MatchFormValues } from "@/types/match";
import { Championship as SubscriptionChampionship } from "@/types/subscription";

/**
 * Create a search function for matches using API data
 * @param query - Search query string
 * @param types - Array of search types to include
 * @param matches - Array of matches data
 * @param teams - Array of teams data
 * @returns Array of search results
 */
const searchMatches = (query: string, types: string[] = ["match"], matches: Match[] = [], teams: Team[] = []): SearchResult[] => {
  if (!query.trim() || !types.includes("match") || !Array.isArray(matches) || !Array.isArray(teams)) return [];

  const searchQuery = query.toLowerCase();

  return matches
    .filter((match) => {
      const teamA = teams.find(t => t.team_id === match.teamA_id);
      const teamB = teams.find(t => t.team_id === match.teamB_id);
      
      return (
        teamA?.name.toLowerCase().includes(searchQuery) ||
        teamB?.name.toLowerCase().includes(searchQuery) ||
        match.map.toLowerCase().includes(searchQuery) ||
        match.stage.toLowerCase().includes(searchQuery)
      );
    })
    .map((match) => {
      const teamA = teams.find(t => t.team_id === match.teamA_id);
      const teamB = teams.find(t => t.team_id === match.teamB_id);
      
      return {
        id: match.match_id,
        name: `${teamA?.name || 'Team A'} vs ${teamB?.name || 'Team B'}`,
        type: "match",
        subtitle: `${match.stage} - ${match.map}`,
        metadata: {
          championshipId: match.championship_id,
          status: match.status,
          map: match.map,
          stage: match.stage,
        },
      };
    });
};

/**
 * Extended match interface for display purposes
 */
interface MatchDisplay extends Match {
  team_a: string;
  team_b: string;
  score_a?: number;
  score_b?: number;
  players_a: number;
  players_b: number;
  tournament: string;
  winner?: string;
  displayDate: string;
}

/**
 * Dashboard page for managing matches (partidas)
 * Displays match data with team information, scores, and statistics
 * Includes search functionality and error handling for API responses
 */
const GerenciarPartidas = () => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch data via service hooks
  const {
    data: matchesData = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
    error: matchesError,
  } = useGetAllMatches();

  const {
    data: teamsData = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
    error: teamsError,
  } = useGetAllTeams();

  const {
    data: championshipsData = [],
    isLoading: isLoadingChampionships,
    isError: isChampionshipsError,
    error: championshipsError,
  } = useGetAllChampionships();

  const isLoadingGet = isLoadingMatches || isLoadingTeams || isLoadingChampionships;

  // Mutation hooks (only result update is available)
  const updateMatchResult = useUpdateMatchResult();
  
  const isMutating = updateMatchResult.status === "pending";

  // Error handling effects
  useEffect(() => {
    if (isMatchesError && matchesError) {
      toast.error(`Erro ao carregar partidas: ${matchesError.message}`);
    }
  }, [isMatchesError, matchesError]);

  useEffect(() => {
    if (isTeamsError && teamsError) {
      toast.error(`Erro ao carregar equipes: ${teamsError.message}`);
    }
  }, [isTeamsError, teamsError]);

  useEffect(() => {
    if (isChampionshipsError && championshipsError) {
      toast.error(`Erro ao carregar campeonatos: ${championshipsError.message}`);
    }
  }, [isChampionshipsError, championshipsError]);

  // Convert API data to display format
  const partidas: MatchDisplay[] = useMemo(() => {
    // Ensure matchesData is an array before mapping
    if (!Array.isArray(matchesData)) {
      console.error('matchesData is not an array:', matchesData);
      return [];
    }
    
    return matchesData.map(match => {
      const teamA = Array.isArray(teamsData) ? teamsData.find(t => t.team_id === match.teamA_id) : undefined;
      const teamB = Array.isArray(teamsData) ? teamsData.find(t => t.team_id === match.teamB_id) : undefined;
      const championship = Array.isArray(championshipsData) ? championshipsData.find(c => c.championship_id === match.championship_id) : undefined;
      
      return {
        ...match,
        team_a: teamA?.name || `Team ${match.teamA_id}`,
        team_b: teamB?.name || `Team ${match.teamB_id}`,
        score_a: match.score?.teamA,
        score_b: match.score?.teamB,
        players_a: teamA?.Participants?.filter(p => !p.is_coach).length || 0,
        players_b: teamB?.Participants?.filter(p => !p.is_coach).length || 0,
        tournament: championship?.name || `Championship ${match.championship_id}`,
        winner: match.winner_team_id === match.teamA_id ? teamA?.name :
                match.winner_team_id === match.teamB_id ? teamB?.name : undefined,
        displayDate: new Date(match.date).toLocaleDateString('pt-BR')
      } as MatchDisplay;
    });
  }, [matchesData, teamsData, championshipsData]);

  // Filter matches based on search query
  const filteredPartidas = useMemo(() => {
    if (!searchQuery.trim()) {
      return partidas;
    }

    const query = searchQuery.toLowerCase();
    return partidas.filter(partida => 
      partida.team_a.toLowerCase().includes(query) ||
      partida.team_b.toLowerCase().includes(query) ||
      partida.map.toLowerCase().includes(query) ||
      partida.stage.toLowerCase().includes(query) ||
      partida.tournament.toLowerCase().includes(query) ||
      partida.status.toLowerCase().includes(query)
    );
  }, [partidas, searchQuery]);

  const handleSearchInputChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Create search function for the search bar (returns empty array to disable dropdown)
  const searchMatchesWithData = useCallback(() => {
    return []; // Return empty array to disable dropdown functionality
  }, []);

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Desconhecido</Badge>;

    switch (status.toLowerCase()) {
      case "scheduled":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Agendada
          </Badge>
        );
      case "live":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Ao Vivo
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Finalizada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            {status}
          </Badge>
        );
    }
  };

  const renderData = (date: string) => {
    return (
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="text-white font-medium">{date}</span>
      </div>
    );
  };

  const openEditModal = (matchDisplay: MatchDisplay) => {
    setEditingMatch(matchDisplay); // The base Match properties are included in MatchDisplay
    setIsEditModalOpen(true);
  };

  const handleEditMatch = async (data: MatchFormValues) => {
    if (!data.score || !data.winner_team_id) {
      toast.error('Resultado e time vencedor são obrigatórios');
      return;
    }
    
    await updateMatchResult.mutateAsync({
      id: editingMatch?.match_id || 0,
      winner_team_id: data.winner_team_id,
      score: data.score,
    });
    setIsEditModalOpen(false);
  };

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="PARTIDAS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "GERENCIAR PARTIDAS" },
      ]}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gerenciar Partidas</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchMatchesWithData}
            config={{
              searchTypes: ["match"],
              placeholder: "Buscar partidas por time, torneio ou mapa...",
              maxResults: 0, // Disable dropdown
              minQueryLength: 1,
              debounceMs: 300,
            }}
            onQueryChange={handleSearchInputChange}
            className="max-w-xl"
          />
        </div>

        {/* Loading State */}
        {isLoadingGet && (
          <div className="flex justify-center py-8">
            <div className="text-white">Carregando partidas...</div>
          </div>
        )}

        {/* Error State */}
        {(isMatchesError || isTeamsError || isChampionshipsError) && (
          <div className="flex justify-center py-8">
            <div className="text-red-400">
              Erro ao carregar dados: 
            </div>
          </div>
        )}

        {/* Lista de partidas */}
        {!isLoadingGet && !isMatchesError && !isTeamsError && !isChampionshipsError && (
          <div className="space-y-4">
            {filteredPartidas.length > 0 ? (
              filteredPartidas.map((partida) => (
                <Card
                  key={partida.match_id}
                  className="dashboard-card border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Calendar className="w-6 h-6 text-green-500" />
                      </div>

                      <div className="flex items-center space-x-8">
                        {/* Equipes */}
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-white">
                            {partida.team_a}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {partida.players_a} jogadores
                          </p>
                          {partida.winner === partida.team_a && (
                            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
                          )}
                        </div>

                        <div className="text-center">
                          <span className="text-2xl font-bold text-red-500">VS</span>
                          {partida.score_a !== undefined && partida.score_b !== undefined && (
                            <p className="text-xl font-bold text-white mt-1">
                              {`${partida.score_a} - ${partida.score_b}`}
                            </p>
                          )}
                        </div>

                        <div className="text-center">
                          <h3 className="text-lg font-bold text-white">
                            {partida.team_b}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {partida.players_b} jogadores
                          </p>
                          {partida.winner === partida.team_b && (
                            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="dashboard-text-muted text-xs">Mapa</p>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="text-white font-medium">
                            {partida.map}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="dashboard-text-muted text-xs">Data</p>
                        {renderData(partida.displayDate)} 
                      </div>

                      <div className="text-center">
                        <p className="dashboard-text-muted text-xs">Fase</p>
                        <span className="text-white font-medium block">
                          {partida.stage}
                        </span>
                      </div>

                      <div className="text-center">
                        <p className="dashboard-text-muted text-xs">Status</p>
                        {getStatusBadge(partida.status)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                        onClick={() => router.push(`/campeonatos/${partida.championship_id}/partidas/${partida.match_id}`)}
                      >
                        <Target className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-400 bg-red-900/10 hover:bg-red-900/30 hover:border-red-400 transition-all duration-200 flex items-center gap-1 shadow-lg ring-2 ring-red-700/30 hover:scale-105 focus:ring-4 focus:ring-red-500/40"
                        onClick={() => openEditModal(partida)}
                        aria-label="Editar partida"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
                        </svg>
                        <span className="font-bold tracking-wide text-red-200">Editar</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                Nenhuma partida encontrada.
              </div>
            )}
          </div>
        )}

        <AddMatchModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditMatch}
          teams={teamsData.map(team => ({
            team_id: team.team_id,
            name: team.name,
            manager_name: '', // Team type doesn't have manager_name
            wins: 0,
            losses: 0,
            win_rate: 0,
            total_matches: 0,
            participants_count: team.Participants?.length || 0,
            championships_participated: 0,
            championships_won: 0
          }))}
          championships={championshipsData.map((championship): SubscriptionChampionship => ({
            championship_id: championship.championship_id,
            name: championship.name,
            start_date: championship.start_date,
            end_date: championship.end_date,
            format: championship.format,
            prize: typeof championship.prize === 'string' ? parseFloat(championship.prize) || 0 : championship.prize,
            status: championship.status,
            location: championship.location
          }))}
          defaultValues={editingMatch ? {
            championship_id: editingMatch.championship_id,
            teamA_id: editingMatch.teamA_id,
            teamB_id: editingMatch.teamB_id,
            stage: editingMatch.stage,
            map: editingMatch.map,
            date: editingMatch.date,
            winner_team_id: editingMatch.winner_team_id,
            score: editingMatch.score,
          } : undefined}
          mode='edit'
        />
      </div>
    </DashboardLayout>
  );
};

export default GerenciarPartidas;
