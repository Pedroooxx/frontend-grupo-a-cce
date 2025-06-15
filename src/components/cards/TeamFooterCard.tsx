import { User, Users } from "lucide-react";
import { Card } from "../ui/card";


interface TeamFooterCardProps {
  totalTeams: number;
  totalPlayers: number;
  totalCoaches: number;

}

const TeamFooterCard = ({ totalTeams, totalPlayers, totalCoaches }: TeamFooterCardProps) => {
  return (
    <>
      <Card className="dashboard-card border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="dashboard-text-muted text-sm">Total de Equipes</p>
            <p className="text-2xl font-bold text-white">
              {totalTeams}
            </p>
          </div>
        </div>
      </Card>
      <Card className="dashboard-card border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <User className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="dashboard-text-muted text-sm">Total de Jogadores</p>
            {/* This needs to be calculated from detailedPlayersStats or similar */}
            <p className="text-2xl font-bold text-white">{totalPlayers}</p>
          </div>
        </div>
      </Card>
      <Card className="dashboard-card border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <Users className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="dashboard-text-muted text-sm">
              Coaches (Treinadores)
            </p>
            {/* This needs to be calculated based on is_coach in detailedPlayersStats or similar */}
            <p className="text-2xl font-bold text-white">{totalCoaches}</p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TeamFooterCard;
