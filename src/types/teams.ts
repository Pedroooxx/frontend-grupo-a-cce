import { PublicTeam, PublicParticipant } from './data-types';
import { z } from 'zod';


export const MAX_PLAYERS = 5;

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
  onEdit?: (team: TeamDisplay) => void;
  onDelete?: (id: string | number) => void; // This is correct as is
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

// Schema and types for team form
export const teamSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo'),
  manager_name: z.string().optional(), // Changed to optional
  member_ids: z.array(z.number()).default([])
});

export type TeamFormValues = z.infer<typeof teamSchema>;

// Add interface for teams with match statistics
export interface TeamWithStatistics {
  team_id: number;
  name: string;
  manager_name: string;
  wins: number;
  losses: number;
  total_matches: number;
  win_rate: number;
  participants_count: number;
}
