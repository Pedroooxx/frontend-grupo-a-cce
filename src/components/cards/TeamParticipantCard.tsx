import { User } from "lucide-react";

interface MembroProps {
  nickname: string;
  nome: string;
}

interface TeamParticipantCardProps {
  membro: MembroProps;
}

const TeamParticipantCard = ({ membro }: TeamParticipantCardProps) => {
  return (
    <div
      className="bg-gray-700/50 rounded-lg  p-4 text-center"
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
  );
};

export default TeamParticipantCard;