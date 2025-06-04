import { Badge } from '@/components/ui/badge';

interface PlayerRankBadgeProps {
  position: number;
}

export const PlayerRankBadge = ({ position }: PlayerRankBadgeProps) => {
  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="text-center">
      <Badge className={`${getRankBadgeColor(position)} text-white`}>
        #{position + 1}
      </Badge>
    </div>
  );
};
