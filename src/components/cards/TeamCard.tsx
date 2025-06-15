import { Edit, Trash2, User, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { PublicTeam, PublicParticipant } from '@/types/data-types';

interface TeamCardProps {
  equipe: {
    id: number;
    nome: string;
    coach: string;
    membros: Array<{
      nickname: string;
      nome: string;
    }>;
    campeonato: string;
  }
}

const TeamCard = ({ equipe }: TeamCardProps) => {
  return (
    <Card key={equipe.id} className="dashboard-card border-gray-700 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {equipe.nome}
            </h3>
            <p className="dashboard-text-muted">
              Coach: {equipe.coach}
            </p>
            <p className="dashboard-text-muted text-sm">
              {equipe.campeonato}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => console.log('Edit team', equipe.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Membros da equipe */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">
          Membros da Equipe ({equipe.membros.length})
        </h4>
        {equipe.membros.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {equipe.membros.map((membro, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-4 text-center"
              >
                <div className="p-2 bg-gray-700 rounded-lg mb-3 mx-auto w-fit">
                  <User className="w-6 h-6 text-gray-300" />
                </div>
                <h5 className="text-white font-medium text-sm">
                  {membro.nickname}
                </h5>
                <p className="dashboard-text-muted text-xs">
                  {membro.nome}
                </p>
              </div>
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