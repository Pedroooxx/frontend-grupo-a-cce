import { z } from 'zod';

export interface Championship {
  championship_id: number;
  name: string;
  format?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  prize?: number;
  status?: string;
}

export interface Subscription {
  subscription_id: number;
  championship_id: number;
  team_id: number;
  subscription_date: Date;
  championship_name?: string; // For display purposes
  team_name?: string; // For display purposes
}

export const subscriptionSchema = z.object({
  championship_id: z.number({
    required_error: 'Selecione um campeonato',
    invalid_type_error: 'Selecione um campeonato válido',
  }).refine(val => val > 0, {
    message: 'Selecione um campeonato válido'
  }),
  team_id: z.number({
    required_error: 'Selecione uma equipe',
    invalid_type_error: 'Selecione uma equipe válida',
  }).refine(val => val > 0, {
    message: 'Selecione uma equipe válida'
  }),
  subscription_date: z.string().default(() => new Date().toISOString().split('T')[0]).transform((val) => new Date(val)),
});
 
export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

// Runtime validation helper
export const validateSubscription = (data: unknown): SubscriptionFormValues => {
  return subscriptionSchema.parse(data);
};
