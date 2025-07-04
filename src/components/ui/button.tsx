import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-red-500 text-white shadow hover:bg-red-600 focus-visible:ring-red-500",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-600",
        outline: "border border-slate-600 bg-transparent text-slate-300 shadow-sm hover:bg-slate-800 hover:text-white focus-visible:ring-red-500",
        secondary: "bg-slate-700 text-slate-100 shadow-sm hover:bg-slate-600 focus-visible:ring-slate-500",
        ghost: "text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:ring-red-500",
        link: "text-red-400 underline-offset-4 hover:underline hover:text-red-300 focus-visible:ring-red-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
