"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "../../../_components/DashboardLayout";
import { User, Trophy, Target, Zap, Crosshair } from "lucide-react";
import {
  detailedPlayersStats,
  agentUsageStats,
  mapPerformanceStats,
  championshipParticipations,
} from "@/data/data-mock";

const PlayerStatistics = () => {
  const params = useParams();
  const playerId = parseInt(params.id as string) || 1;

  const player =
    detailedPlayersStats.find((p) => p.participant_id === playerId) ||
    detailedPlayersStats[0];
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "agents" | "maps" | "championships"
  >("overview");

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`JOGADOR - ${player.nickname.toUpperCase()}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: player.nickname.toUpperCase() },
      ]}
    >
      <div className="p-8 space-y-8">
        {/* Player Header */}
        <Card className="dashboard-card border-gray-700 p-6">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <User className="w-12 h-12 text-blue-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">
                {player.nickname}
              </h1>
              <p className="text-xl dashboard-text-muted">{player.name}</p>
              <p className="text-lg text-blue-400">{player.team_name}</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {player.is_coach ? "Técnico" : "Jogador"}
              </Badge>
              <p className="dashboard-text-muted text-sm">
                Nascimento:{" "}
                {new Date(player.birth_date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { key: "overview", label: "Visão Geral" },
            { key: "agents", label: "Agentes" },
            { key: "maps", label: "Mapas" },
            { key: "championships", label: "Campeonatos" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                selectedTab === tab.key
                  ? "bg-red-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <>
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">KDA Ratio</p>
                    <p className="text-2xl font-bold text-white">
                      {player.kda_ratio}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">
                      Taxa de Vitória
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(player.win_rate * 100)}%
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Total MVPs</p>
                    <p className="text-2xl font-bold text-white">
                      {player.total_mvps}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="dashboard-card border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Crosshair className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="dashboard-text-muted text-sm">Avg Score</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(player.avg_score)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">
                  Estatísticas de Combate
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Kills</span>
                    <span className="text-white font-medium">
                      {player.total_kills}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">
                      Total de Deaths
                    </span>
                    <span className="text-white font-medium">
                      {player.total_deaths}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">
                      Total de Assists
                    </span>
                    <span className="text-white font-medium">
                      {player.total_assists}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">First Kills</span>
                    <span className="text-white font-medium">
                      {player.total_first_kills}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">
                  Estatísticas Especiais
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Spike Plants</span>
                    <span className="text-white font-medium">
                      {player.total_spike_plants}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Spike Defuses</span>
                    <span className="text-white font-medium">
                      {player.total_spike_defuses}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">
                      Agente Favorito
                    </span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {player.favorite_agent}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Mapa Favorito</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {player.favorite_map}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Agents Tab */}
        {selectedTab === "agents" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Performance por Agente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agentUsageStats.map((agent, index) => (
                <Card
                  key={index}
                  className="dashboard-card border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {agent.agent_name}
                    </h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {agent.matches_played} partidas
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        Taxa de Vitória
                      </span>
                      <span className="text-green-400 font-medium">
                        {Math.round(agent.win_rate * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        KDA Médio
                      </span>
                      <span className="text-white font-medium">
                        {agent.kda_ratio}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        Kills Médias
                      </span>
                      <span className="text-white font-medium">
                        {agent.avg_kills}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Maps Tab */}
        {selectedTab === "maps" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Performance por Mapa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mapPerformanceStats.map((map, index) => (
                <Card
                  key={index}
                  className="dashboard-card border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {map.map_name}
                    </h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {map.matches_played} partidas
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">W/L</span>
                      <span className="text-white font-medium">
                        {map.wins}W - {map.losses}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        Taxa de Vitória
                      </span>
                      <span className="text-green-400 font-medium">
                        {Math.round(map.win_rate * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        Score Médio
                      </span>
                      <span className="text-white font-medium">
                        {map.avg_score}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Championships Tab */}
        {selectedTab === "championships" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Participação em Campeonatos
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {championshipParticipations.map((championship, index) => (
                <Card
                  key={index}
                  className="dashboard-card border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {championship.championship_name}
                      </h3>
                      <p className="dashboard-text-muted text-sm">
                        {championship.matches_played} partidas jogadas
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge
                        className={`${
                          championship.status === "Finalizado"
                            ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            : "bg-green-500/20 text-green-400 border-green-500/30"
                        }`}
                      >
                        {championship.status}
                      </Badge>                      <p className="text-white font-medium">
                        #{championship.placement}º Lugar
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlayerStatistics;
