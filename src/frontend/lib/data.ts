// lib/data.ts
// Camada de dados — carrega result.json e calcula summary

import { ResultData, Summary, Region, Bulletin } from '../types/result';

let cache: ResultData | null = null;
let cacheTime = 0;
const CACHE_MS = 30000;

export async function loadResultData(): Promise<{ data: ResultData; summary: Summary } | { error: string }> {
  try {
    const now = Date.now();
    if (cache && now - cacheTime < CACHE_MS) {
      return { data: cache, summary: calcSummary(cache) };
    }

    const res = await fetch('/result.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.json() as ResultData;

    if (!raw.regions || !Array.isArray(raw.regions)) {
      throw new Error('result.json inválido: campo regions ausente');
    }

    cache = raw;
    cacheTime = now;
    return { data: raw, summary: calcSummary(raw) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro desconhecido' };
  }
}

// Calcula summary a partir do boletim mais recente de cada região
export function calcSummary(data: ResultData): Summary {
  const regions = data.regions;
  const latest = (r: Region): Bulletin => r.bulletins[0];

  return {
    total_notified:      regions.reduce((s, r) => s + latest(r).notified, 0),
    total_confirmed:     regions.reduce((s, r) => s + latest(r).confirmed, 0),
    total_discarded:     regions.reduce((s, r) => s + latest(r).discarded, 0),
    total_under_analysis:regions.reduce((s, r) => s + latest(r).underAnalysis, 0),
    total_deaths:        regions.reduce((s, r) => s + latest(r).deaths, 0),
    total_dengue_alarm:  regions.reduce((s, r) => s + latest(r).dengueAlarmCases, 0),
    total_dengue_severe: regions.reduce((s, r) => s + latest(r).dengueSevereCases, 0),
    critical_regions:    regions.filter(r => r.status === 'critical').length,
    alert_regions:       regions.filter(r => r.status === 'alert').length,
    normal_regions:      regions.filter(r => r.status === 'normal').length,
    highest_risk_region: data.highest_risk.region,
    highest_risk_value:  data.highest_risk.risk,
  };
}

// Utilitários de formatação
export const fmt = {
  number: (n: number) => n.toLocaleString('pt-BR'),
  percent: (n: number, dec = 1) => `${n.toFixed(dec)}%`,
  date: (s: string) => { try { return new Date(s).toLocaleDateString('pt-BR'); } catch { return s; } },
};

export const STATUS_LABEL = { critical: 'Crítico', alert: 'Alerta', normal: 'Normal' } as const;
export const STATUS_COLOR = { critical: 'text-red-600', alert: 'text-yellow-600', normal: 'text-green-600' } as const;
export const STATUS_BG    = { critical: 'bg-red-50 border-red-200', alert: 'bg-yellow-50 border-yellow-200', normal: 'bg-green-50 border-green-200' } as const;
export const STATUS_BADGE = {
  critical: 'bg-red-100 text-red-700 border border-red-200',
  alert:    'bg-yellow-100 text-yellow-700 border border-yellow-200',
  normal:   'bg-green-100 text-green-700 border border-green-200',
} as const;
export const BAR_COLOR = { critical: 'bg-red-500', alert: 'bg-yellow-500', normal: 'bg-green-500' } as const;
