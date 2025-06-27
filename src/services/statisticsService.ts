import { apiClient } from '../lib/apiClient';
import {
  ParticipantStatistic,
  PlayerSummaryStatistic,
  TeamSummaryStatistic,
  ChampionshipStatistic,
  AgentStatistic,
  MapStatistic,
  ChampionshipOverview,
  ParticipantStatisticInput
} from '../types/statistics';
import { useQuery } from '@tanstack/react-query';

/**
 * Statistics service that aligns with the backend API endpoints for
 * participant statistics and championship statistics
 */
class StatisticsService {
  // ----------------------------------------------------
  // Participant Statistics Endpoints
  // ----------------------------------------------------

  /**
   * Get all participant statistics
   */
  async getAllParticipantStatistics(): Promise<ParticipantStatistic[]> {
    try {
      return await apiClient.get('/participant-stats');
    } catch (error) {
      console.warn('Error fetching all participant statistics:', error);
      return [];
    }
  }

  /**
   * Get participant statistic by ID
   */
  async getParticipantStatisticById(statisticId: number): Promise<ParticipantStatistic | null> {
    try {
      return await apiClient.get(`/participant-stats/${statisticId}`);
    } catch (error) {
      console.warn(`Error fetching participant statistic with ID ${statisticId}:`, error);
      return null;
    }
  }

  /**
   * Get statistics for a specific player
   */
  async getPlayerStatistics(playerId: number): Promise<ParticipantStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/player/${playerId}`);
    } catch (error) {
      console.warn(`Error fetching statistics for player ${playerId}:`, error);
      return [];
    }
  }

  /**
   * Get statistics for a specific match
   */
  async getMatchStatistics(matchId: number): Promise<ParticipantStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/match/${matchId}`);
    } catch (error) {
      console.warn(`Error fetching statistics for match ${matchId}:`, error);
      return [];
    }
  }

  /**
   * Get statistics for a team (list of participant stats)
   */
  async getTeamParticipantStats(teamId: number): Promise<ParticipantStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/team/${teamId}`);
    } catch (error) {
      console.warn(`Error fetching statistics for team ${teamId}:`, error);
      return [];
    }
  }

  /**
   * Get all player summary statistics
   */
  async getAllPlayersSummary(): Promise<PlayerSummaryStatistic[]> {
    try {
      return await apiClient.get('/participant-stats/all-players');
    } catch (error) {
      console.warn('Error fetching all player summary statistics:', error);
      return [];
    }
  }

  /**
   * Get summary statistics for all teams
   */
  async getAllTeamsSummary(): Promise<TeamSummaryStatistic[]> {
    try {
      return await apiClient.get('/participant-stats/all-teams');
    } catch (error) {
      console.warn('Error fetching all teams summary statistics:', error);
      return [];
    }
  }

  /**
   * Get team statistics by team ID
   */
  async getTeamStatistics(teamId: number): Promise<TeamSummaryStatistic | null> {
    try {
      const teams = await this.getAllTeamsSummary();
      const team = teams.find(t => t.team_id === teamId);
      return team || null;
    } catch (error) {
      console.warn(`Error fetching statistics for team ${teamId}:`, error);
      return null;
    }
  }

  /**
   * Get agent statistics for a player
   */
  async getPlayerAgentStatistics(playerId: number): Promise<AgentStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/player/${playerId}/agents`);
    } catch (error) {
      console.warn(`Error fetching agent statistics for player ${playerId}:`, error);
      return [];
    }
  }

  /**
   * Get map statistics for a player
   */
  async getPlayerMapStatistics(playerId: number): Promise<MapStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/player/${playerId}/maps`);
    } catch (error) {
      console.warn(`Error fetching map statistics for player ${playerId}:`, error);
      return [];
    }
  }

  /**
   * Get agent statistics for a team
   */
  async getTeamAgentStatistics(teamId: number): Promise<AgentStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/team/${teamId}/agents`);
    } catch (error) {
      console.warn(`Error fetching agent statistics for team ${teamId}:`, error);
      return [];
    }
  }

  /**
   * Get map statistics for a team
   */
  async getTeamMapStatistics(teamId: number): Promise<MapStatistic[]> {
    try {
      return await apiClient.get(`/participant-stats/team/${teamId}/maps`);
    } catch (error) {
      console.warn(`Error fetching map statistics for team ${teamId}:`, error);
      return [];
    }
  }

  async getTeamParticipantStatistics(teamId: number): Promise<ParticipantStatistic[]> {
    try {
      return await apiClient.get<ParticipantStatistic[]>(`/participant-stats/team/${teamId}`);
    } catch (error) {
      console.error(`Error fetching participant statistics for team ${teamId}:`, error);
      return [];
    }
  }

  async getTeamChampionshipHistory(teamId: number): Promise<any[]> { // Replace 'any' with a proper type
    try {
      return await apiClient.get<any[]>(`/championship-stats/team/${teamId}/history`);
    } catch (error) {
      console.warn(`Error fetching championship history for team ${teamId}:`, error);
      return [];
    }
  }

  // ----------------------------------------------------
  // Championship Statistics Endpoints
  // ----------------------------------------------------

  /**
   * Get championship overview
   */
  async getChampionshipOverview(championshipId: number): Promise<ChampionshipOverview> {
    try {
      return await apiClient.get(`/championship-stats/${championshipId}/overview`);
    } catch (error) {
      console.warn(`Error fetching overview for championship ${championshipId}:`, error);
      return {
        championship_id: championshipId,
        name: 'Campeonato não encontrado',
        status: 'unknown',
        teams_count: 0,
        matches_count: 0,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString()
      };
    }
  }

  /**
   * Get team statistics for a championship
   */
  async getChampionshipTeamStatistics(championshipId: number): Promise<any[]> {
    try {
      return await apiClient.get(`/championship-stats/${championshipId}/teams`);
    } catch (error) {
      console.warn(`Error fetching team statistics for championship ${championshipId}:`, error);
      return [];
    }
  }

  /**
   * Get player statistics for a championship
   */
  async getChampionshipPlayerStatistics(championshipId: number): Promise<any[]> {
    try {
      return await apiClient.get(`/championship-stats/${championshipId}/players`);
    } catch (error) {
      console.warn(`Error fetching player statistics for championship ${championshipId}:`, error);
      return [];
    }
  }

  /**
   * Get top players by championship
   */
  async getTopPlayersByChampionship(championshipId: number): Promise<ParticipantStatistic[]> {
    try {
      return await apiClient.get(`/championship-stats/${championshipId}/top-players`);
    } catch (error) {
      console.warn(`Error fetching top players for championship ${championshipId}:`, error);
      return [];
    }
  }

  async getTopPlayersByKDA(championshipId: number): Promise<PlayerSummaryStatistic[]> {
    try {
      return await apiClient.get<PlayerSummaryStatistic[]>(`/championship-stats/${championshipId}/top-players`);
    } catch (error) {
      console.error(`Error fetching top players for championship ${championshipId}:`, error);
      return [];
    }
  }

  // Mutations
  async createParticipantStatistic(data: ParticipantStatisticInput): Promise<ParticipantStatistic> {
    try {
      return await apiClient.post('/participant-stats', data);
    } catch (error) {
      console.error('Error creating participant statistic:', error);
      throw error;
    }
  }

  /**
   * Update participant statistic
   */
  async updateParticipantStatistic(statisticId: number, data: Partial<ParticipantStatisticInput>): Promise<ParticipantStatistic> {
    try {
      return await apiClient.put(`/participant-stats/${statisticId}`, data);
    } catch (error) {
      console.error(`Error updating participant statistic with ID ${statisticId}:`, error);
      throw error;
    }
  }

  /**
   * Delete participant statistic
   */
  async deleteParticipantStatistic(statisticId: number): Promise<void> {
    try {
      await apiClient.delete(`/participant-stats/${statisticId}`);
    } catch (error) {
      console.error(`Error deleting participant statistic with ID ${statisticId}:`, error);
      throw error;
    }
  }

  // ----------------------------------------------------
  // Championship Statistics Endpoints
  // ----------------------------------------------------

  /**
   * Create championship statistic
   */
  async createChampionshipStatistic(data: ChampionshipStatistic): Promise<ChampionshipStatistic> {
    try {
      return await apiClient.post('/championship-stats', data);
    } catch (error) {
      console.error('Error creating championship statistic:', error);
      throw error;
    }
  }

  /**
   * Get all championship statistics
   */
  async getAllChampionshipStatistics(): Promise<ChampionshipStatistic[]> {
    try {
      return await apiClient.get('/championship-stats');
    } catch (error) {
      console.warn('Error fetching all championship statistics:', error);
      return [];
    }
  }

  /**
   * Get championship statistic by ID
   */
  async getChampionshipStatisticById(statisticId: number): Promise<ChampionshipStatistic | null> {
    try {
      return await apiClient.get(`/championship-stats/${statisticId}`);
    } catch (error) {
      console.warn(`Error fetching championship statistic with ID ${statisticId}:`, error);
      return null;
    }
  }

  /**
   * Update championship statistic
   */
  async updateChampionshipStatistic(statisticId: number, data: Partial<ChampionshipStatistic>): Promise<ChampionshipStatistic> {
    try {
      return await apiClient.put(`/championship-stats/${statisticId}`, data);
    } catch (error) {
      console.error(`Error updating championship statistic with ID ${statisticId}:`, error);
      throw error;
    }
  }

  /**
   * Delete championship statistic
   */
  async deleteChampionshipStatistic(statisticId: number): Promise<void> {
    return apiClient.delete(`/championship-stats/${statisticId}`);
  }
}

/**
 * React Query hook to get match statistics
 */
export const useGetMatchStatistics = (matchId: number, enabled = true) => {
  return useQuery({
    queryKey: ['match-statistics', matchId],
    queryFn: () => statisticsService.getMatchStatistics(matchId),
    enabled: enabled && matchId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const statisticsService = new StatisticsService();
