"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ELEMENT_RU, getSignByKey, getZodiac, type ZodiacSign } from "@/lib/zodiac";
import horoscopesJson from "@/data/horoscopes.json";
import { DateField } from "@/components/ui/date-field";
import { ShareBar } from "@/components/ui/share-bar";
import { AskAIButton } from "@/components/chat/ask-ai-button";

const horoscopes = horoscopesJson as Record<string, string>;

type Result = { sign: ZodiacSign; text: string };

function BirthdayFormInner() {
  const params = useSearchParams();
  const [date, setDate] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [today, setToday] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const k = params.get("sign");
    if (!k) return;
    const sign = getSignByKey(k);
    if (sign) setResult({ sign, text: horoscopes[sign.key] ?? "Звёзды молчат сегодня." });
  }, [params]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    const [, m, d] = date.split("-").map(Number);
    const sign = getZodiac(m, d);
    setResult({ sign, text: horoscopes[sign.key] ?? "Звёзды молчат сегодня." });
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.getElementById("astro-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }

  const maxDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-8"
      >
        <label
          htmlFor="dob"
          className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-3"
        >
          дата рождения
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <DateField
              id="dob"
              value={date}
              onChange={setDate}
              min="1900-01-01"
              max={maxDate}
              placeholder="например, 15 марта 1995"
            />
          </div>
          <button
            type="submit"
            disabled={!date}
            className="h-12 px-6 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" />
            узнать знак
          </button>
        </div>
      </form>

      {result && (
        <div
          id="astro-result"
          className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">
                твой знак
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl sm:text-7xl leading-none text-unicorn">
                  {result.sign.symbol}
                </span>
                <div>
                  <div className="text-2xl sm:text-3xl font-medium tracking-tight">
                    {result.sign.ru}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums mt-0.5">
                    {result.sign.range}
                  </div>
                </div>
              </div>
            </div>
            <span
              className={`element-pill element-${result.sign.element} text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap`}
            >
              {ELEMENT_RU[result.sign.element]}
            </span>
          </div>

          <div className="border-t border-border/40 pt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
              гороскоп{today ? ` · ${today}` : ""}
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-foreground/95">
              {result.text}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
            <AskAIButton
              persona="astrologer"
              context={`Мой знак — ${result.sign.ru} (${result.sign.symbol}). Сегодня в гороскопе: «${result.text}». Что мне с этим практически сделать сегодня?`}
            />
            <ShareBar
              title={`Гороскоп · ${result.sign.ru}`}
              text={`Мой знак ${result.sign.ru} ${result.sign.symbol}. На сегодня: ${result.text}`}
              url={`${origin}/astro?sign=${result.sign.key}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function BirthdayForm() {
  return (
    <Suspense fallback={null}>
      <BirthdayFormInner />
    </Suspense>
  );
}
