import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { TeamSummaryStatistic } from '@/types/statistics';
import { Tooltip } from '../ui/Tooltip';

interface TeamRankingCardProps {
  teams: TeamSummaryStatistic[];
}

export const TeamRankingCard = ({ teams }: TeamRankingCardProps) => {
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
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Ranking de Equipes</h3>
      </div>

      <div className="space-y-4">
        {teams.map((team, index) => (
          <div key={team.team_id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Badge className={`${getRankBadgeColor(index)} text-white`}>
                  #{index + 1}
                </Badge>
              </div>
              <div>
                <p className="text-white font-medium">{team.team_name}</p>
                <Tooltip content={<p className="dashboard-text-muted text-sm">{team.wins} Vitórias - {team.losses} Derrotas</p>}>
                  <p className="dashboard-text-muted text-sm">{team.wins} V x {team.losses} D</p>
                </Tooltip>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{Math.round(team.avg_match_score)} pts</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
