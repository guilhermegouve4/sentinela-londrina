"use client";

/**
 * Filtros Avançados - Busca Específica por Parâmetros.
 * 
 * Esta página oferece controles para refinar dados epidemiológicos:
 * - Filtro por região administrativa
 * - Seleção de período (datas de início e fim)
 * - Filtro por tipo de arbovirose (Dengue, Zika, Chikungunya)
 * - Interface interativa para aplicação de filtros
 * - Área de resultados (atualmente placeholder para futura implementação)
 * 
 * Permite análises detalhadas e segmentadas dos dados.
 */

"use client";

import { useEffect, useState } from "react";
import { loadResultData } from "../../lib/data";
import { ResultData } from "../../types/result";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Filter, Search, Calendar, MapPin, ChevronDown, RefreshCw } from "lucide-react";

export default function FiltrosAvancados() {
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

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

  const handleFilter = () => {
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 800);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Filtros Avançados</h1>
        <p className="text-sm text-gray-500 mt-1">Refine a busca por dados epidemiológicos específicos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Painel de Filtros */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter size={16} className="text-red-600" />
              Parâmetros
            </h3>

            <div className="space-y-6">
              {/* Filtro de Região */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <MapPin size={12} /> Região
                </label>
                <div className="relative">
                  <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                    <option>Todas as Regiões</option>
                    <option>Norte</option>
                    <option>Sul</option>
                    <option>Leste</option>
                    <option>Oeste</option>
                    <option>Central</option>
                    <option>Rural</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Filtro de Período */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <Calendar size={12} /> Período
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Início" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
                  <input type="text" placeholder="Fim" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
                </div>
              </div>

              {/* Filtro de Tipo de Caso */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Arbovirose</label>
                <div className="space-y-2">
                  {['Dengue', 'Zika', 'Chikungunya'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleFilter}
                disabled={isFiltering}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isFiltering ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                {isFiltering ? "Filtrando..." : "Aplicar Filtros"}
              </button>
            </div>
          </div>
        </div>

        {/* Resultados Filtrados (Placeholder) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Resultados da Busca</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              Utilize os filtros ao lado para refinar os dados epidemiológicos e visualizar resultados específicos por região, período ou tipo de caso.
            </p>
            <div className="mt-8 flex gap-3">
              <div className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-100">Aguardando Filtros</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
