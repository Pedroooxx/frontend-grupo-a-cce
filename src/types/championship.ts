export interface Championship {
  championship_id: number;
  name: string;
  description?: string;
  format: 'single_elimination' | 'double_elimination';
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'planned';
  prize: number | string;
  user_id?: number;
  teams_count?: number;
}

export interface ChampionshipFormValues {
  championship_id?: number;
  name: string;
  description?: string;
  format: 'single_elimination' | 'double_elimination';
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'planned';
  prize: number | string;
  user_id?: number;
}
