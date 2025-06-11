"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Edit, Trash2, Target, Skull } from "lucide-react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { AddParticipantModal } from "@/components/modals/AddParticipantModal";

const GerenciarJogadores = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [jogadores, setJogadores] = useState([
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

  // Mock teams data for the form
  const teams = [
    { team_id: 1, name: "Valorant Kings" },
    { team_id: 2, name: "Phoenix Squad" },
    { team_id: 3, name: "Sage Warriors" },
    { team_id: 4, name: "Viper Elite" },
  ];

  const handleAddParticipant = async (data: any) => {
    // Criar um novo jogador com os dados do formulário
    const novoJogador = {
      id: jogadores.length + 1, // Gerar um ID simples
      nome: data.nome,
      nickname: data.nickname,
      equipe: teams.find((t) => t.team_id === data.team_id)?.name || "",
      phone: data.phone,
      kills: 0, // Valores iniciais para estatísticas
      deaths: 0,
      assists: 0,
      kda: "0",
      winRate: "0%",
    };

    // Adicionar o novo jogador à lista
    setJogadores([...jogadores, novoJogador]);

    // Em uma aplicação real, você faria uma chamada de API aqui
    console.log("Jogador adicionado:", novoJogador);
  };

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
              onClick={() => setIsAddModalOpen(true)}
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
            <Card
              key={jogador.id}
              className="dashboard-card border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <User className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {jogador.nickname}
                    </h3>
                    <p className="dashboard-text-muted text-sm">
                      {jogador.nome}
                    </p>
                    <p className="dashboard-text-muted text-xs">
                      {jogador.equipe}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Info do jogador */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Contato</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {jogador.phone}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">K/D/A</span>
                  <span className="text-white font-medium">
                    {jogador.kills}/{jogador.deaths}/{jogador.assists}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">
                    KDA Ratio
                  </span>
                  <span className="text-green-400 font-medium">
                    {jogador.kda}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Win Rate</span>
                  <span className="text-blue-400 font-medium">
                    {jogador.winRate}
                  </span>
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
                <p className="text-2xl font-bold text-white">
                  {jogadores.length}
                </p>
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
                <p className="text-2xl font-bold text-white">1.22</p>
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
                  {jogadores.reduce((acc, j) => acc + j.kills, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Participant Modal */}
        <AddParticipantModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddParticipant}
          teams={teams}
        />
      </div>
    </DashboardLayout>
  );
};

export default GerenciarJogadores;
