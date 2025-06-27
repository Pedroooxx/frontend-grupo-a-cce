/**
 * Player statistics service with React Query for team pages
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
import { PlayerSummaryStatistic } from '@/types/statistics';

/**
 * Hook to get summary statistics for all players
 */
export const useAllPlayersSummary = () => {
  return useQuery<PlayerSummaryStatistic[], ApiError>({
    queryKey: ['player-stats', 'all-summary'],
    queryFn: async () => {
      try {
        const data = await apiClient.get<PlayerSummaryStatistic[]>('/participant-stats/all-players', { withAuth: true });
        return data || [];
      } catch (error) {
        console.error('Error fetching all player summary statistics:', error);
        return [];
      }
    }
  });
};