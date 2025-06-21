export interface Championship {
  championship_id: number;
  name: string;
  description?: string;
  format: "simple" | "double";
  start_date: string;
  end_date: string;
  location: string;
  status: "ATIVO" | "PLANEJADO" | "FINALIZADO";
  prize: number | string;
  user_id?: number;
  teams_count: number;
  matches_count: number;
}

export interface ChampionshipFormValues {
  championship_id?: number;
  name: string;
  description?: string;
  format: "simple" | "double";
  start_date: string;
  end_date: string;
  location: string;
  status: "ATIVO" | "PLANEJADO" | "FINALIZADO";
  prize: number | string;
  user_id?: number;
}
