import { Tooltip } from '@/components/ui/Tooltip';
import { KDATooltipContent } from './KDATooltipContent';

interface PlayerStatsDisplayProps {
  kda: string;
  kills: number;
  winRate: string;
}

export const PlayerStatsDisplay = ({ kda, kills, winRate }: PlayerStatsDisplayProps) => {
  return (
    <div className="text-right">
      <Tooltip content={<KDATooltipContent />}>
        <p className="text-white font-medium cursor-help">KDA: {kda}</p>
      </Tooltip>
      <p className="dashboard-text-muted text-sm">{kills} kills</p>
      <p className="text-green-400 text-sm">{winRate}</p>
    </div>
  );
};
