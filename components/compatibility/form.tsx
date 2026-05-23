"use client";

import { useState } from "react";
import { Heart, Share2, Check } from "lucide-react";
import { getZodiac, zodiacCompatibility } from "@/lib/zodiac";
import { lifePathNumber, numerologyCompatibility } from "@/lib/numerology";

type Person = { name: string; date: string };

type Result = {
  zodiac: ReturnType<typeof zodiacCompatibility>;
  numerology: ReturnType<typeof numerologyCompatibility>;
  totalScore: number; // 0..100
  sign1: ReturnType<typeof getZodiac>;
  sign2: ReturnType<typeof getZodiac>;
  lp1: number;
  lp2: number;
  names: { a: string; b: string };
};

export function CompatibilityForm() {
  const [a, setA] = useState<Person>({ name: "", date: "" });
  const [b, setB] = useState<Person>({ name: "", date: "" });
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const max = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!a.date || !b.date) return;
    const [y1, m1, d1] = a.date.split("-").map(Number);
    const [y2, m2, d2] = b.date.split("-").map(Number);
    const s1 = getZodiac(m1, d1);
    const s2 = getZodiac(m2, d2);
    const lp1 = lifePathNumber(y1, m1, d1);
    const lp2 = lifePathNumber(y2, m2, d2);
    const z = zodiacCompatibility(s1, s2);
    const n = numerologyCompatibility(lp1, lp2);
    const totalScore = Math.round((z.score * 0.6 + n.score * 0.4));
    setResult({
      zodiac: z,
      numerology: n,
      totalScore,
      sign1: s1,
      sign2: s2,
      lp1,
      lp2,
      names: { a: a.name.trim() || "он/она", b: b.name.trim() || "он/она" },
    });
    setTimeout(() => {
      document.getElementById("compat-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  async function handleShare() {
    if (!result) return;
    const url = window.location.origin + "/compatibility";
    const text = `${result.names.a} (${result.sign1.ru}) + ${result.names.b} (${result.sign2.ru}) = ${result.totalScore}% совместимости. Узнай свой расклад → ${url}`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Совместимость", text, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-8 space-y-5"
      >
        <PersonInputs label="он · она · первый" value={a} onChange={setA} max={max} />
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
          <span className="flex-1 h-px bg-border" />
          <Heart className="size-3.5 text-uni-pink" />
          <span className="flex-1 h-px bg-border" />
        </div>
        <PersonInputs label="он · она · второй" value={b} onChange={setB} max={max} />
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <Heart className="size-4" />
          посчитать совместимость
        </button>
      </form>

      {result && (
        <div
          id="compat-result"
          className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <ScoreRing score={result.totalScore} verdict={result.zodiac.verdict} />

          <div className="mt-8 grid grid-cols-2 gap-4">
            <PersonCard name={result.names.a} signSymbol={result.sign1.symbol} signRu={result.sign1.ru} lp={result.lp1} />
            <PersonCard name={result.names.b} signSymbol={result.sign2.symbol} signRu={result.sign2.ru} lp={result.lp2} />
          </div>

          <div className="mt-8 space-y-5">
            <Block title={`по знакам · ${result.zodiac.score}%`} text={result.zodiac.text} />
            <Block title={`по числам жизненного пути · ${result.numerology.score}%`} text={result.numerology.text} />
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground">
              {copied ? "скопировано в буфер" : "перешли тому, кому актуально"}
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
      )}
    </div>
  );
}

function PersonInputs({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: Person;
  onChange: (p: Person) => void;
  max: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="имя (необязательно)"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          maxLength={40}
          className="h-12 px-4 rounded-xl bg-background/70 border border-border focus:border-foreground/50 focus:outline-none text-sm"
        />
        <input
          type="date"
          required
          min="1900-01-01"
          max={max}
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
          className="h-12 px-4 rounded-xl bg-background/70 border border-border focus:border-foreground/50 focus:outline-none text-sm tabular-nums"
        />
      </div>
    </div>
  );
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = c * (score / 100);

  return (
    <div className="flex items-center gap-6">
      <div className="relative size-32 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle cx="70" cy="70" r={r} strokeWidth="9" className="stroke-border" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={r}
            strokeWidth="9"
            stroke="url(#ringGrad)"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            style={{ transition: "stroke-dasharray 800ms ease-out" }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4fd8" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-semibold tabular-nums leading-none">{score}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-1">%</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">
          вердикт
        </div>
        <div className="text-2xl sm:text-3xl font-medium tracking-tight text-unicorn capitalize">
          {verdict}
        </div>
      </div>
    </div>
  );
}

function PersonCard({
  name,
  signSymbol,
  signRu,
  lp,
}: {
  name: string;
  signSymbol: string;
  signRu: string;
  lp: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2 truncate">
        {name}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl text-unicorn leading-none">{signSymbol}</span>
        <div>
          <div className="text-sm font-medium">{signRu}</div>
          <div className="text-[10px] text-muted-foreground">путь · {lp}</div>
        </div>
      </div>
    </div>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">{title}</div>
      <p className="text-sm sm:text-base leading-relaxed text-foreground/95">{text}</p>
    </div>
  );
}
