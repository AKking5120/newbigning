import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-bold tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:   "bg-crimson text-pearl",
        sand:      "bg-sand text-obsidian",
        secondary: "bg-obsidian-light text-pearl",
        outline:   "border border-pearl text-pearl",
        success:   "bg-emerald-700 text-white",
        discount:  "bg-crimson text-pearl",
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
