'use client'
import { Card } from '@/components/ui/card';
import { MapData } from '@/types/statistics';
import { TrendingUp } from 'lucide-react';
import { useMapImages } from '@/hooks/useMapImages';
import { MapCard } from './MapCard';
import { CardHeader } from '@/components/ui/CardHeader';

interface MapPerformanceCardProps {
  maps: MapData[];
}

export const MapPerformanceCard = ({ maps }: MapPerformanceCardProps) => {
  const { validImagePaths, isLoading } = useMapImages(maps);

  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <CardHeader 
        icon={<TrendingUp />} 
        title="Performance por Mapa" 
        iconColorClass="text-green-500"
        iconBgClass="bg-green-500/20" 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(maps.length || 3)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-6 relative h-[200px] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {maps.map((map, index) => (
            <MapCard 
              key={index} 
              map={map} 
              imagePath={validImagePaths[map.nome]} 
            />
          ))}
        </div>
      )}
    </Card>
  );
};
