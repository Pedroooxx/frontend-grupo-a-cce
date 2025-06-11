import { SearchResult } from '@/hooks/useSearch';
import { 
  detailedPlayersStats, 
  detailedTeamsStats, 
  detailedChampionshipsStats,
  championshipParticipations 
} from './statistics-mock';

// Busca geral (estatísticas) - jogadores, equipes e campeonatos
export const searchStatistics = (query: string, types: string[] = ['player', 'team', 'championship']): SearchResult[] => {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  const searchQuery = query.toLowerCase();

  // Buscar jogadores
  if (types.includes('player')) {
    const playerResults = detailedPlayersStats
      .filter(player =>
        player.nickname.toLowerCase().includes(searchQuery) ||
        player.name.toLowerCase().includes(searchQuery) ||
        player.team_name.toLowerCase().includes(searchQuery)
      )
      .map(player => ({
        id: player.participant_id,
        name: player.nickname,
        type: 'player',
        subtitle: `${player.name} - ${player.team_name} - KDA: ${player.kda_ratio}`,
        metadata: {
          teamName: player.team_name,
          kda: player.kda_ratio,
          winRate: player.win_rate,
          isCoach: player.is_coach
        }
      }));
    results.push(...playerResults);
  }

  // Buscar equipes
  if (types.includes('team')) {
    const teamResults = detailedTeamsStats
      .filter(team =>
        team.name.toLowerCase().includes(searchQuery) ||
        team.manager_name.toLowerCase().includes(searchQuery)
      )
      .map(team => ({
        id: team.team_id,
        name: team.name,
        type: 'team',
        subtitle: `Gerenciado por ${team.manager_name} - Win Rate: ${Math.round(team.win_rate * 100)}%`,
        metadata: {
          managerName: team.manager_name,
          winRate: team.win_rate,
          totalMatches: team.total_matches,
          activePlayers: team.active_players
        }
      }));
    results.push(...teamResults);
  }

  // Buscar campeonatos
  if (types.includes('championship')) {
    const championshipResults = detailedChampionshipsStats
      .filter(championship =>
        championship.name.toLowerCase().includes(searchQuery) ||
        championship.description.toLowerCase().includes(searchQuery) ||
        championship.location.toLowerCase().includes(searchQuery)
      )
      .map(championship => ({
        id: championship.championship_id,
        name: championship.name,
        type: 'championship',
        subtitle: `${championship.location} - ${getStatusText(championship.status)}`,
        metadata: {
          status: championship.status,
          location: championship.location,
          totalTeams: championship.total_teams,
          organizer: championship.organizer_name
        }
      }));
    results.push(...championshipResults);
  }

  return results;
};

// Busca específica para jogadores (página de gerenciar jogadores)
export const searchPlayers = (query: string, types: string[] = ['player']): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchQuery = query.toLowerCase();
  
  return detailedPlayersStats
    .filter(player =>
      player.nickname.toLowerCase().includes(searchQuery) ||
      player.name.toLowerCase().includes(searchQuery) ||
      player.team_name.toLowerCase().includes(searchQuery) ||
      player.phone.includes(searchQuery)
    )
    .map(player => ({
      id: player.participant_id,
      name: player.nickname,
      type: 'player',
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
        assists: player.total_assists
      }
    }));
};

// Busca específica para equipes (página de gerenciar equipes)
export const searchTeams = (query: string, types: string[] = ['team']): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchQuery = query.toLowerCase();
  
  return detailedTeamsStats
    .filter(team =>
      team.name.toLowerCase().includes(searchQuery) ||
      team.manager_name.toLowerCase().includes(searchQuery)
    )
    .map(team => ({
      id: team.team_id,
      name: team.name,
      type: 'team',
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
        championshipsWon: team.championships_won
      }
    }));
};

// Busca específica para campeonatos
export const searchChampionships = (query: string, types: string[] = ['championship']): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchQuery = query.toLowerCase();
  
  return detailedChampionshipsStats
    .filter(championship =>
      championship.name.toLowerCase().includes(searchQuery) ||
      championship.description.toLowerCase().includes(searchQuery) ||
      championship.location.toLowerCase().includes(searchQuery) ||
      championship.organizer_name.toLowerCase().includes(searchQuery)
    )
    .map(championship => ({
      id: championship.championship_id,
      name: championship.name,
      type: 'championship',
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
        format: championship.format
      }
    }));
};

// Busca mista para jogadores e equipes (útil para algumas páginas)
export const searchPlayersAndTeams = (query: string, types: string[] = ['player', 'team']): SearchResult[] => {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  
  if (types.includes('player')) {
    results.push(...searchPlayers(query));
  }
  
  if (types.includes('team')) {
    results.push(...searchTeams(query));
  }
  
  return results;
};

// Função auxiliar para converter status
const getStatusText = (status: string): string => {
  switch (status) {
    case 'ongoing': return 'Em Andamento';
    case 'completed': return 'Finalizado';
    case 'upcoming': return 'Próximo';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

// Busca específica para participações em campeonatos
export const searchChampionshipParticipations = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchQuery = query.toLowerCase();
  
  return championshipParticipations
    .filter(participation =>
      participation.championship_name.toLowerCase().includes(searchQuery)
    )
    .map(participation => ({
      id: participation.championship_id,
      name: participation.championship_name,
      type: 'championship_participation',
      subtitle: `${participation.matches_played} partidas - ${participation.status}`,      metadata: {
        status: participation.status,
        matchesPlayed: participation.matches_played
      }
    }));
};