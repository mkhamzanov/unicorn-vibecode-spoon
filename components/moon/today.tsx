"use client";

import { useEffect, useState } from "react";
import { Share2, Check } from "lucide-react";
import { lunarToday, LUNAR_DAY_MEANING } from "@/lib/lunar";

export function MoonToday() {
  const [data, setData] = useState<ReturnType<typeof lunarToday> | null>(null);
  const [copied, setCopied] = useState(false);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    setData(lunarToday(now));
    setDateStr(
      now.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" })
    );
  }, []);

  async function handleShare() {
    if (!data) return;
    const url = window.location.origin + "/moon";
    const text = `Сегодня ${data.day}-й лунный день, ${data.phaseRu} ${data.glyph}, освещённость ${data.illumination}%. ${LUNAR_DAY_MEANING[data.day] ?? ""}`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Лунный день", text, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

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

        <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between gap-3">
          <span className="text-[11px] text-muted-foreground">
            {copied ? "скопировано" : "сохрани или перешли"}
          </span>
          <button
            type="button"
            onClick={handleShare}
            className="h-10 px-4 rounded-xl border border-border hover:border-foreground/50 transition-colors text-xs inline-flex items-center gap-2"
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            {copied ? "скопировано" : "поделиться"}
          </button>
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
