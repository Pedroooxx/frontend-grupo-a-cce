"use client";
import React, { useState, useCallback } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Eye, Edit, Calendar, Users, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchChampionships } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { publicChampionships } from "@/data/data-mock";
import { useModal } from "@/hooks/useModal";
import { AddChampionshipModal } from "@/components/modals/AddChampionshipModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import type { Championship, ChampionshipFormValues } from "@/types/championship";
import { toast } from "react-hot-toast";

const Campeonatos = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [campeonatos, setCampeonatos] = useState(
    publicChampionships.map((champ) => ({
      championship_id: champ.championship_id,
      name: champ.name,
      description: champ.description || "",
      format: champ.format as 'single_elimination' | 'double_elimination' | 'round_robin',
      start_date: champ.start_date,
      end_date: champ.end_date,
      location: champ.location,
      status: champ.status as 'upcoming' | 'ongoing' | 'completed' | 'planned',
      prize: champ.prize || 0,
      teams_count: champ.teams_count || 0,
      user_id: 1, // Default user_id
    }))
  );
  
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

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
  const confirmDelete = useCallback(() => {
    if (deleteItemId) {
      setCampeonatos((prev) => prev.filter((champ) => champ.championship_id !== deleteItemId));
      toast.success("Campeonato excluído com sucesso!");
    }
    closeDeleteModal();
  }, [deleteItemId]);

  // Handle saving championship (create/edit)
  const handleSaveChampionship = useCallback(async (data: ChampionshipFormValues) => {
    setIsLoading(true);
    try {
      const championshipData: Championship = {
        championship_id: editingChampionship?.championship_id || Date.now(),
        name: data.name,
        description: data.description || "",
        format: data.format,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        status: data.status,
        prize: data.prize,
        user_id: data.user_id || 1,
        teams_count: editingChampionship?.teams_count || 0,
      };

      setCampeonatos((prev) => {
        if (editingChampionship) {
          // Update existing championship
          return prev.map((champ) =>
            champ.championship_id === championshipData.championship_id ? championshipData : champ
          );
        }
        // Add new championship
        return [championshipData, ...prev];
      });

      const successMessage = editingChampionship 
        ? "Campeonato atualizado com sucesso!" 
        : "Campeonato criado com sucesso!";
      
      toast.success(successMessage);
      closeModal();
    } catch (error) {
      console.error("Error saving championship:", error);
      toast.error("Erro ao salvar campeonato");
    } finally {
      setIsLoading(false);
    }
  }, [editingChampionship, closeModal]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "em andamento":
      case "ongoing":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Em andamento
          </Badge>
        );
      case "finalizado":
      case "completed":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            Finalizado
          </Badge>
        );
      case "próximo":
      case "upcoming":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Próximo
          </Badge>
        );
      case "planned":
      case "planejado":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Planejado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            {status}
          </Badge>
        );
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "championship") {
      router.push(`/dashboard/campeonatos/${result.id}`);
    }
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

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="CAMPEONATOS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "CAMPEONATOS" },
      ]}
    >
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

        {/* Barra de busca */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchChampionships}
            config={{
              searchTypes: ["championship"],
              placeholder:
                "Buscar campeonatos por nome, local ou organizador...",
              maxResults: 6,
              minQueryLength: 1,
              debounceMs: 300,
            }}
            onResultClick={handleSearchResultClick}
            className="max-w-xl"
          />
        </div>

        {/* Grid de campeonatos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campeonatos.map((campeonato) => (
            <Card
              key={campeonato.championship_id}
              className="dashboard-card border-gray-700 p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {campeonato.name}
                    </h3>
                    <p className="dashboard-text-muted text-sm">
                      {campeonato.format === 'single_elimination' ? 'Eliminação Simples' :
                       campeonato.format === 'double_elimination' ? 'Eliminação Dupla' :
                       'Todos contra Todos'}
                    </p>
                  </div>
                </div>
                {getStatusBadge(campeonato.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Equipes</span>
                  <span className="text-white font-medium">
                    {campeonato.teams_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Local</span>
                  <span className="text-green-400 font-medium">
                    {campeonato.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Período</span>
                  <span className="text-white text-sm">
                    {new Date(campeonato.start_date).toLocaleDateString('pt-BR')} - {new Date(campeonato.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dashboard-text-muted text-sm">Premiação</span>
                  <span className="text-yellow-400 font-medium">
                    {typeof campeonato.prize === 'string' ? campeonato.prize : `R$ ${campeonato.prize.toLocaleString('pt-BR')}`}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                  onClick={() => handleEditChampionship(campeonato)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => openDeleteModal(campeonato.championship_id, campeonato.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
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
                    (c) =>
                      c.status.toLowerCase() === "ongoing" ||
                      c.status.toLowerCase() === "em andamento"
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
                    (sum, c) => sum + c.teams_count,
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
                          (a, b) =>
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
        entityName={`o campeonato "${deleteItemName}"`}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default Campeonatos;
