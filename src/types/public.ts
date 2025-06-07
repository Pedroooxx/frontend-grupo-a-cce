export interface PublicChampionship {
  championship_id: number;
  name: string;
  description: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  teams_count: number;
  matches_count: number;
  prize_pool?: string;
  banner_image?: string;
}

export interface PublicMatch {
  match_id: number;
  championship_id: number;
  teamA: {
    team_id: number;
    name: string;
    logo?: string;
  };
  teamB: {
    team_id: number;
    name: string;
    logo?: string;
  };
  date: string;
  stage: string;
  bracket: 'upper' | 'lower' | 'final' | 'group';
  map: string;
  status: 'scheduled' | 'live' | 'completed';
  score?: {
    teamA: number;
    teamB: number;
  };
  winner_team_id?: number;
}

export interface PublicTeam {
  team_id: number;
  name: string;
  manager_name: string;
  logo?: string;
  wins: number;
  losses: number;
  win_rate: number;
  participants_count: number;
  championships_participated: number;
  championships_won: number;
}

export interface PublicParticipant {
  participant_id: number;
  name: string;
  nickname: string;
  birth_date: string;
  team_id: number;
  team_name: string;
  is_coach: boolean;
  kda_ratio: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  win_rate: number;
  favorite_agent?: string;
  mvp_count: number;
  phone: string;
}

export interface ChampionshipStandings {
  team_id: number;
  team_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  points: number;
  round_diff: number;
  position: number;
}

export interface Agent {
  agent_id: number;
  name: string;
}

export interface ParticipantStatistics {
  statistic_id: number;
  match_id: number;
  participant_id: number;
  participant_name: string;
  participant_nickname: string;
  team_name: string;
  agent_name: string;
  kills: number;
  assists: number;
  deaths: number;
  spike_plants: number;
  spike_defuses: number;
  mvp: boolean;
  first_kills: number;
  total_score: number;
}