/**
 * Championship service with React Query
 */
import { createReactQueryService } from './reactQueryService';

export interface Championship {
  id: number;
  name: string;
  description: string;
  format: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  prize: string;
  user_id: number;
}

export const championshipService = createReactQueryService<Championship>({
  entityName: 'Campeonato',
  endpoint: '/championship',
});

export const {
  useGetAll: useGetAllChampionships,
  useGetById: useGetChampionshipById,
  useCreate: useCreateChampionship,
  useUpdate: useUpdateChampionship,
  useDelete: useDeleteChampionship,
} = championshipService;
