"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt, STATUS_BADGE } from "../../lib/data";
import { ResultData } from "../../types/result";

export default function Boletins() {
  const [data, setData]             = useState<ResultData | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [filtroRegiao, setFiltroRegiao] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else setData(r.data);
    });
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data)  return <div className="p-8 text-gray-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-t-red-500 rounded-full animate-spin"/>Carregando...</div>;

  // Gera linhas planas de todos os boletins de todas as regiões
  const linhas = data.regions.flatMap(r =>
    r.bulletins.map(b => ({ ...b, region: r.name, status: r.status, risk: r.risk, type: r.type }))
  ).sort((a, b) => {
    const [ma, ya] = a.month.split("/").map(Number);
    const [mb, yb] = b.month.split("/").map(Number);
    return ya !== yb ? yb - ya : mb - ma;
  });

  const filtradas = linhas.filter(l => {
    if (filtroRegiao !== "todas" && l.region !== filtroRegiao) return false;
    if (filtroStatus !== "todos" && l.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Boletins Mensais</h1>
        <p className="text-sm text-gray-500 mt-1">{linhas.length} registros de {data.regions.length} regiões</p>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-6 mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600">Região</label>
          <select
            value={filtroRegiao}
            onChange={e => setFiltroRegiao(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="todas">Todas</option>
            {data.regions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600">Status</label>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="todos">Todos</option>
            <option value="critical">Crítico</option>
            <option value="alert">Alerta</option>
            <option value="normal">Normal</option>
          </select>
        </div>
        <span className="text-sm text-gray-500 ml-auto">{filtradas.length} registros</span>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Mês", "Região", "Notificados", "Confirmados", "Descartados", "Em Análise", "Óbitos", "Alarme", "Grave", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((l, idx) => (
              <tr key={`${l.region}-${l.month}`} className={`border-b border-gray-50 hover:bg-gray-50 text-sm ${idx === filtradas.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{l.month}</td>
                <td className="px-4 py-3 text-gray-700">{l.region}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(l.notified)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(l.confirmed)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(l.discarded)}</td>
                <td className="px-4 py-3 text-gray-700">{fmt.number(l.underAnalysis)}</td>
                <td className="px-4 py-3 text-gray-700">{l.deaths}</td>
                <td className="px-4 py-3 text-gray-700">{l.dengueAlarmCases}</td>
                <td className="px-4 py-3 text-gray-700">{l.dengueSevereCases}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_BADGE[l.status]}`}>
                    {{ critical: "Crítico", alert: "Alerta", normal: "Normal" }[l.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
