import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
import { createReactQueryService } from './reactQueryService';
import type { Subscription } from '@/types/subscription';

/**
 * Fetch all subscriptions, extracting from response wrapper
 */
export const useGetAllSubscriptions = (enabled = true) => {
  return useQuery<Subscription[], ApiError>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const result = await apiClient.get<{ count: number; subscriptions: Subscription[] }>(
        '/subscriptions',
        { withAuth: true }
      );
      return Array.isArray(result.subscriptions) ? result.subscriptions : [];
    },
    enabled,
  });
};

// Reuse generic CRUD hooks for other operations
const subscriptionService = createReactQueryService<Subscription>({
  entityName: 'Inscrição',
  endpoint: '/subscriptions',
  idField: 'subscription_id',
});

export const {
  useGetById: useGetSubscriptionById,
  useCreate: useCreateSubscription,
  useUpdate: useUpdateSubscription,
  useDelete: useDeleteSubscription,
} = subscriptionService;
