'use client'

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../../../_components/DashboardLayout';
import { Trophy, Users, Target, Calendar, MapPin, Crown, Zap, TrendingUp, Award, Timer, DollarSign, Trash2 } from 'lucide-react';
import {
  useChampionshipOverview,
  useChampionshipTeamStatistics,
  useChampionshipPlayerStatistics,
  useAllPlayersSummary
} from '@/hooks/useStatistics';
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetChampionshipMatches, useGetChampionshipById } from '@/services/championshipService';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { DialogTitle } from "@/components/ui/dialog";
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const ChampionshipStatisticSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  format: z.enum(['single-elimination', 'double-elimination']),
  start_date: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'Data inválida'),
  end_date: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'Data inválida'),
  location: z.string().optional(),
  prize: z.number().min(0, 'Prêmio deve ser positivo').optional(),
});

const ChampionshipStatisticsFormSchema = z.object({
  kills: z.number().min(0, 'Kills must be a positive number'),
  deaths: z.number().min(0, 'Deaths must be a positive number'),
  assists: z.number().min(0, 'Assists must be a positive number'),
});

const AddStatisticForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ChampionshipStatisticSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Nome do Campeonato" className="input" />
      {errors.name && <span className="text-red-500">{String(errors.name.message)}</span>}

      <textarea {...register('description')} placeholder="Descrição" className="textarea" />

      <select {...register('format')} className="select">
        <option value="single-elimination">Eliminação Simples</option>
        <option value="double-elimination">Eliminação Dupla</option>
      </select>
      {errors.format && <span className="text-red-500">{String(errors.format.message)}</span>}

      <input {...register('start_date')} placeholder="Data de Início (YYYY-MM-DD)" className="input" />
      {errors.start_date && <span className="text-red-500">{String(errors.start_date.message)}</span>}

      <input {...register('end_date')} placeholder="Data de Término (YYYY-MM-DD)" className="input" />
      {errors.end_date && <span className="text-red-500">{String(errors.end_date.message)}</span>}

      <input {...register('location')} placeholder="Localização" className="input" />

      <input type="number" {...register('prize')} placeholder="Prêmio" className="input" />

      <button type="submit" className="btn btn-primary">Salvar</button>
    </form>
  );
};

const ChampionshipStatisticsForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ChampionshipStatisticsFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="kills" className="block text-sm font-medium text-slate-300">Kills</label>
        <Input id="kills" type="number" {...register('kills')} className="mt-1" />
        {errors.kills && <p className="text-red-500 text-xs mt-1">{String(errors.kills.message)}</p>}
      </div>

      <div>
        <label htmlFor="deaths" className="block text-sm font-medium text-slate-300">Deaths</label>
        <Input id="deaths" type="number" {...register('deaths')} className="mt-1" />
        {errors.deaths && <p className="text-red-500 text-xs mt-1">{String(errors.deaths.message)}</p>}
      </div>

      <div>
        <label htmlFor="assists" className="block text-sm font-medium text-slate-300">Assists</label>
        <Input id="assists" type="number" {...register('assists')} className="mt-1" />
        {errors.assists && <p className="text-red-500 text-xs mt-1">{String(errors.assists.message)}</p>}
      </div>

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Submit</Button>
    </form>
  );
};

const ChampionshipStatistics = () => {
  const params = useParams();
  const championshipId = parseInt((params as { id?: string })?.id ?? '1', 10);

  // Fetch championship basic information first
  const { data: championshipData, isLoading: isLoadingChampionship } = useGetChampionshipById(championshipId);

  // Fetch championship statistics - use championshipData as fallback
  const { data: championshipOverview, isLoading: isLoadingOverview } = useChampionshipOverview(championshipId);

  // Merge championship data with overview data, prioritizing overview when available
  const mergedChampionshipData = useMemo(() => {
    return {
      name: championshipOverview?.name || championshipData?.name || 'Campeonato não encontrado',
      status: championshipOverview?.status || championshipData?.status || 'unknown',
      teams_count: championshipOverview?.teams_count || 0,
      matches_count: championshipOverview?.matches_count || 0,
      championship_id: championshipId,
      start_date: championshipOverview?.start_date || championshipData?.start_date,
      end_date: championshipOverview?.end_date || championshipData?.end_date,
      total_teams: championshipOverview?.total_teams || 0,
      total_participants: championshipOverview?.total_participants || 0,
      total_matches: championshipOverview?.total_matches || 0,
      highest_kda: championshipOverview?.highest_kda || '0.00',
      highest_kills: championshipOverview?.highest_kills || 0,
      location: championshipData?.location,
      description: championshipData?.description,
      format: championshipData?.format,
      prize: championshipData?.prize
    };
  }, [championshipOverview, championshipData, championshipId]);

  const { data: teamStats = [], isLoading: isLoadingTeamStats } = useChampionshipTeamStatistics(championshipId);
  const { data: playerStats = [], isLoading: isLoadingPlayerStats } = useChampionshipPlayerStatistics(championshipId);

  // Use simpler player stats approach - fetch all players and filter by championship
  const { data: allPlayersData = [], isLoading: isLoadingAllPlayers } = useAllPlayersSummary();
  const topPlayers = allPlayersData.slice(0, 5); // Show top 5 players from all data
  const isLoadingTopPlayers = isLoadingAllPlayers;

  const { data: matchesData = [], isLoading: isLoadingMatches } = useGetChampionshipMatches(championshipId);

  // Get subscriptions to calculate team counts
  const { data: subscriptionsData = [], isLoading: isLoadingSubscriptions } = useGetAllSubscriptions();

  // Calculate team count for this championship
  const teamCount = useMemo(() => {
    if (!subscriptionsData || !subscriptionsData.length) {
      // If championship overview has teams_count, use it
      if (championshipOverview && championshipOverview.teams_count !== undefined) {
        return championshipOverview.teams_count;
      }
      return 0;
    }

    // Filter subscriptions by championship_id to get unique teams
    const championshipSubscriptions = subscriptionsData.filter(
      subscription => subscription.championship_id === championshipId
    );
    // Get unique team IDs for this championship
    const uniqueTeamIds = new Set(championshipSubscriptions.map(sub => sub.team_id));
    return uniqueTeamIds.size;
  }, [subscriptionsData, championshipId, championshipOverview]);

  const matchCount = useMemo(() => {
    return matchesData.length;
  }, [matchesData]);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'stats'>('overview');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isStatisticsModalOpen, setStatisticsModalOpen] = useState(false);

  const { mutate: handleGenerateBracket } = useMutation({
    mutationFn: () => {
      // Placeholder function for generating bracket
      console.log('Generating bracket...');
      return Promise.resolve();
    },
    onSuccess: () => {
      alert('Chaveamento gerado com sucesso!');
    },
    onError: (error: unknown) => {
      alert(`Erro ao gerar chaveamento: ${error}`);
    },
  });

  const handleGenerateNextPhase = () => {
    console.log('Generating next phase...');
  };

  const handleAddStatisticsSubmit = (data: any) => {
    console.log('Add Statistics:', data);
    setAddModalOpen(false);
  };

  const handleEditStatisticsSubmit = (data: any) => {
    console.log('Edit Statistics:', data);
    setEditModalOpen(false);
  };

  const handleStatisticsFormSubmit = (data: any) => {
    console.log('Statistics Form submitted:', data);
    setStatisticsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'Em Andamento';
      case 'completed': return 'Finalizado';
      case 'upcoming': return 'Próximo';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoadingOverview || isLoadingChampionship) {
    return (
      <DashboardLayout
        title="ESTATÍSTICAS"
        subtitle="CARREGANDO..."
        breadcrumbs={[
          { label: "DASHBOARD", href: "/dashboard" },
          { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
          { label: "CARREGANDO..." }
        ]}
      >
        <div className="p-8 space-y-8">
          <Card className="dashboard-card border-gray-700 p-6 animate-pulse">
            <div className="h-20 bg-gray-700 rounded w-full"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate additional stats from the player statistics - safely handle empty arrays or non-arrays
  const totalKills = Array.isArray(topPlayers) ? topPlayers.reduce((acc: number, player: any) => acc + (player.total_kills || 0), 0) : 0;
  const totalDeaths = Array.isArray(topPlayers) ? topPlayers.reduce((acc: number, player: any) => acc + (player.total_deaths || 0), 0) : 0;
  const kdaRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '0';

  // Sort teams and players for rankings - safely handle empty arrays or non-arrays
  const sortedTeams = Array.isArray(teamStats) && teamStats.length > 0
    ? [...teamStats].sort((a: any, b: any) => (b?.points || 0) - (a?.points || 0))
    : [];

  const sortedPlayers = Array.isArray(playerStats) && playerStats.length > 0
    ? [...playerStats].sort((a: any, b: any) => (b?.kda_ratio || b?.kda || 0) - (a?.kda_ratio || a?.kda || 0))
    : [];

  // Safely sort top players by KDA ratio, converting string to number if needed
  const sortedTopPlayers = Array.isArray(topPlayers) && topPlayers.length > 0
    ? [...topPlayers].sort((a: any, b: any) => {
      const aKDA = typeof a.kda_ratio === 'string' ? parseFloat(a.kda_ratio) || 0 : (a.kda_ratio || 0);
      const bKDA = typeof b.kda_ratio === 'string' ? parseFloat(b.kda_ratio) || 0 : (b.kda_ratio || 0);
      return bKDA - aKDA;
    })
    : [];

  const modalStyles = cn(
    "bg-slate-900 border-slate-700 text-white p-6 rounded-lg shadow-lg",
    "transition-transform transform hover:scale-105 hover:shadow-xl"
  );

  return (
    <DashboardLayout
      title="ESTATÍSTICAS"
      subtitle={`CAMPEONATO - ${mergedChampionshipData.name.toUpperCase()}`}
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "ESTATÍSTICAS", href: "/dashboard/estatisticas" },
        { label: mergedChampionshipData.name.toUpperCase() }
      ]}
    >
      <div className="p-8 space-y-8">
        {/* Championship Header */}
        <Card className="dashboard-card border-gray-700 p-6 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-purple-500/20 rounded-lg">
              <Trophy className="w-12 h-12 text-purple-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{mergedChampionshipData.name}</h1>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    {mergedChampionshipData?.start_date ? new Date(mergedChampionshipData.start_date).toLocaleDateString('pt-BR') : 'Data não definida'} -
                    {mergedChampionshipData?.end_date ? new Date(mergedChampionshipData.end_date).toLocaleDateString('pt-BR') : 'Data não definida'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(mergedChampionshipData.status)}>
                {getStatusText(mergedChampionshipData.status)}
              </Badge>
            </div>
          </div>
        </Card>

        <div className='flex justify-between items-center '>
          <Button
            className='bg-green-500 hover:bg-green-600 text-white shadow-md rounded-md px-4 py-2 transition-all duration-200'
            onClick={() => handleGenerateBracket()}
          >
            Gerar Chaveamento
          </Button>

          <Button
            className='bg-blue-500 hover:bg-blue-600 text-white shadow-md rounded-md px-4 py-2 transition-all duration-200'
            onClick={() => handleGenerateNextPhase()}
          >
            Gerar próxima Fase
          </Button>

          <Button
            className='bg-yellow-500 hover:bg-yellow-600 text-white shadow-md rounded-md px-4 py-2 transition-all duration-200'
            onClick={() => setAddModalOpen(true)}
          >
            Adicionar Estatística de campeonato
          </Button>

          <Button
            className='bg-orange-500 hover:bg-orange-600 text-white shadow-md rounded-md px-4 py-2 transition-all duration-200'
            onClick={() => setEditModalOpen(true)}
          >
            Editar Estatística de campeonato
          </Button>

          <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} className={modalStyles}>
            <DialogTitle>Adicionar Estatísticas</DialogTitle>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Adicionar Estatísticas</h2>
              <AddStatisticForm onSubmit={(data) => console.log(data)} />
            </div>
          </Modal>

          <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} className={modalStyles}>
            <DialogTitle>Editar Estatísticas</DialogTitle>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Editar Estatísticas</h2>
              <AddStatisticForm onSubmit={(data) => console.log(data)} />
            </div>
          </Modal>

          <Modal isOpen={isStatisticsModalOpen} onClose={() => setStatisticsModalOpen(false)} className={modalStyles}>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Adicionar Estatísticas do Campeonato</h2>
              <ChampionshipStatisticsForm onSubmit={handleStatisticsFormSubmit} />
            </div>
          </Modal>

          <Button className='bg-red-500 hover:bg-red-600 text-white shadow-md rounded-md px-4 py-2 transition-all duration-200'>
            <Trash2 className="w-4 h-4 mr-2" />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'stats', label: 'Estatísticas' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-700 ${selectedTab === tab.key
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <>

            {/* Tournament Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Informações do Torneio</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Status</span>
                    <Badge className={getStatusColor(mergedChampionshipData.status)}>
                      {getStatusText(mergedChampionshipData.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Times</span>
                    <span className="text-white font-medium">{teamCount || mergedChampionshipData.total_teams || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Partidas</span>
                    <span className="text-white font-medium">{matchCount || mergedChampionshipData.total_matches || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">KDA Médio do Torneio</span>
                    <span className="text-green-400 font-medium">
                      {kdaRatio}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Jogadores em Destaque</h3>
                {isLoadingTopPlayers ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-24"></div>
                        <div className="h-5 bg-gray-700 rounded w-32"></div>
                      </div>
                    ))}
                  </div>
                ) : sortedTopPlayers.length > 0 ? (
                  <div className="space-y-4">
                    {sortedTopPlayers.map((player: any) => (
                      <div key={player.participant_id || player.id || Math.random()} className="flex justify-between">
                        <span className="dashboard-text-muted">{player.nickname || player.name || 'Jogador'}</span>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          KDA - {typeof player.kda_ratio === 'string' ? player.kda_ratio : (player.kda_ratio || 0).toFixed(2)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">Nenhum destaque disponível</div>
                )}
              </Card>

            </div>
            {/* KDA Explanation */}
            <Card className="dashboard-card border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Entendendo o KDA</h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <span className="text-lg font-semibold text-white">KDA (Kills/Deaths/Assists)</span>
                  <p className="text-slate-300 leading-relaxed">
                    O KDA é uma métrica fundamental que representa a eficiência de um jogador durante as partidas.
                    É calculado como a razão entre eliminações e mortes, considerando também as assistências.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-green-400">Kills (K)</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Número de eliminações diretas realizadas pelo jogador
                    </p>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-red-400">Deaths (D)</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Número de vezes que o jogador foi eliminado
                    </p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-blue-400">Assists (A)</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Assistências em eliminações de companheiros de equipe
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-yellow-400">Fórmula: (K + A) / D</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Um KDA maior que 1.0 indica mais eliminações/assistências do que mortes,
                    demonstrando um desempenho positivo. Valores acima de 2.0 são considerados excelentes.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Stats Tab */}
        {selectedTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Estatísticas Detalhadas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Estatísticas Gerais</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Kills</span>
                    <span className="text-white font-medium">{totalKills}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Total de Deaths</span>
                    <span className="text-white font-medium">{totalDeaths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">KDA Médio</span>
                    <span className="text-green-400 font-medium">{kdaRatio}</span>
                  </div>
                </div>
              </Card>

              <Card className="dashboard-card border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Registros do Campeonato</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Início do Campeonato</span>
                    <span className="text-white font-medium">
                      {mergedChampionshipData?.start_date ? new Date(mergedChampionshipData.start_date).toLocaleDateString('pt-BR') : 'Data não definida'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Término do Campeonato</span>
                    <span className="text-white font-medium">
                      {mergedChampionshipData?.end_date ? new Date(mergedChampionshipData.end_date).toLocaleDateString('pt-BR') : 'Data não definida'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dashboard-text-muted">Status</span>
                    <Badge className={getStatusColor(mergedChampionshipData.status)}>
                      {getStatusText(mergedChampionshipData.status)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChampionshipStatistics;
