"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "uvs:chat:v1";
const TTL_MS = 24 * 60 * 60 * 1000;

const WELCOMES = [
  "хей, я звездочёт. спроси про знак, число, расклад — или напиши автору напрямую.",
  "привет. астрология, числа, таро, луна — это сюда. начни с любого вопроса.",
  "бро, тут я по звёздам и числам. что хочешь узнать?",
];

const QUICK_REPLIES = [
  "что мне поможет сегодня?",
  "совместимы ли мы с парнем?",
  "что такое матрица судьбы?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; msgs: Msg[] };
        if (Date.now() - parsed.ts < TTL_MS && Array.isArray(parsed.msgs)) {
          setMsgs(parsed.msgs);
          setWelcomed(parsed.msgs.length > 0);
          return;
        }
      }
    } catch {}
  }, []);

  // first welcome
  useEffect(() => {
    if (open && !welcomed && msgs.length === 0) {
      const welcome = WELCOMES[Math.floor(Math.random() * WELCOMES.length)];
      setMsgs([{ role: "assistant", content: welcome }]);
      setWelcomed(true);
    }
  }, [open, welcomed, msgs.length]);

  // persist
  useEffect(() => {
    if (msgs.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), msgs }));
    } catch {}
  }, [msgs]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading, open]);

  // focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        data.reply ??
        (data.error === "rate_limit"
          ? "Подожди минутку и попробуй ещё раз."
          : "Что-то пошло не так. Напиши автору → https://t.me/mkhamzanovv");
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "Связь упала. Попробуй ещё раз или → https://t.me/mkhamzanovv" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Открыть чат со Звездочётом"
          className="fixed bottom-4 right-4 z-50 size-14 rounded-full bg-card border-unicorn glow-unicorn grid place-items-center hover:scale-105 transition-transform"
        >
          <MessageCircle className="size-6 text-foreground" />
          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-uni-pink animate-pulse" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-2rem)] sm:h-[560px] sm:max-h-[80vh] rounded-2xl bg-card border-unicorn glow-unicorn flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 bg-background/50 backdrop-blur">
            <div className="flex items-center gap-2 min-w-0">
              <BrandMark className="size-4 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">Звездочёт</div>
                <div className="text-[10px] text-muted-foreground/70 truncate">астро + нумерология + таро</div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <a
                href="https://t.me/mkhamzanovv"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-uni-pink/10 text-uni-pink hover:bg-uni-pink/20 transition-colors text-[11px]"
              >
                <Send className="size-3" /> автор
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <Bubble role="assistant" content="..." typing />}
          </div>

          {/* Quick replies */}
          {msgs.length <= 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border/60 p-3 flex items-end gap-2 bg-background/50 backdrop-blur">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={500}
              placeholder="пиши звездочёту…"
              className="flex-1 resize-none min-h-[40px] max-h-32 px-3 py-2 rounded-lg bg-background border border-border focus:border-foreground/50 focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="size-10 grid place-items-center rounded-lg bg-foreground text-background disabled:opacity-40 hover:opacity-90 transition-opacity"
              aria-label="Отправить"
            >
              <Sparkles className="size-4" />
            </button>
          </form>
          <div className="px-4 pb-2 text-[10px] text-muted-foreground/60 text-center">
            работает на DeepSeek · ≤80 слов на ответ
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({
  role,
  content,
  typing = false,
}: {
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-foreground text-background rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {typing ? (
          <span className="inline-flex gap-1 items-center text-muted-foreground">
            <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
            <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
            <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
          </span>
        ) : (
          <Linkified text={content} />
        )}
      </div>
    </div>
  );
}

function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a
            key={i}
            href={p}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-uni-pink underline-offset-2 hover:text-uni-pink transition-colors break-all"
          >
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
