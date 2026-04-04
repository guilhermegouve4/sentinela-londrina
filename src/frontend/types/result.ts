// types/result.ts
// Schema real do result.json gerado pelo backend C++

export interface Bulletin {
  month: string;
  notified: number;
  confirmed: number;
  discarded: number;
  underAnalysis: number;
  dengueCases: number;
  dengueAlarmCases: number;
  dengueSevereCases: number;
  zikaCases: number;
  chikungunyaCases: number;
  deaths: number;
}

export interface Region {
  name: string;
  type: 'urban' | 'rural';
  risk: number;
  status: 'critical' | 'alert' | 'normal';
  growth_rate: number;
  bulletins: Bulletin[];
}

export interface HighestRisk {
  region: string;
  risk: number;
}

// Schema real gerado pelo C++
export interface ResultData {
  highest_risk: HighestRisk;
  regions: Region[];
}

// Summary calculado no frontend a partir dos dados reais
export interface Summary {
  total_notified: number;
  total_confirmed: number;
  total_discarded: number;
  total_under_analysis: number;
  total_deaths: number;
  total_dengue_alarm: number;
  total_dengue_severe: number;
  critical_regions: number;
  alert_regions: number;
  normal_regions: number;
  highest_risk_region: string;
  highest_risk_value: number;
}

export type Status = 'critical' | 'alert' | 'normal';
