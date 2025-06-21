/**
 * Team service with React Query
 */
import { createReactQueryService } from './reactQueryService';

/**
 * Participant interface as returned by the teams API
 */
export interface TeamParticipant {
  participant_id: number;
  name: string;
  nickname: string;
  is_coach: boolean;
}

/**
 * Team interface as returned by the teams API with nested participants
 */
export interface Team {
  id: number;
  team_id: number;
  name: string;
  user_id: number;
  Participants: TeamParticipant[];
}

export const teamService = createReactQueryService<Team>({
  entityName: 'Equipe',
  endpoint: '/teams',
  idField: 'team_id',
});

export const {
  useGetAll: useGetAllTeams,
  useGetById: useGetTeamById,
  useCreate: useCreateTeam,
  useUpdate: useUpdateTeam,
  useDelete: useDeleteTeam,
} = teamService;

// Additional team-specific operations
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';

/**
 * Validates if a team meets the requirements to participate in a championship
 */
export const useValidateTeam = (teamId: number | string, enabled = true) => {
  return useQuery<{ isValid: boolean; message: string }, ApiError>({
    queryKey: ['teams', teamId, 'validate'],
    queryFn: () => apiClient.get<{ isValid: boolean; message: string }>(`/teams/${teamId}/validate`, { withAuth: true }),
    enabled: enabled && !!teamId,
  });
};
