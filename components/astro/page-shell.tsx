import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { StarField } from "@/components/astro/star-field";

export function AstroShell({
  section,
  children,
}: {
  section: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,79,216,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.09),transparent_55%)]" />
        <StarField count={100} />
      </div>

      <header className="relative border-b border-border/40 bg-background/40 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            на главную
          </Link>
          <div className="flex items-center gap-2">
            <BrandMark className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
              {section}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="relative mx-auto max-w-2xl px-4 lg:px-6 pt-10 pb-24 sm:pt-14">
        {children}
      </section>
    </main>
  );
}
