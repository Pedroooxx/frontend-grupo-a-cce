'use client'
import { useState } from 'react';
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
  Play,
  CheckCircle,
  Circle,
  TrendingUp
} from 'lucide-react';
import { 
  getChampionshipById, 
  getTeamByChampionshipAndTeamId,
  getParticipantsByTeamId,
  getTeamMatchesInChampionship,
  getStandingsByChampionshipId
} from '@/data/public-mock';
import PublicLayout from '@/components/layout/PublicLayout';

interface PageProps {
  params: {
    id: string;
    teamId: string;
  };
}

export default function TeamPublicPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'matches' | 'stats'>('overview');
  
  const championshipId = parseInt(params.id);
  const teamId = parseInt(params.teamId);
  
  const championship = getChampionshipById(championshipId);
  const team = getTeamByChampionshipAndTeamId(championshipId, teamId);
  const participants = getParticipantsByTeamId(teamId);
  const teamMatches = getTeamMatchesInChampionship(championshipId, teamId);
  const standings = getStandingsByChampionshipId(championshipId);
  
  if (!championship || !team) {
    notFound();
  }

  const teamStanding = standings.find(s => s.team_id === teamId);
  const players = participants.filter(p => !p.is_coach);
  const coaches = participants.filter(p => p.is_coach);

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'live':
        return <Play className="w-4 h-4 text-red-400" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
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
  };

  const getMatchResult = (match: any) => {
    if (match.status !== 'completed' || !match.score) return null;
    
    const isTeamA = match.teamA.team_id === teamId;
    const teamScore = isTeamA ? match.score.teamA : match.score.teamB;
    const opponentScore = isTeamA ? match.score.teamB : match.score.teamA;
    
    return {
      won: teamScore > opponentScore,
      score: `${teamScore} - ${opponentScore}`,
      opponent: isTeamA ? match.teamB.name : match.teamA.name
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
                    <p className="text-slate-300">Manager: {team.manager_name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {teamStanding && (
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{teamStanding.position}º lugar</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{team.wins}V - {team.losses}D</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{Math.round(team.win_rate * 100)}% WR</span>
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
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
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
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Manager</label>
                  <p className="text-white">{team.manager_name}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Participantes</label>
                  <p className="text-white">{team.participants_count} membros</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Histórico Geral</label>
                  <p className="text-white">{team.wins} vitórias - {team.losses} derrotas</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Taxa de Vitória</label>
                  <p className="text-white">{Math.round(team.win_rate * 100)}%</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Campeonatos Participados</label>
                  <p className="text-white">{team.championships_participated}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Campeonatos Ganhos</label>
                  <p className="text-yellow-500 font-semibold">{team.championships_won}</p>
                </div>
              </div>
            </div>            {/* Recent Matches */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Partidas Recentes</h3>
              <div className="space-y-3">
                {teamMatches.slice(0, 3).map((match) => {
                  const result = getMatchResult(match);
                  return (
                    <Link
                      key={match.match_id}
                      href={`/campeonatos/${championshipId}/partidas/${match.match_id}`}
                      className="block bg-slate-700 rounded-md p-4 hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{match.stage}</span>
                        {getMatchStatusIcon(match.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <span>vs {result?.opponent || (match.teamA.team_id === teamId ? match.teamB.name : match.teamA.name)}</span>
                          {result && (
                            <span className={`ml-2 font-semibold ${result.won ? 'text-green-500' : 'text-red-500'}`}>
                              {result.score}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {result && (
                            <span className={`text-sm font-medium ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                              {result.won ? 'Vitória' : 'Derrota'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-slate-400 text-sm mt-2">
                        {match.map} • {formatDateTime(match.date)}
                      </div>
                    </Link>
                  );
                })}
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
                      {player.mvp_count > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-500 text-sm font-medium">{player.mvp_count}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {player.favorite_agent && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Agente Favorito</span>
                          <span className="text-white text-sm font-medium">{player.favorite_agent}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">KDA</span>
                        <span className="text-white text-sm font-medium">{player.kda_ratio.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">WR</span>
                        <span className="text-green-400 text-sm font-medium">{Math.round(player.win_rate * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}        {activeTab === 'matches' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">Partidas no Campeonato</h3>
            {teamMatches.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Nenhuma partida encontrada para esta equipe no campeonato.
              </div>
            ) : (
              teamMatches.map((match) => {
                const result = getMatchResult(match);
                const isTeamA = match.teamA.team_id === teamId;
                const opponent = isTeamA ? match.teamB.name : match.teamA.name;
                
                return (
                  <Link 
                    key={match.match_id}
                    href={`/campeonatos/${championshipId}/partidas/${match.match_id}`}
                    className="block"
                  >
                    <div className="bg-slate-800 border border-slate-700 rounded-md p-6 hover:bg-slate-750 transition-colors cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          {getMatchStatusIcon(match.status)}
                          <div>
                            <div className="flex items-center space-x-4 text-white">
                              <span className="font-medium">{match.teamA.name}</span>
                              <span className="text-slate-400">vs</span>
                              <span className="font-medium">{match.teamB.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-400 text-sm mt-1">
                              <span>{match.stage}</span>
                              <span>•</span>
                              <span>{match.map}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {match.score && (
                            <div className="text-white font-mono">
                              {match.score.teamA} - {match.score.teamB}
                            </div>
                          )}
                          {result && (
                            <div className={`px-2 py-1 rounded text-sm ${
                              result.won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {result.won ? 'Vitória' : 'Derrota'}
                            </div>
                          )}
                          <div className="text-slate-400 text-sm">
                            {formatDateTime(match.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Estatísticas da Equipe</h2>
            
            {/* Team Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{team.championships_won}</div>
                <div className="text-slate-400 text-sm">Campeonatos Ganhos</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{Math.round(team.win_rate * 100)}%</div>
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
                  <tbody className="divide-y divide-slate-700">
                    {players.map((player) => (
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
                          {player.kda_ratio.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-green-400">
                          {player.total_kills}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-red-400">
                          {player.total_deaths}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-blue-400">
                          {player.total_assists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-yellow-500 font-medium">{player.mvp_count}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-slate-300">
                          {Math.round(player.win_rate * 100)}%
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