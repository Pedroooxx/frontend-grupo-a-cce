import type { Championship } from '@/types/subscription';

export const championships: Championship[] = [
  { 
    championship_id: 1, 
    name: "Liga de Verão 2024",
    format: "Eliminação simples",
    start_date: "2024-01-15",
    end_date: "2024-02-28",
    location: "Online",
    prize: 5000,
    status: "Em andamento"
  },
  { 
    championship_id: 2, 
    name: "Torneio Regional",
    format: "Grupos + Eliminação",
    start_date: "2024-03-10",
    end_date: "2024-04-20",
    location: "São Paulo, SP",
    prize: 3000,
    status: "Inscrições abertas" 
  },
  { 
    championship_id: 3, 
    name: "Copa Universitária",
    format: "Round Robin",
    start_date: "2024-05-01",
    end_date: "2024-06-15",
    location: "Online",
    prize: 2000,
    status: "Inscrições abertas" 
  },
  { 
    championship_id: 4, 
    name: "Campeonato Nacional",
    format: "Eliminação dupla",
    start_date: "2024-08-05",
    end_date: "2024-09-30",
    location: "Rio de Janeiro, RJ",
    prize: 10000,
    status: "Planejado" 
  },
];
