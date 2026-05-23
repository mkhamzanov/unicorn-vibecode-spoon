import { AstroShell } from "@/components/astro/page-shell";
import { BirthdayForm } from "@/components/astro/birthday-form";

export const metadata = {
  title: "Гороскоп на сегодня · unicorn vibecode spoon",
  description:
    "Введи дату рождения — получи знак зодиака и персональный гороскоп на сегодня.",
};

export default function AstroPage() {
  return (
    <AstroShell section="гороскоп">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
          твой <span className="text-unicorn">гороскоп</span>
          <br />
          на сегодня
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          введи дату рождения · узнаешь свой знак и что говорят звёзды
        </p>
      </div>

      <BirthdayForm />
    </AstroShell>
  );
}
