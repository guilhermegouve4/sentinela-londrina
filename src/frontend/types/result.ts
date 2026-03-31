// types/result.ts - Interfaces TypeScript para o schema do result.json
// Gerado automaticamente pelo backend C++ e consumido pelo frontend Next.js

export interface Meta {
  generated_at: string;
  source_file: string;
  period: {
    month: string;
    year: number;
  };
  municipality: string;
  population: number;
}

export interface Summary {
  total_notified: number;
  total_confirmed: number;
  total_discarded: number;
  total_under_analysis: number;
  total_deaths: number;
  total_zika: number;
  total_chikungunya: number;
  critical_regions: number;
  alert_regions: number;
  normal_regions: number;
}

export interface Region {
  name: string;
  type: 'urban' | 'rural';
  confirmed: number;
  notified: number;
  discarded: number;
  under_analysis: number;
  dengue_cases: number;
  dengue_alarm_cases: number;
  dengue_severe_cases: number;
  zika_cases: number;
  chikungunya_cases: number;
  deaths: number;
  risk: number;
  status: 'critical' | 'alert' | 'normal';
  progress_pct: number;
}

export interface MonthlySeriesItem {
  month: string;
  year: number;
  date_range: string;
  total_confirmed: number;
  total_notified: number;
  total_deaths: number;
  by_region: Array<{
    region: string;
    confirmed: number;
    notified: number;
    risk: number;
    status: 'critical' | 'alert' | 'normal';
  }>;
}

export interface Alert {
  region: string;
  level: 'critical' | 'alert' | 'info';
  message: string;
  triggered_at: string;
}

export interface HierarchyNode {
  name: string;
  type: 'sede' | 'region' | 'ubs' | 'bairro';
  confirmed?: number;
  status?: 'critical' | 'alert' | 'normal';
  children?: HierarchyNode[];
}

export interface StatusHistoryItem {
  region: string;
  status: 'critical' | 'alert' | 'normal';
  since: string | null;
  days_in_status: number | null;
}

// Interface principal do resultado
export interface ResultData {
  _comentario?: string;
  _versao?: string;
  _gerado_em?: string;
  meta: Meta;
  summary: Summary;
  regions: Region[];
  monthly_series: MonthlySeriesItem[];
  alerts: Alert[];
  ubs_hierarchy: HierarchyNode[];
  status_history: StatusHistoryItem[];
}

// Tipos para estados de carregamento
export type DataLoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface DataState {
  data: ResultData | null;
  state: DataLoadingState;
  error: string | null;
}