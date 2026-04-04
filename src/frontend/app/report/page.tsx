"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt, STATUS_BADGE, STATUS_BG } from "../../lib/data";
import { ResultData, Summary } from "../../types/result";
import { AlertTriangle, TrendingUp, Skull, Activity } from "lucide-react";

export default function Relatorio() {
  const [data, setData]       = useState<ResultData | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else { setData(r.data); setSummary(r.summary); }
    });
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data || !summary) return <div className="p-8 text-gray-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-t-red-500 rounded-full animate-spin"/>Carregando...</div>;

  const regioesPorRisco = [...data.regions].sort((a, b) => b.risk - a.risk);
  const maisRecente = data.regions[0].bulletins[0].month;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Relatório Situacional</h1>
        <p className="text-sm text-gray-500 mt-1">Análise epidemiológica — boletim de {maisRecente}</p>
      </div>

      {/* Alerta crítico se houver */}
      {summary.critical_regions > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">
              {summary.critical_regions} região{summary.critical_regions > 1 ? "ões" : ""} em situação crítica
            </p>
            <p className="text-sm text-red-600 mt-1">
              {regioesPorRisco.filter(r => r.status === "critical").map(r => r.name).join(", ")} — índice de risco acima de 20%
            </p>
          </div>
        </div>
      )}

      {/* Métricas principais */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Notificados",  value: fmt.number(summary.total_notified),      icon: TrendingUp,   color: "text-blue-600",   bg: "bg-blue-50" },
          { label: "Casos Confirmados",  value: fmt.number(summary.total_confirmed),      icon: Activity,     color: "text-red-600",    bg: "bg-red-50"  },
          { label: "Dengue com Alarme",  value: fmt.number(summary.total_dengue_alarm),   icon: AlertTriangle,color: "text-orange-600", bg: "bg-orange-50"},
          { label: "Óbitos",             value: fmt.number(summary.total_deaths),         icon: Skull,        color: "text-gray-700",   bg: "bg-gray-100"},
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-semibold ${color}`}>{value}</p>
            </div>
            <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Ranking por risco */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Ranking de Regiões por Índice de Risco</h2>
          <p className="text-xs text-gray-500 mt-0.5">Ordenado do maior para o menor risco epidemiológico</p>
        </div>
        <div className="divide-y divide-gray-50">
          {regioesPorRisco.map((r, idx) => {
            const b = r.bulletins[0];
            const maxRisk = regioesPorRisco[0].risk;
            return (
              <div key={r.name} className={`px-6 py-4 flex items-center gap-4 hover:bg-gray-50 ${STATUS_BG[r.status]} border-l-4`}>
                <span className="text-lg font-bold text-gray-400 w-6">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{r.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_BADGE[r.status]}`}>
                      {{ critical: "Crítico", alert: "Alerta", normal: "Normal" }[r.status]}
                    </span>
                    {r.type === "rural" && <span className="text-xs text-gray-400">Rural (×1.25)</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${{ critical: "bg-red-500", alert: "bg-yellow-500", normal: "bg-green-500" }[r.status]}`}
                        style={{ width: `${(r.risk / maxRisk) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-14 text-right">{fmt.percent(r.risk)}</span>
                  </div>
                </div>
                <div className="text-right min-w-32">
                  <p className="text-sm text-gray-500">Confirmados</p>
                  <p className="font-semibold text-gray-900">{fmt.number(b.confirmed)}</p>
                  <p className="text-xs text-gray-500">Crescimento: {r.growth_rate.toFixed(2)}×</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico de todos os boletins da região de maior risco */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">
            Histórico Completo — {regioesPorRisco[0].name} (maior risco)
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Mês", "Notificados", "Confirmados", "Descartados", "Em Análise", "Óbitos", "Dengue Alarme", "Dengue Grave"].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regioesPorRisco[0].bulletins.map((b, idx) => (
              <tr key={b.month} className={`border-b border-gray-50 hover:bg-gray-50 text-sm ${idx === regioesPorRisco[0].bulletins.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{b.month}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.notified)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.confirmed)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.discarded)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.underAnalysis)}</td>
                <td className="px-4 py-3 text-gray-700">{b.deaths}</td>
                <td className="px-4 py-3 text-gray-700">{b.dengueAlarmCases}</td>
                <td className="px-4 py-3 text-gray-700">{b.dengueSevereCases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
