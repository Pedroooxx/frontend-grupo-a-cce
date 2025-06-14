import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Player } from '@/types/data-types';
import { PlayerListItem } from './PlayerListItem';

interface TopPlayersCardProps {
  players: Player[];
}

export const TopPlayersCard = ({ players }: TopPlayersCardProps) => {
  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Top Jogadores</h3>
      </div>

      <div className="space-y-4">
        {players.map((player, index) => (
          <PlayerListItem 
            key={index} 
            player={player} 
            position={index} 
          />
        ))}
      </div>
    </Card>
  );
};
