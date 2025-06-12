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
import {
  topJogadores,
  topEquipes,
  estatisticasGerais,
  mapasData,
} from '@/data/statistics-mock';

const Estatisticas = () => {
  const router = useRouter();

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
        {/* Search Bar */}
        <div className="flex justify-center">
          <UniversalSearchBar
            searchFunction={searchStatistics}
            config={{
              searchTypes: ['player', 'team', 'championship'],
              placeholder: "Buscar jogadores, equipes ou campeonatos...",
              maxResults: 8,
              minQueryLength: 1,
              debounceMs: 300
            }}
            onResultClick={handleSearchResultClick}
            className="max-w-2xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {estatisticasGerais.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopPlayersCard players={topJogadores} />
          <TeamRankingCard teams={topEquipes} />
        </div>

        <MapPerformanceCard maps={mapasData} />
      </div>
    </DashboardLayout>
  );
};

export default Estatisticas;
