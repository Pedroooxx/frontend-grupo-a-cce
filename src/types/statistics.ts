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
}

export interface AgentStat {
  nome: string;
  pickRate: number;
  winRate: number;
  kdaAverage: number;
}
