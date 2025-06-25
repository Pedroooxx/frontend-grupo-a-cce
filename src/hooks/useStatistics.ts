import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statisticsService } from '@/services';
import { 
  PlayerSummaryStatistic,
  TeamSummaryStatistic,
  ParticipantStatistic,
  ParticipantStatisticInput,
  ChampionshipStatistic,
  AgentStatistic,
  MapStatistic,
  ChampionshipOverview
} from '@/types/statistics';

// Query Keys
export const STATS_QUERY_KEYS = {
  ALL_PLAYERS: ['all-players-stats'],
  ALL_TEAMS: ['all-teams-stats'],
  PLAYER: (id: number) => ['player-stats', id],
  TEAM: (id: number) => ['team-stats', id],
  MATCH: (id: number) => ['match-stats', id],
  CHAMPIONSHIP: (id: number) => ['championship-stats', id],
  PLAYER_AGENTS: (id: number) => ['player-agents-stats', id],
  PLAYER_MAPS: (id: number) => ['player-maps-stats', id],
  TEAM_AGENTS: (id: number) => ['team-agents-stats', id],
  TEAM_MAPS: (id: number) => ['team-maps-stats', id],
  TEAM_CHAMPIONSHIPS: (id: number) => ['team-championships-stats', id],
  TOP_PLAYERS: (championshipId: number) => ['top-players', championshipId],
  CHAMPIONSHIP_OVERVIEW: (id: number) => ['championship-overview', id],
  CHAMPIONSHIP_TEAMS: (id: number) => ['championship-teams', id],
  CHAMPIONSHIP_PLAYERS: (id: number) => ['championship-players', id],
};

// Player Statistics Hooks
export const useAllPlayersSummary = () => {
  return useQuery<PlayerSummaryStatistic[]>({
    queryKey: STATS_QUERY_KEYS.ALL_PLAYERS,
    queryFn: () => statisticsService.getAllPlayersSummary()
  });
};

export const usePlayerStatistics = (playerId: number) => {
  return useQuery<ParticipantStatistic[]>({
    queryKey: STATS_QUERY_KEYS.PLAYER(playerId),
    queryFn: () => statisticsService.getPlayerStatistics(playerId),
    enabled: !!playerId
  });
};

export const usePlayerAgentStatistics = (playerId: number) => {
  return useQuery<AgentStatistic[]>({
    queryKey: STATS_QUERY_KEYS.PLAYER_AGENTS(playerId),
    queryFn: () => statisticsService.getPlayerAgentStatistics(playerId),
    enabled: !!playerId
  });
};

export const usePlayerMapStatistics = (playerId: number) => {
  return useQuery<MapStatistic[]>({
    queryKey: STATS_QUERY_KEYS.PLAYER_MAPS(playerId),
    queryFn: () => statisticsService.getPlayerMapStatistics(playerId),
    enabled: !!playerId
  });
};

// Team Statistics Hooks
export const useAllTeamsSummary = () => {
  return useQuery<TeamSummaryStatistic[]>({
    queryKey: STATS_QUERY_KEYS.ALL_TEAMS,
    queryFn: () => statisticsService.getAllTeamsSummary()
  });
};

export const useTeamStatistics = (teamId: number) => {
  return useQuery<ParticipantStatistic[]>({
    queryKey: STATS_QUERY_KEYS.TEAM(teamId),
    queryFn: () => statisticsService.getTeamStatistics(teamId),
    enabled: !!teamId
  });
};

export const useTeamAgentStatistics = (teamId: number) => {
  return useQuery<AgentStatistic[]>({
    queryKey: STATS_QUERY_KEYS.TEAM_AGENTS(teamId),
    queryFn: () => statisticsService.getTeamAgentStatistics(teamId),
    enabled: !!teamId
  });
};

export const useTeamMapStatistics = (teamId: number) => {
  return useQuery<MapStatistic[]>({
    queryKey: STATS_QUERY_KEYS.TEAM_MAPS(teamId),
    queryFn: () => statisticsService.getTeamMapStatistics(teamId),
    enabled: !!teamId
  });
};

export const useTeamChampionshipHistory = (teamId: number) => {
  return useQuery({
    queryKey: STATS_QUERY_KEYS.TEAM_CHAMPIONSHIPS(teamId),
    queryFn: () => statisticsService.getTeamChampionshipHistory(teamId),
    enabled: !!teamId
  });
};

// Match Statistics Hooks
export const useMatchStatistics = (matchId: number) => {
  return useQuery<ParticipantStatistic[]>({
    queryKey: STATS_QUERY_KEYS.MATCH(matchId),
    queryFn: () => statisticsService.getMatchStatistics(matchId),
    enabled: !!matchId
  });
};

// Championship Statistics Hooks
export const useChampionshipOverview = (championshipId: number) => {
  return useQuery<ChampionshipOverview>({
    queryKey: STATS_QUERY_KEYS.CHAMPIONSHIP_OVERVIEW(championshipId),
    queryFn: () => statisticsService.getChampionshipOverview(championshipId),
    enabled: !!championshipId
  });
};

export const useChampionshipTeamStatistics = (championshipId: number) => {
  return useQuery({
    queryKey: STATS_QUERY_KEYS.CHAMPIONSHIP_TEAMS(championshipId),
    queryFn: () => statisticsService.getChampionshipTeamStatistics(championshipId),
    enabled: !!championshipId
  });
};

export const useChampionshipPlayerStatistics = (championshipId: number) => {
  return useQuery({
    queryKey: STATS_QUERY_KEYS.CHAMPIONSHIP_PLAYERS(championshipId),
    queryFn: () => statisticsService.getChampionshipPlayerStatistics(championshipId),
    enabled: !!championshipId
  });
};

export const useTopPlayersByChampionship = (championshipId: number) => {
  return useQuery<ParticipantStatistic[]>({
    queryKey: STATS_QUERY_KEYS.TOP_PLAYERS(championshipId),
    queryFn: () => statisticsService.getTopPlayersByChampionship(championshipId),
    enabled: !!championshipId
  });
};

// Mutation Hooks
export const useCreateParticipantStatistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ParticipantStatisticInput) => 
      statisticsService.createParticipantStatistic(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEYS.ALL_PLAYERS });
    }
  });
};

export const useUpdateParticipantStatistic = (statisticId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<ParticipantStatisticInput>) => 
      statisticsService.updateParticipantStatistic(statisticId, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEYS.ALL_PLAYERS });
    }
  });
};

export const useDeleteParticipantStatistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (statisticId: number) => 
      statisticsService.deleteParticipantStatistic(statisticId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEYS.ALL_PLAYERS });
    }
  });
};

export const useCreateChampionshipStatistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ChampionshipStatistic) => 
      statisticsService.createChampionshipStatistic(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEYS.ALL_PLAYERS });
    }
  });
};
