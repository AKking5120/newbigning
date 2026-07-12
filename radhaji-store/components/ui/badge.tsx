import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-bold tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:   "bg-[#710014] text-[#F2F1ED]",
        sand:      "bg-[#B38F6F] text-[#161616]",
        secondary: "bg-[#2a2a2a] text-[#F2F1ED]",
        outline:   "border border-[#F2F1ED] text-[#F2F1ED]",
        success:   "bg-emerald-700 text-white",
        discount:  "bg-[#710014] text-[#F2F1ED]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
