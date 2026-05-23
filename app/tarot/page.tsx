import { AstroShell } from "@/components/astro/page-shell";
import { TarotSpread } from "@/components/tarot/spread";

export const metadata = {
  title: "Расклад Таро · unicorn vibecode spoon",
  description: "Расклад на трёх старших арканах: прошлое, настоящее, будущее.",
};

export default function TarotPage() {
  return (
    <AstroShell section="таро">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
          расклад на <span className="text-unicorn">трёх картах</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
          22 старших аркана · прошлое · настоящее · будущее
        </p>
      </div>

      <TarotSpread />
    </AstroShell>
  );
}
