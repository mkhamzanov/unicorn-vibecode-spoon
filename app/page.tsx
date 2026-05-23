import Link from "next/link";
import { Github, Sparkles, Heart, Wand2, Grid3x3, Moon, MessageCircle, HeartHandshake } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { MarqueeTicker } from "@/components/marquee-ticker";
import { ToolCard } from "@/components/tool-card";
import { StarField } from "@/components/astro/star-field";
import { lunarToday } from "@/lib/lunar";
import { days } from "@/data/days";

export default function Home() {
  const moon = lunarToday();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Cosmic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,79,216,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.09),transparent_55%)]" />
        <StarField count={120} />
      </div>

      <MarqueeTicker />

      {/* Header */}
      <header className="relative border-b border-border/50 bg-background/40 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-5 text-foreground" />
            <span className="text-sm font-medium tracking-tight">unicorn · астро</span>
            <span className="text-[10px] text-muted-foreground/60 font-mono tabular-nums hidden sm:inline">
              v0.1
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <a
              href="https://t.me/mkhamzanovv"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs text-uni-pink hover:bg-uni-pink/10 transition-colors"
            >
              автор → tg
            </a>
            <a
              href="https://github.com/mkhamzanov/unicorn-vibecode-spoon"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Github className="size-4" />
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-4 lg:px-6 pt-12 sm:pt-16 lg:pt-20 pb-12">
        <div className="flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            <Sparkles className="size-3" /> астро · нумерология · таро
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-tight max-w-3xl">
            <span className="block">твой персональный</span>
            <span className="block text-unicorn">астролог в кармане</span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-muted-foreground">
            гороскоп, совместимость, расклад Таро, матрица судьбы и лунный день. без регистрации, бесплатно, можно ткнуть прямо сейчас.
          </p>

          {/* Today hook */}
          <Link
            href="/moon"
            className="mt-2 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card/80 backdrop-blur border border-border hover:border-foreground/40 transition-colors text-sm"
          >
            <span className="text-xl leading-none">{moon.glyph}</span>
            <span className="text-muted-foreground">
              сегодня <span className="text-foreground font-medium">{moon.day}-й лунный день</span>{" "}
              <span className="text-muted-foreground/70">· {moon.phaseRu}</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Tools grid */}
      <section className="relative mx-auto max-w-5xl px-4 lg:px-6 pb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground/80">
            инструменты
          </h2>
          <span className="text-[11px] text-muted-foreground/60">7 готово · больше в работе</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            href="/astro"
            title="Гороскоп на сегодня"
            description="введи дату рождения — звёзды скажут что готовит этот день"
            icon={Sparkles}
            accent="pink"
            cta="узнать знак"
          />
          <ToolCard
            href="/compatibility"
            title="Совместимость"
            description="две даты — два знака — одно процентное число, по которому можно жить"
            icon={Heart}
            accent="violet"
            cta="посчитать"
          />
          <ToolCard
            href="/tarot"
            title="Расклад Таро"
            description="три карты, три времени. перемешать, тянуть, читать"
            icon={Wand2}
            accent="blue"
            cta="тянуть карты"
          />
          <ToolCard
            href="/matrix"
            title="Матрица судьбы"
            description="восемь энергий из даты рождения. карманная версия по Ладини"
            icon={Grid3x3}
            accent="cyan"
            cta="рассчитать"
          />
          <ToolCard
            href="/moon"
            title="Лунный день"
            description={`сейчас ${moon.day}-й лунный · ${moon.phaseRu} · что это значит сегодня`}
            icon={Moon}
            accent="mint"
            cta="посмотреть"
          />
          <ToolCard
            href="/psychologist"
            title="AI-психолог"
            description="тёплый собеседник, который выслушает без оценки. не врач, но рядом"
            icon={HeartHandshake}
            accent="yellow"
            cta="поговорить"
          />
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-4 sm:p-5 flex items-start gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-uni-pink to-uni-violet grid place-items-center shrink-0">
            <MessageCircle className="size-4 text-background" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Звездочёт под рукой</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              На каждом экране кнопка «обсудить с AI». Плюс плавающий чат снизу справа — спроси про знак, число, расклад в любой момент.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge log */}
      <section className="relative mx-auto max-w-5xl px-4 lg:px-6 pb-16">
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              как это собирается
            </div>
            <p className="mt-2 text-sm sm:text-base text-foreground/90 max-w-xl">
              Это шоу. 1 подписчик автора = 1 слово в промпте Клоду. Каждый день — новая фича, ровно на столько слов, сколько подписчиков. День {days.length || "0"}, продукт открыт целиком.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/mkhamzanov/unicorn-vibecode-spoon"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border hover:border-foreground/40 transition-colors text-xs"
            >
              <Github className="size-3.5" /> репо
            </a>
            <a
              href="https://t.me/mkhamzanovv"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl bg-uni-pink/15 text-uni-pink hover:bg-uni-pink/25 transition-colors text-xs"
            >
              автор → tg
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 mt-4">
        <div className="mx-auto max-w-5xl px-4 lg:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <BrandMark className="size-3.5" />
            <span>open-source · астро + нумерология + таро + луна</span>
          </div>
          <span className="tabular-nums">v0.1 · день {days.length || 0}</span>
        </div>
      </footer>
    </main>
  );
}
