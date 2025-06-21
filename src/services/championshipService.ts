/**
 * Championship service with React Query
 */
import { createReactQueryService } from './reactQueryService';

export interface Championship {
  championship_id: number;
  name: string;
  description: string;
  format: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  prize: string;
  user_id: number;
  teams_count: number;
  matches_count: number;
  prize_pool?: string;
}

export const championshipService = createReactQueryService<Championship>({
  entityName: 'Campeonato',
  endpoint: '/championships',
  idField: 'championships/id',
});

export const {
  useGetAll: useGetAllChampionships,
  useGetById: useGetChampionshipById,
  useCreate: useCreateChampionship,
  useUpdate: useUpdateChampionship,
  useDelete: useDeleteChampionship,
} = championshipService;
