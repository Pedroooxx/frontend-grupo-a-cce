/**
 * Subscription service with React Query
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
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

export const subscriptionService = createReactQueryService<Subscription>({
  entityName: 'Inscrição',
  endpoint: '/subscriptions',
});

// Custom hook for getting all subscriptions that handles the API response format
export const useGetAllSubscriptions = (enabled = true) => {
  return useQuery<Subscription[], ApiError>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await apiClient.get<SubscriptionResponse>('/subscriptions', { withAuth: true });
      return response.subscriptions; // Extract the subscriptions array from the response
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
