"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  isEditing?: boolean;
  children: ReactNode;
}

export function EntityModal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  iconColor = "blue",
  iconBgColor = "blue",
  isEditing = false,
  children,
}: EntityModalProps) {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            {Icon && (
              <div className={`p-2 bg-${iconBgColor}-500/20 rounded-full`}>
                <Icon className={`w-6 h-6 text-${iconColor}-500`} />
              </div>
            )}
            <DialogTitle className="text-xl font-bold">
              {isEditing ? `Editar ${title}` : `Adicionar ${title}`}
            </DialogTitle>
          </div>
          {description && (
            <DialogDescription className="text-slate-400">
              {isEditing
                ? `Altere os dados ${description ? `do ${description}` : ''}.`
                : `Preencha o formulário para adicionar ${description || ''}.`}
            </DialogDescription>
          )}
        </DialogHeader>
        
        {children}
      </DialogContent>
    </Dialog>
  );
}
