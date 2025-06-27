import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { participantStatisticSchema } from '../../types/statistics';

interface AddParticipantStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParticipantStatisticFormValues) => Promise<void>;
}

interface ParticipantStatisticFormValues {
  match_id: number;
  participant_id: number;
  agent_id: number;
  kills: number;
  assists: number;
  deaths: number;
  spike_plants?: number;
  spike_defuses?: number;
  MVP?: boolean;
  first_kill?: boolean;
}

const AddParticipantStatisticsModal = ({ isOpen, onClose, onSubmit }: AddParticipantStatisticsModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ParticipantStatisticFormValues>({
    resolver: zodResolver(participantStatisticSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: ParticipantStatisticFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast.success('Estatísticas adicionadas com sucesso!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Erro ao adicionar estatísticas.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Adicionar Estatísticas do Participante</DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Preencha os campos abaixo para adicionar estatísticas ao participante.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="match_id" className="text-slate-300">ID da Partida</Label>
            <Input
              id="match_id"
              type="number"
              placeholder="Digite o ID da partida"
              {...register('match_id')}
              className="mt-1 border-slate-700 bg-slate-800 text-slate-300"
              aria-required="true"
              aria-describedby={errors.match_id ? "match_id-error" : undefined}
            />
            {errors.match_id && (
              <p id="match_id-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.match_id.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="participant_id" className="text-slate-300">ID do Participante</Label>
            <Input
              id="participant_id"
              type="number"
              placeholder="Digite o ID do participante"
              {...register('participant_id')}
              className="mt-1 border-slate-700 bg-slate-800 text-slate-300"
              aria-required="true"
              aria-describedby={errors.participant_id ? "participant_id-error" : undefined}
            />
            {errors.participant_id && (
              <p id="participant_id-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.participant_id.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300" disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddParticipantStatisticsModal;
