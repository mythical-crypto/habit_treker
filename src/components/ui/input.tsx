import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-2xl bg-surface-container-highest px-4 py-2.5 text-base transition-colors outline-none border-0 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-on-surface placeholder:text-on-surface-variant/50 focus-visible:bg-surface-container-lowest focus-visible:ring-1 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-container-highest/50 disabled:opacity-50 aria-invalid:bg-error-container/50 aria-invalid:ring-1 aria-invalid:ring-error/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
