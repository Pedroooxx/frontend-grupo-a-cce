import { z } from 'zod';

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

export const participantStatisticSchema = z.object({
  participant_id: z.number().positive('Participant ID must be a positive number'),
  match_id: z.number().positive('Match ID must be a positive number'),
  agent_id: z.number().positive('Agent ID must be a positive number'),
  kills: z.number().nonnegative('Kills must be a non-negative number'),
  assists: z.number().nonnegative('Assists must be a non-negative number'),
  deaths: z.number().nonnegative('Deaths must be a non-negative number'),
  spike_plants: z.number().nonnegative('Spike plants must be a non-negative number').optional(),
  spike_defuses: z.number().nonnegative('Spike defuses must be a non-negative number').optional(),
  MVPs: z.number().nonnegative('MVPs must be a non-negative number').optional(),
  first_kills: z.number().nonnegative('First kills must be a non-negative number').optional(),
});

export const ChampionshipStatisticSchema = z.object({
  championship_id: z.number().min(1, 'Championship ID é obrigatório'),
  participant_id: z.number().min(1, 'Participant ID é obrigatório'),
  team_id: z.number().min(1, 'Team ID é obrigatório'),
  kills: z.number().min(0, 'Kills não pode ser negativo'),
  assists: z.number().min(0, 'Assists não pode ser negativo'),
  deaths: z.number().min(0, 'Deaths não pode ser negativo'),
  spike_plants: z.number().min(0, 'Spike Plants não pode ser negativo'),
  spike_defuses: z.number().min(0, 'Spike Defuses não pode ser negativo'),
  MVPs: z.number().min(0, 'MVPs não pode ser negativo'),
  first_kills: z.number().min(0, 'First Kills não pode ser negativo'),
});

export type ChampionshipStatisticInput = z.infer<typeof ChampionshipStatisticSchema>;
