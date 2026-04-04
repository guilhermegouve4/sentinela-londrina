"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt, STATUS_BADGE, BAR_COLOR } from "../../lib/data";
import { ResultData } from "../../types/result";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CORES: Record<string, string> = {
  Norte: "#E53935", Sul: "#1E88E5", Leste: "#43A047",
  Oeste: "#FB8C00", Central: "#8E24AA", Rural: "#6D4C41",
};

export default function Historico() {
  const [data, setData]         = useState<ResultData | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [regiao, setRegiao]     = useState<string>("");

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else {
        setData(r.data);
        // Seleciona por padrão a região de maior risco
        const sorted = [...r.data.regions].sort((a, b) => b.risk - a.risk);
        setRegiao(sorted[0].name);
      }
    });
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data)  return <div className="p-8 text-gray-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-t-red-500 rounded-full animate-spin"/>Carregando...</div>;

  const regiaoData = data.regions.find(r => r.name === regiao);
  if (!regiaoData) return null;

  // Ordena bulletins do mais antigo para o mais recente para o gráfico
  const bulletinsOrdenados = [...regiaoData.bulletins].reverse();

  const chartData = bulletinsOrdenados.map(b => ({
    mes: b.month,
    confirmados: b.confirmed,
    notificados: b.notified,
    alarme: b.dengueAlarmCases,
    grave: b.dengueSevereCases,
  }));

  // Variação mês a mês
  const variacoes = bulletinsOrdenados.map((b, i) => {
    const prev = bulletinsOrdenados[i - 1];
    const variacao = prev && prev.confirmed > 0
      ? ((b.confirmed - prev.confirmed) / prev.confirmed * 100)
      : null;
    return { ...b, variacao };
  }).reverse(); // volta para mais recente primeiro na tabela

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Histórico por Região</h1>
        <p className="text-sm text-gray-500 mt-1">Evolução mensal detalhada de cada região administrativa</p>
      </div>

      {/* Seletor de região */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[...data.regions].sort((a, b) => b.risk - a.risk).map(r => (
          <button key={r.name} onClick={() => setRegiao(r.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              regiao === r.name
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}>
            <span>{r.name}</span>
            <span className={`text-xs ${STATUS_BADGE[r.status]} px-1.5 py-0.5 rounded ${regiao === r.name ? "bg-red-500 text-white border-red-400" : ""}`}>
              {fmt.percent(r.risk)}
            </span>
          </button>
        ))}
      </div>

      {/* Cards da região selecionada */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Risco atual",      value: fmt.percent(regiaoData.risk),              color: `text-${{ critical: "red", alert: "yellow", normal: "green" }[regiaoData.status]}-600` },
          { label: "Status",           value: { critical: "Crítico", alert: "Alerta", normal: "Normal" }[regiaoData.status], color: `text-${{ critical: "red", alert: "yellow", normal: "green" }[regiaoData.status]}-600` },
          { label: "Crescimento",      value: `${regiaoData.growth_rate.toFixed(2)}×`,    color: "text-gray-900" },
          { label: "Boletins analisados", value: `${regiaoData.bulletins.length}`,        color: "text-gray-900" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de evolução */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Evolução Mensal — {regiao}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={v => fmt.number(v as number)} />
            <Tooltip formatter={(v: unknown) => fmt.number(Number(v))} labelFormatter={(l: unknown) => `Mês: ${l}`} />
            <Line type="monotone" dataKey="notificados" stroke="#94a3b8" strokeWidth={1.5} dot={{ r: 3 }} name="Notificados" />
            <Line type="monotone" dataKey="confirmados" stroke={CORES[regiao] || "#E53935"} strokeWidth={2.5} dot={{ r: 4 }} name="Confirmados" />
            <Line type="monotone" dataKey="alarme" stroke="#FB8C00" strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 3 }} name="Com Alarme" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela histórica */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Linha do Tempo — {regiao}</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Mês", "Notificados", "Confirmados", "Descartados", "Em Análise", "Óbitos", "Alarme", "Grave", "Variação"].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variacoes.map((b, idx) => (
              <tr key={b.month} className={`border-b border-gray-50 hover:bg-gray-50 text-sm ${idx === variacoes.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{b.month}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.notified)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.confirmed)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.discarded)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(b.underAnalysis)}</td>
                <td className="px-4 py-3 text-gray-700">{b.deaths}</td>
                <td className="px-4 py-3 text-gray-700">{b.dengueAlarmCases}</td>
                <td className="px-4 py-3 text-gray-700">{b.dengueSevereCases}</td>
                <td className="px-4 py-3">
                  {b.variacao !== null ? (
                    <span className={`text-xs font-medium ${b.variacao > 0 ? "text-red-600" : b.variacao < 0 ? "text-green-600" : "text-gray-500"}`}>
                      {b.variacao > 0 ? "+" : ""}{b.variacao.toFixed(1)}%
                    </span>
                  ) : <span className="text-gray-400 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}