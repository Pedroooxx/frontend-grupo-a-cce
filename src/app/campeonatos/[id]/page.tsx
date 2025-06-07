'use client'
import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Clock, 
  Target,
  Crown,
  Play,
  CheckCircle,
  Circle
} from 'lucide-react';
import { getChampionshipById, getMatchesByChampionshipId, getStandingsByChampionshipId } from '@/data/public-mock';
import PublicLayout from '@/components/layout/PublicLayout';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ChampionshipPublicPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'standings'>('overview');
  
  const championship = getChampionshipById(parseInt(params.id));
  const matches = getMatchesByChampionshipId(parseInt(params.id));
  const standings = getStandingsByChampionshipId(parseInt(params.id));

  if (!championship) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Em Breve' },
      ongoing: { color: 'bg-green-500/20 text-green-400', label: 'Em Andamento' },
      completed: { color: 'bg-blue-500/20 text-blue-400', label: 'Finalizado' },
      cancelled: { color: 'bg-red-500/20 text-red-400', label: 'Cancelado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

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
  return (
    <PublicLayout title={championship.name}>
      {/* Championship Banner */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {championship.name}
                  </h1>
                  {getStatusBadge(championship.status)}
                </div>
                
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {championship.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Users className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{championship.teams_count} equipes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{championship.matches_count} partidas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{formatDate(championship.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{championship.location}</span>
                  </div>
                </div>
                
                {championship.prize_pool && (
                  <div className="mt-4 flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-500 font-semibold">
                      Premiação: {championship.prize_pool}
                    </span>
                  </div>
                )}
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
              { id: 'matches', label: 'Partidas' },
              { id: 'standings', label: 'Classificação' }
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
            {/* Championship Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Informações do Campeonato</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Formato</label>
                  <p className="text-white capitalize">{championship.format.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Período</label>
                  <p className="text-white">
                    {formatDate(championship.start_date)} - {formatDate(championship.end_date)}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Local</label>
                  <p className="text-white">{championship.location}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(championship.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Partidas Recentes</h3>              <div className="space-y-3">
                {matches.slice(0, 3).map((match) => (
                  <div key={match.match_id} className="bg-slate-700 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">{match.stage}</span>
                      {getMatchStatusIcon(match.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <span>{match.teamA.name}</span>
                        {match.score && (
                          <span className="ml-2 text-red-500 font-semibold">
                            {match.score.teamA}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm">VS</div>
                      <div className="text-white text-right">
                        {match.score && (
                          <span className="mr-2 text-red-500 font-semibold">
                            {match.score.teamB}
                          </span>
                        )}
                        <span>{match.teamB.name}</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm mt-2">
                      {match.map} • {formatDateTime(match.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Todas as Partidas</h2>
            {matches.map((match) => (
              <div key={match.match_id} className="bg-slate-800 border border-slate-700 rounded-md p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {match.stage}
                      </span>
                      {getMatchStatusIcon(match.status)}
                      <span className="text-slate-400 text-sm capitalize">{match.status}</span>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-start md:gap-8">
                      <div className="text-center">
                        <div className="text-white font-semibold">{match.teamA.name}</div>
                        {match.score && (
                          <div className="text-2xl font-bold text-red-500 mt-1">
                            {match.score.teamA}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-slate-400 text-sm px-4">VS</div>
                      
                      <div className="text-center">
                        <div className="text-white font-semibold">{match.teamB.name}</div>
                        {match.score && (
                          <div className="text-2xl font-bold text-red-500 mt-1">
                            {match.score.teamB}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-slate-400 text-sm">{match.map}</div>
                    <div className="text-slate-300">{formatDateTime(match.date)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'standings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Classificação</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Equipe
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        J
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        V
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        D
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        WR%
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        RD
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {standings.map((team, index) => (
                      <tr key={team.team_id} className="hover:bg-slate-750 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              index === 0 ? 'bg-yellow-500 text-black' :
                              index === 1 ? 'bg-slate-400 text-black' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-slate-600 text-slate-300'
                            }`}>
                              {team.position}
                            </span>
                          </div>
                        </td>                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            href={`/campeonatos/${championship.championship_id}/equipes/${team.team_id}`}
                            className="text-white font-medium hover:text-red-400 transition-colors"
                          >
                            {team.team_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-slate-300">
                          {team.matches_played}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-green-400">
                          {team.wins}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-red-400">
                          {team.losses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-slate-300">
                          {Math.round(team.win_rate * 100)}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-center ${
                          team.round_diff > 0 ? 'text-green-400' : 
                          team.round_diff < 0 ? 'text-red-400' : 'text-slate-300'
                        }`}>
                          {team.round_diff > 0 ? '+' : ''}{team.round_diff}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-white font-semibold">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>          </div>
        )}
      </div>
    </PublicLayout>
  );
}