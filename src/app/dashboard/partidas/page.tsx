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

const GerenciarPartidas = () => {
  const router = useRouter();
  const [partidas] = useState([
    {
      id: 1,
      equipeA: "Valorant Kings",
      equipeB: "Phoenix Squad",
      campeonato: "Liga de Verão 2024",
      mapa: "Haven",
      data: null,
      status: "Pré-agendada",
      resultado: null,
      fase: "Quartas de Final",
    },
    {
      id: 2,
      equipeA: "Sage Warriors",
      equipeB: "Viper Elite",
      campeonato: "Liga de Verão 2024",
      mapa: "Bind",
      data: "15/12/2024",
      status: "Agendada",
      resultado: null,
      fase: "Oitavas de Final",
    },
    {
      id: 3,
      equipeA: "Jett Squad",
      equipeB: "Reyna Team",
      campeonato: "Torneio Nacional",
      mapa: "Ascent",
      data: "14/12/2024",
      status: "Finalizada",
      resultado: "13-8",
      vencedor: "Jett Squad",
      fase: "Semifinal",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pré-agendada":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            Pré-agendada
          </Badge>
        );
      case "Agendada":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Agendada
          </Badge>
        );
      case "Finalizada":
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

  const renderData = (data: string | null) => {
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
              minQueryLength: 1,
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
              key={partida.id}
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
                        {partida.equipeA}
                      </h3>
                      {partida.vencedor === partida.equipeA && (
                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-500">VS</span>
                      {partida.resultado && (
                        <p className="text-xl font-bold text-white mt-1">
                          {partida.resultado}
                        </p>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">
                        {partida.equipeB}
                      </h3>
                      {partida.vencedor === partida.equipeB && (
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
                        {partida.mapa}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Data</p>
                    {renderData(partida.data)}
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Fase</p>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {partida.fase}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Status</p>
                    {getStatusBadge(partida.status)}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <p className="dashboard-text-muted text-sm">
                    {partida.campeonato}
                  </p>
                  {partida.status === "Pré-agendada" && (
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

        {/* Stats das partidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Pré-agendadas</p>
                <p className="text-2xl font-bold text-white">1</p>
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
                <p className="text-2xl font-bold text-white">1</p>
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
                <p className="text-2xl font-bold text-white">1</p>
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
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GerenciarPartidas;