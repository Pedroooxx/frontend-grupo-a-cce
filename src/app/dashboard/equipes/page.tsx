"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../_components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2, User } from "lucide-react";

const GerenciarEquipes = () => {
  const [equipes] = useState([
    {
      id: 1,
      nome: "Valorant Kings",
      coach: "João Silva",
      membros: [
        { nome: "Player1", nickname: "King1"},
        { nome: "Player2", nickname: "King2"},
        { nome: "Player3", nickname: "King3"},
        { nome: "Player4", nickname: "King4"},
        { nome: "Player5", nickname: "King5"},
      ],
      campeonato: "Liga de Verão 2024"
    },
    {
      id: 2,
      nome: "Phoenix Squad",
      coach: "Maria Santos",
      membros: [
        { nome: "PlayerA", nickname: "Phoenix1"},
        { nome: "PlayerB", nickname: "Phoenix2"},
        { nome: "PlayerC", nickname: "Phoenix3"},
        { nome: "PlayerD", nickname: "Phoenix4"},
        { nome: "PlayerE", nickname: "Phoenix5"},
      ],
      campeonato: "Torneio Nacional"
    },
  ]);

  return (
    <DashboardLayout
      title="GERENCIAR"
      subtitle="EQUIPES"
      breadcrumbs={[
        { label: "DASHBOARD", href: "/" },
        { label: "GERENCIAR EQUIPES" },
      ]}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gerenciar Equipes</h1>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Equipe
          </Button>
        </div>

        {/* Lista de equipes */}
        <div className="space-y-6">
          {equipes.map((equipe) => (
            <Card
              key={equipe.id}
              className="dashboard-card border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {equipe.nome}
                    </h3>
                    <p className="dashboard-text-muted">
                      Coach: {equipe.coach}
                    </p>
                    <p className="dashboard-text-muted text-sm">
                      {equipe.campeonato}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Membros da equipe */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Membros da Equipe
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {equipe.membros.map((membro, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-lg p-4 text-center"
                    >
                      <div className="p-2 bg-gray-700 rounded-lg mb-3 mx-auto w-fit">
                        <User className="w-6 h-6 text-gray-300" />
                      </div>
                      <h5 className="text-white font-medium text-sm">
                        {membro.nickname}
                      </h5>
                      <p className="dashboard-text-muted text-xs">
                        {membro.nome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats das equipes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total de Equipes</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Total de Jogadores</p>
                <p className="text-2xl font-bold text-white">10</p>
              </div>
            </div>
          </Card>
          <Card className="dashboard-card border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="dashboard-text-muted text-sm">Coaches (Treinadores)</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GerenciarEquipes;
