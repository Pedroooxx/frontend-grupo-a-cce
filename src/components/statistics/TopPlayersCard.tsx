import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { Player } from '@/types/statistics';

interface TopPlayersCardProps {
  players: Player[];
}

export const TopPlayersCard = ({ players }: TopPlayersCardProps) => {
  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Top Jogadores</h3>
      </div>

      <div className="space-y-4">
        {players.map((jogador, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Badge className={`${getRankBadgeColor(index)} text-white`}>
                  #{index + 1}
                </Badge>
              </div>
              <div>
                <p className="text-white font-medium">{jogador.nome}</p>
                <p className="dashboard-text-muted text-sm">{jogador.equipe}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">KDA: {jogador.kda}</p>
              <p className="dashboard-text-muted text-sm">{jogador.kills} kills</p>
              <p className="text-green-400 text-sm">{jogador.winRate}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
