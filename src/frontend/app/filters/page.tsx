"use client";

import { useEffect, useState, useMemo } from "react";
import { loadResultData, fmt, STATUS_BADGE } from "../../lib/data";
import { ResultData, Region, Bulletin } from "../../types/result";
import { Search } from "lucide-react";

interface LinhaTabela {
  region: string;
  type: string;
  status: "critical" | "alert" | "normal";
  risk: number;
  growth_rate: number;
  month: string;
  notified: number;
  confirmed: number;
  discarded: number;
  underAnalysis: number;
  deaths: number;
  dengueAlarmCases: number;
  dengueSevereCases: number;
  zikaCases: number;
  chikungunyaCases: number;
}

type ColKey = keyof LinhaTabela;

// Componente Th fora do componente principal para evitar erro do ESLint
function Th({
  col, label, ordenar, ordem, onToggle,
}: {
  col: ColKey;
  label: string;
  ordenar: ColKey;
  ordem: "asc" | "desc";
  onToggle: (col: ColKey) => void;
}) {
  return (
    <th
      onClick={() => onToggle(col)}
      className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 cursor-pointer hover:text-gray-700 select-none whitespace-nowrap"
    >
      {label}{ordenar === col ? (ordem === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}

export default function Filtros() {
  const [data, setData]                   = useState<ResultData | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [busca, setBusca]                 = useState("");
  const [filtroRegiao, setFiltroRegiao]   = useState("todas");
  const [filtroStatus, setFiltroStatus]   = useState("todos");
  const [filtroMes, setFiltroMes]         = useState("todos");
  const [ordenar, setOrdenar]             = useState<ColKey>("risk");
  const [ordem, setOrdem]                 = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else setData(r.data);
    });
  }, []);

  const linhas: LinhaTabela[] = useMemo(() => {
    if (!data) return [];
    return data.regions.flatMap((r: Region) =>
      r.bulletins.map((b: Bulletin) => ({
        region: r.name, type: r.type, status: r.status,
        risk: r.risk, growth_rate: r.growth_rate,
        month: b.month, notified: b.notified, confirmed: b.confirmed,
        discarded: b.discarded, underAnalysis: b.underAnalysis,
        deaths: b.deaths, dengueAlarmCases: b.dengueAlarmCases,
        dengueSevereCases: b.dengueSevereCases,
        zikaCases: b.zikaCases, chikungunyaCases: b.chikungunyaCases,
      }))
    );
  }, [data]);

  const meses = useMemo(() =>
    Array.from(new Set(linhas.map(l => l.month))).sort((a, b) => {
      const [ma, ya] = a.split("/").map(Number);
      const [mb, yb] = b.split("/").map(Number);
      return ya !== yb ? yb - ya : mb - ma;
    }), [linhas]);

  const filtradas = useMemo(() => {
    let r = linhas;
    if (busca)                    r = r.filter(l => l.region.toLowerCase().includes(busca.toLowerCase()));
    if (filtroRegiao !== "todas") r = r.filter(l => l.region === filtroRegiao);
    if (filtroStatus !== "todos") r = r.filter(l => l.status === filtroStatus);
    if (filtroMes !== "todos")    r = r.filter(l => l.month === filtroMes);
    return [...r].sort((a, b) => {
      const va = a[ordenar];
      const vb = b[ordenar];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return ordem === "asc" ? cmp : -cmp;
    });
  }, [linhas, busca, filtroRegiao, filtroStatus, filtroMes, ordenar, ordem]);

  const toggleOrdem = (col: ColKey) => {
    if (ordenar === col) setOrdem(o => o === "asc" ? "desc" : "asc");
    else { setOrdenar(col); setOrdem("desc"); }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data) return (
    <div className="p-8 text-gray-500 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-t-red-500 rounded-full animate-spin" />
      Carregando...
    </div>
  );

  const thProps = { ordenar, ordem, onToggle: toggleOrdem };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Filtros Avançados</h1>
        <p className="text-sm text-gray-500 mt-1">Busca e filtragem por qualquer parâmetro epidemiológico</p>
      </div>

      {/* Painel de filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar região..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {[
            {
              label: "Região", value: filtroRegiao, set: setFiltroRegiao,
              opts: [["todas", "Todas as regiões"], ...data.regions.map(r => [r.name, r.name])],
            },
            {
              label: "Status", value: filtroStatus, set: setFiltroStatus,
              opts: [["todos","Todos"],["critical","Crítico"],["alert","Alerta"],["normal","Normal"]],
            },
            {
              label: "Mês", value: filtroMes, set: setFiltroMes,
              opts: [["todos", "Todos os meses"], ...meses.map(m => [m, m])],
            },
          ].map(({ label, value, set, opts }) => (
            <div key={label} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">{label}</label>
              <select
                value={value}
                onChange={e => set(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}

          <button
            onClick={() => { setBusca(""); setFiltroRegiao("todas"); setFiltroStatus("todos"); setFiltroMes("todos"); }}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            Limpar filtros
          </button>
          <span className="text-sm text-gray-500 ml-auto">
            {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <Th col="region"           label="Região"       {...thProps} />
                <Th col="month"            label="Mês"          {...thProps} />
                <Th col="notified"         label="Notificados"  {...thProps} />
                <Th col="confirmed"        label="Confirmados"  {...thProps} />
                <Th col="discarded"        label="Descartados"  {...thProps} />
                <Th col="underAnalysis"    label="Em Análise"   {...thProps} />
                <Th col="deaths"           label="Óbitos"       {...thProps} />
                <Th col="dengueAlarmCases" label="Alarme"       {...thProps} />
                <Th col="risk"             label="Risco %"      {...thProps} />
                <Th col="status"           label="Status"       {...thProps} />
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400">
                    Nenhum resultado encontrado
                  </td>
                </tr>
              ) : filtradas.map((l, idx) => (
                <tr
                  key={`${l.region}-${l.month}`}
                  className={`border-b border-gray-50 hover:bg-gray-50 text-sm ${idx === filtradas.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{l.region}</td>
                  <td className="px-4 py-3 text-gray-600">{l.month}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt.number(l.notified)}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt.number(l.confirmed)}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt.number(l.discarded)}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt.number(l.underAnalysis)}</td>
                  <td className="px-4 py-3 text-gray-700">{l.deaths}</td>
                  <td className="px-4 py-3 text-gray-700">{l.dengueAlarmCases}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{fmt.percent(l.risk)}</td>
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
    </div>
  );
}