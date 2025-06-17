"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { subscriptionSchema, type SubscriptionFormValues } from '@/types/subscription';
import type { Team } from '@/types/participant';
import type { Championship } from '@/types/subscription';

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionFormValues) => Promise<void>;
  teams: Team[];
  championships: Championship[];
  isLoading?: boolean;
  defaultValues?: Partial<SubscriptionFormValues>;
  onCancel?: () => void;
}

export function SubscriptionForm({
  onSubmit,
  teams,
  championships,
  isLoading = false,
  defaultValues = {},
  onCancel,
}: SubscriptionFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      championship_id: defaultValues.championship_id || 0,
      team_id: defaultValues.team_id || 0,
      subscription_date: defaultValues.subscription_date || new Date().toISOString().split('T')[0],
    }
  });

  const onSubmitForm = async (data: SubscriptionFormValues) => {
    try {
      setSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Custom select component for better styling
  const SelectField = ({ label, id, error, options, ...props }:
    {
      label: string; id: string; error?: { message: string };
      options: { id: number; name: string }[]; [key: string]: any
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

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <SelectField
        label="Campeonato"
        id="championship_id"
        error={errors.championship_id ? { message: errors.championship_id.message || '' } : undefined}
        options={championships.map(c => ({ id: c.championship_id, name: c.name }))}
        {...register('championship_id', { valueAsNumber: true })}
      />

      <SelectField
        label="Equipe"
        id="team_id"
        error={errors.team_id ? { message: errors.team_id.message || '' } : undefined}
        options={teams.map(t => ({ id: t.team_id, name: t.name }))}
        {...register('team_id', { valueAsNumber: true })}
      />

      <div>
        <Label htmlFor="subscription_date">Data de Inscrição</Label>
        <input
          id="subscription_date"
          type="date"
          className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
          aria-required="true"
          aria-describedby={errors.subscription_date ? "subscription-date-error" : undefined}
          {...register('subscription_date')}
        />
        {errors.subscription_date && (
          <p id="subscription-date-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.subscription_date.message}
          </p>
        )}
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

