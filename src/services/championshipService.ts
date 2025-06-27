/**
 * Championship service with React Query
 */
import { createReactQueryService } from './reactQueryService';
import { apiClient, ApiError } from '@/lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Match } from '@/types/match';
import { Championship, ChampionshipApiResponse } from '@/types/championship';

// Transform API response to our internal Championship type
const transformChampionshipData = (apiData: ChampionshipApiResponse): Championship => {
  return {
    ...apiData,
    // Normalize format to our standard format
    format: (apiData.format as string) === "simple" ? "single-elimination" : 
            (apiData.format as string) === "double" ? "double-elimination" :
            apiData.format as "single-elimination" | "double-elimination",
    // Normalize status to capitalized Portuguese
    status: typeof apiData.status === "string" && apiData.status.toLowerCase() === "ativo" ? "Ativo" :
            typeof apiData.status === "string" && apiData.status.toLowerCase() === "planejado" ? "Planejado" :
            typeof apiData.status === "string" && apiData.status.toLowerCase() === "finalizado" ? "Finalizado" :
            apiData.status as "Ativo" | "Planejado" | "Finalizado",
    // Ensure prize is always a string
    prize: apiData.prize === null ? "" : String(apiData.prize),
  };
};

// Create custom championship service with transformation
const useGetAllChampionships = (enabled = true) => {
  return useQuery<Championship[], ApiError>({
    queryKey: ['championships'],
    queryFn: async () => {
      const result = await apiClient.get<ChampionshipApiResponse[]>('/championships', { withAuth: true });
      const championshipsArray = Array.isArray(result) ? result : [];
      return championshipsArray.map(transformChampionshipData);
    },
    enabled,
  });
};

const useGetChampionshipById = (id: string | number, enabled = true) => {
  return useQuery<Championship, ApiError>({
    queryKey: ['championships', id],
    queryFn: async () => {
      const result = await apiClient.get<ChampionshipApiResponse>(`/championships/${id}`, { withAuth: true });
      return transformChampionshipData(result);
    },
    enabled: enabled && !!id,
  });
};

const useCreateChampionship = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Championship, ApiError, Partial<Championship>>({
    mutationFn: async (data) => {
      const result = await apiClient.post<ChampionshipApiResponse>('/championships', data, { withAuth: true });
      return transformChampionshipData(result);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
      toast.success('Campeonato criado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar campeonato: ${error.message}`);
    },
  });
};

const useUpdateChampionship = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Championship, ApiError, { id: string | number; data: Partial<Championship> }>({
    mutationFn: async ({ id, data }) => {
      const result = await apiClient.put<ChampionshipApiResponse>(`/championships/${id}`, data, { withAuth: true });
      return transformChampionshipData(result);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['championships', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['championships'] });
      toast.success('Campeonato atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar campeonato: ${error.message}`);
    },
  });
};

const useDeleteChampionship = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, ApiError, string | number>({
    mutationFn: (id) => 
      apiClient.delete(`/championships/${id}`, { withAuth: true }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
      toast.success('Campeonato excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir campeonato: ${error.message}`);
    },
  });
};

export {
  useGetAllChampionships,
  useGetChampionshipById,
  useCreateChampionship,
  useUpdateChampionship,
  useDeleteChampionship,
};

/**
 * Interface for match response from championship matches endpoint
 */
interface ChampionshipMatchesResponse {
  success: boolean;
  data: Match[];
}

/**
 * Hook to fetch matches for a specific championship using /championships/{id}/matches endpoint
 */
export const useGetChampionshipMatches = (championshipId: number | string, enabled = true) => {
  return useQuery<Match[], ApiError>({
    queryKey: ['championships', championshipId, 'matches'],
    queryFn: async () => {
      const response = await apiClient.get<ChampionshipMatchesResponse>(
        `/championships/${championshipId}/matches`,
        { withAuth: true }
      );
      return response.data;
    },
    enabled: enabled && !!championshipId,
  });
};
