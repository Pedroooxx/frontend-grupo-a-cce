"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showBlur?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOutsideClick?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full"
};

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showBlur = true,
  maxWidth = "md",
  closeOnOutsideClick = true,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnOutsideClick ? onClose : undefined}>
      <DialogContent 
        className={cn(
          "bg-slate-900 border-slate-700 text-white p-0 overflow-hidden",
          sizeClasses[maxWidth],
          showBlur && "backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
