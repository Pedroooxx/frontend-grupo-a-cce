"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";

import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { AddChampionshipModal } from "@/components/modals/AddChampionshipModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { useModal } from "@/hooks/useModal";
import { SearchResult, SearchConfig } from "@/hooks/useSearch";
import {
  useCreateChampionship,
  useDeleteChampionship,
  useGetAllChampionships,
  useUpdateChampionship,
} from "@/services/championshipService";
import { useGetAllSubscriptions } from '@/services/subscriptionService';
import { useGetAllMatches } from '@/services/matchService';
import type { Championship, ChampionshipFormValues } from "@/types/championship";
import { 
  ArrowRight,
  Calendar, 
  Crown,
  Edit, 
  Eye, 
  MapPin,
  Plus, 
  Target,
  Trash2, 
  Trophy, 
  Users 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AddChampionshipStatisticsModal } from '@/components/modals/AddChampionshipStatisticsModal';
import { useSession } from "next-auth/react";

const Campeonatos = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Ativo" | "Planejado" | "Finalizado">("all");
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

  // Statistics modal state
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

  // Fetch championships from backend
  const {
    data: championshipsData = [],
    isLoading: isLoadingChampionships,
    isError: isGetError,
    error: getError,
  } = useGetAllChampionships();

  // Fetch subscriptions to count teams per championship
  const {
    data: subscriptionsData = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useGetAllSubscriptions();

  // Fetch matches data
  const {
    data: matchesData = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
  } = useGetAllMatches();

  // Mutation hooks
  const createChampionship = useCreateChampionship();
  const updateChampionship = useUpdateChampionship();
  const deleteChampionship = useDeleteChampionship();

  /**
   * Count teams for a specific championship using subscription data
   */
  const getTeamCountForChampionship = (championshipId: number): number => {
    if (!subscriptionsData || !subscriptionsData.length) {
      // If this championship has teams_count already available, use it
      const championship = championshipsData.find(c => c.championship_id === championshipId);
      if (championship && championship.teams_count !== undefined) {
        return championship.teams_count;
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
  };

  /**
   * Count matches for a specific championship
   */
  const getMatchCountForChampionship = (championshipId: number): number => {
    if (!matchesData.length) {
      return 0;
    }
    return matchesData.filter(match => match.championship_id === championshipId).length;
  };

  // Filter championships to only show the ones the user is the owner
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;
  const campeonatos = useMemo(() => {
    if (!userId) return [];
    return championshipsData.filter(championship => championship.user_id === userId).map((c) => ({
      ...c,
      // Use calculated counts instead of relying on API values if needed
      teams_count: c.teams_count ?? getTeamCountForChampionship(c.championship_id),
      matches_count: c.matches_count ?? getMatchCountForChampionship(c.championship_id),
    }));
  }, [championshipsData, subscriptionsData, matchesData, getTeamCountForChampionship, getMatchCountForChampionship, userId]);

  // Error notifications
  useEffect(() => {
    if (isGetError && getError) toast.error(`Erro ao carregar campeonatos: ${getError.message}`);
    if (isSubscriptionsError) toast.error("Erro ao carregar inscrições");
    if (isMatchesError) toast.error("Erro ao carregar partidas");
  }, [isGetError, getError, isSubscriptionsError, isMatchesError]);

  // Open modal for creating new championship
  const handleCreateChampionship = () => {
    setEditingChampionship(null);
    openModal();
  };

  // Open modal for editing championship
  const handleEditChampionship = (championship: Championship) => {
    setEditingChampionship(championship);
    openModal();
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: number, name: string) => {
    setDeleteItemId(id);
    setDeleteItemName(name);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
    setDeleteItemName("");
  };

  // Handle delete confirmation
  const confirmDelete = useCallback(async () => {
    if (deleteItemId) {
      try {
        await deleteChampionship.mutateAsync(deleteItemId);
        toast.success("Campeonato excluído com sucesso!");
      } catch (err: any) {
        console.error('Delete error:', err);
        const errorMessage = err?.response?.data?.error || err?.message || "Erro desconhecido ao excluir campeonato";

        // Handle specific error cases
        if (err?.response?.status === 409) {
          toast.error("Não é possível deletar campeonato com equipes inscritas ou partidas em andamento");
        } else if (err?.response?.status === 404) {
          toast.error("Campeonato não encontrado");
        } else if (err?.response?.status === 403) {
          toast.error("Acesso negado - você não tem permissão para deletar este campeonato");
        } else {
          toast.error(`Erro ao excluir campeonato: ${errorMessage}`);
        }
      }
    }
    closeDeleteModal();
  }, [deleteItemId, deleteChampionship, closeDeleteModal]);

  // Handle saving championship (create/edit)
  const handleSaveChampionship = useCallback(async (data: ChampionshipFormValues) => {
    // Transform data to match backend API format
    const transformedData = {
      ...data,
      // Ensure prize is properly formatted as string (required by Championship interface)
      prize: data.prize === null || data.prize === undefined || data.prize === "" 
        ? "" 
        : String(data.prize),
      // Status should remain as-is (Ativo, Planejado, Finalizado)
      status: data.status,
      // Format should remain as-is (simple, double)
      format: data.format
    };
    
    // Debug: Log the payload being sent to the API
    console.log('Championship payload being sent:', transformedData);
    
    try {
      if (editingChampionship) {
        await updateChampionship.mutateAsync({ id: editingChampionship.championship_id, data: transformedData });
        toast.success("Campeonato atualizado com sucesso!");
      } else {
        await createChampionship.mutateAsync(transformedData);
        toast.success("Campeonato criado com sucesso!");
      }
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar campeonato");
    }
  }, [editingChampionship, createChampionship, updateChampionship, closeModal]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      'Ativo': { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
      'Finalizado': { label: 'Finalizado', color: 'bg-blue-500/20 text-blue-400' },
      'Planejado': { label: 'Planejado', color: 'bg-yellow-500/20 text-yellow-400' },
    };
    
    const config = statusConfig[status] || statusConfig[status.toLowerCase()] || 
      { color: 'bg-gray-500/20 text-gray-400', label: status };
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  /**
   * Search function using real API data (similar to public page)
   * @param query - Search query string
   * @param types - Array of search types to include
   * @returns Array of search results
   */
  const searchFunction = useCallback((query: string, types: string[]): SearchResult[] => {
    if (!query.trim()) return [];
    
    const searchQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search championships
    if (types.includes("championship") && Array.isArray(championshipsData)) {
      const championshipResults = championshipsData
        .filter(championship =>
          championship && championship.name &&
          (championship.name.toLowerCase().includes(searchQuery) ||
          (championship.description && championship.description.toLowerCase().includes(searchQuery)) ||
          (championship.location && championship.location.toLowerCase().includes(searchQuery)))
        )
        .map(championship => ({
          id: championship.championship_id,
          name: championship.name,
          type: "championship" as const,
          subtitle: `${championship.location || "Local não definido"} - ${championship.status}`,
          metadata: {
            status: championship.status,
            location: championship.location,
            startDate: championship.start_date,
            endDate: championship.end_date,
          },
        }));
      results.push(...championshipResults);
    }

    return results.slice(0, 8);
  }, [championshipsData]);

  const handleSearchResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    
    if (result.type === 'championship') {
      // Redirect to statistics page for the championship
      router.push(`/dashboard/estatisticas/campeonato/${result.id}`);
    } else if (result.type === 'team') {
      router.push(`/dashboard/equipes/${result.id}`);
    } else if (result.type === 'player') {
      const playerTeamId = result.metadata?.teamId;
      if (playerTeamId) {
        router.push(`/dashboard/equipes/${playerTeamId}`);
      }
    } else if (result.type === 'match') {
      const championshipId = result.metadata?.championshipId;
      if (championshipId) {
        router.push(`/dashboard/campeonatos/${championshipId}/partidas/${result.id}`);
      }
    }
  };

  // Configuration for UniversalSearchBar
  const searchConfig: SearchConfig = {
    searchTypes: ["championship", "team", "player", "match"],
    placeholder: "Buscar campeonatos, equipes, jogadores ou partidas...",
    maxResults: 8,
    minQueryLength: 1,
    debounceMs: 300,
  };

  // Get default values for editing
  const getDefaultValues = (): Partial<ChampionshipFormValues> | undefined => {
    if (!editingChampionship) return undefined;

    return {
      championship_id: editingChampionship.championship_id,
      name: editingChampionship.name,
      description: editingChampionship.description,
      format: editingChampionship.format,
      start_date: editingChampionship.start_date,
      end_date: editingChampionship.end_date,
      location: editingChampionship.location,
      status: editingChampionship.status,
      prize: editingChampionship.prize,
      user_id: editingChampionship.user_id,
    };
  };

  const filteredChampionships = campeonatos.filter(championship => {
    const matchesSearch = championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (championship.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || championship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Format date in Brazilian format (DD/MM/YYYY)
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle statistics submission
  const handleStatisticsSubmit = async (data: any) => {
    try {
      // TODO: Implement statistics service when available
      // await statisticsService.createChampionshipStatistic(data);
      toast.success('Estatísticas adicionadas com sucesso!');
      setIsStatisticsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao adicionar estatísticas.');
    }
  };

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="CAMPEONATOS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "CAMPEONATOS" },
      ]}
    >
      {isLoadingChampionships || isLoadingSubscriptions || isLoadingMatches ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Carregando campeonatos...</p>
          </div>
        </div>
      ) : isGetError ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">Erro ao carregar campeonatos</h2>
            <p className="text-slate-400">Tente novamente mais tarde</p>
          </div>
        </div>
      ) : (
        <div className="p-8 space-y-6">
          {/* Header com botão de criar */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Campeonatos</h1>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleCreateChampionship}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Campeonato
            </Button>
          </div>

          {/* Filtros e busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Barra de busca */}
            <div className="flex-1 relative">
              <UniversalSearchBar
                searchFunction={searchFunction}
                config={searchConfig}
                onQueryChange={setSearchQuery}
                onResultClick={handleSearchResultClick}
                className="w-full"
              />
            </div>
            
            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-red-500"
              >
                <option value="all">Todos os Status</option>
                <option value="Planejado">Planejados</option>
                <option value="Ativo">Ativos</option>
                <option value="Finalizado">Finalizados</option>
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-400">
              {filteredChampionships.length} campeonato{filteredChampionships.length !== 1 ? 's' : ''} encontrado{filteredChampionships.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid de campeonatos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredChampionships.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Nenhum campeonato encontrado
                </h3>
                <p className="text-slate-500">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            ) : (
              // Render championships
              filteredChampionships.map((championship) => (
                <Card
                  key={championship.championship_id}
                  className="dashboard-card border-slate-700 p-6 hover:bg-slate-750 transition-colors flex flex-col min-h-[320px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex-1 mr-3">
                      {championship.name}
                    </h3>
                    {getStatusBadge(championship.status)}
                  </div>

                  <p className="text-slate-400 mb-6 flex-1 text-sm leading-relaxed">
                    {championship.description && championship.description.length > 120
                      ? `${championship.description.substring(0, 120)}...`
                      : championship.description || 'Campeonato emocionante com equipes competitivas'
                    }
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-300 text-sm">
                      <Calendar className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      <span>{formatDate(championship.start_date)} - {formatDate(championship.end_date)}</span>
                    </div>
                    {championship.location && (
                      <div className="flex items-center text-slate-300 text-sm">
                        <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        <span>{championship.location}</span>
                      </div>
                    )}
                    {championship.prize && (
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Crown className="w-4 h-4 mr-2" />
                        <span>{championship.prize}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-300 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-red-500 mr-2" />
                        <span>{getTeamCountForChampionship(championship.championship_id)} equipes</span>
                      </div>
                      {getMatchCountForChampionship(championship.championship_id) > 0 && (
                        <div className="flex items-center">
                          <Target className="w-4 h-4 text-red-500 mr-2" />
                          <span>{getMatchCountForChampionship(championship.championship_id)} partidas</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-700 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white flex items-center justify-center"
                      onClick={() => router.push(`/dashboard/estatisticas/campeonato/${championship.championship_id}`)}
                    >
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-none border-slate-600 text-slate-300 hover:text-white"
                      onClick={() => handleEditChampionship(championship)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => openDeleteModal(championship.championship_id, championship.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">
                    Campeonatos Ativos
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {campeonatos.filter(
                      (c: Championship) =>
                        c.status === "Ativo"
                    ).length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">Equipes Totais</p>
                  <p className="text-2xl font-bold text-white">
                    {campeonatos.reduce(
                      (sum: number, c: Championship) => sum + getTeamCountForChampionship(c.championship_id),
                      0
                    )}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="dashboard-card border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="dashboard-text-muted text-sm">Último Evento</p>
                  <p className="text-2xl font-bold text-white">
                    {campeonatos.length > 0
                      ? campeonatos
                          .sort(
                            (a: Championship, b: Championship) =>
                              new Date(b.end_date).getTime() -
                              new Date(a.end_date).getTime()
                          )[0]?.name
                      : "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Add/Edit Championship Modal */}
      <AddChampionshipModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveChampionship}
        defaultValues={getDefaultValues()}
        isLoading={isLoading}
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        entityName={`campeonato ${deleteItemName}`}
        isLoading={deleteChampionship.isPending || createChampionship.isPending || updateChampionship.isPending}
      />

      {/* Add Championship Statistics Modal */}
      <AddChampionshipStatisticsModal
        isOpen={isStatisticsModalOpen}
        onClose={() => setIsStatisticsModalOpen(false)}
        onSubmit={handleStatisticsSubmit}
      />
    </DashboardLayout>
  );
};

export default Campeonatos;
