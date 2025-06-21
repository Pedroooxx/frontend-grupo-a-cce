/**
 * Team service with React Query
 */
import { createReactQueryService } from './reactQueryService';

export interface Team {
  id: number;
  name: string;
}

export const teamService = createReactQueryService<Team>({
  entityName: 'Equipe',
  endpoint: '/teams',
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
