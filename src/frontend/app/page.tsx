"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt, STATUS_BADGE, BAR_COLOR } from "../lib/data";
import { ResultData, Summary } from "../types/result";
import { Users, CheckCircle, AlertTriangle, Skull, TrendingUp, Activity } from "lucide-react";

export default function VisaoGeral() {
  const [data, setData]       = useState<ResultData | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else { setData(r.data); setSummary(r.summary); }
    });
  }, []);

  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-medium">Erro ao carregar dados</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    </div>
  );

  if (!data || !summary) return (
    <div className="p-8 flex items-center gap-3 text-gray-500">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
      Carregando dados...
    </div>
  );

  const cards = [
    { label: "Total Notificados",  value: fmt.number(summary.total_notified),  icon: Users,         color: "text-blue-600",  bg: "bg-blue-50"  },
    { label: "Casos Confirmados",  value: fmt.number(summary.total_confirmed),  icon: CheckCircle,   color: "text-red-600",   bg: "bg-red-50"   },
    { label: "Óbitos Confirmados", value: fmt.number(summary.total_deaths),     icon: Skull,         color: "text-gray-700",  bg: "bg-gray-100" },
    { label: "Regiões Críticas",   value: summary.critical_regions.toString(),  icon: AlertTriangle, color: "text-red-600",   bg: "bg-red-50"   },
    { label: "Dengue com Alarme",  value: fmt.number(summary.total_dengue_alarm),  icon: Activity,   color: "text-orange-600",bg: "bg-orange-50"},
    { label: "Dengue Grave",       value: fmt.number(summary.total_dengue_severe), icon: TrendingUp,  color: "text-purple-600",bg: "bg-purple-50"},
  ];

  // Ordena regiões por risco decrescente para exibição
  const regioes = [...data.regions].sort((a, b) => b.risk - a.risk);
  const latest  = (r: typeof regioes[0]) => r.bulletins[0];

  // Calcula progress_pct como % do maior risco
  const maxRisk = Math.max(...data.regions.map(r => r.risk));
  const progPct = (risk: number) => Math.round((risk / maxRisk) * 100);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Visão Geral das Regiões</h1>
        <p className="text-sm text-gray-500 mt-1">
          Boletim mais recente: <span className="font-medium text-gray-700">{latest(data.regions[0]).month}</span>
          {" · "}Maior risco: <span className="font-medium text-red-600">{summary.highest_risk_region} ({fmt.percent(summary.highest_risk_value)})</span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className={`text-3xl font-semibold ${color}`}>{value}</p>
            </div>
            <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Situação por Região</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Região</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Notificados</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Confirmados</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Risco %</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Crescimento</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Índice</th>
            </tr>
          </thead>
          <tbody>
            {regioes.map((region, idx) => {
              const b = latest(region);
              const growthRateDisplay = isNaN(region.growth_rate) ? "N/A" : `${region.growth_rate.toFixed(2)}×`;
              return (
                <tr key={region.name} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${idx === regioes.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{region.name}</span>
                      {region.type === 'rural' && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Rural</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{fmt.number(b.notified)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{fmt.number(b.confirmed)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{fmt.percent(region.risk)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{growthRateDisplay}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${STATUS_BADGE[region.status]}`}>
                      {{ critical: "Crítico", alert: "Alerta", normal: "Normal" }[region.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-24">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${BAR_COLOR[region.status]}`} style={{ width: `${progPct(region.risk)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{progPct(region.risk)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}