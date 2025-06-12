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
    status: "completed",
    score: { teamA: 13, teamB: 8 },
    winner_team_id: 3
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
    status: "completed",
    score: { teamA: 13, teamB: 9 },
    winner_team_id: 1
  },
  {
    match_id: 4,
    championship_id: 1,
    teamA: { team_id: 2, name: "Phoenix Squad" },
    teamB: { team_id: 4, name: "Viper Elite" },
    date: "2024-02-14T18:00:00Z",
    stage: "Quartas de Final",
    bracket: "upper",
    map: "Split",
    status: "completed",
    score: { teamA: 13, teamB: 7 },
    winner_team_id: 2
  },
  {
    match_id: 5,
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
  },
  {
    team_id: 5,
    name: "Thunder Bolts",
    manager_name: "João Thunder",
    wins: 10,
    losses: 5,
    win_rate: 0.67,
    participants_count: 5,
    championships_participated: 3,
    championships_won: 1
  },
  {
    team_id: 6,
    name: "Ice Storm",
    manager_name: "Maria Ice",
    wins: 7,
    losses: 8,
    win_rate: 0.47,
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
  {
    participant_id: 4,
    name: "Carlos Mendes",
    nickname: "CarlosSupport",
    birth_date: "1997-07-12",
    team_id: 1,
    team_name: "Valorant Kings",
    is_coach: false,
    kda_ratio: 0.95,
    total_kills: 145,
    total_deaths: 153,
    total_assists: 245,
    win_rate: 0.83,
    favorite_agent: "Sage",
    mvp_count: 2,
    phone: "11987654324"
  },
  {
    participant_id: 5,
    name: "Ricardo Santos",
    nickname: "RicSentry",
    birth_date: "1998-02-28",
    team_id: 1,
    team_name: "Valorant Kings",
    is_coach: false,
    kda_ratio: 1.15,
    total_kills: 167,
    total_deaths: 145,
    total_assists: 98,
    win_rate: 0.83,
    favorite_agent: "Cypher",
    mvp_count: 3,
    phone: "11987654325"
  },
  {
    participant_id: 6,
    name: "Fernando Alves",
    nickname: "FerSmoke",
    birth_date: "1996-12-05",
    team_id: 1,
    team_name: "Valorant Kings",
    is_coach: false,
    kda_ratio: 1.08,
    total_kills: 134,
    total_deaths: 124,
    total_assists: 156,
    win_rate: 0.83,
    favorite_agent: "Omen",
    mvp_count: 1,
    phone: "11987654326"
  },
  // Phoenix Squad
  {
    participant_id: 7,
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
    participant_id: 8,
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
  {
    participant_id: 9,
    name: "Bruno Silva",
    nickname: "BrunoReyna",
    birth_date: "1998-04-18",
    team_id: 2,
    team_name: "Phoenix Squad",
    is_coach: false,
    kda_ratio: 1.25,
    total_kills: 185,
    total_deaths: 148,
    total_assists: 67,
    win_rate: 0.67,
    favorite_agent: "Reyna",
    mvp_count: 4,
    phone: "21987654327"
  },
  {
    participant_id: 10,
    name: "Lucas Ferreira",
    nickname: "LucasSova",
    birth_date: "1997-10-12",
    team_id: 2,
    team_name: "Phoenix Squad",
    is_coach: false,
    kda_ratio: 1.18,
    total_kills: 156,
    total_deaths: 132,
    total_assists: 178,
    win_rate: 0.67,
    favorite_agent: "Sova",
    mvp_count: 3,
    phone: "21987654328"
  },
  {
    participant_id: 11,
    name: "André Oliveira",
    nickname: "AndreKill",
    birth_date: "1999-01-25",
    team_id: 2,
    team_name: "Phoenix Squad",
    is_coach: false,
    kda_ratio: 1.05,
    total_kills: 142,
    total_deaths: 135,
    total_assists: 89,
    win_rate: 0.67,
    favorite_agent: "Killjoy",
    mvp_count: 2,
    phone: "21987654329"
  },
  // Sage Warriors
  {
    participant_id: 12,
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
    participant_id: 13,
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
  },
  {
    participant_id: 14,
    name: "Rafael Lima",
    nickname: "RafaelBreach",
    birth_date: "1998-09-14",
    team_id: 3,
    team_name: "Sage Warriors",
    is_coach: false,
    kda_ratio: 1.12,
    total_kills: 168,
    total_deaths: 150,
    total_assists: 134,
    win_rate: 0.50,
    favorite_agent: "Breach",
    mvp_count: 3,
    phone: "31987654328"
  },
  {
    participant_id: 15,
    name: "Thiago Costa",
    nickname: "ThiagoViper",
    birth_date: "1996-11-30",
    team_id: 3,
    team_name: "Sage Warriors",
    is_coach: false,
    kda_ratio: 1.08,
    total_kills: 154,
    total_deaths: 143,
    total_assists: 112,
    win_rate: 0.50,
    favorite_agent: "Viper",
    mvp_count: 2,
    phone: "31987654329"
  },
  {
    participant_id: 16,
    name: "Diego Almeida",
    nickname: "DiegoSova",
    birth_date: "1999-03-22",
    team_id: 3,
    team_name: "Sage Warriors",
    is_coach: false,
    kda_ratio: 1.02,
    total_kills: 138,
    total_deaths: 135,
    total_assists: 167,
    win_rate: 0.50,
    favorite_agent: "Sova",
    mvp_count: 1,
    phone: "31987654330"
  },
  // Viper Elite
  {
    participant_id: 17,
    name: "Roberto Silva",
    nickname: "RobertoViper",
    birth_date: "1998-06-18",
    team_id: 4,
    team_name: "Viper Elite",
    is_coach: false,
    kda_ratio: 0.85,
    total_kills: 112,
    total_deaths: 132,
    total_assists: 98,
    win_rate: 0.22,
    favorite_agent: "Viper",
    mvp_count: 1,
    phone: "41987654331"
  },
  {
    participant_id: 18,
    name: "Maria Oliveira",
    nickname: "MariaCoachElite",
    birth_date: "1991-08-12",
    team_id: 4,
    team_name: "Viper Elite",
    is_coach: true,
    kda_ratio: 0,
    total_kills: 0,
    total_deaths: 0,
    total_assists: 0,
    win_rate: 0.22,
    favorite_agent: undefined,
    mvp_count: 0,
    phone: "41987654332"
  },
  {
    participant_id: 19,
    name: "Alex Santos",
    nickname: "AlexJett",
    birth_date: "1999-02-14",
    team_id: 4,
    team_name: "Viper Elite",
    is_coach: false,
    kda_ratio: 0.92,
    total_kills: 124,
    total_deaths: 135,
    total_assists: 67,
    win_rate: 0.22,
    favorite_agent: "Jett",
    mvp_count: 2,
    phone: "41987654333"
  },
  {
    participant_id: 20,
    name: "Marcos Costa",
    nickname: "MarcosCypher",
    birth_date: "1997-05-20",
    team_id: 4,
    team_name: "Viper Elite",
    is_coach: false,
    kda_ratio: 0.78,
    total_kills: 98,
    total_deaths: 126,
    total_assists: 89,
    win_rate: 0.22,
    favorite_agent: "Cypher",
    mvp_count: 0,
    phone: "41987654334"
  },
  {
    participant_id: 21,
    name: "Felipe Lima",
    nickname: "FelipeOmen",
    birth_date: "1998-12-08",
    team_id: 4,
    team_name: "Viper Elite",
    is_coach: false,
    kda_ratio: 0.82,
    total_kills: 105,
    total_deaths: 128,
    total_assists: 76,
    win_rate: 0.22,
    favorite_agent: "Omen",
    mvp_count: 1,
    phone: "41987654335"  },
  // Thunder Bolts
  {
    participant_id: 22,
    name: "João Thunder",
    nickname: "ThunderCoach",
    birth_date: "1989-07-22",
    team_id: 5,
    team_name: "Thunder Bolts",
    is_coach: true,
    kda_ratio: 0,
    total_kills: 0,
    total_deaths: 0,
    total_assists: 0,
    win_rate: 0.67,
    favorite_agent: undefined,
    mvp_count: 0,
    phone: "51987654336"
  },
  {
    participant_id: 23,
    name: "Miguel Santos",
    nickname: "MiguelBolt",
    birth_date: "1998-11-15",
    team_id: 5,
    team_name: "Thunder Bolts",
    is_coach: false,
    kda_ratio: 1.35,
    total_kills: 178,
    total_deaths: 132,
    total_assists: 89,
    win_rate: 0.67,
    favorite_agent: "Jett",
    mvp_count: 5,
    phone: "51987654337"
  },
  {
    participant_id: 24,
    name: "Carlos Ramos",
    nickname: "CarlosStorm",
    birth_date: "1997-04-08",
    team_id: 5,
    team_name: "Thunder Bolts",
    is_coach: false,
    kda_ratio: 1.22,
    total_kills: 165,
    total_deaths: 135,
    total_assists: 123,
    win_rate: 0.67,
    favorite_agent: "Phoenix",
    mvp_count: 3,
    phone: "51987654338"
  },
  {
    participant_id: 25,
    name: "Eduardo Silva",
    nickname: "EduViperT",
    birth_date: "1996-09-12",
    team_id: 5,
    team_name: "Thunder Bolts",
    is_coach: false,
    kda_ratio: 1.18,
    total_kills: 142,
    total_deaths: 120,
    total_assists: 156,
    win_rate: 0.67,
    favorite_agent: "Viper",
    mvp_count: 2,
    phone: "51987654339"
  },
  {
    participant_id: 26,
    name: "Rodrigo Alves",
    nickname: "RodrigoSova",
    birth_date: "1999-01-18",
    team_id: 5,
    team_name: "Thunder Bolts",
    is_coach: false,
    kda_ratio: 1.15,
    total_kills: 138,
    total_deaths: 120,
    total_assists: 187,
    win_rate: 0.67,
    favorite_agent: "Sova",
    mvp_count: 4,
    phone: "51987654340"
  },
  // Ice Storm
  {
    participant_id: 27,
    name: "Maria Ice",
    nickname: "IceCoach",
    birth_date: "1990-12-03",
    team_id: 6,
    team_name: "Ice Storm",
    is_coach: true,
    kda_ratio: 0,
    total_kills: 0,
    total_deaths: 0,
    total_assists: 0,
    win_rate: 0.47,
    favorite_agent: undefined,
    mvp_count: 0,
    phone: "61987654341"
  },
  {
    participant_id: 28,
    name: "Paulo Gelo",
    nickname: "PauloFreeze",
    birth_date: "1998-03-25",
    team_id: 6,
    team_name: "Ice Storm",
    is_coach: false,
    kda_ratio: 1.05,
    total_kills: 156,
    total_deaths: 148,
    total_assists: 78,
    win_rate: 0.47,
    favorite_agent: "Reyna",
    mvp_count: 3,
    phone: "61987654342"
  },
  {
    participant_id: 29,
    name: "Leonardo Frost",
    nickname: "LeoIce",
    birth_date: "1997-08-14",
    team_id: 6,
    team_name: "Ice Storm",
    is_coach: false,
    kda_ratio: 0.98,
    total_kills: 134,
    total_deaths: 137,
    total_assists: 167,
    win_rate: 0.47,
    favorite_agent: "Sage",
    mvp_count: 2,
    phone: "61987654343"
  },
  {
    participant_id: 30,
    name: "Rafael Winter",
    nickname: "RafaWinter",
    birth_date: "1999-06-30",
    team_id: 6,
    team_name: "Ice Storm",
    is_coach: false,
    kda_ratio: 1.02,
    total_kills: 145,
    total_deaths: 142,
    total_assists: 89,
    win_rate: 0.47,
    favorite_agent: "Breach",
    mvp_count: 1,
    phone: "61987654344"
  },
  {
    participant_id: 31,
    name: "Gustavo Snow",
    nickname: "GustavoSnow",
    birth_date: "1996-10-22",
    team_id: 6,
    team_name: "Ice Storm",
    is_coach: false,
    kda_ratio: 0.95,
    total_kills: 128,
    total_deaths: 135,
    total_assists: 123,
    win_rate: 0.47,
    favorite_agent: "Cypher",
    mvp_count: 2,
    phone: "61987654345"
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
  // Match 1: Valorant Kings vs Phoenix Squad (13-11)
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
    participant_id: 3,
    participant_name: "Pedro Lima",
    participant_nickname: "PedroFlash",
    team_name: "Valorant Kings",
    agent_name: "Phoenix",
    kills: 15,
    assists: 7,
    deaths: 14,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: false,
    first_kills: 2,
    total_score: 3890
  },
  {
    statistic_id: 3,
    match_id: 1,
    participant_id: 4,
    participant_name: "Carlos Mendes",
    participant_nickname: "CarlosSupport",
    team_name: "Valorant Kings",
    agent_name: "Sage",
    kills: 8,
    assists: 12,
    deaths: 16,
    spike_plants: 0,
    spike_defuses: 2,
    mvp: false,
    first_kills: 0,
    total_score: 2840
  },
  {
    statistic_id: 4,
    match_id: 1,
    participant_id: 5,
    participant_name: "Ricardo Santos",
    participant_nickname: "RicSentry",
    team_name: "Valorant Kings",
    agent_name: "Cypher",
    kills: 12,
    assists: 8,
    deaths: 13,
    spike_plants: 0,
    spike_defuses: 1,
    mvp: false,
    first_kills: 1,
    total_score: 3420
  },
  {
    statistic_id: 5,
    match_id: 1,
    participant_id: 6,
    participant_name: "Fernando Alves",
    participant_nickname: "FerSmoke",
    team_name: "Valorant Kings",
    agent_name: "Omen",
    kills: 10,
    assists: 9,
    deaths: 15,
    spike_plants: 0,
    spike_defuses: 0,
    mvp: false,
    first_kills: 1,
    total_score: 3180
  },
  {
    statistic_id: 6,
    match_id: 1,
    participant_id: 7,
    participant_name: "Gabriel Costa",
    participant_nickname: "PhoenixGab",
    team_name: "Phoenix Squad",
    agent_name: "Phoenix",
    kills: 16,
    assists: 6,
    deaths: 13,
    spike_plants: 3,
    spike_defuses: 0,
    mvp: false,
    first_kills: 2,
    total_score: 4120
  },
  {
    statistic_id: 7,
    match_id: 1,
    participant_id: 9,
    participant_name: "Bruno Silva",
    participant_nickname: "BrunoReyna",
    team_name: "Phoenix Squad",
    agent_name: "Reyna",
    kills: 14,
    assists: 4,
    deaths: 14,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: false,
    first_kills: 1,
    total_score: 3680
  },
  {
    statistic_id: 8,
    match_id: 1,
    participant_id: 10,
    participant_name: "Lucas Ferreira",
    participant_nickname: "LucasSova",
    team_name: "Phoenix Squad",
    agent_name: "Sova",
    kills: 9,
    assists: 11,
    deaths: 12,
    spike_plants: 0,
    spike_defuses: 1,
    mvp: false,
    first_kills: 0,
    total_score: 3240
  },
  {
    statistic_id: 9,
    match_id: 1,
    participant_id: 11,
    participant_name: "André Oliveira",
    participant_nickname: "AndreKill",
    team_name: "Phoenix Squad",
    agent_name: "Killjoy",
    kills: 7,
    assists: 8,
    deaths: 15,
    spike_plants: 0,
    spike_defuses: 2,
    mvp: false,
    first_kills: 0,
    total_score: 2890
  },
  // Match 2: Sage Warriors vs Viper Elite (13-8)
  {
    statistic_id: 10,
    match_id: 2,
    participant_id: 14,
    participant_name: "Rafael Lima",
    participant_nickname: "RafaelBreach",
    team_name: "Sage Warriors",
    agent_name: "Breach",
    kills: 19,
    assists: 9,
    deaths: 10,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: true,
    first_kills: 4,
    total_score: 4680
  },
  {
    statistic_id: 11,
    match_id: 2,
    participant_id: 12,
    participant_name: "Lucas Santos",
    participant_nickname: "SageGuard",
    team_name: "Sage Warriors",
    agent_name: "Sage",
    kills: 11,
    assists: 14,
    deaths: 12,
    spike_plants: 0,
    spike_defuses: 3,
    mvp: false,
    first_kills: 1,
    total_score: 3950
  },
  {
    statistic_id: 12,
    match_id: 2,
    participant_id: 15,
    participant_name: "Thiago Costa",
    participant_nickname: "ThiagoViper",
    team_name: "Sage Warriors",
    agent_name: "Viper",
    kills: 13,
    assists: 8,
    deaths: 11,
    spike_plants: 2,
    spike_defuses: 1,
    mvp: false,
    first_kills: 2,
    total_score: 3840
  },
  {
    statistic_id: 13,
    match_id: 2,
    participant_id: 16,
    participant_name: "Diego Almeida",
    participant_nickname: "DiegoSova",
    team_name: "Sage Warriors",
    agent_name: "Sova",
    kills: 9,
    assists: 12,
    deaths: 9,
    spike_plants: 0,
    spike_defuses: 0,
    mvp: false,
    first_kills: 1,
    total_score: 3560
  },
  {
    statistic_id: 14,
    match_id: 2,
    participant_id: 17,
    participant_name: "Roberto Silva",
    participant_nickname: "RobertoViper",
    team_name: "Viper Elite",
    agent_name: "Viper",
    kills: 12,
    assists: 6,
    deaths: 13,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: false,
    first_kills: 1,
    total_score: 3420
  },
  {
    statistic_id: 15,
    match_id: 2,
    participant_id: 19,
    participant_name: "Alex Santos",
    participant_nickname: "AlexJett",
    team_name: "Viper Elite",
    agent_name: "Jett",
    kills: 14,
    assists: 4,
    deaths: 13,
    spike_plants: 0,
    spike_defuses: 0,
    mvp: false,
    first_kills: 2,
    total_score: 3780
  },
  {
    statistic_id: 16,
    match_id: 2,
    participant_id: 20,
    participant_name: "Marcos Costa",
    participant_nickname: "MarcosCypher",
    team_name: "Viper Elite",
    agent_name: "Cypher",
    kills: 8,
    assists: 7,
    deaths: 13,
    spike_plants: 0,
    spike_defuses: 1,
    mvp: false,
    first_kills: 0,
    total_score: 2980
  },
  {
    statistic_id: 17,
    match_id: 2,
    participant_id: 21,
    participant_name: "Felipe Lima",
    participant_nickname: "FelipeOmen",
    team_name: "Viper Elite",
    agent_name: "Omen",
    kills: 6,
    assists: 8,
    deaths: 13,
    spike_plants: 0,
    spike_defuses: 0,
    mvp: false,
    first_kills: 0,
    total_score: 2640
  },
  // Match 3: Valorant Kings vs Sage Warriors (Final - 13-9)
  {
    statistic_id: 18,
    match_id: 3,
    participant_id: 1,
    participant_name: "João Silva",
    participant_nickname: "KingJoao",
    team_name: "Valorant Kings",
    agent_name: "Jett",
    kills: 22,
    assists: 4,
    deaths: 11,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: true,
    first_kills: 5,
    total_score: 5120
  },
  {
    statistic_id: 19,
    match_id: 3,
    participant_id: 3,
    participant_name: "Pedro Lima",
    participant_nickname: "PedroFlash",
    team_name: "Valorant Kings",
    agent_name: "Phoenix",
    kills: 16,
    assists: 8,
    deaths: 12,
    spike_plants: 2,
    spike_defuses: 1,
    mvp: false,
    first_kills: 3,
    total_score: 4280
  },
  {
    statistic_id: 20,
    match_id: 3,
    participant_id: 12,
    participant_name: "Lucas Santos",
    participant_nickname: "SageGuard",
    team_name: "Sage Warriors",
    agent_name: "Sage",
    kills: 13,
    assists: 11,
    deaths: 15,
    spike_plants: 0,
    spike_defuses: 2,
    mvp: false,
    first_kills: 1,
    total_score: 3780
  },
  {
    statistic_id: 21,
    match_id: 3,
    participant_id: 14,
    participant_name: "Rafael Lima",
    participant_nickname: "RafaelBreach",
    team_name: "Sage Warriors",
    agent_name: "Breach",
    kills: 15,
    assists: 7,
    deaths: 14,
    spike_plants: 1,
    spike_defuses: 0,
    mvp: false,
    first_kills: 2,
    total_score: 3980
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

// Utility functions for search and navigation
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
  const teamParticipates = publicMatches.some(match => 
    match.championship_id === championshipId && 
    (match.teamA.team_id === teamId || match.teamB.team_id === teamId)
  );
  
  if (teamParticipates) {
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

export const getTeamsByChampionshipId = (championshipId: number): PublicTeam[] => {
  // Encontra todas as equipes que participam do campeonato através das partidas
  const teamIds = new Set<number>();
  
  publicMatches
    .filter(match => match.championship_id === championshipId)
    .forEach(match => {
      teamIds.add(match.teamA.team_id);
      teamIds.add(match.teamB.team_id);
    });
  
  return publicTeams.filter(team => teamIds.has(team.team_id));
};

