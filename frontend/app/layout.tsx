import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// //const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    default: "엔카페:몽중화(夢中花)", // 기본 제목
    template: "%s | 엔카페:몽중화(夢中花)", // 다른 페이지에서 사용할 양식
  },
  description: "가장 한국적인 공간에서 즐기는 평온한 순간",
};

import { Toaster } from "react-hot-toast";
import AuthInitializer from '@/components/auth/AuthInitializer';
import LayoutWrapper from '@/components/LayoutWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`sans-serif heritage-theme`}>
        <AuthInitializer />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
