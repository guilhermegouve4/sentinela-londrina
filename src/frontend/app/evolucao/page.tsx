"use client";

import resultData from "../../public/result.json";
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function EvolucaoTemporal() {
  const { weekly_series } = resultData;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Evolução Temporal</h1>
        <p className="text-sm text-gray-500 mt-1">Análise do crescimento de casos por semana epidemiológica</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Gráfico Simulado / Tabela de Evolução */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Série Semanal de Casos
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {weekly_series.map((week, idx) => {
                const prevWeek = idx > 0 ? weekly_series[idx - 1] : null;
                const diff = prevWeek ? week.total_confirmed - prevWeek.total_confirmed : 0;
                const isUp = diff > 0;

                return (
                  <div key={week.week} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                          <Calendar size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Semana {week.week}</p>
                          <p className="text-xs text-gray-500">{week.date_range}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{week.total_confirmed} casos</p>
                        {prevWeek && (
                          <p className={`text-xs font-medium flex items-center justify-end gap-1 ${isUp ? 'text-red-600' : 'text-green-600'}`}>
                            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(diff)} em relação à anterior
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Barra de Progresso Visual */}
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      {week.by_region.map((reg, rIdx) => (
                        <div 
                          key={reg.region}
                          className={`h-full transition-all duration-500 ${
                            reg.status === 'critical' ? 'bg-red-500' : 
                            reg.status === 'alert' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${(reg.confirmed / week.total_confirmed) * 100}%`,
                            opacity: 1 - (rIdx * 0.1)
                          }}
                          title={`${reg.region}: ${reg.confirmed} casos`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Distribuição por Região</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{week.total_notified} Notificações</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legenda e Insights */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-blue-700 uppercase mb-1">Pico de Casos</p>
            <p className="text-xl font-semibold text-blue-900">Semana 12</p>
            <p className="text-xs text-blue-600 mt-1">Maior volume registrado no ano</p>
          </div>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-red-700 uppercase mb-1">Tendência</p>
            <p className="text-xl font-semibold text-red-900">Alta Acentuada</p>
            <p className="text-xs text-red-600 mt-1">+15% de crescimento médio</p>
          </div>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-green-700 uppercase mb-1">Recuperação</p>
            <p className="text-xl font-semibold text-green-900">Distrito Rural</p>
            <p className="text-xs text-green-600 mt-1">Estabilidade nas últimas 4 semanas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
