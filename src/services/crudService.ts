"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface CrudServiceOptions<T> {
  entityName: string;
  initialData: T[];
  idField?: keyof T;
}

export function useCrudService<T extends Record<string, any>>({
  entityName,
  initialData,
  idField = "id" as keyof T,
}: CrudServiceOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const getAll = () => items;

  const getById = (id: any) => items.find((item) => item[idField] === id);

  const create = async (item: T): Promise<T> => {
    setIsLoading(true);
    try {
      // In a real app, you would call your API here
      // const response = await api.post('/endpoint', item);
      const newItem = { ...item };
      setItems((prev) => [newItem, ...prev]);
      toast.success(`${entityName} criado com sucesso!`);
      return newItem;
    } catch (error) {
      toast.error(`Erro ao criar ${entityName.toLowerCase()}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: any, item: Partial<T>): Promise<T> => {
    setIsLoading(true);
    try {
      // In a real app, you would call your API here
      // const response = await api.put(`/endpoint/${id}`, item);
      let updatedItem: T | undefined;
      
      setItems((prev) =>
        prev.map((prevItem) => {
          if (prevItem[idField] === id) {
            updatedItem = { ...prevItem, ...item };
            return updatedItem;
          }
          return prevItem;
        })
      );
      
      if (!updatedItem) {
        throw new Error(`${entityName} não encontrado`);
      }
      
      toast.success(`${entityName} atualizado com sucesso!`);
      return updatedItem;
    } catch (error) {
      toast.error(`Erro ao atualizar ${entityName.toLowerCase()}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: any): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, you would call your API here
      // await api.delete(`/endpoint/${id}`);
      setItems((prev) => prev.filter((item) => item[idField] !== id));
      toast.success(`${entityName} excluído com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao excluir ${entityName.toLowerCase()}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    isLoading,
    getAll,
    getById,
    create,
    update,
    remove,
  };
}
