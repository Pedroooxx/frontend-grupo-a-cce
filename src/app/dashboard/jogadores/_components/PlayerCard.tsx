import React, { useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Trash2 } from "lucide-react";
import type { Player } from "@/types/participant";

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: number) => void;
}

// ✅ GOOD: Using React.memo for performance
const PlayerCard = React.memo(function PlayerCard({ 
  player, 
  onEdit, 
  onDelete 
}: PlayerCardProps) {
  // ✅ ADD: Memoize click handlers to prevent unnecessary re-renders
  const handleEdit = useCallback(() => {
    if (onEdit) onEdit(player);
  }, [onEdit, player]);

  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(player.id);
  }, [onDelete, player.id]);

  return (
    <Card className="dashboard-card border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {player.nickname}
            </h3>
            <p className="dashboard-text-muted text-sm">
              {player.nome}
            </p>
            <p className="dashboard-text-muted text-xs">
              {player.equipe}
            </p>
            {player.isCoach && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs mt-1">
                Coach
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={handleEdit} // ✅ Use memoized handler
              aria-label={`Editar ${player.nickname}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={handleDelete} // ✅ Use memoized handler
              aria-label={`Excluir ${player.nickname}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="dashboard-text-muted text-sm">Contato</span>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {player.phone}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="dashboard-text-muted text-sm">K/D/A</span>
          <span className="text-white font-medium">
            {player.kills}/{player.deaths}/{player.assists}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="dashboard-text-muted text-sm">KDA Ratio</span>
          <span className="text-green-400 font-medium">
            {player.kda}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="dashboard-text-muted text-sm">Win Rate</span>
          <span className="text-blue-400 font-medium">
            {player.winRate}
          </span>
        </div>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.player.id === nextProps.player.id &&
    prevProps.player.nickname === nextProps.player.nickname &&
    prevProps.player.kda === nextProps.player.kda &&
    prevProps.player.winRate === nextProps.player.winRate
  );
});

export default PlayerCard;
