"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt } from "../../lib/data";
import { ResultData, Summary } from "../../types/result";
import { AlertTriangle, TrendingUp, Activity, CheckCircle } from "lucide-react";

export default function Alertas() {
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

  // Gera alertas dinamicamente a partir dos dados reais
  const alertas = data.regions
    .filter(r => r.status !== "normal")
    .sort((a, b) => b.risk - a.risk)
    .map(r => {
      const b = r.bulletins[0];
      const crescimento = r.growth_rate > 2 ? "acelerado" : r.growth_rate > 1.5 ? "moderado" : "leve";
      return {
        region: r.name,
        status: r.status,
        risk:   r.risk,
        growth: r.growth_rate,
        msg: r.status === "critical"
          ? `Situação crítica — índice de risco ${fmt.percent(r.risk)} com crescimento ${crescimento} (${r.growth_rate.toFixed(2)}×). ${fmt.number(b.confirmed)} casos confirmados no último boletim.`
          : `Região em alerta — índice de risco ${fmt.percent(r.risk)} com crescimento ${crescimento} (${r.growth_rate.toFixed(2)}×). Monitoramento intensivo recomendado.`,
      };
    });

  const contadores = [
    { label: "Críticos",    value: summary.critical_regions, icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
    { label: "Em Alerta",   value: summary.alert_regions,    icon: TrendingUp,    color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    { label: "Normais",     value: summary.normal_regions,   icon: CheckCircle,   color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
    { label: "Com Alarme",  value: summary.total_dengue_alarm,icon: Activity,     color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Central de Alertas</h1>
        <p className="text-sm text-gray-500 mt-1">Alertas epidemiológicos ativos por região — gerados automaticamente pelo sistema</p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {contadores.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-5 flex items-center justify-between`}>
            <div>
              <p className={`text-sm font-medium ${color}`}>{label}</p>
              <p className={`text-3xl font-semibold ${color} mt-1`}>{value}</p>
            </div>
            <Icon size={28} className={`${color} opacity-60`} />
          </div>
        ))}
      </div>

      {/* Lista de alertas ativos */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-700">Alertas Ativos ({alertas.length})</h2>
        {alertas.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800">Nenhum alerta ativo</p>
            <p className="text-sm text-green-600 mt-1">Todas as regiões estão com índice de risco normal</p>
          </div>
        ) : alertas.map((a) => (
          <div
            key={a.region}
            className={`bg-white border rounded-xl p-5 flex items-start gap-4 ${
              a.status === "critical" ? "border-red-200" : "border-yellow-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              a.status === "critical" ? "bg-red-100" : "bg-yellow-100"
            }`}>
              <AlertTriangle size={20} className={a.status === "critical" ? "text-red-600" : "text-yellow-600"} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-medium text-gray-900">{a.region}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  a.status === "critical"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                }`}>
                  {a.status === "critical" ? "Crítico" : "Alerta"}
                </span>
              </div>
              <p className="text-sm text-gray-600">{a.msg}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-gray-500">Risco: <strong>{fmt.percent(a.risk)}</strong></span>
                <span className="text-xs text-gray-500">Crescimento: <strong>{a.growth.toFixed(2)}×</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de todas as regiões */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Status de Todas as Regiões</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Região", "Tipo", "Risco", "Crescimento", "Dengue Alarme", "Dengue Grave", "Óbitos", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...data.regions].sort((a, b) => b.risk - a.risk).map((r, idx) => {
              const b = r.bulletins[0];
              return (
                <tr key={r.name} className={`border-b border-gray-50 hover:bg-gray-50 text-sm ${idx === data.regions.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{r.type === "urban" ? "Urbana" : "Rural"}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{fmt.percent(r.risk)}</td>
                  <td className="px-6 py-4 text-gray-700">{r.growth_rate.toFixed(2)}×</td>
                  <td className="px-6 py-4 text-gray-700">{b.dengueAlarmCases}</td>
                  <td className="px-6 py-4 text-gray-700">{b.dengueSevereCases}</td>
                  <td className="px-6 py-4 text-gray-700">{b.deaths}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${{
                      critical: "bg-red-100 text-red-700 border border-red-200",
                      alert:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
                      normal:   "bg-green-100 text-green-700 border border-green-200",
                    }[r.status]}`}>
                      {{ critical: "Crítico", alert: "Alerta", normal: "Normal" }[r.status]}
                    </span>
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
