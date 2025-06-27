import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MatchForm } from '@/components/forms/MatchForm';
import { Calendar } from 'lucide-react';
import type { MatchFormValues } from '@/types/match';
import type { Championship } from '@/types/subscription';

interface AddMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MatchFormValues) => Promise<void>;
  teams: PublicTeam[];
  championships: Championship[];
  defaultValues?: Partial<MatchFormValues>;
  mode?: 'create' | 'edit' | 'result';
}

export function AddMatchModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  teams,
  championships,
  defaultValues,
  mode = 'create'
}: AddMatchModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: MatchFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Falha ao salvar partida:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Editar Partida';
      case 'result':
        return 'Informar Resultado';
      default:
        return 'Agendar Partida';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'edit':
        return 'Altere os dados da partida.';
      case 'result':
        return 'Informe o resultado da partida finalizada.';
      default:
        return 'Preencha o formulário para agendar uma nova partida.';
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-green-500/20 rounded-full">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {getTitle()}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <MatchForm
          onSubmit={handleSubmit}
          teams={teams}
          championships={championships}
          isLoading={isLoading}
          defaultValues={defaultValues}
          onCancel={onClose}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
