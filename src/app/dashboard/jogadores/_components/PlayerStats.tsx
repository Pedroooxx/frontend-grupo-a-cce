import { Card } from "@/components/ui/card";
import { User, Target, Skull } from "lucide-react";
import type { PlayerStats } from "@/types/participant";

interface PlayerStatsProps {
  stats: PlayerStats;
}

export default function PlayerStats({ stats }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <Card className="dashboard-card border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <User className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="dashboard-text-muted text-sm">Total Jogadores</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalPlayers}
            </p>
          </div>
        </div>
      </Card>
      <Card className="dashboard-card border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="dashboard-text-muted text-sm">KDA Médio</p>
            <p className="text-2xl font-bold text-white">{stats.avgKDA}</p>
          </div>
        </div>
      </Card>
      <Card className="dashboard-card border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <Skull className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="dashboard-text-muted text-sm">Kills Totais</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalKills}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
