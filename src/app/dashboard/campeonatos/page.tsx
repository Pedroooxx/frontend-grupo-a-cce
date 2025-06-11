"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Eye, Edit, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchChampionships } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { detailedChampionshipsStats } from "@/data/statistics-mock"; // Import detailedChampionshipsStats

const Campeonatos = () => {
  const router = useRouter();
  const [campeonatos] = useState(
    detailedChampionshipsStats.map((champ) => ({
      id: champ.championship_id,
      nome: champ.name,
      status: champ.status, // Ensure this status matches expected values for getStatusBadge
      formato: champ.format,
      equipesInscritas: champ.total_teams,
      localizacao: champ.location,
      dataInicio: champ.start_date,
      dataFim: champ.end_date,
    }))
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      // Normalize status to lowercase for comparison
      case "em andamento":
      case "ongoing": // Add mapping for "ongoing"
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Em andamento
          </Badge>
        );
      case "finalizado":
      case "completed": // Add mapping for "completed"
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            Finalizado
          </Badge>
        );
      case "próximo":
      case "upcoming": // Add mapping for "upcoming"
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Próximo
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

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "championship") {
      router.push(`/dashboard/campeonatos/${result.id}`);
    }
  };

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="CAMPEONATOS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" }, // Corrected href
        { label: "CAMPEONATOS" },
      ]}
    >
      <div className="p-8 space-y-6">
        {/* Header com botão de criar */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Campeonatos</h1>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Campeonato
          </Button>
        </div>

        {/* Barra de busca */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchChampionships}
            config={{
              searchTypes: ["championship"],
              placeholder:
                "Buscar campeonatos por nome, local ou organizador...",
              maxResults: 6,
              minQueryLength: 1,
              debounceMs: 300,
            }}
            onResultClick={handleSearchResultClick}
            className="max-w-xl"
          />
        </div>

        {/* Grid de campeonatos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campeonatos.map((campeonato) => (
            <Card
              key={campeonato.id}
              className="dashboard-card border-gray-700 p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {campeonato.nome}
                    </h3>
                    <p className="dashboard-text-muted text-sm">
                      {campeonato.formato}
                    </p>
                  </div>
                </div>
                {getStatusBadge(campeonato.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Equipes</span>
                  <span className="text-white font-medium">
                    {campeonato.equipesInscritas}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Local</span>
                  <span className="text-green-400 font-medium">
                    {campeonato.localizacao}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Período</span>
                  <span className="text-white text-sm">
                    {campeonato.dataInicio} - {campeonato.dataFim}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">
                  Campeonatos Ativos
                </p>
                <p className="text-2xl font-bold text-white">
                  {campeonatos.filter(
                    (c) =>
                      c.status.toLowerCase() === "ongoing" ||
                      c.status.toLowerCase() === "em andamento"
                  ).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Equipes Totais</p>
                <p className="text-2xl font-bold text-white">
                  {campeonatos.reduce(
                    (sum, c) => sum + c.equipesInscritas,
                    0
                  )}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Último Evento</p>
                {/* This logic might need refinement based on how "last event" is defined (e.g., by end_date) */}
                <p className="text-2xl font-bold text-white">
                  {campeonatos.length > 0
                    ? campeonatos
                        .sort(
                          (a, b) =>
                            new Date(b.dataFim).getTime() -
                            new Date(a.dataFim).getTime()
                        )[0]?.nome
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campeonatos;
