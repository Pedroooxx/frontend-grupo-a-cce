'use client';

import { useState } from 'react';
import { Calendar, MapPin, Trophy, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PublicSearchBar } from '@/components/public/PublicSearchBar';
import { useRouter } from 'next/navigation';

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
  const [activeTab, setActiveTab] = useState<'matches' | 'teams'>('matches');
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Agendada' },
      live: { color: 'bg-red-500/20 text-red-400', label: 'Ao Vivo' },
      completed: { color: 'bg-green-500/20 text-green-400', label: 'Finalizada' },
      postponed: { color: 'bg-orange-500/20 text-orange-400', label: 'Adiada' },
      cancelled: { color: 'bg-gray-500/20 text-gray-400', label: 'Cancelada' }
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

  const handleSearchResult = (result: any) => {
    switch (result.type) {
      case 'match':
        router.push(`/campeonatos/${championshipId}/partidas/${result.id}`);
        break;
      case 'team':
        router.push(`/campeonatos/${championshipId}/equipes/${result.id}`);
        break;
      case 'championship':
        router.push(`/campeonatos/${result.id}`);
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <PublicSearchBar 
          placeholder="Buscar partidas, equipes ou outros campeonatos..."
          onResultClick={handleSearchResult}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {[
            { id: 'matches', label: 'Partidas', count: matches.length },
            { id: 'teams', label: 'Equipes', count: teams.length }
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
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