
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
  count?: number;
  subscriptions?: Subscription[];
  data?: Subscription[];
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
      const response = await apiClient.get<SubscriptionResponse>(
        '/subscriptions',
        { withAuth: true }
      );
      // Check if response has the expected structure
      if (response && response.subscriptions && Array.isArray(response.subscriptions)) {
        return response.subscriptions;
      } else if (response && Array.isArray(response)) {
        // Handle case where API directly returns array
        return response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Handle case where API returns data property
        return response.data;
      }
      console.warn('Subscription service: Unexpected API response format', response);
      return [];
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
