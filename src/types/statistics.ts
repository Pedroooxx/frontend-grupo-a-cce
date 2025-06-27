export interface ParticipantStatistic {
  statistic_id: number;
  participant_id: number;
  match_id: number;
  team_id: number;
  agent_id: number;
  kills: number;
  assists: number;
  deaths: number;
  spike_plants?: number;
  spike_defuses?: number;
  MVP?: number;
  kda: number;
  average_combat_score: number;
  total_score: number;
}

export interface PlayerSummaryStatistic {
  participant_id: number;
  name: string;
  nickname: string;
  team_id: number;
  team_name: string;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  total_matches: number;
  mvp_count: number;
  kda_ratio: number | string;
  wins: number;
  losses: number;
  win_rate: number;
  birth_date?: string;
}

export interface TeamSummaryStatistic {
  team_id: number;
  team_name: string;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  mvp_count: number;
  avg_match_score: number;
}

export interface ChampionshipStatistic {
  championship_id: number;
  participant_id: number;
  team_id: number;
  kills: number;
  assists: number;
  deaths: number;
  spike_plants: number;
  spike_defuses: number;
  MVPs: number;
  first_kills: number;
}

export interface AgentStatistic {
  agent_id: number;
  agent_name?: string;
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  kda_ratio: number;
}

export interface MapStatistic {
  map_id: number;
  map_name: string;
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  avg_score: number;
}

export interface ChampionshipOverview {
  championship_id?: number;
  name: string;
  start_date?: string;
  end_date?: string;
  status: string;
  total_teams?: number;
  teams_count?: number; // Some endpoints might use this instead of total_teams
  total_matches?: number;
  matches_count?: number; // Some endpoints might use this instead of total_matches
  total_participants?: number;
  highest_kills?: number;
  highest_kda?: number;
}

export interface ParticipantStatisticInput {
  participant_id: number;
  match_id: number;
  agent_id: number;
  kills: number;
  assists: number;
  deaths: number;
  spike_plants?: number;
  spike_defuses?: number;
  MVPs?: number;
  first_kills?: number;
}
