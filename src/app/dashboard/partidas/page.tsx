'use client';
import React, { useState, useCallback } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Clock, MapPin, Trophy, Trash2, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { SearchResult } from "@/hooks/useSearch";
import { publicMatches, publicTeams } from "@/data/data-mock";
import { championships } from "@/data/championships";
import { useModal } from "@/hooks/useModal";
import { AddMatchModal } from "@/components/modals/AddMatchModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import type { MatchFormValues } from "@/types/match";
import type { PublicMatch } from "@/types/data-types";
import { toast } from "react-hot-toast";

// Create a temporary search function for matches using publicMatches
const searchMatches = (query: string, types: string[] = ["match"]): SearchResult[] => {
  if (!query.trim() || !types.includes("match")) return [];

  const searchQuery = query.toLowerCase();

  return publicMatches
    .filter(
      (match) =>
        match.teamA.name.toLowerCase().includes(searchQuery) ||
        match.teamB.name.toLowerCase().includes(searchQuery) ||
        match.map.toLowerCase().includes(searchQuery) ||
        match.stage.toLowerCase().includes(searchQuery)
    )
    .map((match) => ({
      id: match.match_id,
      name: `${match.teamA.name} vs ${match.teamB.name}`,
      type: "match",
      subtitle: `${match.stage} - ${match.map}`,
      metadata: {
        championshipId: match.championship_id,
        status: match.status,
        map: match.map,
        stage: match.stage,
      },
    }));
};

const GerenciarPartidas = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [matches, setMatches] = useState<PublicMatch[]>(publicMatches);
  const [editingMatch, setEditingMatch] = useState<PublicMatch | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'result'>('create');
  const [isLoading, setIsLoading] = useState(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

  // Convert PublicMatch to display format
  const partidas = matches.map(match => ({
    match_id: match.match_id,
    team_a: match.teamA.name,
    team_b: match.teamB.name,
    score_a: match.score?.teamA,
    score_b: match.score?.teamB,
    map: match.map,
    date: new Date(match.date).toLocaleDateString('pt-BR'),
    tournament: `Championship ${match.championship_id}`,
    winner: match.winner_team_id === match.teamA.team_id ? match.teamA.name :
            match.winner_team_id === match.teamB.team_id ? match.teamB.name : undefined,
    status: match.status,
    stage: match.stage,
    fullMatch: match
  }));

  // Open modal for creating new match
  const handleAddMatch = () => {
    setEditingMatch(null);
    setModalMode('create');
    openModal();
  };

  // Open modal for editing match
  const handleEditMatch = (match: PublicMatch) => {
    setEditingMatch(match);
    setModalMode('edit');
    openModal();
  };

  // Open modal for adding result
  const handleAddResult = (match: PublicMatch) => {
    setEditingMatch(match);
    setModalMode('result');
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
      setMatches((prev) => prev.filter((match) => match.match_id !== deleteItemId));
      toast.success("Partida excluída com sucesso!");
    }
    closeDeleteModal();
  }, [deleteItemId]);

  // Handle saving match (create/edit/result)
  const handleSaveMatch = useCallback(async (data: MatchFormValues) => {
    setIsLoading(true);
    try {
      const teamA = publicTeams.find(t => t.team_id === data.teamA_id);
      const teamB = publicTeams.find(t => t.team_id === data.teamB_id);
      
      if (!teamA || !teamB) {
        toast.error("Times não encontrados. Verifique a seleção.");
        return;
      }

      const matchData: PublicMatch = {
        match_id: editingMatch?.match_id || Date.now(),
        championship_id: data.championship_id,
        teamA: { team_id: teamA.team_id, name: teamA.name },
        teamB: { team_id: teamB.team_id, name: teamB.name },
        date: data.date,
        stage: data.stage,
        bracket: 'upper' as const, // Default value
        map: data.map,
        status: data.winner_team_id ? 'completed' as const : 'scheduled' as const,
        score: data.score ? {
          teamA: data.score.teamA,
          teamB: data.score.teamB
        } : undefined,
        winner_team_id: data.winner_team_id || undefined,
      };

      setMatches((prev) => {
        if (editingMatch) {
          // Update existing match
          return prev.map((match) =>
            match.match_id === matchData.match_id ? matchData : match
          );
        }
        // Add new match
        return [matchData, ...prev];
      });

      const successMessage = modalMode === 'create' 
        ? "Partida agendada com sucesso!" 
        : modalMode === 'result'
        ? "Resultado registrado com sucesso!"
        : "Partida atualizada com sucesso!";
      
      toast.success(successMessage);
      closeModal();
    } catch (error) {
      console.error("Error saving match:", error);
      toast.error("Erro ao salvar partida");
    } finally {
      setIsLoading(false);
    }
  }, [editingMatch, modalMode, closeModal]);

  // Handle delete match
  const handleDeleteMatch = useCallback((matchId: number) => {
    const match = matches.find(m => m.match_id === matchId);
    if (match) {
      const matchName = `${match.teamA.name} vs ${match.teamB.name}`;
      openDeleteModal(matchId, matchName);
    }
  }, [matches]);

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Desconhecido</Badge>;

    switch (status.toLowerCase()) {
      case "scheduled":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Agendada
          </Badge>
        );
      case "live":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Ao Vivo
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Finalizada
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

  const renderData = (data: string | null | undefined) => {
    if (!data) {
      return (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="text-green-400 text-sm font-medium">
            Necessário agendar
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="text-white text-sm">{data}</span>
      </div>
    );
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "match") {
      router.push(`/dashboard/partidas/${result.id}`);
    }
  };

  // Get default values for editing
  const getDefaultValues = (): Partial<MatchFormValues> | undefined => {
    if (!editingMatch) return undefined;

    return {
      match_id: editingMatch.match_id,
      championship_id: editingMatch.championship_id,
      teamA_id: editingMatch.teamA.team_id,
      teamB_id: editingMatch.teamB.team_id,
      stage: editingMatch.stage,
      map: editingMatch.map,
      date: editingMatch.date,
      winner_team_id: editingMatch.winner_team_id,
      score: editingMatch.score,
    };
  };

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="PARTIDAS"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/dashboard" },
        { label: "GERENCIAR PARTIDAS" },
      ]}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gerenciar Partidas</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Filtrar por Status
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleAddMatch}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agendar Partida
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center my-6">
          <UniversalSearchBar
            searchFunction={searchMatches}
            config={{
              searchTypes: ["match"],
              placeholder: "Buscar partidas por time, torneio ou mapa...",
              maxResults: 6,
              minQueryLength: 1,
              debounceMs: 300,
            }}
            onResultClick={handleSearchResultClick}
            className="max-w-xl"
          />
        </div>

        {/* Lista de partidas */}
        <div className="space-y-4">
          {partidas.map((partida) => (
            <Card
              key={partida.match_id}
              className="dashboard-card border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-500" />
                  </div>

                  <div className="flex items-center space-x-8">
                    {/* Equipes */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">
                        {partida.team_a}
                      </h3>
                      {partida.winner === partida.team_a && (
                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-500">VS</span>
                      {partida.score_a !== undefined && partida.score_b !== undefined && (
                        <p className="text-xl font-bold text-white mt-1">
                          {`${partida.score_a} - ${partida.score_b}`}
                        </p>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">
                        {partida.team_b}
                      </h3>
                      {partida.winner === partida.team_b && (
                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Mapa</p>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-white font-medium">
                        {partida.map}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Data</p>
                    {renderData(partida.date)} 
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Fase</p>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {partida.stage}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Status</p>
                    {getStatusBadge(partida.status)} 
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                      onClick={() => handleEditMatch(partida.fullMatch)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {partida.status === 'scheduled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-300"
                        onClick={() => handleAddResult(partida.fullMatch)}
                      >
                        <Target className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500"
                      onClick={() => handleDeleteMatch(partida.match_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <p className="dashboard-text-muted text-sm">
                    {partida.tournament}
                  </p>
                  {partida.status === 'scheduled' && !partida.winner && (
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => handleAddResult(partida.fullMatch)}
                    >
                      Informar Resultado
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats das partidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Agendadas</p>
                <p className="text-2xl font-bold text-white">
                  {partidas.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Ao Vivo</p>
                <p className="text-2xl font-bold text-white">
                  {partidas.filter(p => p.status === 'live').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Finalizadas</p>
                <p className="text-2xl font-bold text-white">
                  {partidas.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{partidas.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit/Result Match Modal */}
      <AddMatchModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveMatch}
        teams={publicTeams}
        championships={championships}
        defaultValues={getDefaultValues()}
        mode={modalMode}
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        entityName={`a partida ${deleteItemName}`}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default GerenciarPartidas;