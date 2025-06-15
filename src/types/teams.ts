import { PublicTeam, PublicParticipant } from './data-types';

// Basic team member type used in TeamCard
export interface TeamMember {
  nickname: string;
  name: string;
}

// TeamDisplay type used for rendering in TeamCard component
export interface TeamDisplay {
  id: string | number;
  name: string;
  coach: string;
  members: TeamMember[];
  championship: string;
}

// Props for the TeamCard component
export interface TeamCardProps {
  team: TeamDisplay;
}

/**
 * Utility function to convert PublicTeam and PublicParticipant data
 * to the TeamDisplay format needed by TeamCard component
 */
export function mapTeamToDisplay(
  team: PublicTeam, 
  participants: PublicParticipant[]
): TeamDisplay {
  const teamMembers = participants
    .filter(player => player.team_name === team.name && !player.is_coach)
    .map(player => ({
      nickname: player.nickname,
      name: player.name,
    }));

  return {
    id: team.team_id,
    name: team.name,
    coach: team.manager_name,
    members: teamMembers,
    championship: team.championships_participated > 0
      ? `Participando de ${team.championships_participated} campeonatos`
      : "Nenhum campeonato ativo",
  };
}
