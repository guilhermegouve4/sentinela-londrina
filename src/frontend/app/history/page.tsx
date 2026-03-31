"use client";

/**
 * Histórico por Região - Permanência em Status Epidemiológico.
 * 
 * Esta página mostra:
 * - Tempo de permanência de cada região em seu status atual
 * - Data de entrada no status atual
 * - Análise de estabilidade regional
 * - Comparação entre regiões estáveis e em mudança
 * - Interface para visualizar linha do tempo completa
 * 
 * Ajuda na avaliação da efetividade das intervenções por região.
 */

import resultData from "../../public/result.json";
import { Clock, MapPin, Calendar, History, ArrowRight } from "lucide-react";

export default function HistoricoRegiao() {
  // Extração dos dados de histórico de status das regiões do arquivo JSON
  const { status_history } = resultData;

  return (
    <div className="p-8">
      {/* Header da página com título e descrição */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Histórico por Região</h1>
        <p className="text-sm text-gray-500 mt-1">Tempo de permanência em cada nível de alerta epidemiológico</p>
      </div>

      {/* Lista de regiões com seus status históricos */}
      <div className="grid grid-cols-1 gap-6">
        {status_history.map((hist, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-8 hover:shadow-sm transition-all">
            {/* Seção de identificação da região */}
            <div className="flex items-center gap-4 w-1/4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                <MapPin size={20} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{hist.region}</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Região Administrativa</p>
              </div>
            </div>

            {/* Informações de status e tempo */}
            <div className="flex-1 flex items-center gap-12">
              {/* Status atual com indicador visual */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Atual</span>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    hist.status === 'critical' ? 'bg-red-500' : 
                    hist.status === 'alert' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    {hist.status === 'critical' ? 'Crítico' : hist.status === 'alert' ? 'Alerta' : 'Normal'}
                  </span>
                </div>
              </div>

              {/* Data de entrada no status atual */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desde</span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  {hist.since ? new Date(hist.since).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>

              {/* Tempo de permanência no status */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permanência</span>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                  <Clock size={14} />
                  {hist.days_in_status ? `${hist.days_in_status} dias` : 'Estável'}
                </div>
              </div>
            </div>

            {/* Link para visualizar linha do tempo completa */}
            <div className="flex items-center gap-2 text-blue-600 text-sm font-bold uppercase tracking-widest cursor-pointer hover:underline">
              Ver Linha do Tempo
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Resumo de Estabilidade */}
      {/* Seção de análise de estabilidade com estatísticas consolidadas */}
      <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <History size={32} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Análise de Estabilidade</h2>
            <p className="text-gray-400 text-sm mt-1">Média de permanência em status crítico: <span className="text-white font-bold">16.5 dias</span></p>
          </div>
        </div>
        {/* Estatísticas de regiões estáveis vs em mudança */}
        <div className="flex gap-4">
          <div className="text-center px-6 border-r border-white/10">
            <p className="text-2xl font-bold">2</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Regiões Estáveis</p>
          </div>
          <div className="text-center px-6">
            <p className="text-2xl font-bold text-red-400">4</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Regiões em Mudança</p>
          </div>
        </div>
      </div>
    </div>
  );
}
