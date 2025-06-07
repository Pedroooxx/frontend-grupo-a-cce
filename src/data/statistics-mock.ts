import { Player, Team, GeneralStat, MapData, DetailedPlayerStats, DetailedTeamStats, ChampionshipParticipation, AgentUsage, MapPerformance, SearchResult } from '@/types/statistics';

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
  { nome: 'Ascent', partidas: 31, winRate: '65%', avgScore: '13-10' },
  { nome: 'Split', partidas: 25, winRate: '62%', avgScore: '13-8' },
  { nome: 'Icebox', partidas: 19, winRate: '54%', avgScore: '13-11' },
  { nome: 'Breeze', partidas: 17, winRate: '71%', avgScore: '13-7' },
  { nome: 'Fracture', partidas: 20, winRate: '48%', avgScore: '13-10' },
  { nome: 'Pearl', partidas: 24, winRate: '58%', avgScore: '13-9' },
  { nome: 'Lotus', partidas: 15, winRate: '67%', avgScore: '13-10' },
  { nome: 'Sunset', partidas: 12, winRate: '75%', avgScore: '13-6' },
  { nome: 'District', partidas: 8, winRate: '63%', avgScore: '13-12' },
  { nome: 'Kasbah', partidas: 6, winRate: '50%', avgScore: '13-11' },
  { nome: 'Drift', partidas: 5, winRate: '60%', avgScore: '13-9' }
];

export const agentesData = ['Jett', 'Sage', 'Phoenix', 'Reyna', 'Viper'];

export const detailedPlayersStats: DetailedPlayerStats[] = [
  {
    participant_id: 1,
    name: "João Silva",
    nickname: "King1",
    team_name: "Valorant Kings",
    birth_date: "1998-05-15",
    phone: "11999887766",
    is_coach: false,
    total_matches: 45,
    total_kills: 1247,
    total_assists: 678,
    total_deaths: 890,
    total_spike_plants: 89,
    total_spike_defuses: 34,
    total_mvps: 12,
    total_first_kills: 156,
    kda_ratio: 2.16,
    avg_score: 245.8,
    win_rate: 0.78,
    favorite_agent: "Jett",
    favorite_map: "Haven",
    team_id: 0,
    user_id: 0
  },
  {
    participant_id: 2,
    name: "Maria Santos",
    nickname: "Phoenix1",
    team_name: "Phoenix Squad",
    birth_date: "1999-03-22",
    phone: "11988776655",
    is_coach: false,
    total_matches: 42,
    total_kills: 1089,
    total_assists: 592,
    total_deaths: 756,
    total_spike_plants: 67,
    total_spike_defuses: 28,
    total_mvps: 9,
    total_first_kills: 134,
    kda_ratio: 2.22,
    avg_score: 198.5,
    win_rate: 0.75,
    favorite_agent: "Reyna",
    favorite_map: "Bind",
    team_id: 0,
    user_id: 0
  }
];

export const detailedTeamsStats: DetailedTeamStats[] = [
  {
    team_id: 1,
    name: "Valorant Kings",
    manager_name: "Carlos Silva",
    total_matches: 48,
    wins: 36,
    losses: 12,
    win_rate: 0.75,
    total_kills: 3456,
    total_assists: 2134,
    total_deaths: 2890,
    team_kda: 1.93,
    avg_match_score: 278.5,
    championships_participated: 8,
    championships_won: 3,
    active_players: 7,
    coaches: 2,
    avg_spike_plants: 12.5,
    avg_spike_defuses: 8.3,
    total_mvps: 28,
    best_map: "Haven",
    worst_map: "Icebox",
    user_id: 0
  },
  {
    team_id: 2,
    name: "Phoenix Squad",
    manager_name: "Ana Costa",
    total_matches: 45,
    wins: 31,
    losses: 14,
    win_rate: 0.69,
    total_kills: 3245,
    total_assists: 1987,
    total_deaths: 2756,
    team_kda: 1.90,
    avg_match_score: 265.8,
    championships_participated: 7,
    championships_won: 2,
    active_players: 6,
    coaches: 1,
    avg_spike_plants: 11.2,
    avg_spike_defuses: 7.8,
    total_mvps: 22,
    best_map: "Ascent",
    worst_map: "Fracture",
    user_id: 0
  }
];

export const championshipParticipations: ChampionshipParticipation[] = [
  {
    championship_id: 1,
    championship_name: "Liga de Verão 2024",
    status: "Em andamento",
    placement: 2,
    matches_played: 12,
    score: 89
  },
  {
    championship_id: 2,
    championship_name: "Copa Regional",
    status: "Finalizado",
    placement: 1,
    matches_played: 8,
    score: 124
  }
];

export const agentUsageStats: AgentUsage[] = [
  {
    agent_name: "Jett",
    matches_played: 18,
    win_rate: 0.78,
    avg_kills: 22.5,
    avg_deaths: 15.2,
    avg_assists: 8.9,
    kda_ratio: 2.07
  },
  {
    agent_name: "Reyna",
    matches_played: 15,
    win_rate: 0.73,
    avg_kills: 24.1,
    avg_deaths: 16.8,
    avg_assists: 6.2,
    kda_ratio: 1.81
  }
];

export const mapPerformanceStats: MapPerformance[] = [
  {
    map_name: "Haven",
    matches_played: 8,
    wins: 6,
    losses: 2,
    win_rate: 0.75,
    avg_score: 13.2,
    total_kills: 189,
    total_deaths: 156
  },
  {
    map_name: "Bind",
    matches_played: 7,
    wins: 5,
    losses: 2,
    win_rate: 0.71,
    avg_score: 12.8,
    total_kills: 167,
    total_deaths: 143
  }
];

export const searchPlayers = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const playerResults = detailedPlayersStats
    .filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.nickname.toLowerCase().includes(query.toLowerCase()) ||
      player.team_name.toLowerCase().includes(query.toLowerCase())
    )
    .map(player => ({
      id: player.participant_id,
      name: player.nickname,
      type: 'player' as const,
      subtitle: `${player.name} - ${player.team_name}`
    }));

  return playerResults;
};

export const searchTeams = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const teamResults = detailedTeamsStats
    .filter(team => 
      team.name.toLowerCase().includes(query.toLowerCase()) ||
      team.manager_name.toLowerCase().includes(query.toLowerCase())
    )
    .map(team => ({
      id: team.team_id,
      name: team.name,
      type: 'team' as const,
      subtitle: `Gerenciado por ${team.manager_name} - ${team.active_players} jogadores`
    }));

  return teamResults;
};

export const searchAll = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const players = searchPlayers(query);
  const teams = searchTeams(query);
  
  return [...teams, ...players].slice(0, 8); // Limit to 8 results
};
