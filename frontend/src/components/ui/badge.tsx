import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-surface-3 text-text hover:bg-surface-3/80",
        secondary:
          "border-transparent bg-surface-2 text-text-muted hover:bg-surface-2/80",
        outline: 
          "text-text border-line",
        // Technical/Diagnostic Variants
        signal:
          "border-signal/30 bg-signal/10 text-signal",
        confirm:
          "border-confirm/30 bg-confirm/10 text-confirm",
        alert:
          "border-alert/30 bg-alert/10 text-alert",
        info:
          "border-info/30 bg-info/10 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }