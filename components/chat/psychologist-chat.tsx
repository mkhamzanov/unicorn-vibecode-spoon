"use client";

import { useEffect, useState } from "react";
import { ChatPanel } from "./chat-panel";
import { PERSONAS } from "@/lib/chat/personas";

export function PsychologistChat() {
  const [pending, setPending] = useState<{ text: string; nonce: number } | null>(null);

  useEffect(() => {
    // если на эту страницу пришли через AskAIButton — подхватим сообщение
    try {
      const raw = sessionStorage.getItem("uvs:psy:pending");
      if (raw) {
        const parsed = JSON.parse(raw) as { text: string; nonce: number };
        if (parsed?.text) setPending(parsed);
        sessionStorage.removeItem("uvs:psy:pending");
      }
    } catch {}
  }, []);

  return (
    <div className="h-[68vh] sm:h-[600px] max-h-[700px] rounded-2xl border-unicorn glow-unicorn bg-card overflow-hidden">
      <ChatPanel persona={PERSONAS.psychologist} initialMessage={pending} />
    </div>
  );
}
