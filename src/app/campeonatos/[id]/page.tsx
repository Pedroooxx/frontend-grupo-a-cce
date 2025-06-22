'use client';
import { notFound } from 'next/navigation';
import { useGetChampionshipById, useGetChampionshipMatches } from '@/services/championshipService';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { getMatchesByChampionshipId, getTeamsByChampionshipId } from '@/data/search-functions';
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

  // Fetch championship data using React Query (API)
  const {
    data: championship,
    isLoading: isLoadingChampionship,
    isError: isChampionshipError,
  } = useGetChampionshipById(championshipId);

  // Fetch subscriptions to count teams for this championship
  const {
    data: subscriptionsData = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useGetAllSubscriptions();

  // Fetch matches for this championship to count them
  const {
    data: championshipMatches = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
  } = useGetChampionshipMatches(championshipId);

  // For now, keep using mock data for matches and teams as requested for ChampionshipDetails component
  const matches = getMatchesByChampionshipId(championshipId);
  const teams = getTeamsByChampionshipId(championshipId);

  /**
   * Count teams for this championship using subscription data
   */
  const getTeamCountForChampionship = (championshipId: number): number => {
    if (!subscriptionsData.length) {
      return 0;
    }

    // Filter subscriptions by championship_id to get unique teams
    const championshipSubscriptions = subscriptionsData.filter(
      subscription => subscription.championship_id === championshipId
    );

    // Get unique team IDs for this championship
    const uniqueTeamIds = new Set(championshipSubscriptions.map(sub => sub.team_id));

    return uniqueTeamIds.size;
  };

  const teamsCount = getTeamCountForChampionship(championshipId);
  const matchesCount = championshipMatches.length;
  // Show loading state
  if (isLoadingChampionship || isLoadingSubscriptions || isLoadingMatches) {
    return (
      <PublicLayout title="Carregando...">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Carregando campeonato...</p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }  // Show error state
  if (isChampionshipError || !championship) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ATIVO': { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
      'FINALIZADO': { label: 'Finalizado', color: 'bg-blue-500/20 text-blue-400' },
      'PLANEJADO': { label: 'Planejado', color: 'bg-yellow-500/20 text-yellow-400' },
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
                </p>                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Users className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{teamsCount} equipes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Trophy className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{matchesCount} partidas</span>
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
                {(championship.prize) && (
                  <div className="mt-4 flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-500 font-semibold">
                      Premiação: {championship.prize}
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