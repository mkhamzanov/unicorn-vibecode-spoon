"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

type Props = {
  title: string;
  text: string;
  url: string;
};

export function ShareBar({ title, text, url }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const enc = encodeURIComponent;
  const tgUrl = `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`;
  const waUrl = `https://wa.me/?text=${enc(text + " " + url)}`;

  async function copyToClipboard(label: string, payload: string) {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  async function instagramShare() {
    // Instagram нет URL-схемы для share — копируем в буфер и подсказываем
    await copyToClipboard("ig", `${text}\n${url}`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ShareBtn
        href={tgUrl}
        label="Telegram"
        accent="cyan"
        icon={<TelegramIcon />}
      />
      <ShareBtn
        href={waUrl}
        label="WhatsApp"
        accent="mint"
        icon={<WhatsAppIcon />}
      />
      <ShareBtn
        onClick={instagramShare}
        label={copied === "ig" ? "скопировано · открой IG" : "Instagram"}
        accent="pink"
        icon={<InstagramIcon />}
      />
      <ShareBtn
        onClick={() => copyToClipboard("link", url)}
        label={copied === "link" ? "ссылка скопирована" : "копировать ссылку"}
        accent="violet"
        icon={copied === "link" ? <Check className="size-4" /> : <Link2 className="size-4" />}
      />
      {title && <span className="sr-only">{title}</span>}
    </div>
  );
}

type Accent = "pink" | "violet" | "blue" | "cyan" | "mint";

const ACCENT_BG: Record<Accent, string> = {
  pink:   "hover:bg-uni-pink/10 hover:text-uni-pink hover:border-uni-pink/40",
  violet: "hover:bg-uni-violet/10 hover:text-uni-violet hover:border-uni-violet/40",
  blue:   "hover:bg-uni-blue/10 hover:text-uni-blue hover:border-uni-blue/40",
  cyan:   "hover:bg-uni-cyan/10 hover:text-uni-cyan hover:border-uni-cyan/40",
  mint:   "hover:bg-uni-mint/10 hover:text-uni-mint hover:border-uni-mint/40",
};

function ShareBtn({
  href,
  onClick,
  label,
  icon,
  accent,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: React.ReactNode;
  accent: Accent;
}) {
  const className = `inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-background/40 text-muted-foreground text-xs transition-colors ${ACCENT_BG[accent]}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} aria-label={label}>
        <span className="size-4 grid place-items-center">{icon}</span>
        <span>{label}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      <span className="size-4 grid place-items-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.05 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zM12.05 20.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01s-.43.06-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
