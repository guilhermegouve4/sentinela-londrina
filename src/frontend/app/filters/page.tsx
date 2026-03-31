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

import { useEffect, useState, useMemo } from "react";
import { loadResultData } from "../../lib/data";
import { ResultData, Region } from "../../types/result";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Filter, Search, Calendar, MapPin, ChevronDown, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import { SummaryCard } from "../../components/SummaryCard";
import { Users, CheckCircle, AlertTriangle } from "lucide-react";

type FilterState = {
  region: string;
  periodStart: string;
  periodEnd: string;
  diseaseType: string;
  riskLevel: string;
};

export default function FiltrosAvancados() {
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    region: 'todas',
    periodStart: '',
    periodEnd: '',
    diseaseType: 'todas',
    riskLevel: 'todos'
  });

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

  // Dados filtrados
  const filteredData = useMemo(() => {
    if (!data) return null;

    let filteredRegions = [...data.regions];

    // Filtro por região
    if (filters.region !== 'todas') {
      filteredRegions = filteredRegions.filter(region =>
        region.name.toLowerCase() === filters.region.toLowerCase()
      );
    }

    // Filtro por nível de risco
    if (filters.riskLevel !== 'todos') {
      filteredRegions = filteredRegions.filter(region =>
        region.status === filters.riskLevel
      );
    }

    // Calcular totais dos dados filtrados
    const filteredSummary = {
      total_notified: filteredRegions.reduce((sum, region) => sum + region.notified, 0),
      total_confirmed: filteredRegions.reduce((sum, region) => sum + region.confirmed, 0),
      total_deaths: filteredRegions.reduce((sum, region) => sum + region.deaths, 0),
      critical_regions: filteredRegions.filter(r => r.status === 'critical').length,
      alert_regions: filteredRegions.filter(r => r.status === 'alert').length,
      normal_regions: filteredRegions.filter(r => r.status === 'normal').length
    };

    return {
      regions: filteredRegions,
      summary: filteredSummary
    };
  }, [data, filters]);

  const handleFilter = () => {
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 800);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!data || !filteredData) return <ErrorMessage message="Dados não disponíveis" />;

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
                  <select
                    value={filters.region}
                    onChange={(e) => updateFilter('region', e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  >
                    <option value="todas">Todas as Regiões</option>
                    <option value="norte">Norte</option>
                    <option value="sul">Sul</option>
                    <option value="leste">Leste</option>
                    <option value="oeste">Oeste</option>
                    <option value="central">Central</option>
                    <option value="rural">Rural</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Filtro de Nível de Risco */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <AlertTriangle size={12} /> Nível de Risco
                </label>
                <div className="relative">
                  <select
                    value={filters.riskLevel}
                    onChange={(e) => updateFilter('riskLevel', e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  >
                    <option value="todos">Todos os Níveis</option>
                    <option value="critical">Crítico</option>
                    <option value="alert">Alerta</option>
                    <option value="normal">Normal</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Botão Aplicar Filtros */}
              <button
                onClick={handleFilter}
                disabled={isFiltering}
                className="w-full bg-red-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isFiltering ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Aplicar Filtros
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Área de Resultados */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cards de Resumo Filtrados */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Notificados"
              value={filteredData.summary.total_notified.toString()}
              icon={Users}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <SummaryCard
              title="Confirmados"
              value={filteredData.summary.total_confirmed.toString()}
              icon={CheckCircle}
              color="text-red-600"
              bgColor="bg-red-50"
            />
            <SummaryCard
              title="Críticos"
              value={filteredData.summary.critical_regions.toString()}
              icon={AlertTriangle}
              color="text-red-600"
              bgColor="bg-red-50"
            />
            <SummaryCard
              title="Normais"
              value={filteredData.summary.normal_regions.toString()}
              icon={TrendingUp}
              color="text-green-600"
              bgColor="bg-green-50"
            />
          </div>

          {/* Tabela de Resultados Filtrados */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 size={16} className="text-red-600" />
                Resultados Filtrados ({filteredData.regions.length} regiões)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Região</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Tipo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Confirmados</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">LIRAa %</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.regions.map((region, idx) => (
                    <tr
                      key={region.name}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        idx === filteredData.regions.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{region.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{region.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{region.confirmed.toLocaleString("pt-BR")}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{region.risk.toFixed(1)}%</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                          region.status === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                          region.status === 'alert' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {region.status === 'critical' ? 'Crítico' :
                           region.status === 'alert' ? 'Alerta' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.regions.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 mb-2">📊</div>
                <p className="text-sm text-gray-500">Nenhum resultado encontrado com os filtros aplicados.</p>
                <p className="text-xs text-gray-400 mt-1">Tente ajustar os parâmetros de busca.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
