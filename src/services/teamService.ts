import { apiClient, ApiError } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { createReactQueryService } from './reactQueryService';



/**
 * Participant interface as returned by the teams API
 */
export interface TeamParticipant {
  participant_id: number;
  name: string;
  nickname: string;
  is_coach: boolean;
  team_id?: number;
}

/**
 * Team interface as returned by the teams API with nested participants
 */
export interface Team {
  team_id: number;
  name: string;
  user_id: number;
  participants_count?: number;
  Participants?: TeamParticipant[];
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

/**
 * Hook to get all participants for search functionality
 */
export const useGetAllParticipants = () => {
  return useQuery<TeamParticipant[], ApiError>({
    queryKey: ['participants'],
    queryFn: () => apiClient.get<TeamParticipant[]>('/participants', { withAuth: false }),
  });
};
