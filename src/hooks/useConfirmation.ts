"use client";

import { useState, useCallback } from "react";

interface UseConfirmationResult<T> {
  isOpen: boolean;
  itemToDelete: T | null;
  itemName: string;
  openConfirmation: (item: T, name: string) => void;
  closeConfirmation: () => void;
  handleConfirm: () => void;
  isConfirming: boolean;
}

export function useConfirmation<T>(
  onConfirm: (item: T) => Promise<void> | void
): UseConfirmationResult<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [itemName, setItemName] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const openConfirmation = useCallback((item: T, name: string) => {
    setItemToDelete(item);
    setItemName(name);
    setIsOpen(true);
  }, []);

  const closeConfirmation = useCallback(() => {
    setIsOpen(false);
    setItemToDelete(null);
    setItemName("");
  }, []);

  const handleConfirm = useCallback(async () => {
    if (itemToDelete) {
      setIsConfirming(true);
      try {
        await onConfirm(itemToDelete);
      } finally {
        setIsConfirming(false);
        closeConfirmation();
      }
    }
  }, [itemToDelete, onConfirm, closeConfirmation]);

  return {
    isOpen,
    itemToDelete,
    itemName,
    openConfirmation,
    closeConfirmation,
    handleConfirm,
    isConfirming,
  };
}
