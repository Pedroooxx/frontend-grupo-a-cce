// Core entity types
export interface User {
  user_id: number;
  name: string;
  email: string;
  // password omitted for security
}

export interface Championship {
  championship_id: number;
  name: string;
  description: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  user_id: number;
}

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

export interface Match {
  match_id: number;
  championship_id: number;
  teamA_id: number;
  teamB_id: number;
  date: string;
  stage: string;
  winner_team_id?: number;
  score: Record<string, number>; // e.g., {"teamA": 13, "teamB": 8}
  map: string;
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

export interface Agent {
  agent_id: number;
  name: string;
}

export interface Subscription {
  subscription_id: number;
  championship_id: number;
  team_id: number;
  subscription_date: string;
  status: 'pending' | 'confirmed' | 'rejected';
  switching_code: number;
  score: number;
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

export interface ChampionshipStatistics {
  statistic_id: number;
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

// UI/Component specific types
export interface Player {
  nome: string;
  equipe: string;
  kda: string;
  kills: number;
  winRate: string;
}

export interface Team {
  nome: string;
  vitorias: number;
  derrotas: number;
  winRate: string;
  pontos: number;
}

export interface GeneralStat {
  label: string;
  valor: string;
  crescimento: string;
}

export interface MapData {
  nome: string;
  partidas: number;
  winRate: string;
  avgScore: string;
  imagePath?: string; // Optional path to map image
}

export interface AgentStat {
  nome: string;
  pickRate: number;
  winRate: number;
  kdaAverage: number;
}

// Detailed statistics types
export interface DetailedPlayerStats {
  participant_id: number;
  name: string;
  nickname: string;
  birth_date: string;
  phone: string;
  team_id: number;
  team_name: string;
  is_coach: boolean;
  user_id: number;
  // Aggregated statistics
  total_matches: number;
  total_kills: number;
  total_assists: number;
  total_deaths: number;
  total_spike_plants: number;
  total_spike_defuses: number;
  total_mvps: number;
  total_first_kills: number;
  kda_ratio: number;
  avg_score: number;
  win_rate: number;
  favorite_agent: string;
  favorite_map: string;
}

export interface DetailedTeamStats {
  team_id: number;
  name: string;
  user_id: number;
  manager_name: string;
  // Team aggregated statistics
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_kills: number;
  total_assists: number;
  total_deaths: number;
  team_kda: number;
  avg_match_score: number;
  championships_participated: number;
  championships_won: number;
  // Player count
  active_players: number;
  coaches: number;
  // Performance metrics
  avg_spike_plants: number;
  avg_spike_defuses: number;
  total_mvps: number;
  best_map: string;
  worst_map: string;
}

export interface DetailedChampionshipStats {
  championship_id: number;
  name: string;
  description: string;
  format: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  organizer_name: string;
  // Statistics
  total_teams: number;
  total_players: number;
  total_matches: number;
  matches_completed: number;
  total_kills: number;
  total_deaths: number;
  avg_match_duration: number;
  prize_pool?: string;
  // Performance metrics
  most_kills_player: string;
  most_mvps_player: string;
  best_team: string;
  most_popular_agent: string;
  most_played_map: string;
}

export interface ChampionshipParticipation {
  championship_id: number;
  championship_name: string;
  status: string;
  matches_played: number;
  placement?: number | null;
  matches_won?: number;
  matches_lost?: number;
  total_kills?: number;
  total_deaths?: number;
  prize_money?: number;
  start_date?: string;
  end_date?: string | null;
}

export interface AgentUsage {
  agent_name: string;
  matches_played: number;
  win_rate: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  kda_ratio: number;
}

export interface MapPerformance {
  map_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_score: number;
  total_kills: number;
  total_deaths: number;
}

export interface ChampionshipTeamRanking {
  rank: number;
  team_id: number;
  team_name: string;
  wins: number;
  losses: number;
  points: number;
  matches_played: number;
  win_rate: number;
}

export interface ChampionshipPlayerRanking {
  rank: number;
  participant_id: number;
  player_name: string;
  team_name: string;
  kills: number;
  deaths: number;
  assists: number;
  kda_ratio: number;
  mvps: number;
}

// Search and UI types
export interface SearchResult {
  id: number;
  name: string;
  type: 'player' | 'team' | 'championship';
  subtitle?: string;
  avatar?: string;
}

export interface SearchFilters {
  type: 'all' | 'player' | 'team';
  query: string;
}

// Complex query types
export interface MatchResult {
  match: Match;
  teamA_name: string;
  teamB_name: string;
  winner_name?: string;
  participant_stats: ParticipantStatistics[];
}

export interface LeaderboardEntry {
  participant_id: number;
  participant_name: string;
  team_name: string;
  metric_value: number;
  rank: number;
}

export interface TeamMatchHistory {
  match: Match;
  opponent_name: string;
  result: 'win' | 'loss';
  score_for: number;
  score_against: number;
  map: string;
}

// Additional interfaces for detailed inscriptions
export interface DetailedInscriptionStats {
  inscription_id: number;
  team_id: number;
  team_name: string;
  championship_id: number;
  championship_name: string;
  inscription_date: string; // "YYYY-MM-DD"
  status: "pending" | "confirmed" | "cancelled";
  coach_name: string;
  team_logo?: string;
}

// Performance metrics interfaces
export interface PerformanceMetrics {
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  kda_ratio: number;
}

export interface TeamPerformanceMetrics extends PerformanceMetrics {
  team_id: number;
  team_name: string;
  total_score: number;
  best_map: string;
  worst_map: string;
}

export interface PlayerPerformanceMetrics extends PerformanceMetrics {
  participant_id: number;
  player_name: string;
  team_name: string;
  favorite_agent: string;
  mvp_count: number;
  first_kills: number;
}