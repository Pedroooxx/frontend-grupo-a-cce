"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  showBlur?: boolean;
  closeOnOutsideClick?: boolean;
}

export function ModalContainer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  className,
  maxWidth = "md",
  showBlur = true,
  closeOnOutsideClick = true,
}: ModalContainerProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className={className}
      maxWidth={maxWidth}
      showBlur={showBlur}
      closeOnOutsideClick={closeOnOutsideClick}
    >
      <div className="p-6">
        {title && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            {description && (
              <p className="text-slate-400 mt-1 text-sm">{description}</p>
            )}
          </div>
        )}
        <div className="py-2">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
      {showCloseButton && (
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 text-slate-400 hover:opacity-100"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </Modal>
  );
}
