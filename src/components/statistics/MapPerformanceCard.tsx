import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { MapData } from '@/types/statistics';
import { Tooltip } from '../ui/Tooltip';

interface MapPerformanceCardProps {
  maps: MapData[];
}

export const MapPerformanceCard = ({ maps }: MapPerformanceCardProps) => {
  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Performance por Mapa</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {maps.map((mapa, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">{mapa.nome}</h4>
            <div className="space-y-3">
              <Tooltip content={`Total de partidas jogadas no mapa atual: ${mapa.partidas}`} className="flex justify-between">
                <span className="dashboard-text-muted text-sm">Partidas</span>
                <span className="text-white">{mapa.partidas}</span>
              </Tooltip>
              <Tooltip content={`Média de Pontuação: ${mapa.avgScore}`} className="flex justify-between">
                <span className="dashboard-text-muted text-sm">Avg. Score</span>
                <span className="text-blue-400">{mapa.avgScore}</span>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
