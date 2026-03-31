"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "./globals.css";
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
} from "lucide-react";

const navItems = [
  { href: "/",           label: "Visão Geral",          icon: LayoutDashboard },
  { href: "/evolucao",   label: "Evolução Temporal",     icon: TrendingUp },
  { href: "/boletins",   label: "Boletins Semanais",     icon: FileText },
  { href: "/filtros",    label: "Filtros Avançados",     icon: Filter },
  { href: "/ingestao",   label: "Ingestão de Dados",     icon: Upload },
  { href: "/relatorio",  label: "Relatório Situacional", icon: ClipboardList },
  { href: "/historico",  label: "Histórico por Região",  icon: Clock },
  { href: "/hierarquia", label: "Hierarquia UBS",        icon: Network },
  { href: "/alertas",    label: "Central de Alertas",    icon: AlertTriangle },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">Operação Sentinela Londrina</p>
          <p className="text-xs text-gray-500">Vigilância Epidemiológica - Dengue</p>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
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
              <Icon size={17} className={active ? "text-red-600" : "text-gray-500"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Sentinela Londrina</title>
        <meta name="description" content="Sistema de monitoramento de arboviroses em Londrina" />
      </head>
      <body className="bg-gray-50 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
