import { SearchResult } from "@/hooks/useSearch";
import {
  PublicChampionship,
  PublicMatch,
  PublicTeam,
  ChampionshipStandings,
  PublicParticipant,
  ParticipantStatistics,
} from "@/types/data-types";

import {
  publicChampionships,
  publicMatches,
  publicTeams,
  championshipStandings,
  publicParticipants,
  participantStatistics,
  topJogadores,
  topEquipes,
} from "./data-mock";

export const getChampionshipById = (
  id: number
): PublicChampionship | undefined => {
  return publicChampionships.find(
    (championship) => championship.championship_id === id
  );
};

export const getMatchesByChampionshipId = (
  championshipId: number
): PublicMatch[] => {
  return publicMatches.filter(
    (match) => match.championship_id === championshipId
  );
};

export const getStandingsByChampionshipId = (
  championshipId: number
): ChampionshipStandings[] => {
  // In a real app, this would filter by championship_id
  return championshipStandings;
};

export const getTeamById = (id: number): PublicTeam | undefined => {
  return publicTeams.find((team) => team.team_id === id);
};

// Utility functions for search and navigation
export const getMatchById = (id: number): PublicMatch | undefined => {
  return publicMatches.find((match) => match.match_id === id);
};

export const getParticipantsByTeamId = (
  teamId: number
): PublicParticipant[] => {
  return publicParticipants.filter(
    (participant) => participant.team_id === teamId
  );
};

export const getStatisticsByMatchId = (
  matchId: number
): ParticipantStatistics[] => {
  return participantStatistics.filter((stat) => stat.match_id === matchId);
};

export const getTeamByChampionshipAndTeamId = (
  championshipId: number,
  teamId: number
): PublicTeam | undefined => {
  // Verifica se a equipe participa do campeonato através das partidas
  const teamParticipates = publicMatches.some(
    (match) =>
      match.championship_id === championshipId &&
      (match.teamA.team_id === teamId || match.teamB.team_id === teamId)
  );

  if (teamParticipates) {
    return publicTeams.find((team) => team.team_id === teamId);
  }

  return undefined;
};

export const getTeamMatchesInChampionship = (
  championshipId: number,
  teamId: number
): PublicMatch[] => {
  return publicMatches.filter(
    (match) =>
      match.championship_id === championshipId &&
      (match.teamA.team_id === teamId || match.teamB.team_id === teamId)
  );
};

export const getTeamsByChampionshipId = (
  championshipId: number
): PublicTeam[] => {
  // Encontra todas as equipes que participam do campeonato através das partidas
  const teamIds = new Set<number>();

  publicMatches
    .filter((match) => match.championship_id === championshipId)
    .forEach((match) => {
      teamIds.add(match.teamA.team_id);
      teamIds.add(match.teamB.team_id);
    });

  return publicTeams.filter((team) => teamIds.has(team.team_id));
};

/**
 * Busca específica para jogadores
 * @param query - String de busca 
 * @param types - Tipos de busca (deve incluir "player" para funcionar)
 * @param playerData - Dados de jogadores para buscar, se não fornecidos usa publicParticipants
 * @returns Array de resultados de busca
 */
export const searchPlayers = (
  query: string,
  types: string[] = ["player"],
  playerData: any[] = publicParticipants
): SearchResult[] => {
  if (!query.trim() || !types.includes("player") || !Array.isArray(playerData)) return [];
  
  const searchQuery = query.toLowerCase();

  return playerData
    .filter(
      (participant) =>
        (participant.nickname && participant.nickname.toLowerCase().includes(searchQuery)) ||
        (participant.name && participant.name.toLowerCase().includes(searchQuery)) ||
        (participant.team_name && participant.team_name.toLowerCase().includes(searchQuery)) ||
        (participant.phone && String(participant.phone).includes(searchQuery))
    )
    .map((participant) => ({
      id: participant.participant_id,
      name: participant.nickname || '',
      type: "player",
      subtitle: `${participant.name || ''} - ${participant.team_name || ''}`,
      metadata: {
        fullName: participant.name,
        teamName: participant.team_name,
        phone: participant.phone,
        kda: participant.kda_ratio,
        winRate: participant.win_rate,
        isCoach: participant.is_coach,
        birthDate: participant.birth_date,
        kills: participant.total_kills,
        deaths: participant.total_deaths,
        assists: participant.total_assists,
        teamId: participant.team_id,
      },
    }));
};

/**
 * Busca específica para equipes
 * @param query - String de busca
 * @param types - Tipos de busca (deve incluir "team" para funcionar)
 * @param teamData - Dados de equipes para buscar, se não fornecidos usa publicTeams
 * @returns Array de resultados de busca
 */
export const searchTeams = (
  query: string,
  types: string[] = ["team"],
  teamData: any[] = publicTeams
): SearchResult[] => {
  if (!query.trim() || !types.includes("team") || !Array.isArray(teamData)) return [];

  const searchQuery = query.toLowerCase();

  return teamData
    .filter(
      (team) =>
        (team.name && team.name.toLowerCase().includes(searchQuery)) ||
        (team.manager_name && team.manager_name.toLowerCase().includes(searchQuery))
    )
    .map((team) => ({
      id: team.team_id,
      name: team.name || '',
      type: "team",
      subtitle: `${team.participants_count || 0} jogadores${team.manager_name ? ` - Gerenciado por ${team.manager_name}` : ''}`,
      metadata: {
        managerName: team.manager_name,
        participantsCount: team.participants_count,
        winRate: team.win_rate,
        wins: team.wins,
        losses: team.losses,
        championshipsWon: team.championships_won,
      },
    }));
};

/**
 * Busca específica para campeonatos
 * @param query - String de busca
 * @param types - Tipos de busca (deve incluir "championship" para funcionar)
 * @param championshipData - Dados de campeonatos para buscar, se não fornecidos usa publicChampionships
 * @returns Array de resultados de busca
 */
export const searchChampionships = (
  query: string,
  types: string[] = ["championship"],
  championshipData: any[] = publicChampionships
): SearchResult[] => {
  if (!query.trim() || !types.includes("championship") || !Array.isArray(championshipData)) return [];

  const searchQuery = query.toLowerCase();

  return championshipData
    .filter(
      (championship) =>
        (championship.name && championship.name.toLowerCase().includes(searchQuery)) ||
        (championship.description && championship.description.toLowerCase().includes(searchQuery)) ||
        (championship.location && championship.location.toLowerCase().includes(searchQuery))
    )
    .map((championship) => ({
      id: championship.championship_id,
      name: championship.name,
      type: "championship",
      subtitle: `${championship.teams_count} equipes - ${championship.location}`,
      metadata: {
        description: championship.description,
        status: championship.status,
        location: championship.location,
        teamsCount: championship.teams_count,
        matchesCount: championship.matches_count,
        startDate: championship.start_date,
        endDate: championship.end_date,
        format: championship.format,
        prizePool: championship.prize_pool,
      },
    }));
};

/**
 * Busca geral (estatísticas) - jogadores, equipes e campeonatos
 * @param query - String de busca
 * @param types - Tipos de busca a incluir
 * @param playerData - Dados de jogadores (opcional)
 * @param teamData - Dados de equipes (opcional)
 * @param championshipData - Dados de campeonatos (opcional)
 * @returns Array de resultados de busca combinados
 */
export const searchStatistics = (
  query: string,
  types: string[] = ["player", "team", "championship"],
  playerData?: any[],
  teamData?: any[],
  championshipData?: any[]
): SearchResult[] => {
  const playerResults = searchPlayers(query, types, playerData);
  const teamResults = searchTeams(query, types, teamData);
  const championshipResults = searchChampionships(query, types, championshipData);

  return [...playerResults, ...teamResults, ...championshipResults];
};

// Busca mista para jogadores e equipes (útil para algumas páginas)
export const searchPlayersAndTeams = (
  query: string,
  types: string[] = ["player", "team"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  if (types.includes("player")) {
    results.push(...searchPlayers(query));
  }

  if (types.includes("team")) {
    results.push(...searchTeams(query));
  }

  return results;
};

// Função auxiliar para converter status
const getStatusText = (status: string): string => {
  switch (status) {
    case "ongoing":
      return "Em Andamento";
    case "completed":
      return "Finalizado";
    case "upcoming":
      return "Próximo";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
};

// Search function for public catalog (championships, teams, matches) - Updated to use real data
export const searchPublicCatalog = (
  query: string,
  types: string[],
  championshipsData: any[] = [],
  teamsData: any[] = [],
  matchesData: any[] = []
): SearchResult[] => {
  if (!query.trim()) return [];
  const searchQuery = query.toLowerCase();
  const allPossibleResults: SearchResult[] = [];

  // Search championships
  if (types.includes("championship")) {
    const championshipResults = championshipsData
      .filter(
        (championship) =>
          championship.name.toLowerCase().includes(searchQuery) ||
          (championship.description &&
            championship.description.toLowerCase().includes(searchQuery)) ||
          (championship.location &&
            championship.location.toLowerCase().includes(searchQuery))
      )
      .map((championship) => ({
        id: championship.championship_id,
        name: championship.name,
        type: "championship",
        subtitle: `${championship.location || "Local não definido"} - ${
          championship.status === "Ativo"
            ? "Em andamento"
            : championship.status === "Finalizado"
            ? "Finalizado"
            : championship.status === "Planejado"
            ? "Em breve"
            : "Status não definido"
        }`,
        metadata: {
          status: championship.status,
          location: championship.location,
          startDate: championship.start_date,
          endDate: championship.end_date,
          totalTeams: championship.teams_count || 0,
        },
      }));
    allPossibleResults.push(...championshipResults);
  }

  // Search teams
  if (types.includes("team")) {
    const teamResults = teamsData
      .filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery) ||
          (team.manager_name &&
            team.manager_name.toLowerCase().includes(searchQuery))
      )
      .map((team) => ({
        id: team.team_id,
        name: team.name,
        type: "team",
        subtitle: `${team.manager_name ? `Gerenciado por ${team.manager_name}` : 'Sem gerente definido'} - ${team.participants_count || 0} jogadores`,
        metadata: {
          managerName: team.manager_name,
          participantsCount: team.participants_count || 0,
          winRate: team.win_rate || 0,
        },
      }));
    allPossibleResults.push(...teamResults);
  }

  // Search matches
  if (types.includes("match")) {
    const matchResults = matchesData
      .filter(
        (match) =>
          (match.TeamA?.name && match.TeamA.name.toLowerCase().includes(searchQuery)) ||
          (match.TeamB?.name && match.TeamB.name.toLowerCase().includes(searchQuery)) ||
          (match.map && match.map.toLowerCase().includes(searchQuery)) ||
          (match.stage && match.stage.toLowerCase().includes(searchQuery))
      )
      .map((match) => ({
        id: match.match_id,
        name: `${match.TeamA?.name || 'Equipe A'} vs ${match.TeamB?.name || 'Equipe B'}`,
        type: "match",
        subtitle: `${match.stage || 'Fase não definida'} - ${match.map || 'Mapa não definido'} - ${
          match.status === "Finalizada"
            ? "Finalizada"
            : match.status === "Agendada"
            ? "Agendada"
            : match.status === "Planejada"
            ? "À Agendar"
            : "Status não definido"
        }`,
        metadata: {
          championshipId: match.championship_id,
          status: match.status,
          map: match.map,
          stage: match.stage,
        },
      }));
    allPossibleResults.push(...matchResults);
  }

  return allPossibleResults.slice(0, 8); // Corresponds to maxResults in PublicSearchBar
};

// Updated search function with proper type safety
export const searchPublicCatalogSafe = (
  query: string,
  types: string[],
  championshipsData: any[] = [],
  teamsData: any[] = [],
  matchesData: any[] = []
): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchQuery = query.toLowerCase();
  const allPossibleResults: SearchResult[] = [];

  // Search championships with null checks
  if (types.includes("championship") && Array.isArray(championshipsData)) {
    const championshipResults = championshipsData
      .filter(championship =>
        championship && 
        championship.name && 
        (championship.name.toLowerCase().includes(searchQuery) ||
        (championship.description && championship.description.toLowerCase().includes(searchQuery)) ||
        (championship.location && championship.location.toLowerCase().includes(searchQuery)))
      )
      .map(championship => ({
        id: championship.championship_id,
        name: championship.name,
        type: "championship",
        subtitle: `${championship.location || "Local não definido"} - ${
          championship.status === "Ativo"
            ? "Em andamento"
            : championship.status === "Finalizado"
            ? "Finalizado"
            : championship.status === "Planejado"
            ? "Em breve"
            : "Status não definido"
        }`,
        metadata: {
          status: championship.status,
          location: championship.location,
          startDate: championship.start_date,
          endDate: championship.end_date,
          totalTeams: championship.teams_count || 0,
        },
      }));
    allPossibleResults.push(...championshipResults);
  }

  // Search teams with null checks
  if (types.includes("team") && Array.isArray(teamsData)) {
    const teamResults = teamsData
      .filter(team =>
        team && 
        team.name && 
        (team.name.toLowerCase().includes(searchQuery) ||
        (team.manager_name && team.manager_name.toLowerCase().includes(searchQuery)))
      )
      .map(team => ({
        id: team.team_id,
        name: team.name,
        type: "team",
        subtitle: `${team.manager_name ? `Gerenciado por ${team.manager_name}` : 'Sem gerente definido'} - ${team.participants_count || 0} jogadores`,
        metadata: {
          managerName: team.manager_name,
          participantsCount: team.participants_count || 0,
          winRate: team.win_rate || 0,
        },
      }));
    allPossibleResults.push(...teamResults);
  }

  // Search matches with null checks
  if (types.includes("match") && Array.isArray(matchesData)) {
    const matchResults = matchesData
      .filter(match =>
        match &&
        ((match.TeamA?.name && match.TeamA.name.toLowerCase().includes(searchQuery)) ||
        (match.TeamB?.name && match.TeamB.name.toLowerCase().includes(searchQuery)) ||
        (match.map && match.map.toLowerCase().includes(searchQuery)) ||
        (match.stage && match.stage.toLowerCase().includes(searchQuery)))
      )
      .map(match => ({
        id: match.match_id,
        name: `${match.TeamA?.name || 'Equipe A'} vs ${match.TeamB?.name || 'Equipe B'}`,
        type: "match",
        subtitle: `${match.stage || 'Fase não definida'} - ${match.map || 'Mapa não definido'} - ${
          match.status === "Finalizada"
            ? "Finalizada"
            : match.status === "Agendada"
            ? "Agendada"
            : match.status === "Planejada"
            ? "À Agendar"
            : "Status não definido"
        }`,
        metadata: {
          championshipId: match.championship_id,
          status: match.status,
          map: match.map,
          stage: match.stage,
        },
      }));
    allPossibleResults.push(...matchResults);
  }

  return allPossibleResults.slice(0, 8);
};

// Busca em todos os dados (jogadores, equipes, campeonatos) - para a página inicial
export const searchAll = (
  query: string,
  types: string[] = ["player", "team", "championship"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const searchQuery = query.toLowerCase();

  // Buscar jogadores
  if (types.includes("player")) {
    const playerResults = topJogadores
      .filter(
        (player) =>
          player.nome.toLowerCase().includes(searchQuery) ||
          player.equipe.toLowerCase().includes(searchQuery)
      )
      .map((player, index) => ({
        id: index + 1000, // Generate unique ID
        name: player.nome,
        type: "player",
        subtitle: `${player.equipe} - KDA: ${player.kda} - ${player.winRate}`,
        metadata: {
          teamName: player.equipe,
          kda: player.kda,
          winRate: player.winRate,
          kills: player.kills,
        },
      }));
    results.push(...playerResults);
  }

  // Buscar equipes
  if (types.includes("team")) {
    const teamResults = topEquipes
      .filter(
        (team) =>
          team.nome.toLowerCase().includes(searchQuery)
      )
      .map((team, index) => ({
        id: index + 2000, // Generate unique ID
        name: team.nome,
        type: "team",
        subtitle: `${team.vitorias}V - ${team.derrotas}D - ${team.winRate}`,
        metadata: {
          winRate: team.winRate,
          wins: team.vitorias,
          losses: team.derrotas,
          points: team.pontos,
        },
      }));
    results.push(...teamResults);
  }

  // Buscar campeonatos
  if (types.includes("championship")) {
    const championshipResults = publicChampionships
      .filter(
        (championship) =>
          championship.name.toLowerCase().includes(searchQuery) ||
          championship.description.toLowerCase().includes(searchQuery) ||
          championship.location.toLowerCase().includes(searchQuery)
      )
      .map((championship) => ({
        id: championship.championship_id,
        name: championship.name,
        type: "championship",
        subtitle: `${championship.location} - ${getStatusText(
          championship.status
        )}`,
        metadata: {
          status: championship.status,
          location: championship.location,
          teamsCount: championship.teams_count,
          prizePool: championship.prize_pool,
        },
      }));
    results.push(...championshipResults);
  }

  return results;
};

/**
 * Search participants using API data
 * @param query - Search query string
 * @param types - Array of search types to include
 * @param participantsData - Array of participants data from API
 * @param teamsData - Array of teams data for team name lookup
 * @returns Array of search results
 */
export const searchParticipantsWithApiData = (
  query: string, 
  types: string[] = ["player"], 
  participantsData: any[] = [], 
  teamsData: any[] = []
): SearchResult[] => {
  if (!query.trim() || !types.includes("player") || !Array.isArray(participantsData)) return [];

  const searchQuery = query.toLowerCase();

  return participantsData
    .filter((participant) => {
      // Only include players, not coaches
      if (participant.is_coach) return false;
      
      const teamName = teamsData.find(t => t.team_id === participant.team_id)?.name || '';
      
      return (
        participant.name?.toLowerCase().includes(searchQuery) ||
        participant.nickname?.toLowerCase().includes(searchQuery) ||
        teamName.toLowerCase().includes(searchQuery)
      );
    })
    .map((participant) => {
      const teamName = teamsData.find(t => t.team_id === participant.team_id)?.name || 'Sem equipe';
      
      return {
        id: participant.participant_id,
        name: participant.nickname,
        type: "player",
        subtitle: `${participant.name} - ${teamName}`,
        metadata: {
          fullName: participant.name,
          teamId: participant.team_id,
          teamName,
          isCoach: participant.is_coach,
        },
      };
    })
    .slice(0, 8);
};
