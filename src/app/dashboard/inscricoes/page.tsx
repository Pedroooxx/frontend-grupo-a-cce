"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, Clock11Icon, File, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniversalSearchBar } from "@/components/common/UniversalSearchBar";
import { searchInscriptions } from "@/data/search-functions";
import { SearchResult } from "@/hooks/useSearch";
import { detailedInscriptionsStats, DetailedInscriptionStats } from "@/data/data-mock";

const Inscricoes = () => {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<DetailedInscriptionStats[]>(detailedInscriptionsStats);


  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "inscription" && result.id) {
      // Navigate to a detail page or filter the list
      // For now, we can filter the list as an example or log
      console.log("Inscription selected:", result);
      // Example: router.push(`/dashboard/inscricoes/${result.id}`);
      // Or to filter current list:
      // const filtered = detailedInscriptionsStats.filter(i => i.inscription_id === result.id);
      // setInscricoes(filtered.length > 0 ? filtered : detailedInscriptionsStats); // Show all if filter is empty
    }
  };
  
  const totalInscricoes = inscricoes.length;
  const ultimaInscricao = totalInscricoes > 0 
    ? [...inscricoes].sort((a, b) => new Date(b.inscription_date).getTime() - new Date(a.inscription_date).getTime())[0] 
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
          <Button className="bg-red-500 hover:bg-red-600 text-white">
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
              key={inscricao.inscription_id}
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
                    <p className="dashboard-text-muted text-xs">
                      Coach: {inscricao.coach_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                      // onClick={() => router.push(`/dashboard/inscricoes/editar/${inscricao.inscription_id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      // onClick={() => console.log('Delete inscription:', inscricao.inscription_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Data da Inscrição: {new Date(inscricao.inscription_date).toLocaleDateString('pt-BR')}
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
    </DashboardLayout>
  );
};

export default Inscricoes;
