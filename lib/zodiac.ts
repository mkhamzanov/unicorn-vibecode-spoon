export type ZodiacElement = "fire" | "earth" | "air" | "water";

export type ZodiacSign = {
  key: string;
  ru: string;
  symbol: string;
  range: string;
  element: ZodiacElement;
};

type SignWithStart = ZodiacSign & { startMonth: number; startDay: number };

const SIGNS: SignWithStart[] = [
  { key: "capricorn",   ru: "Козерог",   symbol: "♑", range: "22.12 — 19.01", element: "earth", startMonth: 12, startDay: 22 },
  { key: "aquarius",    ru: "Водолей",   symbol: "♒", range: "20.01 — 18.02", element: "air",   startMonth: 1,  startDay: 20 },
  { key: "pisces",      ru: "Рыбы",      symbol: "♓", range: "19.02 — 20.03", element: "water", startMonth: 2,  startDay: 19 },
  { key: "aries",       ru: "Овен",      symbol: "♈", range: "21.03 — 19.04", element: "fire",  startMonth: 3,  startDay: 21 },
  { key: "taurus",      ru: "Телец",     symbol: "♉", range: "20.04 — 20.05", element: "earth", startMonth: 4,  startDay: 20 },
  { key: "gemini",      ru: "Близнецы",  symbol: "♊", range: "21.05 — 20.06", element: "air",   startMonth: 5,  startDay: 21 },
  { key: "cancer",      ru: "Рак",       symbol: "♋", range: "21.06 — 22.07", element: "water", startMonth: 6,  startDay: 21 },
  { key: "leo",         ru: "Лев",       symbol: "♌", range: "23.07 — 22.08", element: "fire",  startMonth: 7,  startDay: 23 },
  { key: "virgo",       ru: "Дева",      symbol: "♍", range: "23.08 — 22.09", element: "earth", startMonth: 8,  startDay: 23 },
  { key: "libra",       ru: "Весы",      symbol: "♎", range: "23.09 — 22.10", element: "air",   startMonth: 9,  startDay: 23 },
  { key: "scorpio",     ru: "Скорпион",  symbol: "♏", range: "23.10 — 21.11", element: "water", startMonth: 10, startDay: 23 },
  { key: "sagittarius", ru: "Стрелец",   symbol: "♐", range: "22.11 — 21.12", element: "fire",  startMonth: 11, startDay: 22 },
];

function strip({ startMonth, startDay, ...rest }: SignWithStart): ZodiacSign {
  void startMonth; void startDay;
  return rest;
}

export function getZodiac(month: number, day: number): ZodiacSign {
  // month: 1..12, day: 1..31
  const pick = (k: string) => strip(SIGNS.find((s) => s.key === k)!);

  if ((month === 3  && day >= 21) || (month === 4  && day <= 19)) return pick("aries");
  if ((month === 4  && day >= 20) || (month === 5  && day <= 20)) return pick("taurus");
  if ((month === 5  && day >= 21) || (month === 6  && day <= 20)) return pick("gemini");
  if ((month === 6  && day >= 21) || (month === 7  && day <= 22)) return pick("cancer");
  if ((month === 7  && day >= 23) || (month === 8  && day <= 22)) return pick("leo");
  if ((month === 8  && day >= 23) || (month === 9  && day <= 22)) return pick("virgo");
  if ((month === 9  && day >= 23) || (month === 10 && day <= 22)) return pick("libra");
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return pick("scorpio");
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return pick("sagittarius");
  if ((month === 12 && day >= 22) || (month === 1  && day <= 19)) return pick("capricorn");
  if ((month === 1  && day >= 20) || (month === 2  && day <= 18)) return pick("aquarius");
  return pick("pisces"); // 19.02 — 20.03
}

export function getSignByKey(key: string): ZodiacSign | null {
  const s = SIGNS.find((x) => x.key === key);
  return s ? strip(s) : null;
}

export const ALL_SIGNS: ZodiacSign[] = SIGNS.map(strip);

export const ELEMENT_RU: Record<ZodiacElement, string> = {
  fire: "огонь",
  earth: "земля",
  air: "воздух",
  water: "вода",
};
