import { cn } from "@/lib/utils";

// Минималистичный знак: круг (чаша ложки / голова единорога) + линия (ручка / горн).
// Монохром, наследует currentColor.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-5", className)}
    >
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 11 L12 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
