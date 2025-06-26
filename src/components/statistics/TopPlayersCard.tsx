import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { PlayerSummaryStatistic } from '@/types/statistics';
import { PlayerListItem } from './PlayerListItem';

interface TopPlayersCardProps {
  players: PlayerSummaryStatistic[];
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
        {players
          // Filter out duplicates based on participant_id
          .filter((player, index, self) => 
            index === self.findIndex((p) => p.participant_id === player.participant_id)
          )
          // Sort by KDA ratio descending
          .sort((a, b) => (b.kda_ratio || 0) - (a.kda_ratio || 0))
          .slice(0, 5) // Only show top 5 players
          .map((player, index) => (
            <PlayerListItem 
              key={player.participant_id}
              player={player} 
              position={index} 
            />
          ))}
      </div>
    </Card>
  );
};
