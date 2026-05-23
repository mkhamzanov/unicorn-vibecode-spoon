"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import type { Persona } from "@/lib/chat/personas";

export type Msg = { role: "user" | "assistant"; content: string };
export type ChatPanelHandle = { send: (text: string) => void };

type Props = {
  persona: Persona;
  onClose?: () => void;
  compact?: boolean;
  initialMessage?: { text: string; nonce: number } | null;
};

const TTL_MS = 24 * 60 * 60 * 1000;

const PERSONA_GRADIENT: Record<string, string> = {
  pink:   "linear-gradient(135deg, #ff4fd8, #8b5cf6)",
  violet: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
  blue:   "linear-gradient(135deg, #3b82f6, #22d3ee)",
  cyan:   "linear-gradient(135deg, #22d3ee, #10b981)",
  mint:   "linear-gradient(135deg, #10b981, #fbbf24)",
  yellow: "linear-gradient(135deg, #fbbf24, #ff4fd8)",
};

function storageKey(p: string) {
  return `uvs:chat:${p}:v1`;
}

export const ChatPanel = forwardRef<ChatPanelHandle, Props>(function ChatPanel(
  { persona, onClose, compact = false, initialMessage = null },
  ref
) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentNonceRef = useRef<number | null>(null);

  // load persisted on mount or persona change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(persona.key));
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; msgs: Msg[] };
        if (Date.now() - parsed.ts < TTL_MS && Array.isArray(parsed.msgs)) {
          setMsgs(parsed.msgs);
          setWelcomed(parsed.msgs.length > 0);
          return;
        }
      }
      setMsgs([]);
      setWelcomed(false);
    } catch {
      setMsgs([]);
      setWelcomed(false);
    }
  }, [persona.key]);

  // welcome
  useEffect(() => {
    if (!welcomed && msgs.length === 0) {
      const welcome = persona.welcome[Math.floor(Math.random() * persona.welcome.length)];
      setMsgs([{ role: "assistant", content: welcome }]);
      setWelcomed(true);
    }
  }, [welcomed, msgs.length, persona]);

  // persist
  useEffect(() => {
    if (msgs.length === 0) return;
    try {
      localStorage.setItem(
        storageKey(persona.key),
        JSON.stringify({ ts: Date.now(), msgs })
      );
    } catch {}
  }, [msgs, persona.key]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  // focus input on mount/persona change
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [persona.key]);

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
        body: JSON.stringify({ messages: next, persona: persona.key }),
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

  // expose imperative send
  useImperativeHandle(ref, () => ({ send }), [msgs, loading, persona.key]);

  // pending initial message (from AskAIButton)
  useEffect(() => {
    if (!initialMessage) return;
    if (sentNonceRef.current === initialMessage.nonce) return;
    sentNonceRef.current = initialMessage.nonce;
    // wait one tick to allow persona load to settle
    setTimeout(() => send(initialMessage.text), 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage?.nonce, persona.key]);

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
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 bg-background/50 backdrop-blur">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="size-8 rounded-full grid place-items-center text-base bg-gradient-to-br text-background shrink-0"
            style={{ backgroundImage: PERSONA_GRADIENT[persona.accent] }}
          >
            <span className="leading-none">{persona.glyph}</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{persona.name}</div>
            <div className="text-[10px] text-muted-foreground/70 truncate">{persona.tag}</div>
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
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto ${compact ? "p-3 space-y-2.5" : "p-4 space-y-3"}`}>
        {msgs.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && <Bubble role="assistant" content="..." typing />}
      </div>

      {/* Quick replies */}
      {msgs.length <= 1 && !loading && (
        <div className={`flex flex-wrap gap-1.5 ${compact ? "px-3 pb-2" : "px-4 pb-2"}`}>
          {persona.quickReplies.map((q) => (
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
      <form onSubmit={handleSubmit} className={`border-t border-border/60 flex items-end gap-2 bg-background/50 backdrop-blur ${compact ? "p-2.5" : "p-3"}`}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={500}
          placeholder={`пиши ${persona.name.toLowerCase()}…`}
          className="flex-1 resize-none min-h-[40px] max-h-32 px-3 py-2 rounded-lg bg-background border border-border focus:border-foreground/50 focus:outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="size-10 grid place-items-center rounded-lg bg-foreground text-background disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          aria-label="Отправить"
        >
          <Sparkles className="size-4" />
        </button>
      </form>
      <div className={`text-[10px] text-muted-foreground/60 text-center ${compact ? "pb-1.5" : "pb-2"}`}>
        работает на DeepSeek · ≤{persona.maxWords} слов на ответ
      </div>
    </div>
  );
});

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
