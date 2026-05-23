"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  id?: string;
  value: string;          // ISO YYYY-MM-DD or ""
  onChange: (v: string) => void;
  min?: string;           // ISO
  max?: string;           // ISO
  placeholder?: string;
  required?: boolean;
};

const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "май", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function parseISO(s: string): { y: number; m: number; d: number } | null {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3] };
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function formatRu(iso: string): string {
  const p = parseISO(iso);
  if (!p) return "";
  return `${p.d} ${MONTHS_SHORT[p.m - 1]} ${p.y}`;
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

// monday-first weekday for the 1st of a month: 0..6 (Mon..Sun)
function firstWeekdayMon(y: number, m: number): number {
  const jsDay = new Date(y, m - 1, 1).getDay(); // 0 = Sun
  return (jsDay + 6) % 7;
}

type Mode = "day" | "month" | "year";

export function DateField({ id, value, onChange, min, max, placeholder = "выбери дату", required }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("day");
  const today = useMemo(() => new Date(), []);
  const minP = useMemo(() => parseISO(min ?? "") ?? { y: 1900, m: 1, d: 1 }, [min]);
  const maxP = useMemo(() => {
    const fallback = toISO(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return (
      parseISO(max ?? fallback) ?? {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate(),
      }
    );
  }, [max, today]);

  const parsed = parseISO(value);
  const initView = parsed ?? {
    y: today.getFullYear() - 25, // sensible default for "birthday" use
    m: today.getMonth() + 1,
    d: today.getDate(),
  };
  const [viewY, setViewY] = useState(initView.y);
  const [viewM, setViewM] = useState(initView.m);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parsed) {
      setViewY(parsed.y);
      setViewM(parsed.m);
    }
  }, [value]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function nudgeMonth(delta: number) {
    let nm = viewM + delta;
    let ny = viewY;
    while (nm < 1) { nm += 12; ny -= 1; }
    while (nm > 12) { nm -= 12; ny += 1; }
    setViewY(ny);
    setViewM(nm);
  }

  function pickDay(d: number) {
    const iso = toISO(viewY, viewM, d);
    if (isISODisabled(iso, min, max)) return;
    onChange(iso);
    setOpen(false);
  }

  function isISODisabled(iso: string, mn?: string, mx?: string) {
    if (mn && iso < mn) return true;
    if (mx && iso > mx) return true;
    return false;
  }

  function isMonthFullyDisabled(y: number, m: number): boolean {
    const lastDay = daysInMonth(y, m);
    if (max && toISO(y, m, 1) > max) return true;
    if (min && toISO(y, m, lastDay) < min) return true;
    return false;
  }

  // Day grid: 6 weeks × 7 days
  const firstWd = firstWeekdayMon(viewY, viewM);
  const dim = daysInMonth(viewY, viewM);
  const cells: Array<{ d: number; cm: boolean; iso: string }> = [];
  const prevMonthDays = (() => {
    let pm = viewM - 1, py = viewY;
    if (pm < 1) { pm = 12; py -= 1; }
    return { count: daysInMonth(py, pm), pm, py };
  })();
  for (let i = 0; i < firstWd; i++) {
    const d = prevMonthDays.count - firstWd + 1 + i;
    cells.push({ d, cm: false, iso: toISO(prevMonthDays.py, prevMonthDays.pm, d) });
  }
  for (let d = 1; d <= dim; d++) {
    cells.push({ d, cm: true, iso: toISO(viewY, viewM, d) });
  }
  while (cells.length < 42) {
    const i = cells.length - firstWd - dim + 1;
    let nm = viewM + 1, ny = viewY;
    if (nm > 12) { nm = 1; ny += 1; }
    cells.push({ d: i, cm: false, iso: toISO(ny, nm, i) });
  }

  const todayISO = toISO(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const yearMin = minP.y;
  const yearMax = maxP.y;
  const yearList: number[] = [];
  for (let y = yearMax; y >= yearMin; y--) yearList.push(y);

  return (
    <div ref={wrapRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => { setOpen((o) => !o); setMode("day"); }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full h-12 px-4 rounded-xl bg-background/70 border border-border focus:border-foreground/60 focus:outline-none text-left text-sm tabular-nums inline-flex items-center justify-between gap-2 transition-colors ${
          value ? "text-foreground" : "text-muted-foreground/70"
        } ${open ? "border-foreground/60" : ""}`}
      >
        <span className="truncate">{value ? formatRu(value) : placeholder}</span>
        <Calendar className="size-4 text-muted-foreground shrink-0" />
      </button>

      {/* hidden hidden field for required form validation */}
      {required && (
        <input type="hidden" name={id} value={value} required />
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Выбор даты"
          className="absolute z-50 mt-2 w-[300px] left-0 rounded-2xl border border-border bg-popover/95 backdrop-blur-md shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => nudgeMonth(-1)}
              className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Предыдущий месяц"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMode(mode === "month" ? "day" : "month")}
                className={`px-2 h-8 rounded-lg text-sm font-medium hover:bg-muted transition-colors ${mode === "month" ? "bg-muted" : ""}`}
              >
                {MONTHS_RU[viewM - 1]}
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === "year" ? "day" : "year")}
                className={`px-2 h-8 rounded-lg text-sm font-medium tabular-nums hover:bg-muted transition-colors ${mode === "year" ? "bg-muted" : ""}`}
              >
                {viewY}
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudgeMonth(1)}
              className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Следующий месяц"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Body */}
          {mode === "day" && (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="h-7 grid place-items-center text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {w}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((c, i) => {
                  const isSelected = value === c.iso;
                  const isToday = todayISO === c.iso;
                  const disabled = isISODisabled(c.iso, min, max);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => c.cm && !disabled && pickDay(c.d)}
                      disabled={!c.cm || disabled}
                      className={`h-8 rounded-lg text-sm tabular-nums transition-colors ${
                        isSelected
                          ? "bg-foreground text-background font-medium"
                          : c.cm && !disabled
                            ? "text-foreground hover:bg-muted"
                            : "text-muted-foreground/30 cursor-default"
                      } ${isToday && !isSelected ? "ring-1 ring-uni-pink/60" : ""}`}
                    >
                      {c.d}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {mode === "month" && (
            <div className="grid grid-cols-3 gap-1">
              {MONTHS_RU.map((mn, idx) => {
                const m = idx + 1;
                const disabled = isMonthFullyDisabled(viewY, m);
                const isCurrent = m === viewM;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { if (!disabled) { setViewM(m); setMode("day"); } }}
                    disabled={disabled}
                    className={`h-10 rounded-lg text-sm transition-colors ${
                      isCurrent
                        ? "bg-foreground text-background font-medium"
                        : disabled
                          ? "text-muted-foreground/30 cursor-default"
                          : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {mn.slice(0, 3).toLowerCase()}
                  </button>
                );
              })}
            </div>
          )}

          {mode === "year" && (
            <div className="grid grid-cols-4 gap-1 max-h-[240px] overflow-y-auto pr-1">
              {yearList.map((y) => {
                const isCurrent = y === viewY;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => { setViewY(y); setMode("day"); }}
                    className={`h-9 rounded-lg text-sm tabular-nums transition-colors ${
                      isCurrent
                        ? "bg-foreground text-background font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" /> очистить
            </button>
            <button
              type="button"
              onClick={() => {
                const iso = todayISO;
                if (!isISODisabled(iso, min, max)) {
                  onChange(iso);
                  setOpen(false);
                }
              }}
              className="text-[11px] text-uni-pink hover:underline"
            >
              сегодня
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
