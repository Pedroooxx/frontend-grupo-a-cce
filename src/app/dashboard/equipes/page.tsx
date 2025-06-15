"use client";
import React, { useState, useCallback } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchTeams } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { publicTeams, publicParticipants } from "@/data/data-mock";
import TeamCard from "@/components/cards/TeamCard";
import TeamFooterCard from "@/components/cards/TeamFooterCard";
import { useModal } from "@/hooks/useModal";
import { AddTeamModal } from "@/components/modals/AddTeamModal";
import { TeamDisplay, TeamFormValues, mapTeamToDisplay } from "@/types/teams";
import { PublicTeam, PublicParticipant } from "@/types/data-types";

const GerenciarEquipes = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamDisplay | null>(null);

  // Convert PublicTeam to TeamDisplay for our component
  const [teams, setTeams] = useState<TeamDisplay[]>(
    publicTeams.map((team) => mapTeamToDisplay(team, publicParticipants))
  );

  const totalPlayers = publicParticipants.filter(
    (player) => !player.is_coach
  ).length;
  const totalCoaches = publicParticipants.filter(
    (player) => player.is_coach
  ).length;

  // Find players for a specific team
  const getTeamPlayers = useCallback(
    (teamId: number | string) => {
      return publicParticipants.filter((player) => {
        const id = typeof teamId === "string" ? parseInt(teamId) : teamId;
        return player.team_id === id && !player.is_coach;
      });
    },
    []
  );

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

  // Handle deleting a team
  const handleDeleteTeam = (id: string | number) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  // Handle saving a team (adding or updating)
  const handleSaveTeam = async (data: TeamFormValues) => {
    setIsLoading(true);
    try {
      const teamId = editingTeam?.id || Date.now();

      // Get the selected players
      const selectedPlayerIds = data.member_ids;
      const teamPlayers = publicParticipants
        .filter((player) => selectedPlayerIds.includes(player.participant_id))
        .map((player) => ({
          nickname: player.nickname,
          name: player.name,
        }));

      const updatedTeam: TeamDisplay = {
        id: teamId,
        name: data.name,
        coach: data.manager_name,
        members: teamPlayers,
        championship: editingTeam?.championship || "Nenhum campeonato ativo",
      };

      if (editingTeam) {
        // Update existing team
        setTeams(
          teams.map((team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          )
        );
      } else {
        // Add new team
        setTeams([updatedTeam, ...teams]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "team") {
      router.push(`/dashboard/equipes/${result.id}`);
    }
  };

  // Get selected players for the editing team
  const getSelectedPlayers = useCallback(() => {
    if (!editingTeam) return [];

    // Find actual PublicParticipant objects matching the member names in the team
    return publicParticipants.filter((player) =>
      editingTeam.members.some((member) => member.nickname === player.nickname)
    );
  }, [editingTeam]);

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

        {/* Lista de equipes */}
        <div className="space-y-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
            />
          ))}
        </div>

        {/* Stats das equipes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <TeamFooterCard
            totalTeams={teams.length}
            totalPlayers={totalPlayers}
            totalCoaches={totalCoaches}
          />
        </div>
      </div>

      {/* Add/Edit Team Modal */}
      <AddTeamModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveTeam}
        availablePlayers={publicParticipants.filter(
          (player) => !player.is_coach
        )}
        selectedPlayers={getSelectedPlayers()}
        defaultValues={
          editingTeam
            ? {
                name: editingTeam.name,
                manager_name: editingTeam.coach,
                member_ids: getSelectedPlayers().map(
                  (p) => p.participant_id
                ),
              }
            : undefined
        }
      />
    </DashboardLayout>
  );
};

export default GerenciarEquipes;
