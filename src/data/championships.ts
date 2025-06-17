import type { Championship } from '@/types/subscription';

export const championships: Championship[] = [
  {
    championship_id: 1,
    name: "Liga de Verão 2024",
    format: "double_elimination",
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    location: "São Paulo, SP",
    prize: 50000,
    status: "ongoing"
  },
  {
    championship_id: 2,
    name: "Copa Regional",
    format: "single_elimination", 
    start_date: "2023-11-01",
    end_date: "2023-12-15",
    location: "Rio de Janeiro, RJ",
    prize: 15000,
    status: "completed"
  },
  {
    championship_id: 3,
    name: "Torneio Universitário",
    format: "round_robin",
    start_date: "2024-04-01", 
    end_date: "2024-05-30",
    location: "Brasília, DF",
    prize: 20000,
    status: "upcoming"
  },
  {
    championship_id: 4,
    name: "Campeonato Nacional",
    format: "double_elimination",
    start_date: "2024-08-05",
    end_date: "2024-09-30",
    location: "Rio de Janeiro, RJ",
    prize: 10000,
    status: "upcoming"
  }
];
