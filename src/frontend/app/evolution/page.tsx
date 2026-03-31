"use client";

/**
 * Evolução Temporal - Análise de Tendências Mensais.
 *
 * Esta página apresenta:
 * - Série histórica mensal de casos confirmados
 * - Comparação com meses anteriores (diferenças positivas/negativas)
 * - Distribuição visual por região em cada mês
 * - Insights sobre picos, tendências e recuperações
 * - Barras de progresso mostrando distribuição regional
 *
 * Ajuda na identificação de padrões sazonais e tendências de crescimento.
 */

import { useEffect, useState } from "react";
import { loadResultData } from "../../lib/data";
import { ResultData } from "../../types/result";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EvolucaoTemporal() {
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

  const { monthly_series } = data;

  // Dados para o gráfico de linha (casos confirmados ao longo do tempo)
  const lineChartData = {
    labels: monthly_series.map(month => month.month),
    datasets: [
      {
        label: 'Casos Confirmados',
        data: monthly_series.map(month => month.total_confirmed),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Notificações',
        data: monthly_series.map(month => month.total_notified),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução Mensal de Casos - 2026',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  // Dados para o gráfico de barras (comparação por região no último mês)
  const lastMonth = monthly_series[monthly_series.length - 1];
  const barChartData = {
    labels: lastMonth.by_region.map(region => region.region),
    datasets: [
      {
        label: 'Casos Confirmados',
        data: lastMonth.by_region.map(region => region.confirmed),
        backgroundColor: lastMonth.by_region.map(region =>
          region.status === 'critical' ? 'rgba(239, 68, 68, 0.8)' :
          region.status === 'alert' ? 'rgba(245, 158, 11, 0.8)' :
          'rgba(34, 197, 94, 0.8)'
        ),
        borderColor: lastMonth.by_region.map(region =>
          region.status === 'critical' ? 'rgb(239, 68, 68)' :
          region.status === 'alert' ? 'rgb(245, 158, 11)' :
          'rgb(34, 197, 94)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Distribuição por Região - ${lastMonth.month}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Evolução Temporal</h1>
        <p className="text-sm text-gray-500 mt-1">Análise do crescimento de casos por mês epidemiológico</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Gráfico de Linha - Evolução Temporal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-red-600" />
              Tendência Mensal de Casos
            </h2>
            <p className="text-sm text-gray-500 mt-1">Evolução dos casos confirmados e notificações ao longo de 2026</p>
          </div>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Gráfico de Barras - Distribuição Regional */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Distribuição Regional
            </h2>
            <p className="text-sm text-gray-500 mt-1">Casos confirmados por região no mês mais recente</p>
          </div>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Estatísticas Mensais Detalhadas */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-green-600" />
              Estatísticas Mensais Detalhadas
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {monthly_series.map((month, idx) => {
                const prevMonth = idx > 0 ? monthly_series[idx - 1] : null;
                const diff = prevMonth ? month.total_confirmed - prevMonth.total_confirmed : 0;
                const isUp = diff > 0;

                return (
                  <div key={month.month} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{month.month}</span>
                      </div>
                      {prevMonth && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          isUp ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(diff)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Confirmados:</span>
                        <span className="font-semibold text-red-600">{month.total_confirmed.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Notificações:</span>
                        <span className="font-semibold text-blue-600">{month.total_notified.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Óbitos:</span>
                        <span className="font-semibold text-gray-900">{month.total_deaths}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
