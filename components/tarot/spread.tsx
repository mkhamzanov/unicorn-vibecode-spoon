"use client";

import { useState, useEffect } from "react";
import { Shuffle } from "lucide-react";
import { drawSpread, SPREAD_POSITIONS_3, type TarotCard } from "@/lib/tarot";
import { ShareBar } from "@/components/ui/share-bar";
import { AskAIButton } from "@/components/chat/ask-ai-button";

type Phase = "idle" | "shuffling" | "revealed";

export function TarotSpread() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [origin, setOrigin] = useState("");

  useEffect(() => { setOrigin(window.location.origin); }, []);

  function shuffleAndDraw() {
    setPhase("shuffling");
    setFlipped([false, false, false]);
    setTimeout(() => {
      const drawn = drawSpread(3);
      setCards(drawn);
      setPhase("revealed");
    }, 900);
  }

  useEffect(() => {
    if (phase !== "revealed") return;
    const t1 = setTimeout(() => setFlipped([true, false, false]), 200);
    const t2 = setTimeout(() => setFlipped([true, true, false]), 700);
    const t3 = setTimeout(() => setFlipped([true, true, true]), 1200);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [phase, cards]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border-unicorn glow-unicorn bg-card/85 backdrop-blur p-6 sm:p-8 text-center">
        <p className="text-sm text-muted-foreground">
          сосредоточься на вопросе, мысленно задай его — и тяни.
          <br />
          <span className="text-foreground/70">
            расклад из трёх карт: прошлое · настоящее · будущее
          </span>
        </p>
        <button
          type="button"
          onClick={shuffleAndDraw}
          disabled={phase === "shuffling"}
          className="mt-6 h-12 px-8 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center gap-2"
        >
          <Shuffle className={`size-4 ${phase === "shuffling" ? "animate-spin" : ""}`} />
          {phase === "idle" && "перемешать и тянуть"}
          {phase === "shuffling" && "тасую колоду..."}
          {phase === "revealed" && "тянуть заново"}
        </button>
      </div>

      {(phase === "shuffling" || phase === "revealed") && (
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {SPREAD_POSITIONS_3.map((pos, i) => (
            <TarotCardView
              key={pos.key}
              position={pos}
              card={cards[i]}
              flipped={flipped[i] ?? false}
              shuffling={phase === "shuffling"}
              index={i}
            />
          ))}
        </div>
      )}

      {phase === "revealed" && flipped[2] && (
        <div className="rounded-2xl border-unicorn bg-card/85 backdrop-blur p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {cards.map((c, i) => (
            <div key={c.id} className="flex gap-4">
              <div className="shrink-0 size-14 rounded-xl border border-border/60 grid place-items-center text-2xl text-unicorn font-mono">
                {c.glyph}
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  {SPREAD_POSITIONS_3[i].title} · {c.nameRu}
                </div>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-foreground/95">
                  {c.upright}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.keywords.map((k) => (
                    <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border/40 space-y-4">
            <AskAIButton
              persona="astrologer"
              label="спросить астролога что это значит"
              context={`Мой расклад Таро (3 карты, прошлое/настоящее/будущее): ${cards.map((c, i) => `${SPREAD_POSITIONS_3[i].title} — ${c.nameRu}`).join("; ")}. Помоги связать карты в один сюжет и подскажи что с этим делать.`}
              className="w-full justify-center"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">сохрани или перешли</span>
              <ShareBar
                title="Расклад Таро"
                text={`Мой расклад: ${cards.map((c, i) => `${SPREAD_POSITIONS_3[i].title}: ${c.nameRu}`).join(" · ")}`}
                url={`${origin}/tarot`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TarotCardView({
  position,
  card,
  flipped,
  shuffling,
  index,
}: {
  position: (typeof SPREAD_POSITIONS_3)[number];
  card: TarotCard | undefined;
  flipped: boolean;
  shuffling: boolean;
  index: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 text-center">
        {position.title}
      </div>
      <div
        className="relative w-full aspect-[2/3] perspective"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div
          className={`relative size-full transition-transform duration-700 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          } ${shuffling ? "tarot-shuffle" : ""}`}
        >
          {/* back */}
          <div className="absolute inset-0 rounded-xl border-unicorn bg-card flex items-center justify-center [backface-visibility:hidden]">
            <div className="size-12 rounded-full border-2 border-foreground/20 grid place-items-center text-2xl text-unicorn">
              ✦
            </div>
          </div>
          {/* front */}
          <div className="absolute inset-0 rounded-xl border-unicorn bg-card p-2 sm:p-3 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="text-[9px] sm:text-[10px] font-mono tabular-nums text-muted-foreground">
              {card?.id.toString().padStart(2, "0") ?? "—"}
            </div>
            <div className="flex-1 grid place-items-center text-4xl sm:text-5xl text-unicorn">
              {card?.glyph}
            </div>
            <div className="text-[10px] sm:text-xs text-center font-medium leading-tight">
              {card?.nameRu}
            </div>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/50 text-center px-1 hidden sm:block">
        {position.hint}
      </div>
    </div>
  );
}
