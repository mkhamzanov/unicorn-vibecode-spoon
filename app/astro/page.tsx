import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { BirthdayForm } from "@/components/astro/birthday-form";
import { StarField } from "@/components/astro/star-field";

export const metadata = {
  title: "Астро · гороскоп на день · unicorn vibecode spoon",
  description:
    "Введи дату рождения — получи знак зодиака и персональный гороскоп на сегодня.",
};

export default function AstroPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.20),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,79,216,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.10),transparent_55%)]" />
        <StarField count={110} />
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
              астро
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="relative mx-auto max-w-2xl px-4 lg:px-6 pt-16 pb-24 sm:pt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
            твой <span className="text-unicorn">гороскоп</span>
            <br />
            на сегодня
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            введи дату рождения · узнаешь свой знак и что говорят звёзды
          </p>
        </div>

        <BirthdayForm />

        <p className="mt-10 text-center text-[11px] text-muted-foreground/60">
          день 1 · собрано ложкой по промпту на 20 слов
        </p>
      </section>
    </main>
  );
}
