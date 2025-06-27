import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChampionshipStatisticSchema } from '@/types/statistics';
import type { ChampionshipStatisticInput } from '@/types/statistics';

interface AddChampionshipStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChampionshipStatisticInput) => void;
}

export const AddChampionshipStatisticsModal: React.FC<AddChampionshipStatisticsModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChampionshipStatisticInput>({
    resolver: zodResolver(ChampionshipStatisticSchema),
  });

  const handleFormSubmit = (data: ChampionshipStatisticInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="championship_id" className="text-slate-300">Championship ID</Label>
              <Input
                id="championship_id"
                type="number"
                {...register('championship_id')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.championship_id ? 'championship_id-error' : undefined}
              />
              {errors.championship_id && (
                <p id="championship_id-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.championship_id.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="participant_id" className="text-slate-300">Participant ID</Label>
              <Input
                id="participant_id"
                type="number"
                {...register('participant_id')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.participant_id ? 'participant_id-error' : undefined}
              />
              {errors.participant_id && (
                <p id="participant_id-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.participant_id.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="team_id" className="text-slate-300">Team ID</Label>
              <Input
                id="team_id"
                type="number"
                {...register('team_id')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.team_id ? 'team_id-error' : undefined}
              />
              {errors.team_id && (
                <p id="team_id-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.team_id.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="kills" className="text-slate-300">Kills</Label>
              <Input
                id="kills"
                type="number"
                {...register('kills')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
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
                {...register('assists')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
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
                {...register('deaths')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
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
            <div>
              <Label htmlFor="MVPs" className="text-slate-300">MVPs</Label>
              <Input
                id="MVPs"
                type="number"
                {...register('MVPs')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.MVPs ? 'MVPs-error' : undefined}
              />
              {errors.MVPs && (
                <p id="MVPs-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.MVPs.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="first_kills" className="text-slate-300">First Kills</Label>
              <Input
                id="first_kills"
                type="number"
                {...register('first_kills')}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-describedby={errors.first_kills ? 'first_kills-error' : undefined}
              />
              {errors.first_kills && (
                <p id="first_kills-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.first_kills.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300 rounded-md hover:bg-slate-800">
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
