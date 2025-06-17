import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SubscriptionForm } from '@/components/forms/SubscriptionForm';
import { Calendar } from 'lucide-react';
import type { SubscriptionFormValues, Championship } from '@/types/subscription';
import type { Team } from '@/types/participant';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormValues) => Promise<void>;
  teams: Team[];
  championships: Championship[];
  defaultValues?: Partial<SubscriptionFormValues>;
}

export function AddSubscriptionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  teams,
  championships,
  defaultValues 
}: AddSubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SubscriptionFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Falha ao processar inscrição:', error);
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
            <div className="p-2 bg-green-500/20 rounded-full">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {defaultValues?.championship_id ? "Editar Inscrição" : "Nova Inscrição"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            {defaultValues?.championship_id
              ? "Altere os dados da inscrição."
              : "Preencha o formulário para inscrever uma equipe em um campeonato."}
          </DialogDescription>
        </DialogHeader>
        
        <SubscriptionForm
          onSubmit={handleSubmit}
          teams={teams}
          championships={championships}
          isLoading={isLoading}
          defaultValues={defaultValues}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
