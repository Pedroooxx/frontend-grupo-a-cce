import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { GeneralStat } from '@/types/statistics';

interface StatCardProps {
  stat: GeneralStat;
}

export const StatCard = ({ stat }: StatCardProps) => {
  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="dashboard-text-muted text-sm">{stat.label}</p>
          <p className="text-2xl font-bold text-white mt-1">{stat.valor}</p>
          <p className={`text-sm mt-1 ${stat.crescimento.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {stat.crescimento} vs. mês anterior
          </p>
        </div>
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </Card>
  );
};
