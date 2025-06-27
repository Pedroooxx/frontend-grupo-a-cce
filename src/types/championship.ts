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
  format: "simple" | "double" | "single-elimination" | "double-elimination";
  start_date: string;
  end_date: string;
  location: string;
  status: "Ativo" | "Planejado" | "Finalizado" | "ativo" | "planejado" | "finalizado";
  prize: number | string | null;
  user_id?: number;
  teams_count: number;
  matches_count: number;
}
