import { useCallback, useEffect, useState } from 'react';

import { fetchHealthSnapshot } from '../api/mockHealthApi';
import type { HealthSnapshot } from '../types/health';

const REFRESH_INTERVAL_MS = 15_000;

export const useHealthSnapshot = () => {
  const [data, setData] = useState<HealthSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const snapshot = await fetchHealthSnapshot();
      setData(snapshot);
      setError(null);
    } catch {
      setError('Mock API indisponivel');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = setInterval(() => {
      void load(true);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [load]);

  return {
    data,
    error,
    loading,
    refreshing,
    reload: () => load(true),
  };
};
