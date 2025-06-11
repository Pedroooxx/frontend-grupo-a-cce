'use client';

import { DashboardLayout } from '../_components/DashboardLayout';
import { StatCard } from '@/components/statistics/StatCard';
import { TopPlayersCard } from '@/components/statistics/TopPlayersCard';
import { TeamRankingCard } from '@/components/statistics/TeamRankingCard';
import { MapPerformanceCard } from '@/components/statistics/MapPerformanceCard';
import { SearchBar } from '@/components/statistics/SearchBar';
import {
  topJogadores,
  topEquipes,
  estatisticasGerais,
  mapasData,
} from '@/data/statistics-mock';

const Estatisticas = () => {
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
          <SearchBar />
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
