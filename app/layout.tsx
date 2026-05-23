import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Уникорн Вайбкод Ложка",
  description:
    "Вайбкодим единорога ложкой. 1 подписчик = 1 слово в промпте. Open-source.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${fontVariables} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-igra-sans">
        {children}
      </body>
    </html>
  );
}
