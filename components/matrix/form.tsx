"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { calculateMatrix, type MatrixCell } from "@/lib/destiny-matrix";
import { DateField } from "@/components/ui/date-field";
import { ShareBar } from "@/components/ui/share-bar";
import { AskAIButton } from "@/components/chat/ask-ai-button";

export function MatrixForm() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateMatrix> | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => { setOrigin(window.location.origin); }, []);

  const max = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    const [y, m, d] = date.split("-").map(Number);
    setResult(calculateMatrix(y, m, d));
    setTimeout(() => {
      document.getElementById("matrix-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-8"
      >
        <label htmlFor="dob-matrix" className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
          дата рождения
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <DateField
              id="dob-matrix"
              value={date}
              onChange={setDate}
              min="1900-01-01"
              max={max}
              placeholder="выбери дату рождения"
            />
          </div>
          <button
            type="submit"
            disabled={!date}
            className="h-12 px-6 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" />
            рассчитать матрицу
          </button>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          восемь энергий + аркан под каждую. карманная версия по методу Н. Ладини.
        </p>
      </form>

      {result && (
        <div
          id="matrix-result"
          className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <DiamondGrid cells={result.cells} />

          <div className="mt-8 space-y-4">
            {result.cells.map((c) => (
              <CellRow key={c.key} cell={c} />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <AskAIButton
                persona="astrologer"
                label="разобрать с астрологом"
                context={`Моя матрица судьбы: ${result.cells.map((c) => `${c.label} — ${c.value} (${c.arcanaName})`).join("; ")}. Что это значит на бытовом уровне? На что мне опереться, чего избегать?`}
                className="w-full sm:flex-1 justify-center"
              />
              <AskAIButton
                persona="psychologist"
                label="обсудить с психологом"
                context={`Я только что посмотрел свою матрицу судьбы. Главные энергии: ${result.cells.slice(0, 5).map((c) => `${c.label} (${c.arcanaName})`).join(", ")}. Что-то в этом откликается и что-то задевает. Помоги разложить.`}
                className="w-full sm:flex-1 justify-center"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">поделись результатом</span>
              <ShareBar
                title="Матрица судьбы"
                text={`Моя матрица: ${result.cells.slice(0, 5).map((c) => `${c.label} ${c.value} ${c.arcanaName}`).join(" · ")}`}
                url={`${origin}/matrix`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DiamondGrid({ cells }: { cells: MatrixCell[] }) {
  const center = cells.find((c) => c.key === "E");
  const top = cells.find((c) => c.key === "A");
  const right = cells.find((c) => c.key === "B");
  const bottom = cells.find((c) => c.key === "C");
  const left = cells.find((c) => c.key === "D");

  return (
    <div className="relative mx-auto aspect-square max-w-[320px]">
      <DiamondCell pos="top"    cell={top} />
      <DiamondCell pos="right"  cell={right} />
      <DiamondCell pos="bottom" cell={bottom} />
      <DiamondCell pos="left"   cell={left} />
      <DiamondCell pos="center" cell={center} highlight />
      {/* connecting lines */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full -z-0" aria-hidden>
        <line x1="100" y1="20"  x2="100" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="20"  y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="30"  y1="30"  x2="170" y2="170" stroke="currentColor" strokeWidth="1" className="text-border opacity-40" />
        <line x1="170" y1="30"  x2="30"  y2="170" stroke="currentColor" strokeWidth="1" className="text-border opacity-40" />
      </svg>
    </div>
  );
}

const POS_STYLE: Record<string, string> = {
  top:    "left-1/2 top-0 -translate-x-1/2",
  right:  "right-0 top-1/2 -translate-y-1/2",
  bottom: "left-1/2 bottom-0 -translate-x-1/2",
  left:   "left-0 top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

function DiamondCell({
  pos,
  cell,
  highlight = false,
}: {
  pos: keyof typeof POS_STYLE;
  cell: MatrixCell | undefined;
  highlight?: boolean;
}) {
  if (!cell) return null;
  return (
    <div className={`absolute ${POS_STYLE[pos]} z-10`}>
      <div
        className={`size-16 sm:size-20 rounded-2xl grid place-items-center bg-card border ${
          highlight ? "border-unicorn glow-unicorn" : "border-border"
        }`}
      >
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums leading-none">
            {cell.value}
          </div>
          <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground/80 mt-0.5">
            {cell.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function CellRow({ cell }: { cell: MatrixCell }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="shrink-0 size-12 rounded-xl bg-background/60 border border-border grid place-items-center">
        <span className="text-lg font-semibold tabular-nums">{cell.value}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <div className="text-sm font-medium">
            {cell.label} · {cell.arcanaName}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
            аркан {cell.value}
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          <span className="text-foreground/80">{cell.hint}.</span> {cell.arcanaTheme}.
        </p>
      </div>
    </div>
  );
}
