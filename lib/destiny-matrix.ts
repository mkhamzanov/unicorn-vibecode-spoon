// Матрица судьбы (упрощённая, по методу Н. Ладини).
// Базовый набор энергий из даты рождения, каждая → один из 22 арканов.
// Это «карманная» версия — не полная матрица, но даёт зерно для разговора.

function sumDigits(n: number): number {
  let s = 0;
  let x = Math.abs(n);
  while (x > 0) { s += x % 10; x = Math.floor(x / 10); }
  return s;
}

// Свернуть к диапазону 1..22 (любое число, пока не <= 22)
function reduceTo22(n: number): number {
  let x = n;
  while (x > 22) x = sumDigits(x);
  return Math.max(x, 1);
}

const ARCANA_22 = [
  { id: 1,  name: "Маг",             theme: "ум, коммуникация, манифестация" },
  { id: 2,  name: "Жрица",            theme: "интуиция, тайна, женская мудрость" },
  { id: 3,  name: "Императрица",      theme: "изобилие, чувственность, плодородие" },
  { id: 4,  name: "Император",        theme: "власть, структура, лидерство" },
  { id: 5,  name: "Иерофант",         theme: "учитель, традиция, передача знаний" },
  { id: 6,  name: "Влюблённые",       theme: "выбор, союзы, любовь" },
  { id: 7,  name: "Колесница",        theme: "воля, движение, победа" },
  { id: 8,  name: "Справедливость",   theme: "карма, правда, баланс" },
  { id: 9,  name: "Отшельник",        theme: "мудрость, уединение, поиск" },
  { id: 10, name: "Колесо Фортуны",   theme: "циклы, удача, перемены" },
  { id: 11, name: "Сила",             theme: "мягкая мощь, страсть, контроль" },
  { id: 12, name: "Повешенный",       theme: "жертва, новый взгляд, пауза" },
  { id: 13, name: "Смерть",           theme: "трансформация, конец цикла, перерождение" },
  { id: 14, name: "Умеренность",      theme: "алхимия, баланс, исцеление" },
  { id: 15, name: "Дьявол",           theme: "тень, привязки, материя" },
  { id: 16, name: "Башня",            theme: "разрушение иллюзий, освобождение" },
  { id: 17, name: "Звезда",           theme: "надежда, вдохновение, путь" },
  { id: 18, name: "Луна",             theme: "интуиция, иллюзии, бессознательное" },
  { id: 19, name: "Солнце",           theme: "успех, ясность, радость" },
  { id: 20, name: "Суд",              theme: "призвание, итоги, пробуждение" },
  { id: 21, name: "Мир",              theme: "целостность, реализация, гармония" },
  { id: 22, name: "Дурак",            theme: "вера, свобода, начало пути" },
];

export type MatrixCell = {
  key: string;
  label: string;
  hint: string;
  value: number;        // 1..22
  arcanaName: string;
  arcanaTheme: string;
};

export function calculateMatrix(year: number, month: number, day: number): {
  cells: MatrixCell[];
  yearSum: number;
} {
  const A = reduceTo22(day);
  const B = reduceTo22(month);
  const yearSum = sumDigits(year);
  const C = reduceTo22(yearSum);
  const D = reduceTo22(A + B + C);                  // миссия
  const E = reduceTo22(A + B + C + D);              // сердце
  const M = reduceTo22(A + D);                      // линия мужского
  const F = reduceTo22(B + D);                      // линия женского
  const $ = reduceTo22(C + D);                      // финансы

  const meta: Array<Pick<MatrixCell, "key" | "label" | "hint"> & { value: number }> = [
    { key: "A", label: "Личность",      hint: "точка «я» — как ты воспринимаешь себя",                value: A },
    { key: "B", label: "Род",           hint: "семейная программа, что передано",                     value: B },
    { key: "C", label: "Прошлое",       hint: "опыт, который ты приносишь в эту жизнь",               value: C },
    { key: "D", label: "Миссия",        hint: "главная задача жизни",                                  value: D },
    { key: "E", label: "Сердце",        hint: "центр — то, ради чего ты на самом деле",                value: E },
    { key: "M", label: "Мужская линия", hint: "отец, мужская сила, проявление в мире",                 value: M },
    { key: "F", label: "Женская линия", hint: "мать, чувства, принимающая сила",                       value: F },
    { key: "$", label: "Финансы",       hint: "отношения с деньгами и ресурсами",                      value: $ },
  ];

  const cells: MatrixCell[] = meta.map((m) => {
    const a = ARCANA_22[m.value - 1];
    return {
      key: m.key,
      label: m.label,
      hint: m.hint,
      value: m.value,
      arcanaName: a.name,
      arcanaTheme: a.theme,
    };
  });

  return { cells, yearSum };
}
