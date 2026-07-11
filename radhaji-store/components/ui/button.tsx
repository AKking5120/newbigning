import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 uppercase",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        outline: "border border-white text-white hover:bg-white hover:text-black active:scale-[0.98]",
        ghost: "text-white hover:bg-white/10",
        secondary: "bg-white text-black hover:bg-zinc-100 active:scale-[0.98]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-red-500 underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-10 py-4 text-base",
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
