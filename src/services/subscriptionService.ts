
import { apiClient, ApiError } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { createReactQueryService } from './reactQueryService';

export interface Subscription {
  subscription_id: number;
  championship_id: number;
  team_id: number;
  subscription_date: Date;
}

interface SubscriptionResponse {
  count: number;
  subscriptions: Subscription[];
}


// Reuse generic CRUD hooks for other operations
const subscriptionService = createReactQueryService<Subscription>({
  entityName: 'Inscrição',
  endpoint: '/subscriptions',
  idField: 'subscription_id',
});

/**
 * Fetch all subscriptions, extracting from response wrapper
 */
export const useGetAllSubscriptions = (enabled = true) => {
  return useQuery<Subscription[], ApiError>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const result = await apiClient.get<SubscriptionResponse>(
        '/subscriptions',
        { withAuth: true }
      );
      return Array.isArray(result.subscriptions) ? result.subscriptions : [];
    },
    enabled,
  });
};

export const {
  useGetById: useGetSubscriptionById,
  useCreate: useCreateSubscription,
  useUpdate: useUpdateSubscription,
  useDelete: useDeleteSubscription,
} = subscriptionService;
