import { z } from 'zod';

/**
 * Agent interface matching the backend API response
 */
export interface Agent {
  agent_id: number;
  name: string;
}

/**
 * Schema for agent form validation
 */
export const agentSchema = z.object({
  name: z.string()
    .min(2, 'Nome do agente deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo')
    .regex(/^[a-zA-Z\s]+$/, 'Nome deve conter apenas letras e espaços'),
});

/**
 * Type for agent form values
 */
export type AgentFormValues = z.infer<typeof agentSchema>;

/**
 * Runtime validation helper
 */
export const validateAgent = (data: unknown): AgentFormValues => {
  return agentSchema.parse(data);
};

/**
 * Available Valorant agents list
 */
export const VALORANT_AGENTS = [
  'Astra',
  'Breach',
  'Brimstone',
  'Chamber',
  'Cypher',
  'Deadlock',
  'Fade',
  'Gekko',
  'Harbor',
  'Jett',
  'KAY/O',
  'Killjoy',
  'Neon',
  'Omen',
  'Phoenix',
  'Raze',
  'Reyna',
  'Sage',
  'Skye',
  'Sova',
  'Viper',
  'Yoru',
] as const;

export type ValorantAgent = typeof VALORANT_AGENTS[number];