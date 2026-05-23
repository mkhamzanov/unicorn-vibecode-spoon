import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ChatWidget } from "@/components/chat/chat-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unicorn · астро-сервис, собранный ложкой",
  description:
    "AI-астрология и нумерология: гороскоп, совместимость, Таро, матрица судьбы, лунный день. Open-source, собирается публично по 1 слову в промпте за подписчика.",
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
        <ChatWidget />
      </body>
    </html>
  );
}
