'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Crown,
  Target,
  Trophy,
  Calendar,
  Users,
  Star,
  Swords,
  Shield,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetChampionshipById } from '@/services/championshipService';
import { useGetTeamById } from '@/services/teamService';
import { useGetAllParticipants } from '@/services/participantService';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetAllMatches, useGetChampionshipTeamHistory } from '@/services/matchService';
import PublicLayout from '@/components/layout/PublicLayout';

interface PageProps {
  params: Promise<{
    id: string;
    teamId: string;
  }>;
}

export default function TeamPublicPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'matches' | 'stats'>('overview');
  const router = useRouter();

  const resolvedParams = use(params);
  const championshipId = parseInt(resolvedParams.id);
  const teamId = parseInt(resolvedParams.teamId);

  // Fetch championship data using React Query (API)
  const {
    data: championship,
    isLoading: isLoadingChampionship,
    isError: isChampionshipError,
  } = useGetChampionshipById(championshipId);

  // Fetch team data using React Query (API)
  const {
    data: team,
    isLoading: isLoadingTeam,
    isError: isTeamError,
  } = useGetTeamById(teamId);

  // Fetch participants data
  const {
    data: allParticipants = [],
    isLoading: isLoadingParticipants,
    isError: isParticipantsError,
  } = useGetAllParticipants();
  // Fetch subscriptions to verify team is in championship
  const {
    data: subscriptionsData = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useGetAllSubscriptions();

  // Fetch matches to show team matches in this championship
  const {
    data: allMatches = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
  } = useGetAllMatches();

  // Fetch team statistics for this championship
  const {
    data: teamStatistics = {},
    isLoading: isLoadingStatistics,
  } = useGetChampionshipTeamHistory(championshipId);

  // Show loading state
  if (isLoadingChampionship || isLoadingTeam || isLoadingParticipants || isLoadingSubscriptions || isLoadingMatches || isLoadingStatistics) {
    return (
      <PublicLayout title="Carregando...">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Carregando equipe...</p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Show error state or not found
  if (isChampionshipError || isTeamError || !championship || !team) {
    notFound();
  }

  // Check if team is subscribed to this championship
  const isTeamInChampionship = subscriptionsData.some(
    sub => sub.championship_id === championshipId && sub.team_id === teamId
  );

  if (!isTeamInChampionship) {
    notFound();
  }
  // Filter participants for this team
  const participants = allParticipants.filter(p => p.team_id === teamId);
  const players = participants.filter(p => !p.is_coach);
  const coaches = participants.filter(p => p.is_coach);

  // Filter matches for this team in this championship
  const teamMatches = allMatches.filter(match =>
    match.championship_id === championshipId &&
    (match.teamA_id === teamId || match.teamB_id === teamId)
  );

  // Get real statistics from matches or default to 0
  const stats = teamStatistics[teamId] || {
    wins: 0,
    losses: 0,
    total_matches: 0,
    win_rate: 0
  };

  const teamStats = {
    wins: stats.wins,
    losses: stats.losses,
    winRate: stats.win_rate,
    totalMatches: stats.total_matches,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Agendada: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Agendada' },
      Planejada: { color: 'bg-orange-500/20 text-orange-400', label: 'Planejada' },
      Finalizada: { color: 'bg-green-500/20 text-green-400', label: 'Finalizada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500/20 text-gray-400', label: status };
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }; const getMatchResult = (match: any) => {
    if (match.status !== 'Finalizada' || !match.score) return null;

    const isTeamA = match.TeamA.team_id === teamId;
    const teamScore = isTeamA ? match.score.teamA : match.score.teamB;
    const opponentScore = isTeamA ? match.score.teamB : match.score.teamA;

    return {
      won: teamScore > opponentScore,
      score: `${teamScore} - ${opponentScore}`,
      opponent: isTeamA ? match.TeamB.name : match.TeamA.name
    };
  };
  return (
    <PublicLayout title={`${team.name} - ${championship.name}`}>
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
      </div>

      {/* Team Banner */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {team.name}
                    </h1>
                    <p className="text-slate-300">Manager: {coaches.length > 0 ? coaches[0].name : 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{teamStats.wins}V - {teamStats.losses}D</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{teamStats.totalMatches > 0 ? Math.round(teamStats.winRate * 100) : 0}% WR</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <User className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{players.length} jogadores</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'players', label: 'Jogadores' },
              { id: 'matches', label: 'Partidas' },
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
            {/* Team Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Informações da Equipe</h3>
              <div className="space-y-4">                <div>
                <label className="text-slate-400 text-sm">Manager</label>
                <p className="text-white">{coaches.length > 0 ? coaches[0].name : 'N/A'}</p>
              </div>
                <div>
                  <label className="text-slate-400 text-sm">Participantes</label>
                  <p className="text-white">{participants.length} membros</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Histórico Geral</label>
                  <p className="text-white">{teamStats.wins} vitórias - {teamStats.losses} derrotas</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Taxa de Vitória</label>
                  <p className="text-white">{teamStats.totalMatches > 0 ? Math.round(teamStats.winRate * 100) : 0}%</p>
                </div>
              </div>
            </div>            {/* Recent Matches */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Partidas</h3>
              <div className="space-y-3">
                {teamMatches.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <p>Nenhuma partida encontrada para esta equipe no campeonato</p>
                  </div>
                ) : (
                  teamMatches.slice(0, 3).map((match) => {
                    const result = getMatchResult(match);
                    const isTeamA = match.TeamA.team_id === teamId;
                    const opponent = isTeamA ? match.TeamB.name : match.TeamA.name;

                    return (
                      <div key={match.match_id} className="bg-slate-700 rounded p-3 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">vs {opponent}</div>
                          <div className="text-slate-400 text-sm">{match.stage} • {match.map}</div>
                        </div>
                        <div className="text-right">
                          {match.score ? (
                            <div className="text-white font-mono">
                              {isTeamA ? match.score.teamA : match.score.teamB} - {isTeamA ? match.score.teamB : match.score.teamA}
                            </div>
                          ) : (
                            <div className="text-slate-400 text-sm">
                              {match.status === 'Planejada' ? 'À Agendar' : formatDateTime(match.date)}
                            </div>
                          )}
                          {result && (
                            <div className={`text-xs ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                              {result.won ? 'Vitória' : 'Derrota'}
                            </div>
                          )}
                          {getStatusBadge(match.status) && (
                            <div className="mt-1">
                              {getStatusBadge(match.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="space-y-6">
            {/* Coaches */}
            {coaches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  Técnicos
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coaches.map((coach) => (
                    <div key={coach.participant_id} className="bg-slate-800 border border-slate-700 rounded-md p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Crown className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{coach.nickname}</h3>
                          <p className="text-slate-400 text-sm">{coach.name}</p>
                          <p className="text-slate-500 text-xs">{calculateAge(coach.birth_date)} anos</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Swords className="w-6 h-6 text-red-500 mr-2" />
                Jogadores
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player) => (
                  <div key={player.participant_id} className="bg-slate-800 border border-slate-700 rounded-md p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{player.nickname}</h3>
                          <p className="text-slate-400 text-sm">{player.name}</p>
                          <p className="text-slate-500 text-xs">{calculateAge(player.birth_date)} anos</p>
                        </div>
                      </div>
                      {/* Static MVP count - 0 since no statistics available */}
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 text-sm font-medium">0</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Static values since no participant statistics are available */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Agente Favorito</span>
                        <span className="text-white text-sm font-medium">N/A</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">KDA</span>
                        <span className="text-white text-sm font-medium">0.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">WR</span>
                        <span className="text-green-400 text-sm font-medium">0%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}        {activeTab === 'matches' && (
          <div className="space-y-6">
            {teamMatches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">Nenhuma partida encontrada para esta equipe no campeonato.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {teamMatches.map((match) => (
                  <Card key={match.match_id} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-8">
                          {/* Team A */}
                          <div className="text-center min-w-[120px]">
                            <h3 className="font-semibold text-white">{match.TeamA.name}</h3>
                            {match.score && (
                              <div className="text-2xl font-bold text-red-500 mt-1">
                                {match.score.teamA}
                              </div>
                            )}
                          </div>

                          {/* VS */}
                          <div className="text-center">
                            <span className="text-lg font-bold text-slate-400">VS</span>
                            {match.score && (
                              <div className="text-sm text-slate-400 mt-1">
                                {match.score.teamA} - {match.score.teamB}
                              </div>
                            )}
                          </div>

                          {/* Team B */}
                          <div className="text-center min-w-[120px]">
                            <h3 className="font-semibold text-white">{match.TeamB.name}</h3>
                            {match.score && (
                              <div className="text-2xl font-bold text-red-500 mt-1">
                                {match.score.teamB}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="flex items-center text-slate-300 mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{match.map}</span>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {match.stage}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center text-slate-300 mb-1">
                            <Clock className="w-4 h-4 mr-1" />                            <span className="text-sm">
                              {match.status === 'Planejada' ? 'À Agendar' : formatDateTime(match.date)}
                            </span>
                          </div>
                          {getStatusBadge(match.status)}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/campeonatos/${championshipId}/partidas/${match.match_id}`)}
                          className="border-slate-600 text-slate-300 hover:text-white"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Estatísticas da Equipe</h2>

            {/* Team Stats */}
            <div className="grid md:grid-cols-3 gap-6">              <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">0</div>
              <div className="text-slate-400 text-sm">Campeonatos Ganhos</div>
            </div>

              <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{teamStats.totalMatches > 0 ? Math.round(teamStats.winRate * 100) : 0}%</div>
                <div className="text-slate-400 text-sm">Taxa de Vitória</div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{players.length}</div>
                <div className="text-slate-400 text-sm">Jogadores Ativos</div>
              </div>
            </div>

            {/* Player Stats Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Estatísticas dos Jogadores</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Jogador
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        KDA
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        K
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        D
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        A
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        MVP
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        WR%
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">                    {players.map((player) => (
                    <tr key={player.participant_id} className="hover:bg-slate-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{player.nickname}</div>
                            <div className="text-slate-400 text-sm">{player.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-white font-semibold">
                        0.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-green-400">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-red-400">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-blue-400">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-yellow-500 font-medium">0</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-300">
                        0%
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}