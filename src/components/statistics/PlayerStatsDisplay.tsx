import { useMemo } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';
import { KDATooltipContent } from './KDATooltipContent';
import { KillsTooltipContent } from './KillsTooltipContent';
import { PlayerSummaryStatistic } from '@/types/statistics';

interface PlayerStatsDisplayProps {
  player: Partial<PlayerSummaryStatistic>;
}

export const PlayerStatsDisplay = ({ player }: PlayerStatsDisplayProps) => {
  // Calculate KDA ratio if not provided
  const calculateKDA = () => {
    if (player.total_deaths === undefined || player.total_kills === undefined || player.total_assists === undefined) {
      return '0.00';
    }
    if (player.total_deaths === 0) {
      return ((player.total_kills + player.total_assists)).toFixed(2);
    }
    return ((player.total_kills + player.total_assists) / player.total_deaths).toFixed(2);
  };

  const kda = useMemo(() => {
    if (player.kda_ratio !== undefined) {
      // Handle kda_ratio whether it's a string or number
      return typeof player.kda_ratio === 'string' 
        ? player.kda_ratio 
        : player.kda_ratio.toFixed(2);
    }
    return calculateKDA();
  }, [player.kda_ratio, player.total_kills, player.total_deaths, player.total_assists]);

  const kills = player.total_kills || 0;
  
  const winRate = useMemo(() => {
    if (player.win_rate !== undefined) {
      return `${Math.round(player.win_rate * 100)}%`;
    }
    if (player.total_matches && player.wins !== undefined) {
      return `${Math.round((player.wins / player.total_matches) * 100)}%`;
    }
    return '0%';
  }, [player.win_rate, player.total_matches, player.wins]);

  return (
    <div className="text-right">
      <Tooltip content={<KDATooltipContent />}>
        <p className="text-white font-medium cursor-help">
          <span className="text-green-400">K</span>
          <span className="text-red-400">D</span>
          <span className="text-blue-400">A </span>
          - {kda}
        </p>
      </Tooltip>
      <Tooltip content={<KillsTooltipContent kills={kills} />}>
        <p className="dashboard-text-muted text-sm">{kills} kills</p>
      </Tooltip>

      <p className="text-green-400 text-sm">{winRate} Taxa de vitória</p>
    </div>
  );
};
