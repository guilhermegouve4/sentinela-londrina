"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col flex-shrink-0">
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

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
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

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
