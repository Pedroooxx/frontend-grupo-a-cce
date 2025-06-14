import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useErrorHandler() {
  const handleError = useCallback((error: unknown, fallbackMessage = 'Ocorreu um erro inesperado') => {
    console.error('Error:', error);
    
    if (error instanceof Error) {
      toast.error(error.message);
    } else if (typeof error === 'string') {
      toast.error(error);
    } else {
      toast.error(fallbackMessage);
    }
  }, []);

  return { handleError };
}
