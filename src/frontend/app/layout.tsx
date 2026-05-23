import type { Metadata, Viewport } from "next";
import { AppShell } from "./app-shell";
import { PWAInit } from "./pwa-init";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinela Londrina",
  description: "Sistema de monitoramento de arboviroses em Londrina",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Sentinela Londrina",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#fef2f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <PWAInit />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
