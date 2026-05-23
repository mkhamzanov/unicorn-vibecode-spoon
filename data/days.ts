// Источник правды по дням челленджа.
// Каждый день = новая запись. 1 подписчик = 1 слово в промпте.

export type Day = {
  n: number;                  // номер дня (1, 2, 3...)
  date: string;               // YYYY-MM-DD
  followers: number;          // подписчиков на момент дня = бюджет слов
  prompt: string;             // сам промпт (капс, без воды)
  built: string;              // что построено за день (1-2 предложения)
  stack?: string[];           // ['HTML','CSS','JS'] или ['React','Tailwind']
  href?: string;              // ссылка на демку/роут/коммит (опционально)
  reel?: string;              // ссылка на рилс/тикток (опционально)
};

// Стартовое состояние: 0 дней, 0 подписчиков. Заполняется по мере выхода роликов.
export const days: Day[] = [
  {
    n: 1,
    date: "2026-05-23",
    followers: 20,
    prompt:
      "СТРАНИЦА АСТРО ФОРМА ДАТЫ РОЖДЕНИЯ АВТО ОПРЕДЕЛЕНИЕ ЗНАКА ЗОДИАКА ГОРОСКОП ДНЯ ИЗ JSON ЗВЕЗДНАЯ КРАСИВАЯ АНИМАЦИЯ КАРТОЧКА РЕЗУЛЬТАТА КНОПКА ПОДЕЛИТЬСЯ",
    built:
      "Страница /astro: дата → знак зодиака → персональный гороскоп из JSON. Звёздное поле на фоне, карточка результата с символом знака и стихией, кнопка поделиться (Web Share API + копирование ссылки).",
    stack: ["Next 16", "React 19", "Tailwind 4", "JSON"],
    href: "/astro",
  },
];

// Удобный геттер: текущее состояние = последний день, либо нули.
export function currentState() {
  const last = days[days.length - 1];
  return {
    dayN: last?.n ?? 0,
    followers: last?.followers ?? 0,
    todayPrompt: last?.prompt ?? null,
    todayBuilt: last?.built ?? null,
  };
}
