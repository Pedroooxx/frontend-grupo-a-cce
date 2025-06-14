"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Edit, Trash2, Target, Skull } from "lucide-react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchPlayers } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { publicParticipants } from "@/data/data-mock";

const GerenciarJogadores = () => {
  const [jogadores] = useState(publicParticipants.slice(0, 4)); // Usar dados reais

  const handlePlayerSearch = (result: SearchResult) => {
    // Aqui você pode implementar a navegação para detalhes do jogador
    // ou filtrar a lista atual baseado no resultado
    console.log('Jogador selecionado:', result);
    // Exemplo: navegar para detalhes do jogador
    // router.push(`/dashboard/jogadores/${result.id}`);
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
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Jogador
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <UniversalSearchBar
            searchFunction={searchPlayers}
            config={{
              searchTypes: ['player'],
              placeholder: "Buscar jogadores por nome, nickname, equipe ou telefone...",
              maxResults: 6,
              minQueryLength: 1,
              debounceMs: 300
            }}
            onResultClick={handlePlayerSearch}
            className="max-w-xl"
          />
        </div>

        {/* Grid de jogadores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jogadores.map((jogador) => (
            <Card
              key={jogador.participant_id}
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
                      {jogador.name}
                    </p>
                    <p className="dashboard-text-muted text-xs">
                      {jogador.team_name}
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
                    {jogador.total_kills}/{jogador.total_deaths}/{jogador.total_assists}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">
                    KDA Ratio
                  </span>
                  <span className="text-green-400 font-medium">
                    {jogador.kda_ratio}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Win Rate</span>
                  <span className="text-blue-400 font-medium">
                    {Math.round(jogador.win_rate * 100)}%
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
                  {(jogadores.reduce((acc, p) => acc + p.kda_ratio, 0) / jogadores.length).toFixed(2)}
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
                  {jogadores.reduce((acc, p) => acc + p.total_kills, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GerenciarJogadores;
