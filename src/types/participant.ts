import { z } from 'zod';

export const participantSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo'),
  nickname: z.string().min(2, 'Nickname deve ter pelo menos 2 caracteres').max(20, 'Nickname muito longo'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 100;
    }, 'Idade deve ser entre 16 e 100 anos'),
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(20, 'Telefone muito longo')
    .regex(/^\+?[0-9\s\-()]+$/, 'Formato de telefone inválido'),
  team_id: z.union([z.string(), z.number()]).transform((val) => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ).refine((val) => !isNaN(val) && val > 0, 'Selecione uma equipe válida'),
  is_coach: z.boolean().default(false)
});

// ✅ ADD: Runtime validation helper
export const validateParticipant = (data: unknown): ParticipantFormValues => {
  return participantSchema.parse(data);
};

export type ParticipantFormValues = z.infer<typeof participantSchema>;

export interface Team {
  team_id: number;
  name: string;
}

export interface Player {
  id: number;
  nome: string;
  nickname: string;
  equipe: string;
  phone: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  winRate: string;
  isCoach?: boolean;
}

export interface PlayerStats {
  totalPlayers: number;
  avgKDA: string;
  totalKills: number;
}
