// lib/data.ts - Camada de dados centralizada para o frontend
// Responsável por carregar, validar e normalizar o result.json

import { ResultData, DataState } from '../types/result';

// Cache para evitar múltiplas leituras do arquivo
let dataCache: ResultData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 segundos

/**
 * Carrega os dados do result.json com cache e tratamento de erros
 */
export async function loadResultData(): Promise<DataState> {
  try {
    // Verifica se temos dados em cache válidos
    const now = Date.now();
    if (dataCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return {
        data: dataCache,
        state: 'success',
        error: null
      };
    }

    // Carrega o arquivo JSON
    const response = await fetch('/result.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();

    // Valida e normaliza os dados
    const validatedData = validateAndNormalizeData(rawData);

    // Atualiza o cache
    dataCache = validatedData;
    cacheTimestamp = now;

    return {
      data: validatedData,
      state: 'success',
      error: null
    };

  } catch (error) {
    console.error('Erro ao carregar dados:', error);

    return {
      data: null,
      state: 'error',
      error: error instanceof Error ? error.message : 'Erro desconhecido ao carregar dados'
    };
  }
}

// Tipo para dados brutos do JSON
type RawResultData = Record<string, unknown>;

/**
 * Valida e normaliza os dados do JSON
 */
function validateAndNormalizeData(rawData: unknown): ResultData {
  // Validações básicas
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Dados inválidos: esperado objeto JSON');
  }

  const data = rawData as RawResultData;

  if (!data.meta || !data.summary || !data.regions) {
    throw new Error('Schema incompleto: faltam campos obrigatórios (meta, summary, regions)');
  }

  // Normalizações específicas
  const normalizedData: ResultData = {
    ...data,
    // Garante que arrays existam mesmo se vazios
    regions: Array.isArray(data.regions) ? data.regions : [],
    monthly_series: Array.isArray(data.monthly_series) ? data.monthly_series : [],
    alerts: Array.isArray(data.alerts) ? data.alerts : [],
    ubs_hierarchy: Array.isArray(data.ubs_hierarchy) ? data.ubs_hierarchy : [],
    status_history: Array.isArray(data.status_history) ? data.status_history : [],
  } as ResultData;

  return normalizedData;
}

/**
 * Hook personalizado para usar os dados (pode ser usado com React Query, SWR, etc.)
 */
export function useResultData() {
  return loadResultData();
}

export function getDataValue<T>(
  data: ResultData | null,
  path: string,
  defaultValue: T
): T {
  if (!data) return defaultValue;

  const keys = path.split('.');
  let current: unknown = data;

  for (const key of keys) {
    if (current && typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }

  return (current as T) ?? defaultValue;
}

/**
 * Formata números para exibição em português brasileiro
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('pt-BR');
}

/**
 * Formata percentual
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formata data para exibição
 */
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
}

/**
 * Formata data e hora para exibição
 */
export function formatDateTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('pt-BR');
  } catch {
    return dateString;
  }
}

/**
 * Calcula variação percentual entre dois valores
 */
export function calculateVariation(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Obtém a cor baseada no status
 */
export function getStatusColor(status: 'critical' | 'alert' | 'normal'): string {
  switch (status) {
    case 'critical': return 'text-red-600';
    case 'alert': return 'text-yellow-600';
    case 'normal': return 'text-green-600';
    default: return 'text-gray-600';
  }
}

/**
 * Obtém o estilo de fundo baseado no status
 */
export function getStatusBgColor(status: 'critical' | 'alert' | 'normal'): string {
  switch (status) {
    case 'critical': return 'bg-red-50 border-red-200';
    case 'alert': return 'bg-yellow-50 border-yellow-200';
    case 'normal': return 'bg-green-50 border-green-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}