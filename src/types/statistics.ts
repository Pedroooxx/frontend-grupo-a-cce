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

export interface DetailedPlayerStats {
  participant_id: number;
  user_id: number;
  name: string;
  nickname: string;
  birth_date: string;
  phone: string;
  team_id: number;
  team_name: string;
  is_coach: boolean;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  kda_ratio: number;
  win_rate: number;
  total_matches: number;
  total_spike_plants: number;
  total_spike_defuses: number;
  total_mvps: number;
  total_first_kills: number;
  avg_score: number;
  favorite_agent: string;
  favorite_map: string;
}

export interface DetailedTeamStats {
  team_id: number;
  name: string;
  user_id: number; // Add user reference for team manager
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

export interface ChampionshipParticipation {
  championship_id: number;
  championship_name: string;
  status: string;
  matches_played: number;
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

// Add missing core entity types
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
  agent_id: number;
  kills: number;
  assists: number;
  deaths: number;
  spike_plants: number;
  spike_defuses: number;
  MVP: boolean;
  first_kill: number;
  total_score: number;
}

export interface Agent {
  agent_id: number;
  name: string;
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

// Update existing types to match ERD
export interface DetailedPlayerStats {
  participant_id: number;
  user_id: number;
  name: string;
  nickname: string;
  birth_date: string;
  phone: string;
  team_id: number;
  team_name: string;
  is_coach: boolean;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  kda_ratio: number;
  win_rate: number;
  total_matches: number;
  total_spike_plants: number;
  total_spike_defuses: number;
  total_mvps: number;
  total_first_kills: number;
  avg_score: number;
  favorite_agent: string;
  favorite_map: string;
}

export interface DetailedTeamStats {
  team_id: number;
  name: string;
  user_id: number; // Add user reference for team manager
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

// Add types for complex queries that need backend support
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
