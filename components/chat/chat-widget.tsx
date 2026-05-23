"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatPanel } from "./chat-panel";
import { PERSONAS, type PersonaKey } from "@/lib/chat/personas";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaKey>("astrologer");
  const [pending, setPending] = useState<{ text: string; nonce: number } | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as
        | { persona?: PersonaKey; message?: string }
        | undefined;
      if (!detail) return;
      // /psychologist персона имеет свою отдельную страницу — её через виджет не открываем
      const target: PersonaKey = detail.persona === "psychologist" ? "psychologist" : "astrologer";
      if (target === "psychologist") {
        // редирект на полноценную страницу с предзаполненным сообщением (через sessionStorage)
        try {
          if (detail.message) {
            sessionStorage.setItem("uvs:psy:pending", JSON.stringify({ text: detail.message, nonce: Date.now() }));
          }
        } catch {}
        window.location.href = "/psychologist";
        return;
      }
      setActivePersona(target);
      setOpen(true);
      if (detail.message) {
        setPending({ text: detail.message, nonce: Date.now() });
      }
    }
    window.addEventListener("uvs:chat:open", handler);
    return () => window.removeEventListener("uvs:chat:open", handler);
  }, []);

  const persona = PERSONAS[activePersona];

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Открыть чат"
          className="fixed bottom-4 right-4 z-50 size-12 rounded-full bg-card border border-border grid place-items-center hover:scale-105 hover:border-foreground/50 transition-all shadow-lg"
          style={{ boxShadow: "0 8px 32px -8px rgba(139,92,246,0.4)" }}
        >
          <MessageCircle className="size-5 text-foreground" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-uni-pink animate-pulse" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[340px] h-[calc(100dvh-2rem)] sm:h-[500px] sm:max-h-[78vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden glow-unicorn">
          <ChatPanel
            key={activePersona}
            persona={persona}
            onClose={() => setOpen(false)}
            compact
            initialMessage={pending}
          />
        </div>
      )}
    </>
  );
}
