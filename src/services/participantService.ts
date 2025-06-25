/**
 * Participant service with React Query
 */
import { createReactQueryService } from './reactQueryService';

export interface Participant {
  participant_id: number;
  name: string;
  nickname: string;
  birth_date: string;
  phone: number;
  team_id: number;
  is_coach: boolean;
  user_id: number;
}

export const participantService = createReactQueryService<Participant>({
  entityName: 'Participante',
  endpoint: '/participants',
  idField: 'participant_id',
});

export const {
  useGetAll: useGetAllParticipants,
  useGetById: useGetParticipantById,
  useCreate: useCreateParticipant,
  useUpdate: useUpdateParticipant,
  useDelete: useDeleteParticipant,
} = participantService;
