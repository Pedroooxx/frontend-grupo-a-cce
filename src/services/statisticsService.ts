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
    return apiClient.get('/statistics/participants');
  }

  /**
   * Get participant statistic by ID
   */
  async getParticipantStatisticById(statisticId: number): Promise<ParticipantStatistic> {
    return apiClient.get(`/statistics/participants/${statisticId}`);
  }

  /**
   * Get statistics for a specific player
   */
  async getPlayerStatistics(playerId: number): Promise<ParticipantStatistic[]> {
    return apiClient.get(`/statistics/participants/player/${playerId}`);
  }

  /**
   * Get statistics for a specific match
   */
  async getMatchStatistics(matchId: number): Promise<ParticipantStatistic[]> {
    return apiClient.get(`/statistics/participants/match/${matchId}`);
  }

  /**
   * Get top players by championship
   */
  async getTopPlayersByChampionship(championshipId: number): Promise<ParticipantStatistic[]> {
    return apiClient.get(`/statistics/participants/championship/${championshipId}/top-players`);
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(teamId: number): Promise<TeamSummaryStatistic> {
    return apiClient.get(`/statistics/teams/${teamId}`);
  }

  /**
   * Get all player summary statistics
   */
  async getAllPlayersSummary(): Promise<PlayerSummaryStatistic[]> {
    return apiClient.get('/participant-stats/all-players');
  }

  /**
   * Get summary statistics for all teams
   */
  async getAllTeamsSummary(): Promise<TeamSummaryStatistic[]> {
    return apiClient.get('/participant-stats/all-teams');
  }

  /**
   * Get agent statistics for a player
   */
  async getPlayerAgentStatistics(playerId: number): Promise<AgentStatistic[]> {
    return apiClient.get(`/participant-stats/player/${playerId}/agents`);
  }

  /**
   * Get map statistics for a player
   */
  async getPlayerMapStatistics(playerId: number): Promise<MapStatistic[]> {
    return apiClient.get(`/participant-stats/player/${playerId}/maps`);
  }

  /**
   * Get agent statistics for a team
   */
  async getTeamAgentStatistics(teamId: number): Promise<AgentStatistic[]> {
    return apiClient.get(`/participant-stats/team/${teamId}/agents`);
  }

  /**
   * Get map statistics for a team
   */
  async getTeamMapStatistics(teamId: number): Promise<MapStatistic[]> {
    return apiClient.get(`/participant-stats/team/${teamId}/maps`);
  }

  /**
   * Get championship history for a team
   */
  async getTeamChampionshipHistory(teamId: number): Promise<any[]> {
    return apiClient.get(`/participant-stats/team/${teamId}/championships`);
  }

  /**
   * Create new participant statistic
   */
  async createParticipantStatistic(data: ParticipantStatisticInput): Promise<ParticipantStatistic> {
    return apiClient.post('/participant-stats', data);
  }

  /**
   * Update participant statistic
   */
  async updateParticipantStatistic(statisticId: number, data: Partial<ParticipantStatisticInput>): Promise<ParticipantStatistic> {
    return apiClient.put(`/participant-stats/${statisticId}`, data);
  }

  /**
   * Delete participant statistic
   */
  async deleteParticipantStatistic(statisticId: number): Promise<void> {
    return apiClient.delete(`/participant-stats/${statisticId}`);
  }

  // ----------------------------------------------------
  // Championship Statistics Endpoints
  // ----------------------------------------------------

  /**
   * Get championship overview
   */
  async getChampionshipOverview(championshipId: number): Promise<ChampionshipOverview> {
    return apiClient.get(`/championship-stats/overview/${championshipId}`);
  }

  /**
   * Get team statistics for a championship
   */
  async getChampionshipTeamStatistics(championshipId: number): Promise<any[]> {
    return apiClient.get(`/championship-stats/overview/${championshipId}/teams`);
  }

  /**
   * Get player statistics for a championship
   */
  async getChampionshipPlayerStatistics(championshipId: number): Promise<any[]> {
    return apiClient.get(`/championship-stats/overview/${championshipId}/players`);
  }

  /**
   * Get player's championship statistics
   */
  async getPlayerChampionshipStatistics(playerId: number): Promise<any> {
    return apiClient.get(`/championship-stats/player/${playerId}`);
  }

  /**
   * Create championship statistic
   */
  async createChampionshipStatistic(data: ChampionshipStatistic): Promise<ChampionshipStatistic> {
    return apiClient.post('/championship-stats', data);
  }

  /**
   * Get all championship statistics
   */
  async getAllChampionshipStatistics(): Promise<ChampionshipStatistic[]> {
    return apiClient.get('/championship-stats');
  }

  /**
   * Get championship statistic by ID
   */
  async getChampionshipStatisticById(statisticId: number): Promise<ChampionshipStatistic> {
    return apiClient.get(`/championship-stats/${statisticId}`);
  }

  /**
   * Update championship statistic
   */
  async updateChampionshipStatistic(statisticId: number, data: Partial<ChampionshipStatistic>): Promise<ChampionshipStatistic> {
    return apiClient.put(`/championship-stats/${statisticId}`, data);
  }

  /**
   * Delete championship statistic
   */
  async deleteChampionshipStatistic(statisticId: number): Promise<void> {
    return apiClient.delete(`/championship-stats/${statisticId}`);
  }
}

export const statisticsService = new StatisticsService();
