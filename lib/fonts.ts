import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';

export const igraSans = localFont({
  src: '../public/fonts/IgraSans.woff2',
  variable: '--font-igra-sans',
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const fontVariables = `${igraSans.variable} ${geistMono.variable}`;
