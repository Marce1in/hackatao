import type { AlertItem, GlucoseReading, HealthSnapshot, RiskLevel, TrendDirection } from '../types/health';

const MOCK_LATENCY_MS = 420;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRiskFromGlucose = (value: number): RiskLevel => {
  if (value < 70 || value > 180) {
    return 'critical';
  }

  if (value < 85 || value > 150) {
    return 'attention';
  }

  return 'normal';
};

const getTrend = (delta: number): TrendDirection => {
  if (delta >= 8) {
    return 'rising';
  }

  if (delta <= -8) {
    return 'falling';
  }

  return 'stable';
};

const buildAlerts = (glucose: GlucoseReading): AlertItem[] => {
  if (glucose.risk === 'critical') {
    return [
      {
        id: 'glucose-critical',
        title: glucose.value < 70 ? 'Glicose baixa' : 'Glicose alta',
        detail: 'Confirmar leitura no app oficial antes de qualquer decisao.',
        risk: 'critical',
      },
    ];
  }

  if (glucose.risk === 'attention') {
    return [
      {
        id: 'glucose-attention',
        title: 'Fora do alvo ideal',
        detail: 'Acompanhar tendencia nos proximos minutos.',
        risk: 'attention',
      },
    ];
  }

  return [
    {
      id: 'glucose-normal',
      title: 'Faixa estavel',
      detail: 'Leitura mock dentro do intervalo esperado.',
      risk: 'normal',
    },
  ];
};

export const fetchHealthSnapshot = async (): Promise<HealthSnapshot> => {
  await sleep(MOCK_LATENCY_MS);

  const now = new Date();
  const minuteWave = Math.sin(now.getMinutes() / 8);
  const secondWave = Math.cos(now.getSeconds() / 10);
  const glucoseValue = Math.round(112 + minuteWave * 42 + secondWave * 11);
  const previousValue = Math.round(112 + Math.sin((now.getMinutes() - 5) / 8) * 42);
  const glucoseDelta = glucoseValue - previousValue;
  const glucoseRisk = getRiskFromGlucose(glucoseValue);

  const glucose: GlucoseReading = {
    value: glucoseValue,
    unit: 'mg/dL',
    trend: getTrend(glucoseDelta),
    delta: glucoseDelta,
    sampledAt: now.toISOString(),
    risk: glucoseRisk,
  };

  return {
    patient: {
      id: 'patient-demo-01',
      displayName: 'Paciente demo',
    },
    glucose,
    vitals: {
      heartRate: {
        label: 'Batimentos',
        value: Math.round(74 + Math.abs(secondWave) * 18),
        unit: 'bpm',
        risk: 'normal',
      },
      oxygen: {
        label: 'Oxigenacao',
        value: Math.round(97 - Math.max(0, -secondWave)),
        unit: '%',
        risk: 'normal',
      },
      hrv: {
        label: 'HRV',
        value: Math.round(48 + minuteWave * 8),
        unit: 'ms',
        risk: minuteWave < -0.6 ? 'attention' : 'normal',
      },
    },
    device: {
      name: 'Libre + smartwatch mock',
      battery: Math.round(82 - Math.abs(minuteWave) * 14),
      connected: true,
      lastSyncAt: now.toISOString(),
    },
    alerts: buildAlerts(glucose),
  };
};
