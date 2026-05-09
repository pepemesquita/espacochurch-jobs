import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Espaço Church Jobs | Conectando Talentos na Comunidade",
    template: "%s | Espaço Church Jobs"
  },
  description: "Plataforma profissional para membros da Espaço Church Pelotas. Encontre eletricistas, engenheiros, advogados e outros profissionais da nossa comunidade.",
  keywords: ["emprego", "profissionais", "igreja", "Pelotas", "comunidade", "serviços", "Espaço Church"],
  authors: [{ name: "Pedro Henrique" }],
  openGraph: {
    title: "Espaço Church Jobs",
    description: "Conectando profissionais e empreendedores da nossa comunidade.",
    type: "website",
    locale: "pt_BR",
    siteName: "Espaço Church Jobs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
