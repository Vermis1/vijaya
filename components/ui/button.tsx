import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-vijaya text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vijaya-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-vijaya-green text-white hover:bg-vijaya-green/90 shadow-vijaya hover:shadow-vijaya-hover",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border-2 border-vijaya-green text-vijaya-green bg-transparent hover:bg-vijaya-green hover:text-white",
        secondary:
          "bg-vijaya-lime text-vijaya-black hover:bg-vijaya-lime/80",
        ghost: "hover:bg-vijaya-green/10 hover:text-vijaya-green",
        link: "text-vijaya-green underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-vijaya px-4",
        lg: "h-12 rounded-vijaya px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }