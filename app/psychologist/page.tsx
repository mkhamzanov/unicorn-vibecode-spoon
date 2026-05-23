import { AstroShell } from "@/components/astro/page-shell";
import { PsychologistChat } from "@/components/chat/psychologist-chat";

export const metadata = {
  title: "AI-психолог · unicorn vibecode spoon",
  description:
    "Тёплый AI-собеседник, который выслушает без оценки. Не заменяет терапевта, но помогает разложить мысли.",
};

export default function PsychologistPage() {
  return (
    <AstroShell section="психолог">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
          поговори с <span className="text-unicorn">тёплым</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
          AI-собеседник, который слушает без оценки. не врач и не заменяет терапевта — но помогает разложить мысли вслух.
        </p>
      </div>

      <PsychologistChat />

      <p className="mt-6 text-center text-[10px] text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
        кризис? насилие? мысли о суициде? живой человек: <strong className="text-foreground/80">8-800-2000-122</strong> (бесплатно по РФ, 24/7) · <strong className="text-foreground/80">051</strong> (с мобильного, экстренная психологическая)
      </p>
    </AstroShell>
  );
}
