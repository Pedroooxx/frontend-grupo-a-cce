'use client';

import { useMemo } from 'react';
import { useGetChampionshipMatches, useGetChampionshipTeamHistory } from '@/services/matchService';

interface TeamPageProps {
  championshipId: number;
}

export function TeamPage({ championshipId }: TeamPageProps) {
  // Fetch matches and team statistics for the team page
  const { data: matches = [], isLoading: isLoadingMatches } = useGetChampionshipMatches(championshipId);
  const { data: teamStatistics = {}, isLoading: isLoadingStatistics } = useGetChampionshipTeamHistory(championshipId);

  // Handle loading state
  if (isLoadingMatches || isLoadingStatistics) {
    return <div>Loading...</div>;
  }

  // Process matches and team statistics as needed
  const processedTeams = useMemo(() => {
    return Object.values(teamStatistics).map(team => ({
      ...team,
      matches: matches.filter(match => match.teamA_id === team.team_id || match.teamB_id === team.team_id),
    }));
  }, [teamStatistics, matches]);

  // Render the team page with processed data
  return (
    <div>
      <h1>Team Page</h1>
      {processedTeams.map(team => (
        <div key={team.team_id}>
          <h2>Team {team.team_id}</h2>
          <p>Wins: {team.wins}</p>
          <p>Losses: {team.losses}</p>
          <p>Matches: {team.matches.length}</p>
        </div>
      ))}
    </div>
  );
}