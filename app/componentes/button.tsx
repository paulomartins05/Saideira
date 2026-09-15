
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../lib/utils";

export const buttonVarians = cva(
  "inline-flex items-center justify-center font-bold transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", 
  {
    variants: {
      variant: {
        primary: "bg-laranja-destaque text-white hover:opacity-90",
        outline: "bg-transparent border-2 border-background-secondary text-background-secondary hover:bg-gray-100 shadow-none ",
        ghost: "bg-transparent shadow-none hover:bg-gray-200 text-background-secondary",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-none"
      },
      size: {
        sm: "px-3 py-1.5 text-sm rounded-2xl",
        md: "px-5 py-2.5 text-base rounded-2xl",
        lg: "px-8 py-4 text-lg rounded-2xl",
        icon: "h-10 w-10 p-0 rounded-full" 
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    }
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVarians>,
  Omit<React.ComponentProps<"button">, "size"> {
    isLoading?: boolean;
    asChild?: boolean;
}

export default function Button({
  size,
  variant,
  className,
  children,
  isLoading,
  asChild = false, 
  disabled,
  ...props
}: ButtonProps) {
  
  return (
    <button 
      className={cn(buttonVarians({ variant, size }), className)} 
      disabled={isLoading || disabled} 
      {...props}
    > 
      
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}