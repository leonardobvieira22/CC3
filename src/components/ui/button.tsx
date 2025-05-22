import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/90",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground shadow-sm hover:bg-success/90 active:bg-success/95",
        warning: "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 active:bg-warning/95",
        info: "bg-info text-info-foreground shadow-sm hover:bg-info/90 active:bg-info/95",
        // High contrast variants for better accessibility
        "high-contrast": 
          "bg-black text-white dark:bg-white dark:text-black border-2 border-transparent shadow-sm hover:bg-gray-900 dark:hover:bg-gray-100 active:bg-gray-800 dark:active:bg-gray-200 font-semibold",
        "high-contrast-outline": 
          "border-2 border-black text-black dark:border-white dark:text-white bg-transparent hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 font-semibold",
        "high-contrast-primary": 
          "bg-primary text-white shadow-sm hover:bg-primary/90 active:bg-primary/95 border-2 border-transparent font-semibold",
        "high-contrast-destructive": 
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 active:bg-destructive/95 border-2 border-transparent font-semibold",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-md px-3.5 py-2 text-xs",
        lg: "h-12 rounded-md px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
      weight: {
        default: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold"
      },
      // New contrast modifier that can be combined with other variants
      contrast: {
        default: "",
        increased: "!font-semibold !border-2", // The ! is for higher specificity
        maximum: "!font-bold !border-2 !text-white !border-black dark:!border-white" // Maximum contrast
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "default",
      contrast: "default"
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, weight, contrast, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, weight, contrast, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }