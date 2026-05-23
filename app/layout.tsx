import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unicorn Vibecode Spoon",
  description:
    "Вайбкодим единорога ложкой. 1 подписчик = 1 слово в промпте. Open-source.",
};

// Inline-скрипт: применяем тему ДО гидрации, чтобы не было вспышки.
const themeScript = `
try {
  var saved = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var dark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', dark);
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-igra-sans">
        {children}
      </body>
    </html>
  );
}
