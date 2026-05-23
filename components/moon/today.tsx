"use client";

import { useEffect, useState } from "react";
import { lunarToday, LUNAR_DAY_MEANING } from "@/lib/lunar";
import { ShareBar } from "@/components/ui/share-bar";
import { AskAIButton } from "@/components/chat/ask-ai-button";

export function MoonToday() {
  const [data, setData] = useState<ReturnType<typeof lunarToday> | null>(null);
  const [dateStr, setDateStr] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const now = new Date();
    setData(lunarToday(now));
    setDateStr(
      now.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" })
    );
    setOrigin(window.location.origin);
  }, []);

  if (!data) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/85 backdrop-blur p-10 text-center text-sm text-muted-foreground">
        луна загружается…
      </div>
    );
  }

  const meaning = LUNAR_DAY_MEANING[data.day] ?? "Данные о дне в подготовке.";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-10">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 text-center mb-6">
          {dateStr}
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="text-7xl sm:text-8xl leading-none">{data.glyph}</div>
          <div>
            <div className="text-5xl sm:text-6xl font-semibold tabular-nums leading-none text-unicorn">
              {data.day}
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">
              лунный день
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          <Stat label="фаза" value={data.phaseRu} />
          <Stat label="освещённость" value={`${data.illumination}%`} />
        </div>
      </div>

      <div className="rounded-2xl border-unicorn bg-card/85 backdrop-blur p-6 sm:p-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
          что говорит луна
        </div>
        <p className="text-base sm:text-lg leading-relaxed text-foreground/95">{meaning}</p>

        <div className="mt-6 pt-6 border-t border-border/40 space-y-4">
          <AskAIButton
            persona="astrologer"
            label="спросить астролога про этот лунный день"
            context={`Сегодня ${data.day}-й лунный день, фаза ${data.phaseRu}, освещённость ${data.illumination}%. Краткое значение: «${meaning}». Что мне это даёт практически — на работу, на отношения, на тело?`}
            className="w-full justify-center"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground">сохрани или перешли</span>
            <ShareBar
              title="Лунный день"
              text={`Сегодня ${data.day}-й лунный, ${data.phaseRu} ${data.glyph}. ${meaning}`}
              url={`${origin}/moon`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div className="text-sm font-medium mt-1 capitalize">{value}</div>
    </div>
  );
}
