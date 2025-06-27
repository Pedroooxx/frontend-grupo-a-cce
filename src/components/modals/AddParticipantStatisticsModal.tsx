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
      const response = await fetch('http://localhost:3001/participant-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add participant statistics');
      }

      const responseData = await response.json();
      toast.success('Estatísticas adicionadas com sucesso!');
      console.log(responseData);
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
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">Adicionar Estatísticas do Participante</DialogTitle>
          <DialogDescription className="text-sm text-slate-400 text-center">
            Preencha os campos abaixo para adicionar estatísticas ao participante.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="match_id" className="text-slate-300">ID da Partida</Label>
              <Input
                id="match_id"
                type="number"
                placeholder="Digite o ID da partida"
                {...register('match_id')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.match_id ? 'match_id-error' : undefined}
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
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md shadow-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.participant_id ? 'participant_id-error' : undefined}
              />
              {errors.participant_id && (
                <p id="participant_id-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.participant_id.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="agent_id" className="text-slate-300">ID do Agente</Label>
              <Input
                id="agent_id"
                type="number"
                placeholder="Digite o ID do agente"
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md shadow-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.agent_id ? 'agent_id-error' : undefined}
              />
              {errors.agent_id && (
                <p id="agent_id-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.agent_id.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="kills" className="text-slate-300">Kills</Label>
              <Input
                id="kills"
                type="number"
                placeholder="Digite o número de kills"
                {...register('kills')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.kills ? 'kills-error' : undefined}
              />
              {errors.kills && (
                <p id="kills-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.kills.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="assists" className="text-slate-300">Assists</Label>
              <Input
                id="assists"
                type="number"
                placeholder="Digite o número de assists"
                {...register('assists')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.assists ? 'assists-error' : undefined}
              />
              {errors.assists && (
                <p id="assists-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.assists.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="deaths" className="text-slate-300">Deaths</Label>
              <Input
                id="deaths"
                type="number"
                placeholder="Digite o número de deaths"
                {...register('deaths')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.deaths ? 'deaths-error' : undefined}
              />
              {errors.deaths && (
                <p id="deaths-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.deaths.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="spike_plants" className="text-slate-300">Spike Plants</Label>
              <Input
                id="spike_plants"
                type="number"
                placeholder="Digite o número de spike plants"
                {...register('spike_plants')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.spike_plants ? 'spike_plants-error' : undefined}
              />
              {errors.spike_plants && (
                <p id="spike_plants-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.spike_plants.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="spike_defuses" className="text-slate-300">Spike Defuses</Label>
              <Input
                id="spike_defuses"
                type="number"
                placeholder="Digite o número de spike defuses"
                {...register('spike_defuses')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.spike_defuses ? 'spike_defuses-error' : undefined}
              />
              {errors.spike_defuses && (
                <p id="spike_defuses-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.spike_defuses.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center space-x-6 mt-4">
            <div>
              <Label htmlFor="MVP" className="text-slate-300">MVP</Label>
              <Input
                id="MVP"
                type="checkbox"
                {...register('MVP')}
                className="mt-1 h-6 w-6 border-slate-700 bg-slate-800 text-slate-300 rounded focus:ring-red-500"
                aria-describedby={errors.MVP ? 'MVP-error' : undefined}
              />
              {errors.MVP && (
                <p id="MVP-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.MVP.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="first_kill" className="text-slate-300">First Kill</Label>
              <Input
                id="first_kill"
                type="checkbox"
                {...register('first_kill')}
                className="mt-1 h-6 w-6 border-slate-700 bg-slate-800 text-slate-300 rounded focus:ring-red-500"
                aria-describedby={errors.first_kill ? 'first_kill-error' : undefined}
              />
              {errors.first_kill && (
                <p id="first_kill-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.first_kill.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300 rounded-md hover:bg-slate-800" disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddParticipantStatisticsModal;
