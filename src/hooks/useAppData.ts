import { useCallback, useEffect, useState } from 'react';

import { fetchMockAppData } from '../api/mockAppApi';
import type { AppData } from '../types/appData';

export const useAppData = () => {
  const [data, setData] = useState<AppData | null>(null);
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
      setData(await fetchMockAppData());
      setError(null);
    } catch {
      setError('Nao foi possivel carregar o JSON mock.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    error,
    loading,
    refreshing,
    reload: () => load(true),
  };
};
