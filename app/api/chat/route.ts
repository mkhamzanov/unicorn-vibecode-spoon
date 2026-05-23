import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";

export const runtime = "edge";

type Message = { role: "user" | "assistant" | "system"; content: string };

const RATE: Map<string, { count: number; resetAt: number }> = new Map();
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

function checkRate(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || entry.resetAt < now) {
    RATE.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

export async function POST(req: NextRequest) {
  let body: { messages?: Message[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: "no_messages" }, { status: 400 });
  }
  if (incoming.length > 20) {
    return NextResponse.json(
      { reply: "Бро, чат раздулся. Продолжим у автора в Telegram → https://t.me/mkhamzanovv" },
      { status: 200 }
    );
  }

  const last = incoming[incoming.length - 1];
  if (!last?.content || last.content.length > 500) {
    return NextResponse.json({ error: "bad_message" }, { status: 400 });
  }

  // Отбрасываем любые role !== user|assistant от клиента
  const safe = incoming
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      role: m.role,
      content: typeof m.content === "string" ? m.content.slice(0, 1000) : "",
    }));

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = checkRate(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "rate_limit", retry_after: rate.retryAfter, reply: `Много запросов. Подожди ${rate.retryAfter}с — или сразу в Telegram → https://t.me/mkhamzanovv` },
      { status: 429 }
    );
  }

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    // Заглушка: чат работает, но без LLM. Подключи DEEPSEEK_API_KEY в .env.local.
    return NextResponse.json({
      reply:
        "Я тут готов, но мой движок (DeepSeek) пока не подключён — нужен ключ в DEEPSEEK_API_KEY. А пока — потыкай инструменты: /astro, /compatibility, /tarot, /matrix, /moon. Или напиши автору → https://t.me/mkhamzanovv",
    });
  }

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 25_000);
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safe],
        temperature: 1.3,
        top_p: 0.95,
        max_tokens: 500,
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      return NextResponse.json(
        { reply: "Звездочёт спит. Напиши автору напрямую → https://t.me/mkhamzanovv" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({
      reply:
        reply || "Хм, ответа нет. Попробуй переформулировать или напиши автору → https://t.me/mkhamzanovv",
    });
  } catch {
    return NextResponse.json(
      { reply: "Связь с космосом прервалась. Попробуй ещё раз или напиши автору → https://t.me/mkhamzanovv" },
      { status: 502 }
    );
  }
}
