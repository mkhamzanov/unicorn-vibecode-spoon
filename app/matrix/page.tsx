import { AstroShell } from "@/components/astro/page-shell";
import { MatrixForm } from "@/components/matrix/form";

export const metadata = {
  title: "Матрица судьбы · unicorn vibecode spoon",
  description:
    "Карманная матрица судьбы по дате рождения: восемь энергий, каждая — один из 22 арканов.",
};

export default function MatrixPage() {
  return (
    <AstroShell section="матрица судьбы">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
          твоя <span className="text-unicorn">матрица</span>
          <br />
          судьбы
        </h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
          одна дата рождения · восемь энергий с арканами Таро под каждой
        </p>
      </div>

      <MatrixForm />
    </AstroShell>
  );
}
