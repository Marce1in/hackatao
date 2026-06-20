import mockAppData from '../data/mockAppData.json';
import type { AppData } from '../types/appData';

const MOCK_LATENCY_MS = 420;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const validateAppData = (value: AppData) => {
  if (!value.user?.name || !value.dashboard?.measurement || !Array.isArray(value.history?.groups)) {
    throw new Error('Invalid mock app data');
  }
};

export const fetchMockAppData = async (): Promise<AppData> => {
  await sleep(MOCK_LATENCY_MS);

  const data = mockAppData as AppData;
  validateAppData(data);

  return data;
};
