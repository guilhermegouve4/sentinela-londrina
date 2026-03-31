"use client";

import { useEffect, useState } from "react";
import { loadResultData, formatNumber } from "../lib/data";
import { ResultData } from "../types/result";
import { SummaryCard } from "../components/SummaryCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Users, CheckCircle, AlertTriangle, MapPin } from "lucide-react";

/**
 * Página inicial - Visão Geral das Regiões.
 * 
 * Esta é a tela principal do sistema Sentinela Londrina, exibindo:
 * - Cards de resumo com métricas epidemiológicas totais
 * - Tabela detalhada por região administrativa
 * - Status de risco (Crítico/Alerta/Normal) baseado no LIRAa
 * - Progresso visual da situação em cada região
 * 
 * Dados são carregados do arquivo result.json gerado pelo backend C++.
 */

// Definições de tipos e constantes para status
type Status = "critical" | "alert" | "normal";

const STATUS_LABEL: Record<Status, string> = {
  critical: "Crítico",
  alert:    "Alerta",
  normal:   "Normal",
};

const STATUS_STYLE: Record<Status, string> = {
  critical: "bg-red-100 text-red-700 border border-red-200",
  alert:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
  normal:   "bg-green-100 text-green-700 border border-green-200",
};

const BAR_COLOR: Record<Status, string> = {
  critical: "bg-red-500",
  alert:    "bg-yellow-500",
  normal:   "bg-green-500",
};

// Interface para os dados de região
interface Region {
  name: string;
  confirmed: number;
  risk: number;
  status: Status;
  progress_pct: number;
}

export default function VisaoGeral() {
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResultData().then(result => {
      if (result.state === 'success') {
        setData(result.data);
      } else {
        setError(result.error || 'Erro desconhecido');
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!data) return <ErrorMessage message="Dados não disponíveis" />;

  const { summary, regions } = data;

  // Criação do array de cards de resumo com métricas principais
  const summaryCards = [
    {
      title: "Total Notificados",
      value: formatNumber(summary.total_notified),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Casos Confirmados",
      value: formatNumber(summary.total_confirmed),
      icon: CheckCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Regiões Críticas",
      value: summary.critical_regions.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Regiões Normais",
      value: summary.normal_regions.toString(),
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="p-8">
      {/* Header da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Visão Geral das Regiões</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoramento em tempo real por região administrativa</p>
      </div>

      {/* Grid de cards de resumo */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Tabela de regiões com dados detalhados */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Região</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Confirmados</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">LIRAa %</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {(regions as Region[]).map((region, idx) => (
              <tr
                key={region.name}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  idx === regions.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{region.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{region.confirmed.toLocaleString("pt-BR")}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{region.risk.toFixed(1)}%</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${STATUS_STYLE[region.status]}`}>
                    {STATUS_LABEL[region.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Barra de progresso visual */}
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${BAR_COLOR[region.status]}`}
                        style={{ width: `${region.progress_pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{region.progress_pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
