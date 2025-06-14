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
  detailedPlayersStats,
  detailedTeamsStats,
  detailedChampionshipsStats,
  championshipParticipations,
  recentMatches,
  detailedInscriptionsStats, // Import detailedInscriptionsStats
  DetailedInscriptionStats, // Import the type DetailedInscriptionStats
  publicChampionships,
  publicMatches,
  publicTeams,
  championshipStandings,
  publicParticipants,
  participantStatistics,
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

// Busca geral (estatísticas) - jogadores, equipes e campeonatos
export const searchStatistics = (
  query: string,
  types: string[] = ["player", "team", "championship"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const searchQuery = query.toLowerCase();

  // Buscar jogadores
  if (types.includes("player")) {
    const playerResults = detailedPlayersStats
      .filter(
        (player) =>
          player.nickname.toLowerCase().includes(searchQuery) ||
          player.name.toLowerCase().includes(searchQuery) ||
          player.team_name.toLowerCase().includes(searchQuery)
      )
      .map((player) => ({
        id: player.participant_id,
        name: player.nickname,
        type: "player",
        subtitle: `${player.name} - ${player.team_name} - KDA: ${player.kda_ratio}`,
        metadata: {
          teamName: player.team_name,
          kda: player.kda_ratio,
          winRate: player.win_rate,
          isCoach: player.is_coach,
        },
      }));
    results.push(...playerResults);
  }

  // Buscar equipes
  if (types.includes("team")) {
    const teamResults = detailedTeamsStats
      .filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery) ||
          team.manager_name.toLowerCase().includes(searchQuery)
      )
      .map((team) => ({
        id: team.team_id,
        name: team.name,
        type: "team",
        subtitle: `Gerenciado por ${team.manager_name} - Win Rate: ${Math.round(
          team.win_rate * 100
        )}%`,
        metadata: {
          managerName: team.manager_name,
          winRate: team.win_rate,
          totalMatches: team.total_matches,
          activePlayers: team.active_players,
        },
      }));
    results.push(...teamResults);
  }

  // Buscar campeonatos
  if (types.includes("championship")) {
    const championshipResults = detailedChampionshipsStats
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
          totalTeams: championship.total_teams,
          organizer: championship.organizer_name,
        },
      }));
    results.push(...championshipResults);
  }

  return results;
};

// Busca específica para jogadores (página de gerenciar jogadores)
export const searchPlayers = (
  query: string,
  types: string[] = ["player"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return detailedPlayersStats
    .filter(
      (player) =>
        player.nickname.toLowerCase().includes(searchQuery) ||
        player.name.toLowerCase().includes(searchQuery) ||
        player.team_name.toLowerCase().includes(searchQuery) ||
        player.phone.includes(searchQuery)
    )
    .map((player) => ({
      id: player.participant_id,
      name: player.nickname,
      type: "player",
      subtitle: `${player.name} - ${player.team_name}`,
      metadata: {
        fullName: player.name,
        teamName: player.team_name,
        phone: player.phone,
        kda: player.kda_ratio,
        winRate: player.win_rate,
        isCoach: player.is_coach,
        birthDate: player.birth_date,
        kills: player.total_kills,
        deaths: player.total_deaths,
        assists: player.total_assists,
      },
    }));
};

// Busca específica para equipes (página de gerenciar equipes)
export const searchTeams = (
  query: string,
  types: string[] = ["team"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return detailedTeamsStats
    .filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery) ||
        team.manager_name.toLowerCase().includes(searchQuery)
    )
    .map((team) => ({
      id: team.team_id,
      name: team.name,
      type: "team",
      subtitle: `${team.active_players} jogadores - Gerenciado por ${team.manager_name}`,
      metadata: {
        managerName: team.manager_name,
        activePlayers: team.active_players,
        coaches: team.coaches,
        winRate: team.win_rate,
        totalMatches: team.total_matches,
        wins: team.wins,
        losses: team.losses,
        teamKda: team.team_kda,
        championshipsWon: team.championships_won,
      },
    }));
};

// Busca específica para campeonatos
export const searchChampionships = (
  query: string,
  types: string[] = ["championship"]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return detailedChampionshipsStats
    .filter(
      (championship) =>
        championship.name.toLowerCase().includes(searchQuery) ||
        championship.description.toLowerCase().includes(searchQuery) ||
        championship.location.toLowerCase().includes(searchQuery) ||
        championship.organizer_name.toLowerCase().includes(searchQuery)
    )
    .map((championship) => ({
      id: championship.championship_id,
      name: championship.name,
      type: "championship",
      subtitle: `${championship.total_teams} equipes - ${championship.location}`,
      metadata: {
        description: championship.description,
        status: championship.status,
        location: championship.location,
        organizer: championship.organizer_name,
        totalTeams: championship.total_teams,
        totalPlayers: championship.total_players,
        startDate: championship.start_date,
        endDate: championship.end_date,
        format: championship.format,
      },
    }));
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

// Busca específica para participações em campeonatos
export const searchChampionshipParticipations = (
  query: string
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return championshipParticipations
    .filter((participation) =>
      participation.championship_name.toLowerCase().includes(searchQuery)
    )
    .map((participation) => ({
      id: participation.championship_id,
      name: participation.championship_name,
      type: "championship_participation",
      subtitle: `${participation.matches_played} partidas - ${participation.status}`,
      metadata: {
        status: participation.status,
        matchesPlayed: participation.matches_played,
      },
    }));
};

// Busca específica para partidas
export const searchMatches = (
  query: string,
  types: string[] = ["match"]
): SearchResult[] => {
  if (!query.trim() || !types.includes("match")) return [];

  const searchQuery = query.toLowerCase();

  return recentMatches
    .filter(
      (match) =>
        match.team_a.toLowerCase().includes(searchQuery) ||
        match.team_b.toLowerCase().includes(searchQuery) ||
        match.tournament.toLowerCase().includes(searchQuery) ||
        match.map.toLowerCase().includes(searchQuery)
    )
    .map((match) => ({
      id: match.match_id,
      name: `${match.team_a} vs ${match.team_b}`,
      type: "match",
      subtitle: `${match.tournament} - ${match.map} (${match.date})`,
      metadata: {
        team_a: match.team_a,
        team_b: match.team_b,
        score_a: match.score_a,
        score_b: match.score_b,
        map: match.map,
        date: match.date,
        tournament: match.tournament,
        winner: match.winner,
      },
    }));
};

// Busca específica para inscrições
export const searchInscriptions = (
  query: string,
  types: string[] = ["inscription"]
): SearchResult[] => {
  if (!query.trim() || !types.includes("inscription")) return [];

  const searchQuery = query.toLowerCase();

  return detailedInscriptionsStats
    .filter(
      (inscription: DetailedInscriptionStats) =>
        inscription.team_name.toLowerCase().includes(searchQuery) ||
        inscription.championship_name.toLowerCase().includes(searchQuery) ||
        inscription.coach_name.toLowerCase().includes(searchQuery)
    )
    .map((inscription: DetailedInscriptionStats) => ({
      id: inscription.inscription_id,
      name: `Inscrição: ${inscription.team_name} - ${inscription.championship_name}`,
      type: "inscription",
      subtitle: `Coach: ${inscription.coach_name} - Data: ${inscription.inscription_date} - Status: ${inscription.status}`,
      metadata: {
        team_name: inscription.team_name,
        championship_name: inscription.championship_name,
        inscription_date: inscription.inscription_date,
        status: inscription.status,
        coach_name: inscription.coach_name,
      },
    }));
};
