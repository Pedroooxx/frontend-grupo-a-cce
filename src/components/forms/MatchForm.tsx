"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  matchCreateSchema, 
  type MatchFormValues, 
  AVAILABLE_MAPS, 
  AVAILABLE_STAGES 
} from '@/types/match';
import type { Championship } from '@/types/subscription';

interface MatchFormProps {
  onSubmit: (data: MatchFormValues) => Promise<void>;
  teams: PublicTeam[];
  championships: Championship[];
  isLoading?: boolean;
  defaultValues?: Partial<MatchFormValues>;
  onCancel?: () => void;
  mode?: 'create' | 'edit' | 'result';
}

export function MatchForm({
  onSubmit,
  teams,
  championships,
  isLoading = false,
  defaultValues = {},
  onCancel,
  mode = 'create',
}: MatchFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchCreateSchema),
    defaultValues: {
      championship_id: defaultValues.championship_id || 0,
      teamA_id: defaultValues.teamA_id || 0,
      teamB_id: defaultValues.teamB_id || 0,
      stage: defaultValues.stage || '',
      map: defaultValues.map || '',
      date: defaultValues.date || '',
      winner_team_id: defaultValues.winner_team_id || 0,
      score: defaultValues.score || { teamA: 0, teamB: 0 },
    }
  });

  const selectedTeamA = watch('teamA_id');
  const selectedTeamB = watch('teamB_id');

  const onSubmitForm = async (data: MatchFormValues) => {
    try {
      setSubmitting(true);
      
      // Validate teams are different
      if (data.teamA_id === data.teamB_id) {
        toast.error('Os times devem ser diferentes');
        return;
      }

      await onSubmit(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar partida');
    } finally {
      setSubmitting(false);
    }
  };

  // Custom select component for better styling
  const SelectField = ({ label, id, error, options, ...props }: {
    label: string; 
    id: string; 
    error?: { message: string };
    options: { id: number | string; name: string }[]; 
    [key: string]: any
  }) => (
    <div>
      <Label htmlFor={id} className="flex items-center">
        {label} <span className="text-red-500 ml-1">*</span>
      </Label>
      <select
        id={id}
        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
        aria-required="true"
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        <option value="0">Selecione {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );

  const getAvailableTeamsForB = () => {
    return teams.filter(team => team.team_id !== selectedTeamA);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {mode !== 'result' && (
        <>
          <SelectField
            label="Campeonato"
            id="championship_id"
            error={errors.championship_id ? { message: errors.championship_id.message || '' } : undefined}
            options={championships.map(c => ({ id: c.championship_id, name: c.name }))}
            {...register('championship_id', { valueAsNumber: true })}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Time A"
              id="teamA_id"
              error={errors.teamA_id ? { message: errors.teamA_id.message || '' } : undefined}
              options={teams.map(t => ({ id: t.team_id, name: t.name }))}
              {...register('teamA_id', { valueAsNumber: true })}
            />

            <SelectField
              label="Time B"
              id="teamB_id"
              error={errors.teamB_id ? { message: errors.teamB_id.message || '' } : undefined}
              options={getAvailableTeamsForB().map(t => ({ id: t.team_id, name: t.name }))}
              {...register('teamB_id', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Fase"
              id="stage"
              error={errors.stage ? { message: errors.stage.message || '' } : undefined}
              options={AVAILABLE_STAGES.map(stage => ({ id: stage, name: stage }))}
              {...register('stage')}
            />

            <SelectField
              label="Mapa"
              id="map" 
              error={errors.map ? { message: errors.map.message || '' } : undefined}
              options={AVAILABLE_MAPS.map(map => ({ id: map, name: map }))}
              {...register('map')}
            />
          </div>

          <div>
            <Label htmlFor="date">Data e Hora</Label>
            <Input
              id="date"
              type="datetime-local"
              className="mt-1"
              aria-required="true"
              aria-describedby={errors.date ? "date-error" : undefined}
              {...register('date')}
            />
            {errors.date && (
              <p id="date-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.date.message}
              </p>
            )}
          </div>
        </>
      )}

      {(mode === 'edit' || mode === 'result') && (
        <>
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Resultado da Partida</h3>
            
            <SelectField
              label="Time Vencedor"
              id="winner_team_id"
              error={errors.winner_team_id ? { message: errors.winner_team_id.message || '' } : undefined}
              options={[
                ...(selectedTeamA ? [{ id: selectedTeamA, name: teams.find(t => t.team_id === selectedTeamA)?.name || '' }] : []),
                ...(selectedTeamB ? [{ id: selectedTeamB, name: teams.find(t => t.team_id === selectedTeamB)?.name || '' }] : [])
              ].filter(t => t.name)}
              {...register('winner_team_id', { valueAsNumber: true })}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="score.teamA">
                  Pontuação Time A {selectedTeamA && `(${teams.find(t => t.team_id === selectedTeamA)?.name})`}
                </Label>
                <Input
                  id="score.teamA"
                  type="number"
                  min="0"
                  max="50"
                  className="mt-1"
                  {...register('score.teamA', { valueAsNumber: true })}
                />
                {errors.score?.teamA && (
                  <p className="text-red-500 text-sm mt-1">{errors.score.teamA.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="score.teamB">
                  Pontuação Time B {selectedTeamB && `(${teams.find(t => t.team_id === selectedTeamB)?.name})`}
                </Label>
                <Input
                  id="score.teamB"
                  type="number"
                  min="0"
                  max="50"
                  className="mt-1"
                  {...register('score.teamB', { valueAsNumber: true })}
                />
                {errors.score?.teamB && (
                  <p className="text-red-500 text-sm mt-1">{errors.score.teamB.message}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || submitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600"
          disabled={isLoading || submitting}
        >
          {(isLoading || submitting) ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
