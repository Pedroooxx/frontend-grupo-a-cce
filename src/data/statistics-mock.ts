import { Player, Team, GeneralStat, MapData } from '@/types/statistics';

export const topJogadores: Player[] = [
  { nome: 'King1', equipe: 'Valorant Kings', kda: '1.45', kills: 245, winRate: '78%' },
  { nome: 'Phoenix1', equipe: 'Phoenix Squad', kda: '1.38', kills: 198, winRate: '75%' },
  { nome: 'Sage_Master', equipe: 'Valorant Kings', kda: '1.22', kills: 156, winRate: '72%' },
  { nome: 'Viper_Queen', equipe: 'Phoenix Squad', kda: '1.18', kills: 189, winRate: '70%' }
];

export const topEquipes: Team[] = [
  { nome: 'Valorant Kings', vitorias: 15, derrotas: 3, winRate: '83%', pontos: 45 },
  { nome: 'Phoenix Squad', vitorias: 12, derrotas: 6, winRate: '67%', pontos: 36 },
  { nome: 'Sage Warriors', vitorias: 8, derrotas: 10, winRate: '44%', pontos: 24 },
  { nome: 'Viper Elite', vitorias: 5, derrotas: 13, winRate: '28%', pontos: 15 }
];

export const estatisticasGerais: GeneralStat[] = [
  { label: 'Total de Kills', valor: '1,247', crescimento: '+12%' },
  { label: 'Partidas Jogadas', valor: '87', crescimento: '+8%' },
];

export const mapasData: MapData[] = [
  { nome: 'Haven', partidas: 28, winRate: '73%', avgScore: '13-9' },
  { nome: 'Bind', partidas: 22, winRate: '68%', avgScore: '13-11' },
  { nome: 'Ascent', partidas: 31, winRate: '65%', avgScore: '13-10' }
];

export const agentesData = ['Jett', 'Sage', 'Phoenix', 'Reyna', 'Viper'];
