import { AstroShell } from "@/components/astro/page-shell";
import { CompatibilityForm } from "@/components/compatibility/form";

export const metadata = {
  title: "Совместимость · unicorn vibecode spoon",
  description:
    "Введите две даты рождения и посмотрите совместимость по знакам зодиака и числам жизненного пути.",
};

export default function CompatibilityPage() {
  return (
    <AstroShell section="совместимость">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
          вы <span className="text-unicorn">подходите</span>
          <br />
          друг другу?
        </h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
          две даты рождения · считаем совместимость по знакам зодиака и числам жизненного пути
        </p>
      </div>

      <CompatibilityForm />
    </AstroShell>
  );
}
