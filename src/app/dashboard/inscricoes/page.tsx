"use client";
import React, { useState, useCallback } from "react";
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
import { teams } from "@/data/teams";
import { championships } from "@/data/championships";
import type { Subscription, SubscriptionFormValues } from "@/types/subscription";
import { toast } from "react-hot-toast";

// Create a temporary search function for inscriptions
const searchInscriptions = (query: string, types: string[] = ["inscription"]): SearchResult[] => {
  if (!query.trim() || !types.includes("inscription")) return [];
  // Return empty array since we don't have inscription data
  return [];
};

// Mock data for inscriptions
const initialInscriptions: Subscription[] = [
  {
    subscription_id: 1,
    championship_id: 1,
    team_id: 1,
    subscription_date: "2024-01-10",
    championship_name: "Liga de Verão 2024",
    team_name: "Valorant Kings",
  },
  {
    subscription_id: 2,
    championship_id: 1,
    team_id: 2,
    subscription_date: "2024-01-12",
    championship_name: "Liga de Verão 2024",
    team_name: "Phoenix Squad",
  },
];

const Inscricoes = () => {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<Subscription[]>(initialInscriptions);
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
  const confirmDelete = useCallback(() => {
    if (deleteItemId) {
      setInscricoes((prev) => prev.filter((x) => x.subscription_id !== deleteItemId));
      toast.success("Inscrição excluída com sucesso!");
    }
    closeDeleteModal();
  }, [deleteItemId]);

  // SAVE handler (for both add and edit)
  const handleSave = useCallback(
    async (data: SubscriptionFormValues) => {
      setIsLoading(true);
      try {
        // Find championship and team
        const championship = championships.find(c => c.championship_id === data.championship_id);
        const team = teams.find(t => t.team_id === data.team_id);
        
        // Validate that both exist
        if (!championship) {
          toast.error("Campeonato não encontrado. Por favor, selecione um campeonato válido.");
          return;
        }
        
        if (!team) {
          toast.error("Equipe não encontrada. Por favor, selecione uma equipe válida.");
          return;
        }
        
        // Map form to Subscription with validated data
        const mapped: Subscription = {
          subscription_id: editingSubscription?.subscription_id || Date.now(),
          championship_id: data.championship_id,
          team_id: data.team_id,
          subscription_date: data.subscription_date,
          championship_name: championship.name,
          team_name: team.name,
        };

        setInscricoes((prev) => {
          if (editingSubscription) {
            // Update existing
            return prev.map((x) =>
              x.subscription_id === mapped.subscription_id ? mapped : x
            );
          }
          // Add new
          return [mapped, ...prev];
        });

        // Show success message
        toast.success(
          editingSubscription 
            ? "Inscrição atualizada com sucesso!" 
            : "Inscrição registrada com sucesso!"
        );

        closeModal();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao processar a inscrição");
      } finally {
        setIsLoading(false);
      }
    },
    [editingSubscription, closeModal]
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
            searchFunction={searchInscriptions}
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
        teams={teams}
        championships={championships}
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
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default Inscricoes;
