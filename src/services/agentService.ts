/**
 * Agent service with React Query
 */
import { createReactQueryService } from './reactQueryService';

export interface Agent {
  agent_id: number;
  name: string;
}

/**
 * Create agent service using the generic CRUD service
 */
export const agentService = createReactQueryService<Agent>({
  entityName: 'Agente',
  endpoint: '/agents',
  idField: 'agent_id',
});

/**
 * Export all agent-related hooks
 */
export const {
  useGetAll: useGetAllAgents,
  useGetById: useGetAgentById,
  useCreate: useCreateAgent,
  useUpdate: useUpdateAgent,
  useDelete: useDeleteAgent,
} = agentService;