import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TeamForm } from '@/components/forms/TeamForm';
import { Users } from 'lucide-react';
import type { TeamFormValues } from '@/types/teams';
import type { PublicParticipant } from '@/types/data-types';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormValues) => Promise<void>;
  availablePlayers: PublicParticipant[];
  availableCoaches: PublicParticipant[];  // Nova prop
  selectedPlayers: PublicParticipant[];
  defaultValues?: Partial<TeamFormValues>;
}

export function AddTeamModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  availablePlayers,
  availableCoaches,  // Nova prop
  selectedPlayers,
  defaultValues 
}: AddTeamModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TeamFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Falha ao salvar equipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {defaultValues?.name ? "Editar Equipe" : "Adicionar Equipe"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            {defaultValues?.name
              ? "Altere os dados da equipe e seus jogadores."
              : "Preencha o formulário para adicionar uma equipe."}
          </DialogDescription>
        </DialogHeader>
        
        <TeamForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultValues={defaultValues}
          onCancel={onClose}
          availablePlayers={availablePlayers}
          availableCoaches={availableCoaches}  // Passa a nova prop
          selectedPlayers={selectedPlayers}
        />
      </DialogContent>
    </Dialog>
  );
}
