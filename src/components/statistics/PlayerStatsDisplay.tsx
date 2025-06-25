import { Tooltip } from '@/components/ui/Tooltip';
import { KDATooltipContent } from './KDATooltipContent';
import { KillsTooltipContent } from './KillsTooltipContent';
import { PlayerSummaryStatistic } from '@/types/statistics';

interface PlayerStatsDisplayProps {
  player: Partial<PlayerSummaryStatistic>;
}

export const PlayerStatsDisplay = ({ player }: PlayerStatsDisplayProps) => {
  const kda = player.kda_ratio ? player.kda_ratio.toFixed(2) : '0.00';
  const kills = player.total_kills || 0;
  const winRate = player.total_matches && player.total_matches > 0 && player.mvp_count !== undefined
    ? `${Math.round((player.mvp_count / player.total_matches) * 100)}%` 
    : '0%';

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
