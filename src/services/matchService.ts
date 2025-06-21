/**
 * Match service with React Query
 */
import { createReactQueryService } from './reactQueryService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';

/**
 * Team interface as returned by the matches API (simplified from teams API)
 */
export interface MatchTeam {
  team_id: number;
  name: string;
  user_id: number;
}

/**
 * Score interface for matches
 */
export interface MatchScore {
  teamA: number;
  teamB: number;
}

/**
 * Match interface as returned by the matches API
 */
export interface Match {
  match_id: number;
  championship_id: number;
  teamA_id: number;
  teamB_id: number;
  date: string;
  stage: string;
  map: string;
  winner_team_id?: number;
  score?: MatchScore;
  status: 'scheduled' | 'live' | 'completed';
  // These will be populated by joining with teams data in the component
  teamA?: MatchTeam;
  teamB?: MatchTeam;
}

/**
 * Interface for bulk match updates
 */
export interface BulkMatchUpdate {
  matches: Array<{
    id: number;
    winner_team_id: number;
    score: MatchScore;
  }>;
}

// Create match service using only GET operations since API doesn't support CREATE/UPDATE/DELETE
export const matchService = createReactQueryService<Match>({
  entityName: 'Partida',
  endpoint: '/matches',
  idField: 'match_id',
});

export const {
  useGetAll: useGetAllMatches,
  useGetById: useGetMatchById,
} = matchService;

// Note: CREATE, UPDATE, DELETE are not available in the API according to the postman collection

/**
 * Hook for bulk updating multiple matches
 */
export const useBulkUpdateMatches = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, ApiError, BulkMatchUpdate>({
    mutationFn: (data: BulkMatchUpdate) => 
      apiClient.put<void>('/matches/bulk-update', data, { withAuth: true }),
    onSuccess: () => {
      // Invalidate matches queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Resultados das partidas atualizados com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar resultados: ${error.message}`);
    },
  });
};

/**
 * Hook for updating a single match result
 */
export const useUpdateMatchResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Match, ApiError, { 
    id: number; 
    winner_team_id: number; 
    score: MatchScore;
  }>({
    mutationFn: ({ id, winner_team_id, score }) => 
      apiClient.put<Match>(`/matches/${id}`, { 
        winner_team_id, 
        score 
      }, { withAuth: true }),
    onSuccess: (data) => {
      // Update the specific match in cache
      queryClient.setQueryData(['matches', data.match_id], data);
      // Invalidate all matches queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Resultado da partida atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar resultado: ${error.message}`);
    },
  });
};
