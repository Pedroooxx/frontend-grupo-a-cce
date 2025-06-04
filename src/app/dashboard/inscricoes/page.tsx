"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Check, X, Clock, Plus } from "lucide-react";

const Inscricoes = () => {
  const [inscricoes] = useState([
    {
      id: 1,
      nomeEquipe: "Valorant Kings",
      campeonato: "Liga de Verão 2024",
      status: "Pendente",
      dataInscricao: "10/12/2024",
      membros: 5,
      coach: "João Silva",
    },
    {
      id: 2,
      nomeEquipe: "Phoenix Squad",
      campeonato: "Torneio Nacional",
      status: "Aprovada",
      dataInscricao: "08/12/2024",
      membros: 5,
      coach: "Maria Santos",
    },
    {
      id: 3,
      nomeEquipe: "Sage Warriors",
      campeonato: "Liga de Verão 2024",
      status: "Rejeitada",
      dataInscricao: "05/12/2024",
      membros: 4,
      coach: "Pedro Costa",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aprovada":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Aprovada
          </Badge>
        );
      case "Pendente":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Pendente
          </Badge>
        );
      case "Rejeitada":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Rejeitada
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
              Filtrar por Status
            </Button>
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
                    <p className="dashboard-text-muted text-xs">Membros</p>
                    <p className="text-white font-semibold">
                      {inscricao.membros}/5
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Data</p>
                    <p className="text-white text-sm">
                      {inscricao.dataInscricao}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="dashboard-text-muted text-xs">Status</p>
                    {getStatusBadge(inscricao.status)}
                  </div>

                  {inscricao.status === "Pendente" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats das inscrições */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Aprovadas</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Rejeitadas</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inscricoes;
