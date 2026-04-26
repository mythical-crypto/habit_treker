import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-error/20",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl px-6 py-3 text-base font-medium shadow-none hover:opacity-90",
        outline:
          "border border-outline/15 bg-surface-container-lowest text-on-surface hover:bg-surface-container rounded-xl",
        secondary:
          "bg-secondary text-on-secondary hover:bg-secondary/90 rounded-xl",
        ghost:
          "hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-xl",
        destructive:
          "bg-error text-on-error hover:bg-error/90 rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        tertiary:
          "bg-transparent text-primary hover:bg-primary-fixed rounded-xl",
      },
      size: {
        default: "h-10 gap-2 px-6",
        sm: "h-8 gap-1.5 px-4 text-sm rounded-lg",
        lg: "h-12 gap-2 px-8 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
