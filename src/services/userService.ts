/**
 * User service with React Query
 */
import { createReactQueryService } from './reactQueryService';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = createReactQueryService<User>({
  entityName: 'Usuário',
  endpoint: '/users',
});

export const {
  useGetAll: useGetAllUsers,
  useGetById: useGetUserById,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
} = userService;
