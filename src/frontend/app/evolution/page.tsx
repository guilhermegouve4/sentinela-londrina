"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt, STATUS_BADGE } from "../../lib/data";
import { ResultData } from "../../types/result";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CORES: Record<string, string> = {
  Norte: "#E53935", Sul: "#1E88E5", Leste: "#43A047",
  Oeste: "#FB8C00", Central: "#8E24AA", Rural: "#6D4C41",
};

export default function Evolucao() {
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regionFiltro, setRegionFiltro] = useState<string>("todas");

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else setData(r.data);
    });
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data)  return <div className="p-8 text-gray-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-t-red-500 rounded-full animate-spin"/>Carregando...</div>;

  // Monta série temporal: todos os meses únicos ordenados
  const todosOsMeses = Array.from(new Set(
    data.regions.flatMap(r => r.bulletins.map(b => b.month))
  )).sort((a, b) => {
    const [ma, ya] = a.split("/").map(Number);
    const [mb, yb] = b.split("/").map(Number);
    return ya !== yb ? ya - yb : ma - mb;
  });

  const chartData = todosOsMeses.map(mes => {
    const ponto: Record<string, string | number> = { mes };
    data.regions.forEach(r => {
      const b = r.bulletins.find(b => b.month === mes);
      ponto[r.name] = b ? b.confirmed : 0;
    });
    return ponto;
  });

  const regioesFiltradas = regionFiltro === "todas"
    ? data.regions.map(r => r.name)
    : [regionFiltro];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Evolução Temporal</h1>
        <p className="text-sm text-gray-500 mt-1">Casos confirmados por região ao longo dos meses</p>
      </div>

      {/* Filtro de região */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-600 font-medium">Região:</span>
        {["todas", ...data.regions.map(r => r.name)].map(r => (
          <button
            key={r}
            onClick={() => setRegionFiltro(r)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              regionFiltro === r
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {r === "todas" ? "Todas" : r}
          </button>
        ))}
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Casos Confirmados por Mês</h2>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={v => fmt.number(v as number)} />
            <Tooltip formatter={(v: unknown) => fmt.number(Number(v))} labelFormatter={(l: unknown) => `Mês: ${l}`} />
            <Legend />
            {regioesFiltradas.map(nome => (
              <Line
                key={nome}
                type="monotone"
                dataKey={nome}
                stroke={CORES[nome] || "#888"}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela resumo do boletim mais recente */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Último Boletim por Região</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Região</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Mês</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Notificados</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Confirmados</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Risco</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Crescimento</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.regions.map((r, idx) => {
              const b = r.bulletins[0];
              return (
                <tr key={r.name} className={`border-b border-gray-50 hover:bg-gray-50 ${idx === data.regions.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.month}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{fmt.number(b.notified)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{fmt.number(b.confirmed)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{fmt.percent(r.risk)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.growth_rate.toFixed(2)}×</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${STATUS_BADGE[r.status]}`}>
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