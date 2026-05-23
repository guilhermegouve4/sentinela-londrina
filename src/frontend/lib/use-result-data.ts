'use client';

import { useEffect, useState } from 'react';
import { loadResultData, getWarmCache } from './data';
import type { ResultData, Summary } from '../types/result';

export function useResultData() {
  const warm = getWarmCache();
  const [data, setData] = useState<ResultData | null>(warm?.data ?? null);
  const [summary, setSummary] = useState<Summary | null>(warm?.summary ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResultData().then((r) => {
      if ('error' in r) setError(r.error);
      else {
        setData(r.data);
        setSummary(r.summary);
      }
    });
  }, []);

  const loading = !error && !data;

  return { data, summary, error, loading };
}
