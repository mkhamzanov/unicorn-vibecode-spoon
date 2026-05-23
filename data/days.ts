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
export const days: Day[] = [];

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
