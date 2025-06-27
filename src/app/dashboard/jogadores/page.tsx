"use client";
import { ParticipantCard } from "@/components/cards/ParticipantCard";
import { AddParticipantModal } from "@/components/modals/AddParticipantModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { useModal } from "@/hooks/useModal";
import { useAllPlayersSummary } from "@/hooks/useStatistics";
import { useCreateParticipant, useDeleteParticipant, useGetAllParticipants, useUpdateParticipant, type Participant } from "@/services/participantService";
import { useGetAllTeams, type Team } from "@/services/teamService";
import type { DetailedPlayerStats } from "@/types/data-types";
import type { ParticipantFormValues } from "@/types/participant";
import { Skull, Target, User, Filter } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { SearchResult } from "@/hooks/useSearch";

export default function GerenciarJogadores() {
  const { isOpen, openModal, closeModal } = useModal();
  const [editingPlayer, setEditingPlayer] = useState<Participant | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

  // Fetch participants and teams via service hooks
  const {
    data: jogadoresData = [],
    isLoading: isLoadingParticipants,
    isError: isParticipantsError,
    error: participantsError,
  } = useGetAllParticipants();
  const {
    data: teams = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
    error: teamsError,
  } = useGetAllTeams();
  
  // Fetch player statistics from API
  const {
    data: playerStatsData = [],
    isLoading: isLoadingPlayerStats,
    isError: isPlayerStatsError,
  } = useAllPlayersSummary();
  
  const isLoadingGet = isLoadingParticipants || isLoadingTeams || isLoadingPlayerStats;

  // Map participants to DetailedPlayerStats with actual statistics when available
  const jogadores = useMemo((): DetailedPlayerStats[] => {
    // Ensure jogadoresData is an array before mapping
    if (!Array.isArray(jogadoresData)) {
      console.error('jogadoresData is not an array:', jogadoresData);
      return [];
    }
    
    return jogadoresData.map((p: Participant) => {
      // Find player stats if they exist
      const playerStats = playerStatsData.find(
        stats => stats.participant_id === p.participant_id
      );
      
      // Convert kda_ratio to number if it's a string
      const kdaRatio = typeof playerStats?.kda_ratio === 'string' 
        ? parseFloat(playerStats.kda_ratio) 
        : playerStats?.kda_ratio ?? 0;
        
      return {
        participant_id: p.participant_id,
        user_id: p.user_id,
        name: p.name,
        nickname: p.nickname,
        birth_date: p.birth_date,
        phone: String(p.phone),
        team_name: teams.find((t: Team) => t.team_id === p.team_id)?.name ?? "",
        is_coach: p.is_coach,
        team_id: p.team_id,
        // Use actual statistics when available, otherwise use defaults
        total_matches: playerStats?.total_matches ?? 0,
        total_kills: playerStats?.total_kills ?? 0,
        total_deaths: playerStats?.total_deaths ?? 0,
        total_assists: playerStats?.total_assists ?? 0,
        total_score: 0, // Not available in API
        total_mvps: playerStats?.mvp_count ?? 0,
        total_first_kills: 0, // Not available in API
        total_spike_plants: 0, // Not available in API
        total_spike_defuses: 0, // Not available in API
        avg_score: 0, // Not available in API
        kda_ratio: kdaRatio,
        win_rate: playerStats?.win_rate ?? 0,
        favorite_agent: "", // Not available in API
        favorite_map: "", // Not available in API
      };
    });
  }, [jogadoresData, teams, playerStatsData]);

  // Mutation hooks
  const createParticipant = useCreateParticipant();
  const updateParticipant = useUpdateParticipant();
  const deleteParticipant = useDeleteParticipant();
  const isMutating =
    createParticipant.status === "pending" ||
    updateParticipant.status === "pending" ||
    deleteParticipant.status === "pending";

  // open modal for NEW
  const openAdd = () => {
    setEditingPlayer(null);
    openModal();
  };

  // open modal for EDIT
  const handleEdit = useCallback((p: DetailedPlayerStats) => {
    // map DetailedPlayerStats to Participant shape
    setEditingPlayer({
      participant_id: p.participant_id,
      user_id: p.user_id,
      name: p.name,
      nickname: p.nickname,
      birth_date: p.birth_date,
      phone: Number(p.phone),
      team_id: p.team_id,
      is_coach: p.is_coach,
    });
    openModal();
  }, [openModal]);

  // Open delete confirmation modal
  const openDeleteModal = (id: number, name: string) => {
    setDeleteItemId(id);
    setDeleteItemName(name);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
    setDeleteItemName("");
  };

  // Handle delete confirmation
  const confirmDelete = useCallback(async () => {
    if (deleteItemId != null) {
      try {
        await deleteParticipant.mutateAsync(deleteItemId);
      } catch (err: unknown) {
        console.error('Erro ao excluir participante:', err);
      }
    }
    closeDeleteModal();
  }, [deleteItemId, deleteParticipant, closeDeleteModal]);

  /**
   * Handle create or update participant with correct API payload.
   */
  const handleSave = useCallback(
    async (form: ParticipantFormValues) => {
      // Build API payload: rename and convert types
      const payload = {
        name: form.nome,
        nickname: form.nickname,
        birth_date: form.birth_date,
        phone: Number(form.phone.replace(/\D/g, '')),
        team_id: form.team_id!,
        is_coach: form.is_coach,
      } as const;
      try {
        if (editingPlayer) {
          // Update existing participant
          await updateParticipant.mutateAsync({ id: editingPlayer.participant_id, data: payload });
        } else {
          // Create new participant
          await createParticipant.mutateAsync(payload);
        }
        closeModal();
      } catch (err: unknown) {
        console.error('Erro ao salvar participante:', err);
      }
    },
    [editingPlayer, createParticipant, updateParticipant, closeModal]
  );

  const handleDelete = useCallback((id: number) => {
    const player = jogadores.find((p) => p.participant_id === id);
    if (player) openDeleteModal(id, player.nickname);
  }, [jogadores, openDeleteModal]);

  /**
   * Search players based on query string and search types
   * @param query - Search query string
   * @param types - Array of search types to include
   * @param players - Array of player data
   * @returns Array of search results
   */
  const searchPlayers = (
    query: string,
    types: string[],
    players: DetailedPlayerStats[] = []
  ): SearchResult[] => {
    if (!query.trim() || !types.includes("player")) return [];
    
    const searchQuery = query.toLowerCase();
    
    return players
      .filter(player =>
        player.name.toLowerCase().includes(searchQuery) ||
        player.nickname.toLowerCase().includes(searchQuery) ||
        player.team_name.toLowerCase().includes(searchQuery) ||
        player.phone.toLowerCase().includes(searchQuery)
      )
      .map(player => ({
        id: player.participant_id,
        name: player.nickname,
        type: "player",
        subtitle: `${player.name} - ${player.team_name || 'Sem equipe'}`,
        metadata: {
          fullName: player.name,
          teamId: player.team_id,
          teamName: player.team_name,
          isCoach: player.is_coach,
          kda: player.kda_ratio.toFixed(2),
          matches: player.total_matches,
        },
      }));
  };

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="JOGADORES"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "GERENCIAR JOGADORES" },
      ]}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gerenciar Jogadores</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 flex items-center gap-2"
              onClick={() => {
                // This would be implemented with a dropdown or popover
                alert('Funcionalidade de filtro será implementada em breve.');
              }}
            >
              <Filter className="w-4 h-4" />
              Filtrar por Equipe
            </Button>
            <Button onClick={openAdd} className="bg-red-500 hover:bg-red-600 text-white">
              Adicionar Jogador
            </Button>
          </div>
        </div>

        {/* Search */}
        <UniversalSearchBar
          searchFunction={(query, types) => searchPlayers(query, types, jogadores)}
          config={{
            searchTypes: ["player"],
            placeholder: "Buscar jogadores por nome, nickname, equipe ou telefone...",
            maxResults: 6,
            minQueryLength: 1,
            debounceMs: 300,
          }}
          onResultClick={(result) => {
            const player = jogadores.find(p => p.participant_id === result.id);
            if (player) handleEdit(player);
          }}
          className="max-w-xl mx-auto mb-6"
        />

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isParticipantsError || isTeamsError || isPlayerStatsError ? (
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-300 col-span-2">
              <h3 className="font-bold mb-2">Erro ao carregar dados:</h3>
              <ul className="list-disc list-inside">
                {isParticipantsError && <li>{participantsError?.message || "Erro ao carregar informações de participantes"}</li>}
                {isTeamsError && <li>{teamsError?.message || "Erro ao carregar informações de equipes"}</li>}
                {isPlayerStatsError && <li>Erro ao carregar estatísticas de jogadores</li>}
              </ul>
              <p className="mt-2">Tente recarregar a página ou contate o administrador do sistema.</p>
            </div>
          ) : isLoadingGet ? (
            <div className="col-span-2 flex items-center justify-center p-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-red-500 border-r-transparent border-b-red-500 border-l-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-white">Carregando jogadores e estatísticas...</p>
              </div>
            </div>
          ) : jogadores.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center p-8">
              <div className="flex flex-col items-center">
                <User className="w-12 h-12 text-gray-500 mb-3" />
                <p className="text-white text-lg font-medium mb-1">Nenhum jogador encontrado</p>
                <p className="text-gray-400">Adicione jogadores usando o botão acima</p>
              </div>
            </div>
          ) : (
            // Render participant cards with unique keys
            jogadores.map((p: DetailedPlayerStats) => (
              <ParticipantCard key={`player-${p.participant_id}`}
                player={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Stats */}
        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total Jogadores</p>
                <p className="text-2xl font-bold text-white">
                  {jogadores.filter(p => !p.is_coach).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">KDA Médio</p>
                <p className="text-2xl font-bold text-white">
                  {(() => {
                    const activePlayers = jogadores.filter(p => !p.is_coach && p.total_matches > 0);
                    if (activePlayers.length === 0) return "0.00";
                    return (
                      activePlayers.reduce((sum, x) => sum + x.kda_ratio, 0) / 
                      activePlayers.length
                    ).toFixed(2);
                  })()}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Skull className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Kills Totais</p>
                <p className="text-2xl font-bold text-white">
                  {jogadores.reduce((sum, x) => sum + x.total_kills, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Detailed Stats Rankings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {!isLoadingGet && !isParticipantsError && jogadores.length > 0 && (
            <>
              {/* Top KDA */}
              <Card className="bg-slate-800 border-slate-700 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-lg font-bold text-white">Top KDA</h3>
                    <Target className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="space-y-3">
                    {jogadores
                      .filter(p => p.total_matches > 0)
                      .sort((a, b) => b.kda_ratio - a.kda_ratio)
                      .slice(0, 5)
                      .map((player, idx) => (
                        <div key={`top-kda-${player.participant_id}`} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 w-5 text-right">{idx + 1}</span>
                            <span className="text-white font-medium">{player.nickname}</span>
                          </div>
                          <span className="text-red-400 font-bold">{player.kda_ratio.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
              
              {/* Top Kills */}
              <Card className="bg-slate-800 border-slate-700 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-lg font-bold text-white">Top Kills</h3>
                    <Skull className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="space-y-3">
                    {jogadores
                      .filter(p => p.total_matches > 0)
                      .sort((a, b) => b.total_kills - a.total_kills)
                      .slice(0, 5)
                      .map((player, idx) => (
                        <div key={`top-kills-${player.participant_id}`} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 w-5 text-right">{idx + 1}</span>
                            <span className="text-white font-medium">{player.nickname}</span>
                          </div>
                          <span className="text-red-400 font-bold">{player.total_kills}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
              
              {/* Win Rate */}
              <Card className="bg-slate-800 border-slate-700 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-lg font-bold text-white">Top Win Rate</h3>
                    <User className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="space-y-3">
                    {jogadores
                      .filter(p => p.total_matches > 0)
                      .sort((a, b) => b.win_rate - a.win_rate)
                      .slice(0, 5)
                      .map((player, idx) => (
                        <div key={`top-winrate-${player.participant_id}`} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 w-5 text-right">{idx + 1}</span>
                            <span className="text-white font-medium">{player.nickname}</span>
                          </div>
                          <span className="text-red-400 font-bold">{(player.win_rate * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      <AddParticipantModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        // map API teams to form's Team interface
        teams={teams.map((t: Team) => ({ team_id: t.team_id, name: t.name }))}
        defaultValues={
          editingPlayer
            ? {
                nome: editingPlayer.name,
                nickname: editingPlayer.nickname,
                birth_date: editingPlayer.birth_date,
                // phone as string for input
                phone: editingPlayer.phone.toString(),
                team_id: editingPlayer.team_id,
                is_coach: editingPlayer.is_coach,
              }
            : undefined
        }
      />
      
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        entityName={`o jogador ${deleteItemName}`}
        isLoading={isMutating}
      />
    </DashboardLayout>
  );
}
