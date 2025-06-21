/**
 * Match service with React Query
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
import { createReactQueryService } from './reactQueryService';
import { Match } from '@/types/match';

// Re-export Match type for convenience
export type { Match } from '@/types/match';

interface MatchResponse {
  success: boolean;
  data: Match[];
}

export const matchService = createReactQueryService<Match>({
  entityName: 'Partida',
  endpoint: '/matches',
  idField: 'match_id',
});

// Custom hook for getting all matches that handles the API response format
export const useGetAllMatches = (enabled = true) => {
  return useQuery<Match[], ApiError>({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await apiClient.get<MatchResponse>('/matches', { withAuth: true });
      return response.data; // Extract the data array from the response
    },
    enabled,
  });
};

export const {
  useGetById: useGetMatchById,
  useCreate: useCreateMatch,
  useUpdate: useUpdateMatch,
  useDelete: useDeleteMatch,
} = matchService;

// Additional match-specific operations
/**
 * Get matches for a specific championship
 */
export const useGetChampionshipMatches = (championshipId: number | string, enabled = true) => {
  return useQuery<Match[], ApiError>({
    queryKey: ['matches', 'championship', championshipId],
    queryFn: async () => {
      const response = await apiClient.get<MatchResponse>(`/matches?championship_id=${championshipId}`, { withAuth: true });
      return response.data;
    },
    enabled: enabled && !!championshipId,
  });
};

/**
 * Get matches by status
 */
export const useGetMatchesByStatus = (status: string, enabled = true) => {
  return useQuery<Match[], ApiError>({
    queryKey: ['matches', 'status', status],
    queryFn: async () => {
      const response = await apiClient.get<MatchResponse>(`/matches?status=${status}`, { withAuth: true });
      return response.data;
    },
    enabled: enabled && !!status,
  });
};
