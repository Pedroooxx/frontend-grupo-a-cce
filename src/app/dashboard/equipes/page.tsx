"use client";
import TeamCard from "@/components/cards/TeamCard";
import TeamFooterCard from "@/components/cards/TeamFooterCard";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { AddTeamModal } from "@/components/modals/AddTeamModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { searchTeams } from "@/data/search-functions";
import { useModal } from "@/hooks/useModal";
import { SearchResult } from "@/hooks/useSearch";
import { TeamDisplay, TeamFormValues } from "@/types/teams";
import { PublicParticipant } from "@/types/data-types";
import { useGetAllTeams, useCreateTeam, useUpdateTeam, useDeleteTeam, Team, TeamParticipant } from "@/services/teamService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DashboardLayout } from "../_components/DashboardLayout";

const GerenciarEquipes = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [editingTeam, setEditingTeam] = useState<TeamDisplay | null>(null);

  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

  // Fetch teams via service hooks (includes nested participants)
  const {
    data: teamsData = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
    error: teamsError,
  } = useGetAllTeams();

  const isLoadingGet = isLoadingTeams;

  // Mutation hooks
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();
  const isMutating =
    createTeam.status === "pending" ||
    updateTeam.status === "pending" ||
    deleteTeam.status === "pending";

  // Error handling effects
  useEffect(() => {
    if (isTeamsError && teamsError) {
      toast.error(`Erro ao carregar equipes: ${teamsError.message}`);
    }
  }, [isTeamsError, teamsError]);

  // Convert API data to TeamDisplay format
  const teams = useMemo((): TeamDisplay[] => {
    // Ensure teamsData is an array before mapping
    if (!Array.isArray(teamsData)) {
      console.error('teamsData is not an array:', teamsData);
      return [];
    }
    
    return teamsData.map((team: Team) => {
      const coach = team.Participants.find((p: TeamParticipant) => p.is_coach);
      const members = team.Participants
        .filter((p: TeamParticipant) => !p.is_coach)
        .map((p: TeamParticipant) => ({
          nickname: p.nickname,
          name: p.name,
        }));

      return {
        id: team.team_id,
        name: team.name,
        coach: coach?.name || "Sem técnico",
        members,
        championship: "Campeonato Ativo", // This would come from championship data
      };
    });
  }, [teamsData]);

  // Extract all participants from teams and filter available coaches and players
  const allParticipants = useMemo(() => {
    return teamsData.flatMap((team: Team) => 
      team.Participants.map((participant: TeamParticipant) => ({
        ...participant,
        team_id: team.team_id,
        team_name: team.name,
      }))
    );
  }, [teamsData]);

  const availableCoaches = useMemo(() => {
    return allParticipants.filter((participant) => participant.is_coach);
  }, [allParticipants]);
  
  const availablePlayers = useMemo(() => {
    return allParticipants.filter((player) => !player.is_coach);
  }, [allParticipants]);

  const totalPlayers = availablePlayers.length;
  const totalCoaches = availableCoaches.length;

  // Open modal for creating a new team
  const handleAddTeam = () => {
    setEditingTeam(null);
    openModal();
  };

  // Open modal for editing a team
  const handleEditTeam = (team: TeamDisplay) => {
    setEditingTeam(team);
    openModal();
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string | number, name: string) => {
    setDeleteItemId(id);
    setDeleteItemName(name);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
    setDeleteItemName("");
  }, []);

  // Modified to open confirmation dialog instead of deleting directly
  const handleDeleteTeam = (id: string | number) => {
    const team = teams.find(team => team.id === id);
    if (team) {
      openDeleteModal(id, team.name);
    }
  };

  // Actual delete function after confirmation
  const confirmDeleteTeam = useCallback(async () => {
    if (deleteItemId !== null) {
      try {
        await deleteTeam.mutateAsync(deleteItemId);
        toast.success(`Equipe "${deleteItemName}" excluída com sucesso!`);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting team:', error);
        toast.error('Erro ao excluir equipe');
      }
    }
  }, [deleteItemId, deleteItemName, deleteTeam, closeDeleteModal]);

  // Handle saving a team (adding or updating)
  const handleSaveTeam = async (data: TeamFormValues) => {
    try {
      const teamData = {
        name: data.name,
        manager_name: data.manager_name,
      };

      if (editingTeam) {
        // Update existing team
        await updateTeam.mutateAsync({
          id: editingTeam.id,
          data: teamData
        });
        toast.success(`Equipe "${data.name}" atualizada com sucesso!`);
      } else {
        // Create new team
        await createTeam.mutateAsync(teamData);
        toast.success(`Equipe "${data.name}" criada com sucesso!`);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving team:', error);
      const errorMessage = editingTeam ? 'Erro ao atualizar equipe' : 'Erro ao criar equipe';
      toast.error(errorMessage);
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "team") {
      router.push(`/dashboard/equipes/${result.id}`);
    }
  };

  // Convert TeamParticipant to PublicParticipant format for TeamForm compatibility
  const mapParticipantToPublic = useCallback((participant: TeamParticipant & { team_id: number; team_name: string }): PublicParticipant => {
    return {
      participant_id: participant.participant_id,
      name: participant.name,
      nickname: participant.nickname,
      birth_date: "", // Not available in TeamParticipant
      team_id: participant.team_id,
      team_name: participant.team_name,
      is_coach: participant.is_coach,
      kda_ratio: 0, // Default values for statistics
      total_kills: 0,
      total_deaths: 0,
      total_assists: 0,
      win_rate: 0,
      mvp_count: 0,
      phone: "", // Not available in TeamParticipant
    };
  }, []);

  // Convert arrays for TeamForm compatibility
  const publicAvailableCoaches = useMemo(() => {
    return availableCoaches.map(mapParticipantToPublic);
  }, [availableCoaches, mapParticipantToPublic]);

  const publicAvailablePlayers = useMemo(() => {
    return availablePlayers.map(mapParticipantToPublic);
  }, [availablePlayers, mapParticipantToPublic]);

  // Get selected players for the editing team
  const getSelectedPlayers = useCallback(() => {
    if (!editingTeam) return [];

    // Find actual participants matching the member names in the team
    const selectedParticipants = allParticipants.filter((player) =>
      editingTeam.members.some((member) => member.nickname === player.nickname)
    );
    
    return selectedParticipants.map(mapParticipantToPublic);
  }, [editingTeam, allParticipants, mapParticipantToPublic]);

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="EQUIPES"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "GERENCIAR EQUIPES" },
      ]}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gerenciar Equipes</h1>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleAddTeam}
            disabled={isLoadingGet || isMutating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Equipe
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchTeams}
            config={{
              searchTypes: ["team"],
              placeholder: "Buscar equipes por nome ou gerente...",
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
            <div className="text-white">Carregando equipes...</div>
          </div>
        )}

        {/* Error State */}
        {isTeamsError && (
          <div className="flex justify-center py-8">
            <div className="text-red-400">
              Erro ao carregar dados: {teamsError?.message}
            </div>
          </div>
        )}

        {/* Lista de equipes */}
        {!isLoadingGet && !isTeamsError && (
          <div className="space-y-6">
            {teams.length > 0 ? (
              teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={handleEditTeam}
                  onDelete={handleDeleteTeam}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                Nenhuma equipe encontrada. Crie uma nova equipe para começar.
              </div>
            )}
          </div>
        )}

        {/* Stats das equipes */}
        {!isLoadingGet && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <TeamFooterCard
              totalTeams={teams.length}
              totalPlayers={totalPlayers}
              totalCoaches={totalCoaches}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Team Modal */}
      <AddTeamModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveTeam}
        availablePlayers={publicAvailablePlayers}
        availableCoaches={publicAvailableCoaches}
        selectedPlayers={getSelectedPlayers()}
        defaultValues={
          editingTeam
            ? {
                name: editingTeam.name,
                manager_name: editingTeam.coach !== "Sem técnico" ? editingTeam.coach : undefined,
                member_ids: getSelectedPlayers().map(
                  (p: PublicParticipant) => p.participant_id
                ),
              }
            : undefined
        }
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteTeam}
        title="Confirmar exclusão"
        entityName={`a equipe ${deleteItemName}`}
        isLoading={isMutating}
      />
    </DashboardLayout>
  );
};

export default GerenciarEquipes;
