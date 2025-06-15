"use client";
import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2 } from "lucide-react";
import type { DetailedPlayerStats } from "@/types/data-types";
import Link from "next/link";

interface ParticipantCardProps {
  player: DetailedPlayerStats;
  onEdit: (player: DetailedPlayerStats) => void;
  onDelete: (id: number) => void;
}

interface BaseParticipantCardProps {
  player: DetailedPlayerStats;
  onEdit: (player: DetailedPlayerStats) => void;
  onDelete: (id: number) => void;
  iconBgClass: string;
  iconTextClass: string;
  cardBgClass?: string;
  children: ReactNode;
}

const BaseParticipantCard: React.FC<BaseParticipantCardProps> = ({
  player: p,
  onEdit,
  onDelete,
  iconBgClass,
  iconTextClass,
  cardBgClass = "",
  children
}) => {
  return (
    <Card className={`dashboard-card border-gray-700 p-6 ${cardBgClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${iconBgClass} rounded-lg`}>
            <User className={`w-8 h-8 ${iconTextClass}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{p.nickname}</h3>
            <p className="dashboard-text-muted text-sm">{p.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(p)}
            className="border-gray-600 text-gray-300"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(p.participant_id)}
            className="border-red-500 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </Card>
  );
};

const CoachCard: React.FC<ParticipantCardProps> = ({ player, onEdit, onDelete }) => {
  return (
    <BaseParticipantCard
      player={player}
      onEdit={onEdit}
      onDelete={onDelete}
      iconBgClass="bg-yellow-500/20"
      iconTextClass="text-yellow-500"
      cardBgClass="bg-yellow-900"
    >
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Cargo</span>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Coach
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Equipe</span>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          {player.team_name || "Sem time"}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Contato</span>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          {player.phone}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Win Rate</span>
        <span className="text-blue-400 font-medium">
          {Math.round(player.win_rate * 100)}%
        </span>
      </div>
    </BaseParticipantCard>
  );
};

const PlayerCard: React.FC<ParticipantCardProps> = ({ player, onEdit, onDelete }) => {
  return (
    <BaseParticipantCard
      player={player}
      onEdit={onEdit}
      onDelete={onDelete}
      iconBgClass="bg-blue-500/20"
      iconTextClass="text-blue-500"
    >
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Cargo</span>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          Jogador
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Equipe</span>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          {player.team_name || "Sem time"}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Contato</span>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          {player.phone}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">K/D/A</span>
        <span className="text-white font-medium">
          {player.total_kills}/{player.total_deaths}/{player.total_assists}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">KDA Ratio</span>
        <span className="text-green-400 font-medium">{player.kda_ratio}</span>
      </div>
      <div className="flex justify-between">
        <span className="dashboard-text-muted text-sm">Win Rate</span>
        <span className="text-blue-400 font-medium">
          {Math.round(player.win_rate * 100)}%
        </span>
      </div>

      <Link
        href={`/dashboard/estatisticas/jogador/${player.participant_id}`}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors font-medium text-center block"
      >
        Ver Detalhes
      </Link>
    </BaseParticipantCard>
  );
};

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ player, onEdit, onDelete }) => {
  return player.is_coach
    ? <CoachCard player={player} onEdit={onEdit} onDelete={onDelete} />
    : <PlayerCard player={player} onEdit={onEdit} onDelete={onDelete} />;
};
