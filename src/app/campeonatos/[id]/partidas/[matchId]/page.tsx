'use client'
import { useState } from 'react';
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
import { 
  getChampionshipById, 
  getMatchById,
  getStatisticsByMatchId
} from '@/data/public-mock';
import PublicLayout from '@/components/layout/PublicLayout';

interface PageProps {
  params: {
    id: string;
    matchId: string;
  };
}

export default function MatchPublicPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats'>('overview');
  
  const championshipId = parseInt(params.id);
  const matchId = parseInt(params.matchId);
  
  const championship = getChampionshipById(championshipId);
  const match = getMatchById(matchId);
  const playerStats = getStatisticsByMatchId(matchId);
  
  if (!championship || !match) {
    notFound();
  }

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'live':
        return <Play className="w-5 h-5 text-red-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Agendada' },
      live: { color: 'bg-red-500/20 text-red-400', label: 'Ao Vivo' },
      completed: { color: 'bg-green-500/20 text-green-400', label: 'Finalizada' },
      postponed: { color: 'bg-orange-500/20 text-orange-400', label: 'Adiada' },
      cancelled: { color: 'bg-gray-500/20 text-gray-400', label: 'Cancelada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const teamAStats = playerStats.filter(stat => 
    stat.team_name === match.teamA.name
  );
  const teamBStats = playerStats.filter(stat => 
    stat.team_name === match.teamB.name
  );  const getKDA = (kills: number, deaths: number, assists: number) => {
    return deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);
  };

  const getMapBackground = (mapName: string) => {
    const mapImages: { [key: string]: string } = {
      'Haven': '/images/maps/haven.jpg',
      'Bind': '/images/maps/bind.jpg',
      'Split': '/images/maps/split.jpg',
      'Ascent': '/images/maps/ascent.jpg',
      'Icebox': '/images/maps/icebox.jpg',
      'Breeze': '/images/maps/breeze.jpg',
      'Fracture': '/images/maps/fracture.jpg',
      'Pearl': '/images/maps/pearl.jpg',
      'Lotus': '/images/maps/lotus.jpg',
      'Sunset': '/images/maps/sunset.jpg'
    };
    
    return mapImages[mapName] || '/images/maps/default.jpg';
  };

  return (
    <PublicLayout title={`${match.teamA.name} vs ${match.teamB.name}`}>
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
      <section 
        className="relative py-12"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.85), rgba(51, 65, 85, 0.85)), url("${getMapBackground(match.map)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
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
                  </div>
                  <h2 className="text-2xl font-bold text-white">{match.teamA.name}</h2>
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
                        Vencedor: {match.winner_team_id === match.teamA.team_id ? match.teamA.name : match.teamB.name}
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
                  </div>
                  <h2 className="text-2xl font-bold text-white">{match.teamB.name}</h2>
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
              {match.score ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {match.score.teamA} - {match.score.teamB}
                    </div>
                    {match.winner_team_id && (
                      <div className="flex items-center justify-center text-yellow-500">
                        <Crown className="w-5 h-5 mr-2" />                        <span>
                          Vitória: {match.winner_team_id === match.teamA.team_id ? match.teamA.name : match.teamB.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-700 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-white font-semibold">{match.teamA.name}</div>
                        <div className="text-slate-400 text-sm mt-1">
                          {teamAStats.length} jogadores
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{match.teamB.name}</div>
                        <div className="text-slate-400 text-sm mt-1">
                          {teamBStats.length} jogadores
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Informações da partida serão disponibilizadas após o início.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Team A Stats */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-500" />
                {match.teamA.name}
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
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {teamAStats.map((stat) => (
                        <tr key={stat.statistic_id} className="hover:bg-slate-750">
                          <td className="px-4 py-3 text-white">{stat.participant_name}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Team B Stats */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-500" />
                {match.teamB.name}
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
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {teamBStats.map((stat) => (
                        <tr key={stat.statistic_id} className="hover:bg-slate-750">
                          <td className="px-4 py-3 text-white">{stat.participant_name}</td>
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
                      ))}
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