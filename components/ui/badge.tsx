import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border-0 px-[7px] py-1 text-xs font-medium leading-none tabular-nums whitespace-nowrap transition-[color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline: "border border-border bg-transparent text-foreground",
        ghost: "bg-muted/50 text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "green-subtle": "bg-[#00875a]/10 text-[#00875a] dark:bg-[#00c781]/15 dark:text-[#00c781]",
        "amber-subtle": "bg-[#f5a623]/10 text-[#ab570a] dark:bg-[#f7b955]/15 dark:text-[#f7b955]",
        "red-subtle": "bg-[#ee0000]/10 text-[#c50000] dark:bg-[#ff1a1a]/15 dark:text-[#ff1a1a]",
        "blue-subtle": "bg-[#0070f3]/10 text-[#0761d1] dark:bg-[#3291ff]/15 dark:text-[#3291ff]",
        "purple-subtle": "bg-[#7928ca]/10 text-[#4c2889] dark:bg-[#8a63d2]/15 dark:text-[#8a63d2]",
        "pink-subtle": "bg-[#ff4fd8]/10 text-[#c01ca0] dark:bg-[#ff4fd8]/15 dark:text-[#ff4fd8]",
        warning: "bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
