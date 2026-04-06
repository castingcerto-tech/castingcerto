import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casting Certo — Agência de Promotores e Talentos para Eventos",
  description:
    "Conectamos empresas a promotores qualificados para eventos, feiras, PDV e ativações. Cadastre-se como promotor ou contrate nossa equipe para seu evento.",
  keywords: [
    "agência de promotores",
    "promotores de eventos",
    "promotoras de vendas",
    "promotores PDV",
    "ativação de marca",
    "casting",
    "promotores",
  ],
  openGraph: {
    title: "Casting Certo — Agência de Promotores",
    description:
      "Conectamos empresas a promotores qualificados para eventos, feiras, PDV e ativações.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.variable} bg-dark-950 text-cream antialiased`}>
        {children}
      </body>
    </html>
  );
}
