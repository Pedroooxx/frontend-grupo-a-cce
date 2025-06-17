"use client";

import { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export function DataProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Create hooks for CRUD operations
export function useEntityQuery<T>(entityType: string, initialData?: T[]) {
  return useQuery({
    queryKey: [entityType],
    queryFn: async () => {
      // In a real app, you would call your API here
      // const response = await fetch(`/api/${entityType}`);
      // return response.json();
      return initialData || [];
    },
  });
}

export function useCreateEntity<T>(entityType: string) {
  return useMutation({
    mutationFn: async (data: T) => {
      // In a real app, you would call your API here
      // const response = await fetch(`/api/${entityType}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType] });
      toast.success('Item criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar item');
    },
  });
}

export function useUpdateEntity<T>(entityType: string) {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
      // In a real app, you would call your API here
      // const response = await fetch(`/api/${entityType}/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType] });
      toast.success('Item atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar item');
    },
  });
}

export function useDeleteEntity(entityType: string) {
  return useMutation({
    mutationFn: async (id: string | number) => {
      // In a real app, you would call your API here
      // await fetch(`/api/${entityType}/${id}`, { method: 'DELETE' });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType] });
      toast.success('Item excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir item');
    },
  });
}
