import { days, currentState } from "@/data/days";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, ExternalLink } from "lucide-react";

export default function Home() {
  const state = currentState();
  const totalDays = days.length;

  return (
    <main className="relative min-h-screen bg-grid">
      {/* Top bar */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-xl leading-none">🦄</span>
            <span className="text-xl leading-none">🥄</span>
            <span className="text-foreground/90">Уникорн Вайбкод Ложка</span>
          </div>
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <a
              href="https://github.com/mkhamzanov/unicorn-vibecode-spoon"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <Github className="size-4" />
              <span>repo</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 lg:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-center text-center gap-6">
          <Badge variant="pink-subtle" className="h-6 px-3 text-[11px] tracking-wider uppercase">
            День {state.dayN} · Spoon Driven Development
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-medium leading-[0.95] tracking-tight">
            <span className="block">вайбкодим единорога</span>
            <span className="block text-unicorn">ложкой.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-muted-foreground">
            1 подписчик = 1 слово в промпте. Код полностью открыт. Каждый день — новая фича,
            ровно настолько, насколько хватает слов.
          </p>

          {/* The counter */}
          <div className="mt-10 w-full max-w-xl">
            <div className="rounded-2xl border-unicorn glow-unicorn p-8 sm:p-10 bg-card">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
                Бюджет слов на следующий промпт
              </div>
              <div className="text-7xl sm:text-8xl lg:text-9xl font-semibold tracking-tight tabular-nums leading-none">
                {state.followers.toLocaleString("ru-RU")}
              </div>
              <div className="mt-3 text-xs sm:text-sm text-muted-foreground">
                подписчиков · столько слов разрешено в промпте Клоду
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's prompt */}
      <section className="mx-auto max-w-6xl px-4 lg:px-6 pb-16">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground/80">
            Промпт {state.dayN > 0 ? `дня ${state.dayN}` : "дня"}
          </h2>
          {state.todayPrompt && (
            <span className="text-[11px] text-muted-foreground/60 tabular-nums">
              {state.todayPrompt.trim().split(/\s+/).length} слов
            </span>
          )}
        </div>

        <Card className="border-unicorn">
          <CardContent className="py-6 sm:py-8">
            {state.todayPrompt ? (
              <p className="prompt-block text-lg sm:text-2xl lg:text-3xl text-foreground/95 cursor-blink">
                {state.todayPrompt}
              </p>
            ) : (
              <p className="prompt-block text-base sm:text-xl text-muted-foreground/70">
                ждем первого подписчика · промпт пока пустой
                <span className="cursor-blink" />
              </p>
            )}
          </CardContent>
        </Card>

        {state.todayBuilt && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="text-foreground/80">Собрано:</span> {state.todayBuilt}
          </p>
        )}
      </section>

      <Separator className="opacity-50" />

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4 lg:px-6 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground/80">
            Лог дней
          </h2>
          <span className="text-[11px] text-muted-foreground/60 tabular-nums">
            {totalDays} {totalDays === 1 ? "день" : "дней"}
          </span>
        </div>

        {totalDays === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 p-10 text-center">
            <p className="text-2xl mb-2">🥄</p>
            <p className="text-sm text-muted-foreground">
              Лог пустой. Жди первый ролик — здесь появятся карточки дней.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...days].reverse().map((d) => {
              const words = d.prompt.trim().split(/\s+/).length;
              return (
                <Card key={d.n} className="hover:border-foreground/30 transition-colors">
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple-subtle" className="h-5 text-[10px] uppercase tracking-wider">
                        День {d.n}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                        {d.date}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold tabular-nums tracking-tight">
                        {d.followers.toLocaleString("ru-RU")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">подп · {words} слов</span>
                    </div>

                    <p className="prompt-block text-[11px] text-foreground/80 line-clamp-3">
                      {d.prompt}
                    </p>

                    <p className="text-xs text-muted-foreground line-clamp-2">{d.built}</p>

                    <div className="flex items-center justify-between pt-1 mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {d.stack?.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      {d.href && (
                        <a
                          href={d.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          демка <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 mt-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            🦄🥄 open-source. вайб + ложка + клод.
          </span>
          <span className="tabular-nums">
            v0.1 · фундамент готов
          </span>
        </div>
      </footer>
    </main>
  );
}
