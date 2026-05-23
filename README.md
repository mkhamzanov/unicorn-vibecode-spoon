# Unicorn Vibecode Spoon

Виральный open-source челлендж. **1 подписчик = 1 слово в промпте.**
Каждый день — новая фича, ровно настолько, насколько хватает слов.

## Механика

1. У автора N подписчиков.
2. Клод сам генерит себе промпт ровно на N слов (капс, без воды).
3. По этому промпту пишется код, который заезжает в этот же репозиторий.
4. Ролик. Подписчики растут. Завтра промпт длиннее.

## Стэк фундамента

- Next.js 16 + React 19
- Tailwind 4 + shadcn (style: `base-nova`)
- IgraSans (локальный шрифт, перенесен из kerege-analytics)
- Темная "Underground" тема + единорог-радуга акценты
- TypeScript

## Старт

```bash
npm install
npm run dev
```

Откроется на `http://localhost:3000`.

## Структура

```
app/
  layout.tsx           — root layout, IgraSans, dark mode
  page.tsx             — лендинг: счетчик · промпт дня · таймлайн
  globals.css          — токены темы + .text-unicorn / .border-unicorn / .prompt-block
components/ui/         — Card, Button, Badge, Separator (shadcn base-nova)
lib/
  fonts.ts             — IgraSans + Geist Mono
  utils.ts             — cn()
data/
  days.ts              — источник правды по дням, currentState()
public/fonts/
  IgraSans.woff2
```

## Как добавить новый день

Открыть [data/days.ts](data/days.ts) и пушнуть запись:

```ts
days.push({
  n: 1,
  date: "2026-05-23",
  followers: 15,
  prompt: "ИГРА ЗМЕЙКА НЕОН КНОПКА СТАРТ СЧЕТЧИК СКОРОСТЬ АНИМАЦИЯ ХВОСТА HTML CSS JS",
  built: "Однофайловая змейка с неоновым хвостом и счетчиком.",
  stack: ["HTML", "CSS", "JS"],
  href: "/lab/day-1",
});
```

Лендинг подхватит сам: новый счетчик, новый промпт дня, новая карточка в таймлайне.

## Лог

- **v0.1** — фундамент: стили из kerege-analytics, IgraSans, темная тема, unicorn-радуга, пустой лендинг готов к первому дню.
