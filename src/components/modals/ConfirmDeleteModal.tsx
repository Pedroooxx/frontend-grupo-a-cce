"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  entityName?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar exclusão",
  description = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
  entityName,
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-500/20 rounded-lg mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {entityName ? `Tem certeza que deseja excluir "${entityName}"? Esta ação não pode ser desfeita.` : description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-center gap-2 mt-4">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
