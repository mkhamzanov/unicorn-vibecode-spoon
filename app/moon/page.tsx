import { AstroShell } from "@/components/astro/page-shell";
import { MoonToday } from "@/components/moon/today";

export const metadata = {
  title: "Лунный день · unicorn vibecode spoon",
  description: "Текущий лунный день, фаза и освещённость — что говорит луна сегодня.",
};

export default function MoonPage() {
  return (
    <AstroShell section="луна">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
          сегодняшняя <span className="text-unicorn">луна</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          лунный день · фаза · что подсказывает
        </p>
      </div>

      <MoonToday />
    </AstroShell>
  );
}
