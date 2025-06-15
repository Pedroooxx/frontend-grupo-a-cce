"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2 } from "lucide-react";
import type { DetailedPlayerStats } from "@/types/data-types";

interface ParticipantCardProps {
  player: DetailedPlayerStats;
  onEdit: (player: DetailedPlayerStats) => void;
  onDelete: (id: number) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ player: p, onEdit, onDelete }) => {
  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{p.nickname}</h3>
            <p className="dashboard-text-muted text-sm">{p.name}</p>
            <p className="dashboard-text-muted text-xs">{p.team_name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(p)} className="border-gray-600 text-gray-300">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(p.participant_id)} className="border-red-500 text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="dashboard-text-muted text-sm">Contato</span>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {p.phone}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="dashboard-text-muted text-sm">K/D/A</span>
          <span className="text-white font-medium">
            {p.total_kills}/{p.total_deaths}/{p.total_assists}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="dashboard-text-muted text-sm">KDA Ratio</span>
          <span className="text-green-400 font-medium">{p.kda_ratio}</span>
        </div>
        <div className="flex justify-between">
          <span className="dashboard-text-muted text-sm">Win Rate</span>
          <span className="text-blue-400 font-medium">{Math.round(p.win_rate * 100)}%</span>
        </div>
      </div>
    </Card>
  );
};
