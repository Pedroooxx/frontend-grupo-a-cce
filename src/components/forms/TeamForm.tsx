"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MAX_PLAYERS, teamSchema, type TeamFormValues } from '@/types/teams';
import { Badge } from '@/components/ui/badge';
import { X, Check, AlertCircle } from 'lucide-react';
import AddParticipantStatisticsModal from '../modals/AddParticipantStatisticsModal';


interface TeamFormProps {
  onSubmit: (data: TeamFormValues) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<TeamFormValues>;
  onCancel?: () => void;
  availablePlayers: PublicParticipant[];
  selectedPlayers: PublicParticipant[];
  availableCoaches: PublicParticipant[];
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

export function TeamForm({
  onSubmit,
  isLoading = false,
  defaultValues = {},
  onCancel,
  availablePlayers,
  selectedPlayers,
  availableCoaches,
}: TeamFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState<PublicParticipant[]>(selectedPlayers);
  const [showPlayersList, setShowPlayersList] = useState(false);
  const [showCoachesList, setShowCoachesList] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<PublicParticipant | null>(
    availableCoaches.find(coach => coach.name === defaultValues.manager_name) || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAtMaxPlayers = teamPlayers.length >= MAX_PLAYERS;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      manager_name: defaultValues.manager_name || undefined,
      member_ids: selectedPlayers.map(player => player.participant_id),
      ...defaultValues,
    }
  });

  const updateMemberIds = (players: PublicParticipant[]) => {
    setTeamPlayers(players);
    setValue('member_ids', players.map(p => p.participant_id));
  };

  const addPlayer = (player: PublicParticipant) => {
    if (isAtMaxPlayers) {
      toast.error(`Limite máximo de ${MAX_PLAYERS} jogadores atingido.`);
      return;
    }

    if (!teamPlayers.some(p => p.participant_id === player.participant_id)) {
      updateMemberIds([...teamPlayers, player]);
    }
  };

  const removePlayer = (playerId: number) => {
    updateMemberIds(teamPlayers.filter(p => p.participant_id !== playerId));
  };

  const selectCoach = (coach: PublicParticipant) => {
    setSelectedCoach(coach);
    setValue('manager_name', coach.name);
    setShowCoachesList(false);
  };

  const removeCoach = () => {
    setSelectedCoach(null);
    setValue('manager_name', undefined);
  };

  const onSubmitForm = async (data: TeamFormValues) => {
    try {
      setSubmitting(true);

      if (teamPlayers.length > MAX_PLAYERS) {
        toast.error(`Uma equipe pode ter no máximo ${MAX_PLAYERS} jogadores.`);
        setSubmitting(false);
        return;
      }

      const formData = {
        ...data,
        manager_name: data.manager_name || undefined,
        member_ids: teamPlayers.map(player => player.participant_id),
      };

      await onSubmit(formData);
    } catch (error) {
      toast.error('Erro ao salvar equipe');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStatistics = async (data: ParticipantStatisticFormValues) => {
    try {
      await fetch('http://localhost:3001/participant-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao adicionar estatísticas:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome da Equipe</Label>
          <Input
            id="name"
            placeholder="Nome da equipe"
            {...register('name')}
            className="mt-1"
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="manager_name">Nome do Técnico</Label>
          <Input
            id="manager_name"
            placeholder="Nome do técnico"
            {...register('manager_name')}
            className="mt-1"
            aria-required="true"
            aria-describedby={errors.manager_name ? "manager_name-error" : undefined}
          />
          {errors.manager_name && (
            <p id="manager_name-error" className="text-red-500 text-sm mt-1">
              {errors.manager_name.message}
            </p>
          )}
        </div>

        <div>
          <Label className="flex justify-between items-center">
            <span className={`text-xs ${isAtMaxPlayers ? 'text-orange-400' : 'text-slate-400'}`}>
              Jogadores ({teamPlayers.length}/{MAX_PLAYERS})
            </span>
          </Label>
          <div className="mt-2 flex flex-wrap gap-2 border border-slate-700 rounded-md p-3 min-h-[100px]">
            {teamPlayers.length > 0 ? (
              teamPlayers.map(player => (
                <div key={player.participant_id} className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm">{player.nickname}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => removePlayer(player.participant_id)}
                  >
                    Remover
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">Nenhum jogador selecionado</p>
            )}
          </div>

          {isAtMaxPlayers && (
            <div className="flex items-center gap-2 mt-2 text-orange-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Limite de jogadores atingido</span>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className={`w-full border-slate-700 ${isAtMaxPlayers ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isAtMaxPlayers && setShowPlayersList(!showPlayersList)}
          disabled={isAtMaxPlayers}
        >
          {isAtMaxPlayers
            ? `Limite de ${MAX_PLAYERS} jogadores atingido`
            : (showPlayersList ? 'Esconder jogadores disponíveis' : 'Mostrar jogadores disponíveis')}
        </Button>

        {showPlayersList && !isAtMaxPlayers && (
          <div className="max-h-[200px] overflow-y-auto border border-slate-700 rounded-md p-2">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Jogadores disponíveis</h4>
            <div className="space-y-2">
              {availablePlayers
                .filter(player => !player.is_coach && !teamPlayers.some(p => p.participant_id === player.participant_id))
                .map(player => (
                  <div
                    key={player.participant_id}
                    className="flex justify-between items-center p-2 hover:bg-slate-800 rounded-md cursor-pointer"
                    onClick={() => addPlayer(player)}
                  >
                    <div>
                      <span className="text-slate-300 text-sm">{player.nickname}</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
                      Adicionar
                    </Button>
                  </div>
                ))}
              {availablePlayers.filter(player => !player.is_coach && !teamPlayers.some(p => p.participant_id === player.participant_id)).length === 0 && (
                <p className="text-slate-400 text-sm p-2">Nenhum jogador disponível</p>
              )}
            </div>
          </div>
        )}

        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Adicionar Estatísticas do Participante
        </Button>

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

      <AddParticipantStatisticsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStatistics}
      />
    </>
  );
}
