"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Clock, MapPin, Trophy, Trash2, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { SearchResult } from "@/hooks/useSearch";
import { useModal } from "@/hooks/useModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { toast } from "react-hot-toast";
import { 
  useGetAllMatches, 
  useBulkUpdateMatches,
  useUpdateMatchResult,
  Match 
} from "@/services/matchService";
import { useGetAllTeams, Team } from "@/services/teamService";
import { useGetAllChampionships, Championship } from "@/services/championshipService";

// Create a search function for matches using API data
const searchMatches = (query: string, types: string[] = ["match"], matches: Match[] = [], teams: Team[] = []): SearchResult[] => {
  if (!query.trim() || !types.includes("match")) return [];

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

const GerenciarPartidas = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

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

  // Mutation hooks (only bulk update and individual result update are available)
  const bulkUpdateMatches = useBulkUpdateMatches();
  const updateMatchResult = useUpdateMatchResult();
  
  const isMutating =
    bulkUpdateMatches.status === "pending" ||
    updateMatchResult.status === "pending";

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

  // Convert teams data for modal compatibility
  const convertedTeams = useMemo(() => {
    return teamsData.map(team => ({
      team_id: team.team_id,
      name: team.name,
      manager_name: team.name, // Default manager name
      logo: undefined,
      wins: 0,
      losses: 0,
      win_rate: 0,
      participants_count: team.Participants?.length || 0,
      championships_participated: 0,
      championships_won: 0,
    }));
  }, [teamsData]);

  // Convert championships data for modal compatibility
  const convertedChampionships = useMemo(() => {
    return championshipsData.map(championship => ({
      championship_id: championship.id,
      name: championship.name,
      description: championship.description,
      format: championship.format as 'single_elimination' | 'double_elimination' | 'round_robin',
      start_date: championship.start_date,
      end_date: championship.end_date,
      location: championship.location,
      status: championship.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
      user_id: championship.user_id,
    }));
  }, [championshipsData]);

  // Convert API data to display format
  const partidas = useMemo(() => {
    return matchesData.map(match => {
      const teamA = teamsData.find(t => t.team_id === match.teamA_id);
      const teamB = teamsData.find(t => t.team_id === match.teamB_id);
      const championship = championshipsData.find(c => c.id === match.championship_id);
      
      return {
        match_id: match.match_id,
        team_a: teamA?.name || `Team ${match.teamA_id}`,
        team_b: teamB?.name || `Team ${match.teamB_id}`,
        score_a: match.score?.teamA,
        score_b: match.score?.teamB,
        map: match.map,
        date: new Date(match.date).toLocaleDateString('pt-BR'),
        tournament: championship?.name || `Championship ${match.championship_id}`,
        winner: match.winner_team_id === match.teamA_id ? teamA?.name :
                match.winner_team_id === match.teamB_id ? teamB?.name : undefined,
        status: match.status,
        stage: match.stage,
        fullMatch: match
      };
    });
  }, [matchesData, teamsData, championshipsData]);

  // Handle updating match result
  const handleUpdateResult = useCallback(async (matchId: number, winnerId: number, score: { teamA: number; teamB: number }) => {
    try {
      await updateMatchResult.mutateAsync({
        id: matchId,
        winner_team_id: winnerId,
        score
      });
      toast.success("Resultado da partida atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating match result:", error);
      toast.error("Erro ao atualizar resultado da partida");
    }
  }, [updateMatchResult]);

  // Close delete confirmation modal
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
    setDeleteItemName("");
  }, []);


  const renderData = (data: string | null | undefined) => {
    if (!data) {
      return (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="text-green-400 text-sm font-medium">
            Necessário agendar
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="text-white text-sm">{data}</span>
      </div>
    );
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "match") {
      router.push(`/dashboard/partidas/${result.id}`);
    }
  };

  // Create search function with current data
  const searchMatchesWithData = useCallback((query: string, types: string[] = ["match"]) => {
    return searchMatches(query, types, matchesData, teamsData);
  }, [matchesData, teamsData]);

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
          <div className="flex space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Filtrar por Status
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleAddMatch}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agendar Partida
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchMatchesWithData}
            config={{
              searchTypes: ["match"],
              placeholder: "Buscar partidas por time, torneio ou mapa...",
              maxResults: 6,
              minQueryLength: 1,
              debounceMs: 300,
            }}
            onResultClick={handleSearchResultClick}
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
              Erro ao carregar dados: {matchesError?.message || teamsError?.message || championshipsError?.message}
            </div>
          </div>
        )}

        {/* Lista de partidas */}
        {!isLoadingGet && !isMatchesError && !isTeamsError && !isChampionshipsError && (
          <div className="space-y-4">
            {partidas.length > 0 ? (
              partidas.map((partida) => (
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
                        {renderData(partida.date)} 
                      </div>

                      <div className="text-center">
                        <p className="dashboard-text-muted text-xs">Fase</p>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {partida.stage}
                        </Badge>
                      </div>

                      <div className="text-center">
                        <p className="dashboard-text-muted text-xs">Status</p>
                        {getStatusBadge(partida.status)} 
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                          onClick={() => handleEditMatch(partida.fullMatch)}
                          disabled={isMutating}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        {partida.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-300"
                            onClick={() => handleAddResult(partida.fullMatch)}
                            disabled={isMutating}
                          >
                            <Target className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500"
                          onClick={() => handleDeleteMatch(partida.match_id)}
                          disabled={isMutating}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <p className="dashboard-text-muted text-sm">
                        {partida.tournament}
                      </p>
                      {partida.status === 'scheduled' && !partida.winner && (
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                          onClick={() => handleAddResult(partida.fullMatch)}
                          disabled={isMutating}
                        >
                          Informar Resultado
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                Nenhuma partida encontrada. Agende uma nova partida para começar.
              </div>
            )}
          </div>
        )}

        {/* Stats das partidas */}
        {!isLoadingGet && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">Agendadas</p>
                  <p className="text-2xl font-bold text-white">
                    {partidas.filter(p => p.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">Ao Vivo</p>
                  <p className="text-2xl font-bold text-white">
                    {partidas.filter(p => p.status === 'live').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gray-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">Finalizadas</p>
                  <p className="text-2xl font-bold text-white">
                    {partidas.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{partidas.length}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add/Edit/Result Match Modal */}
      <AddMatchModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveMatch}
        teams={teamsData}
        championships={championshipsData}
        defaultValues={getDefaultValues()}
        mode={modalMode}
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        entityName={`a partida ${deleteItemName}`}
        isLoading={isMutating}
      />
    </DashboardLayout>
  );
};

export default GerenciarPartidas;