"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { AddParticipantModal } from "@/components/modals/AddParticipantModal";
import PlayerCard from "./_components/PlayerCard";
import PlayerStats from "./_components/PlayerStats";
import { teams } from "@/data/teams";
import type { ParticipantFormValues, Player, PlayerStats as PlayerStatsType } from "@/types/participant";

export default function GerenciarJogadores() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [jogadores, setJogadores] = useState<Player[]>([
    {
      id: 1,
      nome: "João Silva",
      nickname: "King1",
      equipe: "Valorant Kings",
      phone: "+55 00 0 0000-0000",
      kills: 245,
      deaths: 180,
      assists: 120,
      kda: "1.36",
      winRate: "75%",
    },
    {
      id: 2,
      nome: "Maria Santos",
      nickname: "Phoenix1",
      equipe: "Phoenix Squad",
      phone: "+55 00 0 0000-0000",
      kills: 198,
      deaths: 165,
      assists: 95,
      kda: "1.20",
      winRate: "68%",
    },
    {
      id: 3,
      nome: "Pedro Costa",
      nickname: "Sage_Master",
      equipe: "Valorant Kings",
      phone: "+55 00 0 0000-0000",
      kills: 156,
      deaths: 140,
      assists: 200,
      kda: "1.11",
      winRate: "72%",
      isCoach: true,
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      nickname: "Viper_Queen",
      equipe: "Phoenix Squad",
      phone: "+55 00 0 0000-0000",
      kills: 189,
      deaths: 155,
      assists: 145,
      kda: "1.22",
      winRate: "70%",
    },
  ]);

  // Memoized stats calculation
  const stats = useMemo<PlayerStatsType>(() => {
    const totalPlayers = jogadores.length;
    const avgKDA = totalPlayers > 0 
      ? (jogadores.reduce((sum, j) => sum + parseFloat(j.kda), 0) / totalPlayers).toFixed(2)
      : "0.00";
    const totalKills = jogadores.reduce((sum, j) => sum + j.kills, 0);

    return { totalPlayers, avgKDA, totalKills };
  }, [jogadores]);

  // Memoized handlers
  const handleAddParticipant = useCallback(async (data: ParticipantFormValues) => {
    const novoJogador: Player = {
      id: Date.now(),
      nome: data.nome,
      nickname: data.nickname,
      equipe: teams.find((t) => t.team_id === data.team_id)?.name || "",
      phone: data.phone,
      kills: 0,
      deaths: 0,
      assists: 0,
      kda: "0.00",
      winRate: "0%",
      isCoach: data.is_coach,
    };

    setJogadores(prev => [...prev, novoJogador]);
  }, []);

  const handleEditPlayer = useCallback((player: Player) => {
    // TODO: Implement edit functionality
    console.log('Edit player:', player);
  }, []);

  const handleDeletePlayer = useCallback((playerId: number) => {
    setJogadores(prev => prev.filter(p => p.id !== playerId));
  }, []);

  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddModalOpen(false), []);

  if (isLoading) {
    return (
      <DashboardLayout title="GERENCIAR" subtitle="JOGADORES">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="JOGADORES"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/" },
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
            <Button
              onClick={openAddModal}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Jogador
            </Button>
          </div>
        </div>

        {/* Grid de jogadores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jogadores.map((jogador) => (
            <PlayerCard
              key={jogador.id}
              player={jogador}
              onEdit={handleEditPlayer}
              onDelete={handleDeletePlayer}
            />
          ))}
        </div>

        {/* Stats dos jogadores */}
        <PlayerStats stats={stats} />

        {/* Add Participant Modal */}
        <AddParticipantModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleAddParticipant}
          teams={teams}
        />
      </div>
    </DashboardLayout>
  );
}
