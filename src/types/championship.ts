import { z } from 'zod';

export const championshipStatisticSchema = z.object({
  kills: z.number().min(0, 'Kills must be a positive number'),
  deaths: z.number().min(0, 'Deaths must be a positive number'),
  assists: z.number().min(0, 'Assists must be a positive number'),
});

export type ChampionshipStatisticInput = z.infer<typeof championshipStatisticSchema>;

/**
 * Championship types based on backend API structure
 */

export interface Championship {
  championship_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  status: "Ativo" | "Planejado" | "Finalizado";
  prize?: string;
  format: "single-elimination" | "double-elimination";
  user_id?: number;
  teams_count?: number;
  matches_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChampionshipFormValues extends Omit<Championship, 'championship_id' | 'created_at' | 'updated_at'> {
  championship_id?: number;
}

// Type for championship data as received from the API (might have different format values)
export interface ChampionshipApiResponse {
  championship_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  status: string;
  prize?: string | number | null;
  format: string;
  user_id?: number;
  teams_count?: number;
  matches_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Championship deletion response from API
 */
export interface ChampionshipDeleteResponse {
  success: boolean;
  message?: string;
}

/**
 * Error response from championship API endpoints
 */
export interface ChampionshipErrorResponse {
  error: string;
  details?: string;
}

/**
 * Championship deletion validation result
 */
export interface ChampionshipDeletionValidation {
  canDelete: boolean;
  reason?: string;
  conflictingResources?: {
    teams?: number;
    matches?: number;
  };
}

/**
 * Enhanced error response with status code
 */
export interface EnhancedChampionshipErrorResponse extends ChampionshipErrorResponse {
  status?: number;
  response?: {
    status: number;
    data: {
      error: string;
    };
  };
}
