import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ParticipantForm } from '@/components/forms/ParticipantForm';
import { User } from 'lucide-react';

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teams: { team_id: number; name: string }[];
}

export function AddParticipantModal({ isOpen, onClose, onSubmit, teams }: AddParticipantModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Falha ao adicionar participante:', error);
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
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <DialogTitle className="text-xl font-bold">Adicionar Jogador</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Preencha o formulário abaixo para adicionar um novo participante à equipe.
          </DialogDescription>
        </DialogHeader>
        
        <ParticipantForm
          onSubmit={handleSubmit}
          teams={teams}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
