"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchTeams } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { detailedTeamsStats, detailedPlayersStats } from "@/data/statistics-mock"; // Import detailedPlayersStats

const GerenciarEquipes = () => {
  // Use detailedTeamsStats from statistics-mock.ts
  const [equipes] = useState(
    detailedTeamsStats.map((team) => {
      const teamPlayers = detailedPlayersStats
        .filter((player) => player.team_name === team.name && !player.is_coach) // Filter out coaches from members list
        .map((player) => ({
          nickname: player.nickname,
          nome: player.name,
          // You can add other player properties here if needed by the view
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

  const totalPlayers = detailedPlayersStats.filter(player => !player.is_coach).length;
  const totalCoaches = detailedPlayersStats.filter(player => player.is_coach).length;

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
        { label: "DASHBOARD", href: "/dashboard" }, // Corrected href
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
            <Card key={equipe.id} className="dashboard-card border-gray-700 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {equipe.nome}
                    </h3>
                    <p className="dashboard-text-muted">
                      Coach: {equipe.coach}
                    </p>
                    <p className="dashboard-text-muted text-sm">
                      {equipe.campeonato}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                      onClick={() =>
                        router.push(`/dashboard/equipes/editar/${equipe.id}`) // Example edit route
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      // Add delete functionality here if needed
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Membros da equipe - Placeholder, as actual member data is not in detailedTeamsStats */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Membros da Equipe ({equipe.membros.length})
                </h4>
                {equipe.membros.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {equipe.membros.map((membro, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-lg p-4 text-center"
                      >
                        <div className="p-2 bg-gray-700 rounded-lg mb-3 mx-auto w-fit">
                          <User className="w-6 h-6 text-gray-300" />
                        </div>
                        <h5 className="text-white font-medium text-sm">
                          {/* @ts-ignore */}
                          {membro.nickname}
                        </h5>
                        <p className="dashboard-text-muted text-xs">
                          {/* @ts-ignore */}
                          {membro.nome}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Informações de membros não disponíveis.
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Stats das equipes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total de Equipes</p>
                <p className="text-2xl font-bold text-white">
                  {detailedTeamsStats.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total de Jogadores</p>
                {/* This needs to be calculated from detailedPlayersStats or similar */}
                <p className="text-2xl font-bold text-white">{totalPlayers}</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">
                  Coaches (Treinadores)
                </p>
                {/* This needs to be calculated based on is_coach in detailedPlayersStats or similar */}
                <p className="text-2xl font-bold text-white">{totalCoaches}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GerenciarEquipes;
