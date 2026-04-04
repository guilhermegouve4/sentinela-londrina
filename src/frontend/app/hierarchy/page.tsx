"use client";

import { useEffect, useState } from "react";
import { loadResultData, fmt, STATUS_BADGE } from "../../lib/data";
import { ResultData } from "../../types/result";
import { ChevronRight, ChevronDown, Building2, MapPin, Activity } from "lucide-react";

// Hierarquia estática baseada na estrutura real das regiões de Londrina
const HIERARQUIA: Record<string, string[]> = {
  Norte:   ["UBS Ernani","UBS João Paz","UBS União da Vitória","UBS Vivi Xavier","UBS Warta"],
  Sul:     ["UBS Cafezal","UBS Cinco Conjuntos","UBS Jardim do Sol","UBS Leonor","UBS Portal do Sol"],
  Leste:   ["UBS Bandeirantes","UBS Heimtal","UBS Maravilha","UBS Santiago","UBS São Luiz"],
  Oeste:   ["UBS Antares","UBS Aquiles","UBS Cláudia","UBS Hermann","UBS Panorama"],
  Central: ["UBS Centro","UBS Boa Vista","UBS Piza","UBS Shangri-lá"],
  Rural:   ["UBS Dist. Lerroville","UBS Dist. Maravilha","UBS Dist. Warta"],
};

export default function Hierarquia() {
  const [data, setData]       = useState<ResultData | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [abertos, setAbertos] = useState<Set<string>>(new Set(["Norte"]));
  const [selecionada, setSelecionada] = useState<string | null>(null);

  useEffect(() => {
    loadResultData().then(r => {
      if ("error" in r) setError(r.error);
      else setData(r.data);
    });
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data)  return <div className="p-8 text-gray-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-t-red-500 rounded-full animate-spin"/>Carregando...</div>;

  const toggle = (nome: string) => {
    setAbertos(prev => {
      const next = new Set(prev);
      if (next.has(nome)) next.delete(nome); else next.add(nome);
      return next;
    });
  };

  const regiaoSelecionada = selecionada
    ? data.regions.find(r => r.name === selecionada)
    : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Hierarquia UBS</h1>
        <p className="text-sm text-gray-500 mt-1">Estrutura organizacional das Unidades Básicas de Saúde por região</p>
      </div>

      <div className="flex gap-6">
        {/* Árvore */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Secretaria Municipal de Saúde</p>
            </div>
            <div className="p-2">
              {[...data.regions].sort((a, b) => b.risk - a.risk).map(r => {
                const ubs = HIERARQUIA[r.name] || [];
                const open = abertos.has(r.name);
                return (
                  <div key={r.name}>
                    <button
                      onClick={() => { toggle(r.name); setSelecionada(r.name); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                        selecionada === r.name ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {open ? <ChevronDown size={14} className="flex-shrink-0" /> : <ChevronRight size={14} className="flex-shrink-0" />}
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="font-medium flex-1">{r.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_BADGE[r.status]}`}>
                        {{ critical: "Crítico", alert: "Alerta", normal: "Normal" }[r.status]}
                      </span>
                    </button>
                    {open && (
                      <div className="ml-6 mb-1">
                        {ubs.map(u => (
                          <div key={u} className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">
                            <Building2 size={12} className="flex-shrink-0" />
                            {u}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Painel de detalhes */}
        <div className="flex-1">
          {regiaoSelecionada ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${{
                    critical: "bg-red-100", alert: "bg-yellow-100", normal: "bg-green-100"
                  }[regiaoSelecionada.status]}`}>
                    <Activity size={20} className={`${{ critical: "text-red-600", alert: "text-yellow-600", normal: "text-green-600" }[regiaoSelecionada.status]}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Região {regiaoSelecionada.name}</h2>
                    <p className="text-sm text-gray-500">{regiaoSelecionada.type === "urban" ? "Área Urbana" : "Área Rural"}</p>
                  </div>
                  <span className={`ml-auto text-sm font-medium px-3 py-1 rounded-lg ${STATUS_BADGE[regiaoSelecionada.status]}`}>
                    {{ critical: "Crítico", alert: "Alerta", normal: "Normal" }[regiaoSelecionada.status]}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Índice de Risco",  value: fmt.percent(regiaoSelecionada.risk) },
                    { label: "Taxa de Crescimento", value: `${regiaoSelecionada.growth_rate.toFixed(2)}×` },
                    { label: "UBS vinculadas",   value: `${(HIERARQUIA[regiaoSelecionada.name] || []).length}` },
                    { label: "Notificados",      value: fmt.number(regiaoSelecionada.bulletins[0].notified) },
                    { label: "Confirmados",      value: fmt.number(regiaoSelecionada.bulletins[0].confirmed) },
                    { label: "Óbitos",           value: `${regiaoSelecionada.bulletins[0].deaths}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-lg font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* UBS da região */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">Unidades Básicas de Saúde — {regiaoSelecionada.name}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {(HIERARQUIA[regiaoSelecionada.name] || []).map(ubs => (
                    <div key={ubs} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                      <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{ubs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <MapPin size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Selecione uma região na árvore para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}