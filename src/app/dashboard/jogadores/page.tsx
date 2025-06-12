"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchPlayers } from "@/data/search-functions";
import { detailedPlayersStats } from "@/data/statistics-mock";
import { SearchResult } from "@/hooks/useSearch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/hooks/useModal";
import { AddParticipantModal } from "@/components/modals/AddParticipantModal";
import type { ParticipantFormValues, Team } from "@/types/participant";
import { teams } from "@/data/teams";
import { User, Edit, Trash2, Target, Skull } from "lucide-react";
import { DashboardLayout } from "../_components/DashboardLayout";

export default function GerenciarJogadores() {
  const [jogadores, setJogadores] = useState(detailedPlayersStats.slice(0, 4));
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (result: SearchResult) => {
    console.log("Jogador selecionado:", result);
    // navigate or filter as needed
  };

  const handleAdd = useCallback(async (data: ParticipantFormValues) => {
    setIsLoading(true);
    try {
      // map form values to your Player shape
      const novo = {
        participant_id: Date.now(),
        nickname: data.nickname,
        name: data.nome,
        team_name: teams.find((t) => t.team_id === data.team_id)?.name || "",
        phone: data.phone,
        total_kills: 0,
        total_deaths: 0,
        total_assists: 0,
        kda_ratio: 0,
        win_rate: 0,
        ...data,
      };
      setJogadores((prev) => [novo, ...prev]);
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [closeModal]);

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
            <Button onClick={openModal} className="bg-red-500 hover:bg-red-600 text-white">
              Adicionar Jogador
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <UniversalSearchBar
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
        />

        {/* Grid de jogadores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jogadores.map((p) => (
            <Card key={p.participant_id} className="dashboard-card border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <User className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.nickname}</h3>
                    <p className="dashboard-text-muted text-sm">{p.name}</p>
                    <p className="dashboard-text-muted text-xs">{p.team_name}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="dashboard-text-muted text-sm">Contato</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {p.phone}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="dashboard-text-muted text-sm">K/D/A</span>
                  <span className="text-white font-medium">
                    {p.total_kills}/{p.total_deaths}/{p.total_assists}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="dashboard-text-muted text-sm">KDA Ratio</span>
                  <span className="text-green-400 font-medium">{p.kda_ratio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dashboard-text-muted text-sm">Win Rate</span>
                  <span className="text-blue-400 font-medium">{Math.round(p.win_rate * 100)}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats dos jogadores */}
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

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleAdd}
        teams={teams as Team[]}
      />
    </DashboardLayout>
  );
}
