'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../_components/DashboardLayout';
import { StatCard } from '@/components/statistics/StatCard';
import { TopPlayersCard } from '@/components/statistics/TopPlayersCard';
import { TeamRankingCard } from '@/components/statistics/TeamRankingCard';
import { MapPerformanceCard } from '@/components/statistics/MapPerformanceCard';
import { UniversalSearchBar } from '@/components/common/UniversalSearchBar';
import { searchStatistics } from '@/data/search-functions';
import { SearchResult } from '@/hooks/useSearch';
import { useAllPlayersSummary, useAllTeamsSummary } from '@/hooks/useStatistics';
import { Card } from '@/components/ui/card';
import { MapData } from '@/types/data-types';
import { useEffect, useState } from 'react';

const Estatisticas = () => {
  const router = useRouter();
  const { data: players = [], isLoading: isLoadingPlayers } = useAllPlayersSummary();
  const { data: teams = [], isLoading: isLoadingTeams } = useAllTeamsSummary();
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [isLoadingMapData, setIsLoadingMapData] = useState(true);

  // Sort by KDA and win rate for ranking
  const topPlayers = [...players].sort((a, b) => b.kda_ratio - a.kda_ratio).slice(0, 5);
  const topTeams = [...teams].sort((a, b) => b.win_rate - a.win_rate).slice(0, 5);

  // Generate general statistics from API data
  const generalStats = [
    {
      label: "Total de Kills",
      valor: players.reduce((acc, player) => acc + player.total_kills, 0).toString(),
      crescimento: "+15%"
    },
    {
      label: "Partidas Jogadas",
      valor: teams.reduce((acc, team) => acc + team.total_matches, 0).toString(),
      crescimento: "+8%"
    },
    {
      label: "MVPs",
      valor: players.reduce((acc, player) => acc + player.mvp_count, 0).toString(),
      crescimento: "+12%"
    },
    {
      label: "Taxa de Vitória Média",
      valor: teams.length > 0 
        ? `${Math.round(teams.reduce((acc, team) => acc + team.win_rate, 0) / teams.length)}%` 
        : "0%",
      crescimento: "+5%"
    },
  ];

  useEffect(() => {
    // Here we would normally fetch map data from API
    // For now, we'll simulate it with a timeout to show loading state
    setIsLoadingMapData(true);
    const timer = setTimeout(() => {
      // When the API for maps is available, replace this with actual API call
      const mockMapData: MapData[] = [
        {
          nome: "Ascent",
          partidas: 24,
          winRate: "58%",
          avgScore: "312",
          imagePath: "/maps/Ascent.png"
        },
        {
          nome: "Bind",
          partidas: 22,
          winRate: "45%",
          avgScore: "298",
          imagePath: "/maps/Bind.png"
        },
        {
          nome: "Haven",
          partidas: 18,
          winRate: "67%",
          avgScore: "325",
          imagePath: "/maps/Haven.png"
        }
      ];
      setMapData(mockMapData);
      setIsLoadingMapData(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearchResultClick = (result: SearchResult) => {
    let basePath = '';
    switch (result.type) {
      case 'player':
        basePath = '/dashboard/estatisticas/jogador';
        break;
      case 'team':
        basePath = '/dashboard/estatisticas/equipe';
        break;
      case 'championship':
        basePath = '/dashboard/estatisticas/campeonato';
        break;
    }
    if (basePath) {
      router.push(`${basePath}/${result.id}`);
    }
  };

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle="E RELATÓRIOS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS" }
      ]}
    >
      <div className="p-8 space-y-8">
        <div className="mb-8">
          <UniversalSearchBar 
            searchFunction={searchStatistics} 
            config={{
              placeholder: "Busque por jogadores, equipes ou campeonatos...",
              searchTypes: ['player', 'team', 'championship'],
              minQueryLength: 2,
              maxResults: 10,
            }}
            onResultClick={handleSearchResultClick}
          />
        </div>

        {/* General Statistics */}
        {isLoadingPlayers || isLoadingTeams ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="dashboard-card border-gray-700 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {generalStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        )}

        {/* Team and Player Rankings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingPlayers ? (
            <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-40 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-800/50 rounded-lg"></div>
                ))}
              </div>
            </Card>
          ) : (
            <TopPlayersCard players={topPlayers} />
          )}

          {isLoadingTeams ? (
            <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-40 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-800/50 rounded-lg"></div>
                ))}
              </div>
            </Card>
          ) : (
            <TeamRankingCard teams={topTeams} />
          )}
        </div>

        {/* Map Performance - Shows loading state until Map API is implemented */}
        {isLoadingMapData ? (
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded w-48"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-800/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </Card>
        ) : (
          <MapPerformanceCard maps={mapData} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Estatisticas;
