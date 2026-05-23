import { currentState } from "@/data/days";

export function MarqueeTicker() {
  const state = currentState();
  const promoText = state.todayPrompt ?? "ПРОМПТ ПОКА ПУСТОЙ · ЖДЁМ ПЕРВОГО АПДЕЙТА";

  const items = [
    `ДЕНЬ ${state.dayN || 0}`,
    `${state.followers.toLocaleString("ru-RU")} ПОДПИСЧИКОВ = БЮДЖЕТ СЛОВ`,
    `ПРОМПТ ДНЯ → ${promoText}`,
    `OPEN SOURCE · ВАЙБКОДИМ ЛОЖКОЙ`,
  ];

  const line = items.join("   ·   ");

  return (
    <div
      role="marquee"
      className="relative w-full overflow-hidden border-b border-border/50 bg-background/70 backdrop-blur"
    >
      <div className="marquee-track py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span className="marquee-item">{line}</span>
        <span className="marquee-item" aria-hidden>
          {line}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
