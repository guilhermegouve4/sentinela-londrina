"use client";

/**
 * Relatório Situacional - Documento Oficial Consolidado.
 * 
 * Esta página gera um relatório completo contendo:
 * - Resumo executivo com métricas principais
 * - Análise detalhada por região administrativa
 * - Recomendações técnicas baseadas nos dados
 * - Opções de exportação (impressão, PDF)
 * - Formatação profissional para distribuição
 * 
 * Documento oficial para tomada de decisões e comunicação institucional.
 */

"use client";

import { useEffect, useState } from "react";
import { loadResultData } from "../../lib/data";
import { ResultData } from "../../types/result";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { ClipboardList, FileText, Printer, Share2, CheckCircle, AlertTriangle, MapPin } from "lucide-react";

export default function RelatorioSituacional() {
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

  const { summary, regions, meta } = data;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header do Relatório */}
      <div className="mb-10 flex items-center justify-between border-b border-gray-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
            <ClipboardList size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatório Situacional</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <MapPin size={14} /> {meta.municipality} — Boletim Epidemiológico Atualizado
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <Printer size={16} /> Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-md shadow-red-100">
            <Share2 size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Conteúdo do Relatório */}
      <div className="space-y-10">
        {/* Resumo Executivo */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-red-600 rounded-full" />
            Resumo Executivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Notificações Totais</p>
              <p className="text-3xl font-bold text-gray-900">{summary.total_notified.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500 mt-2">Acumulado no período de {meta.period.week_start} a {meta.period.week_end}</p>
            </div>
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-xs font-bold text-red-400 uppercase mb-2">Casos Confirmados</p>
              <p className="text-3xl font-bold text-red-700">{summary.total_confirmed.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-red-600 mt-2">Taxa de positividade: <span className="font-bold">{((summary.total_confirmed / summary.total_notified) * 100).toFixed(1)}%</span></p>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-blue-400 uppercase mb-2">Em Análise</p>
              <p className="text-3xl font-bold text-blue-700">{summary.total_under_analysis.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-blue-600 mt-2">Aguardando resultado laboratorial</p>
            </div>
          </div>
        </section>

        {/* Análise por Região */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-red-600 rounded-full" />
            Análise por Região
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Região</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Confirmados</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">LIRAa %</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regions.map((reg, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{reg.name}</td>
                    <td className="px-6 py-4 text-gray-600">{reg.confirmed}</td>
                    <td className="px-6 py-4 text-gray-600">{reg.risk.toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {reg.status === 'critical' ? (
                          <AlertTriangle size={16} className="text-red-600" />
                        ) : (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                        <span className={`text-xs font-bold uppercase ${reg.status === 'critical' ? 'text-red-600' : 'text-green-600'}`}>
                          {reg.status === 'critical' ? 'Crítico' : 'Normal'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recomendações */}
        <section className="bg-gray-900 rounded-3xl p-10 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <FileText size={24} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Recomendações Técnicas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Ações Imediatas</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  Intensificar o bloqueio de transmissão nas regiões Norte e Sul.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  Realizar varredura de focos em terrenos baldios e ferros-velhos.
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Vigilância</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                  Monitorar diariamente a entrada de novos casos suspeitos nas UBS.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                  Atualizar o sistema Sentinela a cada novo boletim oficial.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Footer do Relatório */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
          Gerado automaticamente pelo Sistema Sentinela Londrina em {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
