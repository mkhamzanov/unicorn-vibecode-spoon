"use client";

import { Sparkles } from "lucide-react";
import type { PersonaKey } from "@/lib/chat/personas";

type Props = {
  context: string;       // что обсудить (краткий summary результата)
  persona?: PersonaKey;  // по умолчанию astrologer
  label?: string;
  className?: string;
};

export function AskAIButton({ context, persona = "astrologer", label = "обсудить с AI", className = "" }: Props) {
  function handleClick() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("uvs:chat:open", {
        detail: { persona, message: context },
      })
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-br from-uni-pink via-uni-violet to-uni-blue text-white text-xs font-medium hover:opacity-95 transition-opacity glow-unicorn ${className}`}
    >
      <Sparkles className="size-4" />
      {label}
    </button>
  );
}
