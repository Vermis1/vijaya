import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vijaya-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-vijaya-olive text-white hover:bg-vijaya-green shadow-vijaya hover:shadow-vijaya-hover hover:-translate-y-0.5",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border-2 border-vijaya-olive text-vijaya-olive bg-transparent hover:bg-vijaya-olive hover:text-white",
        secondary:
          "bg-vijaya-beige text-vijaya-black hover:bg-vijaya-lime",
        ghost: "hover:bg-vijaya-beige hover:text-vijaya-olive",
        link: "text-vijaya-olive underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8 py-3",
        sm: "h-9 px-6 text-sm",
        lg: "h-13 px-10 text-base",
        icon: "h-11 w-11",
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