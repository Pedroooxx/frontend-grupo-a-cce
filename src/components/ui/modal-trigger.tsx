"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalTriggerProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function ModalTrigger({
  onClick,
  children,
  className,
  asChild = false,
}: ModalTriggerProps) {
  const Comp = asChild ? React.Fragment : "button";
  
  const handleClick = (e: React.MouseEvent) => {
    if (!asChild) e.preventDefault();
    onClick();
  };

  if (asChild) {
    // Clone the child element and add the onClick handler
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent) => {
        handleClick(e);
        if (child.props.onClick) child.props.onClick(e);
      },
    });
  }
  
  return (
    <Comp
      className={cn("", className)}
      onClick={handleClick}
    >
      {children}
    </Comp>
  );
}
