'use client';
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Clock, MapPin, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchMatches } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { recentMatches } from "@/data/statistics-mock"; // Import recentMatches

const GerenciarPartidas = () => {
  const router = useRouter();
  // Use recentMatches from statistics-mock.ts
  const [partidas] = useState(recentMatches);

  const getStatusBadge = (status: string | undefined) => { // Status can be undefined
    // Simplified status logic, assuming status comes from recentMatches or similar structure
    // This might need adjustment based on actual values in recentMatches
    if (!status) return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Desconhecido</Badge>; 

    switch (status.toLowerCase()) {
      case "pré-agendada": // Assuming these statuses exist or mapping them
      case "upcoming":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            Pré-agendada
          </Badge>
        );
      case "agendada":
      case "ongoing":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Agendada
          </Badge>
        );
      case "finalizada":
      case "completed":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
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
      // Ensure result.id is used, which should correspond to match_id from searchMatches
      router.push(`/dashboard/partidas/${result.id}`);
    }
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
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Agendar Partida
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchMatches}
            config={{
              searchTypes: ["match"],
              placeholder: "Buscar partidas por time, torneio ou mapa...",
              maxResults: 6,
              minQueryLength: 1, // Set to 0 to show results on click if desired, or keep at 1
              debounceMs: 300,
            }}
            onResultClick={handleSearchResultClick}
            className="max-w-xl"
          />
        </div>

        {/* Lista de partidas */}
        <div className="space-y-4">
          {partidas.map((partida) => (
            <Card
              key={partida.match_id} // Use match_id from recentMatches
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
                        {partida.team_a} {/* Use team_a from recentMatches */}
                      </h3>
                      {partida.winner === partida.team_a && (
                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-500">VS</span>
                      {partida.score_a !== undefined && partida.score_b !== undefined && (
                        <p className="text-xl font-bold text-white mt-1">
                          {`${partida.score_a} - ${partida.score_b}`} {/* Use score_a, score_b */}
                        </p>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">
                        {partida.team_b} {/* Use team_b from recentMatches */}
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
                        {partida.map} {/* Use map from recentMatches */}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Data</p>
                    {/* Assuming recentMatches has a date field, adjust renderData if needed */}
                    {renderData(partida.date)} 
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Fase</p>
                    {/* Assuming tournament can act as fase or a new field is needed */}
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {partida.tournament} {/* Use tournament or a specific fase field */}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Status</p>
                    {/* Status might need to be derived or added to recentMatches items */}
                    {/* For now, passing a hardcoded or example status */}
                    {getStatusBadge(partida.winner ? "Finalizada" : "Agendada")} 
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => router.push(`/dashboard/partidas/editar/${partida.match_id}`)} // Example edit route
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <p className="dashboard-text-muted text-sm">
                    {partida.tournament} {/* Use tournament from recentMatches */}
                  </p>
                  {/* Logic for "Definir Data" button might need adjustment based on data */}
                  {(!partida.date || (partida.winner ? false : true)) && (
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Definir Data
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats das partidas - These should also be derived from recentMatches or other mock data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Pré-agendadas</p>
                {/* Calculate based on data */}
                <p className="text-2xl font-bold text-white">{partidas.filter(p => !p.date && !p.winner).length}</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Agendadas</p>
                {/* Calculate based on data */}
                <p className="text-2xl font-bold text-white">{partidas.filter(p => p.date && !p.winner).length}</p>
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
                {/* Calculate based on data */}
                <p className="text-2xl font-bold text-white">{partidas.filter(p => p.winner).length}</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Esta Semana</p>
                {/* This requires date logic based on current week and partida.date */}
                <p className="text-2xl font-bold text-white">N/A</p> 
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GerenciarPartidas;