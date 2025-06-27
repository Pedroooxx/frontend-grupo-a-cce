/**
 * Championship service with React Query
 */
import { createReactQueryService } from './reactQueryService';
import { apiClient, ApiError } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Match } from '@/types/match';
import type { Championship } from '@/types/championship';

export const championshipService = createReactQueryService<Championship>({
  entityName: 'Campeonato',
  endpoint: '/championships',
  idField: 'championship_id',
});

export const {
  useGetAll: useGetAllChampionships,
  useGetById: useGetChampionshipById,
  useCreate: useCreateChampionship,
  useUpdate: useUpdateChampionship,
  useDelete: useDeleteChampionship,
} = championshipService;

/**
 * Interface for match response from championship matches endpoint
 */
interface ChampionshipMatchesResponse {
  success: boolean;
  data: Match[];
}

/**
 * Hook to fetch matches for a specific championship using /championships/{id}/matches endpoint
 */
export const useGetChampionshipMatches = (championshipId: number | string, enabled = true) => {
  return useQuery<Match[], ApiError>({
    queryKey: ['championships', championshipId, 'matches'],
    queryFn: async () => {
      const response = await apiClient.get<ChampionshipMatchesResponse>(
        `/championships/${championshipId}/matches`,
        { withAuth: true }
      );
      return response.data;
    },
    enabled: enabled && !!championshipId,
  });
};
