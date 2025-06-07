'use client';
import { notFound } from 'next/navigation';
import { getChampionshipById, getMatchesByChampionshipId, getTeamsByChampionshipId } from '@/data/public-mock';
import PublicLayout from '@/components/layout/PublicLayout';
import { ChampionshipDetails } from '@/components/public/ChampionshipDetails';
import { Calendar, MapPin, Trophy, Users, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ChampionshipPublicPage({ params }: PageProps) {
  const championshipId = parseInt(params.id);
  const championship = getChampionshipById(championshipId);
  const matches = getMatchesByChampionshipId(championshipId);
  const teams = getTeamsByChampionshipId(championshipId);

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
                    <Trophy className="w-4 h-4 text-red-500" />
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

      {/* Championship Details with Search */}
      <div className="container mx-auto px-4 py-8">
        <ChampionshipDetails 
          championshipId={championshipId}
          championshipName={championship.name}
          matches={matches}
          teams={teams}
        />
      </div>
    </PublicLayout>
  );
}