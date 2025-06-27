/**
 * Utility functions for search result navigation
 */

export interface SearchNavigationData {
  subscriptionsData: Array<{ team_id: number; championship_id: number }>;
  matchesData: Array<{ match_id: number; championship_id: number }>;
}

/**
 * Find the championship ID for a team based on subscriptions
 */
export const findTeamChampionship = (teamId: number, subscriptionsData: SearchNavigationData['subscriptionsData']): number | null => {
  const subscription = subscriptionsData.find(sub => sub.team_id === teamId);
  return subscription ? subscription.championship_id : null;
};

/**
 * Find the championship ID for a match
 */
export const findMatchChampionship = (matchId: number, matchesData: SearchNavigationData['matchesData']): number | null => {
  const match = matchesData.find(m => m.match_id === matchId);
  return match ? match.championship_id : null;
};

/**
 * Get the correct public route for a search result
 */
export const getSearchResultRoute = (
  result: { id: number; type: string; metadata?: any },
  navigationData: SearchNavigationData
): string => {
  switch (result.type) {
    case 'championship':
      return `/campeonatos/${result.id}`;
      
    case 'team': {
      const championshipId = findTeamChampionship(result.id, navigationData.subscriptionsData);
      return championshipId 
        ? `/campeonatos/${championshipId}/equipes/${result.id}`
        : `/campeonatos`;
    }
    
    case 'player': {
      const playerTeamId = result.metadata?.teamId;
      if (playerTeamId) {
        const championshipId = findTeamChampionship(playerTeamId, navigationData.subscriptionsData);
        return championshipId 
          ? `/campeonatos/${championshipId}/equipes/${playerTeamId}`
          : `/campeonatos`;
      }
      return `/campeonatos`;
    }
    
    case 'match': {
      const championshipId = findMatchChampionship(result.id, navigationData.matchesData);
      return championshipId 
        ? `/campeonatos/${championshipId}/partidas/${result.id}`
        : `/campeonatos`;
    }
    
    default:
      return `/campeonatos`;
  }
};