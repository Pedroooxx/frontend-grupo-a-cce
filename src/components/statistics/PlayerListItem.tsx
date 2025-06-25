import { PlayerSummaryStatistic } from '@/types/statistics';
import { PlayerRankBadge } from './PlayerRankBadge';
import { PlayerStatsDisplay } from './PlayerStatsDisplay';

interface PlayerListItemProps {
  player: PlayerSummaryStatistic;
  position: number;
}

export const PlayerListItem = ({ player, position }: PlayerListItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center space-x-4">
        <PlayerRankBadge position={position} />
        <div>
          <p className="text-white font-medium">{player.nickname}</p>
          <p className="dashboard-text-muted text-sm">{player.team_name}</p>
        </div>
      </div>
      <PlayerStatsDisplay player={player} />
    </div>
  );
};
