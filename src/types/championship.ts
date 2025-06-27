import { z } from 'zod';

export const championshipStatisticSchema = z.object({
  kills: z.number().min(0, 'Kills must be a positive number'),
  deaths: z.number().min(0, 'Deaths must be a positive number'),
  assists: z.number().min(0, 'Assists must be a positive number'),
});

export type ChampionshipStatisticInput = z.infer<typeof championshipStatisticSchema>;

export interface Championship {
  championship_id: number;
  name: string;
  description?: string;
  format: "single-elimination" | "double-elimination";
  start_date: string;
  end_date: string;
  location: string;
  status: "Ativo" | "Planejado" | "Finalizado";
  prize: string;
  user_id?: number;
  teams_count?: number;
  matches_count: number;
}

export interface ChampionshipFormValues {
  championship_id?: number;
  name: string;
  description?: string;
  format: "single-elimination" | "double-elimination";
  start_date: string;
  end_date: string;
  location: string;
  status: "Ativo" | "Planejado" | "Finalizado";
  prize: number | string | null;
  user_id?: number;
}

// Type for championship data as received from the API (might have different format values)
export interface ChampionshipApiResponse {
  championship_id: number;
  name: string;
  description?: string;
  format: "single-elimination" | "double-elimination";
  start_date: string;
  end_date: string;
  location: string;
  status: "Ativo" | "Planejado" | "Finalizado" ;
  prize: number | string | null;
  user_id?: number;
  teams_count: number;
  matches_count: number;
}
