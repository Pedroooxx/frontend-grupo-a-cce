'use client'
import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Target,
  Clock,
  Play,
  CheckCircle,
  Circle,
  Crown,
  Sword,
  Shield,
  Star
} from 'lucide-react';
import { useGetChampionshipById } from '@/services/championshipService';
import { useGetMatchById } from '@/services/matchService';
import { useGetTeamById } from '@/services/teamService';
import PublicLayout from '@/components/layout/PublicLayout';

interface PageProps {
  params: Promise<{
    id: string;
    matchId: string;
  }>;
}

/**
 * Match Public Page Component
 * 
 * Displays detailed match information including teams, participants, and placeholder statistics.
 * Since match statistics are not available in the API, all stats are displayed as 0.
 * Team participants are fetched from the teams API and displayed with their nicknames.
 * 
 * @param {PageProps} props - Component props containing championship ID and match ID
 * @returns {JSX.Element} The match details page
 */
export default function MatchPublicPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats'>('overview');

  // Unwrap params promise for Next.js 15+
  const resolvedParams = use(params);
  const championshipId = parseInt(resolvedParams.id);
  const matchId = parseInt(resolvedParams.matchId);
  // Fetch data from API
  const {
    data: championship,
    isLoading: isLoadingChampionship,
    isError: isChampionshipError
  } = useGetChampionshipById(championshipId);

  const {
    data: match,
    isLoading: isLoadingMatch,
    isError: isMatchError
  } = useGetMatchById(matchId);

  // Fetch team data for both teams to get participant information
  const {
    data: teamA,
    isLoading: isLoadingTeamA,
  } = useGetTeamById(match?.TeamA?.team_id || 0, !!match?.TeamA?.team_id);

  const {
    data: teamB,
    isLoading: isLoadingTeamB,
  } = useGetTeamById(match?.TeamB?.team_id || 0, !!match?.TeamB?.team_id);
  // Loading state
  if (isLoadingChampionship || isLoadingMatch || isLoadingTeamA || isLoadingTeamB) {
    return (
      <PublicLayout title="Carregando...">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Carregando partida...</p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }
  // Error or not found
  if (isChampionshipError || isMatchError || !championship || !match) {
    notFound();
  }

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case 'Finalizada':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Marcada':
      case 'Agendada':
        return <Play className="w-5 h-5 text-red-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'Agendada': { color: 'bg-yellow-500/20 text-yellow-400', label: 'Agendada' },
      'Marcada': { color: 'bg-red-500/20 text-red-400', label: 'Marcada' },
      'Finalizada': { color: 'bg-green-500/20 text-green-400', label: 'Finalizada' }
    };
    const config = statusConfig[status] || { color: 'bg-gray-500/20 text-gray-400', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get participants for each team (excluding coaches for stats display)
  const teamAParticipants = teamA?.Participants?.filter(p => !p.is_coach) || [];
  const teamBParticipants = teamB?.Participants?.filter(p => !p.is_coach) || [];
  // Since stats don't exist in API, create placeholder stats with 0 values
  const createPlayerStats = (participants: any[]) => {
    if (!participants || participants.length === 0) {
      return [];
    }
    return participants.map((participant) => ({
      participant_id: participant.participant_id,
      participant_name: participant.name,
      participant_nickname: participant.nickname,
      agent_name: 'N/A', // No agent data available
      kills: 0,
      deaths: 0,
      assists: 0,
      total_score: 0,
      mvp: false // No one is MVP with 0 stats
    }));
  };

  const teamAStats = createPlayerStats(teamAParticipants);
  const teamBStats = createPlayerStats(teamBParticipants);

  const getKDA = (kills: number, deaths: number, assists: number) => {
    return deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);
  };
  return (
    <PublicLayout title={`${match?.TeamA?.name || 'Time A'} vs ${match?.TeamB?.name || 'Time B'}`}>
      {/* Back Navigation */}
      <div className="bg-slate-800 py-4">
        <div className="container mx-auto px-4">
          <Link
            href={`/campeonatos/${championship.championship_id}`}
            className="flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para {championship.name}
          </Link>
        </div>
      </div>      {/* Match Banner */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                {getMatchStatusIcon(match.status)}
                {getStatusBadge(match.status)}
              </div>

              <div className="grid grid-cols-3 items-center gap-8 mb-6">
                {/* Team A */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>                  <h2 className="text-2xl font-bold text-white">{match?.TeamA?.name || 'Time A'}</h2>
                  {match.score && (
                    <div className="text-4xl font-bold text-red-500 mt-2">
                      {match.score.teamA}
                    </div>
                  )}
                </div>

                {/* VS and Match Info */}
                <div className="text-center">
                  <div className="text-slate-400 text-lg mb-2">VS</div>
                  {match.winner_team_id && (
                    <div className="flex items-center justify-center text-yellow-500 mb-2">
                      <Crown className="w-5 h-5 mr-1" />                      <span className="text-sm">
                        Vencedor: {match.winner_team_id === match?.TeamA?.team_id ? match?.TeamA?.name : match?.TeamB?.name}
                      </span>
                    </div>
                  )}
                  <div className="text-slate-300 text-sm">
                    <div>{match.stage}</div>
                    <div className="flex items-center justify-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {match.map}
                    </div>
                  </div>
                </div>

                {/* Team B */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>                  <h2 className="text-2xl font-bold text-white">{match?.TeamB?.name || 'Time B'}</h2>
                  {match.score && (
                    <div className="text-4xl font-bold text-red-500 mt-2">
                      {match.score.teamB}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-slate-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  <span>{formatDateTime(match.date)}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-red-500" />
                  <span>{match.bracket}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-4">          <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'stats', label: 'Estatísticas' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-2 border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Match Details */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Detalhes da Partida</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Campeonato</label>
                  <p className="text-white">{championship.name}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Fase</label>
                  <p className="text-white">{match.stage}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Mapa</label>
                  <p className="text-white">{match.map}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Chave</label>
                  <p className="text-white capitalize">{match.bracket}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Data e Hora</label>
                  <p className="text-white">{formatDateTime(match.date)}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(match.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Resumo da Partida</h3>
              {match.status === 'Finalizada' && match.score ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {match.score.teamA} - {match.score.teamB}
                    </div>
                    {match.winner_team_id && (
                      <div className="flex items-center justify-center text-yellow-500">
                        <Crown className="w-5 h-5 mr-2" />                        <span>
                          Vitória: {match.winner_team_id === match?.TeamA?.team_id ? match?.TeamA?.name : match?.TeamB?.name}
                        </span>
                      </div>)}
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-white font-semibold">{match?.TeamA?.name || 'Time A'}</div>
                        <div className="text-slate-400 text-sm mt-1">
                          {teamAStats.length} jogadores
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{match?.TeamB?.name || 'Time B'}</div>
                        <div className="text-slate-400 text-sm mt-1">
                          {teamBStats.length} jogadores
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">0 - 0</div>
                    <div className="text-center text-slate-400">Resultados após a partida</div>
                  </div>                  <div className="border-t border-slate-700 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-white font-semibold">{match?.TeamA?.name || 'Time A'}</div>
                        <div className="text-slate-400 text-sm mt-1">
                          {teamAParticipants.length} jogadores
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{match?.TeamB?.name || 'Time B'}</div>
                        <div className="text-slate-400 text-sm mt-1">
                          {teamBParticipants.length} jogadores
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Team A Stats */}            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-500" />
                {match?.TeamA?.name || 'Time A'}
              </h3>
              <div className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">Jogador</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">Agente</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">K</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">D</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">A</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">KDA</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">Score</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">MVP</th>
                      </tr>
                    </thead>                    <tbody className="divide-y divide-slate-700">
                      {teamAStats.length > 0 ? (
                        teamAStats.map((stat) => (
                          <tr key={stat.participant_id} className="hover:bg-slate-750">
                            <td className="px-4 py-3 text-white">
                              <div>
                                <div className="font-medium">{stat.participant_nickname}</div>
                                <div className="text-sm text-slate-400">{stat.participant_name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">{stat.agent_name}</td>
                            <td className="px-4 py-3 text-center text-green-400">{stat.kills}</td>
                            <td className="px-4 py-3 text-center text-red-400">{stat.deaths}</td>
                            <td className="px-4 py-3 text-center text-blue-400">{stat.assists}</td>
                            <td className="px-4 py-3 text-center text-white font-semibold">
                              {getKDA(stat.kills, stat.deaths, stat.assists)}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">{stat.total_score}</td>
                            <td className="px-4 py-3 text-center">
                              {stat.mvp && <Star className="w-4 h-4 text-yellow-500 mx-auto" />}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                            Nenhum jogador encontrado para esta equipe
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Team B Stats */}            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-500" />
                {match?.TeamB?.name || 'Time B'}
              </h3>
              <div className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">Jogador</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">Agente</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">K</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">D</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">A</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">KDA</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">Score</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase">MVP</th>
                      </tr>
                    </thead>                    <tbody className="divide-y divide-slate-700">
                      {teamBStats.length > 0 ? (
                        teamBStats.map((stat) => (
                          <tr key={stat.participant_id} className="hover:bg-slate-750">
                            <td className="px-4 py-3 text-white">
                              <div>
                                <div className="font-medium">{stat.participant_nickname}</div>
                                <div className="text-sm text-slate-400">{stat.participant_name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">{stat.agent_name}</td>
                            <td className="px-4 py-3 text-center text-green-400">{stat.kills}</td>
                            <td className="px-4 py-3 text-center text-red-400">{stat.deaths}</td>
                            <td className="px-4 py-3 text-center text-blue-400">{stat.assists}</td>
                            <td className="px-4 py-3 text-center text-white font-semibold">
                              {getKDA(stat.kills, stat.deaths, stat.assists)}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">{stat.total_score}</td>
                            <td className="px-4 py-3 text-center">
                              {stat.mvp && <Star className="w-4 h-4 text-yellow-500 mx-auto" />}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                            Nenhum jogador encontrado para esta equipe
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}