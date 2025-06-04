import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface AgentStatsCardProps {
  agents: string[];
}

export const AgentStatsCard = ({ agents }: AgentStatsCardProps) => {
  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Target className="w-6 h-6 text-purple-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Estatísticas por Agente</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((agente, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 text-center">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-3">
              {agente}
            </Badge>
            <div className="space-y-2">
              <div>
                <p className="dashboard-text-muted text-xs">Pick Rate</p>
                <p className="text-white font-medium">{Math.floor(Math.random() * 30 + 10)}%</p>
              </div>
              <div>
                <p className="dashboard-text-muted text-xs">Win Rate</p>
                <p className="text-green-400 font-medium">{Math.floor(Math.random() * 20 + 60)}%</p>
              </div>
              <div>
                <p className="dashboard-text-muted text-xs">KDA Médio</p>
                <p className="text-blue-400 font-medium">{(Math.random() * 0.5 + 1).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
