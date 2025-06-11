"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { participantSchema, type ParticipantFormValues, type Team } from '@/types/participant';

interface ParticipantFormProps {
  onSubmit: (data: ParticipantFormValues) => Promise<void>;
  teams: Team[];
  isLoading?: boolean;
  defaultValues?: Partial<ParticipantFormValues>;
  onCancel?: () => void;
}

export function ParticipantForm({
  onSubmit,
  teams,
  isLoading = false,
  defaultValues = {},
  onCancel,
}: ParticipantFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      nome: '',
      nickname: '',
      birth_date: '',
      phone: '',
      team_id: '', // ✅ Keep as string for form compatibility
      is_coach: false,
      ...defaultValues,
    }
  });

  const isCoach = watch('is_coach');

  const onSubmitForm = async (data: ParticipantFormValues) => {
    try {
      setSubmitting(true);
      await onSubmit(data);
      reset();
      // ✅ ISSUE: Don't show success toast here - let parent handle it
      // toast.success('Jogador adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar jogador');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ ADD: Custom select component for better styling
  const SelectField = ({ label, id, error, children, ...props }) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
        aria-required="true"
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          placeholder="Nome do jogador"
          {...register('nome')}
          className="mt-1"
          aria-required="true"
          aria-describedby={errors.nome ? "nome-error" : undefined}
        />
        {errors.nome && (
          <p id="nome-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.nome.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          placeholder="Nickname in-game"
          {...register('nickname')}
          className="mt-1"
          aria-required="true"
          aria-describedby={errors.nickname ? "nickname-error" : undefined}
        />
        {errors.nickname && (
          <p id="nickname-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.nickname.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="birth_date">Data de Nascimento</Label>
        <Input
          id="birth_date"
          type="date"
          {...register('birth_date')}
          className="mt-1"
          aria-required="true"
          aria-describedby={errors.birth_date ? "birth-date-error" : undefined}
        />
        {errors.birth_date && (
          <p id="birth-date-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.birth_date.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="+55 (00) 00000-0000"
          {...register('phone')}
          className="mt-1"
          aria-required="true"
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      <SelectField
        label="Equipe"
        id="team_id"
        error={errors.team_id}
        {...register('team_id')}
      >
        <option value="">Selecione uma equipe</option>
        {teams.map((team) => (
          <option key={team.team_id} value={team.team_id}>
            {team.name}
          </option>
        ))}
      </SelectField>

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="is_coach"
          checked={isCoach}
          onCheckedChange={(checked) => setValue('is_coach', checked)}
          aria-describedby="coach-description"
        />
        <Label htmlFor="is_coach">É técnico/coach</Label>
        <span id="coach-description" className="sr-only">
          Marque esta opção se a pessoa for técnico ou coach da equipe
        </span>
      </div>

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
