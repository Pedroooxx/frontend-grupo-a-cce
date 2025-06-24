"use client";
import { ParticipantCard } from "@/components/cards/ParticipantCard";
import { AddParticipantModal } from "@/components/modals/AddParticipantModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModal } from "@/hooks/useModal";
import { useCreateParticipant, useDeleteParticipant, useGetAllParticipants, useUpdateParticipant, type Participant } from "@/services/participantService";
import { useGetAllTeams, type Team } from "@/services/teamService";
import type { DetailedPlayerStats } from "@/types/data-types";
import type { ParticipantFormValues } from "@/types/participant";
import { Skull, Target, User } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";

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
  const isLoadingGet = isLoadingParticipants || isLoadingTeams;

  // Map participants to DetailedPlayerStats
  const jogadores = useMemo((): DetailedPlayerStats[] => {
    // Ensure jogadoresData is an array before mapping
    if (!Array.isArray(jogadoresData)) {
      console.error('jogadoresData is not an array:', jogadoresData);
      return [];
    }
    
    return jogadoresData.map((p: Participant) => ({
      participant_id: p.id,
      user_id: p.user_id,
      name: p.name,
      nickname: p.nickname,
      birth_date: p.birth_date,
      phone: p.phone.toString(),
      team_id: p.team_id,
      team_name: teams.find((t: Team) => t.id === p.team_id)?.name ?? "",
      is_coach: p.is_coach,
      total_kills: 0,
      total_deaths: 0,
      total_assists: 0,
      kda_ratio: 0,
      win_rate: 0,
      total_matches: 0,
      total_spike_plants: 0,
      total_spike_defuses: 0,
      total_mvps: 0,
      total_first_kills: 0,
      avg_score: 0,
      favorite_agent: "",
      favorite_map: "",
    }));
  }, [jogadoresData, teams]);

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
      id: p.participant_id,
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
          await updateParticipant.mutateAsync({ id: editingPlayer.id, data: payload });
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
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Filtrar por Equipe
            </Button>
            <Button onClick={openAdd} className="bg-red-500 hover:bg-red-600 text-white">
              Adicionar Jogador
            </Button>
          </div>
        </div>

        {/* Search */}
        {/* <UniversalSearchBar
          searchFunction={searchPlayers}
          config={{
            searchTypes: ["player"],
            placeholder: "Buscar jogadores por nome, nickname, equipe ou telefone...",
            maxResults: 6,
            minQueryLength: 1,
            debounceMs: 300,
          }}
          onResultClick={handleSearch}
          className="max-w-xl mx-auto mb-6"
        /> */}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isParticipantsError || isTeamsError ? (
            <p className="text-red-500">
              Erro ao carregar dados: {participantsError?.message || teamsError?.message}
            </p>
          ) : isLoadingGet ? (
            <p className="text-white">Carregando jogadores...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total Jogadores</p>
                <p className="text-2xl font-bold text-white">{jogadores.length}</p>
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
                  {(
                    jogadores.reduce((sum, x) => sum + x.kda_ratio, 0) /
                    jogadores.length
                  ).toFixed(2)}
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
      </div>

      <AddParticipantModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        // map API teams to form's Team interface
        teams={teams.map((t: Team) => ({ team_id: t.id, name: t.name }))}
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
