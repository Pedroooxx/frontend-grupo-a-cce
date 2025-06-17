'use client';

import { useState } from 'react';
import { Calendar, MapPin, Trophy, Users, Clock, Star, Target, Crown, Zap, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getStandingsByChampionshipId, getChampionshipById } from '@/data/search-functions';

interface Match {
  match_id: number;
  championship_id: number;
  teamA: { team_id: number; name: string };
  teamB: { team_id: number; name: string };
  date: string;
  stage: string;
  bracket: string;
  map: string;
  status: string;
  score?: { teamA: number; teamB: number };
  winner_team_id?: number;
}

interface Team {
  team_id: number;
  name: string;
  manager_name: string;
  wins: number;
  losses: number;
  win_rate: number;
  participants_count: number;
}

interface ChampionshipDetailsProps {
  championshipId: number;
  championshipName: string;
  matches: Match[];
  teams: Team[];
}

export function ChampionshipDetails({
  championshipId,
  championshipName,
  matches,
  teams
}: ChampionshipDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'matches' | 'teams'>('overview');
  const router = useRouter();

  const championship = getChampionshipById(championshipId);
  const standings = getStandingsByChampionshipId(championshipId);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Agendada' },
      live: { color: 'bg-red-500/20 text-red-400', label: 'Ao Vivo' },
      completed: { color: 'bg-green-500/20 text-green-400', label: 'Finalizada' },
      postponed: { color: 'bg-orange-500/20 text-orange-400', label: 'Adiada' },
      cancelled: { color: 'bg-gray-500/20 text-gray-400', label: 'Cancelada' },
      upcoming: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Em Breve' },
      ongoing: { color: 'bg-green-500/20 text-green-400', label: 'Em Andamento' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500/20 text-gray-400', label: status };
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
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

  return (
    <div className="space-y-8">      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'bracket', label: 'Chaveamento' },
            { id: 'matches', label: 'Partidas', count: matches.length },
            { id: 'teams', label: 'Equipes', count: teams.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-2 border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
              {tab.label} {tab.count ? `(${tab.count})` : ''}
            </button>
          ))}
        </nav>
      </div>      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Championship Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{teams.length}</div>
              <div className="text-slate-400 text-sm">Equipes Participantes</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{matches.length}</div>
              <div className="text-slate-400 text-sm">Partidas Totais</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{matches.filter(m => m.status === 'completed').length}</div>
              <div className="text-slate-400 text-sm">Partidas Finalizadas</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{matches.filter(m => m.status === 'scheduled').length}</div>
              <div className="text-slate-400 text-sm">Partidas Agendadas</div>
            </Card>
          </div>

          {championship && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Championship Information */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  Informações do Campeonato
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm">Formato</label>
                    <p className="text-white font-medium capitalize">{championship.format.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Período</label>
                    <p className="text-white">
                      {new Date(championship.start_date).toLocaleDateString('pt-BR')} - {new Date(championship.end_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Local</label>
                    <p className="text-white flex items-center">
                      <MapPin className="w-4 h-4 text-red-500 mr-1" />
                      {championship.location}
                    </p>
                  </div>
                  {championship.prize_pool && (
                    <div>
                      <label className="text-slate-400 text-sm">Premiação</label>
                      <p className="text-yellow-500 font-semibold flex items-center">
                        <Crown className="w-4 h-4 mr-1" />
                        {championship.prize_pool}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-slate-400 text-sm">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(championship.status)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current Standings */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 text-green-500 mr-2" />
                  Classificação Atual
                </h3>
                <div className="space-y-3">
                  {standings.slice(0, 5).map((standing, index) => (
                    <div key={standing.team_id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-amber-600 text-black' :
                              'bg-slate-600 text-white'
                          }`}>
                          {standing.position}
                        </div>
                        <span className="text-white font-medium">{standing.team_name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400 text-sm">
                          {standing.wins}V - {standing.losses}D
                        </span>
                        <span className="text-green-400 font-semibold">
                          {Math.round(standing.win_rate * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Recent Matches */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 text-red-500 mr-2" />
              Partidas Recentes
            </h3>
            <div className="space-y-4">
              {matches.filter(m => m.status === 'completed').slice(0, 3).map((match) => (
                <div key={match.match_id} className="bg-slate-700 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-white font-medium">{match.teamA.name}</div>
                        {match.score && (
                          <div className="text-red-500 font-bold text-lg">{match.score.teamA}</div>
                        )}
                      </div>
                      <span className="text-slate-400">vs</span>
                      <div className="text-center">
                        <div className="text-white font-medium">{match.teamB.name}</div>
                        {match.score && (
                          <div className="text-red-500 font-bold text-lg">{match.score.teamB}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-sm">{match.stage}</div>
                      <div className="text-slate-400 text-sm">{match.map}</div>
                      <Badge className="bg-green-500/20 text-green-400 mt-1">
                        Finalizada
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setActiveTab('matches')}
              >
                Ver Todas as Partidas
              </Button>
            </div>
          </Card>

          {/* Top Teams Preview */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Principais Equipes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.slice(0, 3).map((team) => (
                <div key={team.team_id} className="bg-slate-700 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{team.name}</h4>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {Math.round(team.win_rate * 100)}% WR
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{team.manager_name}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">{team.wins} vitórias</span>
                    <span className="text-red-400">{team.losses} derrotas</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => router.push(`/campeonatos/${championshipId}/equipes/${team.team_id}`)}
                  >
                    Ver Equipe
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setActiveTab('teams')}
              >
                Ver Todas as Equipes
              </Button>
            </div>
          </Card>        </div>
      )}      {activeTab === 'bracket' && (
        <div className="space-y-8">
          {/* Tournament Bracket */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 overflow-x-auto">
            <div className="text-center mb-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {
                  championship?.format === 'double_elimination' ? 'Eliminação Dupla' :
                    championship?.format === 'single_elimination' ? 'Eliminação Simples' :
                      championship?.format?.replace('_', ' ')
                }
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              Chaveamento do Torneio
            </h3>

            {/* Bracket Container */}
            <div className="min-w-[1200px] mx-auto relative">
              {/* Round Labels */}
              <div className="flex justify-between mb-8 text-center">
                <div className="w-48 text-slate-400 font-semibold">Oitavas de Final</div>
                <div className="w-32 text-slate-400 font-semibold">Quartas</div>
                <div className="w-32 text-slate-400 font-semibold">Semifinal</div>
                <div className="w-32 text-slate-400 font-semibold">Final</div>
                <div className="w-32 text-slate-400 font-semibold">Semifinal</div>
                <div className="w-32 text-slate-400 font-semibold">Quartas</div>
                <div className="w-48 text-slate-400 font-semibold">Oitavas de Final</div>
              </div>

              {/* Bracket Structure */}
              <div className="flex items-center justify-between relative">
                {/* Left Side - Upper Bracket */}
                <div className="space-y-4">
                  {/* Round 1 - Left Side */}
                  <div className="space-y-6">
                    {/* Match 1 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
                          <span className="text-white font-medium">Valorant Kings</span>
                          <span className="text-green-400 font-bold">13</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
                          <span className="text-slate-300">Team Alpha</span>
                          <span className="text-slate-400">8</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    </div>

                    {/* Match 2 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
                          <span className="text-white font-medium">Phoenix Squad</span>
                          <span className="text-green-400 font-bold">13</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
                          <span className="text-slate-300">Team Beta</span>
                          <span className="text-slate-400">11</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    </div>

                    {/* Match 3 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Sage Warriors</span>
                          <span className="text-yellow-400">vs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Gamma</span>
                          <span className="text-yellow-400 text-sm">16:00</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-yellow-500"></div>
                    </div>

                    {/* Match 4 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Viper Elite</span>
                          <span className="text-yellow-400">vs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Delta</span>
                          <span className="text-yellow-400 text-sm">18:00</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-yellow-500"></div>
                    </div>
                  </div>
                </div>

                {/* Quarter Finals - Left */}
                <div className="space-y-12">
                  {/* Quarter 1 */}
                  <div className="w-32 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
                        <span className="text-white text-sm">V. Kings</span>
                        <span className="text-green-400 font-bold">13</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
                        <span className="text-slate-300 text-sm">P. Squad</span>
                        <span className="text-slate-400">9</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  </div>

                  {/* Quarter 2 */}
                  <div className="w-32 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400">vs</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400 text-xs">20:00</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-yellow-500"></div>
                  </div>
                </div>

                {/* Semi Final - Left */}
                <div className="flex items-center">
                  <div className="w-32 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">V. Kings</span>
                        <span className="text-yellow-400">vs</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400 text-xs">Dom 19:00</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-pink-500 to-red-500"></div>
                  </div>
                </div>

                {/* FINAL */}
                <div className="flex items-center relative">
                  <div className="w-40 bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-lg border-2 border-yellow-500 p-4 relative shadow-lg shadow-yellow-500/20">
                    <div className="text-center mb-3">
                      <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                      <span className="text-yellow-400 font-bold text-sm">GRANDE FINAL</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white font-medium text-sm">TBD</span>
                        <span className="text-yellow-400">vs</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white font-medium text-sm">TBD</span>
                        <span className="text-yellow-400 text-xs">Dom 21:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Semi Final - Right */}
                <div className="flex items-center">
                  <div className="w-32 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400">vs</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400 text-xs">Dom 19:00</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-gradient-to-l from-pink-500 to-red-500"></div>
                  </div>
                </div>

                {/* Quarter Finals - Right */}
                <div className="space-y-12">
                  {/* Quarter 3 */}
                  <div className="w-32 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400">vs</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400 text-xs">19:00</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-yellow-500"></div>
                  </div>

                  {/* Quarter 4 */}
                  <div className="w-32 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400">vs</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-800 rounded border border-yellow-500">
                        <span className="text-white text-sm">TBD</span>
                        <span className="text-yellow-400 text-xs">21:00</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-yellow-500"></div>
                  </div>
                </div>

                {/* Right Side - Lower Bracket */}
                <div className="space-y-4">
                  {/* Round 1 - Right Side */}
                  <div className="space-y-6">
                    {/* Match 5 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Echo</span>
                          <span className="text-yellow-400">vs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Foxtrot</span>
                          <span className="text-yellow-400 text-sm">14:00</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-yellow-500"></div>
                    </div>

                    {/* Match 6 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Golf</span>
                          <span className="text-yellow-400">vs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Hotel</span>
                          <span className="text-yellow-400 text-sm">16:00</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-yellow-500"></div>
                    </div>

                    {/* Match 7 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team India</span>
                          <span className="text-yellow-400">vs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Juliet</span>
                          <span className="text-yellow-400 text-sm">18:00</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-yellow-500"></div>
                    </div>

                    {/* Match 8 */}
                    <div className="w-48 bg-slate-700 rounded-lg border border-slate-600 p-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Kilo</span>
                          <span className="text-yellow-400">vs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded border-2 border-yellow-500">
                          <span className="text-white font-medium">Team Lima</span>
                          <span className="text-yellow-400 text-sm">20:00</span>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-yellow-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Info */}
              <div className="mt-12 text-center">
                <div className="flex justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span className="text-slate-400">Partida Finalizada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-yellow-500"></div>
                    <span className="text-slate-400">Partida Agendada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-slate-400">Grande Final</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {matches.map((match) => (
              <Card key={match.match_id} className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-8">
                      {/* Team A */}
                      <div className="text-center min-w-[120px]">
                        <h3 className="font-semibold text-white">{match.teamA.name}</h3>
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
                        <h3 className="font-semibold text-white">{match.teamB.name}</h3>
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
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{formatDateTime(match.date)}</span>
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

          {matches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Nenhuma partida encontrada neste campeonato.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.team_id} className="bg-slate-800 border-slate-700 p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{team.name}</h3>
                      <p className="text-slate-400">Gerenciado por {team.manager_name}</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {Math.round(team.win_rate * 100)}% WR
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vitórias</span>
                      <span className="text-green-400 font-semibold">{team.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Derrotas</span>
                      <span className="text-red-400 font-semibold">{team.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jogadores</span>
                      <span className="text-white font-semibold">{team.participants_count}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => router.push(`/campeonatos/${championshipId}/equipes/${team.team_id}`)}
                  >
                    Ver Equipe
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Nenhuma equipe encontrada neste campeonato.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}