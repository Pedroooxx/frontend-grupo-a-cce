"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchTeams } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { publicTeams, publicParticipants } from "@/data/data-mock";
import TeamCard from "@/components/cards/TeamCard";
import TeamFooterCard from "@/components/cards/TeamFooterCard";

const GerenciarEquipes = () => {
  // Map directly from publicTeams and publicParticipants
  const [equipes] = useState(
    publicTeams.map((team) => {
      const teamPlayers = publicParticipants
        .filter((player) => player.team_name === team.name && !player.is_coach) // Filter out coaches from members list
        .map((player) => ({
          nickname: player.nickname,
          nome: player.name,
        }));
      return {
        id: team.team_id,
        nome: team.name,
        coach: team.manager_name, // Assuming manager_name is the coach for now
        membros: teamPlayers, // Populate members here
        campeonato:
          team.championships_participated > 0
            ? `Participando de ${team.championships_participated} campeonatos`
            : "Nenhum campeonato ativo",
      };
    })
  );
  const router = useRouter();

  const totalPlayers = publicParticipants.filter(
    (player) => !player.is_coach
  ).length;
  const totalCoaches = publicParticipants.filter(
    (player) => player.is_coach
  ).length;

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "team") {
      router.push(`/dashboard/equipes/${result.id}`);
    }
  };

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
          <Button className="bg-red-500 hover:bg-red-600 text-white">
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
          {equipes.map((equipe) => (
            <TeamCard key={equipe.id} equipe={equipe} />
          ))}
        </div>

        {/* Stats das equipes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <TeamFooterCard
            totalTeams={publicTeams.length}
            totalPlayers={totalPlayers}
            totalCoaches={totalCoaches}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GerenciarEquipes;
