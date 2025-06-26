/**
 * Match service with React Query
 */
import { apiClient, ApiError } from '@/lib/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createReactQueryService } from './reactQueryService';

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
  status: string;
  map: string;
  winner_team_id?: number;
  score?: MatchScore;
  TeamA: MatchTeam;
  TeamB: MatchTeam;
}

interface MatchResponse {
  success: boolean;
  data: Match[];
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

// Override the useGetById to handle the API response structure
export const useGetMatchById = (id: string | number, enabled = true) => {
  return useQuery<Match, ApiError>({
    queryKey: ['matches', id],
    queryFn: async () => {
      const response = await apiClient.get<{success: boolean, data: Match}>(`/matches/${id}`, { withAuth: true });
      return response.data; // Extract the data field from the response
    },
    enabled: enabled && !!id,
  });
};


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

/**
 * Interface for team statistics based on match results
 */
export interface TeamStatistics {
  team_id: number;
  wins: number;
  losses: number;
  total_matches: number;
  win_rate: number;
}

/**
 * Hook to get match statistics for teams in a specific championship
 */
export const useGetChampionshipTeamHistory = (championshipId: number | string, enabled = true) => {
  return useQuery<Record<number, TeamStatistics>, ApiError>({
    queryKey: ['matches', 'championship', championshipId, 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get<MatchResponse>(`/matches?championship_id=${championshipId}`, { withAuth: true });
      const matches = response.data;
      
      // Calculate statistics for each team
      const teamStats: Record<number, TeamStatistics> = {};
      
      matches.forEach(match => {
        // Only count finished matches for statistics
        if (match.status === 'Finalizada' && match.winner_team_id) {
          // Initialize team A stats if not exists
          if (!teamStats[match.teamA_id]) {
            teamStats[match.teamA_id] = {
              team_id: match.teamA_id,
              wins: 0,
              losses: 0,
              total_matches: 0,
              win_rate: 0
            };
          }
          
          // Initialize team B stats if not exists
          if (!teamStats[match.teamB_id]) {
            teamStats[match.teamB_id] = {
              team_id: match.teamB_id,
              wins: 0,
              losses: 0,
              total_matches: 0,
              win_rate: 0
            };
          }
          
          // Update match counts
          teamStats[match.teamA_id].total_matches++;
          teamStats[match.teamB_id].total_matches++;
          
          // Update wins/losses based on winner
          if (match.winner_team_id === match.teamA_id) {
            teamStats[match.teamA_id].wins++;
            teamStats[match.teamB_id].losses++;
          } else if (match.winner_team_id === match.teamB_id) {
            teamStats[match.teamB_id].wins++;
            teamStats[match.teamA_id].losses++;
          }
          
          // Calculate win rates
          teamStats[match.teamA_id].win_rate = 
            teamStats[match.teamA_id].total_matches > 0 
              ? teamStats[match.teamA_id].wins / teamStats[match.teamA_id].total_matches 
              : 0;
              
          teamStats[match.teamB_id].win_rate = 
            teamStats[match.teamB_id].total_matches > 0 
              ? teamStats[match.teamB_id].wins / teamStats[match.teamB_id].total_matches 
              : 0;
        }
      });
      
      return teamStats;
    },
    enabled: enabled && !!championshipId,
  });
};
