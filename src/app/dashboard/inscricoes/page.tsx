"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, Clock11Icon, File, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { SearchResult } from "@/hooks/useSearch";
import { useModal } from "@/hooks/useModal";
import { AddSubscriptionModal } from "@/components/modals/AddSubscriptionModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { useGetAllSubscriptions, useCreateSubscription, useUpdateSubscription, useDeleteSubscription } from "@/services/subscriptionService";
import { useGetAllTeams } from "@/services/teamService";
import type { Team } from "@/services/teamService";
import { useGetAllChampionships } from "@/services/championshipService";
import type { Championship } from "@/services/championshipService";
import type { Subscription, SubscriptionFormValues } from "@/types/subscription";
import { toast } from "react-hot-toast";

const Inscricoes = () => {
  const router = useRouter();
  // Data fetching hooks
  const { data: subscriptionsData = [], isLoading: isLoadingSubscriptions, isError: isGetSubscriptionsError, error: getSubscriptionsError } = useGetAllSubscriptions();
  const { data: teamsData = [], isLoading: isLoadingTeams, isError: isGetTeamsError, error: getTeamsError } = useGetAllTeams();
  const { data: championshipsData = [], isLoading: isLoadingChampionships, isError: isGetChampionshipsError, error: getChampionshipsError } = useGetAllChampionships();
  const isLoadingGet = isLoadingSubscriptions || isLoadingTeams || isLoadingChampionships;

  // Mutation hooks
  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();

  // Error handling effects
  useEffect(() => {
    if (isGetSubscriptionsError && getSubscriptionsError) {
      toast.error(`Erro ao carregar inscrições: ${getSubscriptionsError.message}`);
    }
  }, [isGetSubscriptionsError, getSubscriptionsError]);
  useEffect(() => {
    if (isGetTeamsError && getTeamsError) {
      toast.error(`Erro ao carregar equipes: ${getTeamsError.message}`);
    }
  }, [isGetTeamsError, getTeamsError]);
  useEffect(() => {
    if (isGetChampionshipsError && getChampionshipsError) {
      toast.error(`Erro ao carregar campeonatos: ${getChampionshipsError.message}`);
    }
  }, [isGetChampionshipsError, getChampionshipsError]);

  // Map API data to display format
  const inscricoes = useMemo(() => {
    return subscriptionsData.map((sub: Subscription) => {
      const team = teamsData.find((t: Team) => t.team_id === sub.team_id);
      const championship = championshipsData.find((c: Championship) => c.id === sub.championship_id);
      return {
        subscription_id: sub.subscription_id,
        championship_id: sub.championship_id,
        team_id: sub.team_id,
        subscription_date: sub.subscription_date,
        team_name: team?.name || "",
        championship_name: championship?.name || "",
      };
    });
  }, [subscriptionsData, teamsData, championshipsData]);

  // Search function using current data
  const searchSubscriptions = useCallback(
    (query: string, types: string[] = ["inscription"]): SearchResult[] => {
      if (!query.trim() || !types.includes("inscription")) return [];
      const q = query.toLowerCase();
      return inscricoes
        .filter((ins: Subscription) =>
            (ins.team_name ?? '').toLowerCase().includes(q) ||
            (ins.championship_name ?? '').toLowerCase().includes(q)
        )
        .map((ins: Subscription) => ({
          id: ins.subscription_id,
          name: `${ins.team_name} - ${ins.championship_name}`,
          type: "inscription",
          subtitle: `Inscrito em ${new Date(ins.subscription_date).toLocaleDateString("pt-BR")}`,
          metadata: ins,
        }));
    },
    [inscricoes]
  );

  const { isOpen, openModal, closeModal } = useModal();
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

  // Open modal for NEW
  const openAdd = () => {
    setEditingSubscription(null);
    openModal();
  };

  // Open modal for EDIT
  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
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
    if (deleteItemId !== null) {
      try {
        await deleteSubscription.mutateAsync(deleteItemId);
        toast.success(`Inscrição de ${deleteItemName} excluída com sucesso!`);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao excluir inscrição');
      }
      closeDeleteModal();
    }
  }, [deleteItemId, deleteItemName, deleteSubscription, closeDeleteModal]);

  // SAVE handler (for both add and edit)
  const handleSave = useCallback(
    async (data: SubscriptionFormValues) => {
      try {
        if (editingSubscription) {
          await updateSubscription.mutateAsync({ id: editingSubscription.subscription_id, data });
          toast.success('Inscrição atualizada com sucesso!');
        } else {
          await createSubscription.mutateAsync(data);
          toast.success('Inscrição criada com sucesso!');
        }
        closeModal();
      } catch (err) {
        console.error(err);
        toast.error('Erro ao salvar inscrição');
      }
    },
    [editingSubscription, closeModal, createSubscription, updateSubscription]
  );

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "inscription" && result.id) {
      console.log("Inscrição selecionada:", result);
    }
  };
  
  const totalInscricoes = inscricoes.length;
  const ultimaInscricao = totalInscricoes > 0 
    ? [...inscricoes].sort((a, b) => new Date(b.subscription_date).getTime() - new Date(a.subscription_date).getTime())[0] 
    : null;

  // Error or loading states
  if (isGetSubscriptionsError || isGetTeamsError || isGetChampionshipsError) {
    return (
      <DashboardLayout title="GERENCIAR" subtitle="INSCRIÇÕES" breadcrumbs={[]}>
        <p className="text-red-500">Erro ao carregar dados: {getSubscriptionsError?.message || getTeamsError?.message || getChampionshipsError?.message}</p>
      </DashboardLayout>
    );
  }
  if (isLoadingGet) {
    return (
      <DashboardLayout title="GERENCIAR" subtitle="INSCRIÇÕES" breadcrumbs={[]}>
        <p className="text-white">Carregando inscrições...</p>
      </DashboardLayout>
    );
  }
  
  const isMutating =
    createSubscription.status === 'pending' ||
    updateSubscription.status === 'pending' ||
    deleteSubscription.status === 'pending';
  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="INSCRIÇÕES"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" }, 
        { label: "INSCRIÇÕES" },
      ]}
    >
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Inscrições de Equipes
          </h1>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={openAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Fazer Inscrição
          </Button>
        </div>

        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchSubscriptions}
            config={{
              searchTypes: ["inscription"],
              placeholder: "Buscar inscrições por equipe, campeonato ou coach...",
              maxResults: 6,
              minQueryLength: 1,
              debounceMs: 300,
            }}
            onResultClick={handleSearchResultClick}
            className="max-w-xl"
          />
        </div>

        <div className="space-y-4">
          {inscricoes.map((inscricao) => (
            <Card
              key={inscricao.subscription_id}
              className="dashboard-card border-gray-700 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <UserPlus className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {inscricao.team_name}
                    </h3>
                    <p className="dashboard-text-muted text-sm">
                      {inscricao.championship_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => handleEdit(inscricao)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => openDeleteModal(inscricao.subscription_id, inscricao.team_name || "")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Data da Inscrição: {new Date(inscricao.subscription_date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <File className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">
                  Total de Inscrições
                </p>
                <p className="text-2xl font-bold text-white">{totalInscricoes}</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock11Icon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Última Inscrição (Equipe)</p>
                <p className="text-2xl font-bold text-white">
                  {ultimaInscricao ? ultimaInscricao.team_name : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AddSubscriptionModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        teams={teamsData.map((t) => ({ team_id: t.team_id, name: t.name }))}
        championships={championshipsData.map((c) => ({ championship_id: c.id, name: c.name }))}
        defaultValues={
          editingSubscription ? {
            championship_id: editingSubscription.championship_id,
            team_id: editingSubscription.team_id,
            subscription_date: editingSubscription.subscription_date,
          } : undefined
        }
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        entityName={`inscrição de ${deleteItemName}`}
        isLoading={isMutating}
      />
    </DashboardLayout>
  );
};

export default Inscricoes;
