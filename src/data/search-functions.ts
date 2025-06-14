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

// Busca específica para jogadores (baseada em publicParticipants)
export const searchPlayers = (
  query: string,
  types: string[] = ["player"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return publicParticipants
    .filter(
      (participant) =>
        participant.nickname.toLowerCase().includes(searchQuery) ||
        participant.name.toLowerCase().includes(searchQuery) ||
        participant.team_name.toLowerCase().includes(searchQuery) ||
        participant.phone.includes(searchQuery)
    )
    .map((participant) => ({
      id: participant.participant_id,
      name: participant.nickname,
      type: "player",
      subtitle: `${participant.name} - ${participant.team_name}`,
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
      },
    }));
};

// Busca específica para equipes (baseada em publicTeams)
export const searchTeams = (
  query: string,
  types: string[] = ["team"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return publicTeams
    .filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery) ||
        team.manager_name.toLowerCase().includes(searchQuery)
    )
    .map((team) => ({
      id: team.team_id,
      name: team.name,
      type: "team",
      subtitle: `${team.participants_count} jogadores - Gerenciado por ${team.manager_name}`,
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

// Busca específica para campeonatos (baseada em publicChampionships)
export const searchChampionships = (
  query: string,
  types: string[] = ["championship"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return publicChampionships
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

// Busca geral (estatísticas) - jogadores, equipes e campeonatos
export const searchStatistics = (
  query: string,
  types: string[] = ["player", "team", "championship"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  if (types.includes("player")) {
    results.push(...searchPlayers(query));
  }

  if (types.includes("team")) {
    results.push(...searchTeams(query));
  }

  if (types.includes("championship")) {
    results.push(...searchChampionships(query));
  }

  return results;
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

// Search function for public catalog (championships, teams, matches)
export const searchPublicCatalog = (
  query: string,
  types: string[]
): SearchResult[] => {
  if (!query.trim()) return [];
  const searchQuery = query.toLowerCase();
  const allPossibleResults: SearchResult[] = [];

  // Search championships
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
        subtitle: `${championship.location} - ${
          championship.status === "ongoing"
            ? "Em andamento"
            : championship.status === "completed"
            ? "Finalizado"
            : championship.status === "upcoming"
            ? "Em breve"
            : "Cancelado"
        }`,
        metadata: {
          status: championship.status,
          location: championship.location,
          startDate: championship.start_date,
          endDate: championship.end_date,
        },
      }));
    allPossibleResults.push(...championshipResults);
  }

  // Search teams
  if (types.includes("team")) {
    const teamResults = publicTeams
      .filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery) ||
          team.manager_name.toLowerCase().includes(searchQuery)
      )
      .map((team) => ({
        id: team.team_id,
        name: team.name,
        type: "team",
        subtitle: `Gerenciado por ${
          team.manager_name
        } - ${Math.round(team.win_rate * 100)}% taxa de vitória`,
        metadata: {
          managerName: team.manager_name,
          winRate: team.win_rate,
        },
      }));
    allPossibleResults.push(...teamResults);
  }

  // Search matches
  if (types.includes("match")) {
    const matchResults = publicMatches
      .filter(
        (match) =>
          match.teamA.name.toLowerCase().includes(searchQuery) ||
          match.teamB.name.toLowerCase().includes(searchQuery) ||
          match.map.toLowerCase().includes(searchQuery) ||
          match.stage.toLowerCase().includes(searchQuery)
      )
      .map((match) => ({
        id: match.match_id,
        name: `${match.teamA.name} vs ${match.teamB.name}`,
        type: "match",
        subtitle: `${match.stage} - ${match.map} - ${
          match.status === "completed"
            ? "Finalizada"
            : match.status === "live"
            ? "Ao Vivo"
            : "Agendada"
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
