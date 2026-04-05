"use client";

/**
 * Layout principal da aplicação Sentinela Londrina.
 * 
 * Este componente define a estrutura base da aplicação, incluindo:
 * - Sidebar lateral com navegação para todas as telas
 * - Layout responsivo com área principal para conteúdo
 * - Tema visual consistente com cores da vigilância epidemiológica
 * 
 * A sidebar contém links para todas as funcionalidades principais:
 * - Visão Geral: Dashboard com métricas gerais
 * - Evolution: Gráficos de tendência semanal
 * - Bulletins: Acesso aos documentos PDF originais
 * - Filters: Busca avançada por parâmetros específicos
 * - Ingestion: Upload e processamento de novos boletins
 * - Report: Documento situacional completo
 * - History: Análise de permanência em status por região
 * - Hierarchy: Estrutura organizacional das UBS
 * - Alerts: Central de notificações críticas
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PWAInit } from "./pwa-init";
import "./globals.css";
// Importação dos ícones do Lucide React para a navegação
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Filter,
  Upload,
  ClipboardList,
  Clock,
  Network,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";

// Array de itens de navegação com href, label e ícone correspondente
const navItems = [
  { href: "/",           label: "Visão Geral",          icon: LayoutDashboard },
  { href: "/evolution",  label: "Evolução Temporal",     icon: TrendingUp },
  { href: "/bulletins",  label: "Boletins Semanais",     icon: FileText },
  { href: "/filters",    label: "Filtros Avançados",     icon: Filter },
  { href: "/ingestion",  label: "Ingestão de Dados",     icon: Upload },
  { href: "/report",     label: "Relatório Situacional", icon: ClipboardList },
  { href: "/history",    label: "Histórico por Região",  icon: Clock },
  { href: "/hierarchy",  label: "Hierarquia UBS",        icon: Network },
  { href: "/alerts",     label: "Central de Alertas",    icon: AlertTriangle },
];

// Componente da barra lateral com navegação
function Sidebar() {
  // Hook para obter o caminho atual da URL
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col flex-shrink-0">
      {/* Header da sidebar com logo e título do sistema */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">Operação Sentinela Londrina</p>
          <p className="text-xs text-gray-500">Vigilância Epidemiológica - Dengue</p>
        </div>
      </div>

      {/* Menu de navegação com links para todas as páginas */}
      <nav className="flex-1 py-3 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          // Verifica se o link atual está ativo
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {/* Ícone com cor condicional baseada no estado ativo */}
              <Icon size={17} className={active ? "text-red-600" : "text-gray-500"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Componente principal do layout da aplicação
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="pt-BR">
      <head>
        <title>Sentinela Londrina</title>
        <meta name="description" content="Sistema de monitoramento de arboviroses em Londrina" />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#1f2937" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sentinela Londrina" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-gray-50 antialiased">
        <PWAInit />
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
                  aria-label="Abrir menu"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sentinela Londrina</p>
                  <p className="text-xs text-gray-500">Vigilância Epidemiológica</p>
                </div>
              </div>
            </header>

            {mobileMenuOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/30 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            <aside
              className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 p-4 transition-transform duration-200 md:hidden ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Operação Sentinela</p>
                    <p className="text-xs text-gray-500">Vigilância Epidemiológica</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
                  aria-label="Fechar menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={17} className={active ? "text-red-600" : "text-gray-500"} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
