"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, Clock11Icon, File } from "lucide-react";

const Inscricoes = () => {
  const [inscricoes] = useState([
    {
      id: 1,
      nomeEquipe: "Valorant Kings",
      campeonato: "Liga de Verão 2024",
      dataInscricao: "10/12/2024",
      coach: "João Silva",
    },
    {
      id: 2,
      nomeEquipe: "Phoenix Squad",
      campeonato: "Torneio Nacional",
      dataInscricao: "08/12/2024",
      coach: "Maria Santos",
    },
    {
      id: 3,
      nomeEquipe: "Sage Warriors",
      campeonato: "Liga de Verão 2024",
      dataInscricao: "05/12/2024",
      coach: "Pedro Costa",
    },
  ]);

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="INSCRIÇÕES"
      breadcrumbs={[{ label: "DASHBOARD", href: "/" }, { label: "INSCRIÇÕES" }]}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Inscrições de Equipes
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Filtrar por Campeonato
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Fazer Inscrição
            </Button>
          </div>
        </div>

        {/* Lista de inscrições */}
        <div className="space-y-4">
          {inscricoes.map((inscricao) => (
            <Card
              key={inscricao.id}
              className="dashboard-card border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <UserPlus className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {inscricao.nomeEquipe}
                    </h3>
                    <p className="dashboard-text-muted text-sm">
                      {inscricao.campeonato}
                    </p>
                    <p className="dashboard-text-muted text-xs">
                      Coach: {inscricao.coach}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Data</p>
                    <p className="text-white text-sm">
                      {inscricao.dataInscricao}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats das inscrições */}
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
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock11Icon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Última Inscrição</p>
                <p className="text-2xl font-bold text-white">Valorant Kings</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inscricoes;
