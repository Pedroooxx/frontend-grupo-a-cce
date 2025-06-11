"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Schema de validação com Zod
const participantSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  nickname: z.string().min(1, 'Nickname é obrigatório'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .regex(/^\+?[0-9\s\-()]+$/, 'Formato de telefone inválido'),
  team_id: z.string().min(1, 'Selecione uma equipe'),
  is_coach: z.boolean().default(false)
});

type ParticipantFormValues = z.infer<typeof participantSchema>;

interface ParticipantFormProps {
  onSubmit: (data: ParticipantFormValues) => void;
  teams: { team_id: number; name: string }[];
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
      team_id: '',
      is_coach: false,
      ...defaultValues,
    }
  });
  
  // Observer o valor do campo is_coach
  const isCoach = watch('is_coach');
  
  const onSubmitForm = async (data: ParticipantFormValues) => {
    try {
      setSubmitting(true);
      await onSubmit({
        ...data,
        team_id: parseInt(data.team_id, 10) // Converte string para number
      });
      reset();
      toast.success('Jogador adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar jogador');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          placeholder="Nome do jogador"
          {...register('nome')}
          className="mt-1"
        />
        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          placeholder="Nickname in-game"
          {...register('nickname')}
          className="mt-1"
        />
        {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="birth_date">Data de Nascimento</Label>
        <Input
          id="birth_date"
          type="date"
          {...register('birth_date')}
          className="mt-1"
        />
        {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="+55 (00) 00000-0000"
          {...register('phone')}
          className="mt-1"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="team_id">Equipe</Label>
        <select
          id="team_id"
          {...register('team_id')}
          className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
        >
          <option value="">Selecione uma equipe</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.name}
            </option>
          ))}
        </select>
        {errors.team_id && <p className="text-red-500 text-sm mt-1">{errors.team_id.message}</p>}
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <Switch 
          id="is_coach" 
          checked={isCoach}
          onCheckedChange={(checked) => setValue('is_coach', checked)}
        />
        <Label htmlFor="is_coach">É técnico/coach</Label>
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
