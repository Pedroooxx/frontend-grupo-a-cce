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
import { User, Edit, Trash2, Skull, Target } from "lucide-react";
import { DashboardLayout } from "../_components/DashboardLayout";
import type { DetailedPlayerStats } from "@/types/statistics";

export default function GerenciarJogadores() {
  const [jogadores, setJogadores] = useState<DetailedPlayerStats[]>(detailedPlayersStats.slice(0, 4));
  const { isOpen, openModal, closeModal } = useModal();
  const [editingPlayer, setEditingPlayer] = useState<DetailedPlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (result: SearchResult) => {
    console.log("Jogador selecionado:", result);
  };

  // open modal for NEW
  const openAdd = () => {
    setEditingPlayer(null);
    openModal();
  };

  // open modal for EDIT
  const handleEdit = (p: DetailedPlayerStats) => {
    setEditingPlayer(p);
    openModal();
  };

  // unified save: add or edit
  const handleSave = useCallback(
    async (data: ParticipantFormValues) => {
      setIsLoading(true);
      try {
        // map form to DetailedPlayerStats
        const mapped: DetailedPlayerStats = {
          participant_id: editingPlayer?.participant_id || Date.now(),
          user_id: editingPlayer?.user_id || Date.now(),
          name: data.nome,
          nickname: data.nickname,
          birth_date: data.birth_date,
          phone: data.phone,
          team_id: data.team_id,
          team_name: teams.find((t) => t.team_id === data.team_id)?.name || "",
          is_coach: data.is_coach ?? false,
          total_kills: editingPlayer?.total_kills || 0,
          total_deaths: editingPlayer?.total_deaths || 0,
          total_assists: editingPlayer?.total_assists || 0,
          kda_ratio: editingPlayer?.kda_ratio || 0,
          win_rate: editingPlayer?.win_rate || 0,
          total_matches: editingPlayer?.total_matches || 0,
          total_spike_plants: editingPlayer?.total_spike_plants || 0,
          total_spike_defuses: editingPlayer?.total_spike_defuses || 0,
          total_mvps: editingPlayer?.total_mvps || 0,
          total_first_kills: editingPlayer?.total_first_kills || 0,
          avg_score: editingPlayer?.avg_score || 0,
          favorite_agent: editingPlayer?.favorite_agent || "",
          favorite_map: editingPlayer?.favorite_map || "",
        };

        setJogadores((prev) => {
          if (editingPlayer) {
            // update existing
            return prev.map((x) =>
              x.participant_id === mapped.participant_id ? mapped : x
            );
          }
          // add new
          return [mapped, ...prev];
        });

        closeModal();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [editingPlayer, closeModal]
  );

  const handleDelete = useCallback((id: number) => {
    setJogadores((prev) => prev.filter((x) => x.participant_id !== id));
  }, []);

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

        {/* Grid */}
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
                  <Button size="sm" variant="outline" onClick={() => handleEdit(p)} className="border-gray-600 text-gray-300">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(p.participant_id)} className="border-red-500 text-red-500">
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
        teams={teams as Team[]}
        defaultValues={
          editingPlayer
            ? {
                nome: editingPlayer.name,
                nickname: editingPlayer.nickname,
                birth_date: editingPlayer.birth_date,
                phone: editingPlayer.phone,
                team_id: editingPlayer.team_id,
                is_coach: editingPlayer.is_coach,
              }
            : undefined
        }
      />
    </DashboardLayout>
  );
}
