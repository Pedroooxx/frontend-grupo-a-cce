import { Edit, Trash2, User, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { TeamCardProps } from '@/types/teams';
import TeamParticipantCard from './TeamParticipantCard';

const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => {
  return (
    <Card key={team.id} className="dashboard-card border-gray-700 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {team.name}
            </h3>
            <p className="dashboard-text-muted">
              Coach: {team.coach}
            </p>
            <p className="dashboard-text-muted text-sm">
              {team.championship}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => onEdit && onEdit(team)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => onDelete && onDelete(team.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Membros da equipe */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">
          Membros da Equipe ({team.members.length})
        </h4>
        {team.members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {team.members.map((member, index) => (
              <TeamParticipantCard
                key={index}
                membro={{
                  nickname: member.nickname,
                  nome: member.name
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            Informações de membros não disponíveis.
          </p>
        )}
      </div>
    </Card>
  );
}

export default TeamCard;