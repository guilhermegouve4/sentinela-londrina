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
 * - Evolução Temporal: Gráficos de tendência semanal
 * - Boletins: Acesso aos documentos PDF originais
 * - Filtros: Busca avançada por parâmetros específicos
 * - Ingestão: Upload e processamento de novos boletins
 * - Relatório: Documento situacional completo
 * - Histórico: Análise de permanência em status por região
 * - Hierarquia: Estrutura organizacional das UBS
 * - Alertas: Central de notificações críticas
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

// Array de itens de navegação com href, label e ícone correspondente
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

// Componente da barra lateral com navegação
function Sidebar() {
  // Hook para obter o caminho atual da URL
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
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
  return (
    <html lang="pt-BR">
      <head>
        <title>Sentinela Londrina</title>
        <meta name="description" content="Sistema de monitoramento de arboviroses em Londrina" />
      </head>
      <body className="bg-gray-50 antialiased">
        {/* Layout principal com sidebar fixa e área de conteúdo */}
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
