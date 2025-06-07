import { PublicChampionship, PublicMatch, PublicTeam, ChampionshipStandings, PublicParticipant, Agent, ParticipantStatistics } from '@/types/public';

// Mock data for public championships
export const publicChampionships: PublicChampionship[] = [
  {
    championship_id: 1,
    name: "Liga de Verão 2024",
    description: "Campeonato principal da temporada com as melhores equipes do cenário nacional. Formato eliminação dupla com premiação de R$ 50.000.",
    format: "double_elimination",
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    location: "São Paulo, SP",
    status: "ongoing",
    teams_count: 32,
    matches_count: 89,
    prize_pool: "R$ 50.000",
    banner_image: "/images/championships/liga-verao-2024.jpg"
  },
  {
    championship_id: 2,
    name: "Copa Regional",
    description: "Torneio regional focado em equipes emergentes e desenvolvimento de novos talentos.",
    format: "single_elimination",
    start_date: "2023-11-01",
    end_date: "2023-12-15",
    location: "Rio de Janeiro, RJ",
    status: "completed",
    teams_count: 16,
    matches_count: 31,
    prize_pool: "R$ 15.000"
  },
  {
    championship_id: 3,
    name: "Torneio Universitário",
    description: "Competição exclusiva para equipes universitárias de todo o Brasil.",
    format: "round_robin",
    start_date: "2024-04-01",
    end_date: "2024-05-30",
    location: "Brasília, DF",
    status: "upcoming",
    teams_count: 24,
    matches_count: 0,
    prize_pool: "R$ 20.000"
  }
];

export const publicMatches: PublicMatch[] = [
  {
    match_id: 1,
    championship_id: 1,
    teamA: { team_id: 1, name: "Valorant Kings" },
    teamB: { team_id: 2, name: "Phoenix Squad" },
    date: "2024-02-15T19:00:00Z",
    stage: "Semifinal",
    bracket: "upper",
    map: "Haven",
    status: "completed",
    score: { teamA: 13, teamB: 11 },
    winner_team_id: 1
  },
  {
    match_id: 2,
    championship_id: 1,
    teamA: { team_id: 3, name: "Sage Warriors" },
    teamB: { team_id: 4, name: "Viper Elite" },
    date: "2024-02-16T20:00:00Z",
    stage: "Semifinal",
    bracket: "upper",
    map: "Bind",
    status: "live",
    score: { teamA: 8, teamB: 6 }
  },
  {
    match_id: 3,
    championship_id: 1,
    teamA: { team_id: 1, name: "Valorant Kings" },
    teamB: { team_id: 3, name: "Sage Warriors" },
    date: "2024-02-18T19:00:00Z",
    stage: "Final",
    bracket: "final",
    map: "Ascent",
    status: "scheduled"
  },
  {
    match_id: 4,
    championship_id: 2,
    teamA: { team_id: 5, name: "Thunder Bolts" },
    teamB: { team_id: 6, name: "Ice Storm" },
    date: "2023-12-01T18:00:00Z",
    stage: "Final",
    bracket: "final",
    map: "Split",
    status: "completed",
    score: { teamA: 13, teamB: 8 },
    winner_team_id: 5
  }
];

// Dados de equipes públicas
export const publicTeams: PublicTeam[] = [
  {
    team_id: 1,
    name: "Valorant Kings",
    manager_name: "Carlos Silva",
    wins: 15,
    losses: 3,
    win_rate: 0.83,
    participants_count: 6,
    championships_participated: 5,
    championships_won: 2
  },
  {
    team_id: 2,
    name: "Phoenix Squad",
    manager_name: "Ana Costa",
    wins: 12,
    losses: 6,
    win_rate: 0.67,
    participants_count: 5,
    championships_participated: 4,
    championships_won: 1
  },
  {
    team_id: 3,
    name: "Sage Warriors",
    manager_name: "Pedro Santos",
    wins: 8,
    losses: 8,
    win_rate: 0.50,
    participants_count: 5,
    championships_participated: 3,
    championships_won: 0
  },
  {
    team_id: 4,
    name: "Viper Elite",
    manager_name: "Maria Oliveira",
    wins: 4,
    losses: 14,
    win_rate: 0.22,
    participants_count: 5,
    championships_participated: 2,
    championships_won: 0
  }
];

// Dados de participantes públicos
export const publicParticipants: PublicParticipant[] = [
  // Valorant Kings
  {
    participant_id: 1,
    name: "João Silva",
    nickname: "KingJoao",
    birth_date: "1998-05-15",
    team_id: 1,
    team_name: "Valorant Kings",
    is_coach: false,
    kda_ratio: 1.45,
    total_kills: 256,
    total_deaths: 176,
    total_assists: 134,
    win_rate: 0.83,
    favorite_agent: "Jett",
    mvp_count: 8,
    phone: "11987654321"
  },
  {
    participant_id: 2,
    name: "Maria Santos",
    nickname: "MariaCoach",
    birth_date: "1995-03-10",
    team_id: 1,
    team_name: "Valorant Kings",
    is_coach: true,
    kda_ratio: 0,
    total_kills: 0,
    total_deaths: 0,
    total_assists: 0,
    win_rate: 0.83,
    favorite_agent: undefined,
    mvp_count: 0,
    phone: "11987654322"
  },
  {
    participant_id: 3,
    name: "Pedro Lima",
    nickname: "PedroFlash",
    birth_date: "1999-11-22",
    team_id: 1,
    team_name: "Valorant Kings",
    is_coach: false,
    kda_ratio: 1.28,
    total_kills: 189,
    total_deaths: 148,
    total_assists: 95,
    win_rate: 0.83,
    favorite_agent: "Phoenix",
    mvp_count: 4,
    phone: "11987654323"
  },
  // Phoenix Squad
  {
    participant_id: 4,
    name: "Gabriel Costa",
    nickname: "PhoenixGab",
    birth_date: "1999-08-22",
    team_id: 2,
    team_name: "Phoenix Squad",
    is_coach: false,
    kda_ratio: 1.32,
    total_kills: 198,
    total_deaths: 150,
    total_assists: 89,
    win_rate: 0.67,
    favorite_agent: "Phoenix",
    mvp_count: 5,
    phone: "21987654324"
  },
  {
    participant_id: 5,
    name: "Ana Costa",
    nickname: "AnaCoach",
    birth_date: "1992-06-15",
    team_id: 2,
    team_name: "Phoenix Squad",
    is_coach: true,
    kda_ratio: 0,
    total_kills: 0,
    total_deaths: 0,
    total_assists: 0,
    win_rate: 0.67,
    favorite_agent: undefined,
    mvp_count: 0,
    phone: "21987654325"
  },
  // Sage Warriors
  {
    participant_id: 6,
    name: "Lucas Santos",
    nickname: "SageGuard",
    birth_date: "1997-12-10",
    team_id: 3,
    team_name: "Sage Warriors",
    is_coach: false,
    kda_ratio: 0.98,
    total_kills: 145,
    total_deaths: 148,
    total_assists: 201,
    win_rate: 0.50,
    favorite_agent: "Sage",
    mvp_count: 2,
    phone: "31987654326"
  },
  {
    participant_id: 7,
    name: "Pedro Santos",
    nickname: "PedroCoach",
    birth_date: "1990-04-05",
    team_id: 3,
    team_name: "Sage Warriors",
    is_coach: true,
    kda_ratio: 0,
    total_kills: 0,
    total_deaths: 0,
    total_assists: 0,
    win_rate: 0.50,
    favorite_agent: undefined,
    mvp_count: 0,
    phone: "31987654327"
  }
];

// Dados de agentes
export const agents: Agent[] = [
  { agent_id: 1, name: "Jett" },
  { agent_id: 2, name: "Phoenix" },
  { agent_id: 3, name: "Sage" },
  { agent_id: 4, name: "Sova" },
  { agent_id: 5, name: "Viper" },
  { agent_id: 6, name: "Cypher" },
  { agent_id: 7, name: "Reyna" },
  { agent_id: 8, name: "Killjoy" },
  { agent_id: 9, name: "Breach" },
  { agent_id: 10, name: "Omen" }
];

export const championshipStandings: ChampionshipStandings[] = [
  {
    team_id: 1,
    team_name: "Valorant Kings",
    matches_played: 12,
    wins: 10,
    losses: 2,
    win_rate: 0.83,
    points: 30,
    round_diff: +45,
    position: 1
  },
  {
    team_id: 2,
    team_name: "Phoenix Squad",
    matches_played: 12,
    wins: 8,
    losses: 4,
    win_rate: 0.67,
    points: 24,
    round_diff: +22,
    position: 2
  },
  {
    team_id: 3,
    team_name: "Sage Warriors",
    matches_played: 12,
    wins: 6,
    losses: 6,
    win_rate: 0.50,
    points: 18,
    round_diff: -8,
    position: 3
  },
  {
    team_id: 4,
    team_name: "Viper Elite",
    matches_played: 12,
    wins: 2,
    losses: 10,
    win_rate: 0.17,
    points: 6,
    round_diff: -59,
    position: 4
  }
];

// Estatísticas de participantes em partidas
export const participantStatistics: ParticipantStatistics[] = [
  {
    statistic_id: 1,
    match_id: 1,
    participant_id: 1,
    participant_name: "João Silva",
    participant_nickname: "KingJoao",
    team_name: "Valorant Kings",
    agent_name: "Jett",
    kills: 18,
    assists: 5,
    deaths: 12,
    spike_plants: 2,
    spike_defuses: 1,
    mvp: true,
    first_kills: 3,
    total_score: 4250
  },
  {
    statistic_id: 2,
    match_id: 1,
    participant_id: 2,
    participant_name: "Gabriel Costa",
    participant_nickname: "PhoenixGab",
    team_name: "Phoenix Squad",
    agent_name: "Phoenix",
    kills: 15,
    assists: 7,
    deaths: 14,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: false,
    first_kills: 2,
    total_score: 3890
  }
];

export const getChampionshipById = (id: number): PublicChampionship | undefined => {
  return publicChampionships.find(championship => championship.championship_id === id);
};

export const getMatchesByChampionshipId = (championshipId: number): PublicMatch[] => {
  return publicMatches.filter(match => match.championship_id === championshipId);
};

export const getStandingsByChampionshipId = (championshipId: number): ChampionshipStandings[] => {
  // In a real app, this would filter by championship_id
  return championshipStandings;
};

export const getTeamById = (id: number): PublicTeam | undefined => {
  return publicTeams.find(team => team.team_id === id);
};

export const getMatchById = (id: number): PublicMatch | undefined => {
  return publicMatches.find(match => match.match_id === id);
};

export const getParticipantsByTeamId = (teamId: number): PublicParticipant[] => {
  return publicParticipants.filter(participant => participant.team_id === teamId);
};

export const getStatisticsByMatchId = (matchId: number): ParticipantStatistics[] => {
  return participantStatistics.filter(stat => stat.match_id === matchId);
};

export const getTeamByChampionshipAndTeamId = (championshipId: number, teamId: number): PublicTeam | undefined => {
  // Verifica se a equipe participa do campeonato através das partidas
  const teamParticipatesInChampionship = publicMatches.some(match => 
    match.championship_id === championshipId && 
    (match.teamA.team_id === teamId || match.teamB.team_id === teamId)
  );
  
  if (teamParticipatesInChampionship) {
    return publicTeams.find(team => team.team_id === teamId);
  }
  
  return undefined;
};

export const getTeamMatchesInChampionship = (championshipId: number, teamId: number): PublicMatch[] => {
  return publicMatches.filter(match => 
    match.championship_id === championshipId && 
    (match.teamA.team_id === teamId || match.teamB.team_id === teamId)
  );
};