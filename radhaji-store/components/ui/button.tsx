import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold tracking-widest transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 uppercase",
  {
    variants: {
      variant: {
        default:     "bg-[#710014] text-[#F2F1ED] hover:bg-[#8a0018] active:scale-[0.98]",
        outline:     "border border-[#F2F1ED] text-[#F2F1ED] hover:bg-[#F2F1ED] hover:text-[#161616] active:scale-[0.98]",
        sand:        "bg-[#B38F6F] text-[#161616] hover:bg-[#c9a98a] active:scale-[0.98]",
        ghost:       "text-[#F2F1ED] hover:bg-white/10",
        secondary:   "bg-[#F2F1ED] text-[#161616] hover:bg-[#e8e6e1] active:scale-[0.98]",
        destructive: "bg-[#710014] text-[#F2F1ED] hover:bg-[#8a0018]",
        link:        "text-[#B38F6F] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm:      "h-9 px-4 py-2 text-xs",
        lg:      "h-14 px-10 py-4 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
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
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
