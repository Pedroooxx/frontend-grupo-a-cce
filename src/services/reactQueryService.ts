/**
 * CRUD service using React Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';

interface ReactQueryServiceOptions {
  entityName: string;   // Used for toast messages and query keys
  endpoint: string;     // API endpoint for this entity
  idField?: string;     // Field used as ID, defaults to 'id'
}

/**
 * Creates a set of React Query hooks for CRUD operations on a specific entity
 */
export const createReactQueryService = <T extends Record<string, any>>({
  entityName,
  endpoint,
  idField = 'id',
}: ReactQueryServiceOptions) => {
  // Normalized endpoint without leading/trailing slashes
  const normalizedEndpoint = endpoint.replace(/^\/|\/$/g, '');
  
  // Base query key for this entity
  const baseQueryKey = [normalizedEndpoint];
  
  // Get all entities
  const useGetAll = (enabled = true) => {
    return useQuery<T[], ApiError>({
      queryKey: baseQueryKey,
      queryFn: async () => {
        const result = await apiClient.get<T[]>(`/${normalizedEndpoint}`, { withAuth: true });
        // Ensure we always return an array
        return Array.isArray(result) ? result : [];
      },
      enabled,
    });
  };

  // Get entity by ID
  const useGetById = (id: string | number, enabled = true) => {
    return useQuery<T, ApiError>({
      queryKey: [...baseQueryKey, id],
      queryFn: () => apiClient.get<T>(`/${normalizedEndpoint}/${id}`, { withAuth: true }),
      enabled: enabled && !!id,
    });
  };

  // Create entity
  const useCreate = () => {
    const queryClient = useQueryClient();
    
    return useMutation<T, ApiError, Omit<T, typeof idField>>({
      mutationFn: (data) => apiClient.post<T>(`/${normalizedEndpoint}`, data, { withAuth: true }),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: baseQueryKey });
        toast.success(`${entityName} criado com sucesso!`);
      },
      onError: (error) => {
        toast.error(`Erro ao criar ${entityName.toLowerCase()}: ${error.message}`);
      },
    });
  };

  // Update entity
  const useUpdate = (id?: string | number) => {
    const queryClient = useQueryClient();
    
    return useMutation<T, ApiError, { id: string | number; data: Partial<T> }>({
      mutationFn: ({ id, data }) => 
        apiClient.put<T>(`/${normalizedEndpoint}/${id}`, data, { withAuth: true }),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: [...baseQueryKey, variables.id] });
        queryClient.invalidateQueries({ queryKey: baseQueryKey });
        toast.success(`${entityName} atualizado com sucesso!`);
      },
      onError: (error) => {
        toast.error(`Erro ao atualizar ${entityName.toLowerCase()}: ${error.message}`);
      },
    });
  };

  // Delete entity
  const useDelete = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, ApiError, string | number>({
      mutationFn: (id) => 
        apiClient.delete(`/${normalizedEndpoint}/${id}`, { withAuth: true }),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: baseQueryKey });
        toast.success(`${entityName} excluído com sucesso!`);
      },
      onError: (error) => {
        toast.error(`Erro ao excluir ${entityName.toLowerCase()}: ${error.message}`);
      },
    });
  };

  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
};
