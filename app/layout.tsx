import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/componentes/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Saideira",
    default: "Saideira - Resgate comida de qualidade no último minuto",
  },
  description: "Plataforma de resgate de lanches e refeições de qualidade com descontos imperdíveis.",
  openGraph: {
    title: "Saideira - Resgate comida de qualidade no último minuto",
    description: "Plataforma de resgate de lanches e refeições de qualidade com descontos imperdíveis.",
    url: "https://saideira.com.br", // URL fictícia por enquanto
    siteName: "Saideira",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saideira - Resgate comida de qualidade",
    description: "Plataforma de resgate de lanches e refeições com descontos imperdíveis.",
  }
};

export const viewport = {
  themeColor: "#F2A93B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-paper text-night antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}