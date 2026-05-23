import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type Accent = "pink" | "violet" | "blue" | "cyan" | "mint" | "yellow";

const ACCENT_RING: Record<Accent, string> = {
  pink:   "from-[#ff4fd8] to-[#8b5cf6]",
  violet: "from-[#8b5cf6] to-[#3b82f6]",
  blue:   "from-[#3b82f6] to-[#22d3ee]",
  cyan:   "from-[#22d3ee] to-[#10b981]",
  mint:   "from-[#10b981] to-[#fbbf24]",
  yellow: "from-[#fbbf24] to-[#ff4fd8]",
};

const ACCENT_GLOW: Record<Accent, string> = {
  pink:   "rgba(255,79,216,0.30)",
  violet: "rgba(139,92,246,0.30)",
  blue:   "rgba(59,130,246,0.30)",
  cyan:   "rgba(34,211,238,0.30)",
  mint:   "rgba(16,185,129,0.30)",
  yellow: "rgba(251,191,36,0.30)",
};

export function ToolCard({
  href,
  title,
  description,
  icon: Icon,
  accent = "violet",
  cta = "открыть",
  soon = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: Accent;
  cta?: string;
  soon?: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div
          className={`size-11 rounded-xl bg-gradient-to-br ${ACCENT_RING[accent]} grid place-items-center text-background shadow-lg`}
          style={{ boxShadow: `0 0 28px -6px ${ACCENT_GLOW[accent]}` }}
        >
          <Icon className="size-5" />
        </div>
        {soon ? (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            скоро
          </span>
        ) : (
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-medium tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {!soon && (
        <div className="mt-5 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-foreground/70">
          {cta}
        </div>
      )}
    </>
  );

  const baseClass =
    "group relative flex flex-col rounded-2xl border border-border/70 bg-card/85 backdrop-blur p-5 sm:p-6 transition-all";

  if (soon) {
    return <div className={`${baseClass} opacity-70 cursor-not-allowed`}>{inner}</div>;
  }

  return (
    <Link
      href={href}
      className={`${baseClass} hover:border-foreground/40 hover:-translate-y-0.5 hover:shadow-[0_0_32px_-12px_rgba(139,92,246,0.5)]`}
    >
      {inner}
    </Link>
  );
}
