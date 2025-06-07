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
  name: string;
  nickname: string;
  team_name: string;
  birth_date: string;
  phone: string;
  is_coach: boolean;
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
  placement: number;
  matches_played: number;
  score: number;
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
