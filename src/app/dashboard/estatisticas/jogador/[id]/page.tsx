"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "../../../_components/DashboardLayout";
import { User, Trophy, Target, Zap, Crosshair, Loader2 } from "lucide-react";
import { 
  useAllPlayersSummary,
  usePlayerStatistics, 
  usePlayerAgentStatistics,
  usePlayerMapStatistics 
} from '@/hooks/useStatistics';
import { detailedPlayersStats } from "@/data/data-mock"; // Fallback if API fails

const PlayerStatistics = () => {
  const params = useParams();
  const playerId = parseInt(params?.id as string) || 1;
  
  // Fetch player data from API
  const { data: allPlayers, isLoading: isLoadingAllPlayers } = useAllPlayersSummary();
  const { data: playerStats, isLoading: isLoadingStats } = usePlayerStatistics(playerId);
  const { data: agentStats, isLoading: isLoadingAgents } = usePlayerAgentStatistics(playerId);
  const { data: mapStats, isLoading: isLoadingMaps } = usePlayerMapStatistics(playerId);
  
  // Get player summary from all players summary
  const playerSummary = allPlayers?.find(p => p.participant_id === playerId);
  
  // Fallback to mock data if API fails
  const player = playerSummary 
    ? playerSummary
    : detailedPlayersStats.find((p) => p.participant_id === playerId) || 
      detailedPlayersStats[0];
  
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "agents" | "maps" | "championships"
  >("overview");
  
  const isLoading = isLoadingAllPlayers || isLoadingStats || isLoadingAgents || isLoadingMaps;

  if (isLoading) {
    return (
      <DashboardLayout
        title="ESTATÍSTICAS"
        subtitle="Carregando..."
        breadcrumbs={[
          { label: "DASHBOARD", href: "/dashboard" },
          { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
          { label: "Carregando..." },
        ]}
      >
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
            <p className="text-white text-lg">Carregando estatísticas do jogador...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Nickname and name handling based on data source
  const nickname = player.nickname || `Jogador #${playerId}`;
  const name = player.name || nickname;
  const teamName = player.team_name || "Equipe não informada";

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`JOGADOR - ${nickname.toUpperCase()}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: nickname.toUpperCase() },
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
                {nickname}
              </h1>
              <p className="text-xl dashboard-text-muted">{name}</p>
              <p className="text-lg text-blue-400">{teamName}</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Jogador
              </Badge>
              {player.birth_date && (
                <p className="dashboard-text-muted text-sm">
                  Nascimento:{" "}
                  {new Date(player.birth_date).toLocaleDateString("pt-BR")}
                </p>
              )}
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
                      {playerSummary?.kda_ratio || (playerStats && 
                        ((playerStats.reduce((sum, s) => sum + s.kills, 0) + 
                         playerStats.reduce((sum, s) => sum + (s.assists || 0), 0)) / 
                         Math.max(1, playerStats.reduce((sum, s) => sum + s.deaths, 0))).toFixed(2) || 
                       "N/A")}
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
                      {player.win_rate ? `${Math.round(player.win_rate * 100)}%` : "N/A"}
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
                      {playerSummary?.mvp_count || 
                       (playerStats && playerStats.reduce((sum, s) => sum + (s.MVPs || 0), 0)) || 
                       "N/A"}
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
                    <p className="dashboard-text-muted text-sm">Partidas</p>
                    <p className="text-2xl font-bold text-white">
                      {playerSummary?.total_matches || 
                       (playerStats ? new Set(playerStats.map(s => s.match_id)).size : "N/A")}
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
                      {playerSummary?.total_kills || 
                       (playerStats && playerStats.reduce((sum, s) => sum + s.kills, 0)) || 
                       "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">
                      Total de Deaths
                    </span>
                    <span className="text-white font-medium">
                      {playerSummary?.total_deaths || 
                       (playerStats && playerStats.reduce((sum, s) => sum + s.deaths, 0)) || 
                       "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">
                      Total de Assists
                    </span>
                    <span className="text-white font-medium">
                      {playerSummary?.total_assists || 
                       (playerStats && playerStats.reduce((sum, s) => sum + (s.assists || 0), 0)) || 
                       "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">First Kills</span>
                    <span className="text-white font-medium">
                      {playerStats && playerStats.reduce((sum, s) => sum + (s.first_kills || 0), 0) || "N/A"}
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
                      {playerStats && playerStats.reduce((sum, s) => sum + (s.spike_plants || 0), 0) || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Spike Defuses</span>
                    <span className="text-white font-medium">
                      {playerStats && playerStats.reduce((sum, s) => sum + (s.spike_defuses || 0), 0) || "N/A"}
                    </span>
                  </div>
                  {agentStats && agentStats.length > 0 && (
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">
                      Agente Favorito
                    </span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {agentStats.sort((a, b) => b.games_played - a.games_played)[0].agent_name || 
                       `#${agentStats[0].agent_id}`}
                    </Badge>
                  </div>
                  )}
                  {mapStats && mapStats.length > 0 && (
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Mapa Favorito</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {mapStats.sort((a, b) => b.games_played - a.games_played)[0].map_name ||
                       `#${mapStats[0].map_id}`}
                    </Badge>
                  </div>
                  )}
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
            
            {isLoadingAgents ? (
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
              </div>
            ) : !agentStats || agentStats.length === 0 ? (
              <Card className="dashboard-card border-gray-700 p-6 text-center">
                <p className="text-gray-400">Nenhuma estatística de agente disponível para este jogador.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agentStats.map((agent, index) => (
                  <Card
                    key={index}
                    className="dashboard-card border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {agent.agent_name || `Agente #${agent.agent_id}`}
                      </h3>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {agent.games_played} partidas
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="dashboard-text-muted text-sm">
                          Taxa de Vitória
                        </span>
                        <span className="text-green-400 font-medium">
                          {agent.win_rate}%
                        </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        KDA
                      </span>
                      <span className="text-white font-medium">
                        {agent.kda_ratio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        K/D/A
                      </span>
                      <span className="text-white font-medium">
                        {agent.total_kills}/{agent.total_deaths}/{agent.total_assists}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Maps Tab */}
        {selectedTab === "maps" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Performance por Mapa
            </h2>
            
            {isLoadingMaps ? (
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
              </div>
            ) : !mapStats || mapStats.length === 0 ? (
              <Card className="dashboard-card border-gray-700 p-6 text-center">
                <p className="text-gray-400">Nenhuma estatística de mapa disponível para este jogador.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mapStats.map((map, index) => (
                  <Card
                    key={index}
                    className="dashboard-card border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {map.map_name || `Mapa #${map.map_id}`}
                      </h3>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {map.games_played} partidas
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
                          {map.win_rate}%
                        </span>
                      </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        KDA
                      </span>
                      <span className="text-white font-medium">
                        {((map.total_kills + map.total_assists) / Math.max(1, map.total_deaths)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dashboard-text-muted text-sm">
                        Score Médio
                      </span>
                      <span className="text-white font-medium">
                        {map.avg_score || "N/A"}
                      </span>
                    </div>
                  </div>
                </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Championships Tab */}
        {selectedTab === "championships" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Participação em Campeonatos
            </h2>
            
            <Card className="dashboard-card border-gray-700 p-6 text-center">
              <p className="text-gray-400 mb-4">
                Dados de participação em campeonatos estão sendo integrados com a API.
              </p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Em implementação
              </Badge>
            </Card>
            
            {/* Quando a API estiver disponível, descomente este bloco
            <div className="grid grid-cols-1 gap-6">
              {championshipData && championshipData.map((championship, index) => (
                <Card
                  key={index}
                  className="dashboard-card border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {championship.name}
                      </h3>
                      <p className="dashboard-text-muted text-sm">
                        Partidas jogadas
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Status
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlayerStatistics;
