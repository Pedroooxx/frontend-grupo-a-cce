import { Tooltip } from '@/components/ui/Tooltip';
import { KDATooltipContent } from './KDATooltipContent';
import { KillsTooltipContent } from './KillsTooltipContent';

interface PlayerStatsDisplayProps {
  kda: string;
  kills: number;
  winRate: string;
}

export const PlayerStatsDisplay = ({ kda, kills, winRate }: PlayerStatsDisplayProps) => {
  return (
    <div className="text-right">
      <Tooltip content={<KDATooltipContent />}>
        <p className="text-white font-medium cursor-help">

          <span className="text-green-400">K</span>
          <span className="text-red-400">D</span>
          <span className="text-blue-400">A </span>
          - {kda}</p>
      </Tooltip>
      <Tooltip content={<KillsTooltipContent kills={kills} />}>
        <p className="dashboard-text-muted text-sm">{kills} kills</p>
      </Tooltip>

      <Tooltip content={<span className='text-green-400'>Taxa de vitória</span>}>
        <p className="text-green-400 text-sm">{winRate}</p>
      </Tooltip>
    </div >
  );
};
